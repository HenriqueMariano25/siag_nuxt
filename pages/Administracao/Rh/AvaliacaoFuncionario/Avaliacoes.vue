<template>
	<div class="w-full">
		<CabecalhoPagina titulo="AVALIAÇÃO " />
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
						icone
						@clique="irParaEdicao(item.id)">
            <div class="w-[22px]">

						<img
							src="@/assets/icons/edit-b.svg"
							alt=""
							class="w-6 h-6" />
            </div>
					</BotaoPadrao>
				</template>
				<template v-slot:[`body.codigo`]="{ item }">
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
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
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
		<AppAlerta
			tipo="sucesso"
			:mostrar="mostrarAlerta"
			@escondeu="mostrarAlerta = false">
			{{ textoAlerta }}
		</AppAlerta>
	</div>
</template>

<script>
	import DialogCriarDescricaoCargo
	  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DescricaoCargo/DialogCriarDescricaoCargo.vue";
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";
	import RodapePagina from "~/components/Shared/RodapePagina.vue";
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue";
	import DialogAvaliacaoFuncionario
	  from "~/components/Dialogs/Administracao/Rh/AvaliacaoFuncionario/DialogAvaliacaoFuncionario.vue";
	import AppAlerta from "~/components/Ui/AppAlerta.vue";

	export default {
	  name: "AvaliacaoFuncionario",
	  components: { AppAlerta, DialogAvaliacaoFuncionario, TabelaPadrao, RodapePagina, CabecalhoPagina, BotaoPadrao, DialogCriarDescricaoCargo },
	  data() {
	    return {
	      cabecalho: [
	        { nome: "", valor: "acoes", largura: "w-12" },
	        { nome: "Cód.", valor: "codigo", largura: "w-[80px]", centralizar: true },
	        { nome: "Status", valor: "StatusAvaliacao.descricao", filtro: true, ordenar: true },
	        { nome: "Matricula", valor: "Funcionario.chapa"},
	        { nome: "Nome", valor: "Funcionario.nome"},
	        { nome: "Cargo", valor: "Funcionario.cargo"},
	        { nome: "Avaliado por", valor: "AvaliadoPor.nome", filtro: true, ordenar: true },
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
	    };
	  },
	  mounted() {
	    if (this.$route.params){

       if(this.$route.params.acao === "Cadastrado"){
          this.textoAlerta = "Avaliação iniciada com sucesso!"
          this.mostrarAlerta = true
        }else if(this.$route.params.acao === "Editado"){
         this.textoAlerta = "Avaliação editada com sucesso!"
         this.mostrarAlerta = true
        }
        if (this.$route.params.acao === "Deletado") {
          let id = this.$route.params.item

          let idx = this.dados.findIndex(o => o.id === id )
          if(idx >= 0){
            this.dados.splice(idx, 1)
          }

          this.textoAlerta = "Avaliação deletada com sucesso!"
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

	      let resp = await this.$axios.$get("/avaliacao_funcionario/buscarTodos",{ params: { page, size, filtros }} )

	      if(!resp.falha){
	        this.dados = resp.dados.avaliacoes
	        this.totalItens = resp.dados.total
	      }
	    },
	    irParaAvaliar(){
	      this.$router.push({ name: "Administracao-Rh-AvaliacaoFuncionario-CriarAvaliacao"})
	    },
	    irParaEdicao(id){
	      this.$router.push({ name: "Administracao-Rh-AvaliacaoFuncionario-CriarAvaliacao", params: { id: id}})
	    }
	  }
	};
</script>

<style scoped></style>
