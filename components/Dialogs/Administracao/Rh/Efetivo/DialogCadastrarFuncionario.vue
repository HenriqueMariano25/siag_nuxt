<template>
	<div>
		<BaseDialog
			titulo="Cadastrar funcionário"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
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
						<AppFormSelectCompleto
							id="setor"
							label="Setor"
							:options="setores"
							obrigatorio
							v-model="funcionario.setor_id"
							:invalido="erros.includes('setor_id')" />
						<AppFormSelect
							label="Mão de Obra"
							obrigatorio
							:options="maosObra"
							v-model="funcionario.direto_indireto"
							id="direto_indireto"
							:invalido="erros.includes('direto_indireto')" />
					</div>
					<div class="text-center bg-red-200 text-red-700 text-xl mt-2">
						<span v-if="erroCadastro"
							><strong>{{ mensagemErro }}</strong></span
						>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="Salvar"
					@clique="cadastrar()"
					class="!py-1">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "@/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"

	import { buscarSetores } from "~/mixins/buscarInformacoes"

	export default {
		mixins: [buscarSetores],
		components: { BaseDialog, AppFormInput, AppFormSelectCompleto, BotaoPadrao, AppFormSelect },
		data() {
			return {
				funcionario: {
					nome: null,
					chapa: null,
					cargo: null,
					setor_id: null,
					direto_indireto: null,
					data_admissao: null,
					cpf: null,
				},
				setores: [],
				erros: [],
				maosObra: [
					{ id: "D", nome: "MOD - Mão de Obra Direta" },
					{ id: "I", nome: "MOI - Mão de Obra Indireta" },
				],
				erroCadastro: false,
				mensagemErro: null,
			}
		},

		async mounted() {
			let setores = await this.buscarSetores()
			this.setores = setores.map((o) => {
				return { id: o.id, nome: o.nome }
			})
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = [
					"nome",
					"chapa",
					"cargo",
					"setor_id",
					"direto_indireto",
					"data_admissao",
					"cpf",
				]

				for (let campo of camposObrigatorio) {
					if (this.funcionario[`${campo}`] === null || this.funcionario[`${campo}`] === "")
						this.erros.push(campo)
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

			async cadastrar() {
				let usuario_id = this.$auth.user.id

				this.erroCadastro = false
				this.validarFormulario()

				if (this.erros.length === 0) {
					let funcionario = this.limparCampos(this.funcionario)

					try {
						let resp = await this.$axios.$post("/efetivo/cadastrar_funcionario_manual", {
							...funcionario,
							usuario_id,
						})
						if (!resp.falha) {
							this.$emit("cadastrado")
						}
					} catch (error) {
						let { dados } = error.response.data
						this.erroCadastro = true
						this.mensagemErro = dados.mensagem
					}
				}
			},
		},
	}
</script>

<style scoped></style>
