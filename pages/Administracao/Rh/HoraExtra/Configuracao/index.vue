<template>
  <div class="w-full grid h-fit gap-2">
    <CabecalhoPagina titulo="CONFIGURAÇÃO" />
    <div class="border grid grid-cols-4 gap-2 border-1 shadow border-gray-300 p-2 rounded bg-white !mt-11 ">
      <ButtonNavegacao titulo="Feriados" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracao/feriados"
                       v-if="$auth.user.permissoes.includes('horaExtra_feriados')">
        <img src="@/assets/icons/calendar-days-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Liberação/Bloqueio" cor="bg-[#264653]"
                       link="/administracao/rh/horaExtra/configuracao/LiberacaoBloqueio"
                       v-if="$auth.user.permissoes.includes('liberacao_bloqueio_he')">
        <img src="@/assets/icons/lock-open-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Configurações" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracao/configuracoes"
                       v-if="$auth.user.permissoes.includes('configuracao_he')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Dias p/ agendamento" cor="bg-[#264653]" link="/administracao/rh/horaExtra/configuracao/diasAgendamento"
                       v-if="$auth.user.permissoes.includes('he_data_agendamento')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Dias p/ compensação" cor="bg-[#264653]"
                       link="/administracao/rh/horaExtra/configuracao/diasCompensacao"
                       v-if="$auth.user.permissoes.includes('he_data_compensacao')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
      <ButtonNavegacao titulo="Bloq. por Faltas e Atestados" cor="bg-[#264653]" texto-pequeno
                       detalhes="Bloquei de funcionários que tiveram falta ou atestato na última competência."
                       link="/administracao/rh/horaExtra/configuracao/BloquearFaltaAtestado"
                       v-if="$auth.user.permissoes.includes('he_bloqueio_falta_atestado')">
        <img src="@/assets/icons/cog-w.svg" alt="" class="w-8 h-8">
      </ButtonNavegacao>
    </div>
  </div>
</template>

<script>
import ButtonNavegacao from "~/components/Shared/ButtonNavegacao.vue";
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

export default {
  name: "Configuracoes",
  components: { CabecalhoPagina, ButtonNavegacao }
};
</script>

<style scoped>

</style>
