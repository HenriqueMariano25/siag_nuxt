export default {
  DEFINIR_USUARIO_LOGADO(state, {token, usuario}) {
    state.token = token
    state.usuario = usuario
  },
}
