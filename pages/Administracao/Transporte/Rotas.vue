<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Rotas" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11">
			<TabelaPadrao
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
				altura="calc(100vh - 179px)"
				@atualizar="buscarRota"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
          <div class="flex">
            <BotaoPadrao
              @click="
							rota = item
							mostrarDialogCriarRota = true
						"
              icone>
              <div class="w-7 h-7 flex items-center justify-center">
                <img
                  src="@/assets/icons/edit-b.svg"
                  alt=""
                  class="w-6 h-6" />
              </div>
            </BotaoPadrao>
            <BotaoPadrao icone>
              <div class="w-7 h-7 flex items-center justify-center">
                <img src="@/assets/icons/printer-b.svg" alt="" class="w-6 h-6">
              </div>
            </BotaoPadrao>
          </div>
				</template>
				<template v-slot:[`body.Veiculo.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Veiculo">
						{{ item.Veiculo.nome }}
					</span>
				</template>
			</TabelaPadrao>
		</div>
    <RodapePagina>
      <template v-slot>
        <div class="flex justify-end w-full">
          <div class="flex">
            <BotaoPadrao
              class="flex"
              @click="mostrarDialogCriarRota = true"
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
    <DialogCriarRota
      v-if="mostrarDialogCriarRota"
      @cancelar="
				mostrarDialogCriarRota = false
				rota = null
			"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      :rota="rota" />
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
  import RodapePagina from "~/components/Shared/RodapePagina.vue";
  import AppAlerta from "~/components/Ui/AppAlerta.vue";
  import DialogCriarRota from "~/components/Dialogs/Administracao/Transporte/DialogCriarRota.vue";

	export default {
		components: { DialogCriarRota, AppAlerta, RodapePagina, BotaoPadrao, CabecalhoPagina, TabelaPadrao },
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Número", valor: "numero", filtro: true, ordenar: true },
					{ nome: "Local", valor: "local", filtro: true, ordenar: true },
					{ nome: "Horário de saida", valor: "horario_saida", filtro: true, ordenar: true },
					{ nome: "Veículo", valor: "Veiculo.nome", filtro: true, ordenar: true },
					{ nome: "Turno", valor: "turno", filtro: true, ordenar: true },
				],
				filtros: {},
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				mostrarDialogCriarRota: false,
				rota: null,
				mostrarAlerta: false,
				textoAlerta: null,
			}
		},
		created() {
			this.buscarRota()
		},
		methods: {
			async buscarRota() {
				let filtros = this.filtros
				let ordem = this.ordem

				let resp = await this.$axios.$get("/transporte/rotas/novo_padrao", {
					params: {
						page: this.pagina - 1,
						size: this.itensPorPagina,
						filtros,
						ordem,
					},
				})
				console.log(resp)

				if (!resp.falha) {
					this.dados = resp.dados.rotas
          this.totalItens = resp.dados.total
				}
			},
      cadastrado(rota) {
        this.dados.push(rota)
        this.mostrarDialogCriarRota = false
        this.textoAlerta = "Rota cadastrada com sucesso!"
        this.mostrarAlerta = true
        this.totalItens += 1
      },
      editado(rota) {
        let idx = this.dados.findIndex((o) => o.id === rota.id)
        this.dados[idx].numero = rota.numero
        this.dados[idx].local = rota.local
        this.dados[idx].horario_saida = rota.horario_saida
        this.dados[idx].Veiculo.nome = rota.Veiculo.nome
        this.dados[idx].turno = rota.turno

        this.rota = null
        this.mostrarDialogCriarRota = false
        this.textoAlerta = "Rota editada com sucesso!"
        this.mostrarAlerta = true
      },

      deletado(id) {
        let idx = this.dados.findIndex((o) => o.id === id)
        this.dados.splice(idx, 1)

        this.mostrarDialogCriarRota = false
        this.textoAlerta = "Rota deletada com sucesso!"
        this.mostrarAlerta = true
        this.rota = null
        this.totalItens -= 1
      },
		},
	}
</script>

<style scoped></style>
