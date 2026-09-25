Attribute VB_Name = "GeneradorFixCabecera"
Option Explicit

Public Sub CrearInformeWordDesdeExcelFix()
    On Error GoTo ErrHandler

    Dim paso As String
    paso = "Inicio"

    Dim baseDir As String
    paso = "Leer carpeta del Excel"
    baseDir = ThisWorkbook.Path
    If Len(baseDir) = 0 Then
        MsgBox "Guarda primero el Excel en una carpeta.", vbExclamation
        Exit Sub
    End If

    paso = "Recalcular Excel"
    Application.CalculateFull

    Dim templatePath As String
    paso = "Buscar plantilla Word"
    templatePath = baseDir & "\plantilla_informe_sustancias.docx"
    If Dir(templatePath) = "" Then
        MsgBox "No encuentro la plantilla: " & templatePath, vbCritical
        Exit Sub
    End If

    Dim outputDir As String
    paso = "Preparar carpeta de salida"
    outputDir = baseDir & "\informes"
    EnsureFolder outputDir

    Dim datos As Object
    paso = "Leer hoja Informe"
    Set datos = ReadInformeValues()

    Dim lineas As Collection
    paso = "Leer hoja Calculadora"
    Set lineas = ReadCalculatorLines()
    If lineas.Count = 0 Then
        MsgBox "No hay sustancias con peso en la hoja Calculadora.", vbExclamation
        Exit Sub
    End If

    Dim wordApp As Object
    paso = "Abrir Microsoft Word"
    Set wordApp = CreateObject("Word.Application")
    wordApp.Visible = False

    Dim stamp As String
    stamp = Format(Now, "yyyymmdd_hhnnss")

    Dim reportPath As String
    paso = "Generar informe Word"
    reportPath = BuildReport(wordApp, templatePath, outputDir, stamp, datos, lineas)

    Dim coverPath As String
    coverPath = FindCoverTemplate(baseDir)

    Dim coverOutput As String
    Dim coverError As String
    If Len(coverPath) > 0 Then
        paso = "Generar caratula"
        On Error Resume Next
        coverOutput = BuildCover(wordApp, coverPath, outputDir, stamp, datos)
        If Err.Number <> 0 Then
            coverError = ErrorSummary(Err.Number, Err.Description, Err.Source)
            WriteLog outputDir, "Error generando caratula: " & coverError
            Err.Clear
        End If
        On Error GoTo ErrHandler
    End If

    Dim oficioPath As String
    oficioPath = FindOfficeTemplate(baseDir)

    Dim oficioOutput As String
    Dim oficioError As String
    If Len(oficioPath) > 0 Then
        paso = "Generar oficio"
        On Error Resume Next
        oficioOutput = BuildOffice(wordApp, oficioPath, outputDir, stamp, datos)
        If Err.Number <> 0 Then
            oficioError = ErrorSummary(Err.Number, Err.Description, Err.Source)
            WriteLog outputDir, "Error generando oficio: " & oficioError
            Err.Clear
        End If
        On Error GoTo ErrHandler
    End If

    paso = "Cerrar Word"
    wordApp.Quit
    Set wordApp = Nothing

    Dim message As String
    message = "Documentos generados en:" & vbCrLf & outputDir & vbCrLf & vbCrLf & _
              "Informe: " & Dir(reportPath)
    If Len(coverOutput) > 0 Then
        message = message & vbCrLf & "Caratula: " & Dir(coverOutput)
    ElseIf Len(coverError) > 0 Then
        message = message & vbCrLf & vbCrLf & "Informe generado, pero no se pudo generar la caratula." & _
                  vbCrLf & coverError & vbCrLf & _
                  "Se ha guardado el detalle en informes\log_generador.txt"
    Else
        message = message & vbCrLf & vbCrLf & "No se genero caratula porque no hay archivo CARATULA*.doc* en la carpeta."
    End If
    If Len(oficioOutput) > 0 Then
        message = message & vbCrLf & "Oficio: " & Dir(oficioOutput)
    ElseIf Len(oficioError) > 0 Then
        message = message & vbCrLf & vbCrLf & "No se pudo generar el oficio." & _
                  vbCrLf & oficioError & vbCrLf & _
                  "Se ha guardado el detalle en informes\log_generador.txt"
    Else
        message = message & vbCrLf & "No se genero oficio porque no hay plantilla de oficio en la carpeta."
    End If
    MsgBox message, vbInformation
    Exit Sub

ErrHandler:
    Dim errNum As Long
    Dim errDesc As String
    Dim errSource As String
    errNum = Err.Number
    errDesc = Err.Description
    errSource = Err.Source
    On Error Resume Next
    If Not wordApp Is Nothing Then wordApp.Quit
    If Len(outputDir) > 0 Then WriteLog outputDir, "Error en paso [" & paso & "]: " & ErrorSummary(errNum, errDesc, errSource)
    MsgBox "No se pudo generar el informe." & vbCrLf & _
           "Paso: " & paso & vbCrLf & _
           ErrorSummary(errNum, errDesc, errSource) & vbCrLf & vbCrLf & _
           "Si existe, revisa informes\log_generador.txt", vbCritical
End Sub

