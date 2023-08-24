<template>
	<div>
		<BaseDialog
			:titulo="nrLocal.id === null ? 'Criar NR' : `Editando NR - ${nr.descricao}`"
      :btnDeletar="nrLocal.id !== null"
      @deletar="deletarNr()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col px-2 gap-2">
					<AppFormInput
						id="nr"
						type="text"
						label="NR"
						v-model="nrLocal.nr"
            :invalido="erros.includes('nr')"
						placeholder="Ex: NR-12"
						obrigatorio />
					<AppFormInput
						id="nr"
						type="text"
						label="Descrição"
						v-model="nrLocal.descricao"
            :invalido="erros.includes('descricao')"
						placeholder="Ex: Segurança de Máquinas e Equipamentos"
						obrigatorio />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="nrLocal.id === null ? cadastrarNr() : editarNr()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
  import AppFormInput from "~/components/Ui/AppFormInput.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		name: "DialogCriarNRs",
		components: { BotaoPadrao, BaseDialog, AppFormInput },
		props: {
			nr: {
				type: Object,
			},
		},
		data() {
			return {
				nrLocal: {
					id: null,
					nr: null,
					descricao: null,
				},
        erros: []
			}
		},
		created() {
			if (this.nr) {
				this.nrLocal = Object.assign({}, this.nr)
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

      validarFormulario() {
        this.erros = []

        let camposObrigatorio = [
          "nr",
          "descricao",
        ]

        for (let campo of camposObrigatorio) {
          if (this.nrLocal[`${campo}`] === null || this.nrLocal[`${campo}`] === "") this.erros.push(campo)
        }
      },

      async cadastrarNr(){
        let { nr, descricao } = this.nrLocal

        this.validarFormulario()

        if(this.erros.length === 0){
          let resp = await this.$axios.$post("/contratacao/nrs/cadastrar",  { nr, descricao })
          console.log(resp)
          let nrCriada = resp.nr
          this.$emit("cadastrado", nrCriada)
        }
      },

      async editarNr(){
        let { nr, descricao,id } = this.nrLocal

        this.validarFormulario()
        if (this.erros.length === 0) {
          await this.$axios.$put("/contratacao/nrs/editar",  { nr, descricao, id })

          this.$emit("editado", this.nrLocal)
        }
      },

      async deletarNr() {
        let { id } = this.nrLocal

        this.validarFormulario()
        if (this.erros.length === 0) {
          await this.$axios.$delete("/contratacao/nrs/deletar", { params: {id} })

          this.$emit("deletado", id)
        }
      }
		},
	}
</script>

<style scoped></style>
