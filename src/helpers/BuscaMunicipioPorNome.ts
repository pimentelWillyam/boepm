type Municipio = {
    "ID_MUNICIPIO": number,
    "MUNICIPIO": string,
    "ID_UF": number,
    "DIRETORIA": string,
    "AIS": string
}

import municipiosCompletos from '../pages/Envolvidos/Endereco/municipiosCompletosFinal.json'
import { BuscaAisPorBairro } from './BuscaAisPorBairro'

export class BuscaMunicipioPorNome {
    private static listaMunicipios: Municipio[] = municipiosCompletos as Municipio[]
    public static execute(nomeMunicipio: string | undefined, nomeBairro: string | null): Municipio | null {
        console.log("nome", nomeMunicipio)
        const municipioEncontrado = this.listaMunicipios.find(municipio => municipio.MUNICIPIO === nomeMunicipio);
        if(municipioEncontrado?.MUNICIPIO === 'RECIFE') {
            console.log('município recifense encontrado!')
            console.log('Buscando AIS por bairro')
            municipioEncontrado.AIS = BuscaAisPorBairro.execute(nomeBairro) || ''
        }
        return municipioEncontrado ? municipioEncontrado : null;
    }
}