Private Function BuildReport(ByVal wordApp As Object, ByVal templatePath As String, ByVal outputDir As String, ByVal stamp As String, ByVal datos As Object, ByVal lineas As Collection) As String
    Dim doc As Object
    Set doc = wordApp.Documents.Open(templatePath)

    Dim fechaDia As String
    fechaDia = Format(Date, "dd/mm/yyyy")

    Dim fechaInforme As String
    fechaInforme = GetInformeValue(datos, "FECHA INFORME ANALITICO")
    If Len(Trim$(fechaInforme)) = 0 Then fechaInforme = fechaDia

    Dim gramosNoFiscalizado As Double
    Dim i As Long
    For i = 1 To lineas.Count
        gramosNoFiscalizado = gramosNoFiscalizado + CDbl(lineas(i)("GramosNoFiscalizado"))
    Next i

    Dim numeroOrden As String
    numeroOrden = GetInformeValue(datos, "Numero de orden")
    If Len(Trim$(numeroOrden)) = 0 Or gramosNoFiscalizado <= 0 Then
        RemoveParagraphContaining doc, "En el decomiso con"
    End If

    Dim firstLine As Object
    Set firstLine = lineas(1)

    Dim diligenciaPrevia As String
    diligenciaPrevia = GetDiligenciaPrevia(datos)

    Dim dniInforme As String
    dniInforme = Parenthesize(GetInformeValue(datos, "DNI PRESO"))

    Dim numeroAtestado As String
    numeroAtestado = GetInformeValue(datos, "NUMERO ATESTADO")

    ReplaceDocText doc, "[[EXPTE_INFORME_ANALITICO]]", GetInformeValue(datos, "EXPTE INFORME ANALITICO")
    ReplaceDocText doc, "[[AUTORIDAD_JUDICIAL]]", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "[[PROCEDIMIENTO]]", diligenciaPrevia
    ReplaceDocText doc, "[[TIP]]", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "[[FECHA_OFICIO]]", GetInformeValue(datos, "Fecha del oficio")
    ReplaceDocText doc, "[[NOMBRE_PRESO]]", GetInformeValue(datos, "NOMBRE PRESO")
    ReplaceDocText doc, "[[DNI_PRESO]]", dniInforme
    ReplaceDocText doc, "[[NUMERO_ATESTADO]]", numeroAtestado
    ReplaceDocText doc, "[[FECHA_ATESTADO]]", GetInformeValue(datos, "FECHA ATESTADO")
    ReplaceDocText doc, "[[FECHA_DEPOSITO_SUSTANCIA]]", GetInformeValue(datos, "Fecha de deposito de la sustancia")
    ReplaceDocText doc, "[[FECHA_INFORME_ANALITICO]]", fechaInforme
    ReplaceDocText doc, "[[SEMESTRE]]", GetInformeValue(datos, "Semestre")
    ReplaceDocText doc, "[[NUMERO_ORDEN]]", numeroOrden
    ReplaceDocText doc, "[[TIPO_VENTA]]", GetInformeValue(datos, "Tipo de venta")

    ReplaceDocText doc, "(EXPTE INFORME ANALITICO)", GetInformeValue(datos, "EXPTE INFORME ANALITICO")
    ReplaceDocText doc, "(DATOS A RELLENAS DESDE EXCEL INFORME)", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "(NUMERO DE PROCEDIMIENTO)", diligenciaPrevia
    ReplaceDocText doc, "(NÚMERO DE PROCEDIMIENTO)", diligenciaPrevia
    ReplaceDocText doc, "(numero de procedimiento)", diligenciaPrevia
    ReplaceDocText doc, "(número de diligencia)", diligenciaPrevia
    ReplaceDocText doc, "(numero de diligencia)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia)", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "(Fecha del día)", fechaDia
    ReplaceDocText doc, "(rellenar con T.I.P)", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "(Fecha del oficio)", GetInformeValue(datos, "Fecha del oficio")
    ReplaceDocText doc, "(nombre del preso)", GetInformeValue(datos, "NOMBRE PRESO")
    ReplaceDocText doc, "(Nombre preso)", GetInformeValue(datos, "NOMBRE PRESO")
    ReplaceDocText doc, "((dni))", dniInforme
    ReplaceDocText doc, "(dni)", dniInforme
    ReplaceDocText doc, "(dni del preso)", dniInforme
    ReplaceDocText doc, "(número atestado)", numeroAtestado
    ReplaceDocText doc, "(numero atestado)", numeroAtestado
    ReplaceDocText doc, "(fecha atestado)", GetInformeValue(datos, "FECHA ATESTADO")
    ReplaceDocText doc, "(fecha de la sustancia)", GetInformeValue(datos, "Fecha de deposito de la sustancia")
    ReplaceDocText doc, "(fecha informe anatilitico)", fechaInforme
    ReplaceDocText doc, "(fecha informe analitico)", fechaInforme
    ReplaceDocText doc, "((semestre))", GetInformeValue(datos, "Semestre")
    ReplaceDocText doc, "(semestre)", GetInformeValue(datos, "Semestre")
    ReplaceDocText doc, "(número de orden)", numeroOrden
    ReplaceDocText doc, "(tipo de venta)", GetInformeValue(datos, "Tipo de venta")
    ReplaceDocText doc, "(Gramos no fiscalizado)", FormatDecimal(gramosNoFiscalizado)
    ReplaceDocText doc, "(Sustancia 1)", CStr(firstLine("Sustancia"))
    ReplaceLooseReportFields doc, diligenciaPrevia, dniInforme, numeroAtestado, fechaDia, fechaInforme, GetInformeValue(datos, "T.I.P."), GetInformeValue(datos, "Fecha del oficio"), GetInformeValue(datos, "NOMBRE PRESO"), GetInformeValue(datos, "FECHA ATESTADO"), GetInformeValue(datos, "Fecha de deposito de la sustancia"), GetInformeValue(datos, "Semestre")
    ForceReportFieldReplacements doc, diligenciaPrevia, numeroAtestado, fechaDia
    RemoveDecomisoQuotes doc

    Dim semestreTabla As String
    semestreTabla = UCase$(GetInformeValue(datos, "Semestre"))
    If Len(Trim$(semestreTabla)) = 0 Then semestreTabla = "SEMESTRE"

    RebuildValuesTable doc, lineas
    RebuildOcneTable doc, lineas, semestreTabla
    RebuildDeliveryTable doc, lineas

    BuildReport = outputDir & "\informe_sustancias_" & stamp & ".docx"
    doc.SaveAs2 BuildReport
    doc.Close False
End Function

Private Function BuildCover(ByVal wordApp As Object, ByVal coverPath As String, ByVal outputDir As String, ByVal stamp As String, ByVal datos As Object) As String
    Dim doc As Object
    Set doc = wordApp.Documents.Open(coverPath)

    Dim fechaInforme As String
    fechaInforme = Format(Date, "dd/mm/yyyy")

    Dim yearText As String
    yearText = CStr(Year(Date))

    Dim atestado As String
    atestado = BeforeSlash(GetInformeValue(datos, "NUMERO ATESTADO"))

    Dim diligenciaPrevia As String
    diligenciaPrevia = GetDiligenciaPrevia(datos)

    Dim diligencias As String
    diligencias = "ATESTADO INSTRUIDO POR PUESTO PRINCIPAL DE PICASSENT " & yearText & "-2276-" & atestado
    
    Dim diligenciasCentro As String
    diligenciasCentro = "ATESTADO INSTRUIDO POR FUNCIONARIOS DEL CENTRO PENITENCIARIO ANTONI ASUNCION HERNANDEZ DE PICASSENT " & atestado

    ReplaceDocText doc, "(ATESTADO INSTRUIDO POR PUESTO PRINCIPAL DE PICASSSENT (año actual)-2276-(número atestado))", diligencias
    ReplaceDocText doc, "(ATESTADO INSTRUIDO POR PUESTO PRINCIPAL DE PICASSENT (año actual)-2276-(número atestado))", diligencias
    ReplaceDocText doc, "(ATESTADO INSTRUIDO POR FUNCIONARIOS DEL CENTRO PENITENCIARIO ANTONI ASUNCION HERNANDEZ DE PICASSENT (numero atestado)", diligenciasCentro
    ReplaceDocText doc, "PICASSSENT", "PICASSENT"
    ReplaceDocText doc, "(fecha del día)", fechaInforme
    ReplaceDocText doc, "(fecha del dia)", fechaInforme
    ReplaceDocText doc, "(aquí se pone el tip)", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "(aquí va el tip)", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "(aqui se pone el tip)", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "(aqui va el tip)", GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "(año actual)", yearText
    ReplaceDocText doc, "(aquí el año)", yearText
    ReplaceDocText doc, "(ano actual)", yearText
    ReplaceDocText doc, "(aqui el ano)", yearText
    ReplaceDocText doc, "(numero atestado)", atestado
    ReplaceDocText doc, "(número atestado)", atestado
    ReplaceDocText doc, "(número del atestado)", atestado
    ReplaceDocText doc, "(numero del atestado)", atestado
    ReplaceDocText doc, "(autoridad judicial)", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "(juzgado)", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "(diligencia previas", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "20/12/2023", fechaInforme
    ReplaceDocText doc, "TIP U87349D", "TIP " & GetInformeValue(datos, "T.I.P.")
    ReplaceDocText doc, "2022-002276-003301", GetInformeValue(datos, "EXPTE INFORME ANALITICO")
    ReplaceDocText doc, "PRIMERA INSTANCIA E INSTRUCCIÓN Nº 2 DE PICASSENT", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "PRIMERA INSTANCIA E INSTRUCCION Nº 2 DE PICASSENT", GetInformeValue(datos, "AUTORIDAD JUDICIAL")
    ReplaceDocText doc, "000828/2023", diligenciaPrevia
    ReplaceLooseCoverFields doc, fechaInforme, GetInformeValue(datos, "T.I.P."), yearText, atestado, GetInformeValue(datos, "AUTORIDAD JUDICIAL"), diligenciaPrevia
    ForceCoverFieldReplacements doc, GetInformeValue(datos, "T.I.P."), yearText, atestado, diligenciaPrevia, fechaInforme

    BuildCover = outputDir & "\caratula_" & stamp & ".docx"
    doc.SaveAs2 BuildCover, 16
    doc.Close False
