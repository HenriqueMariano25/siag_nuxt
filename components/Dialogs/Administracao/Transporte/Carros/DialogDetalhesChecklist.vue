<template>
	<BaseDialog
		:titulo="checklist ? 'Detalhes Checklist' : ''"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div
				class="flex w-full overflow-auto print:overflow-visible px-2 "
				id="imprimir"
				style="">
				<div
					class="grid grid-cols-1 divide-y divide-gray-300 text-lg w-full"
					v-if="checklist">
          <div class=" print:flex w-full items-center hidden">
            <img src="@/assets/img/logoagcnovo.png" alt="" class="">
            <div class="font-bold text-center text-4xl text-[#00152D] flex w-full justify-center">
              <span>SIAG</span>
            </div>
          </div>
          <div class="print:flex w-full text-center text-xl bg-gray-300 mb-2 justify-center uppercase hidden border-2 border-green-500">
            <span><strong>Detalhes do checklist</strong></span>
          </div>
          <span class="py-1 pl-1 bg-gray-300"><strong>Abertura</strong></span>
					<span class="pb-1 pl-1">
						<strong>Data de abertura: </strong>{{ checklist.data_abertura ? $dayjs(checklist.data_abertura).format("DD/MM/YYYY HH:mm:ss") : ""}}
					</span>
          <span class="pb-1 pl-1">
            <strong>KM inicial: </strong>{{ checklist.km_inicial }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Gasolina: </strong>{{ gasolina }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Frente: </strong>{{ checklist.observacao_frente }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Traseira: </strong>{{ checklist.observacao_traseira }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Lateral Esquerda: </strong>{{ checklist.observacao_lateral_esquerda }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Lateral Direira: </strong>{{ checklist.observacao_lateral_direita }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Teto: </strong>{{ checklist.observacao_teto }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Geral: </strong>{{ checklist.observacao_geral }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Aberto por: </strong>{{ checklist.AbertoPor ? checklist.AbertoPor.nome : "" }}
          </span>
          <span class="py-1 pl-1 bg-gray-300"><strong>Fechamento</strong></span>
          <span class="pb-1 pl-1">
						<strong>Data de fechamento: </strong>{{ checklist.data_fechamento ? $dayjs(checklist.data_fechamento).format("DD/MM/YYYY HH:mm:ss") : "" }}
					</span>
          <span class="pb-1 pl-1">
            <strong>KM final: </strong>{{ checklist.km_final }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Observação Fechamento: </strong>{{ checklist.observacao_fechamento }}
          </span>
          <span class="pb-1 pl-1">
            <strong>Fechado por: </strong>{{ checklist.FechadoPor ? checklist.FechadoPor.nome : "" }}
          </span>
				</div>

			</div>
		</template>
    <template v-slot:rodape-btn-direito>
      <div class="flex items-center ">
        <BotaoPadrao
          texto="Gerar PDF"
          @clique="imprimir()">
          <img
            src="@/assets/icons/printer-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </div>
    </template>
	</BaseDialog>
</template>

<script>
	export default {
		props: {
			checklist_id: {
				type: [Number],
			},
		},
    data() {
      return {
        checklist: {}
      };
    },
    async mounted() {
      if(this.checklist_id){

        await this.buscarChecklist()
      }
    },
    computed: {
      gasolina() {
        let gasolina = this.checklist.gasolina
        if(gasolina === '0') return 'Vazio'
        if(gasolina === '20') return '1/4'
        if(gasolina === '40') return '2/4'
        if(gasolina === '60') return '3/4'
        if(gasolina === '80') return 'Cheio'
      }
    },
    methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      async buscarChecklist(){
        let id  = this.checklist_id
        let resp = await this.$axios.$get('/transporte/checklist/buscar/especifico', { params: { id }})

        if(!resp.falha){
          this.checklist = resp.dados.checklist
        }
      },
      async imprimir() {
        window.print()
      },
		},
	}
</script>

<style scoped>
	#imprimir {
		max-height: calc(80vh);
	}

	@media print {
		#imprimir {
			page-break-before: always;
		}

		#imprimir > * {
			page-break-inside: avoid;
		}
	}
</style>
<script setup>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>
