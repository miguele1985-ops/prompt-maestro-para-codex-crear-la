param(
    [Parameter(Mandatory = $true)]
    [string]$WorkbookPath,

    [Parameter(Mandatory = $true)]
    [string]$ModulePath
)

$ErrorActionPreference = "Stop"

$workbookFullPath = (Resolve-Path -LiteralPath $WorkbookPath).Path
$moduleFullPath = (Resolve-Path -LiteralPath $ModulePath).Path

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.AutomationSecurity = 1

try {
    $workbook = $excel.Workbooks.Open($workbookFullPath)
    Write-Output ("HasVBProject=" + $workbook.HasVBProject)

    $components = $null
    try {
        $components = $workbook.VBProject.VBComponents
    } catch {
        Write-Output ("ComponentsError=" + $_.Exception.Message)
    }

    Write-Output ("ComponentsNull=" + ($null -eq $components))
    if ($null -ne $components) {
        Write-Output ("ComponentsCount=" + $components.Count)
        for ($i = $components.Count; $i -ge 1; $i--) {
            $component = $components.Item($i)
            if ($component.Name -eq "GeneradorInformesExcel") {
                $components.Remove($component)
            }
        }
        $components.Import($moduleFullPath) | Out-Null
        $workbook.Save()
        Write-Output "IMPORT_OK"
    } else {
        Write-Output "IMPORT_NOT_DONE"
    }

    $workbook.Close($true)
} finally {
    $excel.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
