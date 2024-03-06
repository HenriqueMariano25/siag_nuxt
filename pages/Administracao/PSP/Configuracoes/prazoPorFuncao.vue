<template>
	<div class="w-full">
		<CabecalhoPagina titulo="PRAZO POR FUNÇÃO" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
        id="prazoPorFunção"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarFuncoes"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						@clique="
							mostrarDialogCriarPrazoPFuncao = true
							funcao = item
						"
						icone>
						<div class="w-5 h-5 flex items-center justify-center">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-5 h-5" />
						</div>
					</BotaoPadrao>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina class="print:hidden">
			<template v-slot>
				<div class="flex items-center w-full">
					<div class="flex w-full gap-2 justify-between">
            <div class="flex gap-2 text-white">
              <AppFormFile
                label="Selecione o arquivo"
                id="arquivo"
                @change="arquivo = $event" />
              <div class="flex self-end">
                <BotaoPadrao
                  texto="importar"
                  cor="bg-primaria-100 hover:!bg-primaria-200"
                  @clique="importar()"
                  :disabled="!arquivo">
                  <img
                    src="@/assets/icons/upload-b.svg"
                    alt=""
                    class="w-7 h-7" />
                </BotaoPadrao>
              </div>
            </div>
            <div class="flex">
              <BotaoPadrao
                texto="módelo importação"
                @clique="gerarModeloImportacao()">
                <img
                  src="@/assets/icons/excel-b.svg"
                  alt=""
                  class="w-7 h-7" />
              </BotaoPadrao>
            </div>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogCriarPrazoPFuncao
			v-if="mostrarDialogCriarPrazoPFuncao"
			@cancelar="mostrarDialogCriarPrazoPFuncao = false"
      @editado="editado"
			:funcao="funcao" />
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
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import gerarExcel from "~/functions/gerarExcel"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import DialogCriarPrazoPFuncao from "~/components/Dialogs/Administracao/Psp/DialogCriarPrazoPFuncao.vue"
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import AppFormFile from "~/components/Ui/Form/AppFormFile.vue";

	export default {
		name: "prazoPorFuncao",
		components: {
      AppFormFile,
      AppAlerta,
			CabecalhoPagina,
			TabelaPadrao,
			BotaoPadrao,
			RodapePagina,
			DialogCriarPrazoPFuncao,
		},
		// methods: { gerarExcel },
		data() {
			return {
				dados: [],
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Função", valor: "id", filtro: true},
					{ nome: "Prazo", valor: "prazo" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCriarPrazoPFuncao: false,
				funcao: null,
        mostrarAlerta: false,
        textoAlerta: null,
        arquivo: null,
			}
		},
		created() {
			this.buscarFuncoes()
		},
		methods: {
			gerarModeloImportacao() {
				let dados = this.dados
				let cabecalho = ["Cargo", "Prazo","", "Exemplo de Prazos"]
				let nomeArquivo

				nomeArquivo = "modelo_importacao_prazo_funcao"

        let prazos = ['7', '15', '35', '45', '60', '90']
        let contPrazo = 0

				let itens = []
				for (let item of dados) {
					let temp = []
					temp.push(item.id)
          temp.push(item.prazo ? item.prazo : "")
          if(contPrazo < prazos.length){
            temp.push("")
            temp.push(prazos[contPrazo])
            contPrazo++
          }
					itens.push(temp)
				}

				gerarExcel(cabecalho, itens, nomeArquivo)
			},
      async importar() {
        let arquivo = this.arquivo
        let formData = new FormData()
        formData.append("file", arquivo)
        let resp = await this.$axios.$post("/psp/configuracoes/importar/prazo_funcao", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        if (!resp.falha) {
          await this.buscarFuncoes()
          this.textoAlerta = "Importação realizada com sucesso!"
          this.mostrarAlerta = true
        }
      },
			async buscarFuncoes() {
				let resp = await this.$axios.$get("/psp/configuracoes/buscar/funcoes")
				if (!resp.falha) {
					this.dados = resp.dados.funcoes
				}
			},
      async editado({ funcao, prazo}){
        let idx = this.dados.findIndex( o => o.id === funcao)

        if(idx >= 0){
          this.dados[idx].prazo = prazo
          this.mostrarDialogCriarPrazoPFuncao = false
          this.textoAlerta = "Prazo alterado com sucesso!"
          this.mostrarAlerta = true
        }
      },

		},
	}
</script>

<style scoped></style>
