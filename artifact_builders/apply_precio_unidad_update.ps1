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

    $lastRow = [Math]::Max(202, $base.Cells.Item($base.Rows.Count, 1).End(-4162).Row)
    $blue = 15652797
    $green = 14286809

    $base.Cells.Item(1, 9).Value2 = "Datos adicionales"
    $base.Cells.Item(2, 9).Value2 = "Precio Unidad"
    $base.Cells.Item(2, 10).Value2 = "Clasificacion legal"
    $base.Cells.Item(2, 11).Value2 = "Sustancia no fiscalizada"

    $base.Range("A1:K1").Interior.Color = $blue
    $base.Range("A2:K2").Interior.Color = $green
    $base.Range("A2:K2").Font.Bold = $true
    $base.Range("A1:K" + $lastRow).Borders.LineStyle = 1
    $base.Range("A3:K" + $lastRow).Interior.Color = $green
    $base.Range("C3:C" + $lastRow).NumberFormatLocal = "0,00%"
    $base.Range("E3:E" + $lastRow).NumberFormatLocal = "0,00%"
    $base.Range("G3:G" + $lastRow).NumberFormatLocal = "0,00%"
    $base.Range("D3:D" + $lastRow).NumberFormatLocal = "#.##0,00"
    $base.Range("F3:F" + $lastRow).NumberFormatLocal = "#.##0,00"
    $base.Range("H3:I" + $lastRow).NumberFormatLocal = "#.##0,00"
    $base.Range("K3:K" + $lastRow).Validation.Delete()
    $base.Range("K3:K" + $lastRow).Validation.Add(3, 1, 1, "Si;No")
    $base.Columns.Item(9).ColumnWidth = 14
    $base.Columns.Item(10).ColumnWidth = 28
    $base.Columns.Item(11).ColumnWidth = 24

    $lookupRange = "'Base de datos'!`$A`$3:`$K`$" + $lastRow
    for ($r = 5; $r -le 204; $r++) {
        $legal = "IFERROR(VLOOKUP(`$B$r,$lookupRange,10,FALSE),"""")"
        $flag = "IFERROR(VLOOKUP(`$B$r,$lookupRange,11,FALSE),"""")"
        $unit = "IFERROR(VLOOKUP(`$B$r,$lookupRange,9,FALSE),"""")"
        $gramPrice = "VLOOKUP(`$B$r,$lookupRange,6,FALSE)"
        $noFiscal = "OR(UPPER($flag)=""NO"",ISNUMBER(SEARCH(""no sometida"",$legal)),ISNUMBER(SEARCH(""no fiscal"",$legal)))"
        $soloGramos = "OR(ISNUMBER(SEARCH(""Hach"",`$B$r)),ISNUMBER(SEARCH(""Ketamina"",`$B$r)))"
        $hasUnit = "AND($unit<>"""",$unit<>0)"

        $calc.Cells.Item($r, 3).Formula = "=IFERROR(VLOOKUP(`$B$r,$lookupRange,3,FALSE),"""")"
        $calc.Cells.Item($r, 4).Formula = "=IF(`$B$r="""","""",`$B$r)"
        $calc.Cells.Item($r, 6).Formula = "=IF(`$B$r="""","""",IF($noFiscal,"""",IF(OR($soloGramos,$hasUnit),"""",IFERROR(`$M$r*VLOOKUP(`$B$r,$lookupRange,8,FALSE)/1000,""""))))"
        $calc.Cells.Item($r, 7).Formula = "=IF(`$B$r="""","""",IF($noFiscal,"""",IFERROR(IF($soloGramos,IF($gramPrice="""","""",`$E$r*$gramPrice),IF($hasUnit,"""",IF($gramPrice="""","""",`$N$r*$gramPrice))),"""")))"
        $calc.Cells.Item($r, 8).Formula = "=IF(`$B$r="""","""",IF($noFiscal,"""",IF($soloGramos,"""",IF($hasUnit,`$E$r*$unit,IFERROR(`$O$r*VLOOKUP(`$B$r,$lookupRange,4,FALSE),"""")))))"
        $calc.Cells.Item($r, 9).Formula = "=IFERROR(VLOOKUP(`$B$r,$lookupRange,7,FALSE),"""")"
        $calc.Cells.Item($r, 10).Formula = "=" + $legal
        $calc.Cells.Item($r, 13).Formula = "=IF(OR($noFiscal,$soloGramos,$hasUnit),"""",IFERROR(`$E$r*`$C$r/`$I$r,""""))"
        $calc.Cells.Item($r, 14).Formula = "=IF(OR($noFiscal,$soloGramos,$hasUnit),"""",IFERROR(`$E$r*`$C$r/IFERROR(VLOOKUP(`$B$r,$lookupRange,5,FALSE),0),""""))"
        $calc.Cells.Item($r, 15).Formula = "=IF(OR($noFiscal,$soloGramos,$hasUnit),"""",IFERROR(((`$E$r*`$C$r/IFERROR(VLOOKUP(`$B$r,$lookupRange,3,FALSE),0))*1000)/IFERROR(VLOOKUP(`$B$r,$lookupRange,2,FALSE),0),""""))"
    }

    $calc.Range("B5:B204").Validation.Delete()
    $calc.Range("B5:B204").Validation.Add(3, 1, 1, "=DESREF('Base de datos'!`$A`$3;0;0;MAX(1;CONTARA('Base de datos'!`$A`$3:`$A`$" + $lastRow + "));1)")
    $calc.Range("F5:H204").NumberFormatLocal = "#.##0,00"
    $calc.Range("M5:O204").NumberFormatLocal = "0,000"
    $calc.Range("J5:J204").NumberFormatLocal = "@"

    $wb.Save()
    $wb.Close($true)
    Write-Output "ACTUALIZADO_SIN_BORRAR=True"
    Write-Output ("FILAS_BASE=" + $lastRow)
} finally {
    $excel.Quit()
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
