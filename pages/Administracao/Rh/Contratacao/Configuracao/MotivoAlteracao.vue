<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Motivos da alteração" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<AppTabela
				class=""
				:cabecalho="cabecalho"
				:dados="dados"
				:temRodape="false"
				classPersonalizada="!bg-gray-400"
				altura="calc(100vh - 116px)"
				@atualizar="buscarMotivos()"
				corOverlay="!bg-gray-600/70">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						icone
						class="!p-0"
						@click="
							motivo = item
							mostrarDialogCriarMotivo = true
						">
						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-8 h-8" />
					</BotaoPadrao>
				</template>
			</AppTabela>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end">
					<!--          <div>-->
					<div class="flex">
						<BotaoPadrao
							texto="Adicionar"
							@click="mostrarDialogCriarMotivo = true">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
					<!--          </div>-->
				</div>
			</template>
		</RodapePagina>
		<DialogCriarMotivo
			v-if="mostrarDialogCriarMotivo"
			@cancelar="mostrarDialogCriarMotivo = false"
			@cadastrado="cadastrado"
			@editado="editado"
      @deletado="deletado"
			:motivo="motivo" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppTabela from "~/components/Ui/AppTabela.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarMotivo from "~/components/Dialogs/Administracao/Rh/Contratacao/Configuracao/DialogCriarMotivo.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import BotaoIconeEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue"

	export default {
		components: {
			BotaoIconeEditar,
			AppAlerta,
			DialogCriarMotivo,
			BotaoPadrao,
			AppTabela,
			CabecalhoPagina,
			RodapePagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", centralizar: true, largura: "w-12" },
					{ nome: "Descrição", valor: "descricao", filtro: true },
				],
				dados: [],
				mostrarDialogCriarMotivo: false,
				mostrarAlerta: false,
				textoAlerta: false,
				motivo: null,
			}
		},
		created() {
			this.buscarMotivos()
		},
		methods: {
			async buscarMotivos() {
				let resp = await this.$axios.$get("/contratacao/motivo/buscarTodos")

				if (!resp.falha) {
					let dados = resp.dados

					this.dados = dados.motivos
				}
			},
			cadastrado(motivo) {
				this.dados.push(motivo)
				this.mostrarDialogCriarMotivo = false
			},

      editado({ id, descricao }){

      },
      deletado(id) {
        console.log(id, descricao)

        let idx = this.dados.findIndex( o => o.id === id )

        this.dados.splice(idx, 1)

        this.dados.push(motivo)
        this.mostrarDialogCriarMotivo = false
      },
		},
	}
</script>

<style scoped></style>
