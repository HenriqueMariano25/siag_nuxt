export default {
  DEFINIR_DISCOS_DESKNOTE_TI(state, { discos }) {
    state.discosDeskNote = discos
  },
  ATUALIZAR_DISCOS_DESKNOTE_TI(state, { disco }) {
    let discos = state.discosDeskNote
    discos.push(disco)

    state.discosDeskNote = discos.sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
  },
  DELETAR_DISCO_DESKNOTE_TI(state, { id }) {
    let idx = state.discosDeskNote.findIndex(o => o.id === id)
    if (idx >= 0) {
      state.discosDeskNote.splice(idx, 1)
    }
  }
}
