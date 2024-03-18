<template>
	<div>
		<BaseDialog
			largura="w-6/12"
			titulo="CADASTRAR LOCAL DE INSTALAÇÃO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<AppFormInput
						id="local_instalacao"
						type="text"
						label="Local de Instalação"
						v-model="nome"
						placeholder="Ex: CANTEIRO AVANÇADO"
						uppercase />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-2">
					<span
						class="text-red-400 text-bold"
						v-if="jaCriado"
						>Já existe esse local de instalação!</span
					>
					<BotaoPadrao
						texto="salvar"
						@clique="cadastrarLocalInstalacao()">
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
			async cadastrarLocalInstalacao() {
				this.jaCriado = false
				let nome = this.nome
				let resp = await this.$axios.$post("/ti/localInstalacao/cadastrar", { nome })

				if (!resp.falha) {
					let { local, criado } = resp.dados

					if (!criado) {
						this.jaCriado = true
					} else {
						this.$store.commit("ti/localInstalacaoTI/ATUALIZAR_LOCALINSTALACAO_TI", {
							local,
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
