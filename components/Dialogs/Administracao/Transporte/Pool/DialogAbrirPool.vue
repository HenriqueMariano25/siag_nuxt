<template>
	<div>
		<BaseDialog
			titulo="Iniciar pool"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-4 gap-2 items-center">
					<AppFormSelectCompleto
						style="z-index: 101 !important"
						obrigatorio
						id="funcionario"
						label="Funcionário"
						:options="funcionariosFormatados"
						v-model="pool.funcionario_id"
						class="col-span-2"
						:invalido="erros.includes('funcionario_id')" />
					<AppFormInput
						id="setor"
						type="text"
						label="Setor"
						v-model="pool.setor"
						disabled
						readonly />
					<AppFormSelectCompleto
						style="z-index: 101 !important"
						class="grow"
						id="subSetor"
            btn-cadastrar
						:disabled="pool.setor === null"
						label="Sub Setor"
						@cadastrar="mostrarDialogCadastrarSubSetor = true"
						tooltip-add="Cadastrar Sub Setor"
						:options="subSetoresFormatados"
						v-model="pool.sub_setor_pool_id" />
					<AppFormInput
						id="data_inicial"
						type="date"
						label="Data inicial"
						obrigatorio
						:invalido="erros.includes('data_inicial')"
						v-model="pool.data_inicial" />
					<AppFormInput
						id="hora_inicial"
						type="time"
						label="Hora inicial"
						obrigatorio
						:invalido="erros.includes('hora_inicial')"
						v-model="pool.hora_inicial" />
					<AppFormInput
						id="km_inicial"
						type="number"
						label="KM inicial"
						v-model="pool.km_inicial"
						obrigatorio
						:invalido="erros.includes('km_inicial')"
						placeholder="Ex: 123456" />
					<AppFormSelectCompleto
						obrigatorio
						class="grow"
						id="atendimento"
            btn-cadastrar
						label="Atendimento"
						:options="atendimentos"
						@cadastrar="mostrarDialogCadastrarAtendimento = true"
						tooltip-add="Cadastrar atendimento"
						v-model="pool.atendimento_pool_id"
						:invalido="erros.includes('atendimento_pool_id')" />
					<AppFormSelectCompleto
						obrigatorio
						class="grow"
						id="motivo"
						label="Motivo"
            btn-cadastrar
						@cadastrar="mostrarDialogCadastrarMotivo = true"
						:options="motivos"
						v-model="pool.motivo_pool_id"
						:invalido="erros.includes('motivo_pool_id')" />
					<AppFormInput
						id="descricao_motivo"
						class="col-span-3"
						type="text"
						label="Descrição do motivo"
						v-model="pool.descricao_motivo"
						placeholder="Ex: O colaborador a ser levado é o Henrique da T.I" />
					<AppFormTextarea
						label="Observação"
						id="observacao"
						v-model="pool.observacao"
						class="col-span-4"
						linhas="1"
						placeholder="Observação opcional" />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div>
					<BotaoPadrao
						texto="Iniciar"
						@clique="iniciarPool()">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
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
		<DialogCadastrarAtendimento
			v-if="mostrarDialogCadastrarAtendimento"
			@cancelar="mostrarDialogCadastrarAtendimento = false"
			@cadastrado="atendimentoCadastrado" />
		<DialogCadastrarSubSetor
			v-if="mostrarDialogCadastrarSubSetor"
			@cancelar="mostrarDialogCadastrarSubSetor = false"
			@cadastrado="subSetorCadastrado" />
		<DialogCadastrarMotivo
			v-if="mostrarDialogCadastrarMotivo"
			@cancelar="mostrarDialogCadastrarMotivo = false"
			@cadastrado="motivoCadastrado" />
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import {
		buscarFuncionarios,
		buscarAtendimentosPool,
		buscarSubSetoresPool,
		buscarMotivosPool,
	} from "~/mixins/buscarInformacoes"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import DialogCadastrarAtendimento from "~/components/Dialogs/Administracao/Transporte/Pool/DialogCadastrarAtendimento.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCadastrarSubSetor from "~/components/Dialogs/Administracao/Transporte/Pool/DialogCadastrarSubSetor.vue"
	import DialogCadastrarMotivo from "~/components/Dialogs/Administracao/Transporte/Pool/DialogCadastrarMotivo.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"

	export default {
		mixins: [buscarFuncionarios, buscarAtendimentosPool, buscarSubSetoresPool, buscarMotivosPool],
		components: {
			AppFormTextarea,
			DialogCadastrarSubSetor,
			AppAlerta,
			DialogCadastrarAtendimento,
			AppTooltip,
			BotaoPadrao,
			AppFormSelectCompleto,
			AppFormInput,
			BaseDialog,
			DialogCadastrarMotivo,
		},
		props: {
			carro_id: {
				type: Number,
			},
		},
		data() {
			return {
				pool: {
					data_inicial: this.$dayjs().format("YYYY-MM-DD"),
					hora_inicial: this.$dayjs().format("HH:mm"),
					funcionario_id: null,
					atendimento_pool_id: null,
					sub_setor_pool_id: null,
					motivo_pool_id: null,
					setor: null,
					descricao_motivo: null,
					km_inicial: null,
					observacao: null,
				},
				funcionarios: [],
				atendimentos: [],
				subSetores: [],
				subSetoresFormatados: [],
				motivos: [],
				funcionariosFormatados: [],
				erros: [],
				mostrarDialogCadastrarAtendimento: false,
				mostrarDialogCadastrarSubSetor: false,
				mostrarDialogCadastrarMotivo: false,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async mounted() {
			await this.iniciarDialog()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async iniciarDialog() {
				this.funcionarios = await this.buscarFuncionarios(false)
				this.funcionariosFormatados = this.funcionarios.map((o) => {
					return { id: o.id, nome: o.nome }
				})

				let atendimentos = await this.buscarAtendimentosPool(false)
				this.atendimentos = atendimentos.map((o) => {
					return { id: o.id, nome: o.local }
				})

				let motivos = await this.buscarMotivosPool(false)
				this.motivos = motivos.map((o) => {
					return { id: o.id, nome: o.motivo }
				})
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = [
					"funcionario_id",
					"data_inicial",
					"hora_inicial",
					"atendimento_pool_id",
					"motivo_pool_id",
					"km_inicial",
				]

				for (let campo of camposObrigatorio) {
					if (this.pool[`${campo}`] === null || this.pool[`${campo}`] === "") this.erros.push(campo)
				}
			},

			async iniciarPool() {
				this.validarFormulario()
        let usuario_id = this.$auth.user.id

				if (this.erros.length === 0) {

					let resp = await this.$axios.$post("/pool/cadastrar", { ...this.pool, carro_id: this.carro_id, usuario_id })

          if(!resp.falha){
            let poolCriado = resp.dados.pool

            this.$emit("poolIniciado", { pool: poolCriado, carro_id: this.carro_id})
          }
				}
			},

			atendimentoCadastrado(local) {
				this.atendimentos.push({ id: local.id, nome: local.local })
				this.pool.atendimento_pool_id = local.id
				this.$store.commit("pool/ATUALIZAR_ATENDIMENTOS_POOL", { novoDado: local })
				this.mostrarDialogCadastrarAtendimento = false
				this.textoAlerta = "Atendimento cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
			subSetorCadastrado(subSetor) {
				this.subSetores.push({ id: subSetor.id, nome: subSetor.sub_setor })
				this.pool.sub_setor_pool_id = subSetor.id
				this.$store.commit("pool/ATUALIZAR_SUB_SETORES_POOL", { novoDado: subSetor })
				this.mostrarDialogCadastrarSubSetor = false
				this.textoAlerta = "Sub Setor cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
			motivoCadastrado(motivo) {
				this.motivos.push({ id: motivo.id, nome: motivo.motivo })
				this.pool.motivo_pool_id = motivo.id
				this.$store.commit("pool/ATUALIZAR_MOTIVO_POOL", { novoDado: motivo })
				this.mostrarDialogCadastrarMotivo = false
				this.textoAlerta = "Motivo cadastrado com sucesso!"
				this.mostrarAlerta = true
			},
		},
		watch: {
			async "pool.funcionario_id"(valor) {
				let idx = this.funcionarios.findIndex((o) => o.id === valor)

				if (idx >= 0) {
					if (this.funcionarios[idx].setor) {
						this.pool.setor = this.funcionarios[idx].setor.nome
						this.pool.setor_id = this.funcionarios[idx].setor.id

						this.subSetores = await this.buscarSubSetoresPool(false, this.pool.setor_id)
						this.subSetoresFormatados = this.subSetores.map((o) => {
							return { id: o.id, nome: o.sub_setor }
						})
					} else {
						this.pool.setor = null
					}
				}
			},
		},
	}
</script>

<style scoped></style>