End Function

Private Function BuildOffice(ByVal wordApp As Object, ByVal officePath As String, ByVal outputDir As String, ByVal stamp As String, ByVal datos As Object) As String
    Dim doc As Object
    Set doc = wordApp.Documents.Open(officePath)

    Dim fechaOficio As String
    fechaOficio = Format(Date, "dd/mm/yyyy")

    Dim diligenciaPrevia As String
    diligenciaPrevia = GetDiligenciaPrevia(datos)

    ReplaceDocText doc, "(fecha del dia)", fechaOficio
    ReplaceDocText doc, "(fecha del día)", fechaOficio
    ReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
    ReplaceDocText doc, "(semestre)", GetInformeValue(datos, "Semestre")
    ReplaceDocText doc, "(nombre del preso)", GetInformeValue(datos, "NOMBRE PRESO")
    ReplaceDocText doc, "(dni del preso)", Parenthesize(GetInformeValue(datos, "DNI PRESO"))
    ReplaceLooseOfficeFields doc, fechaOficio, diligenciaPrevia, GetInformeValue(datos, "Semestre"), GetInformeValue(datos, "NOMBRE PRESO"), Parenthesize(GetInformeValue(datos, "DNI PRESO"))
    ForceOfficeFieldReplacements doc, fechaOficio, diligenciaPrevia

    BuildOffice = outputDir & "\oficio_" & stamp & ".docx"
    doc.SaveAs2 BuildOffice, 16
    doc.Close False
End Function

Private Function ReadInformeValues() As Object
    Dim d As Object
    Set d = CreateObject("Scripting.Dictionary")
    d.CompareMode = 1

    Dim ws As Worksheet
    Set ws = GetWorksheetByAnyName(Array("Informe", "Datos para el informe", "Datos informe"))

    Dim r As Long
    For r = 3 To 16
        If Len(Trim$(CStr(ws.Cells(r, 1).Value))) > 0 Then
            d(NormalizeKey(CStr(ws.Cells(r, 1).Value))) = FormatCellValue(ws.Cells(r, 2))
        End If
    Next r
    Set ReadInformeValues = d
End Function

Private Function ReadBaseRows() As Object
    Dim rows As Object
    Set rows = CreateObject("Scripting.Dictionary")
    rows.CompareMode = 1

    Dim ws As Worksheet
    Set ws = GetWorksheetByAnyName(Array("Base de datos", "BASE DE DATOS"))

    Dim r As Long
    For r = 3 To 202
        Dim name As String
        name = Trim$(CStr(ws.Cells(r, 1).Value))
        If Len(name) > 0 Then
            Dim item As Object
            Set item = CreateObject("Scripting.Dictionary")
            item("Peso") = NumberValue(ws.Cells(r, 2).Value)
            item("DosisPureza") = NumberValue(ws.Cells(r, 3).Value)
            item("DosisPrecio") = NumberValue(ws.Cells(r, 4).Value)
            item("GramosPureza") = NumberValue(ws.Cells(r, 5).Value)
            item("GramosPrecio") = NumberValue(ws.Cells(r, 6).Value)
            item("KilosPureza") = NumberValue(ws.Cells(r, 7).Value)
            item("KilosPrecio") = NumberValue(ws.Cells(r, 8).Value)
            item("PrecioUnidad") = NumberValue(ws.Cells(r, 9).Value)
            item("Calificacion") = CStr(ws.Cells(r, 10).Value)
            item("NoFiscalizada") = IsNoFiscalizadaText(CStr(ws.Cells(r, 11).Value), CStr(ws.Cells(r, 10).Value))
            Set rows(NormalizeKey(name)) = item
        End If
    Next r
    Set ReadBaseRows = rows
End Function

Private Function ReadCalculatorLines() As Collection
    Dim result As New Collection
    Dim baseRows As Object
    Set baseRows = ReadBaseRows()

    Dim ws As Worksheet
    Set ws = GetWorksheetByAnyName(Array("Calculadora", "Calculadora "))

    Dim datos As Object
    Set datos = ReadInformeValues()

    Dim tipoVenta As String
    tipoVenta = LCase$(GetInformeValue(datos, "Tipo de venta"))

    Dim r As Long
    For r = 5 To 204
        Dim sustancia As String
        sustancia = Trim$(CStr(ws.Cells(r, 2).Value))
        If Len(sustancia) > 0 And IsNumeric(ws.Cells(r, 5).Value) Then
            Dim peso As Double
            peso = CDbl(ws.Cells(r, 5).Value)

            Dim base As Object
            Set base = FindBaseItem(baseRows, sustancia)

            Dim registro As Object
            Set registro = CreateObject("Scripting.Dictionary")
            registro("Envoltorio") = CStr(ws.Cells(r, 1).Value)
            registro("Sustancia") = sustancia
            registro("SustanciaIdentificada") = CStr(ws.Cells(r, 4).Value)
            If Len(Trim$(CStr(registro("SustanciaIdentificada")))) = 0 Then registro("SustanciaIdentificada") = sustancia
            registro("Calificacion") = CStr(ws.Cells(r, 10).Value)
            registro("Peso") = peso
            registro("NoFiscalizada") = False
            registro("SoloMenorGramos") = IsSoloMenorGramosSustancia(sustancia)
            registro("SoloPrecioUnidad") = False

            Dim pureza As Double
            Dim riqueza As Double
            Dim dosisPeso As Double
            Dim dosisPureza As Double
            Dim dosisPrecio As Double
            Dim gramosPureza As Double
            Dim gramosPrecio As Double
            Dim kilosPureza As Double
            Dim kilosPrecio As Double
            Dim precioUnidad As Double
            If Not base Is Nothing Then
                dosisPeso = CDbl(base("Peso"))
                dosisPureza = CDbl(base("DosisPureza"))
                dosisPrecio = CDbl(base("DosisPrecio"))
                gramosPureza = CDbl(base("GramosPureza"))
                gramosPrecio = CDbl(base("GramosPrecio"))
                kilosPureza = CDbl(base("KilosPureza"))
                kilosPrecio = CDbl(base("KilosPrecio"))
                precioUnidad = CDbl(base("PrecioUnidad"))
                pureza = dosisPureza
                riqueza = kilosPureza
                registro("NoFiscalizada") = CBool(base("NoFiscalizada"))
                registro("SoloPrecioUnidad") = (precioUnidad > 0 And Not CBool(registro("SoloMenorGramos")))
                If Len(Trim$(CStr(registro("Calificacion")))) = 0 Then registro("Calificacion") = CStr(base("Calificacion"))
            End If
            If IsNumeric(ws.Cells(r, 3).Value) Then pureza = CDbl(ws.Cells(r, 3).Value)
            If IsNumeric(ws.Cells(r, 9).Value) Then riqueza = CDbl(ws.Cells(r, 9).Value)

            Dim deCorte1 As Double
            Dim deCorte2 As Double
            Dim deCorte3 As Double
            deCorte1 = SafeDivide(peso * pureza, kilosPureza)
            deCorte2 = SafeDivide(peso * pureza, gramosPureza)
            deCorte3 = SafeDivide(SafeDivide(peso * pureza, dosisPureza) * 1000, dosisPeso)

            Dim mayor As Double
            Dim menorGramos As Double
            Dim menorDosis As Double
            If CBool(registro("SoloMenorGramos")) Then
                mayor = 0
                menorGramos = peso * gramosPrecio
                menorDosis = 0
                deCorte1 = 0
                deCorte2 = 0
                deCorte3 = 0
            ElseIf CBool(registro("SoloPrecioUnidad")) Then
                mayor = 0
                menorGramos = 0
                menorDosis = peso * precioUnidad
                deCorte1 = 0
                deCorte2 = 0
                deCorte3 = 0
            Else
                mayor = SafeDivide(deCorte1 * kilosPrecio, 1000)
                menorGramos = deCorte2 * gramosPrecio
                menorDosis = deCorte3 * dosisPrecio
            End If

            registro("PurezaInforme") = pureza
            registro("Riqueza") = riqueza
            registro("DosisPeso") = dosisPeso
            registro("DosisPureza") = dosisPureza
            registro("DosisPrecio") = dosisPrecio
            registro("GramosPureza") = gramosPureza
            registro("GramosPrecio") = gramosPrecio
            registro("KilosPureza") = kilosPureza
            registro("KilosPrecio") = kilosPrecio
            registro("PrecioUnidad") = precioUnidad
            registro("Mayor") = mayor
            registro("MenorGramos") = menorGramos
            registro("MenorDosis") = menorDosis
            If CBool(registro("SoloPrecioUnidad")) Then
                registro("Precio") = precioUnidad
                registro("Total") = menorDosis
            ElseIf InStr(tipoVenta, "dosis") > 0 Or InStr(tipoVenta, "unidad") > 0 Then
                registro("Precio") = dosisPrecio
                registro("Total") = menorDosis
            ElseIf InStr(tipoVenta, "mayor") > 0 Then
                registro("Precio") = kilosPrecio
                registro("Total") = mayor
            Else
                registro("Precio") = gramosPrecio
                registro("Total") = menorGramos
            End If
            registro("GramosNoFiscalizado") = NumberValue(ws.Cells(r, 11).Value)
            If CDbl(registro("GramosNoFiscalizado")) > 0 Then registro("NoFiscalizada") = True
            If IsNoFiscalizadaText("", CStr(registro("Calificacion"))) Then registro("NoFiscalizada") = True
            result.Add registro
        End If
    Next r
    Set ReadCalculatorLines = result
