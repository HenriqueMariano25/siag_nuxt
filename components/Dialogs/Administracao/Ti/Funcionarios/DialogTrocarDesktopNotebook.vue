<template>
	<div>
		<BaseDialog
			largura="w-10/12"
			class="uppercase"
			titulo="ADICIONAR DESKTOP/NOTEBOOK"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="flex flex-col w-full px-2 gap-2">
					<div class="flex gap-2 w-full">
						<AppFormInput
							type="text"
              @keyup.enter.prevent.stop="buscarDeskNote()"
							class="grow"
							uppercase
							v-model="buscaDeskNote"
							placeholder="Ex: GNA2-0001"
							label="Buscar por patrimônio, serial ou hostname"
							id="patrimonio_serial_hostname" />
						<div class="flex items-end">
							<BotaoPadrao
								texto="buscar"
								cor="bg-blue-400 hover:!bg-blue-500"
								@clique="buscarDeskNote()"
								:disabled="bloquearBuscarDeskNote">
								<img
									src="@/assets/icons/magnifier-b.svg"
									alt=""
									class="w-7 h-7" />
							</BotaoPadrao>
						</div>
					</div>
					<div
						v-for="deskNote of desktopsNotebooks"
						:key="deskNote.id"
						class="border flex flex-col p-2 shadow"
						:class="{
							'bg-stone-300 border-stone-400': deskNote.tipo === 'desktop',
							'bg-slate-300 border-slate-400': deskNote.tipo === 'notebook',
						}">
						<div class="flex gap-3">
							<div class="flex flex-col grow">
								<div class="flex gap-4">
									<div class="flex flex-col">
										<span class="titulo-desknote">HOSTNAME</span>
										<span class="texto-desknote">{{ deskNote.hostname }}</span>
									</div>
									<div class="flex flex-col">
										<span class="titulo-desknote">SERIAL</span>
										<span class="texto-desknote">{{ deskNote.serial }}</span>
									</div>
									<div class="flex flex-col">
										<span class="titulo-desknote">PATRIMÔNIO</span>
										<span class="texto-desknote">{{
											deskNote.patrimonio ? deskNote.patrimonio : "-"
										}}</span>
									</div>
								</div>
								<div class="px-0.5 font-bold text-slate-700 text-sm flex whitespace-nowrap">
									<span class="whitespace-nowrap mr-4">{{ deskNote.tipo }} </span>
									<span class="whitespace-nowrap">
										{{ deskNote.MarcaTI ? deskNote.MarcaTI.nome : "" }} -&nbsp
									</span>
									<span class="whitespace-nowrap">
										{{ deskNote.ModeloTI ? deskNote.ModeloTI.nome : "" }}
									</span>
								</div>
							</div>
							<div class="flex">
								<div class="grid grid-cols-1 text-end content-between h-full">
									<span class="text-sm">
										Data de entrega:
										<strong class="text-lg">
											{{ $dayjs(deskNote.data_entrega).format("DD/MM/YYYY HH:mm:ss") }}
										</strong>
									</span>
									<span class="text-sm self-end">
										RESPONSÁVEL:
										<strong
											class="text-lg"
											:class="{ 'text-green-800': !deskNote.Funcionario }">
											{{ deskNote.Funcionario ? deskNote.Funcionario.nome : "ESTOQUE" }}
										</strong>
									</span>
								</div>
							</div>
							<div class="flex">
								<div class="flex flex-col items-center justify-center h-full gap-1">
									<BotaoPadrao
										v-if="deskNote_id !== deskNote.id"
										icone
										@clique="deskNote_id = deskNote.id"
										cor="!bg-blue-300 hover:!bg-blue-400">
										<img
											src="@/assets/icons/add-b.svg"
											alt=""
											class="w-9 h-9" />
									</BotaoPadrao>
									<BotaoPadrao
										v-if="deskNote_id === deskNote.id"
										icone
										@clique="adicionarDeskNote(deskNote)"
										cor="!bg-green-400 hover:!bg-green-500">
										<img
											src="@/assets/icons/add-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
									<BotaoPadrao
										v-if="deskNote_id === deskNote.id"
										icone
										@clique="deskNote_id = null"
										cor="!bg-red-300 hover:!bg-red-400">
										<img
											src="@/assets/icons/close-b.svg"
											alt=""
											class="w-7 h-7" />
									</BotaoPadrao>
								</div>
							</div>
						</div>
						<div
							class="bg-red-400 w-full px-2 text-center uppercase text-white rounded border border-red-500 py-1 font-bold mt-2"
							v-if="deskNote.Funcionario && deskNote_id === deskNote.id">
							<span
								>ESSE {{ deskNote.tipo }} já tem um responsável, certeza que deseja fazer a troca
								?</span
							>
						</div>
					</div>
				</div>
			</template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	export default {
		components: { BaseDialog },
		data() {
			return {
				buscaDeskNote: null,
				desktopsNotebooks: [],
				deskNote_id: null,
			}
		},
		props: {
			funcionario_id: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			bloquearBuscarDeskNote() {
				let busca = this.buscaDeskNote ? this.buscaDeskNote.trim() : this.buscaDeskNote

				return busca === null || busca === ""
			},
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarDeskNote() {
				let busca = this.buscaDeskNote
				let funcionario_id = this.funcionario_id

				let resp = await this.$axios.$get("/ti/funcionarios/buscarDeskNote", {
					params: { busca, funcionario_id },
				})

				if (!resp.falha) {
					this.desktopsNotebooks = resp.dados.maquinas
				}
			},
			async adicionarDeskNote(deskNote) {
				let funcionario_id = this.funcionario_id
				let desktopnotebookti_id = deskNote.id

				let resp = await this.$axios.$post("/ti/funcionarios/trocarDeskNote", {
					funcionario_id,
					desktopnotebookti_id,
				})

				if (!resp.falha) {
          deskNote.data_entrega = this.$dayjs().format("YYYY-MM-DD HH:mm:ss")
					this.$emit("trocado", deskNote)
				}
			},
		},
	}
</script>

<style scoped>
	.titulo-desknote {
		font-size: 11px;
		text-align: center;
		font-weight: 700;
		color: #545458;
		white-space: nowrap;
	}

	.texto-desknote {
		font-size: 19px;
		text-align: center;
		font-weight: 700;
		color: #000000;
		white-space: nowrap;
		text-transform: uppercase;
	}
</style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
</script>
