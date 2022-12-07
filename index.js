const fs = require("fs");
const axios = require("axios");

const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify/sync");

const csv = fs.readFileSync("csv/data.csv").toString("utf-8");
const parser = parse({ delimiter: "," });
const records = [];

fs.readdir("screenshot", (err) => {
  if (err) {
    console.error("screenshot 폴더 생성");
    fs.mkdirSync("screenshot");
  }
});

fs.readdir("poster", (err) => {
  if (err) {
    console.error("poster 폴더 생성");
    fs.mkdirSync("poster");
  }
});

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
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    console.log(await page.evaluate("navigator.userAgent"));

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    );

    console.log(await page.evaluate("navigator.userAgent"));

    for (const [i, v] of records.entries()) {
      await page.goto(v[1]);

      const result = await page.evaluate(() => {
        const scoreEl = document.querySelector(".score.score_left .star_score");
        let score = "";
        if (scoreEl) {
          score = scoreEl.textContent.trim();
        }

        const imgEl = document.querySelector(".poster img");
        let img = "";
        if (imgEl) {
          img = imgEl.src;
        }
        return { score, img };
      });

      if (result.img) {
        console.log(result.img);
        const imgResult = await axios.get(result.img.replace(/\?.*$/, ""), {
          responseType: "arraybuffer",
        });
        fs.writeFileSync(`poster/${v[0]}.jpg`, imgResult.data);
      }
    }
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
