<template>
	<div class="w-full">
    <CabecalhoPagina titulo="CONFIGURAÇÕES" />
		<div
			class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
			<ButtonNavegacao
				titulo="Conf. Geral"
				cor="bg-[#264653]"
				link="configuracoes/ConfiguracaoGeral">
				<img
					src="@/assets/icons/list-w.svg"
					alt=""
					class="w-8 h-8" />
			</ButtonNavegacao>
      <ButtonNavegacao
        titulo="Cargo"
        cor="bg-[#264653]"
        link="Configuracoes/Cargo">
        <img
          src="@/assets/icons/list-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Conhe. Comportamental"
        cor="bg-[#264653]"
        link="configuracoes/ConhecimentoComportamental">
        <img
          src="@/assets/icons/list-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Conhe. Funcionário"
        cor="bg-[#264653]"
        link="configuracoes/ConhecimentoFuncionario">
        <img
          src="@/assets/icons/list-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Tipo de Obra"
        cor="bg-[#264653]"
        link="configuracoes/TipoObra">
        <img
          src="@/assets/icons/list-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Dispo. Trabalho"
        cor="bg-[#264653]"
        link="configuracoes/DisponibilidadeTrabalho">
        <img
          src="@/assets/icons/list-w.svg"
          alt=""
          class="w-8 h-8" />
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Hab. Técnica"
        cor="bg-[#264653]"
        link="configuracoes/HabilidadeTecnica">
        <img
          src="@/assets/icons/list-w.svg"
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
