param(
    [Parameter(Mandatory = $true)]
    [string]$WorkbookPath
)

$ErrorActionPreference = "Stop"

$excelPath = "C:\Program Files\Microsoft Office\Root\Office16\EXCEL.EXE"
$workbookFullPath = (Resolve-Path -LiteralPath $WorkbookPath).Path

$process = Start-Process -FilePath $excelPath -ArgumentList @("/decompile", $workbookFullPath) -PassThru
Start-Sleep -Seconds 8

$shell = New-Object -ComObject WScript.Shell
$shell.AppActivate($process.Id) | Out-Null
Start-Sleep -Milliseconds 800
$shell.SendKeys("%{F11}")
Start-Sleep -Seconds 2
$shell.SendKeys("%d")
Start-Sleep -Milliseconds 800
$shell.SendKeys("c")
Start-Sleep -Seconds 4
$shell.SendKeys("^s")
Start-Sleep -Seconds 2

try {
    $excel = [Runtime.InteropServices.Marshal]::GetActiveObject("Excel.Application")
    $excel.DisplayAlerts = $false
    foreach ($workbook in @($excel.Workbooks)) {
        if ($workbook.FullName -eq $workbookFullPath) {
            $workbook.Save()
            $workbook.Close($true)
        }
    }
    if ($excel.Workbooks.Count -eq 0) {
        $excel.Quit()
    }
    Write-Output "COMPILE_UI_DONE"
} catch {
    Write-Output ("COMPILE_UI_CLOSE_ERR=" + $_.Exception.Message)
}

[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
