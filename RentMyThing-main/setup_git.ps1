$ErrorActionPreference = "Stop"
$mingitDir = "C:\Users\prate\.gemini\antigravity\mingit"
$gitExe = "$mingitDir\cmd\git.exe"

if (!(Test-Path $gitExe)) {
    Write-Host "Downloading Portable Git (MinGit) via fast curl..."
    if (!(Test-Path $mingitDir)) { New-Item -ItemType Directory -Force -Path $mingitDir | Out-Null }
    $zipPath = "$mingitDir\mingit.zip"
    & curl.exe -L -s -o $zipPath "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/MinGit-2.47.1-64-bit.zip"
    Write-Host "Extracting MinGit..."
    Expand-Archive -Path $zipPath -DestinationPath $mingitDir -Force
    Remove-Item $zipPath -Force
}

Write-Host "Git ready at: $gitExe"

# Initialize repo
& $gitExe init
& $gitExe config user.name "Prateek Vijay"
& $gitExe config user.email "prateekvijay265@gmail.com"

# Stage all files
& $gitExe add .
& $gitExe commit -m "RentMyThing India · AI-Powered Campus Peer Rental Marketplace"

# Branch & Remote
& $gitExe branch -M main
& $gitExe remote remove origin 2>$null
& $gitExe remote add origin "https://github.com/prateekvijay265/RentMyThing.git"

Write-Host "Repository initialized and committed locally!"
