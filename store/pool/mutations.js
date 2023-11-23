export default {
  DEFINIR_ATENDIMENTOS_POOL(state, { dados, ultimaBusca }) {
    state.atendimentos.dados = dados
    state.atendimentos.ultimaBusca = ultimaBusca
  },

  ATUALIZAR_ATENDIMENTOS_POOL(state, { novoDado }) {
    state.atendimentos.dados.push(novoDado)
  },

  DEFINIR_SUB_SETORES_POOL(state, { dados, ultimaBusca }) {
    state.subSetores.dados = dados
    state.subSetores.ultimaBusca = ultimaBusca
  },

  ATUALIZAR_SUB_SETORES_POOL(state, { novoDado }) {
    state.subSetores.dados.push(novoDado)
  },

  REMOVER_SUB_SETORES_POOL(state, { id }) {
    let idx = state.subSetores.dados.findIndex(o => o.id === id)

    state.subSetores.dados.splice(idx, 1)
  },

  DEFINIR_MOTIVO_POOL(state, { dados, ultimaBusca }) {
    state.motivos.dados = dados
    state.motivos.ultimaBusca = ultimaBusca
  },

  ATUALIZAR_MOTIVO_POOL(state, { novoDado }) {
    state.motivos.dados.push(novoDado)
  },
}
