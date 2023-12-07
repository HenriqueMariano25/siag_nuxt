<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			:carregando="carregando"
			:btn-deletar="tab === 'rh'"
			@deletar="deletarFuncionario()"
			titulo="Editar funcionários"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full gap-1 px-2">
					<div class="flex w-full max-h-[150px] overflow-y-auto border border-gray-300">
						<table class="w-full">
							<thead>
								<tr class="uppercase px-2 py-1 text-sm text-white relative bg-primaria-700">
									<th>Matricula</th>
									<th>Nome</th>
									<th>Cargo</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="funcionario of funcionarios"
									:key="funcionario.id"
									class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
									<td>{{ funcionario.chapa }}</td>
									<td>{{ funcionario.nome }}</td>
									<td>{{ funcionario.cargo }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div
						class="flex items-center"
						v-if="funcionarios.length > 1">
						<img
							src="@/assets/icons/alert-triangle-r.svg"
							alt=""
							class="w-7 h-7" />
						<span>
							<strong>
								As mudanças abaixo irá alterar em todos os funcionários da lista a cima
							</strong>
						</span>
					</div>
					<AppTabs
						:tabs="tabs"
						@tab="tab = $event">
						<template v-slot:[`tab.informacoes`]="{}">
							<div class="flex flex-col gap-2">
								<div class="flex flex-col bg-gray-200 border border-gray-300 rounded">
									<div class="flex">
										<span class="bg-gray-400 w-full p-1 uppercase">
											<strong>Responsáveis</strong>
										</span>
									</div>
									<div class="grid grid-cols-3 p-1 gap-2">
										<AppFormSelectCompleto
											obrigatorio
											id="encarregado_lider"
											label="Encarregado/Lider"
											:options="responsaveis"
											v-model="campos.encarregado_lider_id"
											:invalido="erros.includes('encarregado_lider_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="supervisor"
											label="Supervisor"
											:options="responsaveis"
											v-model="campos.supervisor_id"
											:invalido="erros.includes('supervisor_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="engenheiro"
											label="Engenheiro"
											:options="responsaveis"
											v-model="campos.engenheiro_id"
											:invalido="erros.includes('engenheiro_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="coordenador"
											label="Coordenador"
											:options="responsaveis"
											v-model="campos.coordenador_id"
											:invalido="erros.includes('coordenador_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="gestor"
											label="Gestor"
											:options="responsaveis"
											v-model="campos.gestor_id"
											:invalido="erros.includes('gestor_id')" />
									</div>
								</div>
								<div class="flex flex-col bg-gray-200 border border-gray-300 rounded">
									<div class="flex">
										<span class="bg-gray-400 w-full p-1 uppercase">
											<strong>Informações Adicionais</strong>
										</span>
									</div>
									<div class="grid grid-cols-3 p-1 gap-2">
										<AppFormSelectCompleto
											obrigatorio
											id="disciplina"
											label="Disciplina"
											:options="disciplinas"
											v-model="campos.disciplina_id"
											:invalido="erros.includes('disciplina_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="subDisciplina"
											label="Sub Disciplina"
											:options="subDisciplinas"
											:disabled="!campos.disciplina_id"
											dica="Para habilitar esse campo, primeiro selecione uma Disciplina."
											v-model="campos.sub_disciplina_id"
											:invalido="erros.includes('sub_disciplina_id')" />
										<AppFormSelectCompleto
											obrigatorio
											id="setor"
											label="Setor"
											:options="setores"
											:disabled="!campos.disciplina_id"
											readonly
											v-model="campos.setor_id"
											:invalido="erros.includes('setor_id')" />
										<AppFormSelect
											label="Turno"
											:options="turnos"
											obrigatorio
											v-model="campos.turno_id"
											id="turno"
											:invalido="erros.includes('turno_id')" />
										<AppFormSelect
											label="Jornada de trabalho"
											obrigatorio
											:options="jornadasTrabalho"
											v-model="campos.jornada_trabalho_id"
											id="jornadaTrabalho"
											:invalido="erros.includes('jornada_trabalho_id')" />
										<AppFormSelect
											id="permanencia"
											label="Permanência"
											:options="tiposPermanencia"
											v-model="campos.permanencia"
											obrigatorio
											:invalido="erros.includes('permanencia')" />
									</div>
								</div>
							</div>
						</template>
						<template v-slot:[`tab.transporte`]="{}">
							<div class="flex flex-col gap-2">
								<div class="grid grid-cols-2 gap-2">
									<AppFormSelectCompleto
										id="rota"
										label="Rota"
										:options="rotas"
										obrigatorio
										v-model="transporte.rota_id"
										:invalido="erros.includes('rota_id')" />
									<AppFormInput
										id="pontoEmbarque"
										type="text"
										placeholder="Ex: Rua da Caixa D'agua"
										v-model="transporte.ponto_embarque"
										label="Ponto de embarque" />
									<AppFormInput
										v-if="funcionarios.length === 1"
										id="poltrona"
										type="text"
										placeholder="Ex: 1"
										v-model="transporte.poltrona"
										label="Poltrona" />
								</div>
							</div>
						</template>
						<template v-slot:[`tab.planejamento`]="{}">
							<div class="flex flex-col gap-2">
								<div class="grid grid-cols-2 gap-2">
									<AppFormSelectCompleto
										obrigatorio
										id="equipePlanejamento"
										label="Equipe Planejamento"
										:options="equipesPlanejamento"
										v-model="planejamento.equipe_planejamento_id"
										:invalido="erros.includes('equipe_planejamento_id')" />
								</div>
							</div>
						</template>
						<template v-slot:[`tab.rh`]="{}">
							<div class="grid gap-2 grid-cols-2">
								<AppFormInput
									id="nome"
									type="text"
									placeholder="Ex: HENRIQUE MARIANO DA SILVA"
									sem-especiais
									uppercase
									obrigatorio
									v-model="funcionario.nome"
									:invalido="erros.includes('nome')"
									label="Nome" />
								<AppFormInput
									id="chapa"
									type="text"
									placeholder="Ex: 1950000001"
									obrigatorio
									mask="##########"
									v-model="funcionario.chapa"
									:invalido="erros.includes('chapa')"
									label="Chapa" />
								<AppFormInput
									id="cargo"
									type="text"
									uppercase
									placeholder="Ex: Cargo"
									v-model="funcionario.cargo"
									obrigatorio
									:invalido="erros.includes('cargo')"
									label="Cargo" />
								<AppFormInput
									id="data_admissao"
									type="date"
									v-model="funcionario.data_admissao"
									obrigatorio
									:invalido="erros.includes('data_admissao')"
									label="Data de admissão" />
								<AppFormInput
									id="cpf"
									type="text"
									placeholder="Ex: 123.456.789-10"
									obrigatorio
									mask="###.###.###-##"
									v-model="funcionario.cpf"
									label="CPF"
									:invalido="erros.includes('cpf')" />
								<AppFormSelect
									label="Mão de Obra"
									obrigatorio
									:options="maosObra"
									v-model="funcionario.direto_indireto"
									id="direto_indireto"
									:invalido="erros.includes('direto_indireto')" />
							</div>
							<div class="text-center bg-red-200 text-red-700 text-xl mt-2">
								<span v-if="erroEdicao">
									<strong>{{ mensagemEdicao }}</strong>
								</span>
							</div>
						</template>
					</AppTabs>
					<!--          {{ funcionarios}}-->
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex gap-2">
					<!-- <BotaoPadrao
						texto="deletar"
						cor="bg-red-400 hover:bg-red-500">
						<img
							src="@/assets/icons/delete-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao> -->
					<BotaoPadrao
						texto="Salvar"
						@clique="
							tab === 'transporte'
								? editarRota()
								: tab === 'planejamento'
								? editarPlanejamento()
								: tab === 'rh'
								? editarRh()
								: editarFuncionarios()
						">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import { defineComponent } from "vue"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import {
		buscarDisciplina,
		buscarEquipePlanejamento,
		buscarSetores,
		buscarSubDisciplina,
	} from "~/mixins/buscarInformacoes"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"

	export default defineComponent({
		mixins: [buscarSetores, buscarDisciplina, buscarSubDisciplina, buscarEquipePlanejamento],
		name: "DialogEditarEfetivo",
		components: {
			AppFormInput,
			AppTabs,
			AppFormSelect,
			BotaoPadrao,
			BaseDialog,
			AppFormSelectCompleto,
		},
		props: {
			funcionarios: {
				type: [Array],
			},
		},
		data() {
			return {
				campos: {
					encarregado_lider_id: null,
					supervisor_id: null,
					engenheiro_id: null,
					coordenador_id: null,
					gestor_id: null,
					disciplina_id: null,
					sub_disciplina_id: null,
					setor_id: null,
					turno_id: null,
					jornada_trabalho_id: null,
				},
				transporte: {
					rota_id: null,
					ponto_embarque: null,
					poltrona: null,
				},
				planejamento: {
					permanencia: null,
					equipe_planejamento_id: null,
				},
				responsaveis: [],
				erros: [],
				disciplinas: [],
				subDisciplinas: [],
				equipesPlanejamento: [],
				setores: [],
				turnos: [],
				jornadasTrabalho: [],
				tab: "informacoes",
				rotas: [],
				buscouRotas: false,
				rotasOriginais: [],
				carregando: false,
				tiposPermanencia: [
					{ id: "permanência", nome: "Permanência" },
					{ id: "produtivo", nome: "Produtivo" },
				],

				//RH
				funcionario: {
					nome: null,
					chapa: null,
					cargo: null,
					setor_id: null,
					direto_indireto: null,
					data_admissao: null,
					cpf: null,
				},
				maosObra: [
					{ id: "D", nome: "MOD - Mão de Obra Direta" },
					{ id: "I", nome: "MOI - Mão de Obra Indireta" },
				],
				erroEdicao: false,
				mensagemEdicao: null,
				errosFuncionario: [],
			}
		},

		computed: {
			tabs() {
				let tabs = [{ nome: "Inf. Principais", valor: "informacoes" }]

				if (this.$auth.user.permissoes.includes("efetivo_transporte"))
					tabs.push({ nome: "Transporte", valor: "transporte" })

				if (this.$auth.user.permissoes.includes("efetivo_planejamento"))
					tabs.push({ nome: "Planejamento", valor: "planejamento" })

				if (this.funcionarios.length === 1) {
					if (this.funcionarios[0].tipo_cadastro === "manual") {
						if (this.$auth.user.permissoes.includes("efetivo_cadastrar_funcionario"))
							tabs.push({ nome: "RH", valor: "rh" })
					}
				}

				return tabs
			},
		},
		async mounted() {
			await this.buscarResponsaveis()
			await this.buscarDisciplinas()
			// await this.buscarSubDisciplinas()
			await this.buscarEquipesPlanejamento()
			await this.buscarTurnos()
			await this.buscarJornadaTrabalho()

			let setores = await this.buscarSetores()
			this.setores = setores.map((o) => {
				return { id: o.id, nome: o.nome }
			})

			if (this.funcionarios.length === 1) {
				this.carregando = true
				let funcionario = Object.assign({}, this.funcionarios[0])

				this.campos.disciplina_id = funcionario.disciplina_id
				this.campos.encarregado_lider_id = funcionario.encarregado_lider_id
				this.campos.supervisor_id = funcionario.supervisor_id
				this.campos.coordenador_id = funcionario.coordenador_id
				this.campos.engenheiro_id = funcionario.engenheiro_id
				this.campos.gestor_id = funcionario.gestor_id
				this.campos.sub_disciplina_id = funcionario.sub_disciplina_id
				this.campos.turno_id = funcionario.turno_id
				this.campos.jornada_trabalho_id = funcionario.jornada_trabalho_id
				this.campos.setor_id = funcionario.setor ? funcionario.setor.id : null
				this.campos.permanencia = funcionario.permanencia ? funcionario.permanencia : null

				this.transporte.rota_id = funcionario.rota ? funcionario.rota.id : null
				this.transporte.poltrona = funcionario.poltrona ? funcionario.poltrona : null
				this.transporte.ponto_embarque = funcionario.ponto_embarque
					? funcionario.ponto_embarque
					: null

				this.planejamento.equipe_planejamento_id = funcionario.equipe_planejamento_id
					? funcionario.equipe_planejamento_id
					: null
			} else {
				if ([...new Set(this.funcionarios.map((o) => o.disciplina_id))].length === 1) {
					this.campos.disciplina_id = this.funcionarios[0].disciplina_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.encarregado_lider_id))].length === 1) {
					this.campos.encarregado_lider_id = this.funcionarios[0].encarregado_lider_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.supervisor_id))].length === 1) {
					this.campos.supervisor_id = this.funcionarios[0].supervisor_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.coordenador_id))].length === 1) {
					this.campos.coordenador_id = this.funcionarios[0].coordenador_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.engenheiro_id))].length === 1) {
					this.campos.engenheiro_id = this.funcionarios[0].engenheiro_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.gestor_id))].length === 1) {
					this.campos.gestor_id = this.funcionarios[0].gestor_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.sub_disciplina_id))].length === 1) {
					this.campos.sub_disciplina_id = this.funcionarios[0].sub_disciplina_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.equipe_planejamento_id))].length === 1) {
					this.campos.equipe_planejamento_id = this.funcionarios[0].equipe_planejamento_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.turno_id))].length === 1) {
					this.campos.turno_id = this.funcionarios[0].turno_id
				}

				if ([...new Set(this.funcionarios.map((o) => o.jornada_trabalho_id))].length === 1) {
					this.campos.jornada_trabalho_id = this.funcionarios[0].jornada_trabalho_id
				}

				if (
					[
						...new Set(
							this.funcionarios.map((o) => {
								return o.setor ? o.setor.id : null
							}),
						),
					].length === 1
				) {
					this.campos.setor_id = this.funcionarios[0].setor ? this.funcionarios[0].setor.id : null
				}
			}
			this.carregando = false
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarResponsaveis() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let responsaveis = resp.dados.responsaveis

					this.responsaveis = responsaveis.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},

			async buscarDisciplinas() {
				await this.buscarDisciplina()
				let disciplinas = this.$store.state.disciplina.disciplinas

				this.disciplinas = disciplinas.map((o) => {
					return {
						id: o.id,
						nome: `${o.sigla} - ${o.descricao}`,
						setor_id: o.setor_id,
						setor: o.setor.nome,
					}
				})
			},

			async buscarSubDisciplinas() {
				let disciplina_id = this.campos.disciplina_id

				await this.buscarSubDisciplina(true, { disciplina_id })
				let subDisciplinas = this.$store.state.subDisciplina.subDisciplinas
				this.subDisciplinas = subDisciplinas.map((o) => {
					return { id: o.id, nome: o.descricao }
				})
			},

			async buscarEquipesPlanejamento() {
				await this.buscarEquipePlanejamento()
				let equipesPlanejamento = this.$store.state.equipePlanejamento.equipesPlanejamento
				this.equipesPlanejamento = equipesPlanejamento.map((o) => {
					return { id: o.id, nome: o.descricao }
				})
			},

			async buscarTurnos() {
				let resp = await this.$axios.$get("/efetivo/buscar/turnos")

				if (!resp.falha) {
					let turnos = resp.dados.turnos

					this.turnos = turnos.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},

			async buscarJornadaTrabalho() {
				let resp = await this.$axios.$get("/efetivo/buscar/jornadas_trabalho")

				if (!resp.falha) {
					let jornadasTrabalho = resp.dados.jornadasTrabalho

					this.jornadasTrabalho = jornadasTrabalho.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = [
					"encarregado_lider_id",
					"supervisor_id",
					"engenheiro_id",
					"coordenador_id",
					"gestor_id",
					"disciplina_id",
					"sub_disciplina_id",
					"setor_id",
					"turno_id",
					"jornada_trabalho_id",
				]

				for (let campo of camposObrigatorio) {
					if (this.campos[`${campo}`] === null || this.campos[`${campo}`] === "")
						this.erros.push(campo)
				}
			},

			async editarFuncionarios() {
				this.validarFormulario()

				if (this.erros.length === 0) {
					let campos = Object.assign({}, this.campos)
					let funcionarios = this.funcionarios
					let usuario_id = this.$auth.user.id

					let cont = 0
					let contTotal = 0
					let funcPrEnviar = []
					let nomes = {}

					for (let fun of funcionarios) {
						cont++
						contTotal++
						funcPrEnviar.push(fun.id)
						if (cont === 5 || contTotal === funcionarios.length) {
							let resp = await this.$axios.$put("/efetivo/editar_funcionario", {
								...campos,
								funcionarios: funcPrEnviar,
								usuario_id,
							})

							if (!resp.falha) {
								funcPrEnviar = []
								cont = 0
								nomes = resp.dados
							}
						}
					}

					let ids = funcionarios.map((o) => o.id)

					this.$emit("editado")
				}
			},

			async editarRota() {
				let funcionarios = this.funcionarios
				let usuario_id = this.$auth.user.id

				let cont = 0
				let contTotal = 0
				let funcPrEnviar = []

				let campos = {}
				let rota = {}
				let ponto_embarque = this.transporte.ponto_embarque
				let poltrona = this.transporte.poltrona
				let rota_id = this.transporte.rota_id

				if (rota_id !== null && rota_id !== "") {
					campos["rota_id"] = rota_id

					let rotaSelecionada = this.rotasOriginais.find((o) => o.id === rota_id)

					rota["local"] = rotaSelecionada.local
					rota["numero"] = rotaSelecionada.numero
				}

				if (ponto_embarque !== null && ponto_embarque !== "") {
					campos["ponto_embarque"] = ponto_embarque
					rota["ponto_embarque"] = ponto_embarque
				}

				if (poltrona !== null && poltrona !== "") {
					campos["poltrona"] = poltrona
				}

				for (let fun of funcionarios) {
					cont++
					contTotal++
					funcPrEnviar.push(fun.id)
					if (cont === 5 || contTotal === funcionarios.length) {
						let resp = await this.$axios.$put("/efetivo/funcionario/editar/rota", {
							campos,
							funcionarios: funcPrEnviar,
							usuario_id,
						})

						if (!resp.falha) {
							funcPrEnviar = []
							cont = 0
						}
					}
				}

				let chapas = funcionarios.map((o) => o.id)

				this.$emit("rotaEditada")
			},

			async buscarRotas() {
				let resp = await this.$axios.$get("/efetivo/buscar/rotas")

				if (!resp.falha) {
					let rotas = resp.dados.rotas
					this.rotasOriginais = resp.dados.rotas

					let options = rotas.map((o) => {
						return { id: o.id, nome: `${o.numero} - ${o.local}` }
					})

					this.rotas = options
				}
			},

			async editarPlanejamento() {
				this.erros = []

				let { equipe_planejamento_id } = this.planejamento

				if (equipe_planejamento_id === null || equipe_planejamento_id === "")
					this.erros.push("equipe_planejamento_id")

				if (this.erros.length === 0) {
					let funcionarios = this.funcionarios
					let usuario_id = this.$auth.user.id

					let cont = 0
					let contTotal = 0
					let funcPrEnviar = []

					let campos = {}

					if (equipe_planejamento_id !== null && equipe_planejamento_id !== "") {
						campos["equipe_planejamento_id"] = equipe_planejamento_id
					}

					let equipePlanejamento

					for (let fun of funcionarios) {
						cont++
						contTotal++
						funcPrEnviar.push(fun.id)
						if (cont === 5 || contTotal === funcionarios.length) {
							let resp = await this.$axios.$put("/efetivo/funcionario/editar/planejamento", {
								campos,
								funcionarios: funcPrEnviar,
								usuario_id,
							})

							if (!resp.falha) {
								funcPrEnviar = []
								cont = 0
								equipePlanejamento = resp.dados.equipePlanejamento
							}
						}
					}

					let chapas = funcionarios.map((o) => o.id)

					this.$emit("equipePlanEditada")
				}
			},

			validarFormRH() {
				this.erros = []

				let camposObrigatorio = [
					"nome",
					"chapa",
					"cargo",
					"direto_indireto",
					"data_admissao",
					"cpf",
				]

				for (let campo of camposObrigatorio) {
					if (this.funcionario[`${campo}`] === null || this.funcionario[`${campo}`] === "")
						this.errosFunciona.push(campo)
				}
			},

			limparCampos(campos) {
				for (let key of Object.keys(campos)) {
					if (typeof campos[key] === "string") {
						campos[key] = campos[key].trim()
					}
				}

				return campos
			},

			async editarRh() {
				let usuario_id = this.$auth.user.id
				this.erroEdicao = false
				this.validarFormRH()

				if (this.errosFuncionario.length === 0) {
					let funcionario = this.limparCampos(this.funcionario)
					try {
						let resp = await this.$axios.$post("/efetivo/editar_funcionario_manual", {
							...funcionario,
							usuario_id,
						})

						if (!resp.falha) {
							this.$emit("editadoFuncionario")
						}
					} catch (error) {
						let { dados } = error.response.data
						this.erroEdicao = true
						this.mensagemEdicao = dados.mensagem
					}
				}
			},

			async deletarFuncionario() {
				let usuario_id = this.$auth.user.id
				let { id } = this.funcionario

				try {
					let resp = await this.$axios.$post(`/efetivo/deletar_funcionario_manual`, {
						usuario_id,
						id,
					})

					if (!resp.falha) {
						this.$emit("deletadoFuncionario")
					}
				} catch (error) {
					console.log(error)
				}
			},
		},
		watch: {
			async "campos.disciplina_id"(valor) {
				if (valor === null || valor === "") {
					this.campos.setor_id = null
				} else {
					let disciplina = this.disciplinas.find((o) => o.id === valor)

					if (disciplina) {
						this.campos.setor_id = disciplina.setor_id
					}

					await this.buscarSubDisciplinas()

					let temSubDiscNaDisciplina = this.subDisciplinas.some(
						(o) => o.id === this.campos.sub_disciplina_id,
					)
					if (!temSubDiscNaDisciplina) {
						this.campos.sub_disciplina_id = null
					}
				}
			},
			tab(valor) {
				if (valor === "transporte") {
					if (this.buscouRotas === false) {
						this.buscarRotas()
					}
				} else if (valor === "planejamento") {
					if (this.funcionarios.length === 1) {
						this.planejamento.equipe_planejamento_id = this.funcionarios[0] && this.funcionarios[0].EquipePlanejamento ? this.funcionarios[0].EquipePlanejamento.id : null
						this.planejamento.permanencia = this.funcionarios[0].permanencia
					}
				} else if (valor === "rh") {
					let func = Object.assign({}, this.funcionarios[0])

					let funcionario = {
						nome: func.nome,
						chapa: func.chapa,
						cargo: func.cargo,
						data_admissao: func.data_admissao,
						direto_indireto: func.direto_indireto,
						cpf: func.cpf,
						id: func.id,
					}
					this.funcionario = funcionario
				}
			},
		},
	})
</script>

<style scoped></style>