End Function

Private Sub RebuildDeliveryTable(ByVal doc As Object, ByVal lineas As Collection)
    If doc.Tables.Count < 2 Then Exit Sub
    Dim t As Object
    Set t = ReplaceTableAtIndex(doc, 2, lineas.Count + 1, 3)
    SetGeneratedTableStyle t, Array(5#, 3.5, 9.7), 10.5, 0.48
    SetGeneratedCell t.Cell(1, 1), "Sustancia entregada", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(1, 2), "Peso Neto", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(1, 3), "Sustancia identificada, Riqueza, Calificación legal", "#BDD7EE", True, 1

    Dim i As Long
    For i = 1 To lineas.Count
        Dim registro As Object
        Set registro = lineas(i)
        SetGeneratedCell t.Cell(i + 1, 1), CStr(registro("Envoltorio")), "", False, 0
        SetGeneratedCell t.Cell(i + 1, 2), FormatDecimal(CDbl(registro("Peso"))), "", False, 1
        SetGeneratedCell t.Cell(i + 1, 3), DeliveryDescription(registro), "", False, 0
    Next i
End Sub

Private Sub RebuildOcneTable(ByVal doc As Object, ByVal lineas As Collection, ByVal semestre As String)
    If doc.Tables.Count < 3 Then Exit Sub
    Dim dataRows As Long
    dataRows = FiscalizedLineCount(lineas)
    If dataRows = 0 Then dataRows = 1
    Dim t As Object
    Set t = ReplaceTableAtIndex(doc, 3, dataRows + 3, 9)
    SetGeneratedTableStyle t, Array(2.7, 1.7, 1.75, 2#, 1.75, 2#, 1.75, 2.7, 1.85), 9.5, 0.55

    SetGeneratedCell t.Cell(1, 1), semestre, "#BDD7EE", True, 1
    t.Cell(1, 1).Merge t.Cell(1, 9)
    SetGeneratedCell t.Cell(2, 1), "", "#D9F8D9", True, 1
    SetGeneratedCell t.Cell(2, 2), "DOSIS" & vbCr & "(Venta al por MENOR)", "#D9F8D9", True, 1
    t.Cell(2, 2).Merge t.Cell(2, 4)
    SetGeneratedCell t.Cell(2, 3), "GRAMOS" & vbCr & "(Venta al MENOR)", "#D9F8D9", True, 1
    t.Cell(2, 3).Merge t.Cell(2, 4)
    SetGeneratedCell t.Cell(2, 4), "KILOGRAMOS" & vbCr & "(Venta al MAYOR)", "#D9F8D9", True, 1
    t.Cell(2, 4).Merge t.Cell(2, 5)
    SetGeneratedCell t.Cell(2, 5), "UNIDAD", "#D9F8D9", True, 1

    Dim headers As Variant
    headers = Array("TIPO DE" & vbCr & "SUSTANCIA", "PESO", "PUREZA", "PRECIO", "PUREZA", "PRECIO", "PUREZA", "PRECIO", "PRECIO")
    Dim c As Long
    For c = 1 To 9
        SetGeneratedCell t.Cell(3, c), CStr(headers(c - 1)), "#D9F8D9", True, 1
    Next c

    Dim i As Long
    Dim rowIndex As Long
    rowIndex = 4
    For i = 1 To lineas.Count
        Dim registro As Object
        Set registro = lineas(i)
        If IsLineNoFiscalizada(registro) Then GoTo NextOcneLine
        Dim r As Long
        r = rowIndex
        SetGeneratedCell t.Cell(r, 1), CStr(registro("Sustancia")), "#D9F8D9", False, 0
        If IsLineSoloMenorGramos(registro) Then
            SetGeneratedCell t.Cell(r, 2), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 3), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 4), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 5), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 6), FormatEuro(CDbl(registro("MenorGramos"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 7), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 8), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 9), "-", "#D9F8D9", False, 1
        ElseIf IsLineSoloPrecioUnidad(registro) Then
            SetGeneratedCell t.Cell(r, 2), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 3), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 4), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 5), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 6), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 7), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 8), "-", "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 9), FormatEuro(CDbl(registro("PrecioUnidad"))), "#D9F8D9", False, 1
        Else
            SetGeneratedCell t.Cell(r, 2), FormatDecimal(CDbl(registro("DosisPeso"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 3), FormatPercent(CDbl(registro("DosisPureza"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 4), FormatEuro(CDbl(registro("DosisPrecio"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 5), FormatPercent(CDbl(registro("GramosPureza"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 6), FormatEuro(CDbl(registro("GramosPrecio"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 7), FormatPercent(CDbl(registro("KilosPureza"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 8), FormatEuro(CDbl(registro("KilosPrecio"))), "#D9F8D9", False, 1
            SetGeneratedCell t.Cell(r, 9), FormatEuro(CDbl(registro("Precio"))), "#D9F8D9", False, 1
        End If
        rowIndex = rowIndex + 1
NextOcneLine:
    Next i
    If FiscalizedLineCount(lineas) = 0 Then FillEmptyRow t, 4, 9, "#D9F8D9"
End Sub

Private Sub RebuildValuesTable(ByVal doc As Object, ByVal lineas As Collection)
    If doc.Tables.Count < 4 Then Exit Sub
    Dim dataRows As Long
    dataRows = FiscalizedLineCount(lineas)
    If dataRows = 0 Then dataRows = 1
    Dim t As Object
    Set t = ReplaceTableAtIndex(doc, 4, dataRows + 2, 6)
    SetGeneratedTableStyle t, Array(3.5, 3.1, 2.3, 2.7, 2.8, 3.8), 10, 0.58

    SetGeneratedCell t.Cell(1, 1), "", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(1, 2), "PESO" & vbCr & "(EN GRAMOS)" & vbCr & "/ UNIDADES", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(1, 3), "PUREZA" & vbCr & "%", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(1, 4), "VALOR (" & ChrW(8364) & ") DE LA SUSTANCIA AL POR", "#BDD7EE", True, 1
    t.Cell(1, 4).Merge t.Cell(1, 6)

    SetGeneratedCell t.Cell(2, 1), "TIPO DE SUSTANCIA", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(2, 2), "PESO" & vbCr & "(EN GRAMOS)" & vbCr & "/ UNIDADES", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(2, 3), "PUREZA" & vbCr & "%", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(2, 4), "MAYOR" & vbCr & "(KGS)", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(2, 5), "MENOR" & vbCr & "(GRAMOS)", "#BDD7EE", True, 1
    SetGeneratedCell t.Cell(2, 6), "MENOR" & vbCr & "(DOSIS / UNIDADES)", "#BDD7EE", True, 1

    Dim i As Long
    Dim rowIndex As Long
    rowIndex = 3
    For i = 1 To lineas.Count
        Dim registro As Object
        Set registro = lineas(i)
        If IsLineNoFiscalizada(registro) Then GoTo NextValuesLine
        Dim r As Long
        r = rowIndex
        SetGeneratedCell t.Cell(r, 1), CStr(registro("Sustancia")), "#C6F6C6", False, 1
        SetGeneratedCell t.Cell(r, 2), FormatDecimal(CDbl(registro("Peso"))), "#C6F6C6", False, 1
        If IsLineSoloMenorGramos(registro) Or IsLineSoloPrecioUnidad(registro) Then
            SetGeneratedCell t.Cell(r, 3), "-", "#C6F6C6", False, 1
            SetGeneratedCell t.Cell(r, 4), "-", "#C6F6C6", False, 1
        Else
            SetGeneratedCell t.Cell(r, 3), FormatPercent(CDbl(registro("PurezaInforme"))), "#C6F6C6", False, 1
            SetGeneratedCell t.Cell(r, 4), FormatEuro(CDbl(registro("Mayor"))), "#C6F6C6", False, 1
        End If
        If IsLineSoloPrecioUnidad(registro) Then
            SetGeneratedCell t.Cell(r, 5), "-", "#C6F6C6", False, 1
        Else
            SetGeneratedCell t.Cell(r, 5), FormatEuro(CDbl(registro("MenorGramos"))), "#C6F6C6", False, 1
        End If
        If IsLineSoloMenorGramos(registro) Then
            SetGeneratedCell t.Cell(r, 6), "-", "#C6F6C6", False, 1
        Else
            SetGeneratedCell t.Cell(r, 6), FormatEuro(CDbl(registro("MenorDosis"))), "#C6F6C6", False, 1
        End If
        rowIndex = rowIndex + 1
NextValuesLine:
    Next i
    If FiscalizedLineCount(lineas) = 0 Then FillEmptyRow t, 3, 6, "#C6F6C6"
End Sub

Private Function FiscalizedLineCount(ByVal lineas As Collection) As Long
    Dim i As Long
    For i = 1 To lineas.Count
        If Not IsLineNoFiscalizada(lineas(i)) Then FiscalizedLineCount = FiscalizedLineCount + 1
    Next i
End Function

Private Function IsLineNoFiscalizada(ByVal registro As Object) As Boolean
    If registro.Exists("NoFiscalizada") Then IsLineNoFiscalizada = CBool(registro("NoFiscalizada")) Else IsLineNoFiscalizada = False
End Function

Private Function IsLineSoloMenorGramos(ByVal registro As Object) As Boolean
    If registro.Exists("SoloMenorGramos") Then IsLineSoloMenorGramos = CBool(registro("SoloMenorGramos")) Else IsLineSoloMenorGramos = False
End Function

Private Function IsLineSoloPrecioUnidad(ByVal registro As Object) As Boolean
    If registro.Exists("SoloPrecioUnidad") Then IsLineSoloPrecioUnidad = CBool(registro("SoloPrecioUnidad")) Else IsLineSoloPrecioUnidad = False
End Function

Private Function DeliveryDescription(ByVal registro As Object) As String
    Dim result As String
    result = CStr(registro("SustanciaIdentificada"))
    If Not IsLineNoFiscalizada(registro) And CDbl(registro("Riqueza")) > 0 Then result = AppendPart(result, FormatPercent(CDbl(registro("Riqueza"))))
    If Len(Trim$(CStr(registro("Calificacion")))) > 0 Then result = AppendPart(result, CStr(registro("Calificacion")))
    If IsLineNoFiscalizada(registro) Then result = AppendPart(result, "No fiscalizada")
    DeliveryDescription = result
End Function

Private Function AppendPart(ByVal baseText As String, ByVal extraText As String) As String
    If Len(Trim$(extraText)) = 0 Then
        AppendPart = baseText
    ElseIf Len(Trim$(baseText)) = 0 Then
        AppendPart = extraText
    Else
        AppendPart = baseText & ", " & extraText
    End If
End Function

Private Sub FillEmptyRow(ByVal t As Object, ByVal rowIndex As Long, ByVal cols As Long, ByVal fill As String)
    Dim c As Long
    For c = 1 To cols
        SetGeneratedCell t.Cell(rowIndex, c), "-", fill, False, 1
    Next c
End Sub

Private Function ReplaceTableAtIndex(ByVal doc As Object, ByVal index As Long, ByVal rows As Long, ByVal cols As Long) As Object
    Dim oldTable As Object
    Set oldTable = doc.Tables(index)
    Dim rng As Object
    Set rng = oldTable.Range.Duplicate
    oldTable.Delete
    Set ReplaceTableAtIndex = doc.Tables.Add(rng, rows, cols)
End Function

Private Sub SetGeneratedTableStyle(ByVal t As Object, ByVal widths As Variant, ByVal fontSize As Double, ByVal minRowHeightCm As Double)
    On Error Resume Next
    t.Borders.Enable = True
    t.Range.Font.Name = "Arial"
    t.Range.Font.Size = fontSize
    t.Range.ParagraphFormat.SpaceBefore = 0
    t.Range.ParagraphFormat.SpaceAfter = 0
    t.AllowAutoFit = False
    t.Rows.Alignment = 1
    t.PreferredWidthType = 3
    t.PreferredWidth = CmToPoints(18.2)
    t.TopPadding = 2
    t.BottomPadding = 2
    t.LeftPadding = 3
    t.RightPadding = 3
    Dim i As Long
    For i = LBound(widths) To UBound(widths)
        t.Columns(i + 1).SetWidth CmToPoints(CDbl(widths(i))), 0
    Next i
    t.Rows.HeightRule = 1
    t.Rows.Height = CmToPoints(minRowHeightCm)
    t.AutoFitBehavior 0
    On Error GoTo 0
End Sub

Private Sub SetGeneratedCell(ByVal cell As Object, ByVal text As String, ByVal fill As String, ByVal bold As Boolean, ByVal align As Long)
    cell.Range.Text = text
    cell.Range.Font.Bold = IIf(bold, 1, 0)
    cell.Range.ParagraphFormat.Alignment = align
    cell.VerticalAlignment = 1
    If Len(fill) > 0 Then cell.Shading.BackgroundPatternColor = WordColor(fill)
End Sub

Private Sub RemoveDecomisoQuotes(ByVal doc As Object)
    Dim i As Long
    For i = 1 To doc.Paragraphs.Count
        Dim txt As String
        txt = doc.Paragraphs(i).Range.Text
        If InStr(1, txt, "En el decomiso con", vbTextCompare) > 0 Then
            txt = Replace(txt, ChrW(&H201C), "")
            txt = Replace(txt, ChrW(&H201D), "")
            txt = Replace(txt, """", "")
            doc.Paragraphs(i).Range.Text = txt
        End If
    Next i
End Sub

Private Sub ReplaceCoverAtestadoBlock(ByVal doc As Object, ByVal diligencias As String)
    Dim i As Long
    For i = 1 To doc.Paragraphs.Count
        Dim txt As String
        txt = doc.Paragraphs(i).Range.Text
        Dim startPos As Long
        startPos = InStr(1, txt, "(ATESTADO INSTRUIDO", vbTextCompare)
        If startPos > 0 Then
            Dim endPos As Long
            endPos = InStr(startPos, txt, ")")
            If endPos > startPos Then
                ReplaceDocText doc, Mid$(txt, startPos, endPos - startPos + 1), diligencias
                Exit Sub
            End If
        End If
    Next i
End Sub

Private Sub RemoveParagraphContaining(ByVal doc As Object, ByVal needle As String)
    Dim i As Long
    For i = doc.Paragraphs.Count To 1 Step -1
        If InStr(1, doc.Paragraphs(i).Range.Text, needle, vbTextCompare) > 0 Then
            doc.Paragraphs(i).Range.Delete
        End If
    Next i
End Sub

Private Sub ReplaceDocText(ByVal doc As Object, ByVal findText As String, ByVal replaceText As String)
    ReplaceDocTextEverywhere doc, findText, replaceText, False
End Sub

Private Sub ReplaceDocTextWildcard(ByVal doc As Object, ByVal findText As String, ByVal replaceText As String)
    ReplaceDocTextEverywhere doc, findText, replaceText, True
End Sub

Private Sub ReplaceDocTextEverywhere(ByVal doc As Object, ByVal findText As String, ByVal replaceText As String, ByVal useWildcards As Boolean)
    On Error Resume Next
    Dim story As Object
    For Each story In doc.StoryRanges
        Dim rng As Object
        Set rng = story
        Do While Not rng Is Nothing
            ReplaceInRange rng, findText, replaceText, useWildcards
            ReplaceInShapes rng.ShapeRange, findText, replaceText, useWildcards
            Set rng = rng.NextStoryRange
        Loop
    Next story
    ReplaceInShapes doc.Shapes, findText, replaceText, useWildcards
    On Error GoTo 0
End Sub

Private Sub ReplaceInRange(ByVal rng As Object, ByVal findText As String, ByVal replaceText As String, ByVal useWildcards As Boolean)
    With rng.Find
        .ClearFormatting
        .Replacement.ClearFormatting
        .Text = findText
        .Replacement.Text = replaceText
        .Forward = True
        .Wrap = 1
        .Format = False
        .MatchCase = False
        .MatchWholeWord = False
        .MatchWildcards = useWildcards
        .Execute Replace:=2
    End With
End Sub

Private Sub ReplaceInShapes(ByVal shapes As Object, ByVal findText As String, ByVal replaceText As String, ByVal useWildcards As Boolean)
    On Error Resume Next
    Dim shape As Object
    For Each shape In shapes
        If shape.TextFrame.HasText Then ReplaceInRange shape.TextFrame.TextRange, findText, replaceText, useWildcards
        If shape.Type = 6 Then ReplaceInShapes shape.GroupItems, findText, replaceText, useWildcards
    Next shape
    On Error GoTo 0
End Sub

Private Sub ReplaceLooseReportFields(ByVal doc As Object, ByVal procedimiento As String, ByVal dniInforme As String, ByVal atestado As String, ByVal fechaDia As String, ByVal fechaInformeAnalitico As String, ByVal tip As String, ByVal fechaOficio As String, ByVal nombrePreso As String, ByVal fechaAtestado As String, ByVal fechaDeposito As String, ByVal semestre As String)
    ReplaceDocTextWildcard doc, "\([!\)]@PROCEDIMIENTO[!\)]@\)", procedimiento
    ReplaceDocTextWildcard doc, "\([!\)]@diligencia[!\)]@\)", procedimiento
    ReplaceDocTextWildcard doc, "\([!\)]@dni[!\)]@\)", dniInforme
    ReplaceDocTextWildcard doc, "\([!\)]@mero[!\)]@atestado[!\)]@\)", atestado
    ReplaceDocTextWildcard doc, "\([!\)]@numero atestado[!\)]@\)", atestado
    ReplaceDocTextWildcard doc, "\(Fecha[!\)]@d[!\)]@a[!\)]@\)", fechaDia
    ReplaceDocTextWildcard doc, "\(fecha[!\)]@informe[!\)]@anal[!\)]@tico[!\)]@\)", fechaInformeAnalitico
    ReplaceDocTextWildcard doc, "\(Fecha[!\)]@oficio[!\)]@\)", fechaOficio
    ReplaceDocTextWildcard doc, "\(rellenar[!\)]@T[!\)]@P[!\)]@\)", tip
    ReplaceDocTextWildcard doc, "\(nombre[!\)]@preso[!\)]@\)", nombrePreso
    ReplaceDocTextWildcard doc, "\(Nombre[!\)]@preso[!\)]@\)", nombrePreso
    ReplaceDocTextWildcard doc, "\(fecha[!\)]@atestado[!\)]@\)", fechaAtestado
    ReplaceDocTextWildcard doc, "\(fecha[!\)]@sustancia[!\)]@\)", fechaDeposito
    ReplaceDocTextWildcard doc, "\(semestre[!\)]@\)", semestre
End Sub

Private Sub ReplaceLooseCoverFields(ByVal doc As Object, ByVal fechaInforme As String, ByVal tip As String, ByVal yearText As String, ByVal atestado As String, ByVal juzgado As String, ByVal procedimiento As String)
    ReplaceDocTextWildcard doc, "\(fecha[!\)]@d[!\)]@a[!\)]@\)", fechaInforme
    ReplaceDocTextWildcard doc, "\(aqu[!\)]@tip[!\)]@\)", tip
    ReplaceDocTextWildcard doc, "\(aqu[!\)]@a[!\)]@o[!\)]@\)", yearText
    ReplaceDocTextWildcard doc, "\([!\)]@mero[!\)]@atestado[!\)]@\)", atestado
    ReplaceDocTextWildcard doc, "\(juzgado[!\)]@\)", juzgado
    ReplaceDocTextWildcard doc, "\([!\)]@diligencia[!\)]@\)", procedimiento
End Sub

Private Sub ReplaceLooseOfficeFields(ByVal doc As Object, ByVal fechaOficio As String, ByVal procedimiento As String, ByVal semestre As String, ByVal nombrePreso As String, ByVal dniInforme As String)
    ReplaceDocTextWildcard doc, "\(fecha[!\)]@d[!\)]@a[!\)]@\)", fechaOficio
    ReplaceDocTextWildcard doc, "\([!\)]@diligencia[!\)]@\)", procedimiento
    ReplaceDocTextWildcard doc, "\(semestre[!\)]@\)", semestre
    ReplaceDocTextWildcard doc, "\(nombre[!\)]@preso[!\)]@\)", nombrePreso
    ReplaceDocTextWildcard doc, "\([!\)]@dni[!\)]@preso[!\)]@\)", dniInforme
End Sub

Private Sub ForceReportFieldReplacements(ByVal doc As Object, ByVal diligenciaPrevia As String, ByVal atestado As String, ByVal fechaDia As String)
    ForceReplaceDocText doc, "(Fecha del día)", fechaDia
    ForceReplaceDocText doc, "(Fecha del dia)", fechaDia
    ForceReplaceDocText doc, "(fecha del día)", fechaDia
    ForceReplaceDocText doc, "(fecha del dia)", fechaDia
    ForceReplaceDocText doc, "(número de diligencia)", diligenciaPrevia
    ForceReplaceDocText doc, "(numero de diligencia)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
    ForceReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ForceReplaceDocText doc, "(número atestado)", atestado
    ForceReplaceDocText doc, "(numero atestado)", atestado
End Sub

Private Sub ForceCoverFieldReplacements(ByVal doc As Object, ByVal tip As String, ByVal yearText As String, ByVal atestado As String, ByVal diligenciaPrevia As String, ByVal fechaDia As String)
    ForceReplaceDocText doc, "(aquí va el tip)", tip
    ForceReplaceDocText doc, "(aqui va el tip)", tip
    ForceReplaceDocText doc, "(aquí se pone el tip)", tip
    ForceReplaceDocText doc, "(aqui se pone el tip)", tip
    ForceReplaceDocText doc, "(aquí el año)", yearText
    ForceReplaceDocText doc, "(aqui el ano)", yearText
    ForceReplaceDocText doc, "(año actual)", yearText
    ForceReplaceDocText doc, "(ano actual)", yearText
    ForceReplaceDocText doc, "(número del atestado)", atestado
    ForceReplaceDocText doc, "(numero del atestado)", atestado
    ForceReplaceDocText doc, "(número atestado)", atestado
    ForceReplaceDocText doc, "(numero atestado)", atestado
    ForceReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
    ForceReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(fecha del dia)", fechaDia
    ForceReplaceDocText doc, "(fecha del día)", fechaDia
End Sub

Private Sub ForceOfficeFieldReplacements(ByVal doc As Object, ByVal fechaDia As String, ByVal diligenciaPrevia As String)
    ForceReplaceDocText doc, "(fecha del dia)", fechaDia
    ForceReplaceDocText doc, "(fecha del día)", fechaDia
    ForceReplaceDocText doc, "(numero diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previa)", diligenciaPrevia
    ForceReplaceDocText doc, "(numero diligencia previas)", diligenciaPrevia
    ForceReplaceDocText doc, "(número diligencia previas)", diligenciaPrevia
End Sub

Private Sub ForceReplaceDocText(ByVal doc As Object, ByVal findText As String, ByVal replaceText As String)
    On Error Resume Next
    ForceReplaceInParagraphs doc.Paragraphs, findText, replaceText
    Dim story As Object
    For Each story In doc.StoryRanges
        ForceReplaceInParagraphs story.Paragraphs, findText, replaceText
        ReplaceInShapesForce story.ShapeRange, findText, replaceText
    Next story
    ReplaceInShapesForce doc.Shapes, findText, replaceText
    On Error GoTo 0
End Sub

Private Sub ForceReplaceInParagraphs(ByVal paragraphs As Object, ByVal findText As String, ByVal replaceText As String)
    On Error Resume Next
    Dim p As Object
    For Each p In paragraphs
        Dim txt As String
        txt = p.Range.Text
        If InStr(1, txt, findText, vbTextCompare) > 0 Then
            p.Range.Text = Replace(txt, findText, replaceText, 1, -1, vbTextCompare)
        End If
    Next p
    On Error GoTo 0
End Sub

Private Sub ReplaceInShapesForce(ByVal shapes As Object, ByVal findText As String, ByVal replaceText As String)
    On Error Resume Next
    Dim shape As Object
    For Each shape In shapes
        If shape.TextFrame.HasText Then
            Dim txt As String
            txt = shape.TextFrame.TextRange.Text
            If InStr(1, txt, findText, vbTextCompare) > 0 Then
                shape.TextFrame.TextRange.Text = Replace(txt, findText, replaceText, 1, -1, vbTextCompare)
            End If
        End If
        If shape.Type = 6 Then ReplaceInShapesForce shape.GroupItems, findText, replaceText
    Next shape
    On Error GoTo 0
End Sub

Private Function Parenthesize(ByVal value As String) As String
    Dim s As String
    s = Trim$(value)
    If Len(s) = 0 Then
        Parenthesize = ""
    ElseIf Left$(s, 1) = "(" And Right$(s, 1) = ")" Then
        Parenthesize = s
    Else
        Parenthesize = "(" & s & ")"
    End If
End Function

Private Function GetInformeValue(ByVal d As Object, ByVal key As String) As String
    Dim normalized As String
    normalized = NormalizeKey(key)
    If d.Exists(normalized) Then GetInformeValue = CStr(d(normalized)) Else GetInformeValue = ""
End Function

Private Function GetDiligenciaPrevia(ByVal d As Object) As String
    GetDiligenciaPrevia = GetInformeValue(d, "DILIGENCIA PREVIA")
    If Len(Trim$(GetDiligenciaPrevia)) = 0 Then GetDiligenciaPrevia = GetInformeValue(d, "DILIGENCIAS PREVIAS")
    If Len(Trim$(GetDiligenciaPrevia)) = 0 Then GetDiligenciaPrevia = GetInformeValue(d, "PROCEDIMIENTO (solo el numero)")
    If Len(Trim$(GetDiligenciaPrevia)) = 0 Then GetDiligenciaPrevia = GetInformeValue(d, "PROCEDIMIENTO")
End Function

Private Function FindBaseItem(ByVal baseRows As Object, ByVal substance As String) As Object
    Dim key As String
    key = NormalizeKey(substance)
    If baseRows.Exists(key) Then
        Set FindBaseItem = baseRows(key)
        Exit Function
    End If

    Dim compact As String
    compact = CompactKey(substance)
    Dim bestKey As String
    Dim bestDistance As Long
    bestDistance = 999

    Dim candidate As Variant
    For Each candidate In baseRows.Keys
        Dim candidateCompact As String
        candidateCompact = CompactKey(CStr(candidate))
        Dim distance As Long
        distance = TextDistance(compact, candidateCompact)
        If distance < bestDistance Then
            bestDistance = distance
            bestKey = CStr(candidate)
        End If
    Next candidate

    If Len(bestKey) > 0 And bestDistance <= 2 Then Set FindBaseItem = baseRows(bestKey)
End Function

Private Function CompactKey(ByVal value As String) As String
    Dim s As String
    s = NormalizeKey(value)
    s = Replace(s, " ", "")
    s = Replace(s, "-", "")
    s = Replace(s, "_", "")
    CompactKey = s
End Function

Private Function TextDistance(ByVal a As String, ByVal b As String) As Long
    Dim lenA As Long, lenB As Long
    lenA = Len(a)
    lenB = Len(b)
    If lenA = 0 Then
        TextDistance = lenB
        Exit Function
    End If
    If lenB = 0 Then
        TextDistance = lenA
        Exit Function
    End If

    Dim d() As Long
    ReDim d(0 To lenA, 0 To lenB)

    Dim i As Long, j As Long
    For i = 0 To lenA
        d(i, 0) = i
    Next i
    For j = 0 To lenB
        d(0, j) = j
    Next j

    For i = 1 To lenA
        For j = 1 To lenB
            Dim cost As Long
            If Mid$(a, i, 1) = Mid$(b, j, 1) Then cost = 0 Else cost = 1
            d(i, j) = MinLong(MinLong(d(i - 1, j) + 1, d(i, j - 1) + 1), d(i - 1, j - 1) + cost)
        Next j
    Next i
    TextDistance = d(lenA, lenB)
End Function

Private Function MinLong(ByVal a As Long, ByVal b As Long) As Long
    If a < b Then MinLong = a Else MinLong = b
End Function

Private Function GetWorksheetByAnyName(ByVal names As Variant) As Worksheet
    Dim candidate As Variant
    For Each candidate In names
        Dim ws As Worksheet
        For Each ws In ThisWorkbook.Worksheets
            If NormalizeKey(ws.Name) = NormalizeKey(CStr(candidate)) Then
                Set GetWorksheetByAnyName = ws
                Exit Function
            End If
        Next ws
    Next candidate
    Err.Raise vbObjectError + 513, "GeneradorInformesExcel", "No encuentro la hoja: " & JoinVariant(names, ", ")
End Function

Private Function JoinVariant(ByVal values As Variant, ByVal separator As String) As String
    Dim result As String
    Dim item As Variant
    For Each item In values
        If Len(result) > 0 Then result = result & separator
        result = result & CStr(item)
    Next item
    JoinVariant = result
End Function

Private Function NormalizeKey(ByVal value As String) As String
    Dim s As String
    s = UCase$(Trim$(value))
    s = Replace(s, ChrW(&HC1), "A")
    s = Replace(s, ChrW(&HC9), "E")
    s = Replace(s, ChrW(&HCD), "I")
    s = Replace(s, ChrW(&HD3), "O")
    s = Replace(s, ChrW(&HDA), "U")
    s = Replace(s, ChrW(&HDC), "U")
    s = Replace(s, ChrW(&HD1), "N")
    s = Replace(s, ".", "")
    s = Replace(s, "  ", " ")
    NormalizeKey = s
End Function

Private Function FormatCellValue(ByVal cell As Range) As String
    If IsDate(cell.Value) And Len(Trim$(CStr(cell.Value))) > 0 Then
        FormatCellValue = Format(cell.Value, "dd/mm/yyyy")
    Else
        FormatCellValue = Trim$(CStr(cell.Text))
    End If
End Function

Private Function NumberValue(ByVal value As Variant) As Double
    If IsNumeric(value) Then NumberValue = CDbl(value) Else NumberValue = 0
End Function

Private Function IsNoFiscalizadaText(ByVal value As String, Optional ByVal calificacion As String = "") As Boolean
    Dim s As String
    s = NormalizeKey(value)
    Dim legal As String
    legal = NormalizeKey(calificacion)
    IsNoFiscalizadaText = (s = "NO" Or s = "N" Or InStr(1, s, "NO FISCAL", vbTextCompare) > 0 Or InStr(1, legal, "NO SOMETIDA", vbTextCompare) > 0 Or InStr(1, legal, "NO FISCAL", vbTextCompare) > 0)
End Function

Private Function IsSoloMenorGramosSustancia(ByVal value As String) As Boolean
    Dim s As String
    s = NormalizeKey(value)
    IsSoloMenorGramosSustancia = (s = "HACHIS" Or s = "KETAMINA")
End Function

Private Function SafeDivide(ByVal numerator As Double, ByVal denominator As Double) As Double
    If denominator = 0 Then SafeDivide = 0 Else SafeDivide = numerator / denominator
End Function

Private Function FormatEuro(ByVal value As Double) As String
    FormatEuro = Format(value, "#,##0.00") & " EUR"
End Function

Private Function FormatDecimal(ByVal value As Double) As String
    FormatDecimal = Format(value, "0.000")
End Function

Private Function FormatPercent(ByVal value As Double) As String
    FormatPercent = Format(value * 100, "0.00") & "%"
End Function

Private Function CmToPoints(ByVal cm As Double) As Double
    CmToPoints = cm * 28.3464567
End Function

Private Function WordColor(ByVal hexColor As String) As Long
    Dim clean As String
    clean = Replace(hexColor, "#", "")
    Dim r As Long, g As Long, b As Long
    r = CLng("&H" & Mid$(clean, 1, 2))
    g = CLng("&H" & Mid$(clean, 3, 2))
    b = CLng("&H" & Mid$(clean, 5, 2))
    WordColor = r + (g * 256) + (b * 65536)
End Function

Private Function BeforeSlash(ByVal value As String) As String
    Dim parts As Variant
    parts = Split(value, "/")
    BeforeSlash = Trim$(CStr(parts(0)))
End Function

Private Sub EnsureFolder(ByVal path As String)
    If Dir(path, vbDirectory) = "" Then MkDir path
End Sub

Private Function FindCoverTemplate(ByVal baseDir As String) As String
    Dim f As String
    f = Dir(baseDir & "\CARATULA*.doc*")
    If Len(f) > 0 Then FindCoverTemplate = baseDir & "\" & f Else FindCoverTemplate = ""
End Function

Private Function FindOfficeTemplate(ByVal baseDir As String) As String
    Dim f As String
    f = Dir(baseDir & "\*oficio*.doc*")
    If Len(f) > 0 Then FindOfficeTemplate = baseDir & "\" & f Else FindOfficeTemplate = ""
End Function

Private Function ErrorSummary(ByVal errNum As Long, ByVal errDesc As String, ByVal errSource As String) As String
    If Len(Trim$(errDesc)) = 0 Then errDesc = "Sin descripcion de Excel/Word"
    ErrorSummary = "Error " & CStr(errNum) & ": " & errDesc
    If Len(Trim$(errSource)) > 0 Then ErrorSummary = ErrorSummary & " (" & errSource & ")"
End Function

Private Sub WriteLog(ByVal outputDir As String, ByVal text As String)
    On Error Resume Next
    EnsureFolder outputDir
    Dim f As Integer
    f = FreeFile
    Open outputDir & "\log_generador.txt" For Append As #f
    Print #f, Format(Now, "yyyy-mm-dd hh:nn:ss") & " - " & text
    Close #f
End Sub
