<template>
  <div class="w-full grid  h-fit gap-2">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Feriados" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracao/feriados"
                       v-if="$auth.user.permissoes.includes('horaExtra_feriados')">
        <img src="@/assets/icons/calendar-days-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default {
  name: "index",
  components: { ButtonNavegacao }
};
</script>

<style scoped>

</style>
