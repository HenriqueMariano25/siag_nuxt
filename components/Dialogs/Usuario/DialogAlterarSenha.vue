<template>
	<BaseDialog
		largura="w-6/12"
		titulo="Alterar senha"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="flex flex-col px-1 gap-1">
				<AppFormInput
					id="senha_atual"
					type="password"
					placeholder="Senha atual"
					label="Senha atual"
					v-model="alterar.senhaAtual" />
				<AppFormInput
					id="senha_nova"
					type="password"
					placeholder="Nova senha"
					label="Nova senha"
					v-model="alterar.novaSenha" />
				<AppFormInput
					id="confirmar_senha_nova"
					type="password"
					placeholder="Confirmar nova senha"
					label="Confirmar nova senha"
					v-model="alterar.confirmarNovaSenha" />
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
      <div class="flex gap-2 items-center">
        <span class="text-xl text-red-400">{{ erro }}</span>
        <BotaoPadrao
          texto="alterar"
          @clique="alterarSenha()"
          :disabled="temVazio">
          <img
            src="@/assets/icons/save-b.svg"
            alt=""
            class="w-7 h-7" />
        </BotaoPadrao>
      </div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogAlterarSenha",
		components: { BotaoPadrao, BaseDialog, AppFormInput },
		data() {
			return {
				alterar: {
					senhaAtual: null,
					novaSenha: null,
					confirmarNovaSenha: null,
				},
        erro: null
			}
		},
		computed: {
			temVazio() {
				return (
					Object.values(this.alterar).includes(null) || Object.values(this.alterar).includes("")
				)
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async alterarSenha() {
        this.erro = null
        let { senhaAtual, novaSenha, confirmarNovaSenha } = this.alterar
        let usuarioId = this.$auth.user.id

        if( novaSenha !== confirmarNovaSenha ) {
          this.erro = "A nova senha e a confirmação são diferentes"
          return
        }

        try{
            let resp = await this.$axios.$put("/usuario/alterar_senha", { senhaAtual, novaSenha, usuarioId })

          console.log(resp)
          this.$emit("senhaAlterada")
        }catch(error){
            console.log(error.response.data)
            this.erro = error.response.data.message

        }

      },
		},
	}
</script>

<style scoped></style>
