const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelPath = path.join(__dirname, "excel.xlsx");

const workbook = xlsx.readFile(excelPath);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rows = xlsx.utils.sheet_to_json(sheet);

const bairros = rows
  .map(row => row["ID.MUNICIPIO"])
  .filter(value => typeof value === "string" && value.startsWith("RECIFE"))
  .map(value => value.replace(/^RECIFE/, "").trim())
  .filter(value => value.length > 0);

const bairrosRecife = {
  cidade: "Recife",
  estado: "Pernambuco",
  total_bairros: bairros.length,
  bairros
};

fs.writeFileSync(
  path.join(__dirname, "bairrosRecife.json"),
  JSON.stringify(bairrosRecife, null, 2),
  "utf-8"
);

console.log("Arquivo bairrosRecife.json gerado com sucesso!");
