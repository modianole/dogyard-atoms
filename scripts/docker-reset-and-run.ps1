param(
    [string]$ProjectRoot = "C:\Users\user\StudioProjects\dogyard-atoms",
    [string[]]$Services = @("app", "app-2"),
    [string]$ImageName = "dogyard-atoms:local",
    [int]$HealthTimeoutSeconds = 120,
    [switch]$SkipBuild,
    [switch]$Watch
)

$ErrorActionPreference = "Stop"

# In PowerShell 7+, keep stderr warnings from native tools as non-terminating.
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

function Wait-ContainerReady {
    param(
        [string]$ContainerId,
        [int]$TimeoutSeconds
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        $state = docker inspect $ContainerId | ConvertFrom-Json
        $status = $state[0].State.Status
        $health = $null
        if ($null -ne $state[0].State.Health) {
            $health = $state[0].State.Health.Status
        }

        if ($status -ne "running") {
            throw "Container stopped unexpectedly. Status: $status"
        }

        if ([string]::IsNullOrWhiteSpace($health)) {
            return $true
        }

        if ($health -eq "healthy") {
            return $true
        }

        if ($health -eq "unhealthy") {
            $logs = $state[0].State.Health.Log | Select-Object -Last 3
            $tail = ($logs | ForEach-Object { "[$($_.ExitCode)] $($_.Output.Trim())" }) -join "`n"
            throw "Container became unhealthy.`n$tail"
        }

        Start-Sleep -Seconds 3
    }

    throw "Container did not reach ready status within $TimeoutSeconds seconds."
}

function Get-ServiceUrl {
    param(
        [string]$ServiceName
    )

    $knownPorts = @{
        "app" = 8082
        "app-2" = 8083
    }

    if ($knownPorts.ContainsKey($ServiceName)) {
        return "http://localhost:$($knownPorts[$ServiceName])"
    }

    return "http://localhost"
}

function Get-AssetPathsFromHtml {
    param(
        [string]$HtmlContent
    )

    $matches = [regex]::Matches($HtmlContent, '/assets/[^"''\s<>]+')
    return @($matches | ForEach-Object { $_.Value } | Select-Object -Unique | Sort-Object)
}

function Get-StringSha256 {
    param(
        [string]$Text
    )

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $hashBytes = $sha.ComputeHash($bytes)
        return -join ($hashBytes | ForEach-Object { $_.ToString("x2") })
    }
    finally {
        $sha.Dispose()
    }
}

