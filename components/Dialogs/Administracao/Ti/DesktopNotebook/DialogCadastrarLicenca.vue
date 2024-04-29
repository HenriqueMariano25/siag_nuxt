<template>
	<div>
		<BaseDialog
			largura="w-9/12"
			:titulo="licenca ? 'EDITAR LICENÇA' : 'CADASTRAR LICENÇA'"
			:btn-deletar="true"
			@deletar="deletarLicenca"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-2 grid-2 gap-2">
					<AppFormInput
						id="licenca"
						type="text"
						label="Nome da licença"
						v-model="licencaLocal.nome"
						placeholder="Ex: AUTOCAD 2024"
						obrigatorio
						:invalido="erros.includes('nome')"
						uppercase />
					<AppFormInput
						id="valor"
						type="text"
						label="Valor"
						v-model="licencaLocal.valor"
						placeholder="Ex: R$ 300,00"
						v-money="{ precision: 2, prefix: 'R$ ', decimal: ',', thousands: '.' }" />
					<AppFormRadio
						:itens="opcoes"
						titulo="Tipo de licença"
						:invalido="erros.includes('tipo_licenca')"
						id="tipo_licenca"
						obrigatorio
						v-model="licencaLocal.tipo_licenca" />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-2">
					<span
						class="text-red-400 text-bold"
						v-if="jaCriado">
						JÁ EXISTE ESSA LICENÇA!
					</span>
					<span
						class="text-red-400 text-bold"
						v-if="erroDeletar">
						EXISTE UM DESKTOP/NOTEBOOK COM ESSA LICENÇA!
					</span>
					<BotaoPadrao
						texto="salvar"
						@clique="licenca ? editarLicenca() : cadastrarLicenca()">
						<img
							src="../../../../../assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"

	export default {
		components: { AppFormRadio, BotaoPadrao, AppFormInput, BaseDialog },
		props: {
			licenca: {
				type: Object,
				default: null,
			},
		},
		data() {
			return {
				licencaLocal: {
					nome: null,
					valor: null,
					tipo_licenca: null,
				},
				opcoes: [
					{ label: "Só Desktop/Notebook", valor: "desknote" },
					{ label: "Só Funcionário", valor: "funcionario" },
					{ label: "Ambos as opções", valor: "ambos" },
				],
				jaCriado: false,
				erroDeletar: false,
				camposObrigatorio: ["nome", "tipo_licenca"],
				erros: [],
			}
		},
		mounted() {
			if (this.licenca) {
				this.licencaLocal = Object.assign({}, this.licenca)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async cadastrarLicenca() {
				this.jaCriado = false

				this.erros = validarFormulario(this.camposObrigatorio, this.licencaLocal)
				if (this.erros.length === 0) {
					let { nome, valor, tipo_licenca } = this.licencaLocal
					let resp = await this.$axios.$post("/ti/licenca/cadastrar", { nome, valor, tipo_licenca })

					if (!resp.falha) {
						let { licenca, criado } = resp.dados

						if (!criado) {
							this.jaCriado = true
						} else {
							this.$store.commit("ti/licencaTI/ATUALIZAR_LICENCAS_TI", {
								licenca,
							})
							this.$emit("cadastrado", licenca)
						}
					}
				}
			},
			async editarLicenca() {
				this.jaCriado = false

				this.erros = validarFormulario(this.camposObrigatorio, this.licencaLocal)
				if (this.erros.length === 0) {
					let { nome, valor, tipo_licenca, id } = this.licencaLocal
					let resp = await this.$axios.$put("/ti/licenca/editar", { nome, valor, tipo_licenca, id })

					if (!resp.falha) {
						let { licenca, editado } = resp.dados

						if (!editado) {
							this.jaCriado = true
						} else {
							this.$store.commit("ti/licencaTI/LIMPAR_LICENCAS")
							this.$emit("editado", licenca)
						}
					}
				}
			},
			async deletarLicenca() {
				this.erroDeletar = false
				let { id } = this.licencaLocal
				let resp = await this.$axios.$delete("/ti/licenca/deletar", { params: { id } })

				if (!resp.falha) {
					let { deletado } = resp.dados

					if (deletado) {
						this.$store.commit("ti/licencaTI/DELETAR_LICENCA_TI", { id })
						this.$emit("deletado", parseInt(id))
					} else {
						this.erroDeletar = true
					}
				}
			},
		},
	}
</script>

<style scoped></style>
e
