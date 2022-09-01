// Google Search Console reports 500 errors for pages.
// Hence, manually navigate to each and make them work.
// After doing this, pages should be indexable.

'use strict'

const fs = require('fs')
const sitemapArray = require('sitemap-to-array')
const URL = 'https://www.ineednature.co.nz/sitemap-0.xml';
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    });

    const options = {
        returnOnComplete: true
    }

    sitemapArray(URL, options, async (err, list) => {
        if (err) {
          console.error(err)
        }
        else {
          console.log('list: ', list);
          var count = 0;
          for (var o of list) {
            count++;
            await goToURL(browser, o.loc, count);
          }
          await browser.close();
        }
    })
})();


const goToURL = async (browser, url, count) => {
    
    console.log(`${count}/${listLength} - going to url: ${url}`);

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
    });
    await page.close();
}
