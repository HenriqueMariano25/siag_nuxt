<template>
	<div>
		<BaseDialog
			titulo="Processar Cards"
			largura="w-10/12"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="grid w-full">
					<div class="flex w-full">
						<table class="flex-col w-full">
							<thead class="">
								<tr class="uppercase px-2 py-1 text-sm text-white relative">
									<th>Cod.</th>
									<th>Função</th>
									<th>Disciplina</th>
									<th>Data Necessidade</th>
									<th>Nome</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="card in cards"
									:key="card.id"
									class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
									<td class="text-center px-1 py-0.5 border border-collapse border-gray-600">
										{{ ("000000" + card.id).slice(-6) }}
									</td>
									<td class="px-1 py-0.5 border border-collapse border-gray-600">
										{{ card["FuncaoCard.nome"] ? card["FuncaoCard.nome"] : "" }}
									</td>
									<td class="px-1 py-0.5 border border-collapse border-gray-600">
										{{ card["DisciplinaCard.descricao"] ? card["DisciplinaCard.descricao"] : "" }}
									</td>
									<td class="px-1 py-0.5 border border-collapse border-gray-600">
										{{ $dayjs(card.data_necessidade).format("DD/MM/YYYY") }}
									</td>
									<td class="px-1 py-0.5 border border-collapse border-gray-600">
										{{ card["Indicacao.nome"] ? card["Indicacao.nome"] : "" }}
										<div
											v-if="!card['Indicacao.nome']"
											class="flex">
											<AppTooltip
												posicao="right-0"
												largura="w-[200px]">
												<template v-slot:corpo>
													<BotaoPadrao
														class="z-0 !p-0 flex border border-green-500"
														cor="bg-green-300 hover:!bg-green-400"
														@click="
															cardAddIndicacao = card
															mostraDialogAdicionarIndicacao = true
														">
														<img
															src="@/assets/icons/add-b.svg"
															alt=""
															class="w-6 h-6" />
													</BotaoPadrao>
												</template>
												<template v-slot:tooltip>
													<div class="w-[400px]">Adicionar indicação</div>
												</template>
											</AppTooltip>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="mt-2 px-2 flex gap-2">
						<AppFormTextarea
							id="comentario"
							label="Comentário opcional"
							placeholder="Comentário opcional"
							v-model="processo.comentario"
							:linhas="2"
							class="grow" />
						<!--          <AppFormSelect-->
						<!--            label="Etapa"-->
						<!--            :options="etapas"-->
						<!--            v-model="processo.etapa_id"-->
						<!--            :retornarObjeto="true"-->
						<!--            class="w-2/6"-->
						<!--            id="status"/>-->
					</div>
					<div class="px-1 bg-gray-200 border border-gray-300 flex flex-col pb-1">
						<div>
							<span class="text-red-600 text-xl" v-if="etapa.obrigatorio_indicacao && !todosTemIndicacao">
                <strong>Só é possivel processar se todos os cards tiver indicação.</strong>
              </span>
						</div>
						<div>
							<span>Clique na etapa que deseja mover os Cards acima</span>
						</div>
						<div class="flex gap-2">
							<BotaoPadrao
                :disabled="etapa.obrigatorio_indicacao && !todosTemIndicacao"
								:texto="proximaEtapa.ordem + ' - ' + proximaEtapa.nome"
								cor="bg-primaria-500 hover:bg-primaria-700"
								class="text-white" @click="processarCards(proximaEtapa.id)"/>
							<div v-for="proxima of etapa.ProximasEtapas">
								<!--              {{ proxima }}-->
								<BotaoPadrao
                  :disabled="etapa.obrigatorio_indicacao && !todosTemIndicacao"
									:texto="proxima.ordem + ' - ' + proxima.nome"
									cor="bg-primaria-500 hover:!bg-primaria-700"
									class="text-white" @click="processarCards(proxima.id)" />
							</div>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-5 text-black">
					<BotaoPadrao
						v-if="etapa.alterar_candidato === true"
            @click="mostrarDialogAlterarCandidado = true"
						texto="Alterar candidato">
					</BotaoPadrao>
