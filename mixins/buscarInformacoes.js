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
			let nrsBuscados = await this.$axios.$get("/contratacao/nrs/buscarTodos").then((resp) => resp.nrs)

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

      console.log(disciplinasBuscados)

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
			let etapaBuscados = await this.$axios.$get("/contratacao/etapa/buscarTodos")
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
// export const buscarTerceiros = {
// 	methods: {
// 		async buscarTerceiros(salvarStore) {
// 			let terceirosBuscado = await api
// 				.get("/hora_extra/terceiros")
// 				.then((resp) => resp.data.terceiros)
//
// 			if (salvarStore) {
// 				let terceiros = this.$store.state.terceiros
//
// 				if (terceiros != null) {
// 					this.$store.commit("DEFINIR_TERCEIROS", terceirosBuscado)
// 				}
// 			}
//
// 			return terceirosBuscado
// 		},
// 	},
// }
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
//
// export const buscarVeiculos = {
// 	methods: {
// 		async buscarVeiculos(salvarStore, filtros = {}) {
// 			let resp = await api
// 				.get("/transporte/buscar/veiculos", { params: { filtros: filtros } })
// 				.then((resp) => resp.data)
//
// 			if (!resp.falha) {
// 				let veiculosBuscado = resp.veiculos
//
// 				if (salvarStore) {
// 					let veiculos = this.$store.state.veiculos
//
// 					if (veiculos != null) {
// 						this.$store.commit("DEFINIR_VEICULOS", veiculosBuscado)
// 					}
// 				}
//
// 				return veiculosBuscado
// 			}
// 		},
// 	},
// }
//
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
