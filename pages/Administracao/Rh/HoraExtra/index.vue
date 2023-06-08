<template>
  <div class="w-full grid  h-fit">
    <div class="border grid grid-cols-4 space-x-3 border-1 shadow border-gray-300 p-2 rounded bg-white ">
      <ButtonNavegacao titulo="Agendar" cor="bg-[#264653]" link="/administracao/rh/horaExtra/agendar"
                       v-if="$auth.user.permissoes.includes('horaExtra_rh')">
        <img src="@/assets/icons/clock-check-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="KPIs" cor="bg-[#264653]" link="/administracao/rh/horaExtra/kpis"
                       v-if="$auth.user.permissoes.includes('kpi_hora_extra')">
        <img src="@/assets/icons/graph-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracoes"
                       v-if="$auth.user.permissoes.includes('configuracao_hora_extra')">
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
