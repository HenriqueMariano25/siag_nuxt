<template>
	<div class="w-full ">
		<CabecalhoPagina titulo="RELÁTORIO" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="avaliacoes"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
        :tem-rodape="false"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 116px)"
				@atualizar="buscarFuncionarios()"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-8">
						<BotaoPadrao
							@clique="
								id = item.id
								mostrarDialogRelatorioAvaliacao = true
							"
							icone
							class="!p-0.5">
							<div class="w-[22px]">
								<img
									src="@/assets/icons/graph-b.svg"
									alt=""
									class="w-6 h-6" />
							</div>
						</BotaoPadrao>
					</div>
				</template>
			</TabelaPadrao>
      <RodapePagina class="print:hidden">
        <template v-slot>
          <div class="flex items-center w-full">
            <div class="flex w-full justify-end gap-4">
            </div>
          </div>
        </template>
      </RodapePagina>
		</div>
		<DialogRelatorioAvaliacao
			v-if="mostrarDialogRelatorioAvaliacao"
			@cancelar="mostrarDialogRelatorioAvaliacao = false"
			:funcionario_id="id" />
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogRelatorioAvaliacao from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/Relatorio/DialogRelatorioAvaliacao.vue"
  import RodapePagina from "~/components/Shared/RodapePagina.vue";

	export default {
		components: { RodapePagina, DialogRelatorioAvaliacao, BotaoPadrao, CabecalhoPagina, TabelaPadrao },
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-12" },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Matrícula", valor: "chapa", filtro: true },
					{ nome: "Cargo", valor: "cargo", filtro: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
        mostrarDialogRelatorioAvaliacao: false,
        id: null,
			}
		},
		mounted() {
			this.buscarFuncionarios()
		},
		methods: {
			async buscarFuncionarios() {
        let usuario_id = this.$auth.user.id
				let resp = await this.$axios.$get("/avaliacao_funcionario/relatorio/funcionarios", { params: { usuario_id }})

				if (!resp.falha) {
					let { funcionarios } = resp.dados
					this.dados = funcionarios
				}
			},
		},
	}
</script>

<style scoped></style>
