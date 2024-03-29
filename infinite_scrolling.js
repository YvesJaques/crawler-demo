const fs = require('fs');
const puppeteer = require('puppeteer');

const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
    let items = []

    while (itemTargetCount > items.length) {
        items = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('#boxes > div'))
            return items.map(item => item.innerText)
        });

        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(
            `document.body.scrollHeight > ${previousHeight}`
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return items
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const url = 'https://intoli.com/blog/scrape-infinite-scroll/demo.html'
    await page.goto(url);

    const items = await scrapeInfiniteScrollItems(page, 50)

    fs.writeFileSync('infiniteScrollingItems.json', JSON.stringify(items))

    await browser.close();
})();