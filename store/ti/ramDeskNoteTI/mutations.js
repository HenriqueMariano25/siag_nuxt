export default {
  DEFINIR_RAMS_DESKNOTE_TI(state, { rams }) {
    state.ramsDeskNote = rams
  },
  ATUALIZAR_RAMS_DESKNOTE_TI(state, { ram }) {
    let rams = state.ramsDeskNote
    rams.push(ram)

    state.ramsDeskNote = rams.sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
  },
  DELETAR_RAM_DESKNOTE_TI(state, { id }) {
    let idx = state.ramsDeskNote.findIndex(o => o.id === id)
    if (idx >= 0) {
      state.ramsDeskNote.splice(idx, 1)
    }
  }
}
