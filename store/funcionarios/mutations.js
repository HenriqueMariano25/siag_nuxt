export default {
  DEFINIR_FUNCIONARIOS(state, { funcionarios, ultimaBusca, buscarTranporte }) {
    state.funcionarios = funcionarios
    state.ultimaBusca = ultimaBusca
    state.buscarTranporte = buscarTranporte
  },

  DEFINIR_ESTA_BUSCANDO(state, bool){
    state.estaBuscando = bool
  },

  DEFINIR_SUBSETORESAJUSTE(state, subSetoresAjuste) {
    state.subSetoresAjuste = subSetoresAjuste
  },
  DEFINIR_SETORES(state, setores) {
    state.setores = setores
  },
  DEFINIR_FUNCOES(state, funcoes) {
    state.funcoes = funcoes
  },
  DEFINIR_ROTAS(state, rotas) {
    state.rotas = rotas
  },
  DEFINIR_SUBSETORES(state, subSetores) {
    state.subSetores = subSetores
  },
}
