<template>
  <div class="w-full">
    <div class="w-full bg-white flex flex-col gap-2 p-2 overflow-y-auto" style="height: calc(100vh - 73px)">
      <div class="flex bg-blue-400 px-2 text-2xl">
        <h1>Etapas</h1>
      </div>
      <div v-for="item of itens" class="bg-blue-200 flex p-1 justify-between items-center">
        <div class="flex gap-2 items-center">
          <BotaoPadrao class="!p-1" @clique="etapa_id = item.id; mostrarDialogCriarEtapa = true" icone>
            <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
          <span class="text-xl">{{ item.ordem }} - {{ item.nome }}</span>
        </div>
        <div class="flex gap-2">
          <BotaoPadrao class="!p-1 !rounded-full border border-blue-300" cor="bg-gray-100 hover:!bg-gray-300" >
            <img src="@/assets/icons/arrow-up-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao class="!p-1 !rounded-full" cor="bg-gray-100 hover:!bg-gray-300">
            <img src="@/assets/icons/arrow-down-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </div>
    </div>
    <RodapePagina class="">
      <template v-slot>
        <div class="flex justify-between">
          <div class="flex"></div>
          <div class="flex">
            <BotaoPadrao texto="adicionar" @clique="mostrarDialogCriarEtapa = true">
              <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarEtapa v-if="mostrarDialogCriarEtapa" @cancelar="mostrarDialogCriarEtapa = false" :etapa_id="etapa_id" @editado="editado"/>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>

import {buscarEtapa} from "@/mixins/buscarInformacoes";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import DialogCriarEtapa from "~/components/Dialogs/Administracao/Rh/Contratacao/Configuracao/DialogCriarEtapa.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";


export default {
  components: {AppAlerta, DialogCriarEtapa, RodapePagina, BotaoPadrao},
  mixins: [buscarEtapa],
  data() {
    return {
      itens:[],
      mostrarDialogCriarEtapa: false,
      etapa_id:null,
      mostrarAlerta:false,
      textoAlerta: null
    }
  },
  async mounted() {
    let itens = await this.buscarEtapa();

    this.itens = itens;
  },
  methods: {
    // async buscarEtapas(){
    //   let resp = await this.$axios.$get("")
    // },
    editado(etapa){
      let idx = this.itens.findIndex( o => o.id === etapa.id)

      if(idx >= 0){
        this.itens[idx].nome = etapa.nome
        this.textoAlerta = 'Etapa editada com sucesso'
        this.mostrarAlerta =  true
        this.mostrarDialogCriarEtapa = false
      }
    }
  },
}
</script>

<style scoped>

</style>
