<template>
	<div class="w-full print:!-ml-0.5">
		<CabecalhoPagina titulo="DESKTOP" />
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
				altura="calc(100vh - 179px)"
				@atualizar="buscarDesktop"
				:temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao icone @clique="editarDeskNote(item)">
            <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
        </template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<div class="w-full flex justify-between">
				<BotaoPadrao texto="excel">
					<img
						src="@/assets/icons/excel-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
				<BotaoPadrao
					texto="cadastrar"
					@clique="mostrarDialogCadastrarDesktopNotebook = true">
					<img
						src="@/assets/icons/add-b.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>
		</RodapePagina>
		<DialogCadastrarDesktopNotebook
			v-if="mostrarDialogCadastrarDesktopNotebook"
			@cancelar="
				mostrarDialogCadastrarDesktopNotebook = false
				maquina = null
			"
      @cadastrado="desktopCadastrado"
      @editado="desktopEditado"
      tipoCadastro="desktop"
			:maquina="maquina" />
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
	import DialogCadastrarDesktopNotebook from "~/components/Dialogs/Administracao/Ti/DesktopNotebook/DialogCadastrarDesktopNotebook.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
		components: {
      AppAlerta,
			DialogCadastrarDesktopNotebook,
			BotaoPadrao,
			RodapePagina,
			TabelaPadrao,
			CabecalhoPagina,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Patrimônio", valor: "patrimonio", filtro: true, ordenar: true },
					{ nome: "Serial", valor: "serial" },
					{ nome: "Hostname", valor: "hostname", ordenar: true, filtro: true },
					{ nome: "", valor: "historico", ordenar: true, filtro: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCadastrarDesktopNotebook: false,
				maquina: null,
        mostrarAlerta: false,
        textoAlerta: null
			}
		},
    mounted() {
      this.buscarDesktop();
    },
		methods: {
			async buscarDesktop() {
        let resp = await this.$axios.$get("/ti/desktopNotebook/desktops/buscarTodos")

        if(!resp.falha){
          this.dados = resp.dados.desktops
        }
      },
      async editarDeskNote(item){
        this.mostrarDialogCadastrarDesktopNotebook = true
        this.maquina = item
      },
      async desktopEditado(){
        this.mostrarDialogCadastrarDesktopNotebook = false
        this.textoAlerta = "Desktop editado com sucesso!"
        this.mostrarAlerta = true
        this.maquina = null
      },
      async desktopCadastrado({ desknote, sair }){
        this.dados.push(desknote)
        if(sair){
          this.mostrarDialogCadastrarDesktopNotebook = false
          this.textoAlerta = "Desktop cadastrado com sucesso!"
          this.mostrarAlerta = true
        }
      }
		},
	}
</script>

<style scoped></style>
