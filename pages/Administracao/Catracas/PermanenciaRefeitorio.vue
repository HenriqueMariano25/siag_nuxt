<template>
  <div class="w-full print:!-ml-0.5">
    <CabecalhoPagina titulo="Permanência no Refeitório" />
    <div class="flex flex-col w-full !mt-11 gap-2">
      <div class="flex gap-2 bg-white p-1 border border-gray-600 w-full justify-end">
        <AppFormSelect id="setor" :options="periodos" label="Período" v-model="busca.periodo" />
        <AppFormInput id="" type="date" label="Data inicial" v-model="busca.data_inicial"></AppFormInput>
        <AppFormInput id="" type="date" label="Data final" v-model="busca.data_final"></AppFormInput>
        <div class="flex items-end">
          <BotaoPadrao texto="buscar" cor="bg-blue-400 hover:!bg-blue-500" @clique="buscarCatraca()" :disabled="podeBuscar">
            <img src="@/assets/icons/magnifier-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>

      </div>
      <div>
        <TabelaPadrao
          :cabecalho="cabecalho"
          :dados="dados"
          :totalItens="dados.length"
          altura="calc(100vh - 190px)"
          :tem-rodape="false"
          @atualizar="buscarCatraca"
          :carregando="carregando"
          :temDetalhes="false">
          <template v-slot:[`body.permanencia`]="{ item }">
            <span>{{ item.permanencia ? item.permanencia + " minutos" : "" }}</span>
          </template>
        </TabelaPadrao>
      </div>
    </div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-start w-full">
          <div class="flex">
            <BotaoPadrao
              :disabled="!buscou"
              class="flex"
              @clique="gerarExcel()"
              texto="Gerar excel">
              <img
                src="@/assets/icons/excel-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
          </div>
        </div>
      </template>
    </RodapePagina>
  </div>
</template>

<script>
import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import gerarExcel from "~/functions/gerarExcel";

export default {
  name: 'PermanenciaRefeitorio',
  components: { RodapePagina, BotaoPadrao, TabelaPadrao, AppFormSelect, AppFormInput, CabecalhoPagina },
  data() {
    return {
      periodos: [
        { id: "cafe", nome: "Café da manhã"},
        { id: "almoco", nome: "Almoço"},
        { id: "lanche_tarde", nome: "Lanche da Tarde"},
        { id: "janta", nome: "Janta"},
      ],
      busca:{
        data_inicial: null,
        data_final: null,
        periodo: null,
      },
      dados: [],
      cabecalho: [
        { nome: "Matrícula", valor: "matricula" },
        { nome: "Nome", valor: "nome" },
        { nome: "Cargo", valor: "cargo" },
        { nome: "Setor", valor: "setor" },
        { nome: "Permanencia", valor: "permanencia" },
      ],
      carregando: false,
      periodoBuscado: null,
      buscou: false
    };
  },
  computed:{
    podeBuscar(){
      return Object.values(this.busca).includes(null) || Object.values(this.busca).includes("") || this.carregando
    }
  },
  methods: {
    async buscarCatraca() {
      this.buscou = false
      this.carregando = true
      this.periodoBuscado = this.busca.periodo
      let resp =await this.$axios.$get('/catraca/permanencia_refeitorio/novo_padrao', { params: { ...this.busca }})

      if(!resp.falha){
        this.dados = resp.dados.funcionarios
        this.carregando = false
        this.buscou = true
      }
    },
    async gerarExcel(){
      let dados = this.dados

      let cabecalho = [
        "Matrícula",
        "Nome",
        "Cargo",
        "Setor",
        "Permanencia",
      ]


      let nomeArquivo

      if(this.periodoBuscado === 'cafe')
        nomeArquivo = 'permanencia_cafe_manha'
      else if(this.periodoBuscado === 'almoco')
        nomeArquivo = 'permanencia_almoço'
      else if (this.periodoBuscado === 'lanche_tarde')
        nomeArquivo = 'permanencia_lanche_tarde'
      else if (this.periodoBuscado === 'janta')
        nomeArquivo = 'permanencia_janta'


      let itens = []
      for (let item of dados) {
        let temp = []
        temp.push(item.matricula ? item.matricula : "")
        temp.push(item.nome ? item.nome : "")
        temp.push(item.cargo ? item.cargo : "")
        temp.push(item.setor ? item.setor : "")
        temp.push(item.permanencia ? item.permanencia : "")
        itens.push(temp)
      }

      gerarExcel(cabecalho, itens, nomeArquivo)
    }
  }
};
</script>

<style scoped>

</style>
