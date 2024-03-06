<template>
	<div class="w-full">
		<CabecalhoPagina titulo="PLANOS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
        id="planos"
				:cabecalho="cabecalho"
				:dados="dados"
        :tem-rodape="false"
        :filtros="filtros"
        @filtros="filtros = $event"
				:totalItens="dados.length"
				altura="calc(100vh - 116px)"
				@atualizar="buscarPlanos"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="flex">
						<BotaoPadrao
							@clique="
								plano = item
								mostrarDialogCriarPlano = true
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
							@clique="mostrarDialogCriarPlano = true"
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
		<DialogCriarPlano
			v-if="mostrarDialogCriarPlano"
			@cancelar="
				mostrarDialogCriarPlano = false
				plano = null
			"
			:plano="plano"
			@cadastrado="cadastrado"
			@editado="editado"
			@deletado="deletado"
    />
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
	import DialogCriarPlano from "~/components/Dialogs/Administracao/Ti/Chips/Configuracoes/DialogCriarPlano.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"

	export default {
		components: {
			AppAlerta,
			DialogCriarPlano,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				dados: [],
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Nome", valor: "nome", filtro: true },
					{ nome: "Valor", valor: "valor" },
					{ nome: "Descrição", valor: "descricao" },
				],
				mostrarDialogCriarPlano: false,
				plano: null,
				mostrarAlerta: false,
				textoAlerta: null,
        filtros: {}
			}
		},
		mounted() {
			this.buscarPlanos()
		},
		methods: {
			async buscarPlanos() {
        let filtros = this.filtros
				let resp = await this.$axios.$get("/ti/plano/buscarTodos", { params: { filtros }})

				if (!resp.falha) {
					this.dados = resp.dados.planos
				}
			},

			cadastrado(plano) {
				this.dados.push(plano)
				this.textoAlerta = "Plano cadastrado com sucesso!"
				this.mostrarAlerta = true
				this.mostrarDialogCriarPlano = false
			},

      editado(plano){
        let idx= this.dados.findIndex( o => o.id === plano.id)

        if(idx >= 0){
          this.dados[idx] = Object.assign(this.dados[idx], plano)
          this.textoAlerta = "Plano editado com sucesso!"
          this.mostrarAlerta = true
          this.mostrarDialogCriarPlano = false
        }
        this.plano = null
      },

      deletado(id){
        let idx = this.dados.findIndex( o=> o.id === id)

        if(idx >= 0){
          this.dados.splice(idx, 1)
          this.textoAlerta = "Plano deletado com sucesso!"
          this.mostrarAlerta = true
          this.mostrarDialogCriarPlano = false
        }
        this.plano = null
      }
		},
	}
</script>

<style scoped></style>
