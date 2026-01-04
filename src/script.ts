import fs from "fs";

// Ler os arquivos JSON
const municipiosCompletos = JSON.parse(
  fs.readFileSync("./municipiosCompletos.json", "utf-8")
);

const municipiosExcel = JSON.parse(
  fs.readFileSync("./municipiosVindoDoExcel.json", "utf-8")
);

// Criar mapa do Excel para busca rápida
const mapaExcel = new Map();

municipiosExcel.forEach(m => {
  mapaExcel.set(
    m.municipio?.toUpperCase().trim(),
    m
  );
});

// Fazer a união
const municipiosCompletosFinal = municipiosCompletos.map(m => {
  const chaveMunicipio = m.MUNICIPIO?.toUpperCase().trim();
  const dadosExcel = mapaExcel.get(chaveMunicipio);

  return {
    ID_MUNICIPIO: m.ID_MUNICIPIO,
    MUNICIPIO: m.MUNICIPIO,
    ID_UF: m.ID_UF,

    // 👉 SOMENTE SE EXISTIR NO EXCEL
    DIRETORIA: dadosExcel?.diretoria ?? null,
    AIS: dadosExcel?.area ?? null,
    OME: dadosExcel?.ome ?? null
  };
});

// Salvar o arquivo final
fs.writeFileSync(
  "./municipiosCompletosFinal.json",
  JSON.stringify(municipiosCompletosFinal, null, 2),
  "utf-8"
);

console.log("✅ Arquivo municipiosCompletosFinal.json criado com sucesso!");
