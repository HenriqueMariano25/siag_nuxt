<template>
	<BaseDialog
		largura="w-6/12"
		titulo="Alterar comprador"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="px-2 flex flex-col divide-Y divide-gray-600 gap-1">
				<span class="text-xl border-b-2 border-gray-600 px-1">
					Selecione o novo comprador abaixo
				</span>
				<span class="text-sm px-1 text-red-900">
					<strong>
						Obs: A alteração de comprador será aplicada em todas as Solicitações selecionados na
						janela anterior.
					</strong>
				</span>
				<AppFormSelect
					label="Comprador"
					:options="compradores"
					v-model="comprador"
					id="pep" />
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div>
				<BotaoPadrao
					texto="alterar"
					@clique="alterarComprador()">
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
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		name: "DialogAlterarComprador",
		components: { BotaoPadrao, AppFormSelect, BaseDialog },
    props: {
      solicitacoes: {
        type: [Array],
      }
    },
		data() {
			return {
				compradores: [],
				comprador: null,
			}
		},
		async created() {
			await this.buscarCompradores()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

			async buscarCompradores() {
				let resp = await this.$axios.$get("/suprimentos/ss/compradores")

				if (!resp.falha) {
					let compradores = resp.dados.compradores

					let options = compradores.map((o) => {
						return { id: o.Usuario.id, nome: o.Usuario.nome }
					})

					this.compradores = options
				}
			},

			async alterarComprador() {
        let usuario_id = this.$auth.user.id
        let comprador_id = this.comprador
        let solicitacoes = this.solicitacoes.map( o => o.id )

        let resp = await this.$axios.$post("/suprimentos/ss/alterar_comprador", { usuario_id, comprador_id, solicitacoes })

        if(!resp.falha){
          let { comprador } = resp.dados

          this.$emit("alterado", comprador)
        }
			},
		},
	}
</script>

<style scoped></style>
