<template>
  <div class="w-full grid grid-cols-1 h-fit gap-y-2">
    <div
      class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white">
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
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  components: {ButtonNavegacao}

}
</script>

<style scoped>

</style>