function Assert-UiDeployment {
    param(
        [string]$ServiceName,
        [string]$ServiceUrl
    )

    $response = Invoke-WebRequest -UseBasicParsing -Uri $ServiceUrl
    if ($response.StatusCode -ne 200) {
        throw "Smoke check failed for ${ServiceName}: $ServiceUrl returned HTTP $($response.StatusCode)"
    }

    $servedAssets = Get-AssetPathsFromHtml -HtmlContent $response.Content
    if ($servedAssets.Count -eq 0) {
        throw "No /assets references were found in served HTML for $ServiceName"
    }

    $verifyTempDir = Join-Path $env:TEMP ("dogyard-asset-verify-" + [Guid]::NewGuid().ToString("N"))
    New-Item -ItemType Directory -Path $verifyTempDir | Out-Null
    $assetHashes = @{}
    try {
        foreach ($assetPath in $servedAssets) {
            $assetFileName = [System.IO.Path]::GetFileName($assetPath)
            $downloadedAssetPath = Join-Path $verifyTempDir $assetFileName
            Invoke-WebRequest -UseBasicParsing -Uri ($ServiceUrl.TrimEnd('/') + $assetPath) -OutFile $downloadedAssetPath
            $assetHashes[$assetPath] = (Get-FileHash -Algorithm SHA256 -Path $downloadedAssetPath).Hash.ToLowerInvariant()
        }
    }
    finally {
        Remove-Item -Recurse -Force $verifyTempDir -ErrorAction SilentlyContinue
    }

    if ($script:BaselineAssetPaths.Count -eq 0) {
        $script:BaselineAssetPaths = @($servedAssets)
        $script:BaselineAssetHashes = @{}
        foreach ($key in $assetHashes.Keys) {
            $script:BaselineAssetHashes[$key] = $assetHashes[$key]
        }
    }
    else {
        $assetDiff = Compare-Object -ReferenceObject $script:BaselineAssetPaths -DifferenceObject $servedAssets
        if ($assetDiff) {
            $details = $assetDiff | ForEach-Object { "[$($_.SideIndicator)] $($_.InputObject)" }
            throw "Asset reference mismatch for $ServiceName against baseline.`n$($details -join "`n")"
        }

        foreach ($assetPath in $script:BaselineAssetPaths) {
            $expectedHash = [string]$script:BaselineAssetHashes[$assetPath]
            $actualHash = [string]$assetHashes[$assetPath]
            if ($expectedHash -ne $actualHash) {
                throw "Hash mismatch for $ServiceName asset '$assetPath'. expected=$expectedHash actual=$actualHash"
            }
        }
    }

    $indexCacheControl = [string]$response.Headers["Cache-Control"]
    if ($indexCacheControl -notmatch "no-store") {
        throw "Cache policy mismatch for $ServiceName index.html: Cache-Control must include no-store. Actual='$indexCacheControl'"
    }

    Write-Host "PASS [$ServiceName] UI smoke+hash verification succeeded ($($servedAssets.Count) assets)"
}

Set-Location $ProjectRoot

# Avoid noisy compose warnings for optional vars when they are intentionally unset.
if (-not (Test-Path Env:VITE_DEVELOPER_EMAILS)) {
    $env:VITE_DEVELOPER_EMAILS = ""
}
if (-not (Test-Path Env:VITE_DEVELOPER_EMAIL)) {
    $env:VITE_DEVELOPER_EMAIL = ""
}

# Fail fast if Docker daemon is not available.
try {
    docker version *> $null
}
catch {
    throw "Docker daemon is not reachable. Open Docker Desktop and wait until it is running, then retry."
}

Write-Host "[1/4] Cleaning old project containers..."
docker compose down --remove-orphans | Out-Null

Write-Host "[2/4] Removing old image tag to prevent stale RUN behavior..."
$existingImageId = docker images -q $ImageName
if (-not [string]::IsNullOrWhiteSpace($existingImageId)) {
    docker image rm $ImageName -f | Out-Null
}
else {
    Write-Host "Image '$ImageName' was not found locally; skipping remove."
}

Write-Host "[3/4] Validating selected services..."
$allServices = docker compose config --services
$selectedServices = @(
    $Services |
        ForEach-Object { $_ -split ',' } |
        ForEach-Object { $_.Trim() } |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) } |
        Select-Object -Unique
)
if ($selectedServices.Count -eq 0) {
    throw "No services were provided. Use -Services app,app-2"
}

$unknownServices = $selectedServices | Where-Object { $_ -notin $allServices }
if ($unknownServices.Count -gt 0) {
    throw "Unknown services: $($unknownServices -join ', '). Available: $($allServices -join ', ')"
}

if ($SkipBuild) {
    Write-Host "[4/5] Skipping rebuild by request and using existing image..."
}
else {
    Write-Host "[4/5] Rebuilding selected services from current Dockerfile..."
    docker compose build --no-cache @selectedServices | Out-Null
}

Write-Host "[5/5] Starting selected services and waiting for readiness..."
docker compose up -d @selectedServices | Out-Null

$script:BaselineAssetPaths = @()
$script:BaselineAssetHashes = @{}

foreach ($serviceName in $selectedServices) {
    $containerId = docker compose ps -q $serviceName
    if ([string]::IsNullOrWhiteSpace($containerId)) {
        throw "Could not locate running container id for service '$serviceName'."
    }

    Wait-ContainerReady -ContainerId $containerId -TimeoutSeconds $HealthTimeoutSeconds | Out-Null

    $status = docker inspect $containerId | ConvertFrom-Json
    $image = $status[0].Config.Image
    $runtimeStatus = $status[0].State.Status
    $health = "n/a"
    if ($null -ne $status[0].State.Health) {
        $health = $status[0].State.Health.Status
    }
    $url = Get-ServiceUrl -ServiceName $serviceName

    Write-Host "DONE [$serviceName]: status=$runtimeStatus health=$health"
    Write-Host "Container [$serviceName]: $containerId"
    Write-Host "Image [$serviceName]: $image"
    if ([string]::IsNullOrWhiteSpace($url)) {
        Write-Host "URL [$serviceName]: (port mapping not found)"
    }
    else {
        Write-Host "URL [$serviceName]: $url"
        Assert-UiDeployment -ServiceName $serviceName -ServiceUrl $url
    }
}

if ($Watch) {
    Write-Host "AUTO MODE: docker compose watch is starting for $($selectedServices -join ', ')."
    Write-Host "AUTO MODE: leave this terminal open; Ctrl+C stops automatic rebuild sync."
    docker compose watch @selectedServices
}



