// import api from "@/services/api"
//
export const buscarSetores = {
	methods: {
		async buscarSetores() {
			let setoresBuscados = await this.$axios.$get("/efetivo/setores").then((resp) => resp.setores)

			return setoresBuscados
		},
	},
}

export const buscarNrs = {
	methods: {
		async buscarNrs() {
			let nrsBuscados = await this.$axios
				.$get("/contratacao/nrs/buscarTodos")
				.then((resp) => resp.nrs)

			return nrsBuscados
		},
	},
}
//
// export const buscarFuncaoCard = {
// 	methods: {
// 		async buscarFuncaoCard(salvarStore) {
// 			let funcoesBuscados = await api
// 				.get("/contratacao/funcao/buscarTodos")
// 				.then((resp) => resp.data.funcoes)
//
// 			if (salvarStore) {
// 				let funcoes = this.$store.state.funcoes
//
// 				if (funcoes != null) {
// 					this.$store.commit("DEFINIR_FUNCOES_CARD", funcoesBuscados)
// 				}
// 			}
//
// 			return funcoesBuscados
// 		},
// 	},
// }
//
export const buscarDisciplinaCard = {
	methods: {
		async buscarDisciplinaCard() {
			let disciplinasBuscados = await this.$axios
				.$get("/contratacao/disciplina/buscarTodos")
				.then((resp) => resp.disciplinas)

			return disciplinasBuscados
		},
	},
}


//
// export const buscarCentroCusto = {
// 	methods: {
// 		async buscarCentroCusto(salvarStore) {
// 			let centrosCustoBuscados = await api
// 				.get("/contratacao/centro_custo/buscarTodos")
// 				.then((resp) => resp.data.centrosCusto)
//
// 			if (salvarStore) {
// 				let centrosCusto = this.$store.state.centrosCusto
//
// 				if (centrosCusto != null) {
// 					this.$store.commit("DEFINIR_CENTRO_CUSTO", centrosCustoBuscados)
// 				}
// 			}
//
// 			return centrosCustoBuscados
// 		},
// 	},
// }
//
export const buscarEtapa = {
	methods: {
		async buscarEtapa() {
			let etapaBuscados = await this.$axios
				.$get("/contratacao/etapa/buscarTodos")
				.then((resp) => resp.etapas)

			etapaBuscados.sort((a, b) => parseInt(a.ordem) - parseInt(b.ordem))

			return etapaBuscados
		},
	},
}

// export const buscarEquipamentoCard = {
// 	methods: {
// 		async buscarEquipamentoCard(salvarStore) {
// 			let equipamentosCardBuscados = await api
// 				.get("/contratacao/equipamento_card/buscarTodos")
// 				.then((resp) => resp.data.equipamentosCard)
//
// 			if (salvarStore) {
// 				let equipamentosCard = this.$store.state.equipamentosCard
//
// 				if (equipamentosCard != null) {
// 					this.$store.commit("DEFINIR_EQUIPAMENTOS_CARD", equipamentosCardBuscados)
// 				}
// 			}
//
// 			return equipamentosCardBuscados
// 		},
// 	},
// }
//
// export const buscarStatusCard = {
// 	methods: {
// 		async buscarStatusCard(salvarStore) {
// 			let statusBuscados = await api
// 				.get("/contratacao/status/buscarTodos")
// 				.then((resp) => resp.data.status)
//
// 			if (salvarStore) {
// 				let status = this.$store.state.statusCard
//
// 				if (status != null) {
// 					this.$store.commit("DEFINIR_STATUS_CARD", statusBuscados)
// 				}
// 			}
//
// 			return statusBuscados
// 		},
// 	},
// }
//
// export const buscarFeriados = {
// 	methods: {
// 		async buscarFeriados(salvarStore) {
// 			let feriadosBuscados = await api
// 				.get("/hora_extra/feriado/buscarTodos")
// 				.then((resp) => resp.data.feriados)
//
// 			if (salvarStore) {
// 				let feriados = this.$store.state.fiados
//
// 				if (feriados != null) {
// 					this.$store.commit("DEFINIR_FERIADOS", feriadosBuscados)
// 				}
// 			}
//
// 			return feriadosBuscados
// 		},
// 	},
// }
//
// export const buscarUsuarios = {
// 	methods: {
// 		async buscarUsuarios(salvarStore) {
// 			let usuariosBuscados = await api.get("/usuarios").then((resp) => resp.data.usuarios)
//
// 			if (salvarStore) {
// 				let usuarios = this.$store.state.usuarios
//
// 				if (usuarios != null) {
// 					this.$store.commit("DEFINIR_USUARIOS", usuariosBuscados)
// 				}
// 			}
//
// 			return usuariosBuscados
// 		},
// 	},
// }
//
// export const buscarHistoricoBloqueioHe = {
// 	methods: {
// 		async buscarHistoricoBloqueioHe(salvarStore) {
// 			let bloqueioBuscado = await api
// 				.get("/hora_extra/configuracao/bloqueioHe")
// 				.then((resp) => resp.data.bloqueio)
//
// 			if (salvarStore) {
// 				let bloqueio = this.$store.state.bloqueio
//
// 				if (bloqueio != null) {
// 					this.$store.commit("DEFINIR_BLOQUEIOHE", bloqueioBuscado)
// 				}
// 			}
//
// 			return bloqueioBuscado
// 		},
// 	},
// }
export const buscarTerceiros = {
	methods: {
		async buscarTerceiros() {
			let terceirosBuscado = await this.$axios
				.$get("/hora_extra/terceiros")
				.then((resp) => resp.terceiros)

			return terceirosBuscado
		},
	},
}
// export const buscarEscopoSS = {
// 	methods: {
// 		async buscarEscopoSS(salvarStore) {
// 			let escoposBuscado = await api
// 				.get("/ss/escopos_ss", { params: { filtros: {} } })
// 				.then((resp) => resp.data.dados.escopos)
//
// 			if (salvarStore) {
// 				let escopos = this.$store.state.escopos
//
// 				if (escopos != null) {
// 					this.$store.commit("DEFINIR_ESCOPOSS", escoposBuscado)
// 				}
// 			}
//
// 			return escoposBuscado
// 		},
// 	},
// }
//
export const buscarEtapaSS = {
	methods: {
		async buscarEtapaSS(filtros = {}) {
			let etapasBuscado = await this.$axios
				.$get("/suprimentos/ss/etapas_ss", { params: { filtros: filtros } })
				.then((resp) => resp.dados.etapas)

			etapasBuscado.sort((a, b) => parseInt(a.ordem) - parseInt(b.ordem))

			return etapasBuscado
		},
	},
}

