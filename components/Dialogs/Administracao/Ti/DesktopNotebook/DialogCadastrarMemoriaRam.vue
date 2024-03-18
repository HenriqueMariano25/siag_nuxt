<template>
	<div>
		<BaseDialog
			largura="w-6/12"
			titulo="CADASTRAR MEMÓRIA RAM"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<AppFormInput
						id="memoria_ram"
						type="text"
						label="Memória Ram"
						v-model="nome"
            uppercase
						placeholder="Ex: 8GB" />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-2">
					<span
						class="text-red-400 text-bold"
						v-if="jaCriado"
						>Já existe essa memória ram!</span
					>
					<BotaoPadrao
						texto="salvar"
						@clique="cadastrarMemoriaRam()">
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
			async cadastrarMemoriaRam() {
				this.jaCriado = false
				let nome = this.nome
				let resp = await this.$axios.$post("/ti/ramDeskNote/cadastrar", { nome })

				if (!resp.falha) {
					let { ram, criado } = resp.dados

					if (!criado) {
						this.jaCriado = true
					} else {
						this.$store.commit("ti/ramDeskNoteTI/ATUALIZAR_RAMS_DESKNOTE_TI", {
							ram,
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
