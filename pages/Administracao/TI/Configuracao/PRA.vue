<template>
	<div class="w-full">
		<CabecalhoPagina titulo="PRA" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<AppTabs
				:tabs="tabs"
				@tab="tab = $event">
				<template v-slot:[`tab.usuarios`]>
					<TabelaPadrao
						id="pra"
						:cabecalho="cabecalhoUsuario"
						:dados="dadosUsuario"
						:tem-rodape="false"
						altura="calc(100vh - 130px)"
						@atualizar="buscarSetores"
						:temDetalhes="false">
						<template v-slot:[`body.nome`]="{ item }">
							<span class="grow w-full">{{ item.nome }}</span>
						</template>
						<template v-slot:[`body.quantidade`]="{ item }">
							<div
								class="flex gap-1 items-center"
								v-if="setor_id === item.id">
								<AppFormInput
									id=""
									type="number"
									placeholder="Quantidade"
									v-model="quantidade" />
							</div>
						</template>
						<template v-slot:[`body.acoes`]="{ item }">
							<div class="flex gap-1 w-[70px] justify-end">
								<BotaoPadrao
									v-if="setor_id !== item.id"
									icone
									@clique="setor_id = item.id">
									<img
										src="@/assets/icons/edit-b.svg"
										alt=""
										class="w-6 h-6" />
								</BotaoPadrao>
								<BotaoPadrao
									v-if="setor_id === item.id"
									icone
									@clique="atualizarPra('usuario')">
									<img
										src="@/assets/icons/save-b.svg"
										alt=""
										class="w-6 h-6" />
								</BotaoPadrao>
								<BotaoPadrao
									v-if="setor_id === item.id"
									icone
									@clique="setor_id = null">
									<img
										src="@/assets/icons/close-b.svg"
										alt=""
										class="w-6 h-6" />
								</BotaoPadrao>
							</div>
						</template>
					</TabelaPadrao>
				</template>
			</AppTabs>
		</div>
		<RodapePagina />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			RodapePagina,
			TabelaPadrao,
			AppFormInput,
			BotaoPadrao,
			AppTabs,
			CabecalhoPagina,
		},
		data() {
			return {
				tabs: [
					{ nome: "Usuários", valor: "usuarios" },
					{ nome: "Chips", valor: "chips" },
				],
				tab: "usuario",
				cabecalhoUsuario: [
					{ nome: "Setor", valor: "nome" },
					{
						nome: "Quantidade",
						valor: "quantidade",
						largura: "w-[120px]",
					},
					{ nome: "", valor: "acoes", largura: "!w-14" },
				],
				dadosUsuario: [],
				setores: [],
				setor_id: null,
				quantidade: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		async mounted() {
			await this.buscarSetores()
			await this.buscarPra()
		},
		methods: {
			async buscarSetores() {
				let resp = await this.$axios.$get("/efetivo/setores")

				this.setores = resp.setores
			},
			async buscarPra() {
				let resp = await this.$axios.$get("/ti/pra/buscarTodos")

				if (!resp.falha) {
					let praUsuario = resp.dados.pras.filter((o) => o.tipo === "usuario")

					let dadosUsuario = []
					for (let setor of this.setores) {
						let praDoSetor = praUsuario.find((o) => o.setor_id === setor.id)
						dadosUsuario.push({
							id: setor.id,
							nome: setor.nome,
							quantidade: praDoSetor ? praDoSetor.quantidade : 0,
						})
					}

					this.dadosUsuario = dadosUsuario
				}
			},
			async atualizarPra(tipo) {

				let resp = await this.$axios.$post("/ti/pra/atualizar", {
					setor_id: this.setor_id,
					quantidade: this.quantidade,
					tipo,
				})

				if (!resp.falha) {
					if (this.tab === "usuarios") {
						let idx = this.dadosUsuario.findIndex((item) => item.id === this.setor_id)

						if (idx >= 0) {
							this.dadosUsuario[idx].quantidade = this.quantidade
						}

						this.setor_id = null
						this.quantidade = null
						this.textoAlerta = "PRA atualizado com sucesso!"
						this.mostrarAlerta = true
					}
				}
			},
		},
		watch: {
			setor_id(valor) {
				if (valor) {
					if (this.tab === "usuarios") {
						this.quantidade = this.dadosUsuario.find((o) => o.id === valor).quantidade
					}
				}
			},
		},
	}
</script>

<style scoped></style>
