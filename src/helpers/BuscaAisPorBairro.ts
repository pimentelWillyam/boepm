import listaBairrosRecife from '../bairrosRecife.json'

export class BuscaAisPorBairro {
  public static execute(nomeBairro: string | null): string {
    if (!nomeBairro) {
      return ''
    }

    const bairroEncontrado = listaBairrosRecife.bairros.find(
      bairro => bairro.bairro === nomeBairro
    )

    return bairroEncontrado?.ais.replace("AIS ", "") ?? ''
  }
}
