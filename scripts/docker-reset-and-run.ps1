param(
    [string]$ProjectRoot = "C:\Users\user\StudioProjects\dogyard-atoms",
    [string]$ServiceName = "app",
    [string]$ImageName = "dogyard-atoms-app:latest",
    [int]$HealthTimeoutSeconds = 120
)

$ErrorActionPreference = "Stop"

function Wait-ContainerHealthy {
    param(
        [string]$ContainerId,
        [int]$TimeoutSeconds
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        $state = docker inspect $ContainerId | ConvertFrom-Json
        $status = $state[0].State.Status
        $health = $state[0].State.Health.Status

        if ($status -ne "running") {
            throw "Container stopped unexpectedly. Status: $status"
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

    throw "Container did not reach healthy status within $TimeoutSeconds seconds."
}

Set-Location $ProjectRoot

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
docker image rm $ImageName -f *> $null

Write-Host "[3/4] Rebuilding service image from current Dockerfile..."
docker compose build --no-cache $ServiceName | Out-Null

Write-Host "[4/4] Starting service and waiting for HEALTHY..."
docker compose up -d $ServiceName | Out-Null

$containerId = docker compose ps -q $ServiceName
if ([string]::IsNullOrWhiteSpace($containerId)) {
    throw "Could not locate running container id for service '$ServiceName'."
}

Wait-ContainerHealthy -ContainerId $containerId -TimeoutSeconds $HealthTimeoutSeconds | Out-Null

$status = docker inspect $containerId | ConvertFrom-Json
$image = $status[0].Config.Image
$health = $status[0].State.Health.Status

Write-Host "DONE: Container is $health"
Write-Host "Container: $containerId"
Write-Host "Image: $image"
Write-Host "URL: http://localhost:8080"



