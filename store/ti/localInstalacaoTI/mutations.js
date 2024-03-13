export default {
  DEFINIR_LOCALINSTALACAO_TI(state, { locaisInstalacao }) {
    state.locaisInstalacao = locaisInstalacao
  },
  ATUALIZAR_LOCALINSTALACAO_TI(state, { localInstalacao }) {
    let locaisInstalacao = state.locaisInstalacao
    locaisInstalacao.push(locasInstalacao)

    state.locaisInstalacao = locaisInstalacao.sort((a, b) => { return a.nome.localeCompare(b.nome)})
  },
  DELETAR_LOCALINSTALACAO_TI(state, { id }){
    let idx = state.locaisInstalacao.findIndex( o => o.id === id )
    if(idx >= 0){
      state.locaisInstalacao.splice(idx, 1)
    }
  }
}
