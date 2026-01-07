import { launch } from 'puppeteer';
import { dirname, resolve as _resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    console.log('Iniciando generación de PDF...');
    
    const browser = await launch({
        headless: true
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport grande para capturar todo el contenido
    await page.setViewport({
        width: 1200,
        height: 1500,
        deviceScaleFactor: 2
    });
    
    // Cargar el archivo HTML
    const htmlPath = 'file://' + _resolve(__dirname, 'index.html');
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
