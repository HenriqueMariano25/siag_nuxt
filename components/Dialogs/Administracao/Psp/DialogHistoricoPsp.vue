<template>
  <BaseDialog
    :titulo="'Histórico - ' + ('00000' + psp_id).slice(-5)"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex-col w-full">
        <div class="grid w-full">
          <div
            class="flex-col w-full px-2 overflow-auto space-y-3"
            style="max-height: calc(65vh)">
            <div
              class="w-full flex-col bg-blue-100 px-1 py-1 border border-blue-200 font-xl"
              v-for="historico in historicos"
              :key="historico.id">
              <div class="flex justify-between">
                <span class="flex">
								  <strong>Usuário: </strong> {{ historico.Usuario ? historico.Usuario.nome : "" }}
                </span>
                <span class="flex">
                   {{ $dayjs(historico.createdAt).format("DD/MM/YYYY HH:mm:ss") }}
                </span>

              </div>

              <span class="flex"><strong>Ação: </strong>{{ historico.acao }}</span>
              <span class="flex">
								<strong>Moveu de: </strong>{{ historico.EtapaOrigem ? historico.EtapaOrigem.nome : "" }}
							</span>
              <span class="flex">
								<strong>Moveu para: </strong>
								{{ historico.EtapaDestino ? historico.EtapaDestino.nome : "" }}
							</span>
              <div class="flex flex-col bg-gray-300 px-1 border border-gray-400 whitespace-pre-line" v-if="historico.descricao">
                <span><strong>Comentário: </strong></span>
                <pre class="ml-3">{{ historico.descricao }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
import BaseDialog from "~/components/Shared/BaseDialog.vue";

export default {
  name: "DialogHistoricoPsp",
  components: { BaseDialog, AppAlerta, AppFormTextarea, BotaoPadrao },
  props:{
    psp_id: {
      type: Number
    }
  },
  data() {
    return {
      historicos: []
    };
  },
  created() {
    if(this.psp_id){
      this.buscarHistorico()
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarHistorico(){
      let resp = await this.$axios.$get(`/psp/buscar/historico/${this.psp_id}`)


      if(!resp.falha){
        this.historicos = resp.dados.historicos
      }
    }
  }
};
</script>

<style scoped>

</style>
