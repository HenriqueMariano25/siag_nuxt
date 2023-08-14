<template>
	<div class="flex items-center ml-3">
		<BotaoPadrao
			:texto="textoBtn"
			cor="bg-red-500 hover:bg-red-700"
			v-if="!mostrarConfirmacao"
			@clique="mostrarConfirmacao = !mostrarConfirmacao">
			<img
				src="@/assets/icons/delete-b.svg"
				alt="close"
				class="w-6 h-6" />
		</BotaoPadrao>
		<div
			class="flex items-center gap-3"
			v-if="mostrarConfirmacao">
			<BotaoPadrao
				texto="Não"
				cor="bg-red-500 hover:bg-red-700"
				@clique="mostrarConfirmacao = !mostrarConfirmacao" />
			<span>{{ texto }}</span>
			<BotaoPadrao
				texto="Sim"
				cor="bg-green-500 hover:bg-green-700"
				@clique="confirmado()" />
		</div>
	</div>
</template>

<script>
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	export default {
		name: "AppConfirmacao",
		props: {
			texto: {
				type: String,
				required: true,
			},
			textoBtn: {
				type: String,
				required: true,
			},
		},
		data() {
			return {
				mostrarConfirmacao: false,
			}
		},
		components: {
			BotaoPadrao,
		},
		methods: {
			confirmado() {
				this.$emit("confirmado")
			},
		},
	}
</script>

<style scoped></style>
