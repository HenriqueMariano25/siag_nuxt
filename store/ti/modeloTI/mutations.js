export default {
  DEFINIR_MODELOS_TI(state, { modelos }) {
    state.modelosTI = modelos
  },
  ATUALIZAR_MODELOS_TI(state, { modelo }) {
    let modelos = state.modelosTI
    modelos.push(modelo)

    state.modelosTI = modelos.sort((a, b) => { return a.nome.localeCompare(b.nome)})
  },
  DELETAR_MODELO_TI(state, { id }){
    let idx = state.modelosTI.findIndex( o => o.id === id )
    if(idx >= 0){
      state.modelosTI.splice(idx, 1)
    }
  }
}
