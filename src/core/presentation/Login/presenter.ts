import { AuthResponse } from '../../domain/usecases/auth-usecase'
import { makeHttpClient } from '../../main/factories/http-client-factory'
import AuthUseCaseImpl from '../../data/usecases/auth-usecase'
import UsuarioRepository from '../../domain/repositories/usuario-repository'
import BORepository from '../../domain/repositories/bo-repository'

export async function login(
  usuario: string,
  senha: string,
  usuarioRepository: UsuarioRepository,
  boRepository: BORepository,
): Promise<AuthResponse> {
  const auth = new AuthUseCaseImpl(
    makeHttpClient(),
    usuarioRepository,
    boRepository,
  )
  const response = await auth.login(usuario, senha)
  return response
}
