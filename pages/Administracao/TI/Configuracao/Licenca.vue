<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="LICENÇAS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
				id="chips"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				:carregando="carregando"
				altura="calc(100vh - 179px)"
				@atualizar="buscarLicencas"
				:temDetalhes="true">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-8">
						<BotaoPadrao
							icone
							@clique="
								mostrarDialogCadastrarLicenca = true
								licenca = item
							">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-end">
				<BotaoPadrao
					texto="cadastrar"
					@clique="mostrarDialogCadastrarLicenca = true">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarLicenca
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado"
			v-if="mostrarDialogCadastrarLicenca"
			@cancelar="
				mostrarDialogCadastrarLicenca = false
				licenca = null
			"
			:licenca="licenca" />
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
	import DialogCadastrarLicenca from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarLicenca.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			DialogCadastrarLicenca,
			RodapePagina,
			BotaoPadrao,
			CabecalhoPagina,
			TabelaPadrao,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Nome", valor: "nome", filtro: true, ordenar: true },
					{ nome: "Valor", valor: "valor", filtro: true, ordenar: true },
					{ nome: "Tipo", valor: "tipo_licenca", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				carregando: false,
				mostrarDialogCadastrarLicenca: false,
				licenca: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		mounted() {
			this.buscarLicencas()
		},
		methods: {
			async buscarLicencas() {
				let licencas = this.$store.state.ti.licencaTI.licencas
				if (licencas.length === 0) {
					licencas = await this.$axios
						.$get("/ti/licenca/buscarTodos")
						.then((resp) => resp.dados.licencas)

					this.$store.commit("ti/licencaTI/DEFINIR_LICENCAS_TI", {
						licencas,
					})
				}

				this.dados = new Array(...licencas)
        this.totalItens = licencas.length
			},
			cadastrado(licenca) {
				this.dados.unshift(licenca)

				this.mostrarDialogCadastrarLicenca = false
				this.textoAlerta = "Licença cadastrada com sucesso!"
				this.mostrarAlerta = true
				this.licenca = null
        this.totalItens += 1
			},
			editado(licenca) {
				let idx = this.dados.findIndex((o) => o.id === licenca.id)

				if (idx >= 0) {
					this.dados[idx].nome = licenca.nome
					this.dados[idx].tipo_licenca = licenca.tipo_licenca
					this.dados[idx].valor = licenca.valor

					this.mostrarDialogCadastrarLicenca = false
					this.textoAlerta = "Licença editada com sucesso!"
					this.mostrarAlerta = true
					this.licenca = null
				}
			},
			deletado(id) {
				let idx = this.dados.findIndex((o) => o.id === id)
        if(idx >= 0){
          this.dados.splice(idx, 1)
          this.mostrarDialogCadastrarLicenca = false
          this.textoAlerta = "Licença deletada com sucesso!"
          this.mostrarAlerta = true
          this.licenca = null
          this.totalItens -= 1
        }
			},
		},
	}
</script>

<style scoped></style>
