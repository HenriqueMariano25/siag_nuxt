<template>
	<div style="z-index: 102">
		<BaseDialog
			titulo="Agendamentos"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div>
					<div>
						<AppTabs
							:tabs="tabs"
							@tab="tab = $event">
							<template v-slot:[`tab.aprovados`]="{ item }">
								<div class="px-2 flex flex-col gap-y-2">
									<div
										class="gap-2 justify-between flex w-full border border-gray-300 bg-gray-200 p-1">
										<div class="flex items-end gap-2">
											<div v-for="key of Object.keys(diasAprovados)">
												<AppBadge
													cor="!bg-red-400"
													corFonte="bg-white"
													v-if="diasAprovados[key] !== 0"
													:texto="diasAprovados[key]">
													<AppTag
														@click="buscarPorTagAprovados(key)"
														cor="bg-blue-300 hover:bg-blue-400"
														:texto="$dayjs(key).format('DD/MM')"
														fonte="text-2xl"
														:clicavel="true" />
												</AppBadge>
											</div>
										</div>
										<div class="flex gap-2">
											<AppFormInput
												id="data_aprovados"
												type="date"
												v-model="dataAprovados"
												label="Data" />
											<div class="flex items-end">
												<BotaoPadrao
													cor="bg-gray-700 hover:bg-gray-800"
													:disabled="dataAprovados === null || dataAprovados === ''"
													@click="buscarAprovados">
													<img
														src="@/assets/icons/magnifier-w.svg"
														alt=""
														class="w-6 h-6" />
												</BotaoPadrao>
											</div>
										</div>
									</div>
									<div>
										<TabelaPadrao
											:cabecalho="cabecalhoAprovados"
											:dados="dadosAprovados"
											:itensPorPagina="itensPorPaginaAprovados"
											:pagina="paginaAprovados"
											@filtros="filtrosAprovados = $event"
											@ordem="ordemAprovados = $event"
											:totalItens="totalItensAprovados"
											altura="calc(100vh - 335px)"
											@atualizar="buscarAprovados()"
											:carregando="carregandoTabelaAprovados">
											<template v-slot:[`body.Funcionario.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
											</template>
											<template v-slot:[`body.Funcionario.cargo`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
											</template>
											<template v-slot:[`body.Funcionario.encarregado_sapo`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.encarregado_sapo
												}}</span>
											</template>
											<template v-slot:[`body.Funcionario.encarregado_producao`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.encarregado_producao
												}}</span>
											</template>
											<template v-slot:[`body.Funcionario.gestor`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.gestor }}</span>
											</template>
											<template v-slot:[`body.Setor.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Setor.nome }}</span>
											</template>
											<template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
												{{ horaExtra(item.Funcionario.hora_extra) }}
											</template>
                      <template v-slot:[`body.Funcionario.hora_extra_projetada`]="{ item }">
                        {{ horaExtra(item.hora_extra_projetada) }}
                      </template>
											<template v-slot:[`body.aprovador_he.nome`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.aprovador_he ? item.aprovador_he.nome : ""
												}}</span>
											</template>
											<template v-slot:[`body.Funcionario.rota.numero`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.rota ? item.Funcionario.rota.numero : ""
												}}</span>
											</template>
											<template v-slot:[`body.Funcionario.ponto_embarque`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.ponto_embarque }}</span>
											</template>
										</TabelaPadrao>
									</div>
								</div>
							</template>
							<template v-slot:[`tab.pendentes`]="{ item }">
								<div class="px-2 flex flex-col gap-y-2">
									<div
										class="gap-2 justify-between flex w-full border border-gray-300 bg-gray-200 p-1">
										<div class="flex items-end gap-2">
											<div v-for="key of Object.keys(diasPendentes)">
												<AppBadge
													cor="!bg-red-400"
													corFonte="bg-white"
													v-if="diasPendentes[key] !== 0"
													:texto="diasPendentes[key]">
													<AppTag
														@click="buscarPorTagPendentes(key)"
														cor="bg-blue-300 hover:bg-blue-400"
														:texto="$dayjs(key).format('DD/MM')"
														fonte="text-2xl"
														:clicavel="true" />
												</AppBadge>
											</div>
										</div>
										<div class="flex gap-2">
											<AppFormInput
												id="data_pendentes"
												type="date"
												v-model="dataPendentes"
												label="Data" />
											<div class="flex items-end">
												<BotaoPadrao
													cor="bg-gray-700 hover:bg-gray-800"
													:disabled="dataPendentes === null || dataPendentes === ''"
													@click="buscarPendentes">
													<img
														src="@/assets/icons/magnifier-w.svg"
														alt=""
														class="w-6 h-6" />
												</BotaoPadrao>
											</div>
										</div>
									</div>
									<div>
										<TabelaPadrao
											:cabecalho="cabecalhoPendentes"
											:dados="dadosPendentes"
											:itensPorPagina="itensPorPaginaPendentes"
											:pagina="paginaPendentes"
											:totalItens="totalItensPendentes"
											altura="calc(100vh - 335px)"
                      @filtros="filtrosPendentes = $event"
											@atualizar="buscarPendentes"
											:carregando="carregandoTabelaPendentes">
                      <template v-slot:[`body.status`]="{ item }">
												<span class="whitespace-nowrap">
													{{ item.StatusAgendamento ? item.StatusAgendamento.descricao : "" }}
												</span>
                      </template>
											<template v-slot:[`body.Funcionario.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
											</template>
											<template v-slot:[`body.Funcionario.cargo`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
											</template>
											<template v-slot:[`body.Funcionario.encarregado_sapo`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.encarregado_sapo
												}}</span>
											</template>
                      <template v-slot:[`body.Funcionario.encarregado_producao`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.Funcionario.encarregado_producao
                          }}</span>
                      </template>
											<template v-slot:[`body.Funcionario.gestor`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.gestor }}</span>
											</template>
											<template v-slot:[`body.Setor.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Setor.nome }}</span>
											</template>
                      <template v-slot:[`body.Funcionario.rota.numero`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.Funcionario.rota ? item.Funcionario.rota.numero : ""
                          }}</span>
                      </template>
                      <template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
                        {{ horaExtra(item.Funcionario.hora_extra) }}
                      </template>
                      <template v-slot:[`body.Funcionario.hora_extra_projetada`]="{ item }">
                        {{ horaExtra(item.hora_extra_projetada) }}
                      </template>
											<template v-slot:[`body.Funcionario.ponto_embarque`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.ponto_embarque }}</span>
											</template>
											<template v-slot:[`body.Funcionario.direto_indireto`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.direto_indireto
												}}</span>
											</template>
										</TabelaPadrao>
									</div>
								</div>
							</template>
							<template v-slot:[`tab.meusAgendamentos`]="{ item }">
								<div class="px-2 flex flex-col gap-y-2">
									<div
										class="gap-2 justify-between flex w-full border border-gray-300 bg-gray-200 p-1">
										<div class="flex items-end gap-2">
											<div v-for="key of Object.keys(diasMeusAgendamentos)">
												<AppBadge
													cor="!bg-red-400"
													corFonte="bg-white"
													v-if="diasMeusAgendamentos[key] !== 0"
													:texto="diasMeusAgendamentos[key]">
													<AppTag
														@click="buscarPorTagMeusAgendamentos(key)"
														cor="bg-blue-300 hover:bg-blue-400"
														:texto="$dayjs(key).format('DD/MM')"
														fonte="text-2xl"
														:clicavel="true" />
												</AppBadge>
											</div>
										</div>
										<div class="flex gap-2">
											<AppFormInput
												id="data_meus_agendamentos"
												type="date"
												v-model="dataMeusAgendamentos"
												label="Data" />
											<div class="flex items-end">
												<BotaoPadrao
													cor="bg-gray-700 hover:bg-gray-800"
													:disabled="dataMeusAgendamentos === null || dataMeusAgendamentos === ''"
													@click="buscarMeusAgendamentos">
													<img
														src="@/assets/icons/magnifier-w.svg"
														alt=""
														class="w-6 h-6" />
												</BotaoPadrao>
											</div>
										</div>
									</div>
									<div>
										<TabelaPadrao
											:cabecalho="cabecalhoMeusAgendamentos"
											:dados="dadosMeusAgendamentos"
											:itensPorPagina="itensPorPaginaMeusAgendamentos"
											:pagina="paginaMeusAgendamentos"
											:totalItens="totalItensMeusAgendamentos"
											altura="calc(100vh - 335px)"
                      selecionar
                      @filtros="filtrosMeusAgendamentos = $event"
                      @selecionados="selecionadosMeusAgendamentos = $event"
											@atualizar="buscarMeusAgendamentos"
											:carregando="carregandoTabelaMeusAgendamentos">
                      <template v-slot:[`body.status`]="{ item }">
												<span class="whitespace-nowrap">
													{{ item.StatusAgendamento ? item.StatusAgendamento.descricao : "" }}
												</span>
                      </template>
											<template v-slot:[`body.Funcionario.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
											</template>
											<template v-slot:[`body.Funcionario.cargo`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
											</template>
											<template v-slot:[`body.Funcionario.encarregado_sapo`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.encarregado_sapo
												}}</span>
											</template>
											<template v-slot:[`body.Funcionario.encarregado_producao`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.encarregado_producao
												}}</span>
											</template>
                      <template v-slot:[`body.aprovador_he.nome`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.aprovador_he ? item.aprovador_he.nome : ""
                          }}</span>
                      </template>
											<template v-slot:[`body.Funcionario.gestor`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.gestor }}</span>
											</template>
											<template v-slot:[`body.Setor.nome`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Setor.nome }}</span>
											</template>
                      <template v-slot:[`body.Funcionario.rota.numero`]="{ item }">
												<span class="whitespace-nowrap">{{
                            item.Funcionario.rota ? item.Funcionario.rota.numero : ""
                          }}</span>
                      </template>
											<template v-slot:[`body.Funcionario.ponto_embarque`]="{ item }">
												<span class="whitespace-nowrap">{{ item.Funcionario.ponto_embarque }}</span>
											</template>
											<template v-slot:[`body.Funcionario.direto_indireto`]="{ item }">
												<span class="whitespace-nowrap">{{
													item.Funcionario.direto_indireto
												}}</span>
											</template>

                      <template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
                        {{ horaExtra(item.Funcionario.hora_extra) }}
                      </template>
                      <template v-slot:[`body.Funcionario.hora_extra_projetada`]="{ item }">
                        {{ horaExtra(item.hora_extra_projetada) }}
                      </template>

										</TabelaPadrao>
									</div>
								</div>
							</template>
						</AppTabs>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex gap-2">
					<!--        <BotaoPadrao texto="Relátorio" >-->
					<!--          <img src="@/assets/icons/printer-b.svg" alt="" class="w-6 h-6">-->
					<!--        </BotaoPadrao>-->
					<BotaoPadrao
						texto="Desagendar"
            cor="bg-red-400 hover:!bg-red-500"
						v-if="tab === 'meusAgendamentos'"
						:disabled="selecionadosMeusAgendamentos.length <= 0"
						@click="mostrarDialogDesagendar = true">
						<img
							src="@/assets/icons/delete-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
					<BotaoPadrao texto="Excel" :disabled="desativarBtnExcel" @click="tab === 'aprovados' ? gerarExcelAprovados() : tab ==='pendentes' ? gerarExcelPendentes(): gerarExcelMeusAgendamentos()">
						<img
							src="@/assets/icons/excel-b.svg"
							alt=""
							class="w-6 h-6" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
		<DialogDesagendar
			v-if="mostrarDialogDesagendar"
			@cancelar="mostrarDialogDesagendar = false"
			@desagendado="desagendado"
			:dados="selecionadosMeusAgendamentos" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import { horaExtra } from "~/mixins/horaExtra"
	import AppTag from "~/components/Ui/AppTag.vue"
	import AppBadge from "~/components/Ui/AppBadge.vue"
	import DialogDesagendar from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogDesagendar.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
  import gerarExcel from "~/functions/gerarExcel";

	export default {
		mixins: [horaExtra],
		name: "DialogAgendamentos",
		components: {
			AppAlerta,
			AppBadge,
			AppTag,
			TabelaPadrao,
			AppFormCheckbox,
			BotaoPadrao,
			AppFormInput,
			AppTabs,
			BaseDialog,
			DialogDesagendar,
		},
		data() {
			return {
				tab: 'aprovados',
				dataAprovados: null,
				dataMeusAgendamentos: null,
				dataPendentes: null,
				mostrarAlerta: false,
				textoAlerta: "",

				// Aprovados
				cabecalhoAprovados: [
					{ nome: "Matricula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Encarregado/Lider Sapo", valor: "Funcionario.encarregado_sapo", filtro: true },
					{
						nome: "Encarregado/Lider Produção",
						valor: "Funcionario.encarregado_producao",
						filtro: true,
					},
					{ nome: "Gestor", valor: "Funcionario.gestor", filtro: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true, centralizar: true },
					{ nome: "HE atual", valor: "Funcionario.hora_extra", centralizar: true },
					{
						nome: "HE projetada",
						valor: "Funcionario.hora_extra_projetada",
						centralizar: true,
					},
					{ nome: "Turno", valor: "turno", filtro: true, centralizar: true },
					{ nome: "Motivo", valor: "motivo", filtro: true, },
					{ nome: "Aprovado por", valor: "aprovador_he.nome", filtro: true },
					{ nome: "Rota", valor: "Funcionario.rota.numero" },
					{ nome: "Ponto Embarque", valor: "Funcionario.ponto_embarque", filtro: true },
				],
				dadosAprovados: [],
				filtrosAprovados: {},
				itensPorPaginaAprovados: 50,
				totalItensAprovados: 0,
				paginaAprovados: 1,
				carregandoTabelaAprovados: false,
				diasAprovados: [],
				ordemAprovados: null,
        gerandoExcelAprovados:false,

				// Pendentes
				cabecalhoPendentes: [
          { nome: "Status", valor: "status" },
					{ nome: "Matricula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Encarregado/Lider Sapo", valor: "Funcionario.encarregado_sapo", filtro: true },
          {
            nome: "Encarregado/Lider Produção",
            valor: "Funcionario.encarregado_producao",
            filtro: true,
          },
					{ nome: "Gestor", valor: "Funcionario.gestor", filtro: true },
					{ nome: "Setor", valor: "Setor.nome", filtro: true, centralizar: true },
					{ nome: "HE atual", valor: "Funcionario.hora_extra", centralizar: true },
					{
						nome: "HE projetada",
						valor: "Funcionario.hora_extra_projetada",
						centralizar: true,
					},
					{ nome: "Turno", valor: "turno", filtro: true, centralizar: true },
					{ nome: "Motivo", valor: "motivo", filtro: true, },
					{ nome: "Situação", valor: "situacao", filtro: true },
					{ nome: "Rota", valor: "Funcionario.rota.numero" },
					{ nome: "Ponto Embarque", valor: "Funcionario.ponto_embarque", filtro: true },
				],
				dadosPendentes: [],
				filtrosPendentes: {},
				itensPorPaginaPendentes: 50,
				totalItensPendentes: 0,
				paginaPendentes: 1,
				carregandoTabelaPendentes: false,
				diasPendentes: [],
				ordemPendentes: null,
        gerandoExcelPendentes: false,

				//Meus agendamentos
				cabecalhoMeusAgendamentos: [
					{ nome: "Status", valor: "status" },
					{ nome: "Matricula", valor: "chapa", filtro: true, centralizar: true },
					{ nome: "Nome", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Encarregado/Lider Sapo", valor: "Funcionario.encarregado_sapo", filtro: true },
					{
						nome: "Encarregado/Lider Produção",
						valor: "Funcionario.encarregado_producao",
						filtro: true,
					},
					{ nome: "HE atual", valor: "Funcionario.hora_extra", centralizar: true },
					{
						nome: "HE projetada",
						valor: "Funcionario.hora_extra_projetada",
						centralizar: true,
					},
					{ nome: "Turno", valor: "turno", filtro: true, centralizar: true },
					{ nome: "Motivo", valor: "motivo", filtro: true },
					{ nome: "Situação", valor: "situacao", filtro: true, centralizar: true },
					{ nome: "Aprovado por", valor: "aprovador_he.nome", filtro: true },
					{ nome: "Rota", valor: "Funcionario.rota.numero" },
					{ nome: "Ponto Embarque", valor: "Funcionario.ponto_embarque", filtro: true },
				],
				dadosMeusAgendamentos: [],
				filtrosMeusAgendamentos: {},
				itensPorPaginaMeusAgendamentos: 50,
				totalItensMeusAgendamentos: 0,
				paginaMeusAgendamentos: 1,
				carregandoTabelaMeusAgendamentos: false,
				diasMeusAgendamentos: [],
				ordemMeusAgendamentos: null,
				selecionadosMeusAgendamentos: [],
				mostrarDialogDesagendar: false,
        gerandoExcelMeusAgendamentos: false,
			}
		},
		computed: {
			tabs() {
				return [
					{ nome: "Aprovados", valor: "aprovados" },
					{ nome: "Pendentes", valor: "pendentes" },
					{
						nome: "Meus agendamento",
						valor: "meusAgendamentos",
					},
				]
			},
      desativarBtnExcel(){
        if(this.tab === 'aprovados' && this.dadosAprovados.length === 0)
          return true

        if (this.tab === 'pendentes' && this.dadosPendentes.length === 0)
          return true

        return this.tab === 'meusAgendamentos' && this.dadosMeusAgendamentos.length === 0;
      }
		},
		created() {
			this.buscarDiasAprovados()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			//Aprovados

			async buscarDiasAprovados() {
				let resp = await this.$axios.$get("/hora_extra/agendamentos/aprovados_dias")

				if (!resp.falha) {
					let dados = resp.dados.dias
					this.diasAprovados = dados
					console.log(dados)
				}
			},

			async buscarAprovados() {
				this.carregandoTabelaAprovados = true

				let data = this.dataAprovados
				let ordem = this.ordemAprovados
				let filtros = this.filtrosAprovados

				let resp = await this.$axios.$get("/hora_extra/buscar/aprovados", {
					params: { data, ordem, filtros },
				})

				if (!resp.falha) {
					this.carregandoTabelaAprovados = false
					this.dadosAprovados = resp.dados.agendamentos
					this.totalItensAprovados = resp.dados.totalItens
					console.log(this.dadosAprovados)
				}
			},

			async buscarPorTagAprovados(data) {
				this.dataAprovados = data
				await this.buscarAprovados()
			},

      async gerarExcelAprovados(){
        this.gerandoExcelAprovados = true
        let dados = this.dadosAprovados

        let cabecalho = [
          "Matricula",
          "Nome",
          "Cargo",
          "Encarregado/Lider SAPO",
          "Encarregado/Lider Produção",
          "Gestor",
          "Setor",
          "HE Atual",
          "HE Projetada",
          "Turno",
          "Motivo",
          "Aprovado por",
          "Rota",
          "Ponto Embarque",
        ]
        let nomeArquivo

        nomeArquivo = "agendamento_aprovados"

        let itens = []
        for (let item of dados) {
          let temp = []
          temp.push(item.chapa)
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo: "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_producao ? item.Funcionario.encarregado_producao: "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_sapo ? item.Funcionario.encarregado_sapo: "")
          temp.push(item.Funcionario && item.Funcionario.gestor ? item.Funcionario.gestor: "")
          temp.push(item.Setor ? item.Setor.nome: "")
          temp.push(item.Funcionario ? this.horaExtra(item.Funcionario.hora_extra) : "")
          temp.push(item.hora_extra_projetada ? this.horaExtra(item.hora_extra_projetada) : "")
          temp.push(item.turno)
          temp.push(item.motivo)
          temp.push(item.aprovador_he ? item.aprovador_he.nome : "")
          temp.push(item.Funcionario && item.Funcionario.rota ? item.Funcionario.rota.numero: "")
          temp.push(item.Funcionario ? item.Funcionario.ponto_embarque: "")
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
        this.gerandoExcelAprovados = false
      },

			// Pendentes

			async buscarDiasPendentes() {
				let resp = await this.$axios.$get("/hora_extra/agendamentos/pendentes_dias")

				if (!resp.falha) {
					let dados = resp.dados.dias
					this.diasPendentes = dados
				}
			},

			async buscarPendentes() {
				this.carregandoTabelaPendentes = true

				let data = this.dataPendentes
        let ordem = this.ordemPendentes
        let filtros = this.filtrosPendentes

				let resp = await this.$axios.$get("/hora_extra/buscar/pendentes", { params: { data, ordem, filtros } })

				if (!resp.falha) {
					this.carregandoTabelaPendentes = false
					this.dadosPendentes = resp.dados.agendamentos
					this.totalItensPendentes = resp.dados.totalItens
				}
			},

			async buscarPorTagPendentes(data) {
				this.dataPendentes = data
				await this.buscarPendentes()
			},

      async gerarExcelPendentes() {
        this.gerandoExcelPendentes = true
        let dados = this.dadosPendentes

        let cabecalho = [
          "Status",
          "Matricula",
          "Nome",
          "Cargo",
          "Encarregado/Lider SAPO",
          "Encarregado/Lider Produção",
          "Gestor",
          "Setor",
          "HE Atual",
          "HE Projetada",
          "Turno",
          "Motivo",
          "Situação",
          "Rota",
          "Ponto Embarque",
        ]
        let nomeArquivo

        nomeArquivo = "agendamento_pendentes"

        let itens = []
        for (let item of dados) {
          let temp = []
          console.log(dados)
          temp.push(item.StatusAgendamento ? item.StatusAgendamento.descricao : "")
          temp.push(item.chapa)
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_producao ? item.Funcionario.encarregado_producao : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_sapo ? item.Funcionario.encarregado_sapo : "")
          temp.push(item.Funcionario && item.Funcionario.gestor ? item.Funcionario.gestor : "")
          temp.push(item.Setor ? item.Setor.nome : "")
          temp.push(item.Funcionario ? this.horaExtra(item.Funcionario.hora_extra) : "")
          temp.push(item.hora_extra_projetada ? this.horaExtra(item.hora_extra_projetada) : "")
          temp.push(item.turno)
          temp.push(item.motivo)
          temp.push(item.situacao)
          temp.push(item.Funcionario && item.Funcionario.rota ? item.Funcionario.rota.numero : "")
          temp.push(item.Funcionario ? item.Funcionario.ponto_embarque : "")
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
        this.gerandoExcelPendentes = false
      },

      // Meus agendamentos

			async buscarDiasMeusAgendamentos() {
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$get("/hora_extra/agendamentos/meus_agendamentos_dias", {
					params: { usuario_id },
				})

				if (!resp.falha) {
					let dados = resp.dados.dias
					this.diasMeusAgendamentos = dados
					console.log(dados)
				}
			},

			async buscarMeusAgendamentos() {
				this.carregandoTabelaMeusAgendamentos = true

				let data = this.dataMeusAgendamentos
				let usuario_id = this.$auth.user.id
        let ordem = this.ordemMeusAgendamentos
        let filtros = this.filtrosMeusAgendamentos

        console.log(filtros)

				let resp = await this.$axios.$get("/hora_extra/buscar/meus_agendamentos", {
					params: { data, usuario_id, ordem, filtros },
				})

				if (!resp.falha) {
					this.carregandoTabelaMeusAgendamentos = false
					this.dadosMeusAgendamentos = resp.dados.agendamentos
          console.log(resp.dados.agendamentos)
					this.totalItensMeusAgendamentos = resp.dados.totalItens
				}
			},

			async buscarPorTagMeusAgendamentos(data) {
				this.dataMeusAgendamentos = data
				this.selecionadosMeusAgendamentos = []
				await this.buscarMeusAgendamentos()
			},

			async desagendado(agendamentos) {
				for (let ag of agendamentos) {
					let idx = this.dadosMeusAgendamentos.findIndex((o) => o.id === ag)
					if (idx >= 0) this.dadosMeusAgendamentos.splice(idx, 1)
					this.diasMeusAgendamentos[this.dataMeusAgendamentos] =
						parseInt(this.diasMeusAgendamentos[this.dataMeusAgendamentos]) - 1
				}

				this.mostrarDialogDesagendar = false
				this.textoAlerta = "Desagendamento realizado com sucesso!"
				this.mostrarAlerta = true
				this.selecionadosMeusAgendamentos = []
			},

      async gerarExcelMeusAgendamentos() {
        this.gerandoExcelMeusAgendamentos = true
        let dados = this.dadosMeusAgendamentos

        let cabecalho = [
          "Status",
          "Matricula",
          "Nome",
          "Cargo",
          "Encarregado/Lider SAPO",
          "Encarregado/Lider Produção",
          "Gestor",
          "Setor",
          "HE Atual",
          "HE Projetada",
          "Turno",
          "Motivo",
          "Situação",
          "Aprovado por",
          "Rota",
          "Ponto Embarque",
        ]
        let nomeArquivo

        nomeArquivo = "agendamento_meus_agendamentos"

        let itens = []
        for (let item of dados) {
          let temp = []
          temp.push(item.StatusAgendamento ? item.StatusAgendamento.descricao : "")
          temp.push(item.chapa)
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_producao ? item.Funcionario.encarregado_producao : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_sapo ? item.Funcionario.encarregado_sapo : "")
          temp.push(item.Funcionario && item.Funcionario.gestor ? item.Funcionario.gestor : "")
          temp.push(item.Setor ? item.Setor.nome : "")
          temp.push(item.Funcionario ? this.horaExtra(item.Funcionario.hora_extra) : "")
          temp.push(item.hora_extra_projetada ? this.horaExtra(item.hora_extra_projetada) : "")
          temp.push(item.turno)
          temp.push(item.motivo)
          temp.push(item.situacao)
          temp.push(item.aprovador_he ? item.aprovador_he.nome : "")
          temp.push(item.Funcionario && item.Funcionario.rota ? item.Funcionario.rota.numero : "")
          temp.push(item.Funcionario ? item.Funcionario.ponto_embarque : "")
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
        this.gerandoExcelMeusAgendamentos = false
      },
		},
		watch: {
			tab(valor) {
				console.log(valor)

				if (valor === "pendentes" && this.diasPendentes.length === 0) {
					this.buscarDiasPendentes()
				}

				if (valor === "meusAgendamentos" && this.diasMeusAgendamentos.length === 0) {
					this.buscarDiasMeusAgendamentos()
				}
			},
		},
	}
</script>

<style scoped></style>
