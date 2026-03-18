const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'mockups');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function takeScreenshots() {
    console.log('Starting Puppeteer...');
    const browser = await puppeteer.launch({ 
        headless: "new",
        defaultViewport: { width: 1440, height: 900 }
    });
    
    const page = await browser.newPage();
    
    const files = [
        { file: 'map.html', out: 'generated_map.png' },
        { file: 'dashboard.html', out: 'generated_dashboard.png' },
        { file: 'report.html', out: 'generated_report.png' },
        { file: 'catalog.html', out: 'generated_catalog.png' },
        { file: 'wiki.html', out: 'generated_wiki.png' }
    ];

    for (const item of files) {
        const fileUrl = `file://${path.join(__dirname, item.file)}`;
        console.log(`Navigating to ${fileUrl}...`);
        
        await page.goto(fileUrl, { waitUntil: 'networkidle0' });
        
        // Wait a bit more to ensure fonts and Tailwind CLI (if used from CDN) are fully loaded
        await new Promise(r => setTimeout(r, 2000));
        
        const outPath = path.join(OUT_DIR, item.out);
        console.log(`Saving screenshot to ${outPath}...`);
        await page.screenshot({ path: outPath, fullPage: true });
    }

    await browser.close();
    console.log('Done!');
}

takeScreenshots().catch(console.error);
