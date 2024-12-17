# automation.ps1

# This automation is written for testing docker compose

Write-Host "Stopping Docker Compose containers..."
docker compose down

Write-Host "Removing 'node_modules' from backend..."
Remove-Item -Recurse -Force .\backend\node_modules\

Write-Host "Removing 'node_modules' from frontend..."
Remove-Item -Recurse -Force .\frontend\node_modules\

Write-Host "Starting Docker Compose containers..."
docker compose up -d