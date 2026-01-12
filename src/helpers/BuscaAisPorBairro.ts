import bairrosRecife from '../bairrosRecife.json'

bairrosRecife.bairros.
export class BuscaAisPorBairro {
    private static listaBairros: Municipio[] = municipiosCompletos as Municipio[]
    public static execute(nomeBairro: string | null):  string | null {
        console.log('nome: ', nomeBairro)
        bairrosRecife.bairros.filter((bairros) => bairros.bairro === nomeBairro)
        console.log('bairros recife:', bairrosRecife.bairros)
    }
}

