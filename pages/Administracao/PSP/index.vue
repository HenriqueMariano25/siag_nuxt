<template>
	<div class="w-full grid grid-cols-1 h-fit gap-y-2">
    <CabecalhoPagina titulo="PSP" />
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				titulo="Solicitações"
				cor="bg-[#264653]"
				link="psp/solicitacoes">
				<img
					src="@/assets/icons/travel-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Aprovar PSP"
				cor="bg-[#264653]"
				link="psp/aprovacao"
				v-if="
					$auth.user.permissoes.includes('aprovar_psp_coordenador') ||
					$auth.user.permissoes.includes('aprovar_psp_gaf') ||
					$auth.user.permissoes.includes('aprovar_psp_gerente') ||
					$auth.user.permissoes.includes('aprovar_psp_rh')
				">
				<img
					src="@/assets/icons/check-circle-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Configurações"
				cor="bg-[#264653]"
				link="psp/configuracoes"
				v-if="$auth.user.permissoes.includes('gerenciamento_psp')">
				<img
					src="@/assets/icons/cog-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
		</div>
	</div>
</template>

<script>
	import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

	export default {
		name: "index",
		components: {
      CabecalhoPagina,
			ButtonNavegacao,
			AppTabs,
			AppFormInput,
			BotaoPadrao,
		},
		data() {
			return {}
		},
	}
</script>

<style scoped></style>
