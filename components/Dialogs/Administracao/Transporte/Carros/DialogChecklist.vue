<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="CHECKLIST"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="px-2 py-1 bg-slate-300 w-full text-lg justify-between flex border-y-2 border-slate-600">
					<span v-if="carro">CGA: {{ carro.cga }}</span>
					<span v-if="carro">Placa: {{ carro.placa }}</span>
					<span v-if="carro">Marca/Modelo: {{ carro.marca_modelo }}</span>
				</div>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.diario`]="{ item }">
						<div class="flex flex-col gap-2 p-2 border border-gray-400 bg-gray-200 mx-1" v-if="!mostrarFechamento">
              <div class="bg-gray-800 -m-2 px-2 text-white text-lg mb-0">
                <span>ABERTURA</span>
              </div>
							<div class="grid grid-cols-3 gap-2">
								<AppFormInput
									label="Data de abertura"
									type="date"
									obrigatorio
									id="data_abertura"
									v-model="checklist.data_abertura" />
								<AppFormInput
									label="KM inicial"
									type="number"
									obrigatorio
									id="km_inicial"
									placeholder="Ex: 123456"
									v-model="checklist.km_inicial" />
								<div class="flex gap-2 items-center">
									<span class="ml-2">Gasolina</span>
									<input
										type="range"
										id="gasolina"
										class="w-full"
										min="0"
										max="80"
										step="20"
										v-model="checklist.gasolina" />
									<div
										class="w-[150px] text-center rounded border px-2"
										:class="[corGasolina]">
										<span>{{ descricaoGasolina }}</span>
									</div>
								</div>
								<div class="col-span-3">
									<div class="bg-gray-400 w-full px-2 mb-1 text-lg">
										<span>AVARIAS</span>
									</div>
									<div class="grid grid-cols-5 gap-2">
										<div class="flex flex-col border-2 border-slate-600">
											<div class="h-[160px] bg-white flex items-center w-full justify-center">
												<img
													src="@/assets/img/carro-frente.png"
													alt="" />
											</div>
											<span class="bg-primaria-900 text-white text-center">FRENTE</span>
											<textarea
												placeholder="Observação FRENTE"
												class="px-1"></textarea>
										</div>
										<div class="flex flex-col border-2 border-slate-600">
											<div class="h-[160px] bg-white flex items-center w-full justify-center">
												<img
													src="@/assets/img/carro-traseira.png"
													alt="" />
											</div>
											<span class="bg-primaria-900 text-white text-center">TRASEIRA</span>
											<textarea
												placeholder="Observação TRASEIRA"
												class="px-1"></textarea>
										</div>
										<div class="flex flex-col border-2 border-slate-600">
											<div class="h-[160px] bg-white flex items-center w-full justify-center">
												<img
													src="@/assets/img/carro-lateral-e.png"
													alt="" />
											</div>
											<span class="bg-primaria-900 text-white text-center">LATERAL ESQUERDA</span>
											<textarea
												placeholder="Observação LATERAL ESQUERDA"
												class="px-1"></textarea>
										</div>
										<div class="flex flex-col border-2 border-slate-600">
											<div class="h-[160px] bg-white flex items-center w-full justify-center">
												<img
													src="@/assets/img/carro-lateral-d.png"
													alt="" />
											</div>
											<span class="bg-primaria-900 text-white text-center">LATERAL DIREITA</span>
											<textarea
												placeholder="Observação LATERAL DIREITA"
												class="px-1"></textarea>
										</div>
										<div class="flex flex-col border-2 border-slate-600">
											<div class="h-[160px] bg-white flex items-center w-full justify-center">
												<img
													src="@/assets/img/carro-topo.png"
													alt="" />
											</div>
											<span class="bg-primaria-900 text-white text-center">TETO</span>
											<textarea
												placeholder="Observação TETO"
												class="px-1"></textarea>
										</div>
									</div>
								</div>
                <div class="col-span-3">
                  <AppFormTextarea id="observacao geral" label="Observação Geral" placeholder="Observação" linhas="2" />
                </div>
							</div>
						</div>
            <div class="flex flex-col gap-2 p-2 border border-gray-400 bg-gray-200 mx-1" v-if="mostrarFechamento">
              <div class="bg-gray-800 -m-2 px-2 text-white text-lg mb-0">
                <span>FECHAMENTO</span>
              </div>
              <AppFormInput
                label="KM final"
                type="text"
                placeholder="Ex: 321654"
                obrigatorio
                id="km_final"
                v-model="checklist.km_final" />
              <AppFormTextarea id="observacao_fechamento" label="Observação de fechamento" placeholder="Observação" />
            </div>
					</template>
          <template v-slot:[`tab.historico`]>
            <div>

            </div>
          </template>
				</AppTabs>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="cadastrarCheckList()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>o
		</BaseDialog>
	</div>
</template>

<script setup>
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		components: {
			BaseDialog,
		},
		props: {
			carro: {
				type: [Object],
			},
		},
		data() {
			return {
				tabs: [
					{ nome: "Diário", valor: "diario" },
					{
						nome: "Histórico",
						valor: "historcio",
					},
				],
				checklist: {
					data_abertura: null,
					data_fechamento: null,
					cga: null,
					placa: null,
					km_inicial: null,
					km_final: null,
					gasolina: "40",
				},
        mostrarFechamento: false,
        cabecalho: [
          { nome: "Data", valor: "data" },
          { nome: "Data", valor: "data" },
          { nome: "Data", valor: "data" },
        ]
			}
		},
		mounted() {
			if (!this.checklist.data_abertura) {
				this.checklist.data_abertura = this.$dayjs().format("YYYY-MM-DD")
			}
		},
		computed: {
			descricaoGasolina() {
				if (this.checklist.gasolina === "0") {
					return "VAZIO"
				} else if (this.checklist.gasolina === "20") {
					return "1/4"
				} else if (this.checklist.gasolina === "40") {
					return "2/4"
				} else if (this.checklist.gasolina === "60") {
					return "3/4"
				} else if (this.checklist.gasolina === "80") {
					return "CHEIO"
				}
			},
			corGasolina() {
				if (this.checklist.gasolina === "0") {
					return "bg-red-400 border-red-500"
				} else if (this.checklist.gasolina === "20") {
					return "bg-orange-400 border-orange-500"
				} else if (this.checklist.gasolina === "40") {
					return "bg-amber-300 border-amber-400"
				} else if (this.checklist.gasolina === "60") {
					return "bg-green-300 border-green-400"
				} else if (this.checklist.gasolina === "80") {
					return "bg-lime-400 border-lime-500"
				}
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

      async cadastrarCheckList(){
        this.mostrarFechamento = true
      }
		},
	}
</script>

<style scoped></style>
