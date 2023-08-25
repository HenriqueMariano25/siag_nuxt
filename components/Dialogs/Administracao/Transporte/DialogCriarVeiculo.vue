<template>
	<div>
		<BaseDialog
			:titulo="veiculo === null ? 'Criar veículo' : `Editando veículo - ${veiculo.nome}`"
			:btnDeletar="veiculo !== null"
			@deletar="deletarVeiculo"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-3 gap-3">
					<AppFormInput
						id="nome"
						type="text"
						v-model="veiculoLocal.nome"
						label="Nome"
            :invalido="erros.includes('nome')"
						placeholder="Ex: Carro"
						class="col-span-2"
						obrigatorio />
					<AppFormInput
						id="ocupacao"
						type="number"
						v-model="veiculoLocal.ocupacao"
            :invalido="erros.includes('ocupacao')"
						label="Ocupação"
						placeholder="Ex: 5"
						obrigatorio />
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<BotaoPadrao
					texto="salvar"
					@clique="veiculo === null ? cadastrarVeiculo() : editarVeiculo()">
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogCriarVeiculo",
		components: { BotaoPadrao, AppFormInput, BaseDialog },
		props: {
			veiculo: {
				type: Object,
			},
		},
		data() {
			return {
				veiculoLocal: {
					nome: null,
					ocupacao: null,
				},
				erros: [],
			}
		},
		created() {
			if (this.veiculo) {
				this.veiculoLocal = Object.assign({}, this.veiculo)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			validarFormulario() {
				this.erros = []

				let camposObrigatorio = ["nome", "ocupacao"]

				for (let campo of camposObrigatorio) {
					if (this.veiculoLocal[`${campo}`] === null || this.veiculoLocal[`${campo}`] === "")
						this.erros.push(campo)
				}
			},
			async cadastrarVeiculo() {
				let veiculo = this.veiculoLocal

				await this.validarFormulario()

				if (this.erros.length === 0) {
					let resp = await this.$axios.$post("/transporte/adicionar/veiculo", { veiculo })

					if (!resp.falha) {
						this.$emit("cadastrado", resp.veiculo)
					}
				}
			},
      async editarVeiculo(){
        let veiculo = this.veiculoLocal

        await this.validarFormulario()

        if(this.erros.length === 0){
          let resp = await this.$axios.$put("/transporte/editar/veiculo", { veiculo })

          if (!resp.falha) {
            this.$emit("editado", this.veiculoLocal)
          }
        }
      },
      async deletarVeiculo(){
        let { id } = this.veiculo

        let resp = await this.$axios.$delete(`/transporte/deletar/veiculo/${id}`)

        if (!resp.falha) {
          this.$emit("deletado", id)
        }
      }
		},
	}
</script>

<style scoped></style>
