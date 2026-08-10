# clean-ports.ps1 - Kill processes on ports 5174-5176
# This ensures they're free before starting dev servers

Write-Host "Cleaning ports 5174-5176..." -ForegroundColor Yellow

$ports = @(5174, 5175, 5176)
foreach ($port in $ports) {
    $connections = netstat -ano 2>$null | Where-Object { $_ -match ":$port\s+.*\s+(\d+)$" }
    foreach ($line in $connections) {
        if ($line -match ':\d+\s+\w+\s+(\d+)') {
            $pid = $matches[1]
            if ($pid -ne $PID) {
                try {
                    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                    Write-Host "  Killed process $pid on port $port" -ForegroundColor Green
                } catch {
                    Write-Host "  Could not kill process $pid on port $port" -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host "Ports cleaned!" -ForegroundColor Green

# Start dev server on port 5173
Write-Host "Starting dev server on port 5173..." -ForegroundColor Yellow
cd (Split-Path $MyInvocation.MyCommand.Path -Parent)
npm run dev
