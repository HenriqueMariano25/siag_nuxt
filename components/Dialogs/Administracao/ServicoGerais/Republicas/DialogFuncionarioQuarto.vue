<template>
	<div>
		<BaseDialog
			largura="w-9/12"
			class="uppercase"
			titulo="Funcionário no quarto"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<div class="flex gap-5 mb-2 px-2 text-xl">
						<span>N° do quarto: {{ quarto.numero }}</span>
						<span>Ocupação: {{ quarto.vagas }}/{{ totalFuncionarios }}</span>
					</div>
					<div
						class="flex flex-col gap-1"
						v-if="buscouFuncionarios">
						<div
							class="flex w-full border border-slate-700 rounded p-2"
							:class="{
								'bg-yellow-200':
									funcionarios[idx - 1] && funcionarios[idx - 1].funcionario_id === null,
								'bg-red-200': !funcionarios[idx - 1],
							}"
							v-for="idx of parseInt(quarto.vagas)">
							<div class="flex justify-between w-full">
								<template v-if="funcionarios[idx - 1]">
									<div
										class="flex flex-col"
										v-if="funcionarios[idx - 1].funcionario_id === null">
										<span class="font-bold">! {{ funcionarios[idx - 1].nome }}</span>
										<span class="text-sm text-gray-700 font-bold">FUNCIONÁRIO PROVISÓRIO</span>
									</div>
									<div
										class="flex flex-col"
										v-if="funcionarios[idx - 1].funcionario_id !== null">
										<span class="font-bold">{{ funcionarios[idx - 1].Funcionario.nome }}</span>
										<span class="text-sm text-gray-700 font-bold"
											>{{ funcionarios[idx - 1].Funcionario.chapa }} |
											{{ funcionarios[idx - 1].Funcionario.cargo }}
										</span>
									</div>
									<BotaoPadrao
										icone
										@clique="indexDeletando = idx - 1"
										v-if="indexDeletando !== idx - 1">
										<img
											src="@/assets/icons/delete-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
									<div
										class="flex gap-1"
										v-if="indexDeletando === idx - 1">
										<BotaoPadrao
											icone
											@clique="deletarFuncionarioQuarto(idx - 1)">
											<img
												src="@/assets/icons/delete-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
										<BotaoPadrao
											icone
											@clique="indexDeletando = null">
											<img
												src="@/assets/icons/close-b.svg"
												alt=""
												class="w-7 h-7" />
										</BotaoPadrao>
									</div>
								</template>
								<div
									v-if="indexAdicionando === idx - 1"
									class="flex flex-col w-full">
									<div class="flex w-full justify-between gap-1.5 items-center">
										<AppFormSelectCompleto
											style="z-index: 103 !important"
											class="grow"
											id="funcionarios"
											label="Funcionário"
											v-model="funcionario"
											:options="todosFuncionarios" />
										<span>OU</span>
										<AppFormInput
											class="grow"
											label="Funcionário provisório"
											placeholder="Ex: Henrique Silva - Comporativo"
											type="text"
											uppercase
											v-model="provisorio"
											id="funcionario_provisorio" />
										<div class="flex gap-1">
											<BotaoPadrao
												icone
												@clique="salvarFuncionarioQuarto(idx - 1)">
												<img
													src="@/assets/icons/save-b.svg"
													alt=""
													class="w-7 h-7" />
											</BotaoPadrao>
											<BotaoPadrao
												icone
												@clique="indexAdicionando = null">
												<img
													src="@/assets/icons/close-b.svg"
													alt=""
													class="w-7 h-7" />
											</BotaoPadrao>
										</div>
									</div>
									<div
										class="w-full font-bold px-2 mt-1 text-red-900"
										v-if="erroCadastro">
										<span>FUNCIONÁRIO JÀ VINCULADO A OUTRA REPÚBLICA OU QUARTO</span>
									</div>
								</div>
								<template v-if="!funcionarios[idx - 1] && indexAdicionando !== idx - 1">
									<div class="flex flex-col justify-center h-full">
										<span class="font-bold">VAZIO</span>
									</div>
									<BotaoPadrao
										icone
										@clique="indexAdicionando = idx - 1">
										<img
											src="@/assets/icons/add-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</template>
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import { buscarFuncionarios } from "~/mixins/buscarInformacoes"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"

	export default {
		mixins: [buscarFuncionarios],
		components: { AppFormSelectCompleto, AppFormInput, BotaoPadrao, BaseDialog },
		props: {
			quarto: {
				type: Object,
			},
		},
		data() {
			return {
				funcionarios: [],
				buscouFuncionarios: false,
				todosFuncionarios: [],
				indexAdicionando: null,
				indexDeletando: null,
				funcionario: null,
				provisorio: null,
				totalFuncionarios: 0,
				erroCadastro: false,
			}
		},
		async mounted() {
			await this.buscarFuncionariosQuarto()
			let funcionarios = await this.buscarFuncionarios(false)
			this.todosFuncionarios = funcionarios.map((o) => {
				return { id: o.id, nome: o.nome }
			})
		},
		methods: {
			async cancelar() {
				this.$emit("cancelar")
			},
			async buscarFuncionariosQuarto() {
				let resp = await this.$axios.$get(
					`/servicos_gerais/republica/quarto/${this.quarto.id}/funcionarios`,
				)

				if (!resp.falha) {
					this.funcionarios = resp.dados.funcionarios
					this.buscouFuncionarios = true
				}

				this.totalFuncionarios = resp.dados.funcionarios.length
			},
			async salvarFuncionarioQuarto(index) {
				this.erroCadastro = false

				let funcionario_id = this.funcionario
				let provisorio = this.provisorio
				let id = null
				if (this.funcionarios[index]) {
					id = this.funcionarios[index].id
				}

				let { id: quarto_id } = this.quarto

				let resp = await this.$axios.$post("/servicos_gerais/republica/quarto/funcionario", {
					quarto_id,
					provisorio,
					funcionario_id,
					id,
				})
				if (!resp.falha) {
					this.funcionarios[index] = resp.dados.quartoFuncionario
					this.indexAdicionando = null
					this.totalFuncionarios += 1
					this.$emit("funcionarioEditado", {
						id: this.quarto.id,
						totalFuncionarios: this.totalFuncionarios,
					})
					this.funcionario = null
					this.provisorio = null
				} else {
					this.erroCadastro = true
				}
			},
			async deletarFuncionarioQuarto(index) {
				let id = null
				if (this.funcionarios[index]) {
					id = this.funcionarios[index].id
				}
				let resp = await this.$axios.$delete(`/servicos_gerais/republica/quarto/funcionario/${id}`)

				if (!resp.falha) {
					this.funcionarios.splice(index, 1)
					this.indexDeletando = null
					this.totalFuncionarios -= 1
					this.$emit("funcionarioEditado", {
						id: this.quarto.id,
						totalFuncionarios: this.totalFuncionarios,
					})
				}
			},
		},
		watch: {
			provisorio: function (valor) {
				if (valor) {
					this.funcionario = null
				}
			},
			funcionario: function (valor) {
				if (valor) {
					this.provisorio = null
				}
			},
		},
	}
</script>

<style scoped></style>
