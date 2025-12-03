import { InputLoginData } from '../../../services/auth'
import Responsavel from './responsavel'
import IUsuario from './usuario'

export interface AuthContextData {
  signed: boolean
  loading: boolean
  temResponsaveis: boolean
  loadingReq: boolean
  login(data: InputLoginData): Promise<null | string>
  logout(): void
  setStats(usuario: IUsuario): void
}

export interface IModusOperandi {
  ID_FORMA_APROXIMACAO: string
  NM_FORMA_APROXIMACAO?: string
  ID_FORMA_ACAO_ABORDAGEM: string
  NM_FORMA_ACAO_ABORDAGEM?: string
  ID_LOCAL_ENTRADA: string
  NM_LOCAL_ENTRADA?: string
  ID_FORMA_ENTRADA: string
  NM_FORMA_ENTRADA?: string
  ID_ALTERACOES_NO_LOCAL: string
  NM_ALTERACOES_NO_LOCAL?: string
  ID_FORMA_DE_EVASAO: string
  NM_FORMA_DE_EVASAO?: string
  ID_CRIMES_SEXUAIS: string
  NM_CRIMES_SEXUAIS?: string
  ID_ESTELIONATO: string
  NM_ESTELIONATO?: string
}

export interface IUsoForca {
  ID_TIPO_USO_FORCA: string
  NM_TIPO_USO_FORCA: string
}

export interface IDadosProfissionais {
  ID_DADOS_PROF: string
  ID_PROFISSAO: string
  NM_PROFISSAO: string
  NOME_EMPRESA: string
  FONE_COMERCIAL: string
  ID_RAMO_ATIVIDADE: string
  NM_RAMO_ATIVIDADE: string
  ENDERECO_COMERCIAL: IEndereco | null
}

export interface ICaracteristicas {
  ID_ENV_CARACTERISTICA: string
  ALTURA_APARENTE: string
  PESO: string
  IDADE_APARENTE: string
  ID_COR_CABELO: string
  NM_COR_CABELO: string
  ID_TIPO_PELAGEM_FACIAL: string
  NM_TIPO_PELAGEM_FACIAL: string
  ID_TIPO_APARENCIA: string
  NM_TIPO_APARENCIA: string
  ID_TIPO_CABELO: string
  NM_TIPO_CABELO: string
  ID_COR_PELE: string
  NM_COR_PELE: string
  ID_COR_OLHOS: string
  NM_COR_OLHOS: string
  ID_TIPO_MARCA_FISICA: string
  NM_TIPO_MARCA_FISICA: string
  TATUAGEM: string
  TIPO_DENTES: string
  TIPO_CICATRIZ: string
  BIGODE: string
  ID_TIPO_DEFEITO_FISICO: string
  NM_TIPO_DEFEITO_FISICO: string
}

export interface IEnvolvido {
  ID_ENVOLVIDO: string
  ID_TIPO_ENV_PESSOA: string
  NOME_PAI: string
  NOME_MAE: string
  EMAIL: string
  ID_SEXO: string
  DS_SEXO?: string
  ID_GENERO: string
  DS_GENERO?: string
  ID_ORIENT_SEXUAL: string
  DS_ORIENT_SEXUAL?: string
  APELIDO: string
  // Temp Attributes
  RG?: string
  ORGAO_EXP?: string
  RG_UF?: string
  CPF?: string
  CNH?: string
  NM_TIPO_ENVOLVIMENTO_PESSOA: string
  TIPO_PESSOA: string
  TURISTA: number | string
  DATA_NASCIMENTO: string
  NATURALIDADE: string
  NOME_RAZAO_SOCIAL: string
  ID_ESCOLARIDADE: string
  NM_ESCOLARIDADE?: string
  TELEFONE: string
  TELEFONE_RESIDENCIAL: string
  ALTURA_APARENTE?: string
  IDADE_APARENTE?: string
  ID_ESTADO_CIVIL: string
  NM_ESTADO_CIVIL: string
  DOCUMENTOS: IDocumento[]
  CARACTERISTICAS: ICaracteristicas | null
  DADOS_PROFISSIONAIS: IDadosProfissionais | null
  ENDERECO_RESIDENCIAL: IEndereco | null
  OBJETOS: IObjeto[]
  MODUS_OPERANDI: IModusOperandi | null
  USO_FORCA: IUsoForca[]
  ID_TIPO_USO_FORCA1?: string
  ASSINATURA: string | null
}

export interface IArma {
  ID_ARMA: string
  ID_DIMENSAO_ARMA: string
  NM_DIMENSAO_ARMA?: string
  ID_ACABAMENTO_ARMA: string
  NM_ACABAMENTO_ARMA?: string
  ID_SISTEMA_ARMA: string
  NM_SISTEMA_ARMA?: string
  ID_CORONHA_ARMA: string
  NM_CORONHA_ARMA?: string
  CD_IDENT_ARMA?: string
  VL_CALIBRE: string
  VL_QTD_CANOS: string
  QTD_MUNICAO: string
}

export interface IVeiculo {
  ID_VEICULO?: string
  CD_PLACA: string
  CD_CHASSI?: string
  CD_RENAVAM?: string
  CD_ANO_FABRICACAO?: string
  CD_ANO_MODELO?: string
  FL_SEGURADORA: string
  DS_SEGURO: string
  DS_RASTREADOR: string
  DS_TACOGRAFO: string
  ID_TIPO_COMBUSTIVEL: string
  NM_TIPO_COMBUSTIVEL?: string
}

