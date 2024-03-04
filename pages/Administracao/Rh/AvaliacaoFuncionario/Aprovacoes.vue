<template>
	<div class="w-full">
		<CabecalhoPagina titulo="APROVAÇÕES " />
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
				selecionar
				@selecionados="selecionados = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@dblclick="verDetalhes"
				@atualizar="buscarAprovacoes()"
				:temDetalhes="false">
				<template v-slot:[`body.id`]="{ item }">
					<span class="whitespace-nowrap">{{ ("000000" + item.id).slice(-6) }}</span>
				</template>
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="w-[30px]">
						<BotaoPadrao icone @clique="mostrarDialogEditarAvaliacao = true; avaliacao_id = item.id">
							<img
								src="@/assets/icons/edit-b.svg"
								alt=""
								class="w-6 h-6" />
						</BotaoPadrao>
					</div>
				</template>
				<template v-slot:[`body.AvaliadoPor.nome`]="{ item }">
					<span class="whitespace-nowrap">{{ item.AvaliadoPor ? item.AvaliadoPor.nome : "" }}</span>
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
        <template v-slot:[`body.avaliado_em`]="{ item }">
          <span class="whitespace-nowrap">{{ item.avaliado_em ? $dayjs(item.avaliado_em).format("DD/MM/YYYY") : "" }}</span>
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
				<div class="flex items-center w-full justify-between">
					<div class="flex gap-2 w-full justify-end">
						<BotaoPadrao
              @clique="mostrarDialogAprovarAvaliacao = true"
							texto="aprovar"
							:disabled="selecionados.length === 0">
							<img
								src="@/assets/icons/check-circle-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
					</div>
				</div>
			</template>
		</RodapePagina>
		<DialogDetalhesAvaliacao
			v-if="mostrarDialogDetalhesAvaliacao"
			@cancelar="
				mostrarDialogDetalhesAvaliacao = false
				avaliacao_id = null
			"
			:avaliacao_id="avaliacao_id" />
    <DialogAprovarAvaliacao :aprovacoes="selecionados" v-if="mostrarDialogAprovarAvaliacao" @cancelar="mostrarDialogAprovarAvaliacao = false" @aprovado="aprovado"/>
    <DialogHistoricoAvaliacao v-if="mostrarDialogHistoricoAvaliacao" @cancelar="mostrarDialogHistoricoAvaliacao = false; avaliacao_id = null" :avaliacao_id="avaliacao_id"/>
    <DialogEditarAvaliacao v-if="mostrarDialogEditarAvaliacao" @cancelar="mostrarDialogEditarAvaliacao = false; avaliacao_id = false" :avaliacao_id="avaliacao_id" @editado="editado"/>
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
	import DialogDetalhesAvaliacao from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogDetalhesAvaliacao.vue"
  import DialogAprovarAvaliacao
    from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogAprovarAvaliacao.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import DialogHistoricoAvaliacao
    from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogHistoricoAvaliacao.vue";
  import DialogEditarAvaliacao
    from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogEditarAvaliacao.vue";

	export default {
		components: {
      DialogEditarAvaliacao,
      DialogHistoricoAvaliacao,
      AppAlerta,
      DialogAprovarAvaliacao,
			DialogDetalhesAvaliacao,
			RodapePagina,
			BotaoPadrao,
			CabecalhoPagina,
			TabelaPadrao,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-12" },
					{ nome: "Cód.", valor: "id", largura: "w-[80px]", centralizar: true, filtro: true },
					{ nome: "Matricula", valor: "Funcionario.chapa", filtro: true },
					{ nome: "Nome", valor: "Funcionario.nome", filtro: true },
					{ nome: "Cargo", valor: "Funcionario.cargo", filtro: true },
					{ nome: "Avaliado por", valor: "AvaliadoPor.nome", filtro: true },
					{ nome: "Avaliado em", valor: "avaliado_em", filtro: true, tipoFiltro: "data" },
					{ nome: "", valor: "historico"},
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
				selecionados: [],
				avaliacao_id: null,
				mostrarDialogDetalhesAvaliacao: false,
        mostrarDialogAprovarAvaliacao : false,
        mostrarDialogHistoricoAvaliacao: false,
        mostrarDialogEditarAvaliacao: false
			}
		},
		mounted() {
			this.buscarAprovacoes()
		},
		methods: {
			async buscarAprovacoes() {
				let usuario_id = this.$auth.user.id
        let page = this.pagina - 1
        let size = this.itensPorPagina
        let filtros = this.filtros

				let resp = await this.$axios.$get("/avaliacao_funcionario/aprovacoes", {
					params: { usuario_id, page, size, filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.avaliacoes
				}
			},
			verDetalhes(dados) {
				this.avaliacao_id = dados.id
				this.mostrarDialogDetalhesAvaliacao = true
			},
      aprovado({ avaliacoes}){
        for (let avaliacao of avaliacoes){
          let idx = this.dados.findIndex(o => o.id === avaliacao)
          if(idx >= 0){
            this.dados.splice(idx, 1)
          }
        }
        this.selecionados = null
        this.textoAlerta = `Avaliações aprovadas com sucesso!`
        this.mostrarAlerta = true
        this.mostrarDialogAprovarAvaliacao = false
      },
      editado(){
        this.mostrarDialogEditarAvaliacao = false
        this.textoAlerta = "Avaliação editada com sucesso!"
        this.mostrarAlerta = true
        this.avaliacao_id = null
      }
		},
	}
</script>

<style scoped></style>
