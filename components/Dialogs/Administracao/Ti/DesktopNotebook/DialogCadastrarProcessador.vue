<template>
	<div>
		<BaseDialog
			largura="w-6/12"
			titulo="CADASTRAR PROCESSADOR"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<AppFormInput
						id="processador"
						type="text"
						label="Processador"
						v-model="nome"
            uppercase
						placeholder="Ex: CORE I3 7100T 3.90GHZ" />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-2">
					<span
						class="text-red-400 text-bold"
						v-if="jaCriado"
						>Já existe esse processador!</span
					>
					<BotaoPadrao
						texto="salvar"
						@clique="cadastrarProcessador()">
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
			async cadastrarProcessador() {
				this.jaCriado = false
				let nome = this.nome
				let resp = await this.$axios.$post("/ti/processadorDeskNote/cadastrar", { nome })

				if (!resp.falha) {
					let { processador, criado } = resp.dados

					if (!criado) {
						this.jaCriado = true
					} else {
						this.$store.commit("ti/processadorDeskNoteTI/ATUALIZAR_PROCESSADORES_DESKNOTE_TI", {
							processador,
						})

						this.$emit("cadastrado", processador)
					}
				}
			},
		},
	}
</script>

<style scoped></style>
e