export interface ICelular {
  ID_CELULAR: string
  CEL_IMEI1?: string
  CEL_IMEI2?: string
  CEL_IMEI3?: string
  CEL_IMEI4?: string
  CEL_IMEI_JUSTIFICATIVA?: string
}

export interface IObjeto {
  ID_OBJETO: string
  ID_TIPO_ENV_OBJETO: string
  ID_COR_OBJETO: string
  NM_COR_OBJETO: string
  ID_TIPO_OBJETO: string
  ID_CATEGORIA: string
  ID_MARCA: string
  ID_MODELO: string
  NUM_SERIE: string
  APREENDIDO: string
  ID_MOEDA: string
  VL_VALOR?: string
  ID_UNIDADE_MEDIDA: string
  QTD_OBJETO: string
  NOME_ENVOLVIDO: string
  ID_ENVOLVIDO: string
  NM_TIPO_ENV_OBJETO: string
  ID_OBJ_ARMA: IArma | null
  ID_VEICULO: IVeiculo | null
  ID_CELULAR: ICelular | null
  NM_TIPO_OBJETO: string
  NM_CATEGORIA: string
  NM_MOEDA: string
  ID_FORMA_APRES: string
  NM_FOMRA_APRES: string
  NM_UNIDADE_MEDIDA: string
  NM_MODELO: string
  NM_MARCA: string
  ID_PAIS: string
  NM_PAIS: string
  FOTO: IFoto | null

  CD_PLACA?: string
  CD_CHASSI?: string
  CD_RENAVAM?: string
  CD_ANO_FABRICACAO?: string
  CD_ANO_MODELO?: string
  ID_TIPO_COMBUSTIVEL?: string

  CEL_IMEI1?: string
  CEL_IMEI2?: string
  CEL_IMEI3?: string
  CEL_IMEI4?: string
  CEL_IMEI_JUSTIFICATIVA?: string

  ID_DIMENSAO_ARMA?: string
  ID_ACABAMENTO_ARMA?: string
  ID_SISTEMA_ARMA?: string
  ID_CORONHA_ARMA?: string
  CD_IDENT_ARMA?: string
  VL_CALIBRE?: string
  VL_QTD_CANOS?: string
  QTD_MUNICAO?: string
}

export interface IDocumento {
  ID_TIPO_DOCUMENTO: number
  NM_TIPO_DOCUMENTO: string
  ORGAO_DOCUMENTO: string
  NUMERO: string
}

export interface IEndereco {
  ID_ENDERECO: string
  LOGRADOURO: string
  CEP: string
  ID_MUNICIPIO: string
  MUNICIPIO: string
  ID_UF: string
  NM_UF?: string
  ID_TP_PT_REF: string
  NM_TP_PT_REF: string
  PONTO_REFERENCIA: string
  ID_TRECHO?: string
  COMPLEMENTO: string
  NUMERO: string
  BAIRRO: string
  LAT?: string | null
  LON?: string | null
}

export interface IBOStatus {
  ID_STATUS: number
  DH_STATUS: string
  HASH?: string
  CRC?: string
  BO_DP?: string | null
}

export interface INatureza {
  ID_BO?: string
  ID_NATUREZA: string
  NATUREZA: string
  CRIME_CONSUMADO: string
  CRIME_CULPOSO: string
}

export interface IFoto {
  ID: string
  ID_BO: string
  ID_TIPO_FOTO: string
  ID_OBJETO: string
  DESCRICAO: string
  FOTO: string
}

export default interface BO {
  ID_BO: string
  VERSION: string
  ID_BO_COMPLEMENTAR: string
  CD_OCORRENCIA: string
  COMPLEMENTADO: number
  ERRO?: boolean
  ID_UNID_OPERACIONAL: string
  CD_TIPO_ENVOLVIMENTO?: number
  NM_UNID_OPERACIONAL?: string
  DS_VIATURA: string
  DH_REGISTRO: string
  DH_FATO: string
  AUTORIA_CONHECIDA: string
  CRIME_CONSUMADO?: string
  CRIME_CULPOSO?: string
  FLAGRANTE: string
  ID_TIPO_DESFECHO: string
  NM_TIPO_DESFECHO?: string
  ID_LOCAL_OCORRENCIA: string
  NM_LOCAL_OCORRENCIA?: string
  OBJETOS: IObjeto[]
  ENVOLVIDOS: IEnvolvido[]
  BO_STATUS: IBOStatus[]
  NATUREZAS: INatureza[]
  NATUREZA1?: string
  ENDERECO: IEndereco
  RESPONSAVEIS: Responsavel[]
  FOTOS_OBJETOS?: []
  FOTOS_DOCUMENTOS?: []
  DADOS_COMPLEMENTARES: string
  // Esses campos abaixo são para Melhor utilização do React-hook-form
  LOGRADOURO?: string
  CEP?: string
  ID_MUNICIPIO?: string
  MUNICIPIO?: string
  ID_UF?: string
  ID_TP_PT_REF?: string
  NM_TP_PT_REF?: string
  PONTO_REFERENCIA?: string
  ID_TRECHO?: string
  COMPLEMENTO?: string
  NUMERO?: string
  BAIRRO?: string
  LAT?: number
  LON?: number
}
