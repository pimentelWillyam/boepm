import unidades from '../utils/data/unidades.json'

export class BuscaNomeBatalhaoReduzidoPorBatalhaoExtendido {
  static execute(batalhaoExtendido: string | undefined): string | null {
    const unidade = unidades.find(
      (unidades) => unidades.UNI_DESCRICAO === batalhaoExtendido,
    )
    return unidade ? unidade.CD_OPERACIONAL : null
  }
}
