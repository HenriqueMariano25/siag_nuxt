<template>
	<div>
		<BaseDialog
			largura="w-11/12"
			titulo="EDITAR AVALIAÇÃO"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="relative px-2">
					<div class="grid grid-cols-2 gap-2">
						<table class="table w-full">
							<thead class="bg-blue-900 text-white w-full">
								<tr class="border border-gray-500 font-bold text-center">
									<th class="w-10/12 border border-gray-500 px-2">1. Habilidade Técnicas</th>
									<th class="w-2/12 border border-gray-500 px-2">Nota</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td
										colspan="2"
										class="border-gray-500 border bg-slate-300">
										<div class="w-full text-center">
											<span
												><strong>1</strong>-Não atende; <strong>2</strong>-Atende;
												<strong>3</strong>-Supera</span
											>
										</div>
									</td>
								</tr>
								<tr v-for="habilidade of habilidadesTecnicas">
									<td class="w-10/12 border border-gray-500 px-2">
										{{ habilidade.descricao }}
									</td>
									<td class="w-2/12 border border-gray-500 px-2">
										<div class="w-full flex justify-center">
											<input
												type="text"
												v-maska
												class="border border-gray-600 px-3.5 font-bold text-lg w-[40px] rounded"
												data-maska="A"
												:class="{
													'bg-red-200 border border-red-400':
														errosHabTecnicas &&
														(!Object.keys(funcionario.habilidadesTecnicas).includes(
															habilidade.id.toString(),
														) ||
															funcionario.habilidadesTecnicas[habilidade.id.toString()] === ''),
												}"
												v-model="funcionario.habilidadesTecnicas[`${habilidade.id}`]"
												data-maska-tokens="A:[1-3]" />
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<table class="table w-full">
							<thead class="bg-blue-900 text-white w-full">
								<tr class="border border-gray-300 font-bold text-center">
									<th class="w-10/12 border border-gray-300 px-2">2. Habilidade Comportamentais</th>
									<th class="w-2/12 border border-gray-300 px-2">Nota</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td
										colspan="2"
										class="border-gray-500 border bg-slate-300">
										<div class="w-full text-center">
											<span>
												<strong>1</strong>-Não atende; <strong>2</strong>-Atende;
												<strong>3</strong>-Supera
											</span>
										</div>
									</td>
								</tr>
								<tr v-for="conhecimento of conheComportamentais">
									<td class="w-10/12 border border-gray-500 px-2">
										{{ conhecimento.descricao }}
									</td>
									<td class="w-2/12 border border-gray-500 px-2">
										<div class="w-full flex justify-center">
											<input
												type="text"
												v-maska
												class="border border-gray-600 px-3.5 font-bold text-lg w-[40px] rounded"
												data-maska="A"
												:class="{
													'bg-red-200 border border-red-400':
														errosConheComportamental &&
														(!Object.keys(funcionario.conheComportamentais).includes(
															conhecimento.id.toString(),
														) ||
															funcionario.conheComportamentais[conhecimento.id.toString()] === ''),
												}"
												v-model="funcionario.conheComportamentais[`${conhecimento.id}`]"
												data-maska-tokens="A:[1-3]" />
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<div class="col-span-2 flex flex-col pb-2">
							<span class="bg-blue-900 text-white font-bold px-2">3. Comentários Gerais</span>
							<AppFormTextarea
								id="observacao"
								:total-caracteres="1000"
								label="Comentários Gerais"
								linhas="2"
								v-model="funcionario.comentario_geral"
								placeholder="Comentário opcional"
								class="col-span-3" />
						</div>
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div>
					<BotaoPadrao
						texto="salvar"
						@clique="editarAvaliacao()">
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
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import AppFormTextarea from "~/components/Ui/Form/AppFormTextarea.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, AppFormTextarea, BaseDialog },
		props: {
			avaliacao_id: {
				type: Number,
			},
		},
		data() {
			return {
				avaliacao: null,
				habilidadesTecnicas: {},
				funcionario: {
					funcionario_id: null,
					habilidadesTecnicas: [],
					conheComportamentais: [],
					comentario_geral: null,
				},
				conheComportamentais: [],
				errosHabTecnicas: false,
				errosConheComportamental: false,
			}
		},
		async mounted() {
			await this.buscarAvaliacao()
			await this.buscarHabilidadesTecnicas()
			await this.buscarConheComportamental()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarAvaliacao() {
				let id = this.avaliacao_id

				let resp = await this.$axios.$get("/avalicao_funcionario/buscarAvaliacao", {
					params: { id },
				})

				if (!resp.falha) {
					let avaliacao = resp.dados.avaliacao
					let habilidadesTecnicas = avaliacao.AvaliacaoTemHabTecnicas
					for (let hab of habilidadesTecnicas) {
						this.funcionario.habilidadesTecnicas[`${hab.habilidade_tecnica_avaliacao_id}`] =
							hab.nota
					}

					let conheComportamentais = avaliacao.AvaliacaoTemConheComportamental
					for (let con of conheComportamentais) {
						this.funcionario.conheComportamentais[`${con.ConheComportamentalAvaliacaoId}`] =
							con.nota
					}

					this.funcionario.comentario_geral = avaliacao.comentario_geral
				}
			},
			async buscarHabilidadesTecnicas() {
				let resp = await this.$axios.$get("/habilidade_tecnica/buscarSimples")

				if (!resp.falha) {
					this.habilidadesTecnicas = resp.dados.habilidades
				}
			},
			async buscarConheComportamental() {
				let resp = await this.$axios.$get("/conhecimento_comportamental/buscarSimples")

				if (!resp.falha) {
					this.conheComportamentais = resp.dados.conhecimentos
				}
			},
			async editarAvaliacao() {
				let valoresHab = Object.values(
					this.funcionario.habilidadesTecnicas.filter((o) => o !== "" && o !== null),
				)
				this.errosHabTecnicas = this.habilidadesTecnicas.length > valoresHab.length

				let valoresConhe = Object.values(
					this.funcionario.conheComportamentais.filter((o) => o !== "" && o !== null),
				)

				this.errosConheComportamental = this.conheComportamentais.length > valoresConhe.length

        let usuario_id = this.$auth.user.id
        let {
          comentario_geral } = this.funcionario
				if (this.errosHabTecnicas === false && this.errosConheComportamental === false) {
          let habilidadesTecnicas = Object.keys(this.funcionario.habilidadesTecnicas).map((o) => {
            return { id: parseInt(o), nota: this.funcionario.habilidadesTecnicas[o] }
          })

          let conheComportamentais = Object.keys(this.funcionario.conheComportamentais).map((o) => {
            return { id: parseInt(o), nota: this.funcionario.conheComportamentais[o] }
          })

					let resp = await this.$axios.post("/avaliacao_funcionario/editarAvaliacaoAprovacao", {
            avaliacao_id: this.avaliacao_id,
            usuario_id,
            habilidadesTecnicas,
            conheComportamentais,
            comentario_geral,
          })

          console.log(resp);
          if(!resp.falha){
            this.$emit("editado")
          }
				}
			},
		},
	}
</script>

<style scoped></style>
