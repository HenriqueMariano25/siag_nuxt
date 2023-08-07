<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Efetivo" cor="bg-[#264653]" link="/administracao/rh/efetivo">
        <img src="@/assets/icons/people-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Hora Extra" cor="bg-[#264653]" link="/administracao/rh/horaExtra"
                       v-if="$auth.user.permissoes.includes('horaExtra_rh')">
        <img src="@/assets/icons/clock-check-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Contratação" cor="bg-[#264653]" link="/administracao/rh/contratacao"
                       v-if="$auth.user.permissoes.includes('contratacoes')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path
            d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z"/>
        </svg>
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
export default {
  name: "index",
  components: {
    ButtonNavegacao,
  },
}
</script>

<style scoped>

</style>
