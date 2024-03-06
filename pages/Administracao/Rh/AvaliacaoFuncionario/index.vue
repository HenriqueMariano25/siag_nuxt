<template>
	<div class="w-full grid h-fit">
    <CabecalhoPagina titulo="APROVAR CARD" />
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				titulo="Avaliações"
				cor="bg-[#264653]"
				link="/administracao/rh/AvaliacaoFuncionario/Avaliacoes">
				<img
					src="@/assets/icons/person-circle-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
        v-if="$auth.user.permissoes.includes('avaliacao_funcionario_aprovacoes')"
				titulo="Aprovações"
				cor="bg-[#264653]"
				link="/administracao/rh/AvaliacaoFuncionario/Aprovacoes">
				<img
					src="@/assets/icons/check-circle-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Configurações"
				cor="bg-[#264653]"
				link="/administracao/rh/AvaliacaoFuncionario/Configuracoes"
				v-if="$auth.user.permissoes.includes('avaliacao_funcionario_configuracoes')">
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
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

	export default {
		name: "index",
		components: {
      CabecalhoPagina,
			ButtonNavegacao,
		},
	}
</script>

<style scoped></style>
