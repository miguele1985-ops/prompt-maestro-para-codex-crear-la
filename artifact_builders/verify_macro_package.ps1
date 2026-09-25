param(
    [string]$WorkbookPath
)

$ErrorActionPreference = "Stop"
$path = (Resolve-Path $WorkbookPath).Path
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($path)
    $base = $wb.Worksheets.Item("Base de datos")
    $calc = $wb.Worksheets.Item("Calculadora")
    $info = $wb.Worksheets.Item("Informe")

    $row1 = 1..8 | ForEach-Object { [string]$base.Cells.Item(1, $_).Text }
    $row2 = 1..8 | ForEach-Object { [string]$base.Cells.Item(2, $_).Text }
    $headers = 1..15 | ForEach-Object { [string]$calc.Cells.Item(4, $_).Text }

    $calc.Cells.Item(5, 2).Value2 = "Cocaina"
    $calc.Cells.Item(5, 5).Value2 = 0.24
    $excel.CalculateFull()

    $values = [ordered]@{}
    foreach ($pair in @(@("C5", 3), @("F5", 6), @("G5", 7), @("H5", 8), @("I5", 9), @("M5", 13), @("N5", 14), @("O5", 15))) {
        $values[$pair[0]] = $calc.Cells.Item(5, [int]$pair[1]).Text
    }

    $button = $info.Shapes.Item("btnGenerarInformeWord")
    Write-Output ("BASE_FILA1=" + ($row1 -join "|"))
    Write-Output ("BASE_FILA2=" + ($row2 -join "|"))
    Write-Output ("CALC_HEADERS=" + ($headers -join "|"))
    Write-Output ("VALORES=" + (($values.GetEnumerator() | ForEach-Object { $_.Name + "=" + $_.Value }) -join "; "))
    Write-Output ("BOTON_TOP=" + $button.Top + "; LEFT=" + $button.Left + "; ON=" + $button.OnAction)
    $wb.Close($false)
} finally {
    $excel.Quit()
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
