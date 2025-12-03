import Responsavel from '../models/responsavel'

export default interface ResponsavelRepository {
  responsaveis: Responsavel[] // List responsáveis
  setResponsaveis: (resp: Responsavel) => void // add Responsáveis
  delResponsaveis: (resp: Responsavel) => void // Remove Responsáveis
  clearResponsaveis: () => void // Limpar todos os responsáveis
}
