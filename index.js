const xlsx = require("xlsx");

const axios = require("axios"); // for ajax
const cheerio = require("cheerio"); // for html parsing

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

for (const [i, v] of records.entries()) {
}

const crawler = async () => {
  const test = records.map(async (r, i) => {
    const res = await axios.get(r.링크);
    console.log(i);
    if (res.status === 200) {
      const html = res.data;
      const $ = cheerio.load(html);
      const score = $(".score.score_left .star_score").text().trim();
      console.log(r.제목, "평점 : ", score);
      return score;
    }
    return 3;
  });
  console.log(test);
};

crawler();

// const ret = [1, 2, 3, 4, 5].map((r, i) => {
//   console.log(r);
// });
// console.log(ret);