<!--          Lembrar que tem que selecionar motivo da desistencia da indicação-->
				</div>
			</template>
		</BaseDialog>
		<DialogAdicionarIndicacao
      @indicacaoAdicionada="indicacaoAdicionada"
			v-if="mostraDialogAdicionarIndicacao"
			@cancelar="mostraDialogAdicionarIndicacao = false"
			:card="cardAddIndicacao" />
    <DialogAlterarCandidato v-if="mostrarDialogAlterarCandidado" @cancelar="mostrarDialogAlterarCandidado = false" :cards="cards"/>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import AppFormSelect from "~/components/Ui/AppFormSelect.vue"
	import { buscarEtapa } from "@/mixins/buscarInformacoes"
	import AppTooltip from "~/components/Ui/AppTooltip.vue"
	import DialogAdicionarIndicacao from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAdicionarIndicacao.vue"
  import DialogAlterarCandidato from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAlterarCandidato.vue";

	export default {
		name: "DialogProcessarCard",
		mixins: [buscarEtapa],
		components: {
      DialogAlterarCandidato,
			AppTooltip,
			BaseDialog,
			BotaoPadrao,
			AppFormTextarea,
			AppFormSelect,
			DialogAdicionarIndicacao,
		},
		props: {
			cards: {
				type: Array,
				required: true,
			},
			etapa: {
				type: [Object],
			},
			proximaEtapa: {
				type: [Object],
			},
		},
		data() {
			return {
				processo: {
					etapa_id: null,
					comentario: null,
				},
				etapas: [],
				mostraDialogAdicionarIndicacao: false,
        mostrarDialogAlterarCandidado: false,
				cardAddIndicacao: null,
			}
		},
		async fetch() {
			let etapas = await this.buscarEtapa()

			this.etapas = etapas.slice(3)
		},
    computed: {
      todosTemIndicacao() {
        let indicacoes = this.cards.map(o => o['Indicacao.nome'])

        return indicacoes.every( o=> o !== null && o !== "")
      }
    },
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			// async processarCards() {
			// 	let cards = this.cards.map((card) => card.id)
			// 	let usuario_id = this.$auth.user ? this.$auth.user.id : null
      //
			// 	let { comentario } = this.processo
      //
			// 	let { id: etapa_id, ordem } = this.processo.etapa_id
      //
			// 	await this.$axios
			// 		.$post("/contratacao/card/processar", {
			// 			cards,
			// 			usuario_id,
			// 			comentario,
			// 			etapa_id,
			// 			ordem,
			// 		})
			// 		.then(() => {
			// 			this.$emit("processado", { cards, etapa_id: this.processo.etapa_id })
			// 			this.processo = {
			// 				etapa_id: null,
			// 				comentario: null,
			// 			}
			// 		})
			// },
      async indicacaoAdicionada({ indicacao, card_id }){
        console.log(indicacao)
        console.log(card_id)

        let idx = this.cards.findIndex( o => o.id = card_id)

        console.log(idx)
        console.log(this.cards[idx])

        this.cards[idx]['Indicacao.nome'] = indicacao.nome
        this.mostraDialogAdicionarIndicacao = false
      },

      async processarCards(etapa_id_destino) {
        let cards = this.cards.map((card) => card.id)
        let usuario_id = this.$auth.user ? this.$auth.user.id : null

        let {comentario} = this.processo

        let {id: etapa_id_origem} = this.etapa

        console.log(cards)
        console.log(usuario_id)
        console.log(comentario)
        // console.log(etapa_id)
        console.log(this.etapa)
        // console.log(etapa_id)

        await this.$axios
          .$post("/contratacao/card/processar/novo_padrao", {
            cards,
            usuario_id,
            comentario,
            etapa_id_destino,
          })
          .then(() => {
            this.$emit("processado", {cards, etapa_id: this.processo.etapa_id})
            this.processo = {
              comentario: null,
            }
          })
      },
		},
	}
</script>

<style scoped>
	th,
	td {
		border-left: 1px solid rgb(75, 85, 99);
		border-right: 1px solid rgb(75, 85, 99);
	}

	th {
		position: sticky;
		top: 0;
		background-color: rgb(0, 53, 127);
		z-index: 100;
		border-left: 1px solid rgb(75, 85, 99) !important;
		border-right: 1px solid rgb(75, 85, 99);
	}
</style>
