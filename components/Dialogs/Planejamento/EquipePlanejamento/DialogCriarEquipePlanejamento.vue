<template>
	<div>
		<BaseDialog
			:titulo="
				equipePlanejamento === null
					? 'Criar Equipe Planejamento'
					: `Editando - ${equipePlanejamento.descricao}`
			"
			:carregando="carregando"
			:btnDeletar="equipePlanejamento !== null"
			@deletar="deletarEquipePlanejamento()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="flex w-full overflow-auto px-2"
					style="max-height: calc(80vh)">
					<div
						class="w-full flex gap-x-3 gap-y-3"
						ref="formulario">
						<AppFormInput
							label="Descrição"
							class="grow"
							type="text"
							id="descricao"
							placeholder="Ex: Administração"
							:invalido="erros.includes('descricao')"
							v-model="equipePlanLocal.descricao" />
						<AppFormSelect
							label="Disciplina"
							:options="disciplinas"
							v-model="equipePlanLocal.disciplina_id"
							:invalido="erros.includes('disciplina_id')"
							id="motivo" />
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex justify-end">
					<BotaoPadrao
						texto="Salvar"
						@clique="equipePlanejamento ? editarEquipePlanejamento() : cadastrarEquipePlanejamento()">
						<img
							src="@/assets/icons/save-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import { defineComponent } from "vue"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import { buscarDisciplina } from "~/mixins/buscarInformacoes";

	export default defineComponent({
    mixins: [buscarDisciplina],
		name: "DialogCriarEquipePlanejamento",
		components: { BotaoPadrao, AppFormSelect, AppFormInput, BaseDialog },
		props: {
			equipePlanejamento: {
				type: [Object],
				default: null,
			},
		},
		data() {
			return {
				equipePlanLocal: {
					descricao: null,
					disciplina_id: null,
				},
				carregando: false,
				disciplinas: [],
				erros: [],
			}
		},
		created() {
			this.buscarTodosDisciplinas()

			if (this.equipePlanejamento !== null) {
				this.equipePlanLocal = Object.assign({}, this.equipePlanejamento)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarTodosDisciplinas() {
        await this.buscarDisciplina()

        let disciplinas = this.$store.state.disciplina.disciplinas

				let options = disciplinas.map((o) => {
					return { id: o.id, nome: o.descricao }
				})

				this.disciplinas = options
			},

			validarFormulario() {
				this.erros = []

				let camposObrigatorio = ["descricao", "disciplina_id"]

				for (let campo of camposObrigatorio) {
					if (this.equipePlanLocal[`${campo}`] === null || this.equipePlanLocal[`${campo}`] === "")
						this.erros.push(campo)
				}
			},

			async cadastrarEquipePlanejamento() {
				let equipePlan = this.equipePlanLocal

				this.validarFormulario()

				if (this.erros.length === 0) {
					let resp = await this.$axios.$post("/planejamento/equipe_planejamento/cadastrar", {
						...equipePlan,
					})
					if (!resp.falha) {
						let equipePlanCriada = resp.dados.equipePlanejamento

						this.$emit("cadastrado", equipePlanCriada)
					}
				}
			},

			async editarEquipePlanejamento() {
				let equipePlan = this.equipePlanLocal

				this.validarFormulario()

				if (this.erros.length === 0) {
					let resp = await this.$axios.$put("/planejamento/equipe_planejamento/editar", { ...equipePlan })
					if (!resp.falha) {
						let equipePlanEditada = resp.dados.equipePlanejamento

						this.$emit("editado", equipePlanEditada)
					}
				}
			},

			async deletarEquipePlanejamento() {
				let id = this.equipePlanejamento.id

        console.log(this.equipePlanejamento)

				let resp = await this.$axios.$delete("/planejamento/equipe_planejamento/deletar", { params: { id } })

				if (!resp.falha) {
					this.$emit("deletado", id)
				}
			},
		},
	})
</script>

<style scoped></style>
