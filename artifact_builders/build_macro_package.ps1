param(
    [string]$SourceTemplate = "C:\Users\Valeria\Desktop\INFORME VALORACION DROGAS  (1).docx",
    [string]$SourceCoverDir = "C:\Users\Valeria\Desktop\VALORACION DROGA\2-. OFICIO-INFORME",
    [string]$SourceOfficeTemplate = "outputs_macro\PARA_LLEVAR_AL_TRABAJO_FINAL_FORMULAS_LIMPIO\Platilla oficio.docx",
    [string]$MacroModule = "artifact_builders\GeneradorInformesExcel.bas",
    [string]$OutputRoot = "outputs_macro\PARA_LLEVAR_AL_TRABAJO_MACRO"
)

$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path ".").Path
$outDir = Join-Path $workspace $OutputRoot
$informesDir = Join-Path $outDir "informes"
$sourceTemplatePath = (Resolve-Path $SourceTemplate).Path
$macroPath = (Resolve-Path $MacroModule).Path

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $informesDir | Out-Null

$templateOut = Join-Path $outDir "plantilla_informe_sustancias.docx"
$xlsmOut = Join-Path $outDir "calculadora_sustancias_macro.xlsm"
$moduleOut = Join-Path $outDir "GeneradorInformesExcel.bas"
$readmeOut = Join-Path $outDir "LEEME_USO.txt"

Copy-Item -LiteralPath $sourceTemplatePath -Destination $templateOut -Force
Copy-Item -LiteralPath $macroPath -Destination $moduleOut -Force
if (Test-Path $SourceOfficeTemplate) {
    Copy-Item -LiteralPath (Resolve-Path $SourceOfficeTemplate).Path -Destination (Join-Path $outDir "Platilla oficio.docx") -Force
}
if (Test-Path $SourceCoverDir) {
    $coverFile = Get-ChildItem -LiteralPath $SourceCoverDir -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "*Car*tula*.doc" -or $_.Name -like "CARATULA*.doc" } |
        Select-Object -First 1
    if ($null -ne $coverFile) {
        Copy-Item -LiteralPath $coverFile.FullName -Destination (Join-Path $outDir "CARATULA plantilla.doc") -Force
    }
}

