<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Disciplinas" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				:dadosSql="true"
				@atualizar="buscarDisciplina"
				:temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <BotaoPadrao @click="disciplina = item; mostrarDialogCriarDisciplina = true" icone>
            <div class="w-7 h-7 flex items-center justify-center">
              <img src="@/assets/icons/edit-b.svg" alt="" class="w-6 h-6">
            </div>

          </BotaoPadrao>
        </template>
        <template v-slot:[`body.setor.nome`]="{ item }">
          <span class="whitespace-nowrap" v-if="item.setor">{{ item.setor.nome }}</span>
        </template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-end w-full">
					<!--          <div>-->
					<div class="flex">
						<BotaoPadrao
							class="flex"
							@click="mostrarDialogCriarDisciplina = true"
							texto="Adicionar">
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
		<DialogCriarDisciplina
			v-if="mostrarDialogCriarDisciplina"
			@cancelar="mostrarDialogCriarDisciplina = false; disciplina = null"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
			:disciplina="disciplina" />
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
	</div>
</template>

<script>
	import { defineComponent } from "vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import DialogCriarDisciplina from "~/components/Dialogs/Planejamento/Disciplina/DialogCriarDisciplina.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import BotaoIconEditar from "~/components/Ui/Buttons/BotaoIconeEditar.vue";

	export default defineComponent({
		name: "Disciplina",
		components: { BotaoIconEditar, AppAlerta, DialogCriarDisciplina, BotaoPadrao, RodapePagina, TabelaPadrao, CabecalhoPagina },
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-8" },
					{ nome: "Sigla", valor: "sigla" },
					{ nome: "Descrição", valor: "descricao" },
					{ nome: "Setor", valor: "setor.nome"},
				],
				filtros: [],
				totalItens: 10,
				dados: [],
				itensPorPagina: 50,
				pagina: 1,
				mostrarDialogCriarDisciplina: false,
        disciplina: null,
        mostrarAlerta: false,
        textoAlerta: null

			}
		},
		created() {
			this.buscarDisciplina()
		},
		methods: {
			async buscarDisciplina() {
				console.log("Buscando")
        let resp = await this.$axios.$get("/planejamento/disciplinas")

        console.log(resp)

        if(!resp.falha){
          console.log(resp.dados)

          let disciplinas = resp.dados.disciplinas

          this.dados = disciplinas
        }
			},
      cadastrado(disciplina){
        this.dados.push(disciplina)
        this.mostrarDialogCriarDisciplina = false
        this.textoAlerta = "Disciplina cadastrada com sucesso!"
        this.mostrarAlerta = true
      },
      editado(disciplina) {
        let idx = this.dados.findIndex( o => o.id === disciplina.id)
        this.dados[idx].sigla = disciplina.sigla
        this.dados[idx].descricao = disciplina.descricao
        this.dados[idx].setor.nome = disciplina.setor.nome

        this.mostrarDialogCriarDisciplina = false
        this.textoAlerta = "Disciplina editada com sucesso!"
        this.mostrarAlerta = true
      },
      deletado(id){
        let idx = this.dados.findIndex(o => o.id === id)
        this.dados.splice(idx, 1)

        this.mostrarDialogCriarDisciplina = false
        this.textoAlerta = "Disciplina deletada com sucesso!"
        this.mostrarAlerta = true
      }
		},
	})
</script>

<style scoped></style>
