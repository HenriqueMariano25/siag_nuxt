<template>
	<div class="w-full grid h-fit">
    <CabecalhoPagina titulo="KPIs" />
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				titulo="Presente/Não Presentes"
				cor="bg-[#264653]"
				link="/administracao/rh/horaExtra/kpis/presentesNaoPresentes"
				v-if="$auth.user.permissoes.includes('horaExtra_rh')">
				<img
					src="@/assets/icons/graph-w.svg"
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
		components: { CabecalhoPagina, ButtonNavegacao },
  }
</script>

<style scoped></style>
