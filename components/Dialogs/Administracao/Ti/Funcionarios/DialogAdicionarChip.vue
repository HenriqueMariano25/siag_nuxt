<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			class="uppercase"
			titulo="ADICIONAR CHIP"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full px-2 gap-2">
					<div class="flex gap-2 w-full">
						<AppFormInput
							type="text"
							@keyup.enter.prevent.stop="buscarChip()"
							class="grow"
							uppercase
							v-model="buscaChip"
							placeholder="Ex: 123456789"
							label="Buscar por número ou sim card"
							id="numero_sim_card" />
						<div class="flex items-end">
							<BotaoPadrao
								texto="buscar"
								cor="bg-blue-400 hover:!bg-blue-500"
								@clique="buscarChip()"
								:disabled="bloquearBuscarChip">
								<img
									src="@/assets/icons/magnifier-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
					<div
						class="flex flex-col overflow-y-auto w-full gap-2 p-1"
						style="max-height: calc(100vh - 300px)">
						<div
							v-for="chip of chips"
							:key="chip.id"
							class="chip flex flex-col p-2 shadow bg-[#d8f3dc] border border-[#95d5b2]">
							<div class="flex gap-3">
								<div class="flex flex-col grow">
									<div class="flex gap-4">
										<div class="flex flex-col">
											<span class="titulo-desknote">NÚMERO</span>
											<span class="texto-desknote">{{ chip.numero }}</span>
										</div>
										<div class="flex flex-col">
											<span class="titulo-desknote">SIM CARD</span>
											<span class="texto-desknote">{{ chip.sim_card ? chip.sim_card : "-" }}</span>
										</div>
										<div class="flex flex-col">
											<span class="titulo-desknote">PLANO</span>
											<span class="texto-desknote">{{
												chip.PlanoChip ? chip.PlanoChip.nome : "-"
											}}</span>
										</div>
									</div>
									                <div class="px-0.5 font-bold text-slate-700 text-sm flex whitespace-nowrap">
									                  <span class="whitespace-nowrap">
																			DATA DE ATIVAÇÃO: {{ chip.data_ativacao ? $dayjs(chip.data_ativacao).format("DD/MM/YYYY") : "" }}
																		</span>
									                </div>
								</div>
								<div class="flex">
									<div class="grid grid-cols-1 text-end content-between h-full">
										<span class="text-sm" >
                      {{ chip.data_entrega ? 'Data de entrega:' : ''}}
											<strong class="text-lg">
												{{
													chip.data_entrega
														? $dayjs(chip.data_entrega).format("DD/MM/YYYY")
														: ""
												}}
											</strong>
										</span>
										<span class="text-sm self-end">
											RESPONSÁVEL:
											<strong
												class="text-lg"
												:class="{ 'text-green-800': !chip.Funcionario }">
												{{ chip.Funcionario ? chip.Funcionario.nome : "ESTOQUE" }}
											</strong>
										</span>
									</div>
								</div>
								<div class="flex">
									<div class="flex flex-col items-center justify-center h-full gap-1">
										<BotaoPadrao
											v-if="chip_id !== chip.id"
											icone
											@clique="chip_id = chip.id"
											cor="!bg-blue-300 hover:!bg-blue-400">
											<img
												src="@/assets/icons/add-b.svg"
												alt=""
												class="w-9 h-9" />
										</BotaoPadrao>
										<BotaoPadrao
											v-if="chip_id === chip.id"
											icone
											@clique="adicionarChip(chip)"
											cor="!bg-green-400 hover:!bg-green-500">
											<img
												src="@/assets/icons/add-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
										<BotaoPadrao
											v-if="chip_id === chip.id"
											icone
											@clique="chip_id = null"
											cor="!bg-red-300 hover:!bg-red-400">
											<img
												src="@/assets/icons/close-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</div>
							</div>
							<div
								class="bg-red-400 w-full px-2 text-center uppercase text-white rounded border border-red-500 py-1 font-bold mt-2"
								v-if="chip.Funcionario && chip_id === chip.id">
								<span> Esse chip já tem um responsável, certeza que deseja fazer a troca ? </span>
							</div>
						</div>
					</div>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		components: { BaseDialog },
		data() {
			return {
				buscaChip: null,
				chips: [],
				chip_id: null,
			}
		},
		props: {
			funcionario_id: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			bloquearBuscarChip() {
				let busca = this.buscaChip ? this.buscaChip.trim() : this.buscaChip

				return busca === null || busca === ""
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarChip() {
				let busca = this.buscaChip
				let funcionario_id = this.funcionario_id

				let resp = await this.$axios.$get("/ti/funcionarios/buscarChips", {
					params: { busca, funcionario_id },
				})

				if (!resp.falha) {
					this.chips = resp.dados.chips
				}
			},
			async adicionarChip(chip) {
				let funcionario_id = this.funcionario_id
				let chip_id = chip.id
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/ti/funcionarios/trocarChip", {
					funcionario_id,
					chip_id,
					usuario_id,
				})

				if (!resp.falha) {
					chip.data_entrega = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
					this.$emit("trocado", chip)
				}
			},
		},
	}
</script>

<style scoped>
	.titulo-desknote {
		font-size: 11px;
		text-align: center;
		font-weight: 700;
		color: #545458;
		white-space: nowrap;
	}

	.texto-desknote {
		font-size: 19px;
		text-align: center;
		font-weight: 700;
		color: #000000;
		white-space: nowrap;
		text-transform: uppercase;
	}
</style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
</script>
