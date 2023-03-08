<template>
  <BaseDialog
    :titulo="ss && ss.numero_acompanhamento ? 'Detalhes SS - ' + ss.numero_acompanhamento : ''  "
    @cancelar="cancelar()">
    <template v-slot:corpo>
      <div class="flex w-full overflow-auto print:overflow-visible px-2 " id="imprimir" style="">
        <div class="grid grid-cols-1 divide-y divide-gray-300 text-lg w-full" v-if="ss">
          <div class="bg-primaria-700 text-white p-2 text-lg hidden print:inline">
            <span>{{ ss && ss.numero_acompanhamento ? 'Detalhes SS - ' + ss.numero_acompanhamento : '' }}</span>
          </div>
          <span class="pb-1 pl-1"><strong>Data de emissão: </strong>{{ $dayjs(ss.data_emissao).format("DD/MM/YYYY")}}</span>
          <span class="py-1 pl-1"><strong>Data de necessidade: </strong>{{ $dayjs(ss.data_necessidade).format("DD/MM/YYYY")}}</span>
          <span class="py-1 pl-1"><strong>Centro de custo: </strong>{{ ss.CentroCustoPEP ? ss.CentroCustoPEP.numero_pep + ' - ' + ss.CentroCustoPEP.descricao: "" }}</span>
          <span class="py-1 pl-1"><strong>Ordem de serviço: </strong>{{ ss.ordem_servico }}</span>
          <span class="py-1 pl-1"><strong>Natureza da operação: </strong>{{ ss.natureza_operacao }}</span>
          <span class="py-1 pl-1"><strong>Tipo de solicitação: </strong>{{ ss.tipo_solicitacao }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>1 - Prazo de execução do serviço</strong></span>
          <div class="py-1 px-1 justify-between flex">
            <span><strong>Ínicio: </strong>{{ $dayjs(ss.data_inicio).format("DD/MM/YYYY") }}</span>
            <span><strong>Término: </strong>{{ $dayjs(ss.data_fim).format("DD/MM/YYYY") }}</span>
            <span><strong>Prazo total: </strong>{{ $dayjs(ss.data_fim).diff(ss.data_inicio, "day") }} dias</span>
          </div>
          <span class="py-1 pl-1 bg-gray-300"><strong>2 - Escopo do serviço</strong></span>
          <span class="py-1 pl-1">{{ ss.EscopoSS.codigo_tarifa_fiscal }} - {{ ss.EscopoSS.numero_servico}} - {{ ss.EscopoSS.denominacao }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>3 - Abragência do escopo</strong></span>
          <span class="py-1 pl-1">{{ ss.abrangencia_escopo }}</span>
          <span class="py-1 pl-1  bg-gray-300"><strong>4 - Local da prestação de Serviço:</strong></span>
          <span class="py-1 pl-1">{{ ss.local_prestacao_obra === "obra" ? "Canteiro de Obra" : ss.endereco_prestacao }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>5 - Fornecedores</strong></span>
          <div v-for="fornecedor in ss.FornecedorSSes" :key="fornecedor.id" class="py-1 pl-2 flex flex-col">
            <span><strong>Fornecedor: </strong> {{ fornecedor.nome }}</span>
            <span><strong>E-mail: </strong>{{ fornecedor.email }}</span>
            <span><strong>Pessoa de contato: </strong>{{ fornecedor.pessoa_contato }}</span>
            <span><strong>Telefone: </strong>{{ fornecedor.telefone }}</span>
          </div>
          <span class="py-1 pl-1 bg-gray-300"><strong>6 - Particularidades relativas aos serviços</strong></span>
          <span class="py-1 pl-1"><strong>Atestação da empresa: </strong>{{ ss.atestacao_empresa }}</span>
          <span class="py-1 pl-1"><strong>Currículo dos colabores: </strong>{{ ss.curriculo_colaboradores }}</span>
          <span class="py-1 pl-1"><strong>Certificações, licenças ou alvarás exigidos:</strong>{{ ss.certificacaoes_licencas }}</span>
          <span class="py-1 pl-1"><strong>Outros: </strong>{{ ss.outros }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>7 - Matriz de responsabilidade</strong></span>
          <div class="py-1 pl-1 grid grid-cols-2 divide-y divide-gray-300">
            <span class="py-1 pl-1"><strong>Alojamento: </strong>{{ ss.MatrizResponsabilidadeSS.alojamento == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.alojamento) }}</span>
            <span class="py-1 pl-1 !border-t-0"><strong>Alimentação Interna: </strong>{{ ss.MatrizResponsabilidadeSS.alimentacao_interna == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.alimentacao_interna) }}</span>
            <span class="py-1 pl-1"><strong>Alimentação Externa: </strong>
              {{
                ss.MatrizResponsabilidadeSS.alimentacao_externa == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.alimentacao_externa)
              }}
            </span>
            <span class="py-1 pl-1"><strong>Transporte/Vale Transporte: </strong>{{ ss.MatrizResponsabilidadeSS.transporte == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.transporte) }}</span>
            <span class="py-1 pl-1"><strong>Cesta Básica: </strong>{{ ss.MatrizResponsabilidadeSS.cesta_basica == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.cesta_basica) }}</span>
            <span class="py-1 pl-1"><strong>Plano Odontológico: </strong>{{ ss.MatrizResponsabilidadeSS.plano_odontologico == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.plano_odontologico) }}</span>
            <span class="py-1 pl-1"><strong>EPI's: </strong>{{ ss.MatrizResponsabilidadeSS.epi == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.epi) }}</span>
            <span class="py-1 pl-1"><strong>EPC's: </strong>{{ ss.MatrizResponsabilidadeSS.epc == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.epc) }}</span>
            <span class="py-1 pl-1"><strong>Despesas de Viagens: </strong>{{ ss.MatrizResponsabilidadeSS.despesas_viagem == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.despesas_viagem) }}</span>
            <span class="py-1 pl-1"><strong>Banheiro Químico e Bebedouro: </strong>{{ ss.MatrizResponsabilidadeSS.banheiro_bebedouro == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.banheiro_bebedouro) }}</span>
            <span class="py-1 pl-1"><strong>Vestiários:</strong>{{ ss.MatrizResponsabilidadeSS.vestiario == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.vestiario) }}</span>
            <span class="py-1 pl-1"><strong>Energia: </strong>{{ ss.MatrizResponsabilidadeSS.energia == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.energia) }}</span>
            <span class="py-1 pl-1"><strong>Água: </strong>{{ ss.MatrizResponsabilidadeSS.agua == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.agua) }}</span>
            <span class="py-1 pl-1"><strong>Exames Adminissionais: </strong>{{
                ss.MatrizResponsabilidadeSS.exames_admissionais == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.exames_admissionais)
              }}</span>
            <span class="py-1 pl-1"><strong>Crachá e Uniforme: </strong>{{ ss.MatrizResponsabilidadeSS.cracha_uniforme == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.cracha_uniforme) }}</span>
            <span class="py-1 pl-1"><strong>Guindastes: </strong>{{ ss.MatrizResponsabilidadeSS.guindaste == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.guindaste) }}</span>
            <span class="py-1 pl-1"><strong>Andaime: </strong>{{ ss.MatrizResponsabilidadeSS.andaime == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.andaime) }}</span>
            <span class="py-1 pl-1"><strong>Equip. de Pequeno Porte: </strong>{{ ss.MatrizResponsabilidadeSS.equip_pequeno_porte == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.equip_pequeno_porte) }}</span>
            <span class="py-1 pl-1"><strong>Escritório: </strong>{{ ss.MatrizResponsabilidadeSS.escritorio == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.escritorio) }}</span>
            <span class="py-1 pl-1"><strong>Mobiliário: </strong>{{ ss.MatrizResponsabilidadeSS.mobiliario == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.mobiliario) }}</span>
            <span class="py-1 pl-1"><strong>Seguro: </strong>{{ ss.MatrizResponsabilidadeSS.seguro == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.seguro) }}</span>
            <span class="py-1 pl-1"><strong>Garantias: </strong>{{ ss.MatrizResponsabilidadeSS.garantias == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.garantias) }}</span>
            <span class="py-1 pl-1"><strong>Veículos: </strong>{{ ss.MatrizResponsabilidadeSS.veiculos == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.veiculos) }}</span>
            <span class="py-1 pl-1"><strong>Tributos: </strong>{{ ss.MatrizResponsabilidadeSS.tributos == "na" ? "N/A" : primeiraMaiuscula(ss.MatrizResponsabilidadeSS.tributos) }}</span>
          </div>
          <span class="py-1 pl-1 bg-gray-300"><strong>8 - Condição de trabalho</strong></span>
          <span class="py-1 pl-1"><strong>Jornada de trabalho: </strong>{{ ss.jornada_trabalho }}</span>
          <span class="py-1 pl-1"><strong>Permitidos trabalho noturno ?: </strong>{{ ss.permitido_trabalho_noturno ? "Sim" : "Não" }}</span>
          <span class="py-1 pl-1"><strong>Permitido trabalho em horário extraordinário (hora extra) ?: </strong>{{ ss.permitido_hora_extra ? "Sim" : "Não" }}</span>
          <span class="py-1 pl-1"><strong>Permitido trabalho ano sábados, domingos e/ou feriados?: </strong>{{ ss.permitido_sabado_feriado ? "Sim" : "Não"  }}</span>
          <span class="py-1 pl-1"><strong>Observação: </strong>{{ ss.observacoes_condicao }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>9 - Requisitos de acesso a obra</strong></span>
          <span class="py-1 pl-1"><strong>Exames necessários: </strong>{{ ss.exames_necessarios }}</span>
          <span class="py-1 pl-1"><strong>Prazo para integração:</strong>{{ ss.prazo_integracao }}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>10 - Anexos</strong></span>
          <span class="py-1 pl-1"><strong>Anexo I: </strong>{{ ss.anexo_i}}</span>
          <span class="py-1 pl-1"><strong>Anexo II: </strong>{{ ss.anexo_ii}}</span>
          <span class="py-1 pl-1"><strong>Anexo III: </strong>{{ ss.anexo_iii}}</span>
          <span class="py-1 pl-1"><strong>Anexo IV: </strong>{{ ss.anexo_iv}}</span>
          <span class="py-1 pl-1"><strong>Anexo V: </strong>{{ ss.anexo_v}}</span>
          <span class="py-1 pl-1 bg-gray-300"><strong>Observações</strong></span>
          <span class="py-1 pl-1">{{ ss.observacoes_geral }}</span>
          <div>
            <span><strong>Aprovadores</strong></span>
            <div>
              <span><strong>Controle: </strong></span>
            </div>
            <div>
              <span><strong>Gestor da Área: </strong></span>
            </div>
            <div>
              <span><strong>Site Manager: </strong></span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center">
        <BotaoPadrao texto="Gerar PDF" @click="imprimir()">
<!--          Mudar icone -->
          <img src="@/assets/icons/printer-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </div>
    </template>
  </BaseDialog>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import { primeiraMaiuscula } from "~/mixins/ferramentasString";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

export default {
  mixins: [primeiraMaiuscula],
  name: "DialogDetalhesSS",
  components: {
    BaseDialog,
    BotaoPadrao
  },
  props:{
    ss_id:{
      type: [String, Number],
    }
  },
  data(){
    return{
      ss: null
    }
  },
  async mounted (){
    await this.buscarSS()
  },
  methods:{
    cancelar(){
      this.$emit("cancelar")
    },
    async buscarSS(){
      let id = this.ss_id
      let resp = await this.$axios.$get(`/suprimentos/ss/${id}`)

      if(!resp.falha){
          this.ss = resp.dados.ss
      }

      console.log(resp)
    },
    async imprimir(){
      window.print()
      // html2pdf(document.getElementById("imprimir"), {
      //   margin: 1,
      //   filename: "i-was-html.pdf",
      // }).set({height: 1000}).from('canvas')
      // this.$refs.html2Pdf.generatePdf()
    }
  }
}
</script>

<style scoped>
#imprimir{
  max-height: calc(80vh);
}

@media print{
  #imprimir {
    max-height: 100vh;
  }
}
</style>
