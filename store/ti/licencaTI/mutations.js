export default {
  DEFINIR_LICENCAS_TI(state, { licencas }) {
    state.licencas = licencas
  },
  ATUALIZAR_LICENCAS_TI(state, { licenca }) {
    let licencas = state.licencas
    licencas.push(licenca)

    state.licencas = licencas.sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
  },
  DELETAR_LICENCA_TI(state, { id }) {
    let idx = state.licencas.findIndex(o => o.id === id)
    if (idx >= 0) {
      state.licencas.splice(idx, 1)
    }
  },
  LIMPAR_LICENCAS(state){
    state.licencas = null
  }
}
