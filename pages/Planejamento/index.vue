<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Disciplina" cor="bg-[#606c38]" link="planejamento/disciplina">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
<!--      <ButtonNavegacao titulo="Gente" cor="bg-[#264653]" link="administracao/gente"-->
<!--                       v-if="$auth.user.permissoes.includes('gente')">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">-->
<!--          <path fill-rule="evenodd"-->
<!--                d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"-->
<!--                clip-rule="evenodd" />-->
<!--        </svg>-->
<!--      </ButtonNavegacao>-->
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";

export default defineComponent({
  name: "index",
  components: { ButtonNavegacao }
});
</script>

<style scoped>

</style>
