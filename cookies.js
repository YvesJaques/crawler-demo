const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const url = 'https://accounts.google.com/signin/v2/identifier'
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    await page.type('#identifierId', 'test');
    await page.click('#identifierNext');

    await page.waitForSelector('#password', {
        visible: true,
        hidden: false
    });
    await sleep(5000)
    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', '12345');
    await sleep(1000)
    await page.click('#passwordNext > div > button');

    await sleep(10000);

    const cookies = await page.cookies();
    console.log(cookies);

    //save cookies on json file    

    await browser.close();
})();  