export default {
  DEFINIR_PROCEDENCIAS_TI(state, { procedencias }) {
    state.procedencias = procedencias
  },
  ATUALIZAR_PROCEDENCIAS_TI(state, { procedencia }) {
    let procedencias = state.procedencias
    procedencias.push(procedencia)

    state.procedencias = procedencias.sort((a, b) => { return a.nome.localeCompare(b.nome)})
  },
  DELETAR_PROCEDENCIA_TI(state, { id }){
    let idx = state.procedencias.findIndex( o => o.id === id )
    if(idx >= 0){
      state.procedencias.splice(idx, 1)
    }
  }
}
