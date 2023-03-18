<template>
	<BaseDialog
		:titulo="card_id === null ? 'Criar card' : `Editando card - ${card_id}`"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div
				class="flex w-full overflow-auto px-2"
				style="max-height: calc(80vh)">
				<div
					class="w-full grid grid-cols-2 gap-x-3 gap-y-3"
					ref="formulario">
					<AppFormInput
						label="Setor"
						type="text"
						:readonly="true"
						:disabled="true"
						id="setor"
						v-model="nomeSetor" />
					<AppFormInput
						label="Quantidade"
						placeholder="Ex: 3"
						type="number"
						id="quantidade"
            :disabled="card_id !== null"
            :readonly="card_id !== null"
						v-model="card.quantidade" />
					<AppFormSelect
						label="Status"
						:options="status"
						v-model="card.status_card_id"
						id="status"
						:invalido="erro.includes('status')" />
					<AppFormSelect
						label="Centro de Custo"
						:options="centrosCusto"
						v-model="card.centro_custo_pep_id"
						id="centro_custo"
						:invalido="erro.includes('centro_custo_pep_id')" />
					<AppFormSelect
						label="Função"
						:options="funcoes"
            v-model="card.funcao_id"
						@change="funcaoSelecionada"
						id="funcao"
						:invalido="erro.includes('funcao_id')" />
					<AppFormSelect
						label="Disciplina"
						:options="disciplinas"
						v-model="card.disciplina_id"
						id="disciplina"
						:invalido="erro.includes('disciplina_id')" />
					<AppFormInput
						label="Data de necesisdade"
						type="date"
						id="data_necessidade"
						v-model="card.data_necessidade"
						:invalido="invalidoDataNecessidade"
						textoInvalido="Data de necessidade não pode ser inferior a 30 dias a partir da data atual" />
					<AppFormInput
						placeholder="R$ 2345,67"
						label="Sálario"
						type="text"
						id="salario"
						v-model="card.salario"
						:textoDesabilitado="txtDesabilitadoSalario"
						:readonly="bloquearSalario"
						:disabled="bloquearSalario" />
					<AppFormRadio
						:itens="opcoesTurno"
						titulo="Turno"
						obrigatorio
						v-model="card.turno"
						:invalido="erro.includes('turno')" />
					<AppFormRadio
						:itens="opcoesTipoRecrutamento"
						titulo="Tipo de recrutamento"
						obrigatorio
						v-model="card.tipo_recrutamento"
						:invalido="erro.includes('tipo_recrutamento')" />
					<AppFormRadio
						:itens="opcoesMobilizacao"
						titulo="Mobilização"
						obrigatorio
						v-model="card.mobilizacao"
						:invalido="erro.includes('mobilizacao')" />
					<AppFormRadio
						simNao
						titulo="Entrevista com Gestor ?"
						obrigatorio
						id="gestor"
						v-model="card.entrevista_gestor" />
					<AppFormRadio
						simNao
						titulo="Vaga é confidencial ?"
						obrigatorio
						id="confidencial"
						v-model="card.confidencial" />
					<AppFormRadio
						simNao
						titulo="Aplicar testes específicos ?"
						obrigatorio
						id="testes"
						v-model="card.teste_especificos" />
					<AppFormRadio
						simNao
						titulo="Avaliar inglês ?"
						obrigatorio
						id="ingles"
						v-model="card.avaliar_ingles" />
					<AppFormRadio
						simNao
						titulo="Necessita de Notebook, Computador ou Login ?"
						obrigatorio
						id="notebook"
						v-model="card.equipamento_ti"
						:invalido="erro.includes('equipamento_ti')" />
					<AppFormRadio
						class="col-span-2"
						simNao
						titulo="Já tem indicação"
						obrigatorio
						id="indicacao"
						v-model="card.tem_indicacao" />
					<div
						class="bg-gray-300 p-2 rounded-sm border border-gray-400 col-span-2 grid grid-cols-2 gap-y-2 gap-x-3"
						v-if="card.tem_indicacao">
						<span class="col-span-2">Preencha os campos abaixo para realizar a indicação</span>
						<AppFormInput
							placeholder="Ex: JOAO MARIANO DA SILVA"
							label="Nome"
							type="text"
							obrigatorio
							id="nomeIndicacao"
							uppercase
							v-model="card.indicacao.nome"
							:invalido="erro.includes('indicacao.nome')" />
						<AppFormInput
							placeholder="Ex: (11)99123-4567"
							label="Telefone"
							type="text"
							obrigatorio
							id="telefoneIndicacao"
							v-model="card.indicacao.telefone"
							:invalido="erro.includes('indicacao.telefone')" />
						<AppFormInput
							placeholder="Ex: joao.mariano@agnet.com.br"
							label="E-mail"
							type="text"
							id="emailIndicacao"
							v-model="card.indicacao.email" />
						<AppFormInput
							placeholder="Ex: JOSE MOREIRA"
							label="Quem indicou"
							type="text"
							obrigatorio
							id="indicandoIndicacao"
							v-model="card.indicacao.indicado_por"
							uppercase />
						<AppFormInput
							placeholder="Ex: 123.456.789-10"
							label="CPF"
							type="text"
							id="cpfIndicacao"
							v-model="card.indicacao.cpf" />
						<AppFormFile
							label="Currículo em PDF"
							id="curriculo"
							@change="card.indicacao.pdf = $event" />
					</div>
					<div>
						<span><Strong>Treinamentos/NRs</Strong></span>
						<div
							v-for="nr in nrs"
							:key="nr.id">
							<AppFormCheckbox
								:label="nr.nr + ' - ' + nr.descricao"
								:valor="nr.id"
								:id="nr.id"
								v-model="card.nrs" />
						</div>
					</div>
					<AppFormTextarea
						label="Comentários"
						id="comentairo"
						placeholder="Comentário opcional"
						class="col-span-2"
						v-model="card.comentario" />
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div class="flex items-center">
				<div
					class="text-red-500 text-xl mr-3"
					v-if="erro.length > 0">
					<span>Campos obrigatórios necessários</span>
				</div>
				<BotaoSalvar @click="this.card_id !== null ? editarContratacao() : adicionarContratacao()" />
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue"
	import AppFormFile from "~/components/Ui/Form/AppFormFile.vue"
	import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import { buscarNrs } from "@/mixins/buscarInformacoes"

	export default {
		name: "DialogCriarCard",
		mixins: [buscarNrs],
		components: {
			BaseDialog,
			BotaoSalvar,
			AppFormInput,
			AppFormSelect,
			AppFormRadio,
			AppFormFile,
			AppFormCheckbox,
			AppFormTextarea,
		},
		props: {
			card_id: {
				type: Number,
			},
		},
		data() {
			return {
				opcoesTurno: [
					{ label: "Diurno", valor: "diurno" },
					{ label: "Noturno", valor: "noturno" },
				],
				opcoesTipoRecrutamento: [
					{ label: "Aumento de quadro", valor: "admissão" },
					{ label: "Substituição", valor: "substituicao" },
				],
				opcoesMobilizacao: [
					{ label: "Local", valor: "local" },
					{ label: "Alojado", valor: "alojado" },
					{ label: "República", valor: "república" },
					{ label: "Moradia fámiliar", valor: "moradia fámiliar" },
				],
				card: {
					quantidade: 1,
					status_card_id: null,
					setor_id: null,
					centro_custo_pep_id: null,
					funcao_id: null,
					disciplina_id: null,
					data_necessidade: null,
					salario: null,
					turno: null,
					tipo_recrutamento: null,
					mobilizacao: null,
					entrevista_gestor: false,
					tem_indicacao: false,
					indicacao: {
						nome: null,
						telefone: null,
						email: null,
						indicado_por: null,
						cpf: null,
						pdf: null,
						url_pdf: null,
					},
					nrs: [],
					equipamentos: [],
					comentario: null,
					avaliar_ingles: false,
					teste_especificos: false,
					confidencial: false,
					equipamento_ti: null,
				},
				nrs: [],
				centrosCusto: [],
				funcoes: [],
				disciplinas: [],
				status: [],
				invalidoDataNecessidade: false,
				bloquearSalario: true,
				txtDesabilitadoSalario: "",
				erro: [],
			}
		},
		async fetch() {
			this.nrs = await this.buscarNrs()

			await this.buscarCentrosCusto()
			await this.buscarFuncao()
			await this.buscarDisciplina()
			await this.buscarStatus()

			this.card.data_necessidade = this.$dayjs().add(30, "day").format("YYYY-MM-DD")
		},
		computed: {
			nomeSetor() {
				this.card.setor_id = this.$auth.user
					? this.$auth.user.setor_id
					: ""

				return this.$auth.user && this.$auth.user.Setor
					? this.$auth.user.Setor.nome
					: ""
			},
		},

		async mounted() {
			console.log(this.card_id)
			if (this.card_id !== null) {
				await this.buscarCard()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarCentrosCusto() {
				let setor_id = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/contratacao/centro_custo/por_setor", {
					params: { setor_id },
				})
				if (!resp.falha) {
					let centrosCusto = resp.dados.centrosCusto
					let options = centrosCusto.map((o) => {
						return { id: o.id, nome: `${o.numero_pep} - ${o.descricao}` }
					})

					this.centrosCusto = options
				}
			},

			async buscarFuncao() {
				let setor_id = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/contratacao/funcao/porSetor", { params: { setor_id } })
				if (!resp.falha) {
					let funcoes = resp.dados.funcoes

					this.funcoes = funcoes
				}
			},

			async buscarDisciplina() {
				let setor_id = this.$auth.user.setor_id

				let resp = await this.$axios.$get("/efetivo/sub_setor/porSetor", { params: { setor_id } })
				if (!resp.falha) {
					let disciplinas = resp.dados.disciplinas
					let options = disciplinas.map((o) => {
						return { id: o.id, nome: o.nome }
					})

					this.disciplinas = options
				}
			},

			async buscarStatus() {
				let resp = await this.$axios.$get("/contratacao/status/buscarTodos")

				if (!resp.falha) {
					let status = resp.dados.status
					let options = status.map((o) => {
						return { id: o.id, nome: o.descricao }
					})

					this.status = options
				}
			},

			funcaoSelecionada(funcao_id) {
				let funcao = this.funcoes.find((o) => o.id === parseInt(funcao_id))
				if (funcao.cct === true) {
					this.bloquearSalario = true
					this.txtDesabilitadoSalario = "(Definido pela CCT(Convenção Coletiva de Trabalho))"
				} else {
					this.bloquearSalario = false
					this.txtDesabilitadoSalario = ""
				}
				this.card.salario = funcao.salario
				this.card.funcao_id = funcao_id
			},

			validarFormulario() {
				this.erro = []

				let camposObrigatorio = [
					"status",
					"centro_custo_pep_id",
					"funcao_id",
					"disciplina_id",
					"data_necessidade",
					"turno",
					"tipo_recrutamento",
					"mobilizacao",
					"equipamento_ti",
				]

				if (this.card.tem_indicacao) camposObrigatorio.push("indicacao.nome", "indicacao.telefone")

				for (let campo of camposObrigatorio) {
					if (this.card[`${campo}`] === null || this.card[`${campo}`] === "") this.erro.push(campo)

					if (campo === "indicacao.telefone" || campo === "indicacao.nome") {
						let key = campo.split(".")[1]
						if (this.card.indicacao[`${key}`] === null || this.card.indicacao[`${key}`] === "")
							this.erro.push(campo)
					}
				}
			},

			async adicionarContratacao() {
				this.validarFormulario()

				if (this.erro.length === 0) {
					let usuario_id = this.$auth.user.id

					const config = { headers: { "Content-Type": "multipart/form-data" } }
					let formData = new FormData()
					formData.append(`files`, this.card.indicacao.pdf)

					let rawData = {
						card: this.card,
						usuario_id: usuario_id,
					}

					rawData = JSON.stringify(rawData)
					formData.append("data", rawData)

					try {
						await this.$axios.$post("/contratacao/card/criar", formData, config)

						this.card = {
							quantidade: null,
							status: null,
							setor_id: null,
							centro_custo_pep_id: null,
							funcao_id: null,
							disciplina_id: null,
							data_necessidade: null,
							salario: null,
							turno: null,
							tipo_recrutamento: null,
							mobilizacao: null,
							entrevista_gestor: null,
							tem_indicacao: false,
							indicacao: {
								nome: null,
								telefone: null,
								email: null,
								indicado_por: null,
								pdf: null,
							},
							nrs: [],
							equipamentos: [],
							comentario: null,
							avaliar_ingles: false,
							teste_especificos: false,
							confidencial: false,
							equipamento_ti: null,
						}

						console.log("Caastrado")
					} catch (error) {
						console.log(error)
						console.log("Aqui")
					}
				}
			},

      async editarContratacao(){
        let usuario_id = this.$auth.user.id;

        const config = {headers: {"Content-Type": "multipart/form-data"}};
        let formData = new FormData();
        formData.append(`files`, this.card.indicacao.pdf);

        let rawData = {
          card: this.card,
          usuario_id: usuario_id,
        };

        rawData = JSON.stringify(rawData);
        formData.append("data", rawData);

        try {
          await this.$axios.$put("/contratacao/card/editar", formData, config);
        } catch (error) {
          console.log(error);
        }
      },

			async buscarCard() {
				let id = this.card_id

				let { card } = await this.$axios.$get("/contratacao/card/buscar", { params: { id: id } })
				this.card = Object.assign({},card)
        let temEquipamentoTi = false
        if(card.equipamento_card.length > 0){
          temEquipamentoTi = card.equipamento_card.filter(obj => obj.id === 1).length > 0
        }
        this.card.equipamento_ti = temEquipamentoTi

        let temIndicacao = false
        if(card.Indicacao){
          temIndicacao = true
          this.card.indicacao = card.Indicacao
        }
        this.card.tem_indicacao = temIndicacao

        if(card.nrs.length > 0){
          this.card.nrs = []
          for (let nr of card.nrs) {
            this.card.nrs.push(nr.id)
          }
        }
			},
		},
		watch: {
			"card.quantidade": function (valor) {
				if (valor > 1) {
					this.card.tem_indicacao = false
				}
			},
			"card.tem_indicacao": function (valor) {
				if (valor === true) {
					this.card.quantidade = 1
				}
			},

			"card.data_necessidade": function (valor) {
				let hoje = this.$dayjs().format("YYYY-MM-DD")

				this.invalidoDataNecessidade = this.$dayjs(valor).diff(hoje, "day") < 30
			},
		},
	}
</script>

<style scoped></style>
