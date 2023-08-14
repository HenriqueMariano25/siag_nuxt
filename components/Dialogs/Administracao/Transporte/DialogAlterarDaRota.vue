<template>
  <div>
    <BaseDialog
      largura="w-8/12"
      :titulo="'Editar ' + (funcionario ? 'funcionário' : 'terceiro')"
      :carregando="carregando"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 flex flex-col gap-2">
          <span class="text-2xl ">
            {{ funcionario ? funcionario.nome : ''}}
            {{ terceiro ? terceiro.nome : ''}}
          </span>
          <div class="grid grid-cols-2 gap-2">
            <AppFormInput
              class="grow"
              label="Ponto de embarque"
              type="text"
              id="ponto_embarque"
              placeholder="Ex: Em frente ao Supermercado Sempre Bom"
              v-model="dadosLocal.ponto_embarque" />
            <AppFormInput
              class="grow"
              label="Poltrona"
              type="text"
              id="poltrona"
              placeholder="Ex: 45"
              v-model="dadosLocal.poltrona" />
            <AppFormSelectCompleto
              obrigatorio
              id="rota"
              label="Rota de destino"
              :options="rotas"
              v-model="dadosLocal.rota_id"
            />
          </div>

        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div>
          <BotaoPadrao texto="salvar" @clique="editarFuncionario()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup>

import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

</script>

<script>
import { buscarRotas } from "~/mixins/buscarInformacoes";

export default {
  mixins:[buscarRotas],
  props: {
    funcionario: {
      type: Object,
    },
    terceiro: {
      type: Object,
    },
    rota:{
      type: Object
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      carregando: null,
      dadosLocal: {
        poltrona: null,
        ponto_embarque: null,
        rota_id: null
      },
      rotas: []
    };
  },
  async mounted() {
    this.carregando = true
    if(this.funcionario){
      this.dadosLocal.poltrona = this.funcionario.poltrona
      this.dadosLocal.ponto_embarque = this.funcionario.ponto_embarque
    }else if(this.terceiro){
      this.dadosLocal.poltrona = this.terceiro.poltrona
      this.dadosLocal.ponto_embarque = this.terceiro.ponto_embarque
    }
    this.carregando = false

    let rotas = await this.buscarRotas()

    this.rotas = rotas.map( o => { return { id: o.id, nome: `${o.numero} - ${o.local}` }})
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async editarFuncionario(){
      let usuario_id = this.$auth.user.id
      let { poltrona, ponto_embarque, rota_id } = this.dadosLocal
      let funcionario_id = this.funcionario ? this.funcionario.id : null
      let terceiro_id = this.terceiro ? this.terceiro.id : null

      let resp = await this.$axios.$post("/transporte/rota/alterar_rota_funcionario", {  usuario_id,
        poltrona,
        ponto_embarque,
        rota_id,
        funcionario_id,
        terceiro_id
      })

      if(!resp.falha){
        let index = this.index

        this.$emit("alterado", { index, rota_id, ponto_embarque, poltrona })
      }
    }
  },

}

</script>

<style lang="scss" scoped>

</style>
