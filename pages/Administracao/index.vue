<template>
  <div class="w-full grid  h-fit">
    <CabecalhoPagina titulo="ADMINISTRAÇÃO" />
    <div class="border grid grid-cols-4 gap-3 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11">
      <ButtonNavegacao titulo="RH" cor="bg-[#264653]" link="administracao/rh">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path fill-rule="evenodd"
                d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                clip-rule="evenodd"/>
        </svg>
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Transporte" cor="bg-[#264653]" link="administracao/transporte"
                       v-if="$auth.user.permissoes.includes('transporte')">
        <img src="@/assets/icons/bus-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="T.I" cor="bg-[#264653]" link="administracao/ti"
                       v-if="$auth.user.permissoes.includes('ti')">
        <img src="@/assets/icons/computer-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Serviços Gerais" cor="bg-[#264653]" link="administracao/servicosGerais"
                       v-if="$auth.user.permissoes.includes('servicos_gerais')">
        <img src="@/assets/icons/wrench-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Catracas" cor="bg-[#264653]" link="administracao/catracas"
                       v-if="$auth.user.permissoes.includes('acessos_catraca')">
        <img src="@/assets/icons/gate-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="PSP" cor="bg-[#264653]" link="administracao/psp"
                       v-if="$auth.user.permissoes.includes('administracao_psp')">
        <img src="@/assets/icons/travel-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Nutrição" cor="bg-[#264653]" link="administracao/nutricao"
                       v-if="$auth.user.permissoes.includes('administrativo_refeitorio')">
        <img src="@/assets/icons/fork-and-knife-w-com.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Gente" cor="bg-[#264653]" link="administracao/gente"
                       v-if="$auth.user.permissoes.includes('gente')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
          <path fill-rule="evenodd"
                d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
                clip-rule="evenodd" />
        </svg>
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
export default {
  name: "index",
  components:{
    CabecalhoPagina,
    ButtonNavegacao
  },
}
</script>

<style scoped>

</style>
