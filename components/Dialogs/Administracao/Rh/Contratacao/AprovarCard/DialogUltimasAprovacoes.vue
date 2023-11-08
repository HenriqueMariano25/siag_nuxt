<template>
  <div>
    <BaseDialog
    titulo="ÚLTIMAS APROVAÇÕES"
    largura="w-10/12"
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex px-2 w-full">
        <TabelaPadrao
          :cabecalho="cabecalho"
          :dados="aprovacoes"
          altura="calc(100vh - 220px)"
          :tem-rodape="false"
          @atualizar="buscarAprovacoes()">
          <template v-slot:[`body.acao`]="{ item }">
            <AppTooltip alinhamento="direita">
              <template v-slot:corpo>
                <div class="flex ">
                  <BotaoPadrao icone @clique="voltarAprovacao(item.id)">
                    <img src="@/assets/icons/back-b.svg" alt="" class="w-6 h-6">
                  </BotaoPadrao>
                </div>
              </template>
              <template v-slot:tooltip>
                <div class="min-w-[300px] max-w-full">
                  Voltar aprovação
                </div>
              </template>
            </AppTooltip>
          </template>
          <template v-slot:[`body.id`]="{ item }">
            <span class="whitespace-nowrap">{{ ("000000" + item.id).slice(-6) }}</span>
          </template>
          <template v-slot:[`body.Setor.nome`]="{ item }">
            <span class="whitespace-nowrap" v-if="item.Setor">{{ item.Setor.nome }}</span>
          </template>
          <template v-slot:[`body.FuncaoCard.descricao`]="{ item }">
            <span class="whitespace-nowrap" v-if="item.FuncaoCard">{{ item.FuncaoCard.descricao }}</span>
          </template>
          <template v-slot:[`body.aprovado_em`]="{ item }">
            <span class="whitespace-nowrap" v-if="item.data_aprovacao_controle">{{ $dayjs(item.data_aprovacao_controle).format("DD/MM/YYYY HH:mm:ss") }}</span>
          </template>
          <template v-slot:[`body.Etapa.nome`]="{ item }">
            <span class="whitespace-nowrap" v-if="item.Etapa">{{ item.Etapa.nome }}</span>
          </template>
        </TabelaPadrao>
      </div>
    </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppTooltip from "~/components/Ui/AppTooltip.vue";

export default {
  name: "DialogUltimasAprovacoes",
  components: {
    AppTooltip,
    BotaoPadrao,
    TabelaPadrao,
    BaseDialog
  },
  props: {
    tipoAprovacao: {
      type: [String],
    }
  },
  data() {
    return {
      aprovacoes: [],
      cabecalho: [
        { nome: "", valor: "acao", largura: 'w-10'},
        { nome: "COD.", valor: "id"},
        { nome: "Setor", valor: "Setor.nome"},
        { nome: "Função", valor: "FuncaoCard.descricao" },
        { nome: "Aprovado em", valor: "aprovado_em" },
        { nome: "Etapa", valor: "Etapa.nome" },
      ]
    };
  },
  mounted() {
    this.buscarAprovacoes();
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async buscarAprovacoes(){
      let ordem
      let usuario_id = this.$auth.user.id

      if(this.tipoAprovacao === 'controle'){
        ordem = 2
      }else if(this.tipoAprovacao === 'gestor_area' || this.tipoAprovacao === 'gestor_area_geral'){
        ordem = 3
      }
      let resp = await this.$axios.$get('/contratacao/card/aprovacao/ultimas_aprovacoes', { params: { usuario_id, ordem }})

      if(!resp.falha){
        this.aprovacoes = resp.dados.aprovacoes
      }
    },
    async voltarAprovacao(card_id){
      let usuario_id = this.$auth.user.id

      let resp = await this.$axios.$post("/contratacao/card/voltar_aprovacao", { card_id, usuario_id })

      if(!resp.falha){
        this.$emit("voltouAprovacao", card_id)
      }
    }
  }
};
</script>

<style scoped>

</style>
