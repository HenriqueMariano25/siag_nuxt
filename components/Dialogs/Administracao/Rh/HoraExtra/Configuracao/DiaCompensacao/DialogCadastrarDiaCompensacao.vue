<template>
	<div style="">
		<BaseDialog
			:titulo="dia ? 'EDITAR DIA P/ COMPENSAÇÃO' : 'CADASTRAR DIA P/ COMPENSAÇÃO'"
			:btnDeletar="!!dia"
			@deletar="deletado()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="grid grid-cols-2 gap-2 px-2">
					<AppFormInput
						id="data"
						type="date"
						label="Data"
						obrigatorio
						:invalido="erros.includes('data')"
						v-model="diaLocal.data" />
          <AppFormInput
            id="motivo"
            type="text"
            label="Motivo"
            placeholder="Ex: Compensação para o Carnaval"
            obrigatorio
            :invalido="erros.includes('motivo')"
            v-model="diaLocal.motivo" />
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <div class="flex gap-2 items-center">
          <span v-if="mensagemErro" class="text-red-400 text-xl">{{ mensagemErro }}</span>
          <BotaoPadrao texto="salvar" @clique="dia ? editar() : cadastrar()">
            <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
		</BaseDialog>
	</div>
</template>

<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
</script>
<script>
	import { validarFormulario } from "~/mixins/validarFormulario";

  export default {
		name: "DialogCadastrarDiaCompensacao",
		props: {
			dia: {
				type: Object,
			},
		},
		data() {
			return {
				erros: [],
				diaLocal: {
					data: null,
          motivo: null,
				},
        mensagemErro: null,
        campos: ['motivo', 'data']
			}
		},
    mounted() {
      if (this.dia) {
        this.diaLocal = Object.assign({}, this.dia)
      }
    },
    methods: {
      cancelar(){
        this.$emit("cancelar")
      },
      async cadastrar() {
        this.mensagemErro = null
        let campos = this.campos
        this.erros = validarFormulario(campos, this.diaLocal)

        if (this.erros.length === 0) {
          let usuario_id = this.$auth.user.id
          let { data, motivo } = this.diaLocal

          let resp = await this.$axios.$post("/hora_extra/dia_compensacao/cadastrar", {
            data,
            motivo,
            usuario_id
          })

          if (!resp.falha) {
            let dia = resp.dados.dia
            this.$emit("cadastrado", dia)
          } else {
            this.mensagemErro = resp.dados.mensagem
          }
        }
      },
      async editar(){
        this.mensagemErro = null
        let campos = this.campos
        this.erros = validarFormulario(campos, this.diaLocal)

        if (this.erros.length === 0) {
          let usuario_id = this.$auth.user.id
          let { data, motivo, id } = this.diaLocal

          let resp = await this.$axios.$put("/hora_extra/dia_compensacao/editar", {
            data,
            motivo,
            usuario_id,
            id
          })

          if (!resp.falha) {
            let dia = resp.dados.dia

            this.$emit("editado", dia)
          } else {
            this.mensagemErro = resp.dados.mensagem
          }
        }
      },
      async deletado() {
        let { id } = this.dia

        let resp = await this.$axios.$delete("/hora_extra/dia_compensacao/deletar", { params: { id } })

        if (!resp.falha) {
          this.$emit("deletado", id)
        }
      }
    }
	}
</script>

<style scoped></style>
