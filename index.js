const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;

const records = xlsx.utils.sheet_to_json(ws);
console.log(records);

records.forEach((v, i) => {
  console.log(v.제목);
  console.log(v.링크);
});

for (const [i, v] of records.entries()) {
  console.log(v.제목);
  console.log(v.링크);
}
