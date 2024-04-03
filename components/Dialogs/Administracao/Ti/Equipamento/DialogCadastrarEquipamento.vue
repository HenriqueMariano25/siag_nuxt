<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			class="uppercase"
			:titulo="equipamento === null ? `Cadastrar equipamento` : `Editar equipamento`"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full px-2">
					<div class="grid grid-cols-3 gap-x-2 gap-y-2.5">
						<AppFormInput
							label="Nome"
							placeholder="Ex: MOUSE"
							type="text"
							uppercase
							v-model="equipamentoLocal.nome"
							id="nome"
							:invalido="erros.includes('nome')" />
						<AppFormInput
							label="Marca"
							obrigatorio
							placeholder="Ex: DELL"
							type="text"
							uppercase
							v-model="equipamentoLocal.marca"
							id="marca"
							:invalido="erros.includes('marca')" />
						<AppFormInput
							label="Modelo"
							obrigatorio
							placeholder="Ex: GENÉRICO"
							type="text"
							uppercase
							v-model="equipamentoLocal.modelo"
							id="marca"
							:invalido="erros.includes('modelo')" />
						<AppFormTextarea
							id="observacao"
							:total-caracteres="1000"
							label="Observação"
							v-model="equipamentoLocal.observacao"
							linhas="2"
							placeholder="Observação opcional"
							class="col-span-3" />
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div
					class="flex gap-2 items-center">
					<BotaoPadrao
						texto="salvar"
						@clique="
							equipamentoLocal.id !== null ? editarEquipamento(false) : cadastrarEquipamento(false)
						">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="salvar e sair"
						@clique="
							equipamentoLocal.id !== null ? editarEquipamento(true) : cadastrarEquipamento(true)
						">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"

	export default {
		components: {
			BotaoPadrao,
			AppFormTextarea,
			AppAlerta,
			AppFormInput,
			BaseDialog,
		},
		props: {
			equipamento: {
				type: Object,
				default: null,
			},
		},
		data() {
			return {
				carregando: false,
				erros: [],
				mostrarAlerta: false,
				textoAlerta: null,
				equipamentoLocal: {
					nome: null,
					marca: null,
					modelo: null,
					observacao: null,
					id: null,
				},
				camposObrigatorio: ["nome", "marca", "modelo"],
			}
		},
		async mounted() {
			this.carregando = true

			if (this.equipamento !== null) {
				await this.buscarEquipamento()
			}

			this.carregando = false
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async deletarEquipamento() {},

			//EQUIPAMENTO
			async cadastrarEquipamento(sair) {
				this.textoErro = null
				this.erros = validarFormulario(this.camposObrigatorio, this.equipamentoLocal)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let resp = await this.$axios.$post("/ti/equipamento/cadastrar", {
						...this.equipamentoLocal,
						usuario_id,
					})
					if (!resp.falha) {
						let {  equipamento } = resp.dados

							if (sair) {
								this.$emit("cadastrado", { equipamento, sair })
							} else {
								this.equipamentoLocal.id = equipamento.id
								this.textoAlerta = `Equipamento cadastrado com sucesso!`
								this.mostrarAlerta = true
								this.$emit("cadastrado", { equipamento, sair })
							}
					}
				}
			},

			async editarEquipamento(sair) {
				this.erros = validarFormulario(this.camposObrigatorio, this.equipamentoLocal)

				if (this.erros.length === 0) {
					let usuario_id = this.$auth.user.id

					let resp = await this.$axios.$put("/ti/equipamento/editar", {
						...this.equipamentoLocal,
						usuario_id,
					})
					if (!resp.falha) {
						let { equipamento } = resp.dados


							if (!sair) {
								this.textoAlerta = `Equipamento editado com sucesso!`
								this.mostrarAlerta = true
							}

							this.$emit("editado", { equipamento, sair })

					}
				}
			},

			async buscarEquipamento() {
				let id = this.equipamento.id

				let resp = await this.$axios.$get("/ti/equipamento/buscar", { params: { id } })

				if (!resp.falha) {
					let equipamento = resp.dados.equipamento
					this.equipamentoLocal = Object.assign(this.equipamentoLocal, equipamento)
				}
			},
		},
	}
</script>

<style scoped>
</style>
