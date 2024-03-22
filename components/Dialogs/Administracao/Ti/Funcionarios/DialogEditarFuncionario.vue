<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			class="uppercase"
			titulo="EDITAR FUNCIONÁRIO"
			:carregando="carregando"
			@cancelar="cancelar()">
			<template v-slot:corpo>
        <div class="flex gap-2 px-2 w-full justify-between mb-2 border-b-2 border-gray-700" v-if="funcionario">
          <div class="flex flex-col">
            <span class="titulo-campo">MATRÍCULA</span>
            <span class="texto-campo">{{ funcionario.chapa }}</span>
          </div>
          <div class="flex flex-col">
            <span class="titulo-campo">NOME</span>
            <span class="texto-campo">{{ funcionario.nome }}</span>
          </div>
          <div class="flex flex-col">
            <span class="titulo-campo">CARGO</span>
            <span class="texto-campo">{{ funcionario.cargo }}</span>
          </div>
          <div class="flex flex-col">
            <span class="titulo-campo">SETOR</span>
            <span class="texto-campo">{{ funcionario.setor ? funcionario.setor.nome : "SEM SETOR" }}</span>
          </div>
        </div>
				<AppTabs
					:tabs="tabs"
					@tab="tab = $event">
					<template v-slot:[`tab.desktopNotebook`]="{ item }">
						<div class="px-2 flex gap-2 flex-col mt-2">
							<div class="flex w-full justify-end">
								<BotaoPadrao
									@clique="mostrarDialogTrocarDesktopNotebook = true"
									texto="Adicionar"
									cor="bg-blue-400 hover:!bg-blue-500">
									<img
										src="@/assets/icons/add-b.svg"
										alt=""
										class="w-7 h-7" />
								</BotaoPadrao>
							</div>
              <div>
                <TabelaPadrao
                  id="centroCusto"
                  :cabecalho="cabecalhoDeskNote"
                  :dados="dadosDeskNote"
                  :temRodape="false"
                  altura="calc(100vh - 350px)"
                  :temDetalhes="true">
                  <template v-slot:[`detalhes`]="{ item }">
                    <div class="grid grid-cols-3">
                      <span v-if="item.ProcessadorDeskNoteTI">PROCESSADOR: <strong>{{item.ProcessadorDeskNoteTI.nome }}</strong></span>
                      <span v-if="item.RamDeskNoteTI">MEMÓRIA RAM: <strong>{{item.RamDeskNoteTI.nome }}</strong></span>
                      <span v-if="item.HDDeskNoteTI">DISCO: <strong>{{item.HDDeskNoteTI.nome }}</strong></span>
                      <span v-if="item.SistemaOpeDeskNoteTI">SISTEMA OPERACIONAL: <strong>{{item.SistemaOpeDeskNoteTI.nome }}</strong></span>
                      <span v-if="item.LocalInstalacaoTI">LOCAL DE INSTALAÇÃO: <strong>{{item.LocalInstalacaoTI.nome }}</strong></span>
                      <span v-if="item.lote">LOTE: <strong>{{item.lote }}</strong></span>
                      <span v-if="item.data_compra">DATA DE COMPRA: <strong>{{ $dayjs(item.data_compra).format("DD/MM/YYYY") }}</strong></span>
                      <span v-if="item.ProcedenciaTI">PROCEDÊNCIA: <strong>{{item.ProcedenciaTI.nome }}</strong></span>
                      <span v-if="item.ultima_verificacao">ÚLTIMA VERIFICAÇÃO T.I: <strong>{{ $dayjs(item.ultima_verificacao).format("DD/MM/YYYY") }}</strong></span>
                      <span v-if="item.data_formatacao">FORMATAÇÃO: <strong>{{ $dayjs(item.data_formatacao).format("DD/MM/YYYY") }}</strong></span>
                    </div>
                  </template>
                  <template v-slot:[`body.acoes`]="{ item }">
                    <div class="flex gap-1">
                      <BotaoPadrao
                        @clique="deskNotetiIdPrDeletar = item.id"
                        v-if="deskNotetiIdPrDeletar !== item.id"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="deskNotetiIdPrDeletar === item.id"
                        @clique="deskNotetiIdPrDeletar = null"
                        cor="!bg-blue-200 hover:!bg-blue-300"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/back-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="deskNotetiIdPrDeletar === item.id"
                        @clique="enviarDeskNoteEstoque(item)"
                        cor="!bg-red-300 hover:!bg-red-400"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                    </div>
                  </template>
                  <template v-slot:[`body.MarcaTI.nome`]="{ item }">
                    <span>{{ item.MarcaTI ? item.MarcaTI.nome : ""}}</span>
                  </template>
                  <template v-slot:[`body.ModeloTI.nome`]="{ item }">
                    <span>{{ item.ModeloTI ? item.ModeloTI.nome : ""}}</span>
                  </template>
                  <template v-slot:[`body.data_entrega`]="{ item }">
                    <span>{{ item.data_entrega ? $dayjs(item.data_entrega).format('DD/MM/YYYY HH:mm') : ""}}</span>
                  </template>
                  <template v-slot:[`body.tipo`]="{ item }">
                    <div class="px-2 rounded text-center text-black" :class="{'bg-slate-400': item.tipo === 'desktop', 'bg-blue-300': item.tipo === 'notebook'}">
                      <span>{{ item.tipo }}</span>
                    </div>
                  </template>
                </TabelaPadrao>
              </div>
						</div>
					</template>
          <template v-slot:[`tab.monitor`]="{ item }">
            <div class="px-2 flex gap-2 flex-col mt-2">
              <div class="flex w-full justify-end">
                <BotaoPadrao
                  @clique="mostrarDialogAdicionarMonitor = true"
                  texto="Adicionar"
                  cor="bg-blue-400 hover:!bg-blue-500">
                  <img
                    src="@/assets/icons/add-b.svg"
                    alt=""
                    class="w-7 h-7" />
                </BotaoPadrao>
              </div>
              <div>
                <TabelaPadrao
                  id="centroCusto"
                  :cabecalho="cabecalhoMonitor"
                  :dados="dadosMonitor"
                  :temRodape="false"
                  altura="calc(100vh - 350px)"
                  :temDetalhes="true">
                  <template v-slot:[`detalhes`]="{ item }">
                    <div class="grid grid-cols-3">
                      <span v-if="item.LocalInstalacaoTI">LOCAL DE INSTALAÇÃO: <strong>{{item.LocalInstalacaoTI.nome }}</strong></span>
                    </div>
                  </template>
                  <template v-slot:[`body.acoes`]="{ item }">
                    <div class="flex gap-1">
                      <BotaoPadrao
                        @clique="monitortiIdPrDeletar = item.id"
                        v-if="monitortiIdPrDeletar !== item.id"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="monitortiIdPrDeletar === item.id"
                        @clique="monitortiIdPrDeletar = null"
                        cor="!bg-blue-200 hover:!bg-blue-300"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/back-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="monitortiIdPrDeletar === item.id"
                        @clique="enviarMonitorEstoque(item)"
                        cor="!bg-red-300 hover:!bg-red-400"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                    </div>
                  </template>
                  <template v-slot:[`body.MarcaTI.nome`]="{ item }">
                    <span>{{ item.MarcaTI ? item.MarcaTI.nome : ""}}</span>
                  </template>
                  <template v-slot:[`body.ModeloTI.nome`]="{ item }">
                    <span>{{ item.ModeloTI ? item.ModeloTI.nome : ""}}</span>
                  </template>
                  <template v-slot:[`body.data_entrega`]="{ item }">
                    <span>{{ item.data_entrega ? $dayjs(item.data_entrega).format('DD/MM/YYYY HH:mm'): ""}}</span>
                  </template>
                </TabelaPadrao>
              </div>
            </div>
          </template>
          <template v-slot:[`tab.equipamento`]="{ item }">
            <div class="px-2 flex gap-2 flex-col">
              <div class="flex gap-2 w-full">
                <AppFormSelectCompleto
                  style="z-index: 101 !important"
                  obrigatorio
                  id="equipamento"
                  label="Equipamentos"
                  :options="equipamentos"
                  v-model="equipamentoti_id"
                  class="grow" />
                <div class="flex items-end">

                <BotaoPadrao texto="adicionar" cor="bg-blue-300 hover:!bg-blue-400" @clique="adicionarEquipamento()" :disabled="equipamentoti_id === null">
                  <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
                </BotaoPadrao>
                </div>
              </div>
              <div class="flex w-full">
                <TabelaPadrao
                  id="centroCusto"
                  :cabecalho="cabecalhoEquipamento"
                  :dados="dadosEquipamento"
                  :temRodape="false"
                  altura="calc(100vh - 350px)"
                  :temDetalhes="false">
                  <template v-slot:[`body.acoes`]="{ item }">
                    <div class="flex gap-1">
                    <BotaoPadrao
                      @clique="equipamentotiIdPrDeletar = item.id"
                      v-if="equipamentotiIdPrDeletar !== item.id"
                      icone>
                      <div class="w-7 h-7 flex items-center justify-center">
                        <img
                          src="@/assets/icons/delete-b.svg"
                          alt=""
                          class="w-6 h-6" />
                      </div>
                    </BotaoPadrao>
                    <BotaoPadrao
                      v-if="equipamentotiIdPrDeletar === item.id"
                      @clique="equipamentotiIdPrDeletar = null"
                      cor="!bg-blue-200 hover:!bg-blue-300"
                      icone>
                      <div class="w-7 h-7 flex items-center justify-center">
                        <img
                          src="@/assets/icons/back-b.svg"
                          alt=""
                          class="w-6 h-6" />
                      </div>
                    </BotaoPadrao>
                    <BotaoPadrao
                      v-if="equipamentotiIdPrDeletar === item.id"
                      @clique="removerEquipamento()"
                      cor="!bg-red-300 hover:!bg-red-400"
                      icone>
                      <div class="w-7 h-7 flex items-center justify-center">
                        <img
                          src="@/assets/icons/delete-b.svg"
                          alt=""
                          class="w-6 h-6" />
                      </div>
                    </BotaoPadrao>
                    </div>
                  </template>
                </TabelaPadrao>
              </div>
            </div>
          </template>
          <template v-slot:[`tab.licenca`]="{ item }">
            <div class="px-2 flex gap-2 flex-col">
              <div class="flex gap-2 w-full">
                <AppFormSelectCompleto
                  style="z-index: 101 !important"
                  obrigatorio
                  id="licenca"
                  label="Licenças"
                  :options="licencas"
                  v-model="licencati_id"
                  class="grow" />
                <div class="flex items-end">
                  <BotaoPadrao texto="adicionar" cor="bg-blue-300 hover:!bg-blue-400" @clique="adicionarLicenca()"
                               :disabled="licencati_id === null">
                    <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
                  </BotaoPadrao>
                </div>
              </div>
              <div class="flex w-full">
                <TabelaPadrao
                  id="centroCusto"
                  :cabecalho="cabecalhoLicenca"
                  :dados="dadosLicenca"
                  :temRodape="false"
                  altura="calc(100vh - 350px)"
                  :temDetalhes="false">
                  <template v-slot:[`body.acoes`]="{ item }">
                    <div class="flex gap-1">
                      <BotaoPadrao
                        @clique="licencatiIdPrDeletar = item.id"
                        v-if="licencatiIdPrDeletar !== item.id"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="licencatiIdPrDeletar === item.id"
                        @clique="licencatiIdPrDeletar = null"
                        cor="!bg-blue-200 hover:!bg-blue-300"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/back-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                      <BotaoPadrao
                        v-if="licencatiIdPrDeletar === item.id"
                        @clique="removerLicenca()"
                        cor="!bg-red-300 hover:!bg-red-400"
                        icone>
                        <div class="w-7 h-7 flex items-center justify-center">
                          <img
                            src="@/assets/icons/delete-b.svg"
                            alt=""
                            class="w-6 h-6" />
                        </div>
                      </BotaoPadrao>
                    </div>
                  </template>
                </TabelaPadrao>
              </div>
            </div>
          </template>
				</AppTabs>
			</template>
			<template v-slot:rodape-btn-direito> </template>
		</BaseDialog>
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
		<DialogTrocarDesktopNotebook
			:funcionario_id="funcionario_id"
			v-if="mostrarDialogTrocarDesktopNotebook"
			@trocado="deskNoteTrocado"
			@cancelar="mostrarDialogTrocarDesktopNotebook = false" />
    <DialogAdicionarMonitor v-if="mostrarDialogAdicionarMonitor" @cancelar="mostrarDialogAdicionarMonitor =false"
                            @trocado="monitorTrocado" :funcionario_id="funcionario_id"/>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import { validarFormulario } from "~/mixins/validarFormulario"
	import Desktop from "~/pages/Administracao/TI/Desktop.vue"
	import DialogTrocarDesktopNotebook from "~/components/Dialogs/Administracao/Ti/Funcionarios/DialogTrocarDesktopNotebook.vue"
  import AppTooltip from "~/components/Ui/AppTooltip.vue";
  import DialogAdicionarMonitor from "~/components/Dialogs/Administracao/Ti/Funcionarios/DialogAdicionarMonitor.vue";
  import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";

	export default {
		components: {
      TabelaPadrao,
      DialogAdicionarMonitor,
      AppTooltip,
			DialogTrocarDesktopNotebook,
			BotaoPadrao,
			AppFormTextarea,
			AppAlerta,
			AppFormSelectCompleto,
			AppFormInput,
			AppTabs,
			BaseDialog,
		},
		props: {
			funcionario_id: {
				type: Number,
				default: null,
			},
		},
		async fetch() {
			this.carregando = true
			let id = this.funcionario_id

			let resp = await this.$axios.$get("/ti/funcionarios/buscar", { params: { id } })
			if (!resp.falha) {
				let { funcionario } = resp.dados
				this.funcionario = funcionario

        this.dadosEquipamento = this.funcionario.EquipamentoTI
        this.dadosLicenca = this.funcionario.LicencaTI
        this.dadosMonitor = this.funcionario.MonitorTI
        this.dadosDeskNote = this.funcionario.DesktopNotebookTI
			}
			this.carregando = false
		},
		data() {
			return {
				tab: "desktopNotebook",
				carregando: false,
				erros: [],
				mostrarAlerta: false,
				textoAlerta: null,
				funcionario: null,
				mostrarDialogTrocarDesktopNotebook: false,
				mostrarDialogAdicionarMonitor: false,
        deskNote_id: null,
        monitor_id: null,

        //DESKTOPNOTEBOOK
        cabecalhoDeskNote: [
          { nome: "", valor: "acoes", largura: "w-8" },
          { nome: "Tipo", valor: "tipo" },
          { nome: "Serial", valor: "serial" },
          { nome: "Patrimonio", valor: "patrimonio" },
          { nome: "Hostname", valor: "hostname" },
          { nome: "Marca", valor: "MarcaTI.nome" },
          { nome: "Modelo", valor: "ModeloTI.nome" },
          { nome: "Entrega", valor: "data_entrega" },
        ],
        dadosDeskNote: [],
        deskNotetiIdPrDeletar: null,

        //MONITOR
        cabecalhoMonitor: [
          { nome: "", valor: "acoes", largura: "w-8" },
          { nome: "Serial", valor: "serial" },
          { nome: "Patrimonio", valor: "patrimonio" },
          { nome: "Marca", valor: "MarcaTI.nome" },
          { nome: "Modelo", valor: "ModeloTI.nome" },
          { nome: "Entrega", valor: "data_entrega" },
        ],
        dadosMonitor: [],
        monitortiIdPrDeletar:null,


        //EQUIPAMENTO
        equipamentotiIdPrDeletar: null,
        equipamentos: [],
        cabecalhoEquipamento: [
          { nome: "", valor: "acoes", largura: "w-8" },
          { nome: "Nome", valor: "nome"},
          { nome: "Marca", valor: "marca" },
          { nome: "Modelo", valor: "modelo"},
        ],
        dadosEquipamento: [],
        equipamentoti_id: null,

        //LICENÇA
        cabecalhoLicenca: [
          { nome: "", valor: "acoes", largura: "w-8" },
          { nome: "Nome", valor: "nome" },
          { nome: "Valor", valor: "valor" },
          { nome: "Tipo", valor: "tipo_licenca" },
        ],
        dadosLicenca: [],
        licencas: [],
        licencatiIdPrDeletar: null,
        licencati_id: null
			}
		},
		computed: {
			tabs() {
				return [
					{
						nome: "Desktop/Notebook",
						valor: "desktopNotebook",
					},
          {
            nome: "Monitor",
            valor: "monitor",
          },
          {
            nome: "Equipamento",
            valor: "equipamento",
          },
          {
            nome: "Licença",
            valor: "licenca",
          },
				]
			},
		},

		async mounted() {
			this.carregando = true
			if (this.funcionario_id !== null) {
				// await this.buscarFuncionario()
			}
      await this.buscarEquipamentos()
      await this.buscarLicencas()

			this.carregando = false
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
      async buscarEquipamentos(){
        let resp = await this.$axios.$get("/ti/funcionarios/buscarEquipamentos")

        if(!resp.falha){
          let { equipamentos } = resp.dados

          this.equipamentos = equipamentos.map(o => { return { id: o.id, nome: `${o.nome} | ${o.marca} - ${o.modelo}`}})
        }
      },
      async buscarLicencas(){
        let resp = await this.$axios.$get("/ti/funcionarios/buscarLicenca")

        if(!resp.falha){
          let { licencas } = resp.dados

          this.licencas = licencas.map(o => {
            return { id: o.id, nome: o.nome }
          })
        }
      },
			deskNoteTrocado(deskNote) {
				this.textoAlerta = `${deskNote.tipo} adicionado com sucesso!`
				this.mostrarAlerta = true
				this.mostrarDialogTrocarDesktopNotebook = false
				this.funcionario.DesktopNotebookTI.push(deskNote)
			},
      monitorTrocado(monitor) {
        this.textoAlerta = `Monitor adicionado com sucesso!`
        this.mostrarAlerta = true
        this.mostrarDialogAdicionarMonitor = false
        this.funcionario.MonitorTI.push(monitor)
      },
      async enviarDeskNoteEstoque(deskNote){
        let desktopnotebookti_id = deskNote.id

        let resp = await this.$axios.$post("/ti/funcionarios/trocarDeskNote", {
          funcionario_id: null,
          desktopnotebookti_id,
        })

        if(!resp.falha){
          let idx = this.funcionario.DesktopNotebookTI.findIndex(o => o.id === deskNote.id)
          if(idx >= 0){
            this.funcionario.DesktopNotebookTI.splice(idx, 1)
            this.textoAlerta = `${deskNote.tipo} removido com sucesso!`
            this.mostrarAlerta = true
          }
          this.monitortiIdPrDeletar = null
        }

      },

      //MONITOR
      async enviarMonitorEstoque(monitor) {
        let monitorti_id = monitor.id

        let resp = await this.$axios.$post("/ti/funcionarios/trocarMonitor", {
          funcionario_id: null,
          monitorti_id,
        })

        if (!resp.falha) {
          let idx = this.dadosMonitor.findIndex(o => o.id === monitor.id)
          if (idx >= 0) {
            this.dadosMonitor.splice(idx, 1)
            this.textoAlerta = `Monitor removido com sucesso!`
            this.mostrarAlerta = true
          }
        }

      },

      //EQUIPAMENTO
      async adicionarEquipamento(){
        let equipamentoti_id = this.equipamentoti_id
        let funcionario_id = this.funcionario_id
        let usuario_id = this.$auth.user.id

        let resp = await this.$axios.$post("/ti/funcionario/adicionarEquipamento",  { equipamentoti_id, funcionario_id,
          usuario_id})

        if(!resp.falha){
          let {  equipamento } = resp.dados
            this.dadosEquipamento.push(equipamento)
            this.textoAlerta = "Equipamento adicionado com sucesso!"
          this.mostrarAlerta = true

          this.equipamentoti_id = null
        }
      },
      async removerEquipamento(){
        let equipamentoti_id = this.equipamentotiIdPrDeletar
        let usuario_id = this.$auth.user.id
        let funcionario_id = this.funcionario_id

        let resp = await this.$axios.$post("/ti/funcionario/removerEquipamento", { equipamentoti_id, funcionario_id,
          usuario_id })

        if (!resp.falha) {
          let idx = this.dadosEquipamento.findIndex(o => o.id === equipamentoti_id)
          if(idx >= 0 ){
            this.dadosEquipamento.splice(idx, 1)
          }

          this.textoAlerta = "Equipamento removido com sucesso!"
          this.mostrarAlerta = true
        }
      },

      //LICENCA
      async adicionarLicenca() {
        let licencati_id = this.licencati_id
        let funcionario_id = this.funcionario_id
        let usuario_id = this.$auth.user.id

        let resp = await this.$axios.$post("/ti/funcionario/adicionarLicenca", { licencati_id, funcionario_id,
          usuario_id })

        if (!resp.falha) {
          let { criado, licenca } = resp.dados
          if (criado) {
            this.dadosLicenca.push(licenca)
            this.textoAlerta = "Licença adicionado com sucesso!"
            this.mostrarAlerta = true
          }

          this.licencati_id = null
        }
      },
      async removerLicenca() {
        let licencati_id = this.licencatiIdPrDeletar
        let usuario_id = this.$auth.user.id
        let funcionario_id = this.funcionario_id

        let resp = await this.$axios.$post("/ti/funcionario/removerLicenca", { licencati_id, funcionario_id, usuario_id })

        if (!resp.falha) {
          let idx = this.dadosLicenca.findIndex(o => o.id === licencati_id)
          if (idx >= 0) {
            this.dadosLicenca.splice(idx, 1)
          }

          this.textoAlerta = "Licença removido com sucesso!"
          this.mostrarAlerta = true
        }
      }
		},
	}
</script>

<style scoped>
	.titulo-campo {
		font-size: 11px;
		text-align: start;
		font-weight: 700;
		color: #545458;
		white-space: nowrap;
	}
	.texto-campo {
		font-size: 16px;
		text-align: center;
		font-weight: 700;
		color: #000000;
		white-space: nowrap;
		text-transform: uppercase;
	}
</style>
