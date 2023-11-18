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

export const buscarPlanosChip = {
  methods: {
    async buscarPlanosChip(buscarAgora) {
      let ultimaBusca = this.$store.state.planoChip.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")
      let planos = this.$store.state.planoChip.planosChip

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/ti/plano/buscarTodos", { params: { filtros: {}}})

        if (!resp.falha) {
          let planosChipBuscadas = resp.dados.planos
          planos = planosChipBuscadas

          let agora = this.$dayjs()

          this.$store.commit("planoChip/DEFINIR_PLANOS_CHIP", {
            planosChip: planosChipBuscadas,
            ultimaBusca: agora,
          })
        }
      }

      return planos
    },
  },
}

export const buscarSituacaoChip = {
  methods:{
    async buscarSituacaoChip(buscarAgora){
      let resp = await this.$axios.$get("/ti/situacao/buscarTodos")

      if(!resp.falha){
        let situacoes = resp.dados.situacoes

        return situacoes
      }

    }
  }
}

export const buscarFuncionarios = {
  methods: {
    async buscarFuncionarios(buscarAgora) {
      let ultimaBusca = this.$store.state.funcionarios.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/efetivo/funcionarios/busca_simplicada")

        if (!resp.falha) {
          let funcionariosBuscados = resp.dados.funcionarios

          let agora = this.$dayjs()

          this.$store.commit("funcionarios/DEFINIR_FUNCIONARIOS", {
            funcionarios: funcionariosBuscados,
            ultimaBusca: agora,
          })
          return funcionariosBuscados
        }

      }else{
        return this.$store.state.funcionarios.funcionarios
      }
    },
  },
}

export const buscarAtendimentosPool = {
  methods: {
    async buscarAtendimentosPool(buscarAgora) {
      let ultimaBusca = this.$store.state.pool.atendimentos.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/pool/atendimento/buscarTodos")

        if (!resp.falha) {
          let dados = resp.dados.atendimentos

          let ultimaBusca = this.$dayjs()

          this.$store.commit("pool/DEFINIR_ATENDIMENTOS_POOL", {
            dados,
            ultimaBusca,
          })
          return dados
        }

      } else {
        return this.$store.state.pool.atendimentos.dados
      }
    },
  },
}

export const buscarSubSetoresPool = {
  methods: {
    async buscarSubSetoresPool(buscarAgora, setor_id) {
      let ultimaBusca = this.$store.state.pool.subSetores.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/pool/subSetor/buscarTodos", )

        if (!resp.falha) {
          let dados = resp.dados.subSetores

          let ultimaBusca = this.$dayjs()

          this.$store.commit("pool/DEFINIR_SUB_SETORES_POOL", {
            dados,
            ultimaBusca,
          })
        }

      }

      let subSetores = this.$store.state.pool.subSetores.dados

      if(setor_id){
        return subSetores.filter( o => o.setor_id === setor_id)
      }

      return subSetores

    },
  },
}

export const buscarMotivosPool = {
  methods: {
    async buscarMotivosPool(buscarAgora) {
      let ultimaBusca = this.$store.state.pool.motivos.ultimaBusca
      let diferencaEmHoras = 0
      if (ultimaBusca) diferencaEmHoras = this.$dayjs().diff(this.$dayjs(ultimaBusca), "hour")

      if (buscarAgora || ultimaBusca === null || diferencaEmHoras > 0) {
        let resp = await this.$axios.$get("/pool/motivo/buscarTodos")

        if (!resp.falha) {
          let dados = resp.dados.motivos

          let ultimaBusca = this.$dayjs()

          this.$store.commit("pool/DEFINIR_MOTIVO_POOL", {
            dados,
            ultimaBusca,
          })
          return dados
        }

      } else {
        return this.$store.state.pool.motivos.dados
      }
    },
  },
}
