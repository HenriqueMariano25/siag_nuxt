<template>
	<div>
		<BaseDialog
			titulo="Processar SS"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="grid w-full">
					<div class="bg-gray-300 w-full p-2 space-x-5 flex justify-between">
						<span>
							<strong>Num. Acompanhamento: </strong>{{ ss ? ss.numero_acompanhamento : "" }}
						</span>
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
						<AppFormInput
							:type="typeInput"
							:placeholder="placeholder"
							:label="label"
							v-model="processo.input"
							id="inputProcesso" />
						<AppFormTextarea
							id="comentario"
							label="Comentário"
							placeholder="Comentário opcional"
							v-model="processo.comentario"
							class="" />
					</div>
				</div>
			</template>
			<template v-slot:rodape-btn-direito>
				<div class="flex items-center gap-5 text-black justify-between w-full">
					<div>
						<div v-if="etapa_id >= 9 && etapa_id <= 17">
							<BotaoPadrao
								texto="Negar SS"
								cor="bg-red-400 hover:bg-red-600"
								class="ml-5"
								@clique="valNegarSS = true"
								:disabled="bloquearBtnNegar"
								v-if="!valNegarSS">
								<img
									src="@/assets/icons/close-b.svg"
									alt="close"
									class="w-6 h-6" />
							</BotaoPadrao>
							<div
								class="flex items-center text-white ml-5 gap-x-5"
								v-if="valNegarSS">
								<BotaoPadrao
									texto="Não"
									cor="bg-red-400 hover:bg-red-600"
									@clique="valNegarSS = false" />
								<span>Tem certeza que deseja negar essa solicitação ?</span>
								<BotaoPadrao
									texto="Sim"
									cor="bg-green-400 hover:bg-green-600"
									@clique="negarSS()" />
							</div>
						</div>
					</div>
					<div class="flex gap-x-2">
						<BotaoPadrao
              v-if="$auth.user.permissoes.includes('ss_gerenciamento')"
							texto="Alt. Comprador"
							@clique="mostrarDialogAlterarComprador = true">
							<img
								src="@/assets/icons/arrows-rotate-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
						<BotaoPadrao
							v-if="etapa_id === 17 || etapa_id === 27"
							:disabled="processo.input === null || processo.input === ''"
							texto="Finalizar SS"
							@clique="finalizarSS()">
							<template v-slot>
								<img
									src="@/assets/icons/check-circle-b.svg"
									alt="close"
									class="w-6 h-6" />
							</template>
						</BotaoPadrao>
						<BotaoPadrao
							v-if="etapa_id !== 27"
							:disabled="bloquearBtnNegar"
							texto="VOLTAR SS"
							@clique="voltarSS()">
							<template v-slot>
								<img
									src="@/assets/icons/back-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
						<BotaoPadrao
							v-if="etapa_id !== 27"
							:disabled="processo.input === null || processo.input === '' || processando"
							texto="Processar SS"
							@clique="processarSS()">
							<template v-slot>
								<img
									src="@/assets/icons/check-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</BaseDialog>
		<DialogAlterarComprador
			v-if="mostrarDialogAlterarComprador"
			@cancelar="mostrarDialogAlterarComprador = false"
      @alterado="alterado"
			:solicitacoes="[ss]" />
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
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import DialogAlterarComprador from "~/components/Dialogs/Suprimentos/SS/DialogAlterarComprador.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
	export default {
		name: "DialogProcessarCard",
		components: {
      AppAlerta,
			DialogAlterarComprador,
			BaseDialog,
			BotaoPadrao,
			AppFormTextarea,
			AppFormInput,
		},
		props: {
			ss: {
				type: [Object],
			},
			label: {
				type: String,
			},
			placeholder: {
				type: String,
			},
			campo: {
				type: String,
			},
			typeInput: {
				type: String,
			},
			etapa_id: {
				type: [Number, String],
			},
		},
		computed: {
			bloquearBtnNegar() {
				return this.processo.comentario === null || this.processo.comentario === ""
			},
		},
		data() {
			return {
				processo: {
					comentario: null,
					input: null,
				},
				valNegarSS: false,
				processando: false,
				mostrarDialogAlterarComprador: false,
        mostrarAlerta: false,
        textoAlerta: ""
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async processarSS() {
				this.processando = true

				let { comentario, input } = this.processo
				let campo = this.campo
				let label = this.label
				let ss_id = this.ss.id
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/suprimentos/ss/processar_geral_ss", {
					comentario,
					input,
					campo,
					ss_id,
					label,
					usuario_id,
				})

				if (!resp.falha) {
					this.processo = {
						comentario: null,
						input: null,
					}
					this.processando = false
					this.$emit("processado", [ss_id])
				}
			},

			async voltarSS() {
				this.processando = true
				let { comentario } = this.processo
				let usuario_id = this.$auth.user.id
				let solicitacoes = [this.ss.id]

				let resp = await this.$axios.post("/suprimentos/ss/voltar_ss", {
					comentario,
					solicitacoes,
					usuario_id,
				})

				if (!resp.falha) {
					this.processando = false
					this.$emit("retornado", solicitacoes)
				}
			},

			async finalizarSS() {
				let { comentario, input } = this.processo
				let campo = this.campo
				let label = this.label
				let ss_id = this.ss.id
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/suprimentos/ss/finalizar_ss", {
					comentario,
					input,
					campo,
					ss_id,
					label,
					usuario_id,
				})

				if (!resp.falha) {
					this.processo = {
						comentario: null,
						input: null,
					}
					this.$emit("processado", [ss_id])
				}
			},

			async negarSS() {
				let { comentario } = this.processo
				let solicitacoes = [this.ss.id]
				let usuario_id = this.$auth.user.id

				let resp = await this.$axios.$post("/suprimentos/ss/negar_ss", {
					comentario,
					solicitacoes,
					usuario_id,
				})

				if (!resp.falha) {
					this.processo = {
						comentario: null,
						input: null,
					}
					this.$emit("negado", [this.ss.id])
				}
			},

      async alterado(comprador){
        this.textoAlerta = "Comprador alterado com sucesso!"
        this.mostrarAlerta = true
        this.mostrarDialogAlterarComprador = false

        let solicitacoes = [this.ss.id]

        this.$emit("compradorAlterado", { comprador, solicitacoes})
      }
		},
	}
</script>

<style scoped></style>
