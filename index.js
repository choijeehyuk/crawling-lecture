const { parse } = require("csv-parse");

const fs = require("fs");

const csv = fs.readFileSync("csv/data.csv");

const records = [];
const parser = parse({
  delimiter: ",",
});

parser.on("readable", () => {
  let record;
  while ((record = parser.read()) !== null) {
    records.push(record);
  }
});

parser.on("end", function () {
  console.log("end");
});

parser.on("error", function (err) {
  console.error(err.message);
});

parser.write(csv.toString());
parser.end();

console.log(records);
