export default {
  DEFINIR_PROCESSADORES_DESKNOTE_TI(state, { processadores }) {
    state.processadoresDeskNote = processadores
  },
  ATUALIZAR_PROCESSADORES_DESKNOTE_TI(state, { processador }) {
    let processadores = state.processadoresDeskNote
    processadores.push(processador)

    state.processadoresDeskNote = processadores.sort((a, b) => {
      return a.nome.localeCompare(b.nome)
    })
  },
  DELETAR_PROCESSADOR_DESKNOTE_TI(state, { id }) {
    let idx = state.processadoresDeskNote.findIndex(o => o.id === id)
    if (idx >= 0) {
      state.processadoresDeskNote.splice(idx, 1)
    }
  }
}
