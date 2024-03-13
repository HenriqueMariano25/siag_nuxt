export default {
  DEFINIR_MARCAS_TI(state, { marcas }) {
    state.marcas = marcas
  },
  ATUALIZAR_MARCAS_TI(state, { marca }) {
    let marcas = state.marcas
    marcas.push(marca)

    state.marcas = marcas.sort((a, b) => { return a.nome.localeCompare(b.nome)})
  },
  DELETAR_MARCA_TI(state, { id }){
    let idx = state.marcas.findIndex( o => o.id === id )
    if(idx >= 0){
      state.marcas.splice(idx, 1)
    }
  }
}
