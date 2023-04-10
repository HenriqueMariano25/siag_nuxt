<template>
	<BaseDialog
		titulo="Filtros avançados"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="px-2">
				<AppFormCheckbox
					label="Necessita Notebook, Computador ou Login ?"
					id="equipamento_id"
					valor="$cardTemEquipamentoCard.equipamento_card_id$:1"
					v-model="filtros" />
				<div>
					<span class="text-xl">Mobilização</span>
					<AppFormCheckbox
						label="Local"
						id="local"
						valor="local"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="Alojado"
						id="alojado"
						valor="alojado"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="República"
						id="republica"
						valor="república"
						v-model="mobilizacao" />
					<AppFormCheckbox
						label="Moradia fámiliar"
						id="moradia_familiar"
						valor="moradia fámiliar"
						v-model="mobilizacao" />
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div class="flex gap-x-2">
				<BotaoPadrao
					texto="Limpar"
					@click="limparFiltro">
					<img
						src="@/assets/icons/eraser-b.svg"
						alt="close"
						class="w-6 h-6" />
				</BotaoPadrao>
				<BotaoPadrao
					texto="Filtrar"
					@click="filtrar()">
					<img
						src="@/assets/icons/filter-b.svg"
						alt="close"
						class="w-6 h-6" />
				</BotaoPadrao>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	export default {
		name: "DialogFiltroAvancado",
		components: {
			BaseDialog,
			AppFormCheckbox,
			BotaoPadrao,
		},
		data() {
			return {
				filtros: [],
				mobilizacao: [],
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			filtrar() {
				let filtrosPrPreparar = this.filtros

				let filtros = {}
				if (this.mobilizacao.length > 0) {
					filtros["mobilizacao"] = { $in: this.mobilizacao }
				}

				for (let f of filtrosPrPreparar) {
					let campos = f.split(":")
					let novoFiltros

					if (campos[1] === "int") filtros[campos[0]] = { $in: [parseInt(campos[2])] }
					else filtros[campos[0]] = campos[1]
				}

				this.$emit("filtrar", filtros)
			},
			async limparFiltro() {
				this.filtros = []
        this.mobilizacao = []
				this.$emit("limparFiltro")
			},
		},
	}
</script>

<style scoped></style>
