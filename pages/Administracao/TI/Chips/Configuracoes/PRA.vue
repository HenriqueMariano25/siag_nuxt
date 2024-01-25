<template>
  <div class="w-full">
    <CabecalhoPagina titulo="PRA" />
    <div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
      <TabelaPadrao
        id="pra"
        :cabecalho="cabecalho"
        :dados="dados"
        :tem-rodape="false"
        :totalItens="dados.length"
        altura="calc(100vh - 60px)"
        @atualizar="buscarSetores"
        :temDetalhes="false">
        <template v-slot:[`body.nome`]="{ item }">
          <span class="grow w-full">{{ item.nome }}</span>
        </template>
        <template v-slot:[`body.quantidade`]="{ item }">
          <div class="flex gap-1 items-center" v-if="setor_id === item.id">
            <AppFormInput id="" type="number" placeholder="Quantidade" v-model="quantidade"/>
            <div class="">
              <BotaoPadrao icone @clique="atualizarPrevisto()">
                <img src="@/assets/icons/save-b.svg" alt="" class="w-6 h-6">
              </BotaoPadrao>
            </div>

            <div>
            <BotaoPadrao icone @clique="setor_id = null">
              <img src="@/assets/icons/close-b.svg" alt="" class="w-6 h-6">
            </BotaoPadrao>
            </div>
          </div>
          <div v-else class="flex gap-1 items-center justify-end">
            <span class="text-xl ">{{ item.PraChip.length > 0 ? item.PraChip[0].quantidade : " "}}</span>
            <BotaoPadrao icone @clique="setor_id = item.id">
              <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
            </BotaoPadrao>
          </div>
        </template>
      </TabelaPadrao>
    </div>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";

export default {
  name: 'PRA',
  components: { AppAlerta, BotaoPadrao, AppFormInput, TabelaPadrao, CabecalhoPagina },
  data() {
    return {
      cabecalho: [
        { nome: "Setor", valor: "nome" },
        { nome: "Quantidade", valor: "quantidade", largura:
            'w-[270px]' },
      ],
      dados: [],
      setor_id: null,
      quantidade:null,
      mostrarAlerta: false,
      textoAlerta:null,
    };
  },
  mounted(){
    this.buscarSetores();
  },
  methods:{
    async buscarSetores(){
      let resp = await this.$axios.$get("/ti/chip/configuracao/pra")

      if(!resp.falha){
        this.dados = resp.dados.setores
      }
    },
    async atualizarPrevisto(){
      let setor_id = this.setor_id
      let resp = await this.$axios.$post("/ti/chip/configuracao/pra/atualizar", { setor_id, quantidade: this.quantidade })

      if(!resp.falha){
        let { pra } = resp.dados

        let idx = this.dados.findIndex( o=> o.id === setor_id)

        if(idx >= 0){
          this.dados[idx]['PraChip'] = [pra]
          this.setor_id = null
          this.quantidade = null
          this.textoAlerta = 'Edição realizada com sucesso!'
          this.mostrarAlerta = true
        }
      }
    }
  },
  watch: {
    setor_id() {
      this.quantidade = null
    }
  }
};
</script>

<style scoped>

</style>
