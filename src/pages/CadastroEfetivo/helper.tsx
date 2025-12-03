/* eslint-disable camelcase */
import { IResponsavel } from '../../interfaces/responsavel'
import api from '../../services/api'

const buscarPMPorMatricula = async (
  matricula: string,
  cd_envolvimento?: number,
): Promise<{
  error: string | null
  responsavel: IResponsavel | null
  status?: number
}> => {
  try {
    const response = await api.get(`/bo/buscarAgente/${matricula}`)
    if (response.status === 200) {
      return {
        error: null,
        responsavel: {
          ...response.data,
          CD_TIPO_ENVOLVIMENTO: cd_envolvimento || 1,
        },
      }
    }
    return {
      error: response.data.message,
      responsavel: null,
      status: response.status,
    }
  } catch (error) {
    return {
      error: `No momento não está sendo possivel buscar os dados do PM. Verifique a sua VPN! ${error}`,
      responsavel: null,
    }
  }
}

const buscarPMPorCPF = async (
  cpf: string,
  cd_envolvimento?: number,
): Promise<{ error: string | null; responsavel: IResponsavel | null }> => {
  try {
    const response = await api.get(`/buscarAgentePorCpf/${cpf}`)
    if (response.status === 201) {
      return {
        error: null,
        responsavel: {
          ...response.data,
          CD_TIPO_ENVOLVIMENTO: cd_envolvimento || 1,
        },
      }
    }
    if (response.status === 502) {
      return {
        error:
          'No momento, não foi possivel conectar ao sistema da DTEC para obter os dados do PM!',
        responsavel: null,
      }
    }
    if (response.status === 404) {
      return {
        error: `${response.data} Caso você esteja na ativa, procure a DTEC e informe a situação!`,
        responsavel: null,
      }
    }
    return {
      error: 'Erro ao buscar o PM',
      responsavel: null,
    }
  } catch (error) {
    return {
      error: `No momento não está sendo possivel buscar os dados do PM. Verifique a sua VPN! ${error}`,
      responsavel: null,
    }
  }
}

export { buscarPMPorCPF, buscarPMPorMatricula }
