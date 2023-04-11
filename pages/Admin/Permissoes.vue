<template>
	<div>
		<AppTabela
			:cabecalho="cabecalho"
			:dados="dados"
			@filtrar="recebendoFiltro"
			:itensPorPagina="itensPorPagina"
			:pagina="pagina"
			altura="calc(100vh - 135px)"
			:totalItens="totalItens"
			@atualizar="atualizarDados"
			:carregando="carregando">
      <template v-slot:[`body.acoes`]="{ item }">
        <BotaoIconeEditar
          @click="
								mostrarDialogCriarPermissao = true
								permissao_id = item.id
							"/>
      </template>
		</AppTabela>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full justify-end gap-4">
						<BotaoPadrao
							texto="Criar Permissão"
							@click="mostrarDialogCriarPermissao = true">
							<template v-slot>
								<img
									src="@/assets/icons/add-b.svg"
									alt="close"
									class="w-7 h-7" />
							</template>
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
		<DialogCriarPermissao
			v-if="mostrarDialogCriarPermissao"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      :permissao_id="permissao_id"
			@cancelar="
				mostrarDialogCriarPermissao = false
				permissao_id = null
			" />
	</div>
</template>

<script>
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarPermissao from "~/components/Dialogs/Admin/DialogCriarPermissao.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue";
	export default {
		name: "Permissoes",
		layout: "admin",
		components: {
			AppTabela,
			RodapePagina,
			BotaoPadrao,
			DialogCriarPermissao,
      AppAlerta,
      BotaoIconeEditar
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", centralizar: true, largura: 'w-10' },
					{ nome: "Descrição", valor: "descricao", filtro: true },
					{ nome: "Detalhe", valor: "detalhe", filtro: true },
				],
				dados: [],
				filtros: {},
				itensPorPagina: 50,
				pagina: 1,
				carregando: false,
				mostrarDialogCriarPermissao: false,
				permissao_id: null,
        mostrarAlerta: false,
        textoAlerta: "",
			}
		},
    computed:{
      totalItens(){
        return this.dados.length
      }
    },
		async mounted() {
			await this.buscarPermissoes()
		},
		methods: {
			async buscarPermissoes() {
				let filtros = Object.assign({}, this.filtros)

        for (let f of Object.keys(filtros)) {
          filtros[f] = {'$iLike': `%${filtros[f]}%`}
        }

				this.carregando = true
				let resp = await this.$axios.$get("/permissoes/buscarTodasPaginados", {
					params: {
						filtros: filtros,
						page: this.pagina - 1,
						size: this.itensPorPagina,
					},
				})

				if (!resp.falha) {
					this.dados = resp.dados.permissoes.rows
					this.carregando = false
				}
			},
			recebendoFiltro(filtros) {
				this.filtros = filtros
			},
			async atualizarDados(parametros) {
				let { itensPorPagina, pagina, filtros } = parametros

				if (itensPorPagina) this.itensPorPagina = itensPorPagina

				if (pagina) this.pagina = pagina

				if (filtros) this.filtros = filtros

				await this.buscarPermissoes()
			},

      cadastrado(permissao){
        this.dados.push(permissao)
        this.mostrarDialogCriarPermissao = false
        this.mostrarAlerta = true
        this.textoAlerta = "Permissão cadastrado com sucesso!"
      },

      editado(permissao){
        let { id, detalhe, descricao } = permissao

        let index = this.dados.findIndex(o => o.id === id )

        if(index >= 0){
          this.dados[index].detalhe = detalhe
          this.dados[index].descricao = descricao

          this.mostrarDialogCriarPermissao = false
          this.mostrarAlerta = true
          this.textoAlerta = "Permissão editada com sucesso!"
        }


      },

      deletado(id){
        let index = this.dados.findIndex(o => o.id === id)

        if (index >= 0) {
          this.dados.splice(index, 1)

          this.mostrarDialogCriarPermissao = false
          this.mostrarAlerta = true
          this.textoAlerta = "Permissão deletada com sucesso!"
        }
      }
		},
	}
</script>

<style scoped></style>
