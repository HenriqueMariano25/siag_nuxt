<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="FUNCIONÁRIOS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="funcionario"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarFuncionarios"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						@clique="
							mostrarDialogEditarFuncionario = true
							funcionario_id = item.id
						">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</template>
				<template v-slot:[`body.ativos`]="{ item }">
					<div class="flex gap-1">
						<div
							class="tag bg-[#023e8a]"
							v-if="item.DesktopNotebookTI.filter((o) => o.tipo === 'desktop').length > 0">
							<span>D</span>
						</div>
						<div
							class="tag bg-[#606c38]"
							v-if="item.DesktopNotebookTI.filter((o) => o.tipo === 'notebook').length > 0">
							<span>N</span>
						</div>
						<div
							class="tag bg-[#5f0f40]"
							v-if="item.MonitorTI.length > 0">
							<span>M</span>
						</div>
						<div
							class="tag bg-[#bc6c25]"
							v-if="item.EquipamentoTI.length > 0">
							<span>E</span>
						</div>
            <div
              class="tag bg-[#52b69a]"
              v-if="item.Chip.length > 0">
              <span>C</span>
            </div>
					</div>
				</template>
				<template v-slot:[`header.ativos`]="{ item }">
					<div class="flex gap-2 justify-center">
						<span>{{ item.nome }}</span>
						<AppTooltip>
							<template v-slot:corpo>
								<img
									src="@/assets/icons/information-circle-w.svg"
									alt=""
									class="w-5 h-5" />
							</template>
							<template v-slot:tooltip>
								<div class="min-w-[300px] max-w-full flex flex-col gap-2">
									<div class="flex gap-2">
										<div class="tag bg-[#023e8a]">
											<span>D</span>
										</div>
										<span>DESKTOP</span>
									</div>

									<div class="flex gap-2">
										<div class="tag bg-[#606c38]">
											<span>N</span>
										</div>
										<span>NOTEBOOK</span>
									</div>

									<div class="flex gap-2">
										<div class="tag bg-[#5f0f40]">
											<span>M</span>
										</div>
										<span>MONITOR</span>
									</div>

									<div class="flex gap-2">
										<div class="tag bg-[#bc6c25]">
											<span>E</span>
										</div>
										<span>EQUIPAMENTO</span>
									</div>
                  <div class="flex gap-2">
                    <div class="tag bg-[#52b69a]">
                      <span>C</span>
                    </div>
                    <span>CHIP DE CELULAR</span>
                  </div>
								</div>
							</template>
						</AppTooltip>
					</div>
				</template>
				<template v-slot:[`body.setor.nome`]="{ item }">
					<span>{{ item.setor ? item.setor.nome : "" }}</span>
				</template>
				<template v-slot:[`body.historico`]="{ item }">
					<div
						class="bg-blue-200 border border-blue-300 flex gap-2 justify-center items-center py-0.5 text-black hover:bg-blue-300 rounded w-[100px]"
						@click="
							mostrarDialogHistoricoFuncionarioTI = true
							id = item.id
						">
						<img
							src="@/assets/icons/history-b.svg"
							alt=""
							class="w-6 h-6" />
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-between">
				<BotaoPadrao texto="excel">
					<img
						src="@/assets/icons/excel-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogEditarFuncionario
			v-if="mostrarDialogEditarFuncionario"
			@cancelar="
				mostrarDialogEditarFuncionario = false
				funcionario_id = null
			"
			:funcionario_id="funcionario_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogHistoricoFuncionarioTI
			v-if="mostrarDialogHistoricoFuncionarioTI"
			@cancelar="mostrarDialogHistoricoFuncionarioTI = false"
			:id="id" />
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCadastrarEquipamento from "~/components/Dialogs/Administracao/Ti/Equipamento/DialogCadastrarEquipamento.vue"
	import DialogEditarFuncionario from "~/components/Dialogs/Administracao/Ti/Funcionarios/DialogEditarFuncionario.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import DialogHistoricoFuncionarioTI from "~/components/Dialogs/Administracao/Ti/Funcionarios/DialogHistoricoFuncionarioTI.vue"

	export default {
		components: {
			AppTooltip,
			DialogEditarFuncionario,
			DialogCadastrarEquipamento,
			AppAlerta,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
			DialogHistoricoFuncionarioTI,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Ativos", valor: "ativos" },
					{ nome: "Matricula", valor: "chapa", filtro: true, ordenar: true, centralizar: true },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Cargo", valor: "cargo", filtro: true, ordenar: true },
					{ nome: "Setor", valor: "setor.nome", ordenar: true, filtro: true },
					{ nome: "Histórico", valor: "historico", largura: "w-14" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogEditarFuncionario: false,
				equipamento: null,
				mostrarAlerta: false,
				textoAlerta: null,
				funcionario_id: null,
				carregando: true,
				mostrarDialogHistoricoFuncionarioTI: false,
				id: null,
			}
		},
		mounted() {
			this.buscarFuncionarios()
		},
		methods: {
			async buscarFuncionarios() {
				this.carregando = true
				let filtros = this.filtros
				let ordem = this.ordem
				let page = this.pagina - 1
				let size = this.itensPorPagina

				let resp = await this.$axios.$get("/ti/funcionarios/buscarTodos", {
					params: { filtros, ordem, page, size },
				})

				if (!resp.falha) {
					let { funcionarios, total } = resp.dados

					this.dados = funcionarios
					this.totalItens = total
				}

				this.carregando = false
			},
			async editarEquipamento(item) {
				this.mostrarDialogCadastrarEquipamento = true
				this.equipamento = item
			},
			async equipamentoEditado({ equipamento, sair }) {
				let idx = this.dados.findIndex((o) => o.id === equipamento.id)

				if (idx >= 0) {
					this.dados[idx].nome = equipamento.nome
					this.dados[idx].marca = equipamento.marca
					this.dados[idx].modelo = equipamento.modelo
				}

				if (sair) {
					this.mostrarDialogCadastrarEquipamento = false
					this.textoAlerta = "Equipamento editado com sucesso!"
					this.mostrarAlerta = true
					this.equipamento = null
				}
			},
			async equipamentoCadastrado({ equipamento, sair }) {
				this.dados.push(equipamento)
				if (sair) {
					this.mostrarDialogCadastrarEquipamento = false
					this.textoAlerta = "Equipamento cadastrado com sucesso!"
					this.mostrarAlerta = true
				}
			},
		},
	}
</script>

<style scoped>
	.tag {
		border-radius: 10px;
		padding: 0 6px;
		font-weight: 600;
		color: white;
	}
</style>
