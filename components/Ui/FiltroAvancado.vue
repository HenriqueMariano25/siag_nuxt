<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			titulo="FILTRO AVANÇADO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 w-full">
					<div class="flex gap-2">
						<AppFormSelect
							label="CAMPO"
							obrigatorio
							:options="filtros"
							v-model="filtro.campo"
							id="campo" />
						<AppFormInput
              v-if="tipoValor !== 'date'"
							id="valor"
							class="grow"
							obrigatorio
							:type="tipoValor"
							label="VALOR"
							@keyup.enter.prevent.stop="!disabitarBtnAdicionar ? selecionarFiltro() : ''"
							v-model="filtro.valor"
							:disabled="filtro.campo === null || filtro.campo === ''"
							uppercase
							placeholder="Ex: USB DESTRAVADO" />
            <template v-if="tipoValor === 'date'">
              <AppFormInput
                id="data_inicio"
                class="grow"
                obrigatorio
                type="date"
                label="DATA INICIAL"
                @keyup.enter.prevent.stop="!disabitarBtnAdicionar ? selecionarFiltro() : ''"
                v-model="filtro.data_inicio"
                :disabled="filtro.campo === null || filtro.campo === ''" />
              <AppFormInput
                id="data_fim"
                class="grow"
                type="date"
                label="DATA FINAL"
                obrigatorio
                @keyup.enter.prevent.stop="!disabitarBtnAdicionar ? selecionarFiltro() : ''"
                v-model="filtro.data_fim"
                :disabled="filtro.campo === null || filtro.campo === ''" />
            </template>

						<div class="flex items-end">
							<BotaoPadrao
								:disabled="disabitarBtnAdicionar"
								cor="bg-blue-400 hover:bg-blue-500"
								@clique="selecionarFiltro">
								<img
									src="@/assets/icons/add-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
					<div
						class="flex flex-col mt-2 text-start"
						v-if="filtrosSelecionados.length > 0">
						<span class="px-1">FILTROS SELECIONADOS</span>
						<table class="w-fit">
							<tbody>
								<tr v-for="(filtro, index) of filtrosSelecionados">
									<td class="border border-gray-400 px-2 font-bold">
										{{ filtros.find((o) => o.id === filtro.campo).nome }}
									</td>
									<td class="border border-gray-400 px-2">{{ filtro.valor }}</td>
									<td class="border border-gray-400">
										<BotaoPadrao
											icone
											@clique="filtrosSelecionados.splice(index, 1)">
											<img
												src="@/assets/icons/delete-b.svg"
												alt=""
												class="w-6 h-6" />
										</BotaoPadrao>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex gap-2">
					<BotaoPadrao
						texto="limpar"
						@clique="filtrosSelecionados = []"
						v-if="jaFiltrado.length > 0">
						<img
							src="@/assets/icons/eraser-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="filtrar"
						@clique="filtrar()">
						<img
							src="../../assets/icons/filter-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"

	export default {
		components: { AppFormSelect, BotaoPadrao, AppFormInput, BaseDialog },
		props: {
			filtros: {
				type: Array,
			},
			jaFiltrado: {
				type: Array,
			},
		},
		data() {
			return {
				filtro: {
					campo: null,
					valor: null,
          data_inicio: null,
          data_fim: null,
				},
				filtrosSelecionados: [],
				tipoValor: "text",
			}
		},
		mounted() {
			if (this.jaFiltrado) {
				this.filtrosSelecionados = new Array(...this.jaFiltrado)
			}
		},
		computed: {
			disabitarBtnAdicionar() {
				let { campo, valor, data_inicio, data_fim } = this.filtro
        if(this.tipoValor === 'date'){
          return campo === null || campo === "" || data_inicio === null || data_inicio === "" || data_fim === null || data_fim === ""
        }else{
          return campo === null || campo === "" || valor === null || valor === ""
        }


			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async selecionarFiltro() {
				let { campo, valor, data_inicio, data_fim } = this.filtro
        let valor_original = this.filtro.valor
        if (this.tipoValor === "date"){
          valor_original = [data_inicio, data_fim]
          valor = `${this.$dayjs(data_inicio).format("DD/MM/YYYY")} ${data_fim ? ' - ' + this.$dayjs(data_fim).format("DD/MM/YYYY") : ""}`
        }else{
          valor_original = this.filtro.valor
        }

				this.filtrosSelecionados.push({ campo, valor, valor_original, tipo: this.tipoValor ? this.tipoValor : 'text' })
				this.filtro = { campo: null, valor: null }
			},
			async filtrar() {
				let filtro = {}

				this.filtrosSelecionados.forEach((f) => {
          if(f.tipo === 'date'){
            filtro[f.campo] = { $bet: [f.valor_original[0], f.valor_original[1]]}
          }else{
					  filtro[f.campo] = { $iLike: `%${f.valor_original}%` }
          }
				})

				this.$emit("filtrar", { filtro, filtrosSelecionados: this.filtrosSelecionados })
			},
		},
		watch: {
			"filtro.campo"(valor) {
				let filtro = this.filtros.find((o) => o.id === valor)
				if (filtro) {
					if (filtro.tipo) {
						this.tipoValor = filtro.tipo
					} else {
						this.tipoValor = "text"
					}
				}
			},
		},
	}
</script>

<style scoped></style>
