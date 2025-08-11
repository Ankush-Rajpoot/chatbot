# Deployment Script for Netlify
# Run this script to prepare and deploy your app

# 1. Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

# 2. Build the project
Write-Host "Building the project..." -ForegroundColor Green
npm run build

# 3. Check if build was successful
if (Test-Path "dist") {
    Write-Host "Build successful! dist/ folder created." -ForegroundColor Green
    Write-Host "You can now deploy the dist/ folder to Netlify." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://app.netlify.com" -ForegroundColor White
    Write-Host "2. Drag and drop the dist/ folder" -ForegroundColor White
    Write-Host "3. Set environment variables in Netlify:" -ForegroundColor White
    Write-Host "   - VITE_NHOST_SUBDOMAIN" -ForegroundColor White
    Write-Host "   - VITE_NHOST_REGION" -ForegroundColor White
    Write-Host "   - VITE_HASURA_GRAPHQL_ENDPOINT" -ForegroundColor White
    Write-Host "   - VITE_HASURA_WS_ENDPOINT" -ForegroundColor White
} else {
    Write-Host "Build failed! Please check the error messages above." -ForegroundColor Red
}
