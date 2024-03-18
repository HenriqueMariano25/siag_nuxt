<template>
	<div>
		<BaseDialog
			largura="w-6/12"
			titulo="CADASTRAR SISTEMA OPERACIONAL"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<AppFormInput
						id="disco"
						type="text"
						label="Disco"
						v-model="nome"
						placeholder="Ex: WINDOWS 11 PRO"
						uppercase />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-2">
					<span
						class="text-red-400 text-bold"
						v-if="jaCriado"
						>Já existe esse sistema operacional!</span
					>
					<BotaoPadrao
						texto="salvar"
						@clique="cadastrarSistemaOpe()">
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

	export default {
		components: { BotaoPadrao, AppFormInput, BaseDialog },
		data() {
			return {
				nome: null,
				jaCriado: false,
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async cadastrarSistemaOpe() {
				this.jaCriado = false
				let nome = this.nome
				let resp = await this.$axios.$post("/ti/sistemaOpeDeskNote/cadastrar", { nome })

				if (!resp.falha) {
					let { sistema, criado } = resp.dados

					if (!criado) {
						this.jaCriado = true
					} else {
						this.$store.commit("ti/sistemaOpeDeskNoteTI/ATUALIZAR_SISTEMASOPE_DESKNOTE_TI", {
							sistema,
						})
						this.$emit("cadastrado")
					}
				}
			},
		},
	}
</script>

<style scoped></style>
e
