<template>
	<div class="w-full grid h-fit">
    <CabecalhoPagina titulo="SOLICITAÇÃO DE SERVIÇO" />
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				v-if="$auth.user.permissoes.includes('solicitacao_servico')"
				titulo="Visualizar SSs"
				cor="bg-[#0077B6]"
				link="/suprimentos/ss/solicitacoes">
				<img
					src="@/assets/icons/files-w.svg"
					alt="close"
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Aprovar SSs"
				cor="bg-[#0077B6]"
				link="/suprimentos/ss/aprovarSSs"
				v-if="
					$auth.user.permissoes.includes('aprovar_ss_controle') ||
					$auth.user.permissoes.includes('aprovar_ss_gerente_area') ||
					$auth.user.permissoes.includes('aprovar_ss_site_manager')
				">
				<img
					src="@/assets/icons/check-circle-w.svg"
					alt="close"
					class="w-8 h-8" />
			</ButtonNavegacao>
		</div>
	</div>
</template>

<script>
	import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
	export default {
		name: "index.vue",
		components: {
      CabecalhoPagina,
			ButtonNavegacao,
		},
	}
</script>

<style scoped></style>
