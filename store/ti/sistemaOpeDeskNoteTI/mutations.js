export default {
  DEFINIR_SISTEMASOPE_DESKNOTE_TI(state, { sistemas }) {
    state.sistemasOpeDeskNote = sistemas
  },
  ATUALIZAR_SISTEMASOPE_DESKNOTE_TI(state, { sistema }) {
    let sistemas = state.sistemasOpeDeskNote
    sistemas.push(sistema)

    state.sistemasOpeDeskNote = sistemas.sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
  },
  DELETAR_SISTEMASOPE_DESKNOTE_TI(state, { id }) {
    let idx = state.sistemasOpeDeskNote.findIndex(o => o.id === id)
    if (idx >= 0) {
      state.sistemasOpeDeskNote.splice(idx, 1)
    }
  }
}
