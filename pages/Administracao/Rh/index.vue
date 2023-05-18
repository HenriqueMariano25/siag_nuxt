<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
<!--      <ButtonNavegacao titulo="Efetivo" cor="bg-[#264653]" link="/administracao/rh/efetivo">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">-->
<!--          <path fill-rule="evenodd"-->
<!--                d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"-->
<!--                clip-rule="evenodd"/>-->
<!--          <path-->
<!--            d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"/>-->
<!--        </svg>-->
<!--      </ButtonNavegacao>-->
<!--      <ButtonNavegacao titulo="Hora Extra" cor="bg-[#264653]" link="/administracao/rh/horaExtra"-->
<!--                       v-if="$auth.user.permissoes.includes('horaExtra_rh')">-->
<!--        <img src="@/assets/icons/clock-check-w.svg" alt="" class="w-8 h-8">-->
<!--      </ButtonNavegacao>-->
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
