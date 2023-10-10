<template>
	<div>
		<BaseDialog
      class="print:hidden"
			largura="w-10/12"
			:carregando="carregando"
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
          class=""
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.diario`]="{ item }">
						<div class="max-h-[500px] overflow-y-auto">
							<div
								class="flex flex-col"
								v-if="!mostrarConcluido">
								<div class="bg-gray-800 px-2 text-white text-lg mx-1 justify-between">
									<div
										v-if="mostrarFechamento"
										:class="{ 'cursor-pointer': mostrarFechamento }"
										@click="formAberturaFechado = !formAberturaFechado"
										class="flex justify-between">
										<span>ABERTURA</span>
										<img
											src="@/assets/icons/down-chevron-w.svg"
											alt=""
											class="w-7 h-7"
											v-if="formAberturaFechado" />
										<img
											src="@/assets/icons/up-chevron-w.svg"
											alt=""
											class="w-7 h-7"
											v-if="!formAberturaFechado" />
									</div>
									<span v-else>ABERTURA</span>
								</div>
								<div :class="{ 'esconder-abertura': formAberturaFechado }">
									<div
										class="flex flex-col gap-2 p-2 border border-gray-400 bg-gray-200 mx-1"
										v-if="">

										<div class="grid grid-cols-3 gap-2">
											<AppFormInput
												label="Data de abertura"
												type="date"
												obrigatorio
                        readonly
                        disabled
												id="data_abertura"
												v-model="checklist.data_abertura" />
											<AppFormInput
												label="KM inicial"
												type="number"
												obrigatorio
												id="km_inicial"
												placeholder="Ex: 123456"
												:invalido="erros.includes('km_inicial')"
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
															v-model="checklist.observacao_frente"
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
															v-model="checklist.observacao_traseira"
															class="px-1"></textarea>
													</div>
													<div class="flex flex-col border-2 border-slate-600">
														<div class="h-[160px] bg-white flex items-center w-full justify-center">
															<img
																src="@/assets/img/carro-lateral-e.png"
																alt="" />
														</div>
														<span class="bg-primaria-900 text-white text-center"
															>LATERAL ESQUERDA</span
														>
														<textarea
															placeholder="Observação LATERAL ESQUERDA"
															v-model="checklist.observacao_lateral_esquerda"
															class="px-1"></textarea>
													</div>
													<div class="flex flex-col border-2 border-slate-600">
														<div class="h-[160px] bg-white flex items-center w-full justify-center">
															<img
																src="@/assets/img/carro-lateral-d.png"
																alt="" />
														</div>
														<span class="bg-primaria-900 text-white text-center"
															>LATERAL DIREITA</span
														>
														<textarea
															placeholder="Observação LATERAL DIREITA"
															v-model="checklist.observacao_lateral_direita"
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
															v-model="checklist.observacao_teto"
															placeholder="Observação TETO"
															class="px-1"></textarea>
													</div>
												</div>
											</div>
											<div class="col-span-3">
												<AppFormTextarea
													id="observacao geral"
													label="Observação Geral"
													v-model="checklist.observacao_geral"
													placeholder="Observação"
													linhas="2" />
											</div>
										</div>
										<div class="w-full justify-end flex" v-if="mostrarFechamento">
											<BotaoPadrao
                        @clique="atualizarChecklist"
												texto="Atualizar checklist"
												cor="bg-blue-400">
												<img
													src="@/assets/icons/edit-b.svg"
													alt=""
													class="w-6 h-6" />
											</BotaoPadrao>
										</div>
									</div>
								</div>

								<div
									class="flex flex-col gap-2 p-2 border border-gray-400 bg-gray-200 mx-1 mt-1"
									v-if="mostrarFechamento">
									<div class="bg-gray-800 -m-2 px-2 text-white text-lg mb-0">
										<span>FECHAMENTO</span>
									</div>
									<AppFormInput
										label="KM final"
										type="number"
										placeholder="Ex: 321654"
										obrigatorio
										id="km_final"
										v-model="checklist.km_final" />
									<AppFormTextarea
										id="observacao_fechamento"
										label="Observação de fechamento"
										placeholder="Observação" />
								</div>
							</div>
							<div v-if="mostrarConcluido">
                <div class="w-full bg-green-400 text-center my-1 py-1 text-xl">
                  CHECKLIST FINALIZADO
                </div>
                <div class="bg-gray-800 px-2 text-white text-lg mb-0 w-full">
                  <span>DADOS</span>
                </div>
                <div class="grid grid-cols-2 px-1 ">
                  <span>Data abertura: <strong>{{ $dayjs(checklist.data_abertura_completa).format("DD/MM/YYYY HH:mm:ss") }}</strong></span>
                  <span>Data fechamento: <strong>{{ $dayjs(checklist.data_fechamento).format("DD/MM/YYYY HH:mm:ss") }}</strong></span>
                  <span>KM inicial: <strong>{{ checklist.km_inicial }}</strong></span>
                  <span>KM final: <strong>{{ checklist.km_final }}</strong></span>
                  <span v-if="checklist.AbertoPor">Aberto por: <strong>{{ checklist.AbertoPor.nome}}</strong></span>
                  <span v-if="checklist.FechadoPor">Fechado por: <strong>{{ checklist.FechadoPor.nome}}</strong></span>
                  <span>Gasolina: <strong>{{ descricaoGasolina }}</strong></span>
                  <span>Observação Frente: <strong>{{ checklist.observacao_frente }}</strong></span>
                  <span>Observação Traseira: <strong>{{ checklist.observacao_traseira }}</strong></span>
                  <span>Observação Lateral Esquerda: <strong>{{ checklist.observacao_lateral_esquerda }}</strong></span>
                  <span>Observação Lateral Direita: <strong>{{ checklist.observacao_lateral_direita }}</strong></span>
                  <span>Observação Teto: <strong>{{ checklist.observacao_teto }}</strong></span>
                  <span>Observação Geral: <strong>{{ checklist.observacao_geral }}</strong></span>
                  <span>Observação Fechamento: <strong>{{ checklist.observacao_fechamento }}</strong></span>
                </div>
							</div>
						</div>
					</template>
					<template v-slot:[`tab.historico`]>
						<div>
              <TabelaPadrao
                :cabecalho="cabecalho"
                :dados="checklists"
                altura="calc(100vh - 219px)"
                :tem-rodape="false"
                @dblclick="verDetalhesChecklist"
                @atualizar="buscarTodosChecklists"
                :temDetalhes="false">
                <template v-slot:[`body.data_abertura`]="{ item }">
                  <span
                    class="whitespace-nowrap"
                    v-if="item.data_abertura">
                    {{ $dayjs(item.data_abertura).format("DD/MM/YYYY HH:mm:ss") }}
                  </span>
                        </template>
                <template v-slot:[`body.data_fechamento`]="{ item }">
                  <span
                    class="whitespace-nowrap"
                    v-if="item.data_fechamento">
                    {{ $dayjs(item.data_fechamento).format("DD/MM/YYYY HH:mm:ss") }}
                  </span>
                </template>
                <template v-slot:[`body.AbertoPor.nome`]="{ item }">
                  <span
                    class="whitespace-nowrap"
                    v-if="item.AbertoPor">
                    {{ item.AbertoPor.nome }}
                  </span>
                </template>
                <template v-slot:[`body.FechadoPor.nome`]="{ item }">
                  <span
                    class="whitespace-nowrap"
                    v-if="item.FechadoPor">
                    {{ item.FechadoPor.nome }}
                  </span>
                </template>
              </TabelaPadrao>
            </div>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					:texto="mostrarFechamento ? 'Finalizar' : 'salvar'"
					@clique="mostrarFechamento ? finalizarChecklist() : cadastrarCheckList()">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>

    <DialogDetalhesChecklist v-if="mostrarDialogDetalhesChecklist" @cancelar="mostrarDialogDetalhesChecklist = false" :checklist_id="checklistPrVisualizar"/>
	</div>
</template>

<script setup>
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
  import DialogDetalhesChecklist
    from "~/components/Dialogs/Administracao/Transporte/Carros/DialogDetalhesChecklist.vue";
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
						valor: "historico",
					},
				],
        tab: "diario",
				checklist: {
					data_abertura: null,
					data_fechamento: null,
					cga: null,
					placa: null,
					km_inicial: null,
					km_final: null,
					gasolina: "40",
					observacao_frente: null,
					observacao_traseira: null,
					observacao_lateral_esquerda: null,
					observacao_lateral_direita: null,
					observacao_teto: null,
					observacao_geral: null,
					observacao_fechamento: null,
				},
				mostrarFechamento: false,
				erros: [],
				carregando: false,
				formAberturaFechado: false,
				mostrarConcluido: false,
        mostrarAlerta: false,
        textoAlerta: null,

        //Historico
        cabecalho: [
          { nome: "Data abertura", valor: "data_abertura"},
          { nome: "Data fechamento", valor: "data_fechamento"},
          { nome: "Aberto por", valor: "AbertoPor.nome", filtro: true, ordenar: true },
          { nome: "Fechado por", valor: "FechadoPor.nome", filtro: true, ordenar: true },
          { nome: "Obs. Geral", valor: "observacao_geral"},
        ],
        checklists: [],
        mostrarDialogDetalhesChecklist: false,
        checklistPrVisualizar: null
			}
		},
		mounted() {
			if (!this.checklist.data_abertura) {
				this.checklist.data_abertura = this.$dayjs().format("YYYY-MM-DD")
			}

			this.buscarChecklist()
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

			validarFormulario() {
				this.erros = []

				let camposObrigatorio

				if (!this.mostrarFechamento) {
					camposObrigatorio = ["km_inicial"]
				} else {
					camposObrigatorio = ["km_final"]
				}
			},

			async cadastrarCheckList() {
				let {
					km_inicial,
					gasolina,
					observacao_frente,
					observacao_traseira,
					observacao_lateral_direita,
					observacao_lateral_esquerda,
					observacao_teto,
					observacao_geral,
				} = this.checklist

				let aberto_por_id = this.$auth.user.id
				let carro_id = this.carro.id

				let resp = await this.$axios.$post("/transporte/checklist/cadastrar", {
					km_inicial,
					gasolina,
					observacao_frente,
					observacao_traseira,
					observacao_lateral_direita,
					observacao_lateral_esquerda,
					observacao_teto,
					observacao_geral,
					aberto_por_id,
					carro_id,
				})

				if (!resp.falha) {
					let { checklist } = resp.dados
					this.$emit("checklistCadastrado", this.carro.id, checklist)
				}
			},

			async buscarChecklist() {
				let carro_id = this.carro.id
				this.carregando = true

				let resp = await this.$axios.$get("/transporte/checklist/buscar", { params: { carro_id } })

				if (!resp.falha) {
					let { checklist } = resp.dados
					if (checklist) {
						if (checklist.data_fechamento !== null) {
							this.mostrarConcluido = true
						} else {
							this.mostrarFechamento = true
							this.formAberturaFechado = true
						}

            this.checklist = Object.assign(this.checklist, checklist)
            let data_abetura = checklist.data_abertura.split(" ")
            this.checklist.data_abertura = data_abetura[0]
            this.checklist.data_abertura_completa = checklist.data_abertura
					} else {
						this.formAberturaFechado = false
						this.mostrarFechamento = false
					}
					this.carregando = false
				}
			},

      async atualizarChecklist(){
        let {
          km_inicial,
          gasolina,
          observacao_frente,
          observacao_traseira,
          observacao_lateral_direita,
          observacao_lateral_esquerda,
          observacao_teto,
          observacao_geral,
          id
        } = this.checklist

        let resp = await this.$axios.$post("/transporte/checklist/atualizar", {
          km_inicial,
          gasolina,
          observacao_frente,
          observacao_traseira,
          observacao_lateral_direita,
          observacao_lateral_esquerda,
          observacao_teto,
          observacao_geral,
          id
        })

        if (!resp.falha) {
          this.formAberturaFechado = true
          this.textoAlerta = "Checklist atualizado com sucesso!"
          this.mostrarAlerta = true
        }

      },

			async finalizarChecklist() {
				let { id, km_final, observacao_fechamento } = this.checklist
				let fechado_por_id = this.$auth.user.id

				let resp = await this.$axios.$post("/transporte/checklist/finalizar", {
					id,
					km_final,
					observacao_fechamento,
					fechado_por_id,
				})

				if (!resp.falha) {
					this.$emit("checklistFechado", this.carro.id)
				}
			},

      async buscarTodosChecklists(){
        let carro_id  = this.carro.id

        let resp = await this.$axios.$get("/transporte/checklist/historico", { params: { carro_id}})

        if(!resp.falha){
          this.checklists = resp.dados.checklists
        }
      },

      verDetalhesChecklist(dados) {
        this.checklistPrVisualizar = dados.id
        this.mostrarDialogDetalhesChecklist = true
      },
		},
    watch: {
      tab(valor) {
        console.log(valor)
        if(valor === 'historico'){
          if(this.checklists.length === 0){
            this.buscarTodosChecklists()
          }
        }
      }
    }
	}
</script>

<style scoped>
	.esconder-abertura {
		max-height: 0;
		height: 0;
		overflow: hidden;
	}
</style>
