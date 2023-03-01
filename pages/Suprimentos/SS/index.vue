<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Visualizar SSs" cor="bg-[#0077B6]" link="/suprimentos/ss/solicitacoes">
        <img src="@/assets/icons/files-w.svg" alt="close" class="w-8 h-8"/>
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
export default {
  name: "index.vue",
  components: {
    ButtonNavegacao
  }
}
</script>

<style scoped>

</style>
