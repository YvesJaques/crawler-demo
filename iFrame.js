const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const url = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe'
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    // const iFrame1st = await page.$("#content > article > section:nth-child(3) > div > iframe")
    
    // const iFrame1stContentFrame = await iFrame1st.contentFrame();

    // const title = await iFrame1stContentFrame.$eval('body > header > h4', (el) => el.innerText)

    // console.log(title);

    await new Promise(r => setTimeout(r, 4000));

    const frames = await page.frames();

    const iFrame1stContentFrame = frames.find((frame) => frame.url().includes('https://interactive-examples.mdn.mozilla.net/pages/tabbed/iframe.html'))

    const title = await iFrame1stContentFrame.$eval('body > header > h4', (el) => el.innerText)

    console.log(title);

    await browser.close();
})();