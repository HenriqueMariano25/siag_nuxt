<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			:titulo="chip === null ? 'Criar CHIP' : `Editando CHIP - ${chip.numero}`"
			:carregando="carregando"
			:btnDeletar="chip !== null"
			@deletar="deletarChip"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.chip`]="{ item }">
						<div class="px-2 grid grid-cols-3 gap-2 pt-1 items">
							<div class="col-span-3 px-1 bg-gray-300 text-xl">
								<span>Chip</span>
							</div>
							<AppFormInput
								label="Número"
								mask="(##)#####-####"
								type="text"
								id="numero"
								placeholder="Ex: (22)99123-4567"
								obrigatorio
								:invalido="erros.includes('numero')"
								v-model="chipLocal.numero" />
							<AppFormInput
								label="SimCard"
								type="number"
								id="local"
								placeholder="Ex: 895505312200119807641"
								obrigatorio
								:invalido="erros.includes('sim_card')"
								v-model="chipLocal.sim_card" />
							<AppFormInput
								label="Data de ativação"
								type="date"
								id="data_ativacao"
								obrigatorio
								:invalido="erros.includes('data_ativacao')"
								v-model="chipLocal.data_ativacao" />
							<AppFormSelect
								label="Plano"
								:options="planos"
								obrigatorio
								v-model="chipLocal.plano_id"
								id="status"
								:invalido="erros.includes('plano_id')" />
							<AppFormSelect
								label="Situação"
								:options="situacoes"
								obrigatorio
								v-model="chipLocal.situacao_id"
								id="status"
								:invalido="erros.includes('situacao_id')" />
							<AppFormInput
								label="Data de bloqueio"
								obrigatorio
								type="date"
								id="data_bloqueio"
								v-if="chipLocal.situacao_id === 2"
								:invalido="erros.includes('data_bloqueio')"
								v-model="chipLocal.data_bloqueio" />
							<AppFormInput
								label="Data de cancelamento"
								type="date"
								obrigatorio
								:invalido="erros.includes('data_cancelamento')"
								id="data_cancelamento"
								v-if="chipLocal.situacao_id === 3"
								v-model="chipLocal.data_cancelamento" />
							<AppFormInput
								class="col-span-3"
								label="Tipo de serviço"
								type="text"
								id="tipo_servico"
								placeholder="Ex: Tipo de serviço"
								v-model="chipLocal.tipo_servico" />
							<AppFormTextarea
								id="observacao"
								:total-caracteres="1000"
								label="Observação"
								linhas="2"
								placeholder="Observação opcional"
								v-model="chipLocal.observacao"
								class="col-span-3" />
						</div>
					</template>
					<template v-slot:[`tab.funcionario`]="{ item }">
						<div class="px-2 py-1 flex flex-col gap-1 print:hidden">
							<!--              <span class="px-1 font-bold text-sm text-gray-600">Os dados do funcionário só será salvo após clicar em salvar</span>-->

							<div class="flex gap-3 items-end">
								<div class="flex gap-2 items-end grow">
									<AppFormSelectCompleto
										altura="95px"
										class="grow"
										id="funcionario"
										label="Funcionário"
										:options="funcionarios"
										v-model="funcionarioLocal.id" />
									<div class="flex">
										<BotaoPadrao
											cor="bg-blue-500 hover:bg-blue-600"
											@clique="buscarFuncionario()">
											<img
												src="@/assets/icons/magnifier-w.svg"
												alt=""
												class="w-6 h-6" />
										</BotaoPadrao>
									</div>
								</div>
								<span
									class="self-center text-xl"
									v-if="funcionarioAtual.id !== null"
									><strong>ou</strong></span
								>
								<div
									class="flex items-end"
									v-if="funcionarioAtual.id !== null">
									<BotaoPadrao
										texto="DEVOLVER AO ESTOQUE"
										class="text-white shadow"
										@clique="devolverEstoque()"
										cor="bg-blue-500 hover:bg-blue-600">
										<img
											src="@/assets/icons/stock-w.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
							<div class="flex w-full gap-2 items-center">
								<div class="flex grow flex-col border border-slate-600 rounded">
									<span class="bg-gray-300 px-2 rounded-t text-lg font-bold uppercase"
										>Funcionário atual</span
									>
									<div
										class="gap-4 flex px-2 justify-between"
										v-if="funcionarioAtual.id !== null">
										<span>{{ funcionarioAtual.nome ? funcionarioAtual.nome : "" }}</span>
										<span>{{ funcionarioAtual.chapa ? funcionarioAtual.chapa : "" }}</span>
										<span>{{ funcionarioAtual.cargo ? funcionarioAtual.cargo : "" }}</span>
									</div>
									<div v-else>
										<span class="font-bold text-green-700 px-2">EM ESTOQUE</span>
									</div>
									<span
										v-if="chipLocal.data_entrega && Object.keys(funcionarioAtual).length > 0"
										class="px-2"
										>Data de entrega:
										{{ $dayjs(chipLocal.data_entrega).format("DD/MM/YYYY") }}</span
									>
									<span
										v-if="chipLocal.data_entrega && Object.keys(funcionarioAtual).length <= 0"
										class="px-2"
										>Data de devolução:
										{{ $dayjs(chipLocal.data_entrega).format("DD/MM/YYYY") }}</span
									>
								</div>
								<img
									src="@/assets/icons/arrow-right-long-b.svg"
									alt=""
									class="w-8 h-9"
									v-if="buscouFuncionario" />
								<div
									class="flex grow flex-col border border-slate-600 rounded"
									v-if="buscouFuncionario">
									<span class="bg-gray-300 px-2 rounded-t text-lg font-bold uppercase"
										>Novo funcionário</span
									>
									<div class="gap-4 flex px-2 justify-between">
										<span
											:class="{
												'font-bold text-green-700':
													funcionarioLocal.nome === 'RETORNAR PARA O ESTOQUE',
											}"
											>{{ funcionarioLocal.nome ? funcionarioLocal.nome : "" }}</span
										>
										<span>{{ funcionarioLocal.chapa ? funcionarioLocal.chapa : "" }}</span>
										<span>{{ funcionarioLocal.cargo ? funcionarioLocal.cargo : "" }}</span>
									</div>
									<span class="px-2"
										>Data de entrega:
										{{
											funcionarioLocal.data_entrega
												? $dayjs(funcionarioLocal.data_entrega).format("DD/MM/YYYY")
												: $dayjs().format("DD/MM/YYYY")
										}}</span
									>
								</div>
							</div>
							<div class="grid grid-cols-3 gap-2 pt-1">
								<AppFormInput
									v-if="chipLocal.data_entrega === null"
									label="Data de entrega"
									type="date"
									id="data_entrega"
									:disabled="temDataEntrega"
									obrigatorio
									:invalido="erros.includes('data_entrega')"
									v-model="funcionarioLocal.data_entrega" />
								<AppFormTextarea
									id="observacao"
									:total-caracteres="1000"
									label="Observação"
									linhas="2"
									placeholder="Observação opcional"
									v-model="funcionarioLocal.observacao_funcionario"
									class="col-span-3" />
							</div>
						</div>
						<div class="print:flex flex-col text-center gap-2 impressao hidden">
							<div class="w-full flex justify-center">
								<img
									src="@/assets/img/logoagcnovo.png"
									alt=""
									class="w-[300px]" />
							</div>
							<span class="text-2xl font-bold">TERMO DE ENTREGA DE CHIP</span>
							<div>
								<table class="w-full text-start">
									<tbody>
										<tr>
											<td class="w-[100px]">Matrícula</td>
											<td>{{ funcionarioAtual.chapa ? funcionarioAtual.chapa : "" }}</td>
										</tr>
										<tr>
											<td class="w-[100px]">Funcionário</td>
											<td>{{ funcionarioAtual.nome ? funcionarioAtual.nome : "" }}</td>
										</tr>
										<tr>
											<td class="w-[100px]">Função</td>
											<td>{{ funcionarioAtual.cargo ? funcionarioAtual.cargo : "" }}</td>
										</tr>
										<tr>
											<td class="w-[100px]">CPF</td>
											<td>{{ funcionarioAtual.cpf ? funcionarioAtual.cpf : "" }}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<span class="text-lg"
								>Nesta data e pelo presente instrumento, a Consórcio Geração Açu 2 cede ao empregado
								acima através do presente termo o direito de utilização do
								Equipamento abaixo identificado.</span
							>
							<div>
								<table class="w-full">
									<thead>
										<tr>
											<th class="w-[30%]">Número</th>
											<th>Pacote</th>
											<th class="w-[30%]">Simcard</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>{{ chip.numero }}</td>
											<td class="">
												<div class="flex flex-col">
													<span
														><strong>{{
															chipLocal.PlanoChip && chipLocal.PlanoChip.nome
																? chipLocal.PlanoChip.nome
																: ""
														}}</strong></span
													>
													<span>{{
														chipLocal.PlanoChip && chipLocal.PlanoChip.descricao
															? chipLocal.PlanoChip.descricao
															: ""
													}}</span>
												</div>
											</td>
										</tr>
									</tbody>
								</table>
								<div class="flex flex-col w-full text-start mt-2">
									<span class="text-xl font-bold ml-2">Observações Chip</span>
									<div class="border border-black flex flex-col px-2">
										<span class="font-bold"
											>O pacote contempla somente ligações realizadas para a operadora 21.</span
										>
										<span class="font-bold"
											>Qualquer ligação realizada para outra operadora terá cobrança aparte.</span
										>
										<span>{{ chipLocal.observacao }}</span>
									</div>
								</div>
								<div class="flex flex-col w-full text-start mt-2">
									<span class="text-xl font-bold ml-2">Observações Funcionário</span>
									<div class="border border-black flex flex-col px-2 min-h-[40px]">
										<span class="font-bold">{{ chipLocal.observacao_funcionario }}</span>
									</div>
								</div>
                <div class="w-full text-start mt-4 text-md">
                  <span class="">
                  O empregado torna-se, a partir de agora, responsável pelo uso e conservação do referido bem, o qual deverá ser utilizado exclusivamente a serviço, notificando a empresa quando ocorrer qualquer irregularidade. Em nenhuma hipótese o empregado torna-se-á o titular do referido chip, comprometendo-se a devolvê-lo quando solicitado pela empresa. No caso de perda, roubo, extravio, dano acidental ou qualquer tipo de inviabilize o uso desse equipamento, o empregado deverá repor o bem de marca e modelo ao que lhe é fora entregue. O empregado declara estar recebendo o chip acima descrito respeitando as informações de número, pacote, simcard e suas respectivas observações nos termos da LGPD e da Norma AG 135 02 - Segurança da Informação, disponível no Portal AG.
                </span>
                </div>
							</div>
              <div class="flex w-full mt-3 items-end h-full">
                <div class="flex flex-col w-full !justify-center">
                  <span class="text-lg">São João da Barra</span>
                  <div class="linha self-center mt-16"></div>
                  <span>ANDRADE GUTIERREZ</span>
                </div>
                <div class="flex flex-col w-full !justify-center">
                  <span class="text-lg">{{ $dayjs().format("DD [de] MMMM [de] YYYY") }}</span>
                  <div class="linha self-center mt-16"></div>
                  <span>{{ funcionarioLocal.nome }}</span>
                </div>
              </div>
						</div>
					</template>
					<template v-slot:[`tab.historico`]="{ item }">
						<div class="max-h-[500px] overflow-y-auto">
							<div class="flex w-full justify-end px-2">
								<span
									>Total de historicos: <strong>{{ historicos.length }}</strong></span
								>
							</div>
							<div class="px-2 mt-1 flex flex-col gap-2">
								<div
									v-for="historico of historicos"
									:key="historico.id"
									class="flex flex-col p-1 bg-slate-300 border border-gray-400 rounded shadow">
									<div class="w-full flex justify-between">
										<span><strong>Ação: </strong>{{ historico.acao }}</span>
										<span
											><strong>{{
												$dayjs(historico.createdAt).format("DD/MM/YYYY HH:mm:ss")
											}}</strong></span
										>
									</div>
									<span
										><strong>Funcionário: </strong
										>{{
											historico.Funcionario && historico.Funcionario.nome
												? historico.Funcionario.nome
												: ""
										}}</span
									>
									<span> <strong>Usuário: </strong>{{ historico.Usuario.nome }} </span>
									<span><strong>Observações</strong> </span>
									<div class="px-1 bg-white border border-gray-300">
										<pre>{{ historico.observacao }}</pre>
									</div>
								</div>
							</div>
						</div>
					</template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex justify-end gap-2 items-center">
					<div
						v-if="tab === 'chip'"
						class="w-full flex gap-2 items-center">
						<div
							class="text-red-500 text-xl mr-3"
							v-if="erros.length > 0">
							<span>Campos obrigatórios necessários</span>
						</div>
						<BotaoPadrao
							texto="Salvar"
							@clique="chip ? editarChip(false) : cadastrarChip(false)">
							<img
								src="@/assets/icons/save-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="Salvar e sair"
							@clique="chip ? editarChip(true) : cadastrarChip(true)">
							<img
								src="@/assets/icons/save-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
					<div
						v-if="tab === 'funcionario'"
						class="w-full flex gap-2">
						<BotaoPadrao
              v-if="funcionarioLocal.id"
							texto="imprimir"
							@clique="imprimir">
							<img
								src="@/assets/icons/printer-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<div
							class="text-red-500 text-xl mr-3"
							v-if="erros.length > 0">
							<span>Campos obrigatórios necessários</span>
						</div>
						<BotaoPadrao
							texto="Salvar"
							:disabled="
								(funcionarioLocal.id !== funcionarioAtual.id && !buscouFuncionario) ||
								funcionarioLocal.data_entrega === null ||
								funcionarioLocal.data_entrega === ''
							"
							@clique="editarFuncionario(false)">
							<img
								src="@/assets/icons/save-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="Salvar e sair"
							:disabled="
								(funcionarioLocal.id !== funcionarioAtual.id && !buscouFuncionario) ||
								funcionarioLocal.data_entrega === null ||
								funcionarioLocal.data_entrega === ''
							"
							@clique="editarFuncionario(true)">
							<img
								src="@/assets/icons/save-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</BaseDialog>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
</script>

<script>
	import { buscarPlanosChip, buscarSituacaoChip } from "~/mixins/buscarInformacoes"

	export default {
		name: "DialogCriarChip",
		mixins: [buscarPlanosChip, buscarSituacaoChip],
		props: {
			chip: {
				type: [Object],
				default: null,
			},
		},
		data() {
			return {
				chipLocal: {
					numero: null,
					sim_card: null,
					data_ativacao: null,
					plano_id: null,
					situacao_id: null,
					data_bloqueio: null,
					data_cancelamento: null,
					tipo_servico: null,
					observacao: null,
				},
				funcionarioLocal: {
					chapa: null,
					matricula: null,
					cargo: null,
					setor: null,
					id: null,
					data_entrega: this.$dayjs().format("YYYY-MM-DD"),
					data_devolucao: null,
					observacao_funcionario: null,
				},
				carregando: false,
				planos: [],
				erros: [],

				tab: "chip",
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarAlerta: false,
				textoAlerta: null,
				index: null,
				funcionarios: [],
				situacoes: [],
				funcionarioAtual: {},
				buscouFuncionario: false,
				historicos: [],
				tabAtiva: true,
			}
		},
		async created() {
			let planos = await this.buscarPlanosChip()
			this.planos = planos.map((o) => {
				return { id: o.id, nome: o.nome }
			})

			let situacoes = await this.buscarSituacaoChip()
			this.situacoes = situacoes.map((o) => {
				return { id: o.id, nome: o.descricao }
			})

			await this.buscarFuncionarios()

			if (this.chip !== null) {
				this.tabAtiva = true
				this.carregando = true
				this.chipLocal = Object.assign({}, this.chip)
				this.carregando = false
				await this.buscarChip()
				await this.buscarHistoricos()
			} else {
				this.tabAtiva = false
			}
		},
		computed: {
			temDataEntrega() {
				return this.chipLocal.data_entrega !== null
			},
			tabs() {
				return [
					{ nome: "Chip", valor: "chip" },
					{ nome: "Funcionário", valor: "funcionario", disabled: !this.tabAtiva },
					{ nome: "Histórico", valor: "historico", disabled: !this.tabAtiva },
				]
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar/nomes")

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios
					this.funcionarios = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
			async buscarFuncionario() {
				let id = this.funcionarioLocal.id
				let resp = await this.$axios.$get("/ti/efetivo/buscarFuncionario", { params: { id } })

				if (!resp.falha) {
					let { funcionario } = resp.dados

					this.funcionarioLocal = Object.assign(this.funcionarioLocal, funcionario)
					this.funcionarioLocal.setor = funcionario.setor ? funcionario.setor.nome : ""
					this.buscouFuncionario = true
				}
			},
			async buscarChip() {
				let { id } = this.chip

				let resp = await this.$axios.$get("/ti/chip/buscar", { params: { id } })

				if (!resp.falha) {
					let { chip } = resp.dados
					this.chipLocal = Object.assign({}, chip)
					this.funcionarioLocal.data_entrega = this.$dayjs().format("YYYY-MM-DD")
					this.funcionarioLocal.observacao_funcionario = chip.observacao_funcionario

					if (chip.Funcionario) {
						this.funcionarioAtual = Object.assign({}, chip.Funcionario)
						this.funcionarioLocal = Object.assign({}, chip.Funcionario)
					} else {
						this.funcionarioAtual = Object.assign({}, this.funcionarioLocal)
					}
				}
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = ["numero", "sim_card", "data_ativacao", "plano_id", "situacao_id"]
				if (this.chipLocal.situacao_id === 2) camposObrigatorio.push("data_bloqueio")
				else if (this.chipLocal.situacao_id === 3) camposObrigatorio.push("data_cancelamento")

				for (let campo of camposObrigatorio) {
					let valor =
						typeof this.chipLocal[`${campo}`] === "String"
							? this.chipLocal[`${campo}`].trim()
							: this.chipLocal[`${campo}`]

					if (valor === null || valor === "") this.erros.push(campo)
				}
			},

			verificaPoltronaDuplicada() {
				for (let pass of this.dados) {
					let encontrados = this.dados.filter((o) => o.poltrona === pass.poltrona)
					pass.ativo = encontrados.length > 1
				}
			},

			async cadastrarChip(sair) {
				this.validarFormulario()

				if (this.erros.length === 0) {
					let chip = this.chipLocal
					let usuario_id = this.$auth.user.id
					let resp = await this.$axios.$post("/ti/chip/cadastrar", { ...chip, usuario_id })
					if (!resp.falha) {
						let chipCriado = resp.dados.chip

						if (!sair) {
							this.textoAlerta = "Chip cadastrado com sucesso!"
							this.mostrarAlerta = true
							this.chipLocal = Object.assign({}, chipCriado)
							this.tabAtiva = true
							await this.buscarHistoricos()
						}

						this.$emit("cadastrado", { chip: chipCriado, sair })
					}
				}
			},

			async editarChip(sair) {
				this.validarFormulario()

				if (this.erros.length === 0) {
					let {
						id,
						numero,
						sim_card,
						data_ativacao,
						plano_id,
						situacao_id,
						tipo_servico,
						observacao,
						data_bloqueio,
						data_cancelamento,
					} = this.chipLocal
					let chip = {
						id,
						numero,
						sim_card,
						data_ativacao,
						plano_id,
						situacao_id,
						tipo_servico,
						observacao,
						data_bloqueio,
						data_cancelamento,
					}
					let usuario_id = this.$auth.user.id

					let resp = await this.$axios.$post("/ti/chip/editar", {
						chip,
						usuario_id,
					})

					if (!resp.falha) {
						if (!sair) {
							await this.buscarHistoricos()
							this.textoAlerta = "Funcionário alterado com sucesso!"
							this.mostrarAlerta = true
						}
						this.$emit("editado", { chip, sair })
					}
				}
			},

			async deletarChip() {
				let { id } = this.chip

				await this.$axios.$delete(`/ti/chip/deletar/${id}`).then(() => {
					this.$emit("deletado", id)
				})
			},

			async editarFuncionario(sair) {
				let { id: funcionario_id, data_entrega, observacao_funcionario } = this.funcionarioLocal
				let { id } = this.chip
				let usuario_id = this.$auth.user.id
				if (this.chipLocal.data_entrega) {
					data_entrega = this.$dayjs().format("YYYY-MM-DD")
				}

				let resp = await this.$axios.$post("/ti/chip/funcionario/editar", {
					funcionario_id,
					data_entrega,
					observacao_funcionario,
					id,
					usuario_id,
				})

				if (!resp.falha) {
					let { chip } = resp.dados

					if (!sair) {
						if (this.funcionarioLocal.id === null) {
							this.funcionarioAtual = { id: null }
							this.funcionarioLocal = { id: null }
						} else {
							this.funcionarioAtual = Object.assign({}, this.funcionarioLocal)
						}
						this.buscouFuncionario = false
						await this.buscarHistoricos()
						this.textoAlerta = "Funcionário alterado com sucesso!"
						this.mostrarAlerta = true
					}
					this.$emit("editado", { chip, sair })
				}
			},

			async devolverEstoque() {
				this.buscouFuncionario = true
				this.funcionarioLocal = Object.assign(this.funcionarioLocal, {
					id: null,
					nome: "RETORNAR PARA O ESTOQUE",
					chapa: null,
					cargo: null,
				})
			},

			async buscarHistoricos() {
				let id = this.chipLocal.id

				console.log(id)

				let resp = await this.$axios.$get("/ti/chip/historicoChip/buscar", { params: { id: id } })

				if (!resp.falha) {
					this.historicos = resp.dados.historicos
				}
			},

			async imprimir() {
				window.print()
			},
		},
	}
</script>

<style scoped>
	table {
		border-collapse: collapse;
	}

	table,
	th,
	td {
		border: 1px solid black;
	}

	td {
		padding: 0 5px 0 5px;
	}

  .linha{
    border-bottom: 2px solid black;
    width: 300px;
  }

  @page {
    size: A4;
  }

	@media print {

    @page {
      size: A4;
    }
		.impressao {
			padding-right: 10px;
		}
	}
</style>
