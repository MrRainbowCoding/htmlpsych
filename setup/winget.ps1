# Check if WinGet is already installed and available before elevating
if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "WinGet is already installed. Exiting script."
    Start-Sleep -Seconds 1
    Exit
}

Write-Host "Elevating privileges and installing WinGet..."

# Elevate privileges if not already running as Administrator
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

\$progressPreference = 'silentlyContinue'
Write-Host "Installing WinGet PowerShell module from PSGallery..."
Install-PackageProvider -Name NuGet -Force | Out-Null
Install-Module -Name Microsoft.WinGet.Client -Force -Repository PSGallery | Out-Null
Write-Host "Using Repair-WinGetPackageManager cmdlet to bootstrap WinGet..."
Repair-WinGetPackageManager -AllUsers
Write-Host "Done."

# Silent wait before closing
Start-Sleep -Seconds 1
