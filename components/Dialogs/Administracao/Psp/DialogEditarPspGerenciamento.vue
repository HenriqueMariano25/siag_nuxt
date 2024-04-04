<template>
	<div>
		<BaseDialog
			:titulo="psp ? 'EDITAR PSP - ' + ('00000' + psp.id).slice(-5) : ''"
			largura="w-10/12"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div
					class="px-2 flex flex-col gap-2"
					v-if="psp">
					<div class="flex flex-col w-full border border-slate-700">
						<span class="px-2 bg-slate-700 text-white font-bold">FUNCIONÁRIO</span>
						<div class="flex justify-between">
							<div class="cada-texto">
								<span class="titulo">MATRÍCULA</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.chapa : "" }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">NOME</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.nome : "" }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">CARGO</span>
								<span class="texto">{{ psp.Funcionario ? psp.Funcionario.cargo : "" }}</span>
							</div>
						</div>
					</div>
					<div class="flex flex-col w-full border border-slate-700 gap-1">
						<span class="px-2 bg-slate-700 text-white font-bold">VIAGEM</span>
						<div class="flex justify-between">
							<div class="cada-texto">
								<span class="titulo">DATA DE IDA</span>
								<span class="texto">{{ $dayjs(psp.data_id).format("DD/MM/YYYY") }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">MOTIVO</span>
								<span class="texto">{{ psp.motivo }}</span>
							</div>
							<div class="cada-texto">
								<span class="titulo">DESTINO</span>
								<span class="texto">{{ psp.destino }}</span>
							</div>
						</div>
					</div>
					<div class="flex flex-col border border-slate-700">
						<span class="px-2 bg-slate-700 text-white font-bold text-xl"
							>TROCAR DE SOLICITANTE</span
						>
						<div class="flex flex-col px-2 py-2">
							<span class="">SOLICITANTE ATUAL</span>
							<span class="font-bold text-xl px-2">{{
								psp.criado_por ? psp.criado_por.nome : ""
							}}</span>
							<div>
								<span>NOVO SOLICITANTE</span>
								<AppFormSelectCompleto
									style="z-index: 103 !important"
									class="grow"
									id="marca"
									v-model="solicitante_id"
									btn-cadastrar
									label="Usuário"
									obrigatorio
									:options="usuarios" />
							</div>
						</div>
					</div>
				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <div class="justify-end w-full flex">
          <BotaoPadrao
            texto="salvar"
            @clique="trocarSolicitante()">
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
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"

	export default {
		components: { BotaoPadrao, AppFormSelectCompleto, BaseDialog },
		props: {
			psp_id: {
				type: Number,
				default: null,
			},
		},
		data() {
			return {
				psp: null,
				usuarios: [],
				solicitante_id: null,
			}
		},
		mounted() {
			if (this.psp_id !== null) {
				this.buscarPsp()
				this.buscarUsuarios()
			}
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarPsp() {
				let resp = await this.$axios.$get(`/psp/buscar/${this.psp_id}`)

				if (!resp.falha) {
					this.psp = resp.dados.psp
				}
			},
			async buscarUsuarios() {
				let resp = await this.$axios.$get("/usuario/ativos/BuscarTodos/simples")
				if (!resp.falha) {
					let { usuarios } = resp.dados
					this.usuarios = usuarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
			async trocarSolicitante() {
				let solicitante_id = this.solicitante_id
				let usuario_id = this.$auth.user.id
				let id = this.psp_id

				let resp = await this.$axios.$put("/psp/trocarSolicitante", {
					solicitante_id,
					usuario_id,
					id,
				})

				if (!resp.falha) {
					let { solicitante } = resp.dados

					this.$emit("solicitanteTrocado", { solicitante, id })
				}
			},
		},
	}
</script>

<style scoped>
	.cada-texto {
		display: flex;
		flex-direction: column;
		padding: 0 0.5rem;
	}
	.titulo {
		font-size: 12px;
		color: #545458;
		margin-left: 6px;
		font-weight: 500;
	}
	.texto {
		font-size: 18px;
		color: #212121;
		font-weight: 600;
		margin-top: -2px;
	}
</style>
