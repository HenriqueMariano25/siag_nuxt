<template>
	<BaseDialog
		:titulo="card_id === null ? 'Criar card' : `Editando card - ${('000000' + card.id).slice(-6)}`"
    :carregando="carregando"
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
						:invalido="erro.includes('status_card_id')" />
					<AppFormSelect
						label="Centro de Custo"
						:options="centrosCusto"
						v-model="card.centro_custo_pep_id"
						:disabled="podeEditarTudo"
						:readonly="podeEditarTudo"
						id="centro_custo"
						:invalido="erro.includes('centro_custo_pep_id')" />
					<AppFormSelect
						label="Função"
						:options="funcoes"
						v-model="card.funcao_id"
						@change="funcaoSelecionada"
						:disabled="podeEditarTudo"
						:readonly="podeEditarTudo"
						id="funcao"
						:invalido="erro.includes('funcao_id')" />
					<AppFormSelect
						label="Disciplina"
						:options="disciplinas"
						:disabled="podeEditarTudo"
						:readonly="podeEditarTudo"
						v-model="card.disciplina_id"
						id="disciplina"
						:invalido="erro.includes('disciplina_id')" />
					<AppFormSelect
						label="Responsável pelo funcionário"
						:options="responsaveis"
						v-model="card.responsavel_id"
						id="responsavel"
						:invalido="erro.includes('responsavel_id')" />
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
						v-money="{ precision: 2, prefix: 'R$ ', decimal: ',', thousands: '.' }"
						:textoDesabilitado="txtDesabilitadoSalario"
						:readonly="bloquearSalario"
						:disabled="bloquearSalario" />
					<div />
					<AppFormRadio
						:itens="opcoesTurno"
						id="turno"
						titulo="Turno"
						obrigatorio
						v-model="card.turno"
						:invalido="erro.includes('turno')" />
					<AppFormRadio
						:itens="opcoesTipoRecrutamento"
						titulo="Tipo de recrutamento"
						id="tipo_recrutamento"
						obrigatorio
						v-model="card.tipo_recrutamento"
						:invalido="erro.includes('tipo_recrutamento')" />
					<AppFormRadio
						:itens="opcoesMobilizacao"
						titulo="Mobilização"
						obrigatorio
						v-model="card.mobilizacao"
						id="mobilizacao"
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
					<!--					<AppFormRadio-->
					<!--						simNao-->
					<!--						titulo="Aplicar testes específicos ?"-->
					<!--						obrigatorio-->
					<!--						id="testes"-->
					<!--						v-model="card.teste_especificos" />-->
					<AppFormRadio
						simNao
						titulo="Avaliar inglês ?"
						obrigatorio
						id="ingles"
						v-model="card.avaliar_ingles" />

					<!--          <div>-->
					<!--            <AppFormRadio-->
					<!--              class="col-span-2"-->
					<!--              simNao-->
					<!--              titulo="Já tem indicação ?"-->
					<!--              obrigatorio-->
					<!--              id="indicacao"-->
					<!--              v-model="card.tem_indicacao"/>-->
					<!--        </div>-->
					<!--          {{ card.tem_indicacao }}-->
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
					<AppFormRadio
						simNao
						titulo="Necessita de Notebook, Computador ou Login ?"
						obrigatorio
						id="notebook"
						v-model="card.equipamento_ti"
						:invalido="erro.includes('equipamento_ti')" />
					<div class="self-end">
						<BotaoPadrao
							texto="Adicionar indicação"
							@click="card.tem_indicacao = true"
							cor="bg-green-400 hover:bg-green-500"
							v-if="card.tem_indicacao === false">
							<img
								src="@/assets/icons/add-b.svg"
								alt="close"
								class="w-6 h-6" />
						</BotaoPadrao>
						<BotaoPadrao
							texto="Remover indicação"
							@click="card.tem_indicacao = false"
							cor="bg-red-400 hover:bg-red-500"
							v-if="card.tem_indicacao === true">
							<img
								src="@/assets/icons/minus-b.svg"
								alt="close"
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
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
							label="Telefone 1"
							type="text"
							obrigatorio
							id="telefoneIndicacao"
							mask="['(##)####-####','(##)#####-####']"
							v-model="card.indicacao.telefone"
							:invalido="erro.includes('indicacao.telefone')" />
						<AppFormInput
							placeholder="Ex: (11)99123-4567"
							label="Telefone 2"
							type="text"
							id="telefoneIndicacao"
							mask="['(##)####-####','(##)#####-####']"
							v-model="card.indicacao.telefone_2" />
						<AppFormInput
							placeholder="Ex: (11)99123-4567"
							label="Telefone 3"
							type="text"
							id="telefoneIndicacao"
							mask="['(##)####-####','(##)#####-####']"
							v-model="card.indicacao.telefone_3" />
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
							:invalido="erro.includes('indicacao.indicado_por')"
							uppercase />
						<AppFormInput
							placeholder="Ex: 123.456.789-10"
							label="CPF"
							type="text"
							id="cpfIndicacao"
							mask="###.###.###-##"
							:textoInvalido="erroCpf ? erroCpf : ''"
							v-model="card.indicacao.cpf"
							:invalido="erro.includes('indicacao.cpf')" />
						<div>
							<AppFormFile
								label="Currículo em PDF"
								id="curriculo"
								@change="card.indicacao.pdf = $event" />
							<a
								target="_blank"
								:href="`${urlFile}${card.Indicacao.url_pdf}`"
								v-if="
									card.indicacao && card.indicacao.url_pdf !== null && card.indicacao.url_pdf !== ''
								"
								class="border-2 border-gray-800 rounded flex px-2 hover:bg-gray-300 mt-2">
								<img
									src="@/assets/icons/file-b.svg"
									alt=""
									class="w-7 h-7" />
								Currículo
							</a>
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
			<div class="flex items-center gap-2">
