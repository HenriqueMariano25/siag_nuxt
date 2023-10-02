<template>
	<div class="w-full justify-center fixed flex items-center h-full">
		<div
			class="flex flex-col border-2 rounded border-gray-700 bg-slate-300 externa justify-center text-center p-2 gap-3">
			<div class="flex w-full justify-center">
				<img
					src="@/assets/icons/alert-triangle-r.svg"
					alt=""
					class="w-[100px] h-[100px] flex" />
			</div>
			<div class="text-center">
				<span
					class="text-2xl"
					v-if="$auth.user">
					O usuário <strong>{{ $auth.user.usuario }}</strong> não tem um SETOR atribuído, favor
					procurar o <i>ADMINSTRADOR</i> do SIAG.
				</span>
			</div>
			<div>
				<button
					@click="mostrarDialogLogout = true"
					class="bg-primaria-500 hover:bg-primaria-700 p-2 text-white text-xl w-[200px] font-bold">
					SAIR
				</button>
			</div>
		</div>
		<DialogLogout
			@cancelar="mostrarDialogLogout = false"
			v-if="mostrarDialogLogout" />
	</div>
</template>

<script>
	import DialogLogout from "~/components/Dialogs/DialogLogout.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, DialogLogout },
		name: "SemSetor",
		layout: "auth",
		data() {
			return {
				mostrarDialogLogout: false,
			}
		},
	}
</script>

<style scoped>
	.externa {
		width: 80vw;
	}
</style>
