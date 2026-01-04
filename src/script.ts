import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Compatível com ESM ("type": "module")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ler arquivos
const municipiosAPartirDoExcel = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'municipiosAPartirDoExcel.json'),
    'utf-8'
  )
)

const municipiosCompletos = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'municipiosCompletos.json'),
    'utf-8'
  )
)

// Criar mapa para busca rápida
const mapaExcel = new Map(
  municipiosAPartirDoExcel.map((m: any) => [
    m.municipio.trim().toUpperCase(),
    m
  ])
)

// Gerar lista final
const municipiosCompletosFinal = municipiosCompletos.map((m: any) => {
  const chave = m.MUNICIPIO.trim().toUpperCase()
  const encontrado = mapaExcel.get(chave)

  if (!encontrado) return m

  console.log('municipios iguais')
  console.log('Municipio:', chave)
  console.log('Área (AIS):', encontrado.area)
  console.log('Diretoria:', encontrado.diretoria)
  console.log('-----------------------------')

  return {
    ...m,
    DIRETORIA: encontrado.diretoria,
    AIS: encontrado.area
  }
})

// Salvar novo arquivo
fs.writeFileSync(
  path.join(__dirname, 'municipiosCompletosFinal.json'),
  JSON.stringify(municipiosCompletosFinal, null, 2),
  'utf-8'
)

console.log('✅ Arquivo municipiosCompletosFinal.json criado com sucesso')
