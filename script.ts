import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

type Municipio = {    
  ID_MUNICIPIO: number
  MUNICIPIO: string
  ID_UF: number
  DIRETORIA: string
  AIS: string
}

const municipios: Municipio[] = require(
  './src/pages/Envolvidos/Endereco/municipiosCompletosFinal.json'
)

const municipiosPernambuco = municipios.filter(
  m => m.ID_UF === 1
)

fs.writeFileSync(
  './src/pages/Envolvidos/Endereco/municipiosPernambuco.json',
  JSON.stringify(municipiosPernambuco, null, 2),
  'utf-8'
)

console.log('municipiosPernambuco.json criado com sucesso ✅')
