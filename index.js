const fs = require("fs");
const axios = require("axios");
const puppeteer = require("puppeteer");

fs.readdir("unsplash", (err) => {
  if (err) {
    console.error("unsplash 폴더 생성");
    fs.mkdirSync("unsplash");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://unsplash.com`);

    let imgs = [];
    while (imgs.length < 100) {
      const result = await page.evaluate(async () => {
        window.scrollTo(0, 0);
        const div = document.querySelectorAll("figure");
        const imgs = [];
        console.log(div.length);
        console.log(div);
        if (div.length > 0) {
          div.forEach((v) => {
            const src = v.querySelector("img.YVj9w").src;
            if (src) {
              imgs.push(src);
              v.parentElement.removeChild(v);
            }
          });
        }
        window.scrollBy(0, 200);

        return imgs;
      });
      await page.waitForSelector("figure img.YVj9w", { timeout: 3000 });
      imgs = imgs.concat(result);
      console.log(imgs.length);
    }

    const set = new Set(imgs);
    set.forEach(async (link) => {
      console.log(link);
      const imgBuffer = await axios(link, { responseType: "arraybuffer" });
      fs.writeFileSync(`unsplash/${new Date().valueOf()}.jpeg`, imgBuffer.data);
    });
    console.log("set : ", set.size);
    console.log("img : ", imgs.length);
    console.log("complete loading!!");

    // await page.close();
    // await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
