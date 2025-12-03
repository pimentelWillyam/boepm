/* eslint-disable @typescript-eslint/no-namespace */
import Usuario from '../models/usuario'

export interface AuthResponse {
  data: Usuario | string
  error: boolean
}

export interface AuthUseCase {
  login: (usuario: string, senha: string) => Promise<AuthResponse>
}
