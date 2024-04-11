<template>
	<div class="w-full">
		<CabecalhoPagina titulo="AVALIAÇÃO" />
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
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarAvaliacao()"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<BotaoPadrao
						v-if="item.AvaliadoPor.nome === $auth.user.nome && (item.status_avaliacao_id !== 3 && item.status_avaliacao_id !== 4)"
						icone
						class="!p-0.5"
						@clique="irParaEdicao(item.id)">
						<div class="w-[22px]">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</div>
					</BotaoPadrao>
				</template>
				<template v-slot:[`body.id`]="{ item }">
					<span>{{ ("0000" + item.id).slice(-4) }}</span>
				</template>
				<template v-slot:[`body.StatusAvaliacao.descricao`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.StatusAvaliacao ? item.StatusAvaliacao.descricao : ""
					}}</span>
				</template>
				<template v-slot:[`body.Funcionario.chapa`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Funcionario ? item.Funcionario.chapa : ""
					}}</span>
				</template>
				<template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span class="whitespace-nowrap">{{ item.Funcionario ? item.Funcionario.nome : "" }}</span>
				</template>
				<template v-slot:[`body.Funcionario.cargo`]="{ item }">
					<span class="whitespace-nowrap">{{
						item.Funcionario ? item.Funcionario.cargo : ""
					}}</span>
				</template>
				<template v-slot:[`body.AvaliadoPor.nome`]="{ item }">
					<span class="whitespace-nowrap">{{ item.AvaliadoPor ? item.AvaliadoPor.nome : "" }}</span>
				</template>
        <template v-slot:[`body.historico`]="{ item }">
          <BotaoPadrao texto="histórico" class="w-full border border-gray-700 !py-0 !justify-center"
                       cor="bg-blue-100 hover:!bg-blue-300"
                       @clique="mostrarDialogHistoricoAvaliacao = true; avaliacao_id = item.id">
            <img src="@/assets/icons/history-b.svg" alt="" class="w-6 h-6">
          </BotaoPadrao>
        </template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-between w-full">
          <BotaoPadrao texto="Excel" @clique="gerarExcel()">
            <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
					<div class="flex">
						<BotaoPadrao
							texto="AVALIAR"
							@clique="irParaAvaliar()">
							<img
								src="@/assets/icons/add-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogAvaliacaoFuncionario
			v-if="mostrarDialogCriaAvaliacaoFuncionario"
			@cancelar="mostrarDialogCriaAvaliacaoFuncionario = false" />
    <DialogHistoricoAvaliacao
      v-if="mostrarDialogHistoricoAvaliacao"
      @cancelar="mostrarDialogHistoricoAvaliacao = false; avaliacao_id = null"
      :avaliacao_id="avaliacao_id" />
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import DialogCriarDescricaoCargo from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DescricaoCargo/DialogCriarDescricaoCargo.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import DialogAvaliacaoFuncionario from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogAvaliacaoFuncionario.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
  import DialogHistoricoAvaliacao
    from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogHistoricoAvaliacao.vue";
  import gerarExcel from "~/functions/gerarExcel";

	export default {
		name: "AvaliacaoFuncionario",
		components: {
      DialogHistoricoAvaliacao,
			AppAlerta,
			DialogAvaliacaoFuncionario,
			TabelaPadrao,
			RodapePagina,
			CabecalhoPagina,
			BotaoPadrao,
			DialogCriarDescricaoCargo,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-12"},
					{ nome: "Cód.", valor: "id", largura: "w-[80px]", centralizar: true, filtro: true, tipoFiltro: "inteiro", },
					{ nome: "Status", valor: "StatusAvaliacao.descricao", filtro: true},
					{ nome: "Matricula", valor: "Funcionario.chapa", filtro: true },
					{ nome: "Nome", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Avaliado por", valor: "AvaliadoPor.nome", filtro: true },
          { nome: "", valor: "historico" },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				itensPorPagina: 100,
				pagina: 1,
				dados: [],
				mostrarDialogCriaAvaliacaoFuncionario: false,
				mostrarAlerta: false,
				textoAlerta: null,
        mostrarDialogHistoricoAvaliacao: false,
        avaliacao_id: null
			}
		},
		mounted() {
			if (this.$route.params) {
				if (this.$route.params.acao === "Cadastrado") {
					this.textoAlerta = "Avaliação iniciada com sucesso!"
					this.mostrarAlerta = true
				} else if (this.$route.params.acao === "Editado") {
					this.textoAlerta = "Avaliação editada com sucesso!"
					this.mostrarAlerta = true
				} else if (this.$route.params.acao === "Deletado") {
					let id = this.$route.params.item

					let idx = this.dados.findIndex((o) => o.id === id)
					if (idx >= 0) {
						this.dados.splice(idx, 1)
					}

					this.textoAlerta = "Avaliação deletada com sucesso!"
					this.mostrarAlerta = true
				} else if (this.$route.params.acao === "Finalizado") {
					this.textoAlerta = "Avaliação finalizada com sucesso!"
					this.mostrarAlerta = true
				}
			}
			this.buscarAvaliacao()
		},
		methods: {
			async buscarAvaliacao() {
				let page = this.pagina - 1
				let size = this.itensPorPagina
				let filtros = this.filtros

				let resp = await this.$axios.$get("/avaliacao_funcionario/buscarTodos", {
					params: { page, size, filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.avaliacoes
					this.totalItens = resp.dados.total
				}
			},
			irParaAvaliar() {
				this.$router.push({ name: "Administracao-Rh-AvaliacaoFuncionario-CriarAvaliacao" })
			},
			irParaEdicao(id) {
				this.$router.push({
					name: "Administracao-Rh-AvaliacaoFuncionario-CriarAvaliacao",
					params: { id: id },
				})
			},
      async gerarExcel(){
        let resp = await this.$axios.$get("/avaliacao_funcionario/buscarRelatorio")
        if(!resp.falha){
          let { avaliacoes } = resp.dados
          let cabecalho = [
            "Código",
            "Status",
            "Matricula",
            "Nome",
            "Cargo",
            "CPF",
            "Turno",
            "Data admissão",
            "Supervisor",
            "Situação Supervisor",
            "Engenheiro",
            "Situação Engenheiro",
            "Coordenador",
            "Avaliado por",
            "Aprovado por",
            "Comentário geral"
          ]

          let nomeArquivo

          nomeArquivo = "avaliacoes"

          let itens = []
          for (let item of avaliacoes) {
            let temp = []
            temp.push(("0000" + item.id).slice(-4))
            temp.push(item.StatusAvaliacao ? item.StatusAvaliacao.descricao : "")
            temp.push(item.Funcionario ? item.Funcionario.chapa : "")
            temp.push(item.Funcionario ? item.Funcionario.nome : "")
            temp.push(item.Funcionario ? item.Funcionario.cargo : "")
            temp.push(item.Funcionario ? item.Funcionario.cpf : "")
            temp.push(item.Funcionario && item.Funcionario.Turno ? item.Funcionario.Turno.descricao : "")
            temp.push(item.Funcionario ? this.$dayjs(item.Funcionario.data_admissao).format("DD/MM/YYYY") : "")
            temp.push(item.Funcionario && item.Funcionario.Supervisor ? item.Funcionario.Supervisor.nome : "")
            temp.push(item.Funcionario && item.Funcionario.Supervisor ? item.Funcionario.Supervisor.situacao : "")
            temp.push(item.Funcionario && item.Funcionario.Engenheiro ? item.Funcionario.Engenheiro.nome : "")
            temp.push(item.Funcionario && item.Funcionario.Engenheiro ? item.Funcionario.Engenheiro.situacao : "")
            temp.push(item.Funcionario && item.Funcionario.Coordenador ? item.Funcionario.Coordenador.nome : "")
            temp.push(item.AvaliadoPor ? item.AvaliadoPor.nome : "")
            temp.push(item.AprovadoPor ? item.AprovadoPor.nome : "")
            temp.push(item.comentario_geral)

            itens.push(temp)
          }

          gerarExcel(cabecalho, itens, nomeArquivo)
        }



      }
		},
	}
</script>

<style scoped></style>
