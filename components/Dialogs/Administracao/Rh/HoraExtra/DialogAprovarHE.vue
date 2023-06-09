<template>
	<div style="z-index: 102">
		<BaseDialog
			titulo="Aprovar HE"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2">
					<AppTabs
						:tabs="tabs"
						@tab="tab = $event">
						<template v-slot:[`tab.gestorArea`]="{ item }">
							<div class="px-2 flex flex-col gap-y-2">
								<div class="flex justify-between gap-x-2">
									<div class="flex gap-2">
										<AppFormInput
											id="dataGestorArea"
											type="date"
											v-model="dataGestorArea"
											label="Data do agendamento" />
										<div class="flex items-end">
											<BotaoPadrao
                        :disabled="dataGestorArea === null || dataGestorArea === ''"
												cor="bg-gray-600"
												@click="buscarAgendamentosGestor()">
												<img
													src="@/assets/icons/magnifier-w.svg"
													alt=""
													class="w-6 h-6" />
											</BotaoPadrao>
										</div>
									</div>
									<div class="flex grow">
										<div class="flex items-end gap-3">
											<div v-for="key of Object.keys(pendDiasGestorArea)">
												<AppBadge
													cor="!bg-red-400"
													corFonte="bg-white"
                          v-if="pendDiasGestorArea[key] !== 0"
													:texto="pendDiasGestorArea[key]">
													<AppTag
														@click="buscarPorTagGestor(key)"
														cor="bg-blue-300 hover:bg-blue-400"
														:texto="$dayjs(key).format('DD/MM')"
														fonte="text-2xl"
														:clicavel="true" />
												</AppBadge>
											</div>
										</div>
									</div>
									<div class="flex gap-3">
										<AppFormSwitch
											label="Mostrar todos"
											v-model="mostrarTodosGestor" />
                    <div class="bg-gray-200 border border-gray-300 flex flex-col px-2 py-1  items-stretch text-end rounded">
                      <div class="text-green-900">Aprovados: {{ agendAprovados }}</div>
                      <div class="text-red-900">Negados: {{ agendNegados }}</div>
                    </div>
									</div>
								</div>
								<div>
									<TabelaPadrao
										:cabecalho="cabecalho"
										:dados="dadosFiltradoGestor"
                    @filtros="filtrosGestor = $event"
                    @ordem="ordemGestor = $event"
										:totalItens="totalItensGestor"
										altura="calc(100vh - 335px)"
                    selecionar
                    @selecionados="selecionadosGestor = $event"
										@atualizar="buscarAgendamentosGestor()"
										:carregando="carregandoTabelaGestor"
										:temRodape="false">
										<template v-slot:[`body.status`]="{ item }">
											<div
												v-if="item.aprovacao_he === null"
												class="bg-yellow-300 text-black px-2 rounded whitespace-nowrap">
												Aguardando
											</div>
											<div
												v-if="item.aprovacao_he === true"
												class="bg-green-400 text-black px-2 rounded whitespace-nowrap">
												Aprovado
											</div>
											<div
												v-if="item.aprovacao_he === false"
												class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
												Negado
											</div>
										</template>
										<template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
											{{ horaExtra(item.Funcionario.hora_extra) }}
										</template>
                    <template v-slot:[`body.heProjetada`]="{ item }">
                      {{ horaExtra(item.hora_extra_projetada) }}
                    </template>
										<template v-slot:[`body.Funcionario.nome`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
										</template>
										<template v-slot:[`body.Funcionario.cargo`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
										</template>
										<template v-slot:[`body.Funcionario.encarregado_sapo`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.encarregado_sapo }}</span>
										</template>
                    <template v-slot:[`body.Funcionario.encarregado_producao`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.encarregado_producao }}</span>
                    </template>
										<template v-slot:[`body.Funcionario.gestor`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.gestor }}</span>
										</template>
										<template v-slot:[`body.Setor.nome`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Setor.nome }}</span>
										</template>
                    <template v-slot:[`body.agendado_por.nome`]="{ item }">
											<span class="whitespace-nowrap" v-if="item.agendado_por">{{ item.agendado_por.nome }}</span>
										</template>
										<template v-slot:[`body.Funcionario.rota`]="{ item }">
											<span class="whitespace-nowrap">{{
												item.Funcionario.rota ? item.Funcionario.rota.numero : ""
											}}</span>
										</template>
										<template v-slot:[`body.Funcionario.ponto_embarque`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.ponto_embarque }}</span>
										</template>
										<template v-slot:[`body.Funcionario.direto_indireto`]="{ item }">
											<span class="whitespace-nowrap">{{ item.Funcionario.direto_indireto }}</span>
										</template>
									</TabelaPadrao>
								</div>
							</div>
						</template>
						<template v-slot:[`tab.siteManager`]="{ item }">
              <div class="px-2 flex flex-col gap-y-2">
                <div class="flex justify-between gap-x-2">
                  <div class="flex gap-2">
                    <AppFormInput
                      id="dataGestorArea"
                      type="date"
                      v-model="dataSiteManager"
                      label="Data do agendamento"/>
                    <div class="flex items-end">
                      <BotaoPadrao
                        :disabled="dataSiteManager === null || dataSiteManager === ''"
                        cor="bg-gray-600"
                        @click="buscarAgendamentosSiteManager()">
                        <img
                          src="@/assets/icons/magnifier-w.svg"
                          alt=""
                          class="w-6 h-6"/>
                      </BotaoPadrao>
                    </div>
                  </div>
                  <div class="flex grow">
                    <div class="flex items-end gap-3">
                      <div v-for="key of Object.keys(pendDiasSiteManager)">
                        <AppBadge
                          cor="!bg-red-400"
                          corFonte="bg-white"
                          v-if="pendDiasSiteManager[key] !== 0"
                          :texto="pendDiasSiteManager[key]">
                          <AppTag
                            @click="buscarPorTagSiteManager(key)"
                            cor="bg-blue-300 hover:bg-blue-400"
                            :texto="$dayjs(key).format('DD/MM')"
                            fonte="text-2xl"
                            :clicavel="true"/>
                        </AppBadge>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-3">
                    <AppFormSwitch
                      label="Mostrar todos"
                      v-model="mostrarTodosSiteManager"/>
                    <div
                      class="bg-gray-200 border border-gray-300 flex flex-col px-2 py-1  items-stretch text-end rounded">
                      <div class="text-green-900">Aprovados: {{ agendAprovadosSiteManager }}</div>
                      <div class="text-red-900">Negados: {{ agendNegadosSiteManager }}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <TabelaPadrao
                    :cabecalho="cabecalho"
                    :dados="dadosFiltradoSiteManager"
                    @filtros="filtrosSiteManager = $event"
                    @ordem="ordemSiteManager = $event"
                    :totalItens="totalItensSiteManager"
                    altura="calc(100vh - 335px)"
                    @atualizar="buscarAgendamentosSiteManager()"
                    :carregando="carregandoTabelaSiteManager"
                    selecionar
                    @selecionados="selecionadosSiteManager = $event"
                    :temRodape="false">
                    <template v-slot:[`body.status`]="{ item }">
                      <div
                        v-if="item.aprovacao_situacao === null"
                        class="bg-yellow-300 text-black px-2 rounded whitespace-nowrap">
                        Aguardando
                      </div>
                      <div
                        v-if="item.aprovacao_situacao === true"
                        class="bg-green-400 text-black px-2 rounded whitespace-nowrap">
                        Aprovado
                      </div>
                      <div
                        v-if="item.aprovacao_situacao === false"
                        class="bg-red-400 text-black px-2 rounded whitespace-nowrap">
                        Negado
                      </div>
                    </template>
                    <template v-slot:[`body.Funcionario.hora_extra`]="{ item }">
                      {{ horaExtra(item.Funcionario.hora_extra) }}
                    </template>
                    <template v-slot:[`body.heProjetada`]="{ item }">
                      {{ horaExtra(item.hora_extra_projetada) }}
                    </template>
                    <template v-slot:[`body.Funcionario.nome`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.nome }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.cargo`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.cargo }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.encarregado_sapo`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.encarregado_sapo }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.encarregado_producao`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.encarregado_producao }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.gestor`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.gestor }}</span>
                    </template>
                    <template v-slot:[`body.agendado_por.nome`]="{ item }">
                      <span class="whitespace-nowrap" v-if="item.agendado_por">{{ item.agendado_por.nome }}</span>
                    </template>
                    <template v-slot:[`body.Setor.nome`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Setor.nome }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.rota`]="{ item }">
											<span class="whitespace-nowrap">{{
                          item.Funcionario.rota ? item.Funcionario.rota.numero : ""
                        }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.ponto_embarque`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.ponto_embarque }}</span>
                    </template>
                    <template v-slot:[`body.Funcionario.direto_indireto`]="{ item }">
                      <span class="whitespace-nowrap">{{ item.Funcionario.direto_indireto }}</span>
                    </template>
                  </TabelaPadrao>
                </div>
              </div>
						</template>
					</AppTabs>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
        <div class="flex gap-2 items-center">
          <div class="flex flex-col">
            <span class="text-lg text-red-400" v-if="ehAnteriorHoje"><strong>Não é permitido aprovar HE para dias anteriores a hoje.</strong></span>
            <span class="text-lg text-red-400" v-if="!liberado"><strong>Fora do horário permitido para aprovação.</strong></span>
          </div>
          <BotaoPadrao
            texto="Aprovar/Negar"
            class="flex"
            :disabled="desaBotaoAprovarNegar"
            cor="bg-blue-500 hover:bg-blue-600"
            @click="tab === 'gestorArea' ? mostrarDialogConfirmarAprovacao = true : mostrarDialogConfirmarAprovacaoSiteManager = true">
            <img
              src="@/assets/icons/check-b.svg"
              alt=""
              class="w-7 h-7"/>
          </BotaoPadrao>
          <BotaoPadrao texto="Excel" :disabled="desativarBtnExcel"
                       @click="tab === 'gestorArea' ? gerarExcelGestor() : gerarExcelSiteManager()">
            <img
              src="@/assets/icons/excel-b.svg"
              alt=""
              class="w-6 h-6" />
          </BotaoPadrao>
        </div>
			</template>
		</BaseDialog>
		<DialgoConfirmarAprovacao
			v-if="mostrarDialogConfirmarAprovacao"
			@cancelar="mostrarDialogConfirmarAprovacao = false"
			:dados="selecionadosGestor"
			:data="dataGestorArea"
			tipoAprovacao="gestorArea"
			@aprovado="aprovado" />
    <DialgoConfirmarAprovacao
      v-if="mostrarDialogConfirmarAprovacaoSiteManager"
      @cancelar="mostrarDialogConfirmarAprovacaoSiteManager = false"
      :dados="selecionadosSiteManager"
      :data="dataSiteManager"
      tipoAprovacao="siteManager"
      @aprovado="aprovadoSiteManager"/>
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
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import AppFormSwitch from "~/components/Ui/AppFormSwitch.vue"
	import DialgoConfirmarAprovacao from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialgoConfirmarAprovacao.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppTag from "~/components/Ui/AppTag.vue"
	import AppBadge from "~/components/Ui/AppBadge.vue"
  import {horaExtra} from "~/mixins/horaExtra";
  import gerarExcel from "~/functions/gerarExcel";

	export default {
    mixins: [horaExtra],
		components: {
			AppBadge,
			AppTag,
			AppAlerta,
			DialgoConfirmarAprovacao,
			AppFormSwitch,
			AppFormCheckbox,
      TabelaPadrao,
			BotaoPadrao,
			AppFormInput,
			AppTabs,
			BaseDialog,
		},
		data() {
			return {
				dataGestorArea: null,
				dataSiteManager: null,
				dadosGestor: [],
				filtrosGestor: {},
				itensPorPaginaGestor: 50,
				totalItensGestor: 0,
				paginaGestor: 1,
				carregandoTabelaGestor: false,
				selecionadosGestor: [],
        ordemGestor: null,
				mostrarDialogConfirmarAprovacao: false,
				tipoAprovacao: "gestorArea",
				mostrarAlerta: false,
				textoAlerta: null,
				tab: 'gestorArea',
				mostrarTodosGestor: false,
				pendDiasGestorArea: [],
				mostrarTodosSiteManager: false,
				pendDiasSiteManager: [],
				dadosSiteManager: [],
				filtrosSiteManager: {},
				itensPorPaginaSiteManager: 50,
				totalItensSiteManager: 0,
				paginaSiteManager: 1,
				carregandoTabelaSiteManager: false,
				selecionadosSiteManager: [],
        ordemSiteManager: null,
        mostrarDialogConfirmarAprovacaoSiteManager: false,
        textoErro: ""
			}
		},
    props: {
      liberado: {
        type: [String, Boolean]
      }
    },
		computed: {
      cabecalho(){
        let cabecalho =  [
          { nome: "Status", valor: "status", centralizar: true },
          { nome: "HE atual", valor: "Funcionario.hora_extra", ordenar: true, centralizar: true },
          { nome: "HE projetada", valor: "heProjetada", ordenar: true, centralizar: true },
          { nome: "Motivo", valor: "motivo", filtro: true, centralizar: true },
          { nome: "Matricula", valor: "chapa", ordenar: true, filtro: true, centralizar: true },
          { nome: "Nome", valor: "Funcionario.nome", filtro: true, ordenar: true },
          { nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
          { nome: "Encarregado/Lider Sapo", valor: "Funcionario.encarregado_sapo", filtro: true },
          { nome: "Encarregado/Lider Produção", valor: "Funcionario.encarregado_producao", filtro: true },
          { nome: "Gestor", valor: "Funcionario.gestor", filtro: true },
          { nome: "Agendado por", valor: "agendado_por.nome", filtro: true },
          { nome: "Setor", valor: "Setor.nome", filtro: true, centralizar: true },
          { nome: "Turno", valor: "turno", filtro: true, centralizar: true },
        ]

        if(this.tab === 'siteManager'){
          cabecalho.push({ nome: "Situação", valor: "situacao", filtro: true, centralizar: true })
        }

        return cabecalho
      },

      desativarBtnExcel(){
        if(this.tab === 'gestorArea' && this.dadosGestor.length === 0)
          return true

        return this.tab === 'siteManager' && this.dadosSiteManager.length === 0
      },

			tabs() {
				return [
					{ nome: "Gestor da Área", valor: "gestorArea" },
					{ nome: "Site Manager", valor: "siteManager" },
				]
			},
			data() {
				if (this.tipoAprovacao === "gestorArea") return this.dataGestorArea
				if (this.tipoAprovacao === "siteManager") return this.dataSiteManager
			},

			dadosFiltradoGestor() {
				let dados = [...this.dadosGestor]

				if (!this.mostrarTodosGestor) return dados.filter((o) => o.aprovacao_he === null)
				else return dados
			},

			desaBotaoAprovarNegar() {
				let hoje = this.$dayjs().format("YYYY-MM-DD")

        if(!this.liberado)
          return !this.liberado

				if (this.tab === "gestorArea"){
          return (
            this.selecionadosGestor.length <= 0 ||
            this.dataGestorArea < hoje ||
            this.dataGestorArea === null ||
            this.dataGestorArea === ""
          )
        } else if(this.tab === "siteManager"){
          return this.selecionadosSiteManager.length <= 0 ||
            this.dataSiteManager < hoje ||
            this.dataSiteManager === null ||
            this.dataSiteManager === ""
        }

			},
      agendAprovados(){
        return this.dadosGestor.reduce((contador, item) => {
          return item.aprovacao_he === true ? contador + 1 : contador;
        }, 0);
      },
      agendNegados() {
        return this.dadosGestor.reduce((contador, item) => {
          return item.aprovacao_he === false ? contador + 1 : contador;
        }, 0);
      },

      //Site Manager

      dadosFiltradoSiteManager() {
        let dados = [...this.dadosSiteManager]

        if (!this.mostrarTodosSiteManager) return dados.filter((o) => o.aprovacao_situacao === null)
        else return dados
      },

      agendAprovadosSiteManager() {
        return this.dadosSiteManager.reduce((contador, item) => {
          return item.aprovacao_situacao === true ? contador + 1 : contador;
        }, 0);
      },
      agendNegadosSiteManager() {
        return this.dadosSiteManager.reduce((contador, item) => {
          return item.aprovacao_situacao === false ? contador + 1 : contador;
        }, 0);
      },

      ehAnteriorHoje(){
        let hoje = this.$dayjs().format("YYYY-MM-DD")

        return this.dataGestorArea < hoje || this.dataSiteManager < hoje
      }
		},
		created() {
			this.buscarDiasAgendamentosPendentes()
			this.buscarDiasAgendamentosPendentesSiteManager()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarDiasAgendamentosPendentes() {
				let data = this.$dayjs().format("YYYY-MM-DD")
				let setor_id = this.$auth.user.setor_id

				let resp = await this.$axios.$get(
					"/hora_extra/aprovacao/gestor_area/todas_pendencias_dias",
					{
						params: { data, setor_id },
					},
				)

				if (!resp.falha) {
					let dias = resp.dados.dias
					this.pendDiasGestorArea = dias
				}
			},

			async buscarAgendamentosGestor() {
				let data = this.dataGestorArea
				let setor_id = this.$auth.user.setor_id
        let ordem = this.ordemGestor

				let resp = await this.$axios.$get("/hora_extra/aprovacao/gestor_area", {
					params: { data, setor_id, ordem: ordem, filtros: this.filtrosGestor },
				})

				if (!resp.falha) {
					this.dadosGestor = resp.dados.aprovacoes
					this.selecionadosGestor = []
				}
			},

			async buscarPorTagGestor(data) {
				this.dataGestorArea = data
				this.buscarAgendamentosGestor()
			},

			async aprovado(aprovacao, agendamentos) {
				this.mostrarDialogConfirmarAprovacao = false

				if (aprovacao) this.textoAlerta = "Agendamentos aprovados com sucesso!"
				else if (!aprovacao) this.textoAlerta = "Agendamentos negados com sucesso!"

				if (this.tab === "gestorArea") {
					for (let agen of agendamentos) {
						let idx = this.dadosGestor.findIndex((o) => o.id === agen)
            if(this.dadosGestor[idx].aprovacao_he === null){
              this.pendDiasGestorArea[this.data] -= 1
            }
						this.dadosGestor[idx].aprovacao_he = aprovacao
					}
				}

				this.mostrarAlerta = true
				this.selecionadosGestor = []
			},

      async gerarExcelGestor() {
        let dados = this.dadosGestor

        let cabecalho = [
          "Status",
          "HE Atual",
          "HE Projetada",
          "Motivo",
          "Matricula",
          "Nome",
          "Cargo",
          "Encarregado/Lider SAPO",
          "Encarregado/Lider Produção",
          "Gestor",
          "Setor",
          "Turno",
        ]
        let nomeArquivo

        nomeArquivo = "agendamentos_gestor"

        let itens = []
        for (let item of dados) {
          let temp = []
          temp.push(item.aprovacao_he === null ? "Aguardando" : item.aprovacao_he === true ? "Aprovado" : "Negado")
          temp.push(item.Funcionario ? this.horaExtra(item.Funcionario.hora_extra) : "")
          temp.push(item.hora_extra_projetada ? this.horaExtra(item.hora_extra_projetada) : "")
          temp.push(item.motivo)
          temp.push(item.chapa)
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_producao ? item.Funcionario.encarregado_producao : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_sapo ? item.Funcionario.encarregado_sapo : "")
          temp.push(item.Funcionario && item.Funcionario.gestor ? item.Funcionario.gestor : "")
          temp.push(item.Setor ? item.Setor.nome : "")
          temp.push(item.turno)
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
      },


      // Site manager

      async buscarDiasAgendamentosPendentesSiteManager() {

        let resp = await this.$axios.$get(
          "/hora_extra/aprovacao/site_manager/todas_pendencias_dias",
        )

        if (!resp.falha) {
          let dias = resp.dados.dias

          this.pendDiasSiteManager = dias
        }
      },

      async buscarAgendamentosSiteManager() {
        let data = this.dataSiteManager
        let setor_id = this.$auth.user.setor_id
        let ordem = this.ordemSiteManager

        let resp = await this.$axios.$get("/hora_extra/aprovacao/site_manager", {
          params: {data, setor_id, ordem: ordem, filtros: this.filtrosGestor},
        })

        if (!resp.falha) {
          this.dadosSiteManager = resp.dados.aprovacoes

          this.selecionadosGestor = []
        }
      },

      async buscarPorTagSiteManager(data) {
        this.dataSiteManager = data
        this.buscarAgendamentosSiteManager()
      },

      async aprovadoSiteManager(aprovacao, agendamentos) {
        this.mostrarDialogConfirmarAprovacaoSiteManager = false

        if (aprovacao) this.textoAlerta = "Agendamentos aprovados com sucesso!"
        else if (!aprovacao) this.textoAlerta = "Agendamentos negados com sucesso!"

          for (let agen of agendamentos) {
            let idx = this.dadosSiteManager.findIndex((o) => o.id === agen)
            if (this.dadosSiteManager[idx].aprovacao_situacao === null) {
              this.pendDiasSiteManager[this.dataSiteManager] -= 1
            }
            this.dadosSiteManager[idx].aprovacao_situacao = aprovacao
          }


        this.mostrarAlerta = true
        this.selecionadosSiteManager = []
      },

      async gerarExcelSiteManager() {
        let dados = this.dadosSiteManager

        let cabecalho = [
          "Status",
          "HE atual",
          "HE projetada",
          "Motivo",
          "Matricula",
          "Nome",
          "Cargo",
          "Encarregado/Lider SAPO",
          "Encarregado/Lider Produção",
          "Gestor",
          "Setor",
          "Turno",
          "Situação",
        ]
        let nomeArquivo

        nomeArquivo = "agendamentos_site_manager"

        let itens = []
        for (let item of dados) {
          let temp = []
          console.log(dados)
          temp.push(item.aprovacao_situacao === null ? "Aguardando" : item.aprovacao_situacao === true ? "Aprovado" : "Negado")
          temp.push(item.Funcionario ? this.horaExtra(item.Funcionario.hora_extra) : "")
          temp.push(item.hora_extra_projetada ? this.horaExtra(item.hora_extra_projetada) : "")
          temp.push(item.motivo)
          temp.push(item.chapa)
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_sapo ? item.Funcionario.encarregado_sapo : "")
          temp.push(item.Funcionario && item.Funcionario.encarregado_producao ? item.Funcionario.encarregado_producao : "")
          temp.push(item.Funcionario && item.Funcionario.gestor ? item.Funcionario.gestor : "")
          temp.push(item.Setor ? item.Setor.nome : "")
          temp.push(item.turno)
          temp.push(item.situacao)
          itens.push(temp)
        }

        gerarExcel(cabecalho, itens, nomeArquivo)
      },
		},
	}
</script>

<style scoped></style>
