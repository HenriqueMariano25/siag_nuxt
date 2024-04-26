<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			class="uppercase"
			:titulo="republica.id === null ? `Cadastrar república` : `Editar república`"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.republica`]>
						<div class="px-2 grid grid-cols-6 gap-2 py-1 items-center">
							<AppFormInput
								class="col-span-4"
								label="Nome"
								placeholder="Ex: Pousada Gutierrez"
								type="text"
								obrigatorio
								uppercase
								v-model="republica.nome"
								id="nome"
								:invalido="erros.includes('nome')" />
							<AppFormInput
								class="col-span-2"
								label="Valor do aluguel"
								obrigatorio
								v-money="{ precision: 2, prefix: 'R$ ', decimal: ',', thousands: '.' }"
								type="text"
								uppercase
								v-model="republica.valor_aluguel"
								id="valor_aluguel"
								:invalido="erros.includes('valor_aluguel')" />
							<AppFormSelect
								class="col-span-2"
								label="Tipo"
								obrigatorio
								:options="tiposRepublica"
								v-model="republica.tipo"
								:invalido="erros.includes('tipo')"
								id="tiposRepublica" />
							<AppFormInput
								class="col-span-2"
								label="Data de limpeza"
								type="date"
								uppercase
								v-model="republica.data_limpeza"
								id="data_limpeza" />
							<AppFormInput
								class="col-span-2"
								label="Responsável pela limpeza"
								placeholder="Ex: João"
								type="text"
								uppercase
								v-model="republica.resp_limpeza"
								id="resp_limpeza" />
							<AppFormInput
								class="col-span-4"
								label="Rua"
								placeholder="Ex: Rua Mirahi"
								type="text"
								obrigatorio
								uppercase
								v-model="republica.rua"
								id="nome"
								:invalido="erros.includes('rua')" />
							<AppFormInput
								class="col-span-1"
								label="Número"
								placeholder="Ex: N°"
								type="text"
								uppercase
								obrigatorio
								v-model="republica.numero"
								id="numero"
								:invalido="erros.includes('numero')" />
							<AppFormInput
								class="col-span-1"
								obrigatorio
								label="UF"
								placeholder="Ex: SP"
								type="text"
								uppercase
								v-model="republica.uf"
								id="uf"
								:invalido="erros.includes('uf')" />
							<AppFormInput
								class="col-span-2"
								label="CEP"
								placeholder="Ex: 28200-000"
								type="text"
								obrigatorio
								uppercase
								v-model="republica.cep"
								id="cep"
								:invalido="erros.includes('cep')" />
							<AppFormInput
								class="col-span-2"
								label="Bairro"
								obrigatorio
								placeholder="Ex: Grussai"
								type="text"
								uppercase
								v-model="republica.bairro"
								id="bairro"
								:invalido="erros.includes('bairro')" />
							<AppFormInput
								class="col-span-2"
								label="Cidade"
								placeholder="Ex: Campos dos Goytacazes"
								obrigatorio
								type="text"
								uppercase
								v-model="republica.cidade"
								id="cidade"
								:invalido="erros.includes('cidade')" />
							<AppFormTextarea
								id="detalhes"
								:total-caracteres="1000"
								label="Detalhes"
								v-model="republica.detalhes"
								linhas="2"
								uppercase
								placeholder="Detalhes"
								class="col-span-6" />
						</div>
					</template>
					<template v-slot:[`tab.quartos`]>
						<div class="px-2 py-1 flex flex-col gap-2">
							<div class="grid grid-cols-12 gap-2">
								<AppFormInput
									class="col-span-4"
									label="N° do quarto"
									placeholder="Ex: 201 A"
									type="text"
									obrigatorio
									uppercase
									v-model="quarto.numero"
									id="numero"
									:invalido="errosQuarto.includes('numero')" />
								<AppFormInput
									class="col-span-2"
									label="Vagas"
									placeholder="Ex: 2"
									type="number"
									:min="1"
									obrigatorio
									uppercase
									v-model="quarto.vagas"
									id="vagas"
									:invalido="errosQuarto.includes('vagas')" />
								<AppFormRadio
									:itens="generos"
									class="col-span-3"
									titulo="Gênero"
									linha
									obrigatorio
									v-model="quarto.genero"
									:invalido="erros.includes('genero')"
									id="genero" />
								<div class="flex justify-end items-end col-span-3">
									<BotaoPadrao
										v-if="quarto.id === null"
										@clique="adicionarQuarto()"
										texto="adicionar"
										cor="bg-green-400 hover:!bg-green-500">
										<img
											src="@/assets/icons/add-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
									<div
										v-if="quarto.id !== null"
										class="flex gap-1">
										<BotaoPadrao
											@clique="cancelarEdicao()"
											cor="bg-gray-300 hover:!bg-gray-400">
											<img
												src="@/assets/icons/close-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
										<BotaoPadrao
											@clique="deletarQuarto()"
											cor="bg-red-400 hover:!bg-red-500">
											<img
												src="@/assets/icons/delete-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
										<BotaoPadrao
											@clique="editarQuarto()"
											texto="salvar"
											cor="bg-green-400 hover:!bg-green-500">
											<img
												src="@/assets/icons/save-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
							</div>
							<TabelaPadrao
								id="republicas"
								:cabecalho="cabecalho"
								:dados="quartos"
								altura="calc(100vh - 379px)"
								:tem-rodape="false">
								<template v-slot:[`body.acoes`]="{ item }">
									<div class="w-16 flex">
										<BotaoPadrao
											icone
											@clique="quarto = Object.assign({}, item)">
											<img
												src="@/assets/icons/edit-b.svg"
												alt=""
												class="w-6 h-6" />
										</BotaoPadrao>
										<BotaoPadrao
											icone
											@clique="
												mostrarDialogFuncionarioQuarto = true
												quartoPrFuncionarios = item
											">
											<img
												src="@/assets/icons/user-b.svg"
												alt=""
												class="w-6 h-6" />
										</BotaoPadrao>
									</div>
								</template>
								<template v-slot:[`body.taxa_ocupacao`]="{ item }">
									<span>
										{{
											item.vagas && item.numquartos
												? item.numquartos / (parseFloat(item.vagas) / 100)
												: 0
										}}%
									</span>
								</template>
							</TabelaPadrao>
						</div>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div
					class="flex gap-2"
					v-if="tab === 'republica'">
					<BotaoPadrao
						texto="salvar"
						@clique="republica.id ? editarRepublica(false) : cadastrarRepublica(false)">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="salvar e sair"
						@clique="republica.id ? editarRepublica(true) : cadastrarRepublica(true)">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
		<DialogFuncionarioQuarto
			v-if="mostrarDialogFuncionarioQuarto"
			@cancelar="mostrarDialogFuncionarioQuarto = false"
			@funcionarioEditado="funcionarioEditado"
			:quarto="quartoPrFuncionarios" />
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogFuncionarioQuarto from "~/components/Dialogs/Administracao/ServicoGerais/Republicas/DialogFuncionarioQuarto.vue"

	export default {
		components: {
			DialogFuncionarioQuarto,
			TabelaPadrao,
			AppFormRadio,
			BotaoPadrao,
			AppFormTextarea,
			AppFormSelect,
			AppFormInput,
			BaseDialog,
			AppTabs,
		},
		props: {
			republica_id: {
				type: Number,
				default: null,
			},
		},
		data() {
			return {
				carregando: false,
				tab: "republica",
				republica: {
					nome: null,
					valor_aluguel: null,
					tipo: null,
					data_limpeza: null,
					resp_limpeza: null,
					rua: null,
					numero: null,
					uf: null,
					cep: null,
					bairro: null,
					cidade: null,
					detalhes: null,
					id: null,
				},
				erros: [],
				tiposRepublica: [
					{ id: "Casa", nome: "Casa" },
					{ id: "Apartamento", nome: "Apartamento" },
					{ id: "Sala comercial", nome: "Sala comercial" },
				],
				camposObrigatorio: [
					"nome",
					"valor_aluguel",
					"tipo",
					"rua",
					"numero",
					"uf",
					"cep",
					"bairro",
					"cidade",
				],
				camposObrigatorioQuarto: ["numero", "vagas", "genero"],
				quarto: {
					numero: null,
					vagas: null,
					genero: null,
					id: null,
				},
				quartos: [],
				errosQuarto: [],
				generos: [
					{ label: "Masculino", valor: "Masculino" },
					{ label: "Feminino", valor: "Feminino" },
				],
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "N° do quarto", valor: "numero" },
					{ nome: "Vagas", valor: "vagas", largura: "w-[100px]", centralizar: true },
					{ nome: "Gênero", valor: "genero" },
					{ nome: "Ocupação", valor: "taxa_ocupacao", largura: "w-[100px]", centralizar: true },
					{ nome: "Funcionários", valor: "numquartos", centralizar: true, largura: "w-[100px]" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
				mostrarDialogFuncionarioQuarto: false,
				quartoPrFuncionarios: null,
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "República", valor: "republica" },
					{ nome: "Quartos", valor: "quartos", disabled: this.republica_id === null },
				]
			},
		},
		mounted() {
			if (this.republica_id) {
				this.buscarRepublica()
				this.buscarQuartos()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarRepublica() {
				let resp = await this.$axios.$get(`/servicos_gerais/republica/${this.republica_id}`)

				if (!resp.falha) {
					this.republica = resp.dados.republica
				}
			},
			async buscarQuartos() {
				let resp = await this.$axios.$get(`/servicos_gerais/republica/quartos/${this.republica_id}`)

				if (!resp.falha) {
					this.quartos = resp.dados.quartos
				}
			},
			async cadastrarRepublica(sair) {
				this.erros = validarFormulario(this.camposObrigatorio, this.republica)

				if (this.erros.length === 0) {
					let republica = this.republica

					let resp = await this.$axios.$post("/servicos_gerais/republica", { republica })
					this.republica.id = republica.id

					if (!resp.falha) {
						let { republica } = resp

						this.$emit("cadastrado", { republica, sair })
					}
				}
			},
			async editarRepublica(sair) {
				this.erros = validarFormulario(this.camposObrigatorio, this.republica)

				if (this.erros.length === 0) {
					let republica = this.republica

					let resp = await this.$axios.$put("/servicos_gerais/republica", { republica })
					if (!resp.falha) {
						this.$emit("editado", { republica, sair })
					}
				}
			},
			async cancelarEdicao() {
				this.quarto = {
					numero: null,
					vagas: null,
					genero: null,
					id: null,
				}
			},
			async adicionarQuarto() {
				this.errosQuarto = validarFormulario(this.camposObrigatorioQuarto, this.quarto)

				if (this.errosQuarto.length === 0) {
					let quarto = this.quarto

					let resp = await this.$axios.$post("/servicos_gerais/republica/quarto", {
						quarto,
						republica_id: this.republica_id,
					})

					if (!resp.falha) {
						let quartoCadastrado = resp.dados.quarto
						quartoCadastrado.numquartos = 0
						this.quarto = {
							numero: null,
							vagas: null,
							genero: null,
							id: null,
						}
						this.quartos.unshift(resp.dados.quarto)
					}
				}
			},
			async editarQuarto() {
				this.errosQuarto = validarFormulario(this.camposObrigatorioQuarto, this.quarto)

				if (this.errosQuarto.length === 0) {
					let { numero, vagas, id, genero } = this.quarto

					let resp = await this.$axios.$put("/servicos_gerais/republica/quarto", {
						quarto: { numero, vagas, genero },
						id,
					})

					if (!resp.falha) {
						let { numero, vagas, id, genero } = resp.dados.quarto

						let index = this.quartos.findIndex((obj) => {
							return obj.id == id
						})

						this.quartos[index].numero = numero
						this.quartos[index].vagas = vagas
						this.quartos[index].genero = genero

						this.quarto = {
							numero: null,
							vagas: null,
							genero: null,
							id: null,
						}
					}
				}
			},
			async deletarQuarto() {
				let { id } = this.quarto

				let resp = await this.$axios.$delete(`/servicos_gerais/republica/quarto/${id}`)

				if (!resp.falha) {
					let index = this.quartos.findIndex((obj) => {
						return obj.id === id
					})

					this.quarto = {
						numero: null,
						vagas: null,
						genero: null,
						id: null,
					}

					this.quartos.splice(index, 1)
				}
			},
			funcionarioEditado({ id, totalFuncionarios }) {
				let idx = this.quartos.findIndex((o) => o.id === id)

				if (idx >= 0) {
					this.quartos[idx].numquartos = totalFuncionarios
				}
			},
		},
	}
</script>

<style scoped></style>
