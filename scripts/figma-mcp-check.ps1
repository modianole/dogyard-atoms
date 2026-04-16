Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$manifestPath = Join-Path $repoRoot 'mcp-figma\src\mcp_plugin\manifest.json'
$readmePath = Join-Path $repoRoot 'mcp-figma\README.md'

Write-Host 'Checking Figma MCP availability for this project...' -ForegroundColor Cyan

if (-not (Test-Path -Path $manifestPath)) {
  Write-Error "Missing local plugin manifest: $manifestPath"
}

if (-not (Test-Path -Path $readmePath)) {
  Write-Error "Missing local MCP docs: $readmePath"
}

$aiFigmaVersion = (npm view ai-figma-mcp version).Trim()
$mcpFigmaVersion = (npm view @sethdouglasford/mcp-figma version).Trim()

Write-Host "OK: Local plugin manifest found: $manifestPath" -ForegroundColor Green
Write-Host "OK: npm package ai-figma-mcp available (latest: $aiFigmaVersion)" -ForegroundColor Green
Write-Host "OK: npm package @sethdouglasford/mcp-figma available (latest: $mcpFigmaVersion)" -ForegroundColor Green
Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Yellow
Write-Host '1) Run: npm run figma:mcp' -ForegroundColor Yellow
Write-Host '2) In Figma, run MCP Figma Plugin and copy channel ID.' -ForegroundColor Yellow
Write-Host '3) In Copilot chat, send: Join Figma channel <CHANNEL_ID>' -ForegroundColor Yellow

