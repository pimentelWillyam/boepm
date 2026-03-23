import municipiosCompletos from '../pages/Envolvidos/Endereco/municipiosCompletosFinal.json'
import { BuscaAisPorBairro } from './BuscaAisPorBairro'

type Municipio = {
  ID_MUNICIPIO: number
  MUNICIPIO: string
  ID_UF: number
  DIRETORIA: string
  AIS: string
}

export class BuscaMunicipioPorNome {
  private static listaMunicipios: Municipio[] =
    municipiosCompletos as Municipio[]

  public static execute(
    nomeMunicipio: string | undefined,
    nomeBairro: string | null,
  ): Municipio | null {
    const municipioEncontrado = this.listaMunicipios.find(
      (municipio) => municipio.MUNICIPIO === nomeMunicipio,
    )
    if (municipioEncontrado?.MUNICIPIO === 'RECIFE') {
      const AisEncontrada = BuscaAisPorBairro.execute(nomeBairro) || ''
      municipioEncontrado.AIS = AisEncontrada
    }
    return municipioEncontrado || null
  }
}
