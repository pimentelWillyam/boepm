/* eslint-disable no-useless-constructor */
import Config from '../../../config'
import GlobalRepository from '../../domain/models/global'
import BORepository from '../../domain/repositories/bo-repository'
import UsuarioRepository from '../../domain/repositories/usuario-repository'
import { AuthResponse, AuthUseCase } from '../../domain/usecases/auth-usecase'
import { HttpClient } from '../protocols/http-client'
import { Storage } from '../protocols/storage'

/**
 ********* Implementação do Use Case Login do Usuário *********
 */
export default class AuthUseCaseImpl implements AuthUseCase {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly boRepository: BORepository,
    private readonly globalRepository: GlobalRepository,
    private readonly cacheStorage: Storage,
  ) {}

  login = async (usuario: string, senha: string): Promise<AuthResponse> => {
    const res = await this.httpClient.request({
      method: 'post',
      url: `${Config.urlEnvironments[Config.ENVIRONMENT].urlBase}/login`,
      body: {
        login: usuario,
        senha,
        lat: '',
        lon: '',
      },
    })
    if (res.statusCode === 200) {
      // ainda não se está fixando o Tipo do usuario no res.body - Falta implementar a recepção do tipo Genérico
      this.usuarioRepository.setUsuario(res.body)
      await this.cacheStorage.set('@username', res.body.user)
      await this.cacheStorage.set('@BOEPM:token', res.body.token)
      await this.cacheStorage.set('@BOEPM:refreshToken', res.body.refreshToken)
      // salva o token na api para buscas
      // api.defaults.headers.Authorization = `Bearer ${token}`
      return {
        data: res.body,
        error: false,
      }
    }
    return {
      data: res.body,
      error: false,
    }
  }
}