export const buscarVeiculos = {
  methods: {
    async buscarVeiculos(filtros = {}) {
      let veiculosBuscado = await this.$axios
        .$get("/transporte/buscar/veiculos", { params: { filtros: filtros } })
        .then((resp) => resp.veiculos)

      return veiculosBuscado
    },
  },
}

export const buscarTurnos = {
  methods: {
    async buscarTurnos(filtros = {}) {
      let turnosBuscado = await this.$axios
        .$get("/efetivo/buscar/turnos", { params: { filtros: filtros } })
        .then((resp) => resp.dados.turnos)

      return turnosBuscado
    },
  },
}

export const buscarRotas = {
  methods: {
    async buscarRotas(filtros = {}) {
      let rotasBuscadas = await this.$axios
        .$get("/transporte/buscar/rotas_simples", { params: { filtros: filtros } })
        .then((resp) => resp.dados.rotas)

      return rotasBuscadas
    },
  },
}

// export const buscarRepublicas = {
// 	methods: {
// 		async buscarRepublicas(salvarStore, filtros = {}) {
// 			let resp = await api
// 				.get("/servicos_gerais/republicas", { params: { filtros: filtros } })
// 				.then((resp) => resp.data)
//
// 			if (!resp.falha) {
// 				let republicasBuscado = resp.republicas
//
// 				if (salvarStore) {
// 					let republicas = this.$store.state.republicas
//
// 					if (republicas != null) {
// 						this.$store.commit("DEFINIR_REPUBLICAS", republicasBuscado)
// 					}
// 				}
//
// 				return republicasBuscado
// 			}
// 		},
// 	},
// }


// NOVO PADRÃO
export const buscarDisciplina = {
  methods: {
    async buscarDisciplina(buscarAgora) {
      let ultimaBusca = this.$store.state.disciplina.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/consultas/buscar/disciplinas")

        if (!resp.falha) {
          let disciplinasBuscadas = resp.dados.disciplinas

          let agora = this.$dayjs()

          this.$store.commit("disciplina/DEFINIR_DISCIPLINA", {
            disciplinas: disciplinasBuscadas,
            ultimaBusca: agora,
          })
        }
      }
    },
  },
}

export const buscarSubDisciplina = {
  methods: {
    async buscarSubDisciplina(buscarAgora, filtros ) {
      let ultimaBusca = this.$store.state.subDisciplina.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/consultas/buscar/sub_disciplinas", { params: { filtros } })

        if (!resp.falha) {
          let subDisciplinasBuscadas = resp.dados.subDisciplinas

          let agora = this.$dayjs()

          this.$store.commit("subDisciplina/DEFINIR_SUB_DISCIPLINA", {
            subDisciplinas: subDisciplinasBuscadas,
            ultimaBusca: agora,
          })
        }
      }
    },
  },
}

export const buscarEquipePlanejamento = {
  methods: {
    async buscarEquipePlanejamento(buscarAgora) {
      let ultimaBusca = this.$store.state.equipePlanejamento.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/consultas/buscar/equipes_planejamento")

        if (!resp.falha) {
          let equipesPlanejamentoBuscadas = resp.dados.equipesPlanejamento

          let agora = this.$dayjs()

          this.$store.commit("equipePlanejamento/DEFINIR_EQUIPE_PLANEJAMENTO", {
            equipesPlanejamento: equipesPlanejamentoBuscadas,
            ultimaBusca: agora,
          })
        }
      }
    },
  },
}
