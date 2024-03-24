const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/s?k=laptop&crid=3WY0EB14VVIN&sprefix=laptop%2Caps%2C231&ref=nb_sb_noss_1');

  const productsHandles = await page.$$('div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')

  let items = [];

  for (const productHandle of productsHandles) {
    try {
      const title = await page.evaluate(
        el => el.querySelector('h2 > a > span')?.textContent || '',
        productHandle
      )

      const price = await page.evaluate(
        el => el.querySelector('.a-price > .a-offscreen')?.textContent || '',
        productHandle
      )

      const img = await page.evaluate(
        el => el.querySelector('.s-image')?.getAttribute('src') || '',
        productHandle
      )

      if (title && price && img) {
        const item = {
          title,
          price,
          img
        }
        items.push(item)
      }
    } catch (error) {
      
    }
  }
  
  console.log(items.length)
  // console.log(items)
  // await browser.close();
})();