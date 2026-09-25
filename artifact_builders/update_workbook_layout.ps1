param(
    [string]$WorkbookPath
)

$ErrorActionPreference = "Stop"

function Set-Cell {
    param($sheet, [int]$row, [int]$col, $value, [bool]$bold = $false, [int]$color = -1)
    $cell = $sheet.Cells.Item($row, $col)
    if ($null -eq $value) {
        $cell.Value2 = ""
    } elseif ($value -is [string]) {
        $cell.Value2 = $value
    } else {
        $cell.Formula = [string]::Format([System.Globalization.CultureInfo]::InvariantCulture, "{0}", $value)
    }
    $cell.Font.Name = "Arial"
    $cell.Font.Size = 10
    $cell.Font.Bold = $bold
    $cell.HorizontalAlignment = -4108
    $cell.VerticalAlignment = -4108
    if ($color -ge 0) { $cell.Interior.Color = $color }
    $cell.Borders.LineStyle = 1
}

$path = (Resolve-Path $WorkbookPath).Path
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($path)
    $wsBase = $wb.Worksheets.Item("Base de datos")
    $wsCalc = $wb.Worksheets.Item("Calculadora")
    $wsInfo = $wb.Worksheets.Item("Informe")

    $blue = 15652797
    $green = 14286809

    $existingHeaderI = [string]$wsBase.Cells.Item(1, 9).Text + " " + [string]$wsBase.Cells.Item(2, 9).Text
    $existingHeaderJ = [string]$wsBase.Cells.Item(1, 10).Text + " " + [string]$wsBase.Cells.Item(2, 10).Text
    $existingRows = @()
    for ($r = 3; $r -le 17; $r++) {
        $row = @()
        for ($c = 1; $c -le 10; $c++) {
            $row += $wsBase.Cells.Item($r, $c).Value2
        }
        if ([string]$row[0] -ne "") {
            if ($existingHeaderI -match "fiscal" -and $existingHeaderJ -match "calif") {
                $tmp = $row[8]
                $row[8] = $row[9]
                $row[9] = $tmp
            }
            $existingRows += ,$row
        }
    }

    $wsBase.Range("A1:J204").Clear()
    foreach ($addr in @("B1:D1", "E1:F1", "G1:H1")) {
        $wsBase.Range($addr).Merge() | Out-Null
    }
    $wsBase.Range("I1:J1").Merge() | Out-Null
    Set-Cell $wsBase 1 1 "" $true $blue
    Set-Cell $wsBase 1 2 "Dosis" $true $blue
    Set-Cell $wsBase 1 5 "Gramos" $true $blue
    Set-Cell $wsBase 1 7 "Kilogramos" $true $blue
    Set-Cell $wsBase 1 9 "Datos adicionales" $true $blue
    $baseHeaders = @("Sustancias", "Peso", "Pureza", "Precio", "Pureza", "Precio", "Fuerza", "Precio", "Clasificacion legal", "Sustancia no fiscalizada")
    for ($i = 0; $i -lt $baseHeaders.Count; $i++) {
        Set-Cell $wsBase 2 ($i + 1) $baseHeaders[$i] $true $green
    }
    $sampleRows = @(
        @("Heroina", 106, 0.24, 16.17, 0.31, 59.18, 0.43, 29605, "Lista I Y IV CU 1961", "No"),
        @("Cocaina", 214, 1.26, 24.95, 1.47, 62.15, 1.74, 26881, "Lista I CU 1961", "No"),
        @("Hachis", "", "", "", "", "", "", "", "Lista I CU 1961", "No"),
        @("Aceite Hachis", "", "", "", "", "", "", "", "", "No"),
        @("Grifa", "", "", "", "", "", "", "", "", "No"),
        @("Marihuana", "", "", "", "", "", "", "", "", "No"),
        @("L.S.D", "", "", "", "", "", "", "", "", "No"),
        @("Farmaco Anfetaminico", "", "", "", "", "", "", "", "", "No"),
        @("MDMA/Extasis", "", "", "", "", "", "", "", "", "No"),
        @("Speed", "", "", "", "", "", "", "", "", "No"),
        @("Otros Farmacos", "", "", "", "", "", "", "", "", "No"),
        @("Ketamina", "", "", "", "", "", "", "", "", "No"),
        @("GHB", "", "", "", "", "", "", "", "", "No"),
        @("Papel impregnado", "", "", "", "", "", "", "", "", "Si"),
        @("Diaze", "", "", "", "", "", "", "", "Lista IV C 1971", "Si")
    )
    $rowsToWrite = $sampleRows
    if ($existingRows.Count -gt 0) { $rowsToWrite = $existingRows }
    for ($r = 0; $r -lt $rowsToWrite.Count; $r++) {
        for ($c = 0; $c -lt $rowsToWrite[$r].Count; $c++) {
            Set-Cell $wsBase ($r + 3) ($c + 1) $rowsToWrite[$r][$c] $false -1
        }
    }
    for ($r = 3; $r -le 17; $r++) {
        for ($c = 1; $c -le 10; $c++) {
            $cell = $wsBase.Cells.Item($r, $c)
            $cell.Interior.Color = $green
            $cell.Borders.LineStyle = 1
            $cell.Font.Name = "Arial"
            $cell.Font.Size = 10
            $cell.VerticalAlignment = -4108
            If ($c -eq 1) {
                $cell.HorizontalAlignment = -4131
            } else {
                $cell.HorizontalAlignment = -4108
            }
        }
    }
    $wsBase.Range("C3:C202").NumberFormatLocal = "0,00%"
    $wsBase.Range("E3:E202").NumberFormatLocal = "0,00%"
    $wsBase.Range("G3:G202").NumberFormatLocal = "0,00%"
    $wsBase.Range("D3:D202").NumberFormatLocal = "#.##0,00"
    $wsBase.Range("F3:F202").NumberFormatLocal = "#.##0,00"
    $wsBase.Range("H3:H202").NumberFormatLocal = "#.##0,00"
    $wsBase.Range("J3:J17").Validation.Delete()
    $wsBase.Range("J3:J17").Validation.Add(3, 1, 1, "No;Si")
    $wsBase.Range("A1:J17").BorderAround(1, -4138) | Out-Null
    $wsBase.Rows.Item(1).RowHeight = 22
    $wsBase.Rows.Item(2).RowHeight = 30
    $wsBase.Range("A2:H2").WrapText = $true
    $wsBase.Range("A3:H17").RowHeight = 22
    $wsBase.Columns.Item(1).ColumnWidth = 20
    $wsBase.Columns.Item(2).ColumnWidth = 11
    $wsBase.Columns.Item(3).ColumnWidth = 12
    $wsBase.Columns.Item(4).ColumnWidth = 12
    $wsBase.Columns.Item(5).ColumnWidth = 12
    $wsBase.Columns.Item(6).ColumnWidth = 12
    $wsBase.Columns.Item(7).ColumnWidth = 12
    $wsBase.Columns.Item(8).ColumnWidth = 14
    $wsBase.Columns.Item(9).ColumnWidth = 22
    $wsBase.Columns.Item(10).ColumnWidth = 24

    $calcHeaders = @(
        "envoltorio",
        "sustancia",
        "Pureza",
        "Sustancia tipo",
        "peso neto",
        "Precio mayor",
        "menor gramos",
        "menor dosis",
        "Riqueza",
        "calificacion legal",
        "Gramos no fiscalizado",
        "",
        "DE CORTE 1",
        "DE CORTE 2",
        "DE CORTE 3"
    )
    $wsCalc.Range("A4:O204").Clear()
    for ($i = 0; $i -lt $calcHeaders.Count; $i++) {
        if ($calcHeaders[$i] -ne "") {
            Set-Cell $wsCalc 4 ($i + 1) $calcHeaders[$i] $true $green
        }
    }
    for ($r = 5; $r -le 204; $r++) {
        $soloMenorGramosFormula = "OR(ISNUMBER(SEARCH(""Hach"",`$B$r)),ISNUMBER(SEARCH(""Ketamina"",`$B$r)))"
        $wsCalc.Cells.Item($r, 3).Formula = "=IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,3,FALSE),"""")"
        $wsCalc.Cells.Item($r, 4).Formula = "=IF(`$B$r="""","""",`$B$r)"
        $wsCalc.Cells.Item($r, 6).Formula = "=IF(`$B$r="""","""",IF($soloMenorGramosFormula,"""",IFERROR(`$M$r*VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,8,FALSE)/1000,"""")))"
        $wsCalc.Cells.Item($r, 7).Formula = "=IF(`$B$r="""","""",IFERROR(IF($soloMenorGramosFormula,IF(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,6,FALSE)="""","""",`$E$r*VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,6,FALSE)),IF(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,6,FALSE)="""","""",`$N$r*VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,6,FALSE))),""""))"
        $wsCalc.Cells.Item($r, 8).Formula = "=IF(`$B$r="""","""",IF($soloMenorGramosFormula,"""",IFERROR(`$O$r*VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,4,FALSE),"""")))"
        $wsCalc.Cells.Item($r, 9).Formula = "=IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,7,FALSE),"""")"
        $wsCalc.Cells.Item($r, 10).Formula = "=IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,9,FALSE),"""")"
        $wsCalc.Cells.Item($r, 13).Formula = "=IF($soloMenorGramosFormula,"""",IFERROR(`$E$r*`$C$r/`$I$r,""""))"
        $wsCalc.Cells.Item($r, 14).Formula = "=IF($soloMenorGramosFormula,"""",IFERROR(`$E$r*`$C$r/IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,5,FALSE),0),""""))"
        $wsCalc.Cells.Item($r, 15).Formula = "=IF($soloMenorGramosFormula,"""",IFERROR(((`$E$r*`$C$r/IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,3,FALSE),0))*1000)/IFERROR(VLOOKUP(`$B$r,'Base de datos'!`$A`$3:`$J`$202,2,FALSE),0),""""))"
    }
    $wsCalc.Range("B5:B204").Validation.Delete()
    $wsCalc.Range("B5:B204").Validation.Add(3, 1, 1, "=DESREF('Base de datos'!`$A`$3;0;0;MAX(1;CONTARA('Base de datos'!`$A`$3:`$A`$202));1)")
    $wsCalc.Range("C5:C204").NumberFormatLocal = "0,00%"
    $wsCalc.Range("I5:I204").NumberFormatLocal = "0,00%"
    $wsCalc.Range("E5:E204").NumberFormatLocal = "0,000"
    $wsCalc.Range("K5:K204").NumberFormatLocal = "0,000"
    $wsCalc.Range("F5:H204").NumberFormatLocal = "#.##0,00"
    $wsCalc.Range("M5:O204").NumberFormatLocal = "0,000"
    $wsCalc.Range("A4:O204").Borders.LineStyle = 1
    $wsCalc.Columns.AutoFit() | Out-Null
    $wsCalc.Columns.Item(2).ColumnWidth = 18
    $wsCalc.Columns.Item(3).ColumnWidth = 13
    $wsCalc.Columns.Item(4).ColumnWidth = 18
    $wsCalc.Columns.Item(6).ColumnWidth = 13
    $wsCalc.Columns.Item(7).ColumnWidth = 14
    $wsCalc.Columns.Item(8).ColumnWidth = 14
    $wsCalc.Columns.Item(9).ColumnWidth = 13
    $wsCalc.Columns.Item(10).ColumnWidth = 20
    $wsCalc.Columns.Item(13).ColumnWidth = 13
    $wsCalc.Columns.Item(14).ColumnWidth = 13
    $wsCalc.Columns.Item(15).ColumnWidth = 13

    $wsInfo.Range("A1:B1").Merge() | Out-Null
    Set-Cell $wsInfo 1 1 "DATOS INFORME" $true $blue
    $infoFields = @(
        "EXPTE INFORME ANALITICO",
        "AUTORIDAD JUDICIAL",
        "PROCEDIMIENTO (solo el numero)",
        "T.I.P.",
        "Fecha del oficio",
        "NOMBRE PRESO",
        "DNI PRESO",
        "NUMERO ATESTADO",
        "FECHA ATESTADO",
        "Fecha de deposito de la sustancia",
        "FECHA INFORME ANALITICO",
        "Semestre",
        "Numero de orden",
        "Tipo de venta"
    )
    for ($i = 0; $i -lt $infoFields.Count; $i++) {
        Set-Cell $wsInfo ($i + 3) 1 $infoFields[$i] $true $blue
        $wsInfo.Cells.Item($i + 3, 2).Borders.LineStyle = 1
        $wsInfo.Cells.Item($i + 3, 2).HorizontalAlignment = -4108
        $wsInfo.Cells.Item($i + 3, 2).VerticalAlignment = -4108
    }
    foreach ($shape in @($wsInfo.Shapes)) {
        if ($shape.Name -eq "btnGenerarInformeWord") {
            $shape.Delete()
        }
    }
    $buttonLeft = $wsInfo.Range("A18").Left
    $buttonTop = $wsInfo.Range("A18").Top + 4
    $buttonWidth = $wsInfo.Range("A18:B18").Width
    $button = $wsInfo.Shapes.AddShape(1, $buttonLeft, $buttonTop, $buttonWidth, 34)
    $button.Name = "btnGenerarInformeWord"
    $button.TextFrame.Characters().Text = "Generar informe Word"
    $button.TextFrame.Characters().Font.Bold = $true
    $button.TextFrame.Characters().Font.Size = 11
    $button.Fill.ForeColor.RGB = 5287936
    $button.Line.ForeColor.RGB = 26367
    $button.TextFrame.Characters().Font.Color = 16777215
    $button.OnAction = "CrearInformeWordDesdeExcel"

    $wsInfo.Activate() | Out-Null
    $wb.Save()
    $wb.Close($true)
} finally {
    $excel.Quit()
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
