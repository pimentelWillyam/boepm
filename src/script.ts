const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const excelPath = path.join(__dirname, "excel.xlsx");

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rows = xlsx.utils.sheet_to_json(sheet);

// Map para evitar duplicados (bairro + AIS)
const bairrosMap = new Map();

rows.forEach(row => {
  const municipio = row["ID.MUNICIPIO"];
  const area = row["ÁREA"];

  if (typeof municipio === "string" && municipio.startsWith("RECIFE")) {
    const bairro = municipio
      .replace(/^RECIFE[-\s]*/i, "")
      .trim();

    if (bairro && area !== undefined && area !== null) {
      const ais = `AIS ${String(area).trim()}`;
      const key = `${bairro}|${ais}`;

      if (!bairrosMap.has(key)) {
        bairrosMap.set(key, { bairro, ais });
      }
    }
  }
});

const bairros = Array.from(bairrosMap.values()).sort((a, b) =>
  a.bairro.localeCompare(b.bairro, "pt-BR")
);

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
