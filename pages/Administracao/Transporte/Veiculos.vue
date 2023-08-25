<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Veículos" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarVeiculos"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="flex">
						<BotaoPadrao
							@clique="
								veiculo = item
								mostrarDialogCriarVeiculo = true
							"
							icone>
							<div class="w-6 h-6 flex items-center justify-center">
								<img
									src="@/assets/icons/edit-b.svg"
									alt=""
									class="w-5 h-5" />
							</div>
						</BotaoPadrao>
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<div class="flex">
						<BotaoPadrao
							class="flex"
							@clique="mostrarDialogCriarVeiculo = true"
							texto="Adicionar">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarVeiculo
			v-if="mostrarDialogCriarVeiculo"
			@cancelar="mostrarDialogCriarVeiculo = false"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
			:veiculo="veiculo" />
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
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarVeiculo from "~/components/Dialogs/Administracao/Transporte/DialogCriarVeiculo.vue"
  import DialogCriarRota from "~/components/Dialogs/Administracao/Transporte/DialogCriarRota.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		name: "Veiculos",
		components: { AppAlerta, DialogCriarRota, DialogCriarVeiculo, BotaoPadrao, RodapePagina, TabelaPadrao, CabecalhoPagina },
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Ocupação", valor: "ocupacao" },
				],
				filtros: {},
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCriarVeiculo: false,
				veiculo: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		created() {
			this.buscarVeiculos()
		},
		methods: {
			async buscarVeiculos() {
				let filtros = this.filtros

				let resp = await this.$axios.$get("/transporte/buscar/veiculos", {
					params: {
						filtros,
					},
				})

				if (!resp.falha) {
					this.dados = resp.veiculos
					this.totalItens = this.dados.length
				}
			},
      cadastrado(veiculo) {
        this.dados.push(veiculo)
        this.mostrarDialogCriarVeiculo = false
        this.textoAlerta = "Veículo cadastrada com sucesso!"
        this.mostrarAlerta = true
        this.totalItens += 1
      },
      editado(veiculo) {
        let idx = this.dados.findIndex((o) => o.id === veiculo.id)
        this.dados[idx].nome = veiculo.nome
        this.dados[idx].ocupacao = veiculo.ocupacao

        this.veiculo = null
        this.mostrarDialogCriarVeiculo = false
        this.textoAlerta = "Veículo editada com sucesso!"
        this.mostrarAlerta = true
      },

      deletado(id) {
        let idx = this.dados.findIndex((o) => o.id === id)
        this.dados.splice(idx, 1)

        this.mostrarDialogCriarVeiculo = false
        this.textoAlerta = "Veículo deletada com sucesso!"
        this.mostrarAlerta = true
        this.veiculo = null
        this.totalItens -= 1
      },
		},
	}
</script>

<style scoped></style>
