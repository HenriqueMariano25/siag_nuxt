<template>
	<div class="w-full">
		<div>
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				@filtros="filtros = $event"
				@pagina="pagina = $event"
				@ordem="ordem = $event"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				:totalItens="totalItens"
				:carregando="carregando"
				@atualizar="buscarEfetivo"
				@selecionados="funcSelecionados = $event"
				:limparSelecionarAoRecarregar="true"
				selecionar>
				<template v-slot:[`body.rota.id`]="{ item }">
					<span
						v-if="item.rota"
						class="whitespace-nowrap">
						{{ item.rota.numero }} - {{ item.rota.local }}
					</span>
				</template>
				<template v-slot:[`body.hora_extra`]="{ item }">
					<span class="whitespace-nowrap">
						{{ horaExtra(item.hora_extra) }}
					</span>
				</template>
				<template v-slot:[`body.data_demissao`]="{ item }">
					<span
						v-if="item.data_demissao"
						class="whitespace-nowrap"></span>
				</template>
				<template v-slot:[`body.Turno.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{ item.Turno ? item.Turno.descricao : "" }}</span>
				</template>
				<template v-slot:[`body.JornadaTrabalho.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.JornadaTrabalho ? item.JornadaTrabalho.descricao : ""
					}}</span>
				</template>
				<template v-slot:[`body.EncarregadoLider.nome`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.EncarregadoLider
							? item.EncarregadoLider.nome
							: ""
					}}</span>
				</template>
				<template v-slot:[`body.Supervisor.nome`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Supervisor ? item.Supervisor.nome : ""
					}}</span>
				</template>

				<template v-slot:[`body.Engenheiro.nome`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Engenheiro ? item.Engenheiro.nome : ""
					}}</span>
				</template>
				<template v-slot:[`body.Coordenador.nome`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Coordenador ? item.Coordenador.nome : ""
					}}</span>
				</template>
				<template v-slot:[`body.Gestor.nome`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Gestor ? item.Gestor.nome  : ""
					}}</span>
				</template>
				<template v-slot:[`body.Disciplina.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Disciplina
							? `${item.Disciplina.sigla} - ${item.Disciplina.descricao}`
							: ""
					}}</span>
				</template>
				<template v-slot:[`body.SubDisciplina.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.SubDisciplina ? item.SubDisciplina.descricao : ""
					}}</span>
				</template>
				<template v-slot:[`body.setor.nome`]="{ item }">
					<span class="whitespace-nowrap">{{ item.setor ? item.setor.nome : "" }}</span>
				</template>
				<template v-slot:[`body.EquipePlanejamento.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.EquipePlanejamento ? item.EquipePlanejamento.descricao : ""
					}}</span>
				</template>

				<template v-slot:rodape>
					<div>
						<div>
							<AppFormSwitch
								label="Demitidos"
								v-model="mostrarDemitidos" />
						</div>
					</div>
				</template>
				<template v-slot:[`body.data_admissao`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.data_admissao"
						>{{ $dayjs(item.data_admissao).format("DD/MM/YYYY") }}</span
					>
				</template>
				<template v-slot:[`body.data_demissao`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.data_demissao"
						>{{ $dayjs(item.data_demissao).format("DD/MM/YYYY") }}</span
					>
				</template>
				<template v-slot:[`body.historico_mudanca`]="{ item }">
					<BotaoPadrao
						texto="Historico"
						class="!p-1"
						@click="
							funcionario_id = item.id
							mostrarDialogHistoricoMudanca = true
						">
						<img
							src="@/assets/icons/history-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</template>
			</TabelaPadrao>
			<RodapePagina>
				<template v-slot>
					<div class="flex items-center justify-between w-full">
						<div class="flex">
              <BotaoPadrao :texto="gerandoExcel === true ? 'Gerando...' : 'Gerar EXCEL'" @click="gerarExcel" :disabled="gerandoExcel">
                <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
              </BotaoPadrao>
						</div>
						<div class="flex">
							<BotaoPadrao
								@click="mostrarDialogEditarEfetivo = true"
								texto="editar"
								:disabled="funcSelecionados.length === 0">
								<img
									src="@/assets/icons/edit-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
				</template>
			</RodapePagina>
			<DialogEditarEfetivo
				v-if="mostrarDialogEditarEfetivo"
				@cancelar="mostrarDialogEditarEfetivo = false"
				:funcionarios="funcSelecionados"
				@rotaEditada="rotaEditada"
				@editado="funcionarioEditado" />
			<DialogHistoricoMudanca
				:funcionario_id="funcionario_id"
				v-if="mostrarDialogHistoricoMudanca"
				@cancelar="mostrarDialogHistoricoMudanca = false" />
			<AppAlerta
				tipo="sucesso"
				:mostrar="mostrarAlerta"
				@escondeu="mostrarAlerta = false">
				{{ textoAlerta }}
			</AppAlerta>
		</div>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoExcel from "~/components/Ui/Buttons/BotaoExcel.vue"

	import gerarExcel from "~/functions/gerarExcel"
	import { horaExtra } from "@/mixins/horaExtra"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogEditarEfetivo from "~/components/Dialogs/Administracao/Rh/Efetivo/DialogEditarEfetivo.vue"
	import DialogHistoricoMudanca from "~/components/Dialogs/Administracao/Rh/Efetivo/DialogHistoricoMudanca.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormSwitch from "~/components/Ui/AppFormSwitch.vue"

	export default {
		name: "index",
		mixins: [horaExtra],
		components: {
			AppFormSwitch,
			AppAlerta,
			DialogHistoricoMudanca,
			DialogEditarEfetivo,
			BotaoPadrao,
			TabelaPadrao,
			RodapePagina,
			BotaoExcel,
		},
		data() {
			return {
				dados: [],
				filtros: {},
				ordem: null,
				itensPorPagina: 200,
				pagina: 1,
				totalItens: 0,
				mostrarDialogEditarEfetivo: false,
				mostrarDialogHistoricoMudanca: false,
				funcSelecionados: [],
				funcionario_id: null,
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDemitidos: false,
				carregando: false,
				rotas: [],
        gerandoExcel: false
			}
		},
		computed: {
			cabecalho() {
				let cabecalho = [
					{
						nome: "Matrícula",
						valor: "chapa",
						filtro: true,
						ordenar: true,
						centralizar: true,
						fixa: false,
					},
					{ nome: "Nome", valor: "nome", filtro: true, fixa: false },
					{ nome: "Hora Extra", valor: "hora_extra", centralizar: true, ordenar: true },
					{ nome: "Cargo", valor: "cargo", filtro: true },
					{ nome: "Disciplina", valor: "Disciplina.descricao", filtro: true },
					{ nome: "Sub Disciplina", valor: "SubDisciplina.descricao", filtro: true },
					{ nome: "Setor", valor: "setor.nome", filtro: true },
					{ nome: "Encarregado/Lider SAPO", valor: "encarregado_sapo", filtro: true },
					{ nome: "Encarregado/Lider", valor: "EncarregadoLider.nome", filtro: true },
					{ nome: "Supervisor", valor: "Supervisor.nome", filtro: true },
					{ nome: "Engenheiro", valor: "Engenheiro.nome", filtro: true },
					{ nome: "Coordenador", valor: "Coordenador.nome", filtro: true },
					{ nome: "Gestor", valor: "Gestor.nome", filtro: true },
					{
						nome: "Rota",
						valor: "rota.id",
						filtro: true,
						opcoes:
							this.rotas.length > 0
								? Array.from(
										new Set(
											this.rotas
												.filter((item) => {
													return item.local
												})
												.map((item) => {
													return { id: item.id, texto: `${item.numero} - ${item.local}` }
												}),
										),
								  )
								: [],
					},
					{ nome: "Ponto de Embarque", valor: "ponto_embarque", filtro: true },
					{ nome: "Turno", valor: "Turno.descricao", filtro: true },
					{ nome: "Jornada", valor: "JornadaTrabalho.descricao", filtro: true },
					{ nome: "Equipe Planejamento", valor: "EquipePlanejamento.descricao", filtro: true },
					{ nome: "Data Admissão", valor: "data_admissao", filtro: true, centralizar: true },
					{ nome: "Data Demissão", valor: "data_demissao", filtro: true, centralizar: true },
					{ nome: "CPF", valor: "cpf", filtro: true },
					{ nome: "D/I", valor: "direto_indireto", filtro: true, centralizar: true },
					{ nome: "His. Mudanças", valor: "historico_mudanca", largura: "w-30" },
				]

				return cabecalho
			},
		},
		async created() {
			await this.buscarRotas()
			await this.buscarEfetivo()
		},
		methods: {
			async buscarRotas() {
				let resp = await this.$axios.$get("/efetivo/buscar/rotas")

				if (!resp.falha) {
					let rotas = resp.dados.rotas

					this.rotas = rotas
				}
			},

			recebendoFiltro(filtros) {
				this.filtros = filtros
			},
			async buscarEfetivo() {
				this.carregando = true

				let filtros = this.filtros
				let ordem = this.ordem

				if (this.mostrarDemitidos === false) {
					filtros["data_demissao"] = null
				} else {
					delete filtros.data_demissao
				}

				let resp = await this.$axios.$get("/efetivo/buscar_funcionarios", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					let total = resp.dados.total

					this.totalItens = total
					this.dados = funcionarios
					this.carregando = false
				}

				// let funcionarios = await this.$store.state.funcionarios.funcionarios
				//
				// if (Object.keys(this.filtros).length > 0) {
				//   for (let filtro of Object.keys(this.filtros)) {
				//     let rgx = new RegExp(`${this.filtros[filtro]}`, "gi");
				//
				//     funcionarios = this.$lodash.filter(funcionarios, o => {
				//       return rgx.test(o[filtro])
				//     })
				//   }
				// }
				//
				// let off = (this.pagina - 1) * this.itensPorPagina
				// let pagedItems = this.$lodash.drop(funcionarios, off).slice(0, this.itensPorPagina);
				//
				// this.totalItens = funcionarios.length
				// this.dados = pagedItems
			},

			async funcionarioEditado({ funcionarios, nomes }) {
				for (let id of funcionarios) {
					let idx = this.dados.findIndex((o) => o.id === id)

					if (idx >= 0) {
						nomes.responsavelNome
							? this.dados[idx].encarregado_lider_id !== null
								? (this.dados[idx].EncarregadoLider.nome = nomes.responsavelNome)
								: (this.dados[idx].EncarregadoLider = { nome: nomes.responsavelNome })
							: null

						nomes.engenheiroNome
							? this.dados[idx].engenheiro_id !== null
								? (this.dados[idx].Engenheiro.nome = nomes.engenheiroNome)
								: (this.dados[idx].Engenheiro = { nome: nomes.engenheiroNome })
							: null

						nomes.supervisorNome
							? this.dados[idx].supervisor_id !== null
								? (this.dados[idx].Supervisor.nome = nomes.supervisorNome)
								: (this.dados[idx].Supervisor = { nome: nomes.supervisorNome })
							: null

						nomes.coordenadorNome
							? this.dados[idx].coordenador_id !== null
								? (this.dados[idx].Coordenador.nome = nomes.coordenadorNome)
								: (this.dados[idx].Coordenador = { nome: nomes.coordenadorNome })
							: null

						nomes.gestorNome
							? this.dados[idx].gestor_id !== null
								? (this.dados[idx].Gestor.nome = nomes.gestorNome)
								: (this.dados[idx].Gestor = { nome: nomes.gestorNome })
							: null

						nomes.disciplinaDescricaoNome
							? this.dados[idx].disciplina_id !== null
								? (this.dados[idx].Disciplina.descricao = nomes.disciplinaDescricaoNome)
								: (this.dados[idx].Disciplina = { descricao: nomes.disciplinaDescricaoNome })
							: null

						nomes.disciplinaSiglaNome
							? this.dados[idx].disciplina_id !== null
								? (this.dados[idx].Disciplina.sigla = nomes.disciplinaSiglaNome)
								: (this.dados[idx].Disciplina = { sigla: nomes.disciplinaSiglaNome })
							: null

						nomes.subDisciplinaNome
							? this.dados[idx].sub_disciplina_id !== null
								? (this.dados[idx].SubDisciplina.descricao = nomes.subDisciplinaNome)
								: (this.dados[idx].SubDisciplin = { descricao: nomes.subDisciplinaNome })
							: null

						nomes.turnoNome
							? this.dados[idx].turno_id !== null
								? (this.dados[idx].Turno.descricao = nomes.turnoNome)
								: (this.dados[idx].Turno = { descricao: nomes.turnoNome })
							: null

						nomes.jornadaTrabalhoNome
							? this.dados[idx].jornada_trabalho_id !== null
								? (this.dados[idx].JornadaTrabalho.descricao = nomes.jornadaTrabalhoNome)
								: (this.dados[idx].JornadaTrabalho = { descricao: nomes.jornadaTrabalhoNome })
							: null

						nomes.setorNome
							? this.dados[idx].setor_id
								? (this.dados[idx].setor.nome = nomes.setorNome)
								: (this.dados[idx].setor = { nome: nomes.setorNome })
							: null
					}
				}

				this.mostrarDialogEditarEfetivo = false
				this.mostrarAlerta = true
				this.funcSelecionados = []
				this.textoAlerta = "Funcionários editados com sucesso!"
			},

			async rotaEditada({ funcionarios, rota }) {
				for (let id of funcionarios) {
					let idx = this.dados.findIndex((o) => o.id === id)

					if (idx >= 0) {
						rota.numero ? (this.dados[idx].rota.numero = rota.numero) : null
						rota.local ? (this.dados[idx].rota.local = rota.local) : null
						rota.ponto_embarque ? (this.dados[idx].ponto_embarque = rota.ponto_embarque) : null
					}
				}

				this.mostrarDialogEditarEfetivo = false
				this.mostrarAlerta = true
				this.textoAlerta = "Rotas dos funcinários editadas com sucesso!"
			},

			async gerarExcel() {
				this.gerandoExcel = true
				let cabecalho = [
					"Matricula",
					"Nome",
					"Hora extra",
					"Cargo",
					"Disciplina",
					"Sub Disciplina",
					"Setor",
					"Encarregado/Lider SAPO",
					"Encarregado/Lider",
					"Supervisor",
					"Engenheiro",
					"Coordenador",
					"Gestor",
					"Rota",
          "Ponto embarque",
					"Turno",
					"Jornada",
					"Equipe Planejamento",
					"Data de admissão",
					"Data de demissão",
					"CPF",
					"Direto/Indireto",
				]
				let nomeArquivo

				nomeArquivo = "efetivo"

				let itens = []
				for (let item of this.dados) {
					let temp = []
					temp.push(("0000000000" + item.chapa).slice(-10))
					temp.push(item.nome)
					temp.push(this.horaExtra(item.hora_extra))
					temp.push(item.cargo)
					temp.push(item.Disciplina ? `${item.Disciplina.sigla} - ${item.Disciplina.descricao}` : "")
					temp.push(item.SubDisciplina ? item.SubDisciplina.descricao : "")
					temp.push(item.setor ? item.setor.nome : "")
					temp.push(item.encarregado_sapo ? item.encarregado_sapo : "")
					temp.push(item.EncarregadoLider ? item.EncarregadoLider.nome : "")
					temp.push(item.Supervisor ? item.Supervisor.nome : "")
					temp.push(item.Engenheiro ? item.Engenheiro.nome : "")
					temp.push(item.Coordenador ? item.Coordenador.nome : "")
					temp.push(item.Gestor ? item.Gestor.nome : "")
					item.rota ? temp.push(`${item.rota.numero} - ${item.rota.local}`) : temp.push("")
					temp.push(item.ponto_embarque ? item.ponto_embarque : "" )
					temp.push(item.Turno ? item.Turno.descricao : "")
					temp.push(item.JornadaTrabalho ? item.JornadaTrabalho.descricao : "")
          temp.push(item.EquipePlanejamento ? item.EquipePlanejamento.descricao : "")
					temp.push(this.$dayjs(item.data_admissao).format("DD/MM/YYYY"))
					item.data_demissao
						? temp.push(this.$dayjs(item.data_demissao).format("DD/MM/YYYY"))
						: temp.push("")
					temp.push(item.cpf)
					temp.push(item.direto_indireto)
					itens.push(temp)
				}

				this.gerandoExcel = false
				gerarExcel(cabecalho, itens, nomeArquivo)
			},
		},
		watch: {
			mostrarDemitidos(valor) {
				this.buscarEfetivo()
			},
		},
	}
</script>

<style scoped></style>
