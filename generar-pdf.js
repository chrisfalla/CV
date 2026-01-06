const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('Iniciando generación de PDF...');
    
    const browser = await puppeteer.launch({
        headless: true
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport grande para capturar todo el contenido
    await page.setViewport({
        width: 1200,
        height: 2000,
        deviceScaleFactor: 2
    });
    
    // Cargar el archivo HTML
    const htmlPath = 'file://' + path.resolve(__dirname, 'index.html');
    await page.goto(htmlPath, {
        waitUntil: 'networkidle0'
    });
    
    // Esperar a que todo cargue completamente
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Obtener dimensiones del contenido completo
    const dimensions = await page.evaluate(() => {
        return {
            width: Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth
            ),
            height: Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            ) + 20  // Mínimo padding para evitar recortes
        };
    });
    
    // Generar PDF emulando pantalla (no print)
    await page.emulateMediaType('screen');
    
    // Generar PDF con dimensiones del contenido
    await page.pdf({
        path: 'CV-Christofer-Falla.pdf',
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        printBackground: true,
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        },
        displayHeaderFooter: false,
        pageRanges: '1'
    });
    
    await browser.close();
    
    console.log('✅ PDF generado exitosamente: CV-Christofer-Falla.pdf');
})();
