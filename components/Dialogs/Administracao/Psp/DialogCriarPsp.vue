<template>
  <div class="w-full">
    <BaseDialog
      :titulo="cadastrou? 'PSP cadastrada' : 'Criar PSP'"
      :carregando="carregando"
      @cancelar="cancelar()">
      <template v-slot:corpo>
        <div class="px-2 gap-2 flex flex-col max-h-[550px] overflow-y-auto">
          <div v-if="!cadastrou">
            <div class="flex flex-col gap-1 bg-blue-100 border border-blue-300">
              <div class="w-full bg-blue-300 flex text-xl px-1">
                <span>FUNCIONÁRIO</span>
              </div>
              <div class="flex flex-col gap-2 p-1">
                <div class="flex gap-2 items-end">
                  <span><strong>Selecione um funcionário: </strong></span>
                  <AppFormSelectCompleto
                    id="funcionario"
                    label="Funcionário"
                    :options="funcionarios"
                    v-model="psp.funcionario_id"
                    class="grow" />
                  <div class="flex self-end">
                    <BotaoPadrao
                      texto="buscar"
                      cor="bg-primaria-200 hover:bg-primaria-500 text-white"
                      @clique="buscarFuncionario"
                      :disabled="psp.funcionario_id === null || psp.funcionario_id === ''">
                      <img
                        src="@/assets/icons/magnifier-w.svg"
                        alt=""
                        class="w-7 h-7" />
                    </BotaoPadrao>
                  </div>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <AppFormInput
                    id="funcao"
                    type="text"
                    label="Função"
                    obrigatorio
                    disabled
                    readonly
                    v-model="psp.cargo"
                    placeholder="Ex: Programador" />
                  <AppFormInput
                    id="matricula"
                    type="text"
                    obrigatorio
                    label="Matrícula"
                    disabled
                    readonly
                    v-model="psp.chapa"
                    placeholder="Ex: 195009999" />
                  <AppFormInput
                    id="cpf"
                    type="text"
                    label="CPF"
                    obrigatorio
                    disabled
                    readonly
                    v-model="psp.cpf"
                    placeholder="EX: 123.456.789-12" />
                  <AppFormInput
                    id="setor"
                    type="text"
                    label="Setor"
                    disabled
                    obrigatorio
                    readonly
                    v-model="psp.setor"
                    placeholder="Ex: Administração" />
                  <AppFormInput
                    id="data_admissao"
                    type="date"
                    label="Data de Admissão"
                    disabled
                    readonly
                    obrigatorio
                    v-model="psp.data_admissao" />
                  <AppFormInput
                    id="turno"
                    type="text"
                    label="Turno"
                    obrigatorio
                    disabled
                    readonly
                    placeholder="EX: Diurno"
                    v-model="psp.turno" />
                  <AppFormInput
                    id="rg"
                    type="text"
                    label="RG"
                    obrigatorio
                    placeholder="EX: 12.345.678-9"
                    v-model="psp.rg" />
                  <AppFormInput
                    id="email"
                    type="text"
                    label="E-mail"
                    placeholder="EX: henrique.mariano@agnet.com.br"
                    v-model="psp.email" />
                  <AppFormInput
                    id="celular"
                    type="text"
                    label="Celular"
                    v-model="psp.celular"
                    placeholder="EX: (22) 99123-4567" />
                  <AppFormInput
                    id="data_nascimento"
                    type="date"
                    label="Data de Nascimento"
                    obrigatorio
                    v-model="psp.data_nascimento" />
                  <AppFormInput
                    id="intervalo"
                    type="text"
                    label="Intervalo"
                    readonly
                    placeholder="Ex: 90 dias"
                    disabled
                    obrigatorio
                    v-model="psp.prazo" />
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1 bg-blue-100 border border-blue-300">
              <div class="p-1">
                <div class="w-full bg-blue-300 flex text-xl px-1">
                  <span>PSP</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="flex flex-col gap-1">
                    <AppFormRadio
                      :itens="opcoesMotivo"
                      titulo="Motivo"
                      obrigatorio
                      v-model="psp.motivo"
                      id="motivo" />
                    <AppFormInput
                      v-if="motivoOutro"
                      id="outros_motivo"
                      type="text"
                      label="Descrição do motivo"
                      obrigatorio
                      placeholder="Ex: Descreva o motivo"
                      v-model="psp.outros_descricao" />
                  </div>
                  <AppFormRadio
                    :itens="opcoesMeioTransporte"
                    titulo="Meio de Transporte"
                    obrigatorio
                    v-model="psp.motivo"
                    id="motivo" />
                  <!--              <AppFormRadio-->
                  <!--                :itens="opcoesPrazos"-->
                  <!--                titulo="Meio de Transporte"-->
                  <!--                obrigatorio-->
                  <!--                v-model="psp.motivo"-->
                  <!--                id="motivo" />-->
                  <div class="flex gap-1 flex-col">
                    <AppFormInput
                      id="origem"
                      type="text"
                      label="Origem"
                      placeholder="Ex: Grussai, São João da Barra, RJ"
                      obrigatorio
                      v-model="psp.origem" />
                    <AppFormInput
                      id="destino"
                      type="text"
                      label="Destino"
                      placeholder="Ex: Tietê, São Paulo, SP"
                      obrigatorio
                      v-model="psp.destino" />
                  </div>
                  <div class="flex gap-1 flex-col">
                    <AppFormInput
                      id="ida"
                      type="date"
                      label="Data de Ida"
                      placeholder="Ex: Grussai, São João da Barra, RJ"
                      obrigatorio
                      v-model="psp.data_ida" />
                    <AppFormInput
                      id="volta"
                      type="date"
                      label="Data de VOlta"
                      placeholder="Ex: Grussai, São João da Barra, RJ"
                      obrigatorio
                      v-model="psp.data_volta" />
                  </div>
                  <AppFormSelectCompleto
                    id="centrosCusto"
                    label="Centro de Custo"
                    :options="centrosCusto"
                    v-model="psp.centro_custo_pep_id"
                    class="grow" />
                  <AppFormTextarea
                    class="col-span-2"
                    id="teste"
                    label="Descrição do Itinerário"
                    v-model="psp.descricao_itinerario" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="cadastrou" class="flex flex-col gap-0.5">
            <!--          <span class="">PSP criada com sucesso</span>-->
            <span class="text-xl">Código da PSP: <strong>00001</strong></span>
            <span class="text-xl">Motivo: <strong>Baixada</strong></span>
            <span class="text-xl">Data de ida: <strong>30/08/2023</strong></span>
            <span class="text-xl">Data de volta: <strong>05/09/2023</strong></span>
            <div class="flex flex-col gap-2 w-full border border-gray-500">
              <span class="px-1 bg-blue-300 text-xl">Etapas de aprovação</span>
              <div class="flex items-center gap-4 self-center pb-1">
                <div class="flex flex-col justify-center items-center">
                  <div class="bg-blue-400 w-7 h-7 rounded-full"></div>
                  <span><strong>Gerente GAF</strong></span>
                  <span>Validação do Prazo</span>
                </div>
                <div class="">
                  <img src="@/assets/icons/arrow-right-blue.svg" alt="" class="w-10 h-10">
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="bg-blue-400 w-7 h-7 rounded-full"></div>
                  <span><strong>RH</strong></span>
                  <span>Validação do Destino</span>
                </div>
                <div class="">
                  <img src="@/assets/icons/arrow-right-blue.svg" alt="" class="w-10 h-10">
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="bg-blue-400 w-7 h-7 rounded-full"></div>
                  <span><strong>Coordenador</strong></span>
                  <span>Henrique Mariano</span>
                </div>
                <div class="">
                  <img src="@/assets/icons/arrow-right-blue.svg" alt="" class="w-10 h-10">
                </div>
                <div class="flex flex-col justify-center items-center">
                  <div class="bg-blue-400 w-7 h-7 rounded-full"></div>
                  <span><strong>Gestor da Área</strong></span>
                  <span>Jorge Eduardo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex">
          <BotaoPadrao texto="salvar" @clique="cadastrarPsp()" v-if="!cadastrou">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao texto="fechar" @clique="cancelar()" v-if="cadastrou">
            <img src="@/assets/icons/back-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
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

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		name: "DialogCriarPsp",
		components: {
			BaseDialog,
		},
		data() {
			return {
				carregando: false,
				psp: {
					funcionario_id: null,
					cargo: null,
					chapa: null,
					data_admissao: null,
					setor: null,
					rg: null,
					celular: null,
					email: null,
					turno: null,
					data_nascimento: null,
					motivo: null,
					outros_descricao: null,
					meio_transporte: null,
					prazo: null,
					origem: null,
					destino: null,
					data_ida: null,
					data_volta: null,
					centro_custo_pep_id: null,
					descricao_itinerario: null,
				},
				funcionarios: [],
				turnos: [],
				opcoesMotivo: [
					{ label: "Baixada", valor: "Baixada" },
					{ label: "Férias", valor: "Férias" },
					{ label: "Mobilização fámiliar", valor: "Mobilização fámiliar" },
					{ label: "Outros", valor: "outros" },
				],
				opcoesMeioTransporte: [
					{ label: "Rodoviário", valor: "Rodoviário" },
					{ label: "Aérea", valor: "Aérea" },
				],
				centrosCusto: [],
        cadastrou: false,
        mostrarAlerta: false,
        textoAlerta: null,
			}
		},
		computed: {
			motivoOutro() {
				return this.psp.motivo === "outros"
			},
		},
		created() {
			this.buscarFuncionarios()
			this.buscarTurnos()
			this.buscarCentrosCusto()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let funcionarios = resp.dados.responsaveis

					this.funcionarios = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
			async buscarTurnos() {
				let resp = await this.$axios.$get("/efetivo/buscar/turnos")

				if (!resp.falha) {
					let turnos = resp.dados.turnos

					this.turnos = turnos.map((o) => {
						return { id: o.id, nome: o.descricao }
					})
				}
			},
			async buscarFuncionario() {
				let funcionario_id = this.psp.funcionario_id

				let resp = await this.$axios.$get("/psp/buscar/funcionario", {
					params: { id: funcionario_id },
				})

				if (!resp.falha) {
					let funcionario = resp.dados.funcionario
					let prazo = resp.dados.prazo

					this.psp = Object.assign({}, funcionario)
					this.psp.prazo = `${prazo.prazo} dias`
					this.psp.setor = funcionario.setor ? funcionario.setor.nome : null
					this.psp.data_admissao = funcionario.data_admissao
						? this.$dayjs(funcionario.data_admissao).format("YYYY-MM-DD")
						: null
					this.psp.turno = funcionario.Turno ? funcionario.Turno.descricao : null
					// console.log(r)
				}
			},
			async buscarCentrosCusto() {
				let resp = await this.$axios.$get("/suprimentos/ss/centro_custo/buscarTodos")

				if (!resp.falha) {
					let centrosCusto = resp.dados.centrosCusto
					this.centrosCusto = centrosCusto.map((o) => {
						return { id: o.id, nome: `${o.numero_pep} - ${o.descricao}` }
					})
				}
			},

      async cadastrarPsp(){
        this.cadastrou = !this.cadastrou
        this.textoAlerta = "PSP cadastrada com sucesso!"
        this.mostrarAlerta = true
      }
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
</script>
