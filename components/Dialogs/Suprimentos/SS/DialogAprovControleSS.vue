<template>
	<BaseDialog
		titulo="Aprovar SS"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="w-full">
				<div class="bg-gray-300 w-full p-2 space-x-5 flex justify-between">
					<span> <strong>Num. Acompanhamento: </strong>{{ ss ? ss.numero_acompanhamento : "" }} </span>
					<span>
						<strong>Natureza da Operação: </strong
						>{{ ss.natureza_operacao ? ss.natureza_operacao : "" }}
					</span>
					<span>
						<strong>Tipo de solicitação: </strong
						>{{ ss.tipo_solicitacao ? ss.tipo_solicitacao : "" }}
					</span>
					<span>
						<strong>Elemento PEP: </strong
						>{{
							ss.CentroCustoPEP && ss.CentroCustoPEP.descricao ? ss.CentroCustoPEP.descricao : ""
						}}
					</span>
				</div>
				<div class="pt-2 px-2 space-y-2">
					<AppFormSelect
						label="Centro de Custo - PEP"
						:options="centrosCusto"
						v-model="processo.pep"
						id="pep" />
					<AppFormTextarea
						id="comentario"
						label="Comentário"
						placeholder="Comentário opicional"
						v-model="processo.comentario"
						class="" />
				</div>
			</div>
		</template>
		<template v-slot:rodape-btn-direito>
			<div class="flex items-center gap-5 text-black">
				<BotaoPadrao
					texto="Negar Card"
					cor="bg-red-500"
					@click="aprovarSSControle(false)">
					<template v-slot>
						<img
							src="@/assets/icons/close-b.svg"
							alt="close"
							class="w-6 h-6" />
					</template>
				</BotaoPadrao>
				<BotaoPadrao
					texto="Aprovar Card"
					cor="bg-green-500"
					@click="aprovarSSControle(true)">
					<template v-slot>
						<img
							src="@/assets/icons/check-b.svg"
							alt="close"
							class="w-7 h-7" />
					</template>
				</BotaoPadrao>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	export default {
		name: "DialogProcControleCard",
		components: {
			BaseDialog,
			BotaoPadrao,
			AppFormTextarea,
			AppFormSelect,
		},
		props: {
			ss: {
				type: [String, Number, Object],
			},
		},
		data() {
			return {
				centrosCusto: [],
				processo: {
					comentario: null,
					pep: null,
				},
			}
		},
		async fetch() {
			await this.buscarCentrosCusto()
			this.processo.pep = this.ss.centro_custo_pep_id
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarCentrosCusto() {
				let resp = await this.$axios.$get("/suprimentos/ss/centro_custo/buscarTodos")
				if (!resp.falha) {
					let centrosCusto = resp.dados.centrosCusto
					let options = centrosCusto.map((o) => {
						return { id: o.id, nome: `${o.numero_pep} - ${o.descricao}` }
					})

					this.centrosCusto = options
				}
			},
			async aprovarSSControle(aprovacao) {
				let { id } = this.ss
				let usuario_id = this.$store.state.usuario.usuario
					? this.$store.state.usuario.usuario.id
					: null

				let { comentario, pep: centro_custo_id } = this.processo

				console.log(id)
				console.log(usuario_id)
				console.log(centro_custo_id)

				let resp = await this.$axios.$post("/suprimentos/ss/aprovacao/controle/pep", {
					id,
					usuario_id,
					aprovacao,
					comentario,
          centro_custo_id
				})

        if(!resp.falha){
          let SSs = [id]

          this.$emit("aprovado", SSs, aprovacao)
          this.processo.comentario = null
        }

				// // await this.$axios.$post("/contratacao/card/aprovacao/controle/pep", {
				// //   id,
				// //   aprovacao: aprovacao,
				// //   usuario_id,
				// //   comentario,
				// //   pep
				// // })
				// // let cards=[this.card]
				//

			},
		},
	}
</script>

<style scoped></style>
