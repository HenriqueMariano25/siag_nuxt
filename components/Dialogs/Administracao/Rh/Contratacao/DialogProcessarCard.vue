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
					<div class="px-1 bg-gray-200 border border-gray-300 flex flex-col pb-1 gap-y-1" v-if="!etapa.concluir_card">
						<div>
							<span
								class="text-red-600 text-xl"
								v-if="etapa.obrigatorio_indicacao && !todosTemIndicacao">
								<strong>Só é possivel processar se todos os cards tiver indicação.</strong>
							</span>
						</div>
						<div>
							<span>Clique na etapa que deseja mover os Cards acima</span>
						</div>
            <div v-if="etapa.voltar_etapa === true" class="border border-blue-200 bg-blue-100 p-1 flex flex-col gap-1">
              <span class="text-xl w-full bg-blue-200 px-1 uppercase font-medium">Etapa para retornar</span>
              <div class="flex ">
                <BotaoPadrao
                  :disabled="etapa.obrigatorio_indicacao && !todosTemIndicacao"
                  :texto="anteriorEtapa.ordem + ' - ' + anteriorEtapa.nome"
                  cor="bg-primaria-500 hover:bg-primaria-700"
                  class="text-white"
                  @click="processarCards(anteriorEtapa.id)" />
              </div>
            </div>
						<div class="flex flex-col gap-1 border border-green-300 bg-green-200 p-1" v-if="proximaEtapa">
              <span class="text-xl w-full bg-green-300 px-1 uppercase font-medium">Etapas para avançar</span>
              <div class="flex gap-2">
                <BotaoPadrao
                  :disabled="etapa.obrigatorio_indicacao && !todosTemIndicacao"
                  :texto="proximaEtapa.ordem + ' - ' + proximaEtapa.nome"
                  cor="bg-primaria-500 hover:bg-primaria-700"
                  class="text-white"
                  @click="processarCards(proximaEtapa.id)" />
                <div v-for="proxima of etapa.ProximasEtapas">
                  <!--              {{ proxima }}-->
                  <BotaoPadrao
                    :disabled="etapa.obrigatorio_indicacao && !todosTemIndicacao"
                    :texto="proxima.ordem + ' - ' + proxima.nome"
                    cor="bg-primaria-500 hover:!bg-primaria-700"
                    class="text-white"
                    @click="processarCards(proxima.id)" />
                </div>
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
						<img
							src="@/assets/icons/back-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
          <BotaoPadrao texto="Rejeitar cards" @click="rejeitarCard()" v-if="etapa.rejeita_card" class="bg-red-300 hover:!bg-red-400">
            <img src="@/assets/icons/close-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao texto="Standby cards" @click="standbyCard()" v-if="etapa.standby_card" class="">
            <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao texto="Retornar cards" @click="retornarDestandbyCard()" v-if="etapa.nome === 'Standby'" class="">
            <img src="@/assets/icons/information-circle-g.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao texto="Finalizar cards" @click="finalizarCard()" v-if="etapa.concluir_card">
            <img src="@/assets/icons/check-b.svg" alt="" class="w-7 h-7">
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
		<DialogAlterarCandidato
			v-if="mostrarDialogAlterarCandidado"
			@cancelar="mostrarDialogAlterarCandidado = false"
			:cards="cards"
			@alterouCandidato="$emit('alterouCandidato', $event)" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
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
	import DialogAlterarCandidato from "~/components/Dialogs/Administracao/Rh/Contratacao/DialogAlterarCandidato.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		name: "DialogProcessarCard",
		mixins: [buscarEtapa],
		components: {
      AppAlerta,
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
      anteriorEtapa: {
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
        mostrarAlerta: false,
        textoAlerta: ""
			}
		},
		async fetch() {
			let etapas = await this.buscarEtapa()

			this.etapas = etapas.slice(3)
		},
		computed: {
			todosTemIndicacao() {
				let indicacoes = this.cards.map((o) => o["Indicacao.nome"])

				return indicacoes.every((o) => o !== null && o !== "")
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async indicacaoAdicionada({ indicacao, card_id }) {
				let idx = this.cards.findIndex((o) => o.id === card_id)

				this.cards[idx]["Indicacao.nome"] = indicacao.nome
				this.mostraDialogAdicionarIndicacao = false
        this.textoAlerta = 'Indicação adicionada com sucesso!'
        this.mostrarAlerta = true
			},

			async processarCards(etapa_id_destino) {
				let cards = this.cards.map((card) => card.id)
				let usuario_id = this.$auth.user ? this.$auth.user.id : null

				let { comentario } = this.processo

				let { id: etapa_id_origem } = this.etapa

				await this.$axios
					.$post("/contratacao/card/processar/novo_padrao", {
						cards,
						usuario_id,
						comentario,
						etapa_id_destino,
					})
					.then(() => {
						this.$emit("processado", { cards, etapa_id: this.processo.etapa_id })
						this.processo = {
							comentario: null,
						}
					})
			},

      async finalizarCard(){
        let cards = this.cards.map((card) => card.id)
        let usuario_id = this.$auth.user ? this.$auth.user.id : null
        let { comentario } = this.processo

        let resp = await this.$axios.$post("/contratacao/card/finalizar_cards", { cards, usuario_id, comentario })

        if(!resp.falha){
          this.$emit("concluido", cards)
        }
      },

      async rejeitarCard(){
        let cards = this.cards.map((card) => card.id)
        let usuario_id = this.$auth.user ? this.$auth.user.id : null
        let { comentario } = this.processo

        let resp = await this.$axios.$post("/contratacao/card/rejeitar_cards", { cards, usuario_id, comentario })

        if (!resp.falha) {
          this.$emit("rejeitado", cards)
        }
      },

      async standbyCard() {
        let cards = this.cards.map((card) => card.id)
        let usuario_id = this.$auth.user ? this.$auth.user.id : null
        let { comentario } = this.processo

        let resp = await this.$axios.$post("/contratacao/card/standby_cards", { cards, usuario_id, comentario })

        if (!resp.falha) {
          this.$emit("standby", cards)
        }
      },

      async retornarDestandbyCard(){
        let cards = this.cards.map((card) => card.id)
        let usuario_id = this.$auth.user ? this.$auth.user.id : null
        let { comentario } = this.processo

        let resp = await this.$axios.$post("/contratacao/card/retornar_standby_cards", { cards, usuario_id, comentario })

        if (!resp.falha) {
          this.$emit("retornouStandby", cards)
        }
      }

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
