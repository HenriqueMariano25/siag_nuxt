export default {
  DEFINIR_MODELOS_DESKNOTE_TI(state, { modelos }) {
    state.modelosDeskNote = modelos
  },
  ATUALIZAR_MODELOS_DESKNOTE_TI(state, { modelo }) {
    let modelos = state.modelosDeskNote
    modelos.push(modelo)

    state.modelosDeskNote = modelos.sort((a, b) => { return a.nome.localeCompare(b.nome)})
  },
  DELETAR_MODELO_DESKNOTE_TI(state, { id }){
    let idx = state.modelosDeskNote.findIndex( o => o.id === id )
    if(idx >= 0){
      state.modelosDeskNote.splice(idx, 1)
    }
  }
}