<!--        <BotaoPadrao texto="DELETAR" cor="bg-red-400 hover:!bg-red-500" v-if="podeDeletar">-->
<!--          <img src="@/assets/icons/delete-b.svg" alt="" class="w-7 h-7">-->
<!--        </BotaoPadrao>-->
				<div
					class="text-red-500 text-xl mr-3"
					v-if="erro.length > 0">
					<span>Campos obrigatórios necessários</span>
				</div>
				<BotaoSalvar @click="card_id !== null ? editarContratacao() : adicionarContratacao()" />
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
	import money from "vuejs-money"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	// import {VMoney} from 'v-money'
	export default {
		// directives: {money: VMoney},
		name: "DialogCriarCard",
		mixins: [buscarNrs],
		components: {
			BotaoPadrao,
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
				type: [String, Number],
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
					responsavel_id: null,
					indicacao: {
						nome: null,
						telefone: null,
						telefone_2: null,
						telefone_3: null,
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
				responsaveis: [],
				status: [],
				invalidoDataNecessidade: false,
				bloquearSalario: true,
				txtDesabilitadoSalario: "",
				erro: [],
				dataNecessidadeOriginal: null,
				erroCpf: false,
        carregando: false
			}
		},
		async fetch() {
			this.nrs = await this.buscarNrs()

			await this.buscarCentrosCusto()
			await this.buscarFuncao()
			await this.buscarDisciplina()
			await this.buscarStatus()
			await this.buscarResponsaveis()

			if (this.card_id === null)
				this.card.data_necessidade = this.$dayjs().add(30, "day").format("YYYY-MM-DD")
		},
		computed: {
			nomeSetor: {
				get() {
					this.card.setor_id = this.$auth.user ? this.$auth.user.setor_id : ""

					return this.$auth.user && this.$auth.user.Setor ? this.$auth.user.Setor.nome : ""
				},
				set(value) {
					// console.log(value)
				},
			},
			podeEditarTudo() {
				if (this.card_id !== null) {
					return this.card.etapa_id !== 1
				}
				return false
			},
      podeDeletar() {
				if (this.card_id !== null) {
					return this.card.etapa_id <= 3
				}
				return false
			},
			urlFile() {
				if (process.env.NODE_ENV === "production") {
					return "http://siag.agnet.com.br:84/files/"
				} else {
					return "http://localhost:3000/files/"
				}
			},
		},

		async created() {
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

				let resp = await this.$axios.$get("/contratacao/disciplina/buscarTodos", {
					params: { setor_id },
				})

				if (!resp.falha) {
					let disciplinas = resp.disciplinas
					let options = disciplinas.map((o) => {
						return { id: o.id, nome: `${o.sigla} - ${o.descricao}` }
					})

					this.disciplinas = options
				}
			},

			async buscarResponsaveis() {
				let resp = await this.$axios.$get("/efetivo/buscar/nomes")

				if (!resp.falha) {
					let funcionarios = resp.dados.funcionarios

					let options = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})

					this.responsaveis = options
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
					"status_card_id",
					"centro_custo_pep_id",
					"funcao_id",
					"disciplina_id",
					"responsavel_id",
					"data_necessidade",
					"turno",
					"tipo_recrutamento",
					"status_id",
					"mobilizacao",
					"equipamento_ti",
				]

				if (this.card.tem_indicacao)
					camposObrigatorio.push(
						"indicacao.nome",
						"indicacao.telefone",
						"indicacao.cpf",
						"indicacao.indicado_por",
					)

				for (let campo of camposObrigatorio) {
					if (this.card[`${campo}`] === null || this.card[`${campo}`] === "") this.erro.push(campo)

					if (
						campo === "indicacao.nome" ||
						campo === "indicacao.cpf" ||
						campo === "indicacao.indicado_por"
					) {
						let key = campo.split(".")[1]
						if (this.card.indicacao[`${key}`] === null || this.card.indicacao[`${key}`] === "")
							this.erro.push(campo)
					}

					if (campo === "indicacao.telefone") {
						if (
							this.card.indicacao.telefone === null ||
							this.card.indicacao.telefone === "" ||
							this.card.indicacao.telefone.length < 13
						)
							this.erro.push("indicacao.telefone")
					}
				}
			},

			async validarCpf() {
				let cpf = this.card.indicacao.cpf
				let indicacao_id = this.card.indicacao_id

				if (cpf !== null && cpf !== "") {
					if (cpf.length === 14) {
						let resp = await this.$axios.$get("/contratacao/consultar_cpf", {
							params: { cpf, indicacao_id },
						})

						if (!resp.falha) {
							let valido = resp.dados.resposta

							if (!valido) {
								this.erro.push("indicacao.cpf")
								this.erroCpf = "CPF DUPLICADO"
							}else{

                cpf = cpf.replace(/\D/g, '');

                let soma = 0;
                for (let i = 0; i < 9; i++) {
                  soma += parseInt(cpf.charAt(i)) * (10 - i);
                }
                let digito1 = 11 - (soma % 11);
                if (digito1 === 10 || digito1 === 11) {
                  digito1 = 0;
                }

                // Verificar se o primeiro dígito verificador está correto
                if (parseInt(cpf.charAt(9)) !== digito1) {
                  this.erro.push("indicacao.cpf")
                  this.erroCpf = "CPF INVÁLIDO"
                }

                // Calcular o segundo dígito verificador
                soma = 0;
                for (let i = 0; i < 10; i++) {
                  soma += parseInt(cpf.charAt(i)) * (11 - i);
                }
                let digito2 = 11 - (soma % 11);
                if (digito2 === 10 || digito2 === 11) {
                  digito2 = 0;
                }

                // Verificar se o segundo dígito verificador está correto
                if (parseInt(cpf.charAt(10)) !== digito2) {
                  this.erro.push("indicacao.cpf")
                  this.erroCpf = "CPF INVÁLIDO"
                }

              }
						}
					} else {
						this.erro.push("indicacao.cpf")
						this.erroCpf = "CPF INVÁLIDO"
					}
				} else {
					this.erro.push("indicacao.cpf")
					this.erroCpf = "CPF VAZIO"
				}
			},

			async adicionarContratacao() {
				this.validarFormulario()

				if (this.card.tem_indicacao === true) await this.validarCpf()

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
						this.$emit("cadastrado")

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
					} catch (error) {
						console.log(error)
					}
				}
			},

			async editarContratacao() {
				this.validarFormulario()

				if (this.card.tem_indicacao === true) await this.validarCpf()

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
						let resp = await this.$axios.$put(
							"/contratacao/card/editar_novo_padrao",
							formData,
							config,
						)

						if (!resp.falha) {
							let comentario = resp.dados.comentario
							this.$emit("editado", { card_id: this.card_id, comentario })
						}
					} catch (error) {
						console.log(error)
					}
				}
			},

			async buscarCard() {
				let id = this.card_id
        this.carregando = true

				let resp = await this.$axios.$get("/contratacao/card/buscar", { params: { id: id } })

        if(!resp.falha){
          let card = resp.dados.card

          let temEquipamentoTi = false
          if (card.equipamento_card.length > 0) {
            temEquipamentoTi = card.equipamento_card.filter((obj) => obj.id === 1).length > 0
          }
          card.equipamento_ti = temEquipamentoTi
          if (card.Indicacao) {
            card.tem_indicacao = true
            card.indicacao = card.Indicacao
            card.indicacao.url_pdf = card.Indicacao.url_pdf
          } else {
            card.tem_indicacao = false
            card.indicacao = {
              nome: null,
              telefone: null,
              telefone_2: null,
              telefone_3: null,
              email: null,
              indicado_por: null,
              cpf: null,
              pdf: null,
              url_pdf: null,
            }
          }

          this.dataNecessidadeOriginal = card.data_necessidade
          this.card = Object.assign({}, card)

          if (card.nrs.length > 0) {
            this.card.nrs = []
            for (let nr of card.nrs) {
              this.card.nrs.push(nr.id)
            }
          }
          this.carregando = false
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

				let temCard = false
				if (this.card_id !== null)
					temCard = this.dataNecessidadeOriginal === this.card.data_necessidade

				this.invalidoDataNecessidade = this.$dayjs(valor).diff(hoje, "day") < 30 && !temCard
			},
		},
	}
</script>

<style scoped></style>
