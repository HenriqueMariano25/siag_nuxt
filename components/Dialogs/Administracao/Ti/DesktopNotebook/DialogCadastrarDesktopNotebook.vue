<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			class="uppercase"
			:titulo="maquina === null ? `Cadastrar ${tipoCadastro}` : `Editar ${tipoCadastro}`"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.geral`]="{ item }">
						<div class="flex flex-col w-full px-2">
							<div class="grid grid-cols-3 gap-x-2 gap-y-2.5">
                <AppFormSelect
                  class="grow"
                  label="Situação"
                  obrigatorio
                  :options="situacoesTI"
                  v-model="desktopnotebook.situacaoti_id"
                  :invalido="erros.includes('situacaoti_id')"
                  id="situacao" />
								<AppFormInput
									label="Patrimônio"
									placeholder="Ex: 003580"
									type="text"
									uppercase
									v-model="desktopnotebook.patrimonio"
									id="patrimonio"
									:invalido="erros.includes('patrimonio')" />
								<AppFormInput
									label="Serial"
									obrigatorio
									placeholder="Ex: 6YPJYR2"
									type="text"
									uppercase
									v-model="desktopnotebook.serial"
									id="serial"
									:invalido="erros.includes('serial')" />
								<AppFormInput
									label="HostName"
									uppercase
									v-model="desktopnotebook.hostname"
									placeholder="Ex: GNA2-WKS001"
									type="text"
									id="hostname" />
								<AppFormSelectCompleto
									style="z-index: 103 !important"
									class="grow"
									id="marca"
									:invalido="erros.includes('marcati_id')"
									v-model="desktopnotebook.marcati_id"
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
									v-model="desktopnotebook.modeloti_id"
									btn-cadastrar
									label="Modelo"
									@cadastrar="mostrarDialogCadastrarModelo = true"
									tooltip-add="Cadastrar modelo"
									:options="modelos"
									@deletar="deletarModelo" />
								<AppFormSelectCompleto
									style="z-index: 102 !important"
									v-model="desktopnotebook.processadordesknoteti_id"
									@deletar="deletarProcessador"
									class="grow"
									obrigatorio
									id="processador"
									:invalido="erros.includes('processadordesknoteti_id')"
									btn-cadastrar
									label="Processador"
									@cadastrar="mostrarDialogCadastrarProcessador = true"
									tooltip-add="Cadastrar processador"
									:options="processadores" />
								<AppFormSelectCompleto
									style="z-index: 102 !important"
									class="grow"
									id="memoria_ram"
									obrigatorio
									:invalido="erros.includes('ramdesknoteti_id')"
									v-model="desktopnotebook.ramdesknoteti_id"
									@deletar="deletarRam"
									btn-cadastrar
									label="Memória Ram"
									@cadastrar="mostrarDialogCadastrarMemoriaRam = true"
									tooltip-add="Cadastrar memória ram"
									:options="rams" />
								<AppFormSelectCompleto
									style="z-index: 101 !important"
									class="grow"
									@deletar="deletarDisco"
									id="disco"
									obrigatorio
									:invalido="erros.includes('hddesknoteti_id')"
									v-model="desktopnotebook.hddesknoteti_id"
									btn-cadastrar
									label="Disco"
									@cadastrar="mostrarDialogCadastrarDisco = true"
									tooltip-add="Cadastrar disco"
									:options="discos" />
								<AppFormSelectCompleto
									style="z-index: 101 !important"
									class="grow"
									@deletar="deletarSistemasOperacional"
									id="sistema_operacional"
									v-model="desktopnotebook.sistemaopedesknoteti_id"
									btn-cadastrar
									label="Sistema Operacional"
									@cadastrar="mostrarDialogCadastrarSistemaOpe = true"
									tooltip-add="Cadastrar local de instalação"
									:options="sistemasOperacional" />
								<AppFormSelectCompleto
									v-if="tipoCadastro === 'desktop'"
									style="z-index: 101 !important"
									class="grow"
									id="local_instalacao"
									v-model="desktopnotebook.localinstalacaoti_id"
									btn-cadastrar
									@deletar="deletarLocalInstalacao"
									label="Local de Instalação"
									obrigatorio
									:invalido="erros.includes('localinstalacaoti_id')"
									@cadastrar="mostrarDialogCadastrarLocalInstalacao = true"
									tooltip-add="Cadastrar local de instalação"
									:options="locaisInstalacao" />
								<AppFormInput
									label="Tela"
									uppercase
									v-if="tipoCadastro === 'notebook'"
									v-model="desktopnotebook.tela"
									placeholder="Ex: 17,3"
									type="text"
									id="tela" />
								<AppFormInput
									label="Lote"
									uppercase
									v-model="desktopnotebook.lote"
									placeholder="Ex: 15"
									type="text"
									id="lote" />
								<AppFormInput
									label="Data da compra"
									type="date"
									v-model="desktopnotebook.data_compra"
									id="data_compra" />
								<AppFormSelectCompleto
									style="z-index: 100 !important"
									class="grow"
									v-model="desktopnotebook.procedenciati_id"
									id="procedencia"
									btn-cadastrar
									@deletar="deletarProcedencia"
									label="Procedência"
									@cadastrar="mostrarDialogCadastrarProcedencia = true"
									tooltip-add="Cadastrar procedência"
									:options="procedencias" />
								<AppFormInput
									label="Última verificação T.I"
									type="date"
									obrigatorio
									:invalido="erros.includes('ultima_verificacao')"
									id="ultima_verificacao"
									v-model="desktopnotebook.ultima_verificacao" />
								<AppFormInput
									label="Data da formatação"
									type="date"
									obrigatorio
									:invalido="erros.includes('data_formatacao')"
									v-model="desktopnotebook.data_formatacao"
									id="data_formatacao" />
								<AppFormTextarea
									id="observacao"
									:total-caracteres="1000"
									label="Observação"
									v-model="desktopnotebook.observacao"
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
								<div v-if="desktopnotebook.Funcionario === null">
									<div class="bg-green-700 m-2 text-center text-xl text-white py-1 font-bold">
										<span>EM ESTOQUE</span>
									</div>
									<span
										v-if="desktopnotebook.data_entrega"
										class="px-2">
										<strong>DATA DE ENTREGA:</strong>
										{{ $dayjs(desktopnotebook.data_entrega).format("DD/MM/YYYY HH:mm:ss") }}
									</span>
								</div>
								<div
									class="grid grid-cols-2 px-2 mt-1"
									v-if="desktopnotebook.Funcionario !== null">
									<span><strong>Nome: </strong>{{ desktopnotebook.Funcionario.nome }}</span>
									<span><strong>Matrícula: </strong>{{ desktopnotebook.Funcionario.chapa }}</span>
									<span><strong>Cargo: </strong>{{ desktopnotebook.Funcionario.cargo }}</span>
									<span
										><strong>Setor: </strong
										>{{
											desktopnotebook.Funcionario.setor
												? desktopnotebook.Funcionario.setor.nome
												: ""
										}}</span
									>
									<span>
										<strong>Data de entrega: </strong>
										{{ $dayjs(desktopnotebook.data_entrega).format("DD/MM/YYYY HH:mm:ss") }}
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
					<template v-slot:[`tab.licenca`]="{ item }">
						<AppTabs
							class="mt-1"
							:tabs="tabsLicenca"
							@tab="tabLicenca = $event">
							<template v-slot:[`tab.vinculadas`]="{ item }">
								<div class="flex flex-col gap-2">
									<div class="flex w-full justify-between px-2">
										<AppFormInput
											label="Filtrar"
											type="text"
											id="licenca"
											placeholder="Ex: Filtrar licença" />
									</div>
									<div class="px-2 flex gap-1.5 flex-col">
										<div
											class="w-full flex bg-gray-200 shadow justify-between items-center border border-gray-300 px-2 py-1"
											v-for="licenca of licencasVinculada">
											<div class="grow flex flex-col">
												<span class="text-xl">
													<strong>{{ licenca.nome }}</strong>
													{{ licenca.valor ? ` - ${licenca.valor}` : "" }}
												</span>
												<span class="text-xs ml-2">
													Tipo de licença:
													<strong>{{
														licenca.tipo_licenca === "desknote"
															? "desktop/notebook"
															: licenca.tipo_licenca
													}}</strong>
												</span>
											</div>
											<button
												class="bg-red-500 rounded-xl hover:bg-red-600"
												@click="removerLicenca(licenca)">
												<img
													src="../../../../../assets/icons/minus-b.svg"
													alt=""
													class="w-9 h-9" />
											</button>
										</div>
									</div>
								</div>
							</template>
							<template v-slot:[`tab.naoVinculadas`]="{ item }">
								<div class="flex flex-col gap-2">
									<div class="flex w-full justify-between px-2">
										<AppFormInput
											label="Filtrar"
											type="text"
											id="licenca"
											placeholder="Ex: Filtrar licença" />
										<div class="flex items-end">
											<BotaoPadrao
												texto="criar licença"
												cor="bg-blue-400 hover:!bg-blue-500"
												@clique="mostrarDialogCadastrarLicenca = true">
												<img
													src="../../../../../assets/icons/add-b.svg"
													alt=""
													class="w-7 h-7" />
											</BotaoPadrao>
										</div>
									</div>
									<div class="px-2 w-full flex flex-col gap-1.5">
										<div
											class="w-full flex bg-gray-200 shadow justify-between items-center border border-gray-300 px-2 py-1"
											v-for="licenca of licencasNaoViculadas">
											<div class="grow flex flex-col">
												<span class="text-xl"
													><strong>{{ licenca.nome }}</strong
													>{{ licenca.valor ? ` - ${licenca.valor}` : "" }}</span
												>
												<span class="text-xs ml-2"
													>Tipo de licença:
													<strong>{{
														licenca.tipo_licenca === "desknote"
															? "desktop/notebook"
															: licenca.tipo_licenca
													}}</strong></span
												>
											</div>
											<button
												class="bg-green-600 rounded-xl hover:bg-green-800"
												@click="adicionarLicenca(licenca)">
												<img
													src="../../../../../assets/icons/add-w.svg"
													alt=""
													class="w-9 h-9" />
											</button>
										</div>
									</div>
								</div>
							</template>
						</AppTabs>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div
					class="flex gap-2 items-center"
					v-if="tab === 'geral'">
					<span
						v-if="textoErro !== null"
						class="text-red-400 text-xl"
						>{{ textoErro }}</span
					>
					<BotaoPadrao
						texto="salvar"
						@clique="
							desktopnotebook.id !== null
								? editarDesktopNotebook(false)
								: cadastrarDesktopNotebook(false)
						">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="salvar e sair"
						@clique="
							desktopnotebook.id !== null
								? editarDesktopNotebook(true)
								: cadastrarDesktopNotebook(true)
						">
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
							:disabled="desktopnotebook.Funcionario === null"
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
				<div v-if="tab === 'licenca'">
					<BotaoPadrao
						@clique="salvarLicencas"
						texto="salvar licenças">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
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
			:equipamento="tipoCadastro"
			@cadastrado="modeloCadastrado()" />
		<DialogCadastrarProcessador
			v-if="mostrarDialogCadastrarProcessador"
			@cancelar="mostrarDialogCadastrarProcessador = false"
			@cadastrado="processadorCadastrado()" />
		<DialogCadastrarMemoriaRam
			v-if="mostrarDialogCadastrarMemoriaRam"
			@cadastrado="ramCadastrada()"
			@cancelar="mostrarDialogCadastrarMemoriaRam = false" />
		<DialogCadastrarDisco
			v-if="mostrarDialogCadastrarDisco"
			@cancelar="mostrarDialogCadastrarDisco = false"
			@cadastrado="discoCadastrado()" />
		<DialogCadastrarLocalInstalacao
			v-if="mostrarDialogCadastrarLocalInstalacao"
			@cadastrado="localInstalacaoCadastrado()"
			@cancelar="mostrarDialogCadastrarLocalInstalacao = false" />
		<DialogCadastrarProcedencia
			v-if="mostrarDialogCadastrarProcedencia"
			@cancelar="mostrarDialogCadastrarProcedencia = false"
			@cadastrado="procedenciaCadastrado()" />
		<DialogCadastrarSistemaOpe
			v-if="mostrarDialogCadastrarSistemaOpe"
			@cancelar="mostrarDialogCadastrarSistemaOpe = false"
			@cadastrado="sistemasOperacionalCadastrado()" />
		<DialogCadastrarLicenca
			v-if="mostrarDialogCadastrarLicenca"
			@cancelar="mostrarDialogCadastrarLicenca = false"
			@cadastrado="licencaCadastrada" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogConfirmarTrocaFuncionario
			v-if="mostrarDialogConfirmarTrocaFuncionario"
			@cancelar="mostrarDialogConfirmarTrocaFuncionario = false"
			:funcionario-origem="desktopnotebook.Funcionario"
			@trocarFuncionario="trocarFuncionario()"
			@trocarEstoque="paraEstoque()"
			:funcionario-destino="funcionario"
			:tipoTroca="tipoTrocaFuncionario"
			:licencas="licencasVinculada" />
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import DialogCadastrarMarca from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarMarca.vue"
	import DialogCadastrarModelo from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarModelo.vue"
	import DialogCadastrarProcessador from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarProcessador.vue"
	import DialogCadastrarMemoriaRam from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarMemoriaRam.vue"
	import DialogCadastrarDisco from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarDisco.vue"
	import DialogCadastrarLocalInstalacao from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarLocalInstalacao.vue"
	import DialogCadastrarProcedencia from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarProcedencia.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCadastrarSistemaOpe from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarSistemaOpe.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCadastrarLicenca from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarLicenca.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import DialogConfirmarTrocaFuncionario from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogConfirmarTrocaFuncionario.vue"
  import AppFormSelect from "~/components/Ui/AppFormSelect.vue";

	export default {
		components: {
      AppFormSelect,
			DialogConfirmarTrocaFuncionario,
			DialogCadastrarLicenca,
			BotaoPadrao,
			AppFormTextarea,
			DialogCadastrarSistemaOpe,
			AppAlerta,
			DialogCadastrarProcedencia,
			DialogCadastrarLocalInstalacao,
			DialogCadastrarDisco,
			DialogCadastrarMemoriaRam,
			DialogCadastrarProcessador,
			DialogCadastrarModelo,
			DialogCadastrarMarca,
			AppFormSelectCompleto,
			AppFormInput,
			AppTabs,
			BaseDialog,
		},
		props: {
			maquina: {
				type: Object,
				default: null,
			},
			tipoCadastro: {
				type: String,
			},
		},
		data() {
			return {
				tab: "geral",
				carregando: false,
				maquinaLocal: {},
				erros: [],
				mostrarAlerta: false,
				textoAlerta: null,
				mostrarDialogCadastrarMarca: false,
				mostrarDialogCadastrarModelo: false,
				mostrarDialogCadastrarProcessador: false,
				mostrarDialogCadastrarMemoriaRam: false,
				mostrarDialogCadastrarDisco: false,
				mostrarDialogCadastrarLocalInstalacao: false,
				mostrarDialogCadastrarProcedencia: false,
				mostrarDialogCadastrarSistemaOpe: false,
				mostrarDialogCadastrarLicenca: false,
				mostrarDialogConfirmarTrocaFuncionario: false,
				desktopnotebook: {
					patrimonio: null,
					serial: null,
					hostname: null,
					marcati_id: null,
					modeloti_id: null,
					processadordesknoteti_id: null,
					ramdesknoteti_id: null,
					hddesknoteti_id: null,
					sistemaopedesknoteti_id: null,
					localinstalacaoti_id: null,
					lote: null,
					data_compra: null,
					procedenciati_id: null,
					ultima_verificacao: null,
					data_formatacao: null,
					observacao: null,
					id: null,
					tela: null,
          situacaoti_id: 3
				},
				marcas: [],
				modelos: [],
				processadores: [],
				rams: [],
				discos: [],
				sistemasOperacional: [],
				locaisInstalacao: [],
				procedencias: [],
				licencas: [],
				funcionariosOriginal: [],
				funcionarios: [],
				textoErro: null,

				tabLicenca: [],
				tabsLicenca: [
					{ nome: "Vinculadas", valor: "vinculadas" },
					{ nome: "Não vinculadas", valor: "naoVinculadas" },
				],
				licencasVinculada: [],
				licencasNaoViculadas: [],
				novo_funcionario_id: null,
				funcionario: {
					chapa: null,
					cargo: null,
					setor: { nome: null },
				},
				tipoTrocaFuncionario: null,
        situacoesTI: []
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "Inf. Geral", valor: "geral" },
					{ nome: "Funcionário", valor: "funcionario", disabled: this.desktopnotebook.id === null },
					{ nome: "Licença", valor: "licenca", disabled: this.desktopnotebook.id === null },
				]
			},
			camposObrigatorio() {
				let campos = [
					"serial",
					"marcati_id",
					"modeloti_id",
					"processadordesknoteti_id",
					"ramdesknoteti_id",
					"hddesknoteti_id",
					"situacaoti_id",
					"ultima_verificacao",
					"data_formatacao",
				]

				if (this.tipoCadastro === "desktop") campos.push("localinstalacaoti_id")

				return campos
			},
		},
		async mounted() {
			this.carregando = true

			await this.buscarMarcas()
			await this.buscarModelos()
			await this.buscarProcessadores()
			await this.buscarRams()
			await this.buscarDiscos()
			await this.buscarSistemasOperacional()
			await this.buscarLocalInstalacao()
			await this.buscarProcedencias()
      await this.buscarSituacaoTI()

			if (this.maquina !== null) {
				await this.buscarLicencas()
				await this.buscarDesktopNotebook()
				await this.buscarFuncionarios()
			}

			this.carregando = false
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

      //SITUACAO TI
      async buscarSituacaoTI(){
        let situacoes = this.$store.state.ti.situacaoTI.situacoes

        if(situacoes.length === 0){
          situacoes = await this.$axios.$get("/ti/situacaoTI/buscarTodos").then(resp => resp.dados.situacoes)

          this.$store.commit("ti/situacaoTI/DEFINIR_SITUACOES_TI", { situacoes })
        }


        this.situacoesTI = situacoes.map((o) => {
          return { id: o.id, nome: o.descricao }
        })
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
					.filter((o) => o.equipamento === this.tipoCadastro)
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

				this.$store.commit("ti/modeloTI/DELETAR_TI", { id })

				let idx = this.modelos.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.modelos.splice(idx, 1)
				}

				this.textoAlerta = "Modelo deletada com sucesso!"
				this.mostrarAlerta = true
			},

			//PROCESSADOR
			async buscarProcessadores() {
				let processadores = this.$store.state.ti.processadorDeskNoteTI.processadoresDeskNote
				if (processadores.length === 0) {
					processadores = await this.$axios
						.$get("/ti/processadorDeskNote/buscarTodos")
						.then((resp) => resp.dados.processadores)

					this.$store.commit("ti/processadorDeskNoteTI/DEFINIR_PROCESSADORES_DESKNOTE_TI", {
						processadores,
					})
				}

				this.processadores = processadores.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async processadorCadastrado() {
				this.mostrarDialogCadastrarProcessador = false
				await this.buscarProcessadores()
				this.textoAlerta = "Processador cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarProcessador(event) {
				let { id } = event
				await this.$axios.$delete("/ti/processadorDeskNote/deletar", { params: { id } })

				this.$store.commit("ti/processadorDeskNoteTI/DELETAR_PROCESSADOR_DESKNOTE_TI", { id })

				let idx = this.processadores.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.processadores.splice(idx, 1)
				}

				this.textoAlerta = "Processador deletado com sucesso!"
				this.mostrarAlerta = true
			},

			//RAM
			async buscarRams() {
				let rams = this.$store.state.ti.ramDeskNoteTI.ramsDeskNote
				if (rams.length === 0) {
					rams = await this.$axios
						.$get("/ti/ramDeskNote/buscarTodos")
						.then((resp) => resp.dados.rams)

					this.$store.commit("ti/ramDeskNoteTI/DEFINIR_RAMS_DESKNOTE_TI", {
						rams,
					})
				}

				this.rams = rams.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async ramCadastrada() {
				this.mostrarDialogCadastrarMemoriaRam = false
				await this.buscarRams()
				this.textoAlerta = "Memória Ram cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarRam(event) {
				let { id } = event

				await this.$axios.$delete("/ti/ramDeskNote/deletar", { params: { id } })

				this.$store.commit("ti/ramDeskNoteTI/DELETAR_RAM_DESKNOTE_TI", { id })

				let idx = this.rams.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.rams.splice(idx, 1)
				}

				this.textoAlerta = "Memória Ram deletado com sucesso!"
				this.mostrarAlerta = true
			},

			//DISCO
			async buscarDiscos() {
				let discos = this.$store.state.ti.discoDeskNoteTI.discosDeskNote
				if (discos.length === 0) {
					discos = await this.$axios
						.$get("/ti/hdDeskNote/buscarTodos")
						.then((resp) => resp.dados.discos)

					this.$store.commit("ti/discoDeskNoteTI/DEFINIR_DISCOS_DESKNOTE_TI", {
						discos,
					})
				}

				this.discos = discos.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async discoCadastrado() {
				this.mostrarDialogCadastrarDisco = false
				await this.buscarDiscos()
				this.textoAlerta = "Disco cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarDisco(event) {
				let { id } = event

				await this.$axios.$delete("/ti/hdDeskNote/deletar", { params: { id } })

				this.$store.commit("ti/discoDeskNoteTI/DELETAR_DISCO_DESKNOTE_TI", { id })

				let idx = this.discos.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.discos.splice(idx, 1)
				}

				this.textoAlerta = "Disco deletado com sucesso!"
				this.mostrarAlerta = true
			},

			//SISTEMA OPERACIONAL
			async buscarSistemasOperacional() {
				let sistemas = this.$store.state.ti.sistemaOpeDeskNoteTI.sistemasOpeDeskNote
				if (sistemas.length === 0) {
					sistemas = await this.$axios
						.$get("/ti/sistemaOpeDeskNote/buscarTodos")
						.then((resp) => resp.dados.sistemas)

					this.$store.commit("ti/sistemaOpeDeskNoteTI/DEFINIR_SISTEMASOPE_DESKNOTE_TI", {
						sistemas,
					})
				}

				this.sistemasOperacional = sistemas.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async sistemasOperacionalCadastrado() {
				this.mostrarDialogCadastrarSistemaOpe = false
				await this.buscarSistemasOperacional()
				this.textoAlerta = "Sistema operacional cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarSistemasOperacional(event) {
				let { id } = event

				await this.$axios.$delete("/ti/sistemaOpeDeskNote/deletar", { params: { id } })

				this.$store.commit("ti/sistemaOpeDeskNoteTI/DELETAR_SISTEMASOPE_DESKNOTE_TI", { id })

				let idx = this.sistemasOperacional.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.sistemasOperacional.splice(idx, 1)
				}

				this.textoAlerta = "Sistema operacional deletado com sucesso!"
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

			//PROCEDENCIA
			async buscarProcedencias() {
				let procedencias = this.$store.state.ti.procedenciaTI.procedencias
				if (procedencias.length === 0) {
					procedencias = await this.$axios
						.$get("/ti/procedencia/buscarTodos")
						.then((resp) => resp.dados.procedencias)

					this.$store.commit("ti/procedenciaTI/DEFINIR_PROCEDENCIAS_TI", {
						procedencias,
					})
				}

				this.procedencias = procedencias.map((o) => {
					return { id: o.id, nome: o.nome }
				})
			},
			async procedenciaCadastrado() {
				this.mostrarDialogCadastrarProcedencia = false
				await this.buscarProcedencias()
				this.textoAlerta = "Procedência cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async deletarProcedencia(event) {
				let { id } = event

				await this.$axios.$delete("/ti/procedencia/deletar", { params: { id } })

				this.$store.commit("ti/procedenciaTI/DELETAR_PROCEDENCIA_TI", { id })

				let idx = this.procedencias.findIndex((o) => o.id === id)
				if (idx >= 0) {
					this.procedencias.splice(idx, 1)
				}

				this.textoAlerta = "Procedência deletado com sucesso!"
				this.mostrarAlerta = true
			},

			//LICENCAS
			async buscarLicencas() {
				let licencas = this.$store.state.ti.licencaTI.licencas
				if (licencas.length === 0) {
					licencas = await this.$axios
						.$get("/ti/licenca/buscarTodos")
						.then((resp) => resp.dados.licencas)

					this.$store.commit("ti/licencaTI/DEFINIR_LICENCAS_TI", {
						licencas,
					})
				}

        let licencasFiltradas = licencas.filter(o => o.tipo_licenca === 'ambos' || o.tipo_licenca === 'desknote')

				this.licencas = licencasFiltradas
				this.licencasNaoViculadas = [...licencasFiltradas]
			},
			async licencaCadastrada(licenca) {
				this.mostrarDialogCadastrarLicenca = false
				this.licencasNaoViculadas.push(licenca)
				this.textoAlerta = "Licença cadastrada com sucesso!"
				this.mostrarAlerta = true
			},
			async adicionarLicenca(licenca) {
				let licencasVinculadas = this.licencasVinculada
				licencasVinculadas.push(licenca)

				this.licencasVinculada = licencasVinculadas.sort((a, b) => {
					return a.nome.localeCompare(b.nome)
				})
				let idx = this.licencasNaoViculadas.findIndex((o) => o.id === licenca.id)
				if (idx >= 0) {
					this.licencasNaoViculadas.splice(idx, 1)
				}
			},
			async removerLicenca(licenca) {
				let licencas = this.licencasNaoViculadas
				licencas.push(licenca)

				this.licencasNaoViculadas = licencas.sort((a, b) => {
					return a.nome.localeCompare(b.nome)
				})
				let idx = this.licencasVinculada.findIndex((o) => o.id === licenca.id)
				if (idx >= 0) {
					this.licencasVinculada.splice(idx, 1)
				}
			},
			async salvarLicencas() {
				let licencas = this.licencasVinculada.map((o) => o.id)
				let { id } = this.desktopnotebook
        let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$put("/ti/desktopNotebook/salvarLicenca", { licencas, id, usuario_id })

				if (!resp.falha) {
					this.textoAlerta = `Licenças salvas com sucesso!`
					this.mostrarAlerta = true
				}
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
				let { id } = this.desktopnotebook
				let funcionario_id = this.novo_funcionario_id
        let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$put("/ti/desktopNotebook/trocarFuncionario", {
					id,
					funcionario_id,
          usuario_id
				})
				if (!resp.falha) {
          let funcionario = Object.assign({}, this.funcionario)
					this.textoAlerta = "Funcionário trocado com sucesso!"
					this.mostrarAlerta = true
					let { data_entrega } = resp.dados

					this.desktopnotebook.Funcionario = Object.assign({}, this.funcionario)
					this.desktopnotebook.data_entrega = data_entrega
					this.funcionario = {
						chapa: null,
						cargo: null,
						setor: { nome: null },
					}
					this.novo_funcionario_id = null

          this.$emit("funcionarioTrocado", { id, funcionario })
				}
			},
			async paraEstoque() {
				this.mostrarDialogConfirmarTrocaFuncionario = false
				let { id } = this.desktopnotebook
        let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$put("/ti/desktopNotebook/trocarFuncionario", {
					id,
					funcionario_id: null,
          usuario_id
				})

				if (!resp.falha) {
					this.textoAlerta = "Retornado para o estoque com sucesso!"
					this.mostrarAlerta = true

					this.desktopnotebook.Funcionario = null
					this.funcionario = {
						chapa: null,
						cargo: null,
						setor: { nome: null },
					}
					this.novo_funcionario_id = null
          this.$emit("funcionarioTrocado", { id, funcionario: null })
				}
			},

			// DESKTOP E NOTEBOOK
			async cadastrarDesktopNotebook(sair) {
				this.textoErro = null
				this.erros = validarFormulario(this.camposObrigatorio, this.desktopnotebook)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let { patrimonio, serial, hostname } = this.desktopnotebook

					let resp = await this.$axios.$post("/ti/desktopNotebook/cadastrar", {
						...this.desktopnotebook,
						tipo: this.tipoCadastro,
						usuario_id,
					})
					if (!resp.falha) {
						let { criado, ativo } = resp.dados

						if (!criado) {
							let campoErro = ""

							if (ativo.patrimonio === patrimonio) {
								campoErro = "patrimônio"
								this.erros.push("patrimonio")
							}

							if (ativo.serial === serial) {
								campoErro = "serial"
								this.erros.push("serial")
							}

							if (ativo.hostname === hostname) {
								campoErro = "hostname"
								this.erros.push("hostname")
							}

							this.textoErro = `Já existe um ativo com esse ${campoErro}`
						} else {
							if (sair) {
								this.$emit("cadastrado", { desknote: ativo, sair })
							} else {
								this.desktopnotebook.id = ativo.id
								this.desktopnotebook.Funcionario = null
								this.textoAlerta = `${this.tipoCadastro} cadastrado com sucesso!`
								this.mostrarAlerta = true
								this.$emit("cadastrado", { desknote: ativo, sair })

								await this.buscarFuncionarios()
								await this.buscarLicencas()
							}
						}
					}
				}
			},

			async editarDesktopNotebook(sair) {
				this.erros = validarFormulario(this.camposObrigatorio, this.desktopnotebook)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let { patrimonio, serial, hostname } = this.desktopnotebook

					let resp = await this.$axios.$put("/ti/desktopNotebook/editar", {
						...this.desktopnotebook,
						usuario_id,
					})
					if (!resp.falha) {
						let { editado, desknote } = resp.dados

						if (!editado) {
							let campoErro = ""

							if (desknote.patrimonio === patrimonio) {
								campoErro = "patrimônio"
								this.erros.push("patrimonio")
							}

							if (desknote.serial === serial) {
								campoErro = "serial"
								this.erros.push("serial")
							}

							if (desknote.hostname === hostname) {
								campoErro = "hostname"
								this.erros.push("hostname")
							}

							this.textoErro = `Já existe um ${this.tipoCadastro} com esse ${campoErro}`
						} else {
							if (!sair) {
								this.textoAlerta = `${this.tipoCadastro.toUpperCase()} editado com sucesso!`
								this.mostrarAlerta = true
							}

              this.$emit("editado", { desknote, sair })
						}
					}
				}
			},

			async buscarDesktopNotebook() {
				let id = this.maquina.id

				let resp = await this.$axios.$get("/ti/desktopNotebook/buscarMaquina", { params: { id } })

				if (!resp.falha) {
					let maquina = resp.dados.maquina
					this.desktopnotebook = Object.assign(this.desktopnotebook, maquina)

					if (maquina.LicencaDeskNoteTI.length > 0) {
						let licencas = maquina.LicencaDeskNoteTI.map((o) => o.licencati_id)

						for (let licenca of licencas) {
							let idx = this.licencasNaoViculadas.findIndex((o) => o.id === licenca)

							if (idx >= 0) {
								this.licencasVinculada.push(this.licencasNaoViculadas[idx])
								this.licencasNaoViculadas.splice(idx, 1)
							}
						}
					}
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

<style scoped></style>
