const fs = require("fs");

const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify/sync");

const csv = fs.readFileSync("csv/data.csv").toString("utf-8");
const parser = parse({ delimiter: "," });
const records = [];

parser.on("readable", function () {
  let record;
  while ((record = parser.read()) !== null) {
    records.push(record);
  }
});
parser.on("error", function (err) {
  console.error(err.message);
});
parser.on("end", function () {
  console.log("end");
});

parser.write(csv);
parser.end();

const puppeteer = require("puppeteer");

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    console.log(await page.evaluate("navigator.userAgent"));

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );

    console.log(await page.evaluate("navigator.userAgent"));

    for (const [i, v] of records.entries()) {
      console.log(v);

      await page.goto(v[1]);

      //   const scoreEl = await page.$(".score.score_left .star_score");
      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        if (score) {
          return score.textContent;
        }
      });
      if (text) {
        console.log(text.trim());
        result[i] = [v[0], v[1], text.trim()];
      }
    }
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
