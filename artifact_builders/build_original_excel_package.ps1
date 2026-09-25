param(
    [string]$SourceWorkbook = "C:\Users\Valeria\Desktop\VALORACION DROGA\DROGRAS.xlsx",
    [string]$SourceTemplate = "C:\Users\Valeria\Desktop\INFORME VALORACION DROGAS  (1).docx",
    [string]$MacroModule = "artifact_builders\GeneradorInformesExcel.bas",
    [string]$OutputRoot = "outputs_macro\PARA_LLEVAR_AL_TRABAJO_EXCEL_ORIGINAL"
)

$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path ".").Path
$outDir = Join-Path $workspace $OutputRoot
$informesDir = Join-Path $outDir "informes"
$sourceWorkbookPath = (Resolve-Path $SourceWorkbook).Path
$sourceTemplatePath = (Resolve-Path $SourceTemplate).Path
$macroPath = (Resolve-Path $MacroModule).Path

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
New-Item -ItemType Directory -Force -Path $informesDir | Out-Null

$templateOut = Join-Path $outDir "plantilla_informe_sustancias.docx"
$xlsmOut = Join-Path $outDir "DROGRAS_macro.xlsm"
$moduleOut = Join-Path $outDir "GeneradorInformesExcel.bas"
$readmeOut = Join-Path $outDir "LEEME_USO.txt"

Copy-Item -LiteralPath $sourceTemplatePath -Destination $templateOut -Force
Copy-Item -LiteralPath $macroPath -Destination $moduleOut -Force

$excel = $null
$wb = $null
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $wb = $excel.Workbooks.Open($sourceWorkbookPath, 0, $false)

    $targetSheet = $null
    foreach ($ws in $wb.Worksheets) {
        $clean = ($ws.Name).Trim().ToUpperInvariant()
        if ($clean -eq "DATOS PARA EL INFORME" -or $clean -eq "INFORME") {
            $targetSheet = $ws
            break
        }
    }
    if ($null -eq $targetSheet) {
        $targetSheet = $wb.Worksheets.Item(1)
    }

    for ($i = $targetSheet.Shapes.Count; $i -ge 1; $i--) {
        if ($targetSheet.Shapes.Item($i).Name -eq "btnGenerarInformeWord") {
            $targetSheet.Shapes.Item($i).Delete()
        }
    }

    $button = $targetSheet.Shapes.AddShape(1, 560, 18, 185, 34)
    $button.Name = "btnGenerarInformeWord"
    $button.TextFrame.Characters().Text = "Generar informe Word"
    $button.TextFrame.Characters().Font.Bold = $true
    $button.TextFrame.Characters().Font.Size = 11
    $button.Fill.ForeColor.RGB = 5287936
    $button.Line.ForeColor.RGB = 26367
    $button.TextFrame.Characters().Font.Color = 16777215
    $button.OnAction = "CrearInformeWordDesdeExcel"

    $targetSheet.Activate() | Out-Null
    $wb.SaveAs($xlsmOut, 52)
    $wb.Close($true)
    $wb = $null
} finally {
    if ($wb -ne $null) {
        try { $wb.Close($false) } catch {}
    }
    if ($excel -ne $null) {
        try { $excel.Quit() } catch {}
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

$readme = @"
USO EN EL TRABAJO
=================

Este paquete usa el Excel original DROGRAS.xlsx como base. No se han rehecho las formulas.

1. Abre DROGRAS_macro.xlsm.
2. Pulsa Habilitar contenido si Excel pregunta por macros.
3. Pulsa ALT + F11.
4. En el menu de Visual Basic, pulsa Archivo > Importar archivo.
5. Elige GeneradorInformesExcel.bas, que esta en esta misma carpeta.
6. Guarda el Excel.
7. Vuelve a Excel, rellena los datos y pulsa Generar informe Word.
8. Los documentos se guardan dentro de la carpeta informes.

IMPORTANTE
==========

- No ejecutes ningun .bat.
- El Excel, la plantilla Word y la caratula deben estar en la misma carpeta.
- La plantilla del informe debe llamarse plantilla_informe_sustancias.docx.
- Si quieres generar caratula, mete en esta misma carpeta un archivo que empiece por CARATULA.
- En la caratula, el numero de atestado usa solo lo que hay antes de la barra "/".
- No importes el .bas mas de una vez. Si Excel dice "nombre ambiguo", borra los modulos duplicados y vuelve a importar solo este.
"@

[System.IO.File]::WriteAllText($readmeOut, $readme, [System.Text.UTF8Encoding]::new($false))

$zipPath = Join-Path $workspace "outputs_macro\PARA_LLEVAR_AL_TRABAJO_EXCEL_ORIGINAL.zip"
if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -LiteralPath $outDir -DestinationPath $zipPath -Force

Write-Output "PACKAGE=$outDir"
Write-Output "WORKBOOK=$xlsmOut"
Write-Output "ZIP=$zipPath"
