<template>
	<div class="w-full">
		<CabecalhoPagina titulo="REPÚBLICAS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="republicas"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				@itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarRepublicas"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-8">
						<BotaoPadrao icone @clique="republica_id = item.id;mostrarDialogCriarRepublica = true">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</template>
				<template v-slot:[`body.taxa_ocupacao`]="{ item }">
					<span v-if="item.funcionarios && item.vagas">
						{{ (item.funcionarios / (parseFloat(item.vagas) / 100)).toFixed(2) }}%
					</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-between w-full">
					<div class="flex"></div>
					<div class="flex">
						<BotaoPadrao
							@clique="mostrarDialogCriarRepublica = true"
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
		<DialogCriarRepublica
			v-if="mostrarDialogCriarRepublica"
			@cancelar="
				mostrarDialogCriarRepublica = false
				republica_id = null
			"
			@cadastrado="cadastrado"
			@editado="editado"
			:republica_id="republica_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import DialogCriarRepublica from "~/components/Dialogs/Administracao/ServicoGerais/Republicas/DialogCriarRepublica.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			DialogCriarRepublica,
			RodapePagina,
			BotaoPadrao,
			CabecalhoPagina,
			TabelaPadrao,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Nome", valor: "nome", largura: "w-[150px]" },
					{ nome: "Endereço", valor: "rua", filtro: true, ordenar: true },
					{ nome: "Total de Ocupações", valor: "vagas", filtro: true, ordenar: true },
					{ nome: "Taxa de Ocupação", valor: "taxa_ocupacao", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
				mostrarDialogCriarRepublica: false,
				republica_id: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		mounted() {
			this.buscarRepublicas()
		},
		methods: {
			async buscarRepublicas() {
				let resp = await this.$axios.$get("/servicos_gerais/republicas")

				if (!resp.falha) {
					this.dados = resp.dados.republicas
					this.totalItens = resp.dados.republicas.length
				}
			},
			async cadastrado({ republica, sair }) {
        republica.vagas = 0
				this.dados.unshift(republica)
				this.textoAlerta = "República cadastrado com sucesso!"
				this.mostrarAlerta = true

				if (sair) {
					this.mostrarDialogCriarRepublica = false
				}
			},
      async editado({ republica, sair }) {
        let idx = this.dados.findIndex(o => o.id === republica.id)
        if(idx >= 0){
          this.textoAlerta = "República editada com sucesso!"
          this.mostrarAlerta = true

          this.dados[idx].nome = republica.nome
          this.dados[idx].rua = republica.rua
        }

        if (sair) {
          this.mostrarDialogCriarRepublica = false
        }
      },
		},
	}
</script>

<style scoped></style>
