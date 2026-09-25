param(
    [int]$Seconds = 90
)

$shell = New-Object -ComObject WScript.Shell
$end = (Get-Date).AddSeconds($Seconds)
while ((Get-Date) -lt $end) {
    Start-Sleep -Seconds 5
    $shell.AppActivate("Microsoft Excel") | Out-Null
    Start-Sleep -Milliseconds 200
    $shell.SendKeys("{ENTER}")
}
