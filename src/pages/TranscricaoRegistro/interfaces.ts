/* eslint-disable camelcase */
export interface IUnidadeOperacional {
  UNI_ID: string
  UNI_DESCRICAO: string
  CD_OPERACIONAL: string
}

export interface INaturezaFato {
  DES_NATUREZA_ID: string
  DES_DESCRICAO: string
  DS_DESCRICAO_NATUREZA: string
}

export interface ILocalOcorrencia {
  ID_LOCAL_OCORRENCIA: string
  NM_LOCAL_OCORRENCIA: string
}

export interface IUF {
  ID_UF: string
  SIGLA_UF: string
  NM_UF: string
  ID_PAIS: string
}

export interface IMunicipio {
  ID_MUNICIPIO: number
  MUNICIPIO: string
  ID_UF: number
}

export interface IPontoReferencia {
  ID_TP_PT_REF: string
  NM_TP_PT_REF: string
}

export interface NaturezasEscolhidas {
  ID_NATUREZA: string
  NATUREZA: string
  CRIME_CONSUMADO?: string
  CRIME_CULPOSO?: string
}

export interface IEnderecoMap {
  address: {
    house_number?: string
    road?: string
    suburb?: string
    city_district?: string
    city?: string
    county?: string
    state_district?: string
    state?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}
