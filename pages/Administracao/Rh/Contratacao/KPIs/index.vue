<template>
  <div class="flex flex-col w-full gap-1 ">
    <div class="bg-white p-1 flex items-center gap-2">
      <h1 class="text-xl font-bold">Duração de Card por etapa</h1>
      <BotaoPadrao texto="Excel" @clique="buscarKpiDuracao" cor="bg-blue-300 hover:!bg-blue-400">
        <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
      </BotaoPadrao>
    </div>
    <div class="bg-white p-1 flex items-center gap-2">
      <h1 class="text-xl font-bold">Quantitativo por motivo de desistencia</h1>
      <BotaoPadrao texto="Excel" @clique="buscarKpiAlteracao" cor="bg-blue-300 hover:!bg-blue-400">
        <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
      </BotaoPadrao>
    </div>
  </div>
</template>

<script>
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  name: "index",
  components: { BotaoPadrao },
  methods: {
    async buscarKpiDuracao() {
      let resp = await this.$axios.$get("/contratacao/kpi/duracao_card_etapa")

      let { etapas, cards } = resp.dados
      let cabecalho = [
        "Card",
      ]

      for(let et of etapas){
        cabecalho.push(Object.values(et)[0])
      }

      let nomeArquivo
      nomeArquivo = "kpi_media_duracao_etapa"

      let itens = []
      for (let item of cards) {
        let temp = []
        temp.push(item.id)
        for(let et of etapas){
          if(item.duracao[Object.keys(et)[0]] !== null && item.duracao[Object.keys(et)[0]] !== undefined){

            if (bject.keys(item.duracao[Object.keys(et)[0]]).includes("tempo")) {
              temp.push(item.duracao[Object.keys(et)[0]].tempo)
            }else{
              temp.push("")
            }
          }else{
            temp.push("")
          }
        }
        itens.push(temp)
      }
      let etapaMedia = []
      etapaMedia.push("Média")
      for(let etapa of etapas){
        etapaMedia.push(etapa.media)
      }
      itens.push(etapaMedia)

      gerarExcel(cabecalho, itens, nomeArquivo)
    },

    async buscarKpiAlteracao() {
      let resp = await this.$axios.$get("/contratacao/kpi/motivo_mudanca_candidato")

      let { motivos } = resp.dados

     let cabecalho = ['Motivo', "Quantidade"]

      let nomeArquivo
      nomeArquivo = "kpi_motivos_desistencia"

      let itens = []
      for (let item of motivos) {
        let temp = []
        temp.push(item.descricao)
        temp.push(item.quantidadeAlterada)

        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    }
  }
};
</script>

<style scoped>

</style>
