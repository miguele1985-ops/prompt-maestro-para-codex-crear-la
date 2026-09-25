param(
    [string]$WorkbookPath,
    [string]$MacroModule = "artifact_builders\GeneradorInformesExcel.bas"
)

$ErrorActionPreference = "Stop"
$workbookFullPath = (Resolve-Path $WorkbookPath).Path
$moduleFullPath = (Resolve-Path $MacroModule).Path

$securityKey = "HKCU:\Software\Microsoft\Office\16.0\Excel\Security"
if (!(Test-Path $securityKey)) {
    New-Item -Path $securityKey -Force | Out-Null
}
Set-ItemProperty -Path $securityKey -Name AccessVBOM -Type DWord -Value 1

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.AutomationSecurity = 1
try {
    $wb = $excel.Workbooks.Open($workbookFullPath)
    $components = $wb.VBProject.VBComponents

    for ($i = $components.Count; $i -ge 1; $i--) {
        $component = $components.Item($i)
        if ($component.Name -eq "GeneradorInformesExcel") {
            $components.Remove($component)
        }
    }

    $components.Import($moduleFullPath) | Out-Null
    $wb.Save()
    $wb.Close($true)
    Write-Output "MACRO_IMPORTADA=True"
} finally {
    $excel.Quit()
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
