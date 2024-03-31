const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const url = 'https://accounts.google.com/signin/v2/identifier'
    
    const cookieString = await fs.readFile('./cookies.json');
    
    const cookies = JSON.parse(cookieString);
    await page.setCookie(...cookies);
    
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    await browser.close();
})();