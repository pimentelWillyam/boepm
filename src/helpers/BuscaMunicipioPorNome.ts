type Municipio = {
    "ID_MUNICIPIO": number,
    "MUNICIPIO": string,
    "ID_UF": number,
    "DIRETORIA": string,
    "AIS": string
}

import municipiosCompletos from '../pages/Envolvidos/Endereco/municipiosCompletosFinal.json'

export class BuscaMunicipioPorNome {
    private static listaMunicipios: Municipio[] = municipiosCompletos as Municipio[]
    public static execute(nomeMunicipio: string | undefined): Municipio | null {
        console.log("nome", nomeMunicipio)
        const municipioEncontrado = this.listaMunicipios.find(municipio => municipio.MUNICIPIO === nomeMunicipio);
        return municipioEncontrado ? municipioEncontrado : null;
    }
}

