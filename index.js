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

    await Promise.all(
      records.map(async (v, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(v[1]);
          const scoreEl = await page.$(".score.score_left .star_score");

          if (scoreEl) {
            const text = await page.evaluate((tag) => tag.textContent, scoreEl);
            console.log(text.trim());
            //   result.push([v[0], v[1], text.trim()]);
            result[i] = [v[0], v[1], text.trim()];
          }

          await page.waitForTimeout(3000);
          await page.close();
        } catch (err) {
          console.error(err);
        }
      })
    );

    await browser.close();

    console.log(result);
    const str = stringify(result);
    console.log(str);
    fs.writeFileSync("csv/result.csv", str);
  } catch (e) {
    console.error(e);
  }
};

crawler();
