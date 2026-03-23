/* eslint-disable no-param-reassign */
import uuid from 'react-native-uuid'
import BO from '../interfaces/bo'

export default function changeUUID(bo: BO): BO {
  const boTemp: BO = {
    ...bo,
    ID_BO: uuid.v4().toString(),
    ENDERECO: {
      ...bo.ENDERECO,
      ID_ENDERECO: uuid.v4().toString(),
    },
    ID_TIPO_DESFECHO: '',
    NM_TIPO_DESFECHO: '',
    BO_STATUS: bo.BO_STATUS.filter(st => st.ID_STATUS < 2),
  }

  boTemp.OBJETOS.forEach(obj => {
    obj.ID_OBJETO = uuid.v4().toString()
  })

  boTemp.ENVOLVIDOS.forEach(env => {
    const idEnv = uuid.v4().toString()

    if (env.ENDERECO_RESIDENCIAL) {
      env.ENDERECO_RESIDENCIAL.ID_ENDERECO = uuid.v4().toString()
    }

    boTemp.OBJETOS.forEach(obj => {
      if (obj.ID_ENVOLVIDO === env.ID_ENVOLVIDO) obj.ID_ENVOLVIDO = idEnv
    })

    env.ID_ENVOLVIDO = idEnv

    if (env.CARACTERISTICAS) {
      env.CARACTERISTICAS.ID_ENV_CARACTERISTICA = uuid.v4().toString()
    }

    if (env.DADOS_PROFISSIONAIS) {
      env.DADOS_PROFISSIONAIS.ID_DADOS_PROF = uuid.v4().toString()
    }

    if (env.DADOS_PROFISSIONAIS) {
      if (env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL) {
        env.DADOS_PROFISSIONAIS.ENDERECO_COMERCIAL.ID_ENDERECO = uuid
          .v4()
          .toString()
      }
    }
  })
  return boTemp
}
