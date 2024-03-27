const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  const page = await browser.newPage();
  const url = 'https://www.amazon.com/s?k=laptop+128gb&i=electronics&rh=n%3A172282%2Cp_123%3A241862&dc&language=en_US&ds=v1%3AQf4hE5jc2PMpmmohWn6bMDhJLQeKDnv4Shv0giS10aI&crid=3DPWGAPH4CMSK&currency=BRL&qid=1711412103&rnid=85457740011&sprefix=laptop+128gb%2Caps%2C228&ref=sr_nr_p_123_5'
  await page.goto(url);

  fs.writeFile(
    'results.csv',
    'title,price,img\n',
    function (err) {
      if (err) throw err;
    }
  )

  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    await page.waitForSelector('[data-cel-widget="search_result_0"]')

    const itemSelector = 'div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item'
    const productsHandles = await page.$$(itemSelector)
    
    for (const productHandle of productsHandles) {
      let title
      let price
      let img

      try {
        title = await page.evaluate(
          el => el.querySelector('h2 > a > span')?.textContent,
          productHandle
        )
      } catch (error) {}

      try {
        price = await page.evaluate(
          el => el.querySelector('.a-price > .a-offscreen')?.textContent,
          productHandle
        )
      } catch (error) {}

      try {
        img = await page.evaluate(
          el => el.querySelector('.s-image')?.getAttribute('src'),
          productHandle
        )
      } catch (error) {}

      if (title && price && img) {
        fs.appendFile(
          'results.csv',
          `${title.replace(/,/g, ".")}, ${price}, ${img}\n`,
          function (err) {
            if (err) throw err;
          }
        )
      }      
    }

    const selector = '.s-pagination-next'
    const disabledSelector = '.s-pagination-next.s-pagination-disabled'

    await page.waitForSelector(selector, { visible: true })
    const is_disabled = await page.$(disabledSelector) !== null

    isBtnDisabled = is_disabled
    if (!is_disabled) {
      await Promise.all([
        page.click(selector),
        page.waitForNavigation({ waitUntil: "networkidle2" })
      ])
    }
  }

  await browser.close();
})();