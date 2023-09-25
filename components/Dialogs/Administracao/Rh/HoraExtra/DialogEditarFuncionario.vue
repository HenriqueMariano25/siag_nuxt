<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="Editar funcionário"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-1 flex gap-1 w-full">
					<AppFormSelectCompleto
						class="grow"
						obrigatorio
						id="encarregado_lider"
						label="Encarregado/Lider"
						:options="responsaveis"
						v-model="campos.encarregado_lider_id"
						:invalido="erros.includes('encarregado_lider_id')" />
					<AppFormSelectCompleto
						class="grow"
						obrigatorio
						id="turno"
						label="Turno"
						:options="turnos"
						v-model="campos.turno_id"
						:invalido="erros.includes('turno_id')" />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="salvar"
					@clique="editarFuncionario()">
					<img
						src="@/assets/icons/save-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogEditarFuncionario",
		components: { BotaoPadrao, AppFormSelectCompleto, AppFormInput, BaseDialog },
		props: {
			funcionario: {
				type: Object,
			},
		},
		data() {
			return {
				responsaveis: [],
				turnos: [],
				erros: [],
				campos: {
					encarregado_lider_id: null,
					turno_id: null,
				},
			}
		},
		async mounted() {
			await this.buscarResponsaveis()
			await this.buscarTurnos()

			this.campos.encarregado_lider_id = this.funcionario.encarregado_lider_id
			this.campos.turno_id = this.funcionario.turno_id
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarResponsaveis() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let responsaveis = resp.dados.responsaveis

					this.responsaveis = responsaveis.map((o) => {
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

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = ["encarregado_lider_id", "turno_id"]

				for (let campo of camposObrigatorio) {
					if (this.campos[`${campo}`] === null || this.campos[`${campo}`] === "")
						this.erros.push(campo)
				}
			},

			async editarFuncionario() {
				let { id } = this.funcionario
				let { encarregado_lider_id, turno_id } = this.campos
				let usuario_id = this.$auth.user.id

				this.validarFormulario()

				if (this.erros.length === 0) {
					let resp = await this.$axios.$post("/efetivo/editar_funcionario/hora_extra", {
						id,
						encarregado_lider_id,
						turno_id,
						usuario_id,
					})

					if (!resp.falha) {
						let { encarregadoLider, turno } = resp.dados
						this.$emit("editado", {
							id,
							encarregadoLider: encarregadoLider.nome,
							turno: turno.descricao,
						})
					}
				}
			},
		},
	}
</script>

<style scoped></style>
