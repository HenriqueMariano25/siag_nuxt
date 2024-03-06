<template>
	<div class="w-full grid h-fit">
    <CabecalhoPagina titulo="TRANSPORTE" />
		<div
			class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				titulo="Rotas"
				cor="bg-[#264653]"
				link="transporte/rotas"
				v-if="$auth.user.permissoes.includes('transporte')">
				<img
					src="@/assets/icons/route-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
			<ButtonNavegacao
				titulo="Carros"
				cor="bg-[#264653]"
				link="transporte/carros"
				v-if="$auth.user.permissoes.includes('transporte')">
				<img
					src="@/assets/icons/vehicle-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
      <ButtonNavegacao
        titulo="Pool"
        cor="bg-[#264653]"
        link="transporte/pool"
        v-if="$auth.user.permissoes.includes('transporte')">
        <img
          src="@/assets/icons/road-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
			<ButtonNavegacao
				titulo="Veículos"
				cor="bg-[#264653]"
				link="transporte/veiculos"
				v-if="$auth.user.permissoes.includes('transporte')">
				<img
					src="@/assets/icons/cog-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
		</div>
		<div>
			<GraficoRotas :dados="dados"></GraficoRotas>
		</div>
	</div>
</template>

<script>
	import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue"
	import GraficoRotas from "~/components/Graphic/Administracao/Transporte/GraficoRotas.vue"
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

	export default {
		components: { CabecalhoPagina, ButtonNavegacao, GraficoRotas },
		data() {
			return {

			}
		},
		created() {},
	}
</script>

<style scoped></style>
