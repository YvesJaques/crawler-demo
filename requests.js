const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });
    const page = await browser.newPage();
    const url = 'https://www.google.com/search?client=ubuntu&hs=sd2&sca_esv=8416d0a986e64679&channel=fs&q=mountain&tbm=isch&source=lnms&prmd=ivmsnbtz&sa=X&ved=2ahUKEwiK88Cf2JWFAxUArZUCHRX0CoAQ0pQJegQIDBAB&biw=1920&bih=995'

    await page.setRequestInterception(true)

    page.on('request', request => {
        const url = request.url();

        // if (url.includes('https://encrypted-tbn0.gstatic.com/images')) {
        if (request.resourceType() === 'image') {
            request.respond({
                status: 200,
                contentType: "image/png",
                body: fs.readFileSync("./image.jpeg")
            })

            // request.abort();

            // console.log(`URL: ${url}`);            
            // console.log(`Method: ${request.method()}`);
            // console.log(`Headers: ${JSON.stringify(request.headers())}`);
            // console.log('----------------------------------------')
        } else {
            request.continue();
        }
    });

    // page.on('response', async response => {
    //     const url = response.url();

    //     if (url.includes('https://www.google.com/log?format=json')) {
    //         console.log(`URL: ${url}`);
    //         console.log(`Headers: ${JSON.stringify(response.headers())}`);
    //         console.log(`Response: ${JSON.stringify(await response.json())}`)
    //         console.log('----------------------------------------')
    //     }
    // });

    await page.goto(url);


})();