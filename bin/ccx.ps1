param(
    [switch]$Setup
)

$ErrorActionPreference = "Stop"

$ROOT_DIR = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$ENV_FILE = Join-Path $env:USERPROFILE ".claude-proxy\.env"
$PORT = if ($env:CLAUDE_PROXY_PORT) { $env:CLAUDE_PROXY_PORT } else { 17870 }

if ($Setup) {
    Write-Host "Setting up ~/.claude-proxy/.env..."
    $envDir = Join-Path $env:USERPROFILE ".claude-proxy"
    if (-not (Test-Path $envDir)) {
        New-Item -ItemType Directory -Path $envDir | Out-Null
    }

    if (Test-Path $ENV_FILE) {
        Write-Host "Existing .env found. Edit it manually at: $ENV_FILE"
        exit 0
    }

    @"
# Claude Proxy Configuration
# Edit this file to add your API keys

# OpenAI (optional)
OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1

# OpenRouter (optional)
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_REFERER=
OPENROUTER_TITLE=Claude Code via ccx

# Gemini (optional)
GEMINI_API_KEY=
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta

# Z.AI GLM (optional)
GLM_UPSTREAM_URL=https://api.z.ai/api/anthropic
ZAI_API_KEY=

# Anthropic (optional)
ANTHROPIC_UPSTREAM_URL=https://api.anthropic.com
ANTHROPIC_API_KEY=
ANTHROPIC_VERSION=2023-06-01

# Proxy settings
CLAUDE_PROXY_PORT=17870
"@ | Out-File -FilePath $ENV_FILE -Encoding utf8

    Write-Host "✅ Created $ENV_FILE"
    Write-Host ""
    Write-Host "Edit it to add your API keys, then run: ccx"
    Write-Host ""
    Write-Host "Example:"
    Write-Host "  notepad $ENV_FILE"
    exit 0
}

# Load .env file (simple parser for PowerShell)
if (Test-Path $ENV_FILE) {
    Get-Content $ENV_FILE | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value) {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
}

$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:$PORT"
if (-not $env:ANTHROPIC_AUTH_TOKEN) {
    $env:ANTHROPIC_AUTH_TOKEN = "local-proxy-token"
}

Write-Host "[ccx] Starting Claude Code with multi-provider proxy..."
Write-Host "[ccx] Proxy will listen on: $($env:ANTHROPIC_BASE_URL)"

# Start proxy
$gatewayPath = Join-Path $ROOT_DIR "adapters\anthropic-gateway.ts"
$logPath = Join-Path $env:TEMP "claude-proxy.log"
$errorLogPath = Join-Path $env:TEMP "claude-proxy-error.log"

$proc = Start-Process "npx" -ArgumentList "-y","tsx",$gatewayPath -PassThru -WindowStyle Hidden -RedirectStandardOutput $logPath -RedirectStandardError $errorLogPath

# Wait for health check
Write-Host "[ccx] Waiting for proxy to start..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$PORT/healthz" -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "[ccx] Proxy ready!"
            $ready = $true
            break
        }
    } catch {
        Start-Sleep -Milliseconds 500
    }
}

if (-not $ready) {
    Write-Host "❌ Proxy failed to start. Check logs:"
    Write-Host "  $logPath"
    Write-Host "  $errorLogPath"
    if (Test-Path $errorLogPath) {
        Get-Content $errorLogPath
    }
    if ($proc -and -not $proc.HasExited) { $proc.Kill() }
    exit 1
}

Write-Host ""
Write-Host "🎯 Available model prefixes:"
Write-Host "  openai:<model>      - OpenAI models (gpt-4o, gpt-4o-mini, etc.)"
Write-Host "  openrouter:<model>  - OpenRouter models"
Write-Host "  gemini:<model>      - Google Gemini models"
Write-Host "  glm:<model>         - Z.AI GLM models (glm-4.6, glm-4.5, etc.)"
Write-Host "  anthropic:<model>   - Anthropic Claude models"
Write-Host ""
Write-Host "💡 Switch models in-session with: /model <prefix>:<model-name>"
Write-Host ""

try {
    & claude @args
} finally {
    Write-Host ""
    Write-Host "[ccx] Shutting down proxy..."
    if ($proc -and -not $proc.HasExited) {
        $proc.Kill()
    }
}
