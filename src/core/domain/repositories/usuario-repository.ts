/* eslint-disable @typescript-eslint/no-empty-function */
import Usuario from '../models/usuario'

export default interface UsuarioRepository {
  usuario: Usuario | null
  setUsuario: (usuario: Usuario) => void
  clearUsuario: () => void
}