function Set-Cell {
    param($sheet, [int]$row, [int]$col, $value, [bool]$bold = $false, [int]$color = -1)
    $cell = $sheet.Cells.Item($row, $col)
    if ($value -is [string]) {
        $cell.FormulaLocal = $value
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

function Build-Workbook {
    param($excel, [string]$xlsmPath, [string]$macroFile)

    $wb = $excel.Workbooks.Add()
    while ($wb.Worksheets.Count -lt 3) {
        $wb.Worksheets.Add() | Out-Null
    }

    $wsBase = $wb.Worksheets.Item(1)
    $wsCalc = $wb.Worksheets.Item(2)
    $wsInfo = $wb.Worksheets.Item(3)
    $wsBase.Name = "Base de datos"
    $wsCalc.Name = "Calculadora"
    $wsInfo.Name = "Informe"

    $blue = 15652797
    $green = 14286809
    $yellow = 10092543

    $wsBase.Range("B1:D1").Merge() | Out-Null
    $wsBase.Range("E1:F1").Merge() | Out-Null
    $wsBase.Range("G1:H1").Merge() | Out-Null
    $wsBase.Range("I1:J1").Merge() | Out-Null
    Set-Cell $wsBase 1 1 "" $true $blue
    Set-Cell $wsBase 1 2 "Dosis" $true $blue
    Set-Cell $wsBase 1 5 "Gramos" $true $blue
    Set-Cell $wsBase 1 7 "Kilogramos" $true $blue
    Set-Cell $wsBase 1 9 "Datos adicionales" $true $blue
    $baseHeaders = @(
        "Sustancias",
        "Peso",
        "Pureza",
        "Precio",
        "Pureza",
        "Precio",
        "Fuerza",
        "Precio",
        "Clasificacion legal",
        "Sustancia no fiscalizada"
    )
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
    for ($r = 0; $r -lt $sampleRows.Count; $r++) {
        for ($c = 0; $c -lt $sampleRows[$r].Count; $c++) {
            Set-Cell $wsBase ($r + 3) ($c + 1) $sampleRows[$r][$c] $false -1
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
            if ($c -eq 1) {
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
    $wsCalc.Columns.Item(12).ColumnWidth = 3
    $wsCalc.Range("A4:O204").Borders.LineStyle = 1
    $wsCalc.Columns.AutoFit() | Out-Null
    $wsCalc.Columns.Item(2).ColumnWidth = 18
    $wsCalc.Columns.Item(3).ColumnWidth = 13
    $wsCalc.Columns.Item(4).ColumnWidth = 18
    $wsCalc.Columns.Item(6).ColumnWidth = 13
    $wsCalc.Columns.Item(7).ColumnWidth = 13
    $wsCalc.Columns.Item(8).ColumnWidth = 13
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
        Set-Cell $wsInfo ($i + 3) 2 "" $false -1
    }
    $wsInfo.Cells.Item(4, 2).Value2 = "JUZGADO DE PRIMERA INSTANCIA E INSTRUCCION N 1 PICASSENT (VALENCIA)"
    $wsInfo.Cells.Item(6, 2).Value2 = "P13498L; C40606T"
    $wsInfo.Cells.Item(14, 2).Value2 = "PRIMER SEMESTRE DEL ANO 2026"
    $wsInfo.Cells.Item(16, 2).Value2 = "a por menor"
    $wsInfo.Columns.Item(1).ColumnWidth = 32
    $wsInfo.Columns.Item(2).ColumnWidth = 78
    $wsInfo.Rows.AutoFit() | Out-Null

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
    $wb.SaveAs($xlsmPath, 52)

    $moduleText = [System.IO.File]::ReadAllText($macroFile, [System.Text.Encoding]::Default)
    $components = $null
    try {
        if ($null -ne $wb.VBProject) {
            $components = $wb.VBProject.VBComponents
        }
    } catch {
        $components = $null
    }
    if ($null -ne $components) {
        $module = $components.Add(1)
        $module.Name = "GeneradorInformesExcel"
        $module.CodeModule.AddFromString($moduleText)
    } else {
        Write-Output "AVISO: Excel no permite insertar la macro automaticamente. Se copia GeneradorInformesExcel.bas para importarlo manualmente."
    }

    $wb.Save()
    $wb.Close($true)
}

$excel = $null
$securityKey = "HKCU:\Software\Microsoft\Office\16.0\Excel\Security"
$hadAccessVbom = $false
$oldAccessVbom = $null
try {
    if (Test-Path $securityKey) {
        $props = Get-ItemProperty -Path $securityKey
        if ($null -ne $props.AccessVBOM) {
            $hadAccessVbom = $true
            $oldAccessVbom = $props.AccessVBOM
        }
    } else {
        New-Item -Path $securityKey -Force | Out-Null
    }
    Set-ItemProperty -Path $securityKey -Name AccessVBOM -Type DWord -Value 1

    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    Build-Workbook $excel $xlsmOut $macroPath
} finally {
    if ($excel -ne $null) {
        try { $excel.Quit() } catch {}
    }
    if ($hadAccessVbom) {
        Set-ItemProperty -Path $securityKey -Name AccessVBOM -Type DWord -Value $oldAccessVbom
    } else {
        Remove-ItemProperty -Path $securityKey -Name AccessVBOM -ErrorAction SilentlyContinue
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

$readme = @"
USO EN EL TRABAJO
=================

1. Copia esta carpeta completa al ordenador del trabajo o al pen drive.
2. Abre calculadora_sustancias_macro.xlsm.
3. Pulsa Habilitar contenido si Excel pregunta por las macros.
4. Rellena las hojas:
   - Base de datos: sustancias, purezas, precios base, precio unidad, clasificacion legal y si entra como fiscalizada.
   - Calculadora: envoltorio, sustancia, pureza, peso neto, riqueza, calificacion y gramos no fiscalizados. La calificacion legal se rellena desde la base de datos al elegir la sustancia.
   - Informe: datos que se sustituyen en la plantilla Word.
5. Pulsa el boton Generar informe Word en la hoja Informe.
6. Los documentos se guardan dentro de la carpeta informes.

IMPORTANTE
==========

- No hace falta ejecutar ningun .bat.
- El Excel usa rutas relativas: busca la plantilla Word en la misma carpeta donde este el Excel.
- La plantilla del informe debe llamarse plantilla_informe_sustancias.docx.
- Si quieres generar caratula, mete en esta misma carpeta un archivo que empiece por CARATULA, por ejemplo CARATULA DIP 52-2026.doc.
- Si quieres generar oficio, deja en esta misma carpeta el archivo Platilla oficio.docx o cualquier Word que contenga "oficio" en el nombre.
- En la caratula, el numero de atestado usa solo lo que hay antes de la barra "/".
- En Base de datos, columna I "Precio Unidad": si tiene precio, se usa para valorar por unidades. En Calculadora se rellena menor dosis/unidades como peso neto x precio unidad.
- En Base de datos, columna K "Sustancia no fiscalizada": con los datos actuales, Si entra en los cuadros verdes de valoracion y No no entra. Las sustancias con No salen en el primer cuadro del Word, pero no en los cuadros verdes.
- Hachis y Ketamina se calculan solo como menor gramos: peso neto x precio gramos. En esos casos no se rellenan mayor, menor dosis ni los cortes.
- Si el ordenador del trabajo bloquea todas las macros por politica de seguridad, Excel tampoco dejara ejecutar este sistema hasta que informatica habilite macros para este archivo o carpeta.

SI EL BOTON NO FUNCIONA PORQUE LA MACRO NO ESTA IMPORTADA
=========================================================

Esto solo hay que hacerlo una vez para que el boton genere tambien el oficio y aplique la nueva regla de sustancias no fiscalizadas:

1. Abre calculadora_sustancias_macro.xlsm.
2. Pulsa ALT + F11.
3. En el menu, pulsa Archivo > Importar archivo.
4. Elige GeneradorInformesExcel.bas, que esta en esta misma carpeta.
5. Guarda el Excel.
6. Vuelve a Excel y pulsa Generar informe Word.
"@

[System.IO.File]::WriteAllText($readmeOut, $readme, [System.Text.UTF8Encoding]::new($false))

$zipName = (Split-Path $OutputRoot -Leaf) + ".zip"
$zipPath = Join-Path $workspace ("outputs_macro\" + $zipName)
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -LiteralPath $outDir -DestinationPath $zipPath -Force

Write-Output "PACKAGE=$outDir"
Write-Output "WORKBOOK=$xlsmOut"
Write-Output "ZIP=$zipPath"
