<template>
  <div class="w-full grid grid-cols-1 h-fit gap-y-2">
    <CabecalhoPagina titulo="CONFIGURAÇÃO" />
    <div
      class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao
        titulo="Etapas"
        cor="bg-[#264653]"
        link="/administracao/rh/contratacao/configuracao/etapa">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Motivos alteração"
        cor="bg-[#264653]"
        link="/administracao/rh/contratacao/configuracao/motivoAlteracao">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="NRs"
        cor="bg-[#264653]"
        link="/administracao/rh/contratacao/configuracao/NRs">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Função"
        cor="bg-[#264653]"
        link="/administracao/rh/contratacao/configuracao/Funcao">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao
        titulo="Centro de Custo"
        cor="bg-[#264653]"
        link="/administracao/rh/contratacao/configuracao/CentroCusto">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  components: { CabecalhoPagina, ButtonNavegacao}

}
</script>

<style scoped>

</style>
