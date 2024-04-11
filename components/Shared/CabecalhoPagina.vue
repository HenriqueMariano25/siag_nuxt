<template>
	<div
		class="absolute h-11 bg-primaria-700 top-0 w-full -ml-2 pl-2 pr-2 flex items-center text-white text-2xl print:hidden justify-between"
		style="max-width: 100vw">
		<span>{{ titulo }}</span>
		<div class="flex gap-1.5 rota px-1">
			<div
				v-for="(cadaRota, index) of rotas"
				class="cursor-pointer hover:!text-blue-300 "
        :class="{'text-gray-400 hover:!text-gray-400 font-bold': index + 1 === rotas.length}">
				<span @click="index + 1 !== rotas.length ? $router.push({ name: cadaRota.caminho }) : false ">{{ cadaRota.nome }}</span>
				<span
					class="text-blue-300"
					v-if="index + 1 < rotas.length">
					>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			titulo: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				rotas: [],
			}
		},
		mounted() {
			let nomesRota = this.$route.name
			let cadaPagina = nomesRota.split("-")
			let rotas = []
			let caminhoRota = null
			for (let rota of cadaPagina) {
				caminhoRota = caminhoRota !== null ? caminhoRota + "-" + rota : rota
				let nome = this.corrigirNome(rota)

				rotas.push({ nome, caminho: caminhoRota })
			}

			this.rotas = rotas
		},
		methods: {
			corrigirNome(nome) {
				let correcoes = {
					Administracao: "Administração",
					AvaliacaoFuncionario: "Avaliação Funcionário",
					Avaliacoes: "Avaliações",
          index: " ",
          HoraExtra: "Hora Extra",
          Configuracao: "Configuração",
          Configuracoes: "Configurações",
          ConfiguracaoGeral: "Configuração Geral",
          DiasAgendamento: "Dias Agendamento",
          Aprovacoes: "Aprovações",
          ConhecimentoComportamental: "Conhe. Comportamental",
          ConhecimentoFuncionario: "Conhe. Funcionário",
          TipoObra: "Tipo Obra",
          DisponibilidadeTrabalho: "Dispo. Trabalho",
          HabilidadeTecnica: "Hab. Técnica",
          PresentesNaoPresentes: "Presentes/Não Presentes",
          DiasCompensacao: "Dias Compensação",
          LiberacaoBloqueio: "Liberação/Bloqueio",
          Contratacao: "Contratação",
          AprovarCard: "Aprovar Card",
          SS: "Solicitação Serviço",
          Solicitacoes: "Solicitações",
          AprovarSSs: "Aprovar SSs",
          CadernoDDS: "Caderno de DDS",
          TI: "T.I",
          ChipsPlanos: "Chips e Planos",
          PermanenciaRefeitorio: "Permanência no Refeitório",
          Cartoes: "Cartões",
          Aprovacao: "Aprovação",
          prazoPorFuncao: "Prazo Por Funcao",
          Nutricao: "Nutrição",
          EquipePlanejamento: "Equipe Planejamento",
          SubDisciplina: "Sub Disciplina",
          Usuario: "Usuário",
          Periferico: "Periférico",
          Relatorio: "Relatório",
          BloquearFaltaAtestado: "Bloq. Falta e Atestado",
          DesktopNotebook: "Desktop/Notebook",
				}

				let correcaoEncontrada = correcoes[nome] ? correcoes[nome] : null
				if (correcaoEncontrada) {
					return correcaoEncontrada
				}

				return nome
			},
		},
	}
</script>

<style scoped>
	.rota {
		font-size: 15px;
	}
</style>
