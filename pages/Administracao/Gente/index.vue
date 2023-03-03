<template>
  <div>
    <div class="bg-gray-300 p-2 flex ">
      <AppFormFile label="Importar Excel" id="excel" @change="arquivo = $event"/>
      <BotaoPadrao texto="Gerar Excel" class="flex border border-gray-400 ml-3" @click="gerarExcel()"/>
    </div>
  </div>
</template>

<script>
import AppFormFile from "~/components/Ui/Form/AppFormFile.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import {Workbook} from "exceljs";
import dayjs from "dayjs";
import * as fs from "file-saver";
export default {
  name: "index",
  components: {
    AppFormFile,
    BotaoPadrao
  },
  data(){
    return{
      arquivo: null
    }
  },
  methods: {
    async gerarExcel(){
      const config = {headers: {"Content-Type": "multipart/form-data"}}
      let formData = new FormData()
      formData.append(`files`, this.arquivo)

      try {
        let resp = await this.$axios.$post("/gente/extrato_perquisa_clima", formData, config)

        if(!resp.falha){
          let dados = resp.dados.dados

          let workbook = new Workbook();
          let fname = "Teste";
          let worksheet

          for(let ano of Object.keys(dados)){
            worksheet = workbook.addWorksheet(ano, {
              views: [{state: "frozen", ySplit: 1}],
            });

            let cont = 1
            let values = [""]
            let valGeral = ["Geral"]
            let valSpBh = ["SP/BH"]
            let valMod = ["Mão de Obra Direta"]
            let valMoi = ["Mão Obra Indireta"]
            let setores = {}

            for(let gr of Object.keys(dados[ano])){
              let media = 0
              let mediaSpBh = 0
              let mediaMod = 0
              let mediaMoi = 0

              for(let per of Object.keys(dados[ano][gr])){
                let positivo = dados[ano][gr][per]['positivo']
                let negativo = dados[ano][gr][per]['negativo']
                let geral = dados[ano][gr][per]['geral']

                let spBhPos = dados[ano][gr][per]['local']['spBh']['positivo']
                let spBhNeg = dados[ano][gr][per]['local']['spBh']['negativo']
                let spBhGer = dados[ano][gr][per]['local']['spBh']['geral']

                let modPos = dados[ano][gr][per]['local']['mod']['positivo']
                let modNog = dados[ano][gr][per]['local']['mod']['negativo']
                let modGer = dados[ano][gr][per]['local']['mod']['geral']

                let moiPos = dados[ano][gr][per]['local']['moi']['positivo']
                let moiNeg = dados[ano][gr][per]['local']['moi']['negativo']
                let moiGer = dados[ano][gr][per]['local']['moi']['geral']

                values[cont] = per
                valGeral[cont] = ((((positivo * 100) / geral) - (negativo * 100) / geral)).toFixed(0) + '%'
                media += parseFloat(((positivo * 100) / geral) - (negativo * 100) / geral)

                valSpBh[cont] = ((((spBhPos * 100) / spBhGer) - (spBhNeg * 100) / spBhGer)).toFixed(0) + '%'
                mediaSpBh += parseFloat(((spBhPos * 100) / spBhGer) - (spBhNeg * 100) / spBhGer)

                valMod[cont] = ((((modPos * 100) / modGer) - (modNog * 100) / modGer)).toFixed(0) + '%'
                mediaMod += parseFloat(((modPos * 100) / modGer) - (modNog * 100) / modGer)

                valMoi[cont] = ((((moiPos * 100) / moiGer) - (moiNeg * 100) / moiGer)).toFixed(0) + '%'
                mediaMoi += parseFloat(((moiPos * 100) / moiGer) - (moiNeg * 100) / moiGer)


                for(let set of Object.keys(dados[ano][gr][per]['setores'])){
                  if(Object.keys(setores).includes(set) === false){
                   setores[set] = [set]
                  }

                  let setPos = dados[ano][gr][per]['setores'][set]['positivo']
                  let setNeg = dados[ano][gr][per]['setores'][set]['negativo']
                  let setGeral = dados[ano][gr][per]['setores'][set]['geral']

                  setores[set][cont] = ((((setPos * 100) / setGeral) - (setNeg * 100) / setGeral)).toFixed(0) + '%'
                }

                cont++
              }
              valGeral[cont] = (media/Object.keys(dados[ano][gr]).length).toFixed(0) + '%'
              valSpBh[cont] = (mediaSpBh/Object.keys(dados[ano][gr]).length).toFixed(0) + '%'
              valMod[cont] = (mediaMod/Object.keys(dados[ano][gr]).length).toFixed(0) + '%'
              valMoi[cont] = (mediaMoi/Object.keys(dados[ano][gr]).length).toFixed(0) + '%'

              cont++
              cont++
            }

            worksheet.addRow(values);
            worksheet.addRow(valGeral);
            worksheet.addRow(valSpBh);
            worksheet.addRow(valMod);
            worksheet.addRow(valMoi);
            worksheet.addRow([""]);


            let nomeSetores = Object.keys(setores)

            for(let z = 0; z <= nomeSetores.length - 1; z++){
                worksheet.addRow( setores[nomeSetores[z]]);
            }
          }

          //Descomentar para criar arquivo
          workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            fs.saveAs(
              blob,
              fname + "-" + dayjs().format("DD_MM_YYYY") + ".xlsx"
            );
          });
        }

      }catch (e) {
        console.log(e)
      }
    }
  },
}
</script>

<style scoped>

</style>
