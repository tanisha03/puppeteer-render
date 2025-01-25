const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://developer.chrome.com/");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    const currentArticles = await page.evaluate((selectors) => {
      const results = [];

      console.log(document.title, '=====title');

      const articleElements = document.querySelectorAll(selectors.headerSelector);

      articleElements.forEach((element) => {
        results.push(element.innerText);
      });

      return results;
    }, {
      headerSelector: '#chromes-2024-recap-for-devs'
    });

    console.log(currentArticles, '=====articles');
    res.send(currentArticles);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
