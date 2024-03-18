<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			class="uppercase"
			:titulo="monitor === null ? `Cadastrar monitor` : `Editar monitor`"
			:carregando="carregando"
			:btnDeletar="monitor !== null"
			@deletar="deletarMonitor"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.geral`]="{ item }">
						<div class="flex flex-col w-full px-2">
							<div class="grid grid-cols-3 gap-x-2 gap-y-2.5">
								<AppFormInput
									label="Patrimônio"
									placeholder="Ex: 003580"
									type="text"
									uppercase
									v-model="monitorLocal.patrimonio"
									id="patrimonio"
									:invalido="erros.includes('patrimonio')" />
								<AppFormInput
									label="Serial"
									obrigatorio
									placeholder="Ex: 6YPJYR2"
									type="text"
									uppercase
									v-model="monitorLocal.serial"
									id="serial"
									:invalido="erros.includes('serial')" />
								<AppFormSelectCompleto
									style="z-index: 103 !important"
									class="grow"
									id="marca"
									:invalido="erros.includes('marcati_id')"
									v-model="monitorLocal.marcati_id"
									btn-cadastrar
									label="Marca"
									obrigatorio
									@cadastrar="mostrarDialogCadastrarMarca = true"
									tooltip-add="Cadastrar marca"
									:options="marcas"
									@deletar="deletarMarca" />
								<AppFormSelectCompleto
									style="z-index: 103 !important"
									class="grow"
									obrigatorio
									id="modelo"
									:invalido="erros.includes('modeloti_id')"
									v-model="monitorLocal.modeloti_id"
									btn-cadastrar
									label="Modelo"
									@cadastrar="mostrarDialogCadastrarModelo = true"
									tooltip-add="Cadastrar modelo"
									:options="modelos"
									@deletar="deletarModelo" />
								<AppFormSelectCompleto
									style="z-index: 101 !important"
									class="grow"
									id="local_instalacao"
									v-model="monitorLocal.localinstalacaoti_id"
									btn-cadastrar
									@deletar="deletarLocalInstalacao"
									label="Local de Instalação"
									obrigatorio
									:invalido="erros.includes('localinstalacaoti_id')"
									@cadastrar="mostrarDialogCadastrarLocalInstalacao = true"
									tooltip-add="Cadastrar local de instalação"
									:options="locaisInstalacao" />
								<AppFormTextarea
									id="observacao"
									:total-caracteres="1000"
									label="Observação"
									v-model="monitorLocal.observacao"
									linhas="2"
									placeholder="Observação opcional"
									class="col-span-3" />
							</div>
						</div>
					</template>
					<template v-slot:[`tab.funcionario`]="{ item }">
						<div class="px-2 flex gap-2 flex-col mt-2">
							<div class="pt-2">
								<span class="border-b-2 border-gray-700 w-full flex px-3 font-bold">
									Funcionário atual
								</span>
								<div v-if="monitorLocal.Funcionario === null">
									<div class="bg-green-700 m-2 text-center text-xl text-white py-1 font-bold">
										<span>EM ESTOQUE</span>
									</div>
									<span
										v-if="monitorLocal.data_entrega"
										class="px-2">
										<strong>DATA DE ENTREGA:</strong>
										{{ $dayjs(monitorLocal.data_entrega).format("DD/MM/YYYY HH:mm:ss") }}
									</span>
								</div>
								<div
									class="grid grid-cols-2 px-2 mt-1"
									v-if="monitorLocal.Funcionario !== null">
									<span><strong>Nome: </strong>{{ monitorLocal.Funcionario.nome }}</span>
									<span><strong>Matrícula: </strong>{{ monitorLocal.Funcionario.chapa }}</span>
									<span><strong>Cargo: </strong>{{ monitorLocal.Funcionario.cargo }}</span>
									<span>
										<strong>Setor: </strong>
										{{ monitorLocal.Funcionario.setor ? monitorLocal.Funcionario.setor.nome : "" }}
									</span>
									<span>
										<strong>Data de entrega: </strong>
										{{ $dayjs(monitorLocal.data_entrega).format("DD/MM/YYYY HH:mm:ss") }}
									</span>
								</div>
							</div>
							<div class="border border-blue-200 flex gap-2 flex-col py-2 bg-blue-100">
								<span class="border-b-2 border-gray-700 w-full flex px-3 font-bold">
									Trocar de funcionário
								</span>
								<span class="px-4 !text-sm text-gray-600 !font-bold">
									Para trocar o equipamento entre responsáveis, selecione o funcionário abaixo.
								</span>
								<div class="px-2 grid grid-cols-3 gap-2">
									<AppFormSelectCompleto
										id="funcionario"
										label="Funcionário"
										:options="funcionarios"
										v-model="novo_funcionario_id"
										class="col-span-3" />
									<AppFormInput
										type="text"
										placeholder="Ex: 195000001"
										label="Matricula"
										readonly
										v-model="funcionario.chapa"
										disabled
										id="matricula" />
									<AppFormInput
										type="text"
										readonly
										v-model="funcionario.cargo"
										disabled
										placeholder="Ex: Programador"
										label="Cargo"
										id="cargo" />
									<AppFormInput
										type="text"
										readonly
										disabled
										v-model="funcionario.setor.nome"
										placeholder="Ex: Administração"
										label="Setor"
										id="setor" />
								</div>
							</div>
						</div>
					</template>
					<template v-slot:[`tab.desktopNotebook`]="{ item }">
						<div class="px-2 flex gap-2 flex-col mt-2">
							<div class="pt-2">
								<span class="border-b-2 border-gray-700 w-full flex px-3 font-bold">
									Desktop/Notebook atual
								</span>
								<div
									class="grid grid-cols-3 px-2 mt-1"
									v-if="monitorLocal.DesktopNotebookTI !== null">
									<span>
										<strong>Patrimônio: </strong>
										{{ monitorLocal.DesktopNotebookTI.patrimonio }}
									</span>
									<span><strong>Serial: </strong>{{ monitorLocal.DesktopNotebookTI.serial }}</span>
									<span>
										<strong>HostName: </strong>{{ monitorLocal.DesktopNotebookTI.hostname }}
									</span>
									<span>
										<strong>Marca: </strong>
										{{
											monitorLocal.DesktopNotebookTI.MarcaTI
												? monitorLocal.DesktopNotebookTI.MarcaTI.nome
												: ""
										}}
									</span>
									<span>
										<strong>Modelo: </strong>
										{{
											monitorLocal.DesktopNotebookTI.ModeloTI
												? monitorLocal.DesktopNotebookTI.ModeloTI.nome
												: ""
										}}
									</span>
								</div>
							</div>
							<div class="border border-blue-200 flex gap-2 flex-col py-2 bg-blue-100 px-2">
								<div class="flex gap-2 w-full">
									<AppFormInput
										type="text"
										class="grow"
										uppercase
										v-model="buscaDeskNote"
										placeholder="Ex: GNA2-0001"
										label="Buscar por patrimônio, serial ou hostname"
										id="patrimonio_serial_hostname" />
									<div class="flex items-end">
										<BotaoPadrao
											texto="buscar"
											cor="bg-blue-400 hover:!bg-blue-500"
											@clique="buscarDeskNote()"
											:disabled="bloquearBuscarDeskNote">
											<img
												src="@/assets/icons/magnifier-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
								<div class="w-full table">
									<table class="tabela-desknote bg-white w-full text-md">
										<thead class="bg-blue-900 text-white">
											<tr>
												<th class="w-24"></th>
												<th>Patrimônio</th>
												<th>Serial</th>
												<th>Hostname</th>
												<th>Marca</th>
												<th>Modelo</th>
												<th>Tipo</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="deskNote of desktopsNotebooks">
												<td class="w-24 flex gap-1 justify-center">
													<div
														class="w-8"
														v-if="deskNotePrTrocar !== deskNote.id">
														<BotaoPadrao
															@clique="deskNotePrTrocar = deskNote.id"
															icone
															class="shadow !p-0"
															cor="!bg-blue-200 hover:!bg-blue-300">
															<img
																src="@/assets/icons/rotate-b.svg"
																alt=""
																class="w-6 h-6" />
														</BotaoPadrao>
													</div>
													<div
														class="w-8"
														v-if="deskNotePrTrocar === deskNote.id">
														<BotaoPadrao
															@clique="deskNotePrTrocar = null"
															icone
															class="shadow !p-0"
															cor="!bg-red-300 hover:!bg-red-400">
															<img
																src="@/assets/icons/close-b.svg"
																alt=""
																class="w-6 h-6" />
														</BotaoPadrao>
													</div>
													<div
														class="w-10"
														v-if="deskNotePrTrocar === deskNote.id">
														<BotaoPadrao
															icone
															@clique="trocarDeskNote(deskNote)"
															class="shadow !p-0"
															cor="!bg-green-300 hover:!bg-green-300">
															<img
																src="@/assets/icons/check-b.svg"
																alt=""
																class="w-6 h-6" />
														</BotaoPadrao>
													</div>
												</td>
												<td>{{ deskNote.patrimonio }}</td>
												<td>{{ deskNote.serial }}</td>
												<td>{{ deskNote.hostname }}</td>
												<td>{{ deskNote.MarcaTI ? deskNote.MarcaTI.nome : null }}</td>
												<td>{{ deskNote.ModeloTI ? deskNote.ModeloTI.nome : null }}</td>
												<td>{{ deskNote.tipo }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div
					class="flex gap-2 items-center"
					v-if="tab === 'geral'">
					<span
						v-if="textoErro !== null"
						class="text-red-400 text-xl">
						{{ textoErro }}
					</span>
					<BotaoPadrao
						texto="salvar"
						@clique="monitorLocal.id !== null ? editarMonitor(false) : cadastrarMonitor(false)">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="salvar e sair"
						@clique="monitorLocal.id !== null ? editarMonitor(true) : cadastrarMonitor(true)">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
				<div v-if="tab === 'funcionario'">
					<div class="flex gap-2">
						<BotaoPadrao
							:disabled="novo_funcionario_id === null"
							texto="trocar funcionário"
							@clique="
								mostrarDialogConfirmarTrocaFuncionario = true
								tipoTrocaFuncionario = 'funcionario'
							">
							<img
								src="../../../../../assets/icons/rotate-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							:disabled="monitorLocal.Funcionario === null"
							texto="para estoque"
							@clique="
								mostrarDialogConfirmarTrocaFuncionario = true
								tipoTrocaFuncionario = 'estoque'
								novo_funcionario_id = null
							">
							<img
								src="../../../../../assets/icons/box-open-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</BaseDialog>
		<DialogCadastrarMarca
			v-if="mostrarDialogCadastrarMarca"
			@cancelar="mostrarDialogCadastrarMarca = false"
			@cadastrado="marcaCadastrada()" />
		<DialogCadastrarModelo
			v-if="mostrarDialogCadastrarModelo"
			@cancelar="mostrarDialogCadastrarModelo = false"
			equipamento="monitor"
			@cadastrado="modeloCadastrado()" />
		<DialogCadastrarLocalInstalacao
			v-if="mostrarDialogCadastrarLocalInstalacao"
			@cadastrado="localInstalacaoCadastrado()"
			@cancelar="mostrarDialogCadastrarLocalInstalacao = false" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogConfirmarTrocaFuncionario
			v-if="mostrarDialogConfirmarTrocaFuncionario"
			@cancelar="mostrarDialogConfirmarTrocaFuncionario = false"
			:funcionario-origem="monitorLocal.Funcionario"
			@trocarFuncionario="trocarFuncionario()"
			@trocarEstoque="paraEstoque()"
			:funcionario-destino="funcionario"
			:tipoTroca="tipoTrocaFuncionario"
			:licencas="[]" />
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import DialogCadastrarMarca from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarMarca.vue"
	import DialogCadastrarModelo from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarModelo.vue"
	import DialogCadastrarLocalInstalacao from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarLocalInstalacao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import DialogConfirmarTrocaFuncionario from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogConfirmarTrocaFuncionario.vue"

	export default {
		components: {
			DialogConfirmarTrocaFuncionario,
			BotaoPadrao,
			AppFormTextarea,
			AppAlerta,
			DialogCadastrarLocalInstalacao,
			DialogCadastrarModelo,
			DialogCadastrarMarca,
			AppFormSelectCompleto,
			AppFormInput,
			AppTabs,
			BaseDialog,
		},
		props: {
			monitor: {
				type: Object,
				default: null,
			},
		},
		data() {
			return {
				tab: "geral",
				carregando: false,
				erros: [],
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDialogCadastrarMarca: false,
				mostrarDialogCadastrarModelo: false,
				mostrarDialogCadastrarLocalInstalacao: false,
				mostrarDialogConfirmarTrocaFuncionario: false,
				monitorLocal: {
					patrimonio: null,
					serial: null,
					marcati_id: null,
					modeloti_id: null,
					localinstalacaoti_id: null,
					observacao: null,
					id: null,
				},
				marcas: [],
				modelos: [],
				locaisInstalacao: [],
				funcionariosOriginal: [],
				funcionarios: [],
				textoErro: null,

				tabLicenca: [],
				tabsLicenca: [
					{ nome: "Vinculadas", valor: "vinculadas" },
					{ nome: "Não vinculadas", valor: "naoVinculadas" },
				],
				novo_funcionario_id: null,
				funcionario: {
					chapa: null,
					cargo: null,
					setor: { nome: null },
				},
				tipoTrocaFuncionario: null,
				camposObrigatorio: ["serial", "marcati_id", "modeloti_id"],
				buscaDeskNote: null,
				desktopsNotebooks: [],
				deskNotePrTrocar: null,
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "Inf. Geral", valor: "geral" },
					{ nome: "Funcionário", valor: "funcionario", disabled: this.monitorLocal.id === null },
					{
						nome: "Desktop/Notebook",
						valor: "desktopNotebook",
						disabled: this.monitorLocal.id === null,
					},
				]
			},
			bloquearBuscarDeskNote() {
				let busca = this.buscaDeskNote ? this.buscaDeskNote.trim() : this.buscaDeskNote

				return busca === null || busca === ""
			},
		},
		async mounted() {
			this.carregando = true

			await this.buscarMarcas()
			await this.buscarModelos()
			await this.buscarLocalInstalacao()

			if (this.monitor !== null) {
				await this.buscarFuncionarios()
				await this.buscarMonitor()
			}

			this.carregando = false
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async deletarMonitor() {},

			async buscarDeskNote() {
				let busca = this.buscaDeskNote

				let resp = await this.$axios.$get("/ti/desktopnNotebook/buscarDeskNote", {
					params: { busca },
				})

				if (!resp.falha) {
					this.desktopsNotebooks = resp.dados.maquinas
				}
			},
			async trocarDeskNote(deskNote) {
				let { id: desktopnotebookti_id } = deskNote
				let { id } = this.monitorLocal

				let resp = await this.$axios.$put("/ti/monitor/trocarDeskNote", {
					desktopnotebookti_id,
					id,
				})

				if (!resp.falha) {
					this.monitorLocal.DesktopNotebookTI = deskNote
					this.textoAlerta = `${deskNote.tipo} vinculado com sucesso!`
					this.mostrarAlerta = true
					this.deskNotePrTrocar = null
					this.desktopsNotebooks = []
					this.buscaDeskNote = null
				}
			},

			//MARCAS
			async buscarMarcas() {
				let marcas = this.$store.state.ti.marcaTI.marcas
				if (marcas.length === 0) {
					marcas = await this.$axios.$get("/ti/marca/buscarTodos").then((resp) => resp.dados.marcas)

					this.$store.commit("ti/marcaTI/DEFINIR_MARCAS_TI", {
						marcas,
					})
				}

				this.marcas = marcas.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async marcaCadastrada() {
				this.mostrarDialogCadastrarMarca = false
				await this.buscarMarcas()
				this.textoAlerta = "Marca cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarMarca(event) {
				let { id } = event
				await this.$axios.$delete("/ti/marca/deletar", { params: { id } })

				this.$store.commit("ti/marcaTI/DELETAR_MARCA_TI", { id })

				let idx = this.marcas.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.marcas.splice(idx, 1)
				}

				this.textoAlerta = "Marca deletada com sucesso!"
				this.mostrarAlerta = true
			},

			//MODELO
			async buscarModelos() {
				let modelos = this.$store.state.ti.modeloTI.modelosTI
				if (modelos.length === 0) {
					modelos = await this.$axios
						.$get("/ti/modelo/buscarTodos")
						.then((resp) => resp.dados.modelos)

					this.$store.commit("ti/modeloTI/DEFINIR_MODELOS_TI", {
						modelos,
					})
				}

				this.modelos = modelos
					.filter((o) => o.equipamento === "monitor")
					.map((o) => {
						return { id: o.id, nome: o.nome }
					})
			},
			async modeloCadastrado() {
				this.mostrarDialogCadastrarModelo = false
				await this.buscarModelos()
				this.textoAlerta = "Modelo cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarModelo(event) {
				let { id } = event
				await this.$axios.$delete("/ti/modelo/deletar", { params: { id } })

				this.$store.commit("ti/modeloTI/DELETAR_MODELO_TI", { id })

				let idx = this.modelos.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.modelos.splice(idx, 1)
				}

				this.textoAlerta = "Modelo deletada com sucesso!"
				this.mostrarAlerta = true
			},

			//LOCAL DE INSTALAÇÃO
			async buscarLocalInstalacao() {
				let locaisInstalacao = this.$store.state.ti.localInstalacaoTI.locaisInstalacao
				if (locaisInstalacao.length === 0) {
					locaisInstalacao = await this.$axios
						.$get("/ti/localInstalacao/buscarTodos")
						.then((resp) => resp.dados.locais)

					this.$store.commit("ti/localInstalacaoTI/DEFINIR_LOCALINSTALACAO_TI", {
						locaisInstalacao,
					})
				}

				this.locaisInstalacao = locaisInstalacao.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async localInstalacaoCadastrado() {
				this.mostrarDialogCadastrarLocalInstalacao = false
				await this.buscarLocalInstalacao()
				this.textoAlerta = "Local de instalação cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarLocalInstalacao(event) {
				let { id } = event

				await this.$axios.$delete("/ti/localInstalacao/deletar", { params: { id } })

				this.$store.commit("ti/localInstalacaoTI/DELETAR_LOCALINSTALACAO_TI", { id })

				let idx = this.locaisInstalacao.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.locaisInstalacao.splice(idx, 1)
				}

				this.textoAlerta = "Local de instalação deletado com sucesso!"
				this.mostrarAlerta = true
			},

			//FUNCIONARIOS
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar/nomes")

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					this.funcionarios = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
					this.funcionariosOriginal = funcionarios
				}
			},
			async buscarFuncionario() {
				let id = this.funcionario.id
				let resp = await this.$axios.$get("/ti/efetivo/buscarFuncionario", { params: { id } })

				if (!resp.falha) {
					let { funcionario } = resp.dados

					this.funcionario = Object.assign(this.funcionario, funcionario)
					if (this.funcionario.setor === null) {
						this.funcionario.setor = { nome: null }
					}
				}
			},
			async trocarFuncionario() {
				this.mostrarDialogConfirmarTrocaFuncionario = false
				let { id } = this.monitorLocal
				let funcionario_id = this.novo_funcionario_id

				let resp = await this.$axios.$put("/ti/monitor/trocarFuncionario", {
					id,
					funcionario_id,
				})
				if (!resp.falha) {
					this.textoAlerta = "Funcionário trocado com sucesso!"
					this.mostrarAlerta = true
					let { data_entrega } = resp.dados

					this.monitorLocal.Funcionario = Object.assign({}, this.funcionario)
					this.monitorLocal.data_entrega = data_entrega
					this.funcionario = {
						chapa: null,
						cargo: null,
						setor: { nome: null },
					}
					this.novo_funcionario_id = null
				}
			},
			async paraEstoque() {
				this.mostrarDialogConfirmarTrocaFuncionario = false
				let { id } = this.monitorLocal

				let resp = await this.$axios.$put("/ti/monitor/trocarFuncionario", {
					id,
					funcionario_id: null,
				})

				if (!resp.falha) {
					this.textoAlerta = "Retornado para o estoque com sucesso!"
					this.mostrarAlerta = true

					this.monitorLocal.Funcionario = null
					this.funcionario = {
						chapa: null,
						cargo: null,
						setor: { nome: null },
					}
					this.novo_funcionario_id = null
				}
			},

			// MONITOR
			async cadastrarMonitor(sair) {
				this.textoErro = null
				this.erros = validarFormulario(this.camposObrigatorio, this.monitorLocal)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let { patrimonio, serial } = this.monitorLocal

					let resp = await this.$axios.$post("/ti/monitor/cadastrar", {
						...this.monitorLocal,
						usuario_id,
					})
					if (!resp.falha) {
						let { criado, monitor } = resp.dados

						if (!criado) {
							let campoErro = ""

							if (monitor.patrimonio === patrimonio) {
								campoErro = "patrimônio"
								this.erros.push("patrimonio")
							}

							if (monitor.serial === serial) {
								campoErro = "serial"
								this.erros.push("serial")
							}

							this.textoErro = `Já existe um monitor com esse ${campoErro}`
						} else {
							if (sair) {
								this.$emit("cadastrado", { monitor, sair })
							} else {
								this.monitorLocal.id = monitor.id
								this.monitorLocal.Funcionario = null
								this.textoAlerta = `Monitor cadastrado com sucesso!`
								this.mostrarAlerta = true
								this.$emit("cadastrado", { monitor, sair })

								await this.buscarFuncionarios()
							}
						}
					}
				}
			},

			async editarMonitor(sair) {
				this.erros = validarFormulario(this.camposObrigatorio, this.monitorLocal)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let { patrimonio, serial } = this.monitorLocal

					let resp = await this.$axios.$put("/ti/monitor/editar", {
						...this.monitorLocal,
						usuario_id,
					})
					if (!resp.falha) {
						let { editado, monitor } = resp.dados

						if (!editado) {
							let campoErro = ""

							if (monitor.patrimonio === patrimonio) {
								campoErro = "patrimônio"
								this.erros.push("patrimonio")
							}

							if (monitor.serial === serial) {
								campoErro = "serial"
								this.erros.push("serial")
							}

							this.textoErro = `Já existe um monitor com esse ${campoErro}`
						} else {
							if (!sair) {
								this.textoAlerta = `Monitor editado com sucesso!`
								this.mostrarAlerta = true
							}

							this.$emit("editado", { monitor, sair })
						}
					}
				}
			},

			async buscarMonitor() {
				let id = this.monitor.id

				let resp = await this.$axios.$get("/ti/monitor/buscar", { params: { id } })

				if (!resp.falha) {
					let monitor = resp.dados.monitor
					this.monitorLocal = Object.assign(this.monitorLocal, monitor)
				}
			},
		},
		watch: {
			novo_funcionario_id(valor) {
				if (valor !== null) {
					this.funcionario.id = valor
					this.buscarFuncionario()
				} else {
					this.funcionario = {
						chapa: null,
						cargo: null,
						setor: { nome: null },
					}
				}
			},
		},
	}
</script>

<style scoped>
	.tabela-desknote th,
	.tabela-desknote td {
		border: 1px solid #b3b3bc;
		white-space: nowrap;
		padding-left: 0.5rem /* 8px */;
		padding-right: 0.5rem /* 8px */;
	}
</style>
