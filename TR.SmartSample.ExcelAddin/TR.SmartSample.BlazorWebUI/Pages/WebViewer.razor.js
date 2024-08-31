console.log("Loading WebView.razor.js");

const PDF_PATHS = new Map([
    ["INV-100", "/mocked-datas/invoice_landscaped.pdf"],
    ["INV-200", "/mocked-datas/invoice_landscaped_2.pdf"]
]);

const PDF_INTELLIGENCE = new Map([
    ["/mocked-datas/invoice_landscaped.pdf", "/mocked-datas/invoice_landscaped.json"],
    ["/mocked-datas/invoice_landscaped_2.pdf", "/mocked-datas/invoice_landscaped.json"]
]);

window.initializeWebViewer = () => {
    WebViewer({
        path: '/lib',
        licenseKey: 'Thomson Reuters Holdings Inc. (thomsonreuters.com):OEM:Onvio Firm Management, Onvio Documents, Onvio Client Center, GoFileRoom, AdvanceFlow, Practical Law::B+:AMS(20240426):F6A518CD0457480A0360B13AC982537860615F3EB766E50395B51BD45CD5009E1A8A31F5C7',
    }, document.getElementById('viewer'))
        .then(instance => {
            const { UI, Core } = instance;
            const { documentViewer, annotationManager, Tools, Annotations } = Core;
            // call methods from UI, Core, documentViewer and annotationManager as needed

            documentViewer.addEventListener('documentLoaded', () => {
                // call methods relating to the loaded document
            });
        });
}
export async function createInvoiceTable(serviceData) {
    await Excel.run(async (context) => {
        // Create a new worksheet named "Invoice"
        const sheet = context.workbook.worksheets.add("Invoice");

        const inventoryTable = sheet.tables.add("A1:C1", true);
        inventoryTable.name = "Invoices";
        inventoryTable.getHeaderRowRange().values = [["InvoiceId", "InvoiceDate", "InvoiceTotal"]];

        const rows = serviceData.map(item => [item.invoiceId, item.invoiceDate, item.invoiceTotal]);
        inventoryTable.rows.add(null, rows);

        sheet.getUsedRange().format.autofitColumns();
        sheet.getUsedRange().format.autofitRows();

        sheet.activate();

        // Add event handler for cell selection changes
        sheet.onSelectionChanged.add(handleSelectionChange);
        await context.sync();
    });
}


async function handleSelectionChange(event) {
    await Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange();
        range.load("values");
        await context.sync();

        // get the selected invoiceid
        const selectedinvoiceid = range.values[0][0];

        // load the selected pdf in the viewer
        if (PDF_PATHS.has(selectedinvoiceid))
            loadPdfInViewer(PDF_PATHS.get(selectedinvoiceid));
    });
}

async function loadPdfInViewer(pdfpath) {
    const viewerInstance = WebViewer.getInstance();
    const { documentViewer } = viewerInstance.Core;
    // Get intelligence from document
    debugger;
    const intelligenceData = await getDocumentIntelligence(PDF_INTELLIGENCE.get(pdfpath));
    const fields = ["InvoiceId", "InvoiceDate", "InvoiceTotal"].map((desiredField => intelligenceData?.analyzeResult.documents[0].fields[desiredField]));

    documentViewer.addEventListener('annotationsLoaded', () => {
        fields.forEach((field) => {
            const { polygon, pageNumber } = field.boundingRegions[0];
            drawPolygonArea(polygon, intelligenceData?.analyzeResult.pages[pageNumber - 1], viewerInstance);
        });
    });
    viewerInstance.UI.loadDocument(pdfpath);
}

function drawPolygonArea(polygonCoords, page, viewerInstance) {
    debugger;
    const { documentViewer, annotationManager, Annotations } = viewerInstance.Core;
    const { width, height } = documentViewer.getDocument().getPageInfo(documentViewer.getCurrentPage());
    if (polygonCoords.length % 2 !== 0) return;
    // Create polygonPoints array
    const polygonPoints = Array.from(new Array(polygonCoords.length / 2)).map((_, index) => {
        const currentIndex = index * 2;
        return polygonCoords.slice(currentIndex, currentIndex + 2);
    });
    // Add first point at the end to close it out
    polygonPoints.push([...polygonPoints[0]]);

    const annot = new Annotations.PolygonAnnotation({
        PageNumber: page.pageNumber,
        StrokeColor: new Annotations.Color(0, 255, 0, 1),
    });

    polygonPoints.forEach(([x, y]) => {
        // Map coords to the document size
        annot.addPathPoint(x * width / page.width, y * height / page.height)
    });

    annotationManager.addAnnotation(annot);
    annotationManager.redrawAnnotation(annot);
}

async function getDocumentIntelligence(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
}