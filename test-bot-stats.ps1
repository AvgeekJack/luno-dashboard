# PowerShell script to test bot stats API
# Run this with: .\test-bot-stats.ps1

$apiUrl = "http://localhost:3000/api/bot-stats"

# Stats to send
$stats = @{
    serverCount = 2
    memberCount = 50
    commandCount = 150
} | ConvertTo-Json

Write-Host "Sending stats to API..." -ForegroundColor Cyan
Write-Host $stats -ForegroundColor Yellow

try {
    # Send POST request
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $stats -ContentType "application/json"
    Write-Host "`n✅ Success! Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Green

    # Fetch current stats to verify
    Write-Host "`nFetching current stats to verify..." -ForegroundColor Cyan
    $currentStats = Invoke-RestMethod -Uri $apiUrl -Method Get
    Write-Host "Current stats on server:" -ForegroundColor Green
    Write-Host ($currentStats | ConvertTo-Json -Depth 3) -ForegroundColor Green

} catch {
    Write-Host "`n❌ Error: $_" -ForegroundColor Red
}
