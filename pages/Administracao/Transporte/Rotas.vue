<template>
	<div class="w-full">
		<CabecalhoPagina titulo="ROTAS" />
		<div class="w-full bg-white flex flex-col gap-2 overflow-y-auto !mt-11 print:hidden">
			<TabelaPadrao
        id="rotas"
				:cabecalho="cabecalho"
				:dados="dados"
				:itensPorPagina="itensPorPagina"
        @itensPorPagina="itensPorPagina = $event"
				:pagina="pagina"
				@pagina="pagina = $event"
				@filtros="filtros = $event"
				@ordem="ordem = $event"
				:totalItens="totalItens"
        @totalItens="totalItens = $event"
				altura="calc(100vh - 179px)"
				@atualizar="buscarRota"
				:temDetalhes="false">
				<template v-slot:[`body.acoes`]="{ item }">
					<div class="flex">
						<BotaoPadrao icone>
							<div
								class="w-7 h-7 flex items-center justify-center"
								@click="gerarRelatorio(item)">
								<img
									src="@/assets/icons/printer-b.svg"
									alt=""
									class="w-6 h-6" />
							</div>
						</BotaoPadrao>
						<BotaoPadrao
							@clique="
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
					</div>
				</template>
				<template v-slot:[`body.Veiculo.nome`]="{ item }">
					<span
						class="whitespace-nowrap"
						v-if="item.Veiculo">
						{{ item.Veiculo.nome }}
					</span>
				</template>
				<template v-slot:[`body.ocupacao`]="{ item }">
					<span class="whitespace-nowrap">
						{{ totalOcupacao(item) }}
					</span>
				</template>
			</TabelaPadrao>
		</div>
		<RodapePagina>
			<template v-slot>
				<div class="flex justify-between w-full">
					<div class="flex gap-2">
						<BotaoPadrao
							texto="ocupações"
							@clique="gerarRelatorioGeral">
							<img
								src="@/assets/icons/list-b.svg"
								alt=""
								class="w-7 h-7" />
						</BotaoPadrao>
            <BotaoPadrao
              texto="KPI"
              @clique="mostrarDialogKpiRota = true">
              <img
                src="@/assets/icons/graph-b.svg"
                alt=""
                class="w-7 h-7" />
            </BotaoPadrao>
					</div>
					<div class="flex">
						<BotaoPadrao
							class="flex"
							@clique="mostrarDialogCriarRota = true"
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
    <DialogKpiRota v-if="mostrarDialogKpiRota" @cancelar="mostrarDialogKpiRota = false"/>
	</div>
</template>

<script>
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import RodapePagina from "~/components/Shared/RodapePagina.vue"
	import AppAlerta from "~/components/Ui/AppAlerta.vue"
	import DialogCriarRota from "~/components/Dialogs/Administracao/Transporte/DialogCriarRota.vue"

	import { jsPDF } from "jspdf"
	import "jspdf-autotable"
	import logo from "~/assets/img/logoagcnovo.png"
  import DialogKpiRota from "~/components/Dialogs/Administracao/Transporte/Rotas/DialogKpiRota.vue";

	export default {
		components: {
      DialogKpiRota,
			DialogCriarRota,
			AppAlerta,
			RodapePagina,
			BotaoPadrao,
			CabecalhoPagina,
			TabelaPadrao,
		},
		data() {
			return {
				cabecalho: [
					{ nome: "", valor: "acoes", largura: "w-14" },
					{ nome: "Número", valor: "numero", filtro: true, ordenar: true },
					{ nome: "Local", valor: "local", filtro: true, ordenar: true },
					{ nome: "Horário de saida", valor: "horario_saida", ordenar: true },
					{ nome: "Veículo", valor: "Veiculo.nome", filtro: true, ordenar: true },
					{ nome: "Turno", valor: "turno", filtro: true, ordenar: true },
					{ nome: "Ocupação", valor: "ocupacao" },
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
        mostrarDialogKpiRota: false
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
				if (this.dados[idx].Veiculo) {
					this.dados[idx].Veiculo.nome = rota.Veiculo.nome
				} else {
					this.dados[idx].Veiculo = { nome: rota.Veiculo.nome }
				}
				this.dados[idx].turno = rota.turno
				this.dados[idx].mostrar_grafico = rota.mostrar_grafico

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

			totalOcupacao(item) {
				let totalFuncionario = item.Funcionarios ? item.Funcionarios.length : 0
				let totalTerceiros = item.TerceirosRota ? item.TerceirosRota.length : 0

				return totalFuncionario + totalTerceiros
			},

			async gerarRelatorioGeral() {
				let resp = await this.$axios.$get("/transporte/rotas/geral")

				if (!resp.falha) {
					let { rotas } = resp.dados

          const primeiroPDF = Object.keys(rotas).slice(0, 50).reduce((result, key) => {
            result[key] = rotas[key];

            return result;
          }, {});

          await this.rederizarRelatorio(primeiroPDF)

          if(Object.keys(rotas).length > 50){

            const segundoPDF = Object.keys(rotas).slice(50, 100).reduce((result, key) => {
              result[key] = rotas[key];

              return result;
            }, {});
            await this.rederizarRelatorio(segundoPDF)
          }

          if (Object.keys(rotas).length > 50) {
            const terceiroPDF = Object.keys(rotas).slice(100).reduce((result, key) => {
              result[key] = rotas[key];

              return result;
            }, {});
            await this.rederizarRelatorio(terceiroPDF)
          }
				}
			},

      async rederizarRelatorio(rotas){
        let hojeAgr = this.$dayjs().format("DD/MM/YYYY HH:mm:ss")

        var doc = new jsPDF({})
        doc.setProperties({
          title: "Relatório pontos de embarque",
        })

        const logo = require("@/assets/img/logoagcnovo.png")
        let chaves = Object.keys(rotas).sort()

        for (let rotaKey of chaves) {
          let rota = rotas[rotaKey]
          let passageirosOrdenados = await rota.sort((a, b) => {
            const nomeA = a.nome.toUpperCase()
            const nomeB = b.nome.toUpperCase()

            if (nomeA > nomeB) {
              return 1
            }
            if (nomeA < nomeB) {
              return -1
            }
            return 0
          })
          let novosDados = JSON.parse(JSON.stringify(passageirosOrdenados))

          let imgLogo = new Image()
          imgLogo.src = logo
          doc.addImage(imgLogo, "PNG", 4, 6, 50, 9)
          doc.setFontSize(14)
          doc.setTextColor(0)
          doc.text("RELATÓRIO PASSAGEIROS POR ROTA", 75, 9)
          doc.setFontSize(14)
          doc.text(`ROTA`, 190, 9)
          doc.text(`${rotaKey}`, 190, 14)
          doc.setFontSize(12)
          doc.text(`Passageiros: ${rota.length}`, 4, 20)
          doc.text(`Disponíveis: ${46 - parseInt(rota.length)}`, 60, 20)
          doc.line(4, 22, 206, 22)
          doc.setFontSize(14)
          doc.autoTable({
            head: [["Matricula", "Nome", "Cargo", "Ponto de embarque", "Poltrona"]],
            columns: [
              { header: "Matricula", dataKey: "chapa" },
              { header: "Nome", dataKey: "nome" },
              { header: "Cargo", dataKey: "cargo" },
              { header: "Ponto de embarque", dataKey: "ponto_embarque" },
              { header: "Poltrona", dataKey: "poltrona" },
            ],
            columnStyles: { id: { halign: "center" } },
            body: novosDados,
            theme: "striped",

            headStyles: {
              fillColor: [50, 50, 50],
            },
            bodyStyles: {
              fontSize: 7,
            },
            startY: 24,
            pageBreak: "auto",
            margin: { left: 4, right: 4, top: 4 },
          })

          if (doc.getNumberOfPages() < Object.keys(rotas).length) {
            doc.addPage()
          }
        }

        const totalPaginas = doc.internal.getNumberOfPages()

        doc.setTextColor(0)
        doc.setFontSize(10)
        for (var i = 1; i <= totalPaginas; i++) {
          doc.setPage(i)
          doc.text(
            `Página ${String(i)} de ${String(totalPaginas)}`,
            205,
            294,
            null,
            null,
            "right",
          )
          doc.text(hojeAgr, 5, 294)
        }

        window.open(doc.output("bloburl", { filename: "tabela_clientes.pdf" }))
      },

			async gerarRelatorio(rota) {
				let funcionariosPorRota = []

				let funcionarios = await this.$axios
					.$get("/transporte/rotas/funcionarios", { params: { id: rota.id } })
					.then((resp) => resp.funcionarios)

				funcionariosPorRota = funcionarios

				let terceiros = await this.$axios
					.$get("/transporte/terceiros/rota", { params: { rota_id: rota.id } })
					.then((resp) => resp.terceiros)

				funcionariosPorRota.push(...terceiros)

				let funcOrdenados = await funcionariosPorRota.sort((a, b) => {
					const nomeA = a.nome.toUpperCase()
					const nomeB = b.nome.toUpperCase()

					if (nomeA > nomeB) {
						return 1
					}
					if (nomeA < nomeB) {
						return -1
					}
					return 0
				})

				let hojeAgr = this.$dayjs().format("DD/MM/YYYY HH:mm:ss")

				let novosDados = JSON.parse(JSON.stringify(funcOrdenados))
				var doc = new jsPDF({})
				doc.page = 1
				doc.setProperties({
					title: "Relatório pontos de embarque",
				})

				const logo = require("@/assets/img/logoagcnovo.png")
				var imgLogo = new Image()
				imgLogo.src = logo

				doc.addImage(imgLogo, "PNG", 4, 6, 50, 9)
				doc.setFontSize(14)
				doc.setTextColor(0)
				doc.text("RELATÓRIO PASSAGEIROS POR ROTA", 75, 9)
				doc.setFontSize(14)
				doc.text(`ROTA`, 190, 9)
				doc.text(`${rota.numero}`, 190, 14)
				doc.setFontSize(12)
				doc.text(`Passageiros: ${funcionariosPorRota.length}`, 4, 20)
				doc.text(`Disponíveis: ${46 - parseInt(funcionariosPorRota.length)}`, 60, 20)

				doc.line(4, 22, 206, 22)
				doc.setFontSize(14)
				doc.autoTable({
					head: [["Matricula", "Nome", "Cargo", "Ponto de embarque", "Poltrona"]],
					columns: [
						{ header: "Matricula", dataKey: "chapa" },
						{ header: "Nome", dataKey: "nome" },
						{ header: "Cargo", dataKey: "cargo" },
						{ header: "Ponto de embarque", dataKey: "ponto_embarque" },
						{ header: "Poltrona", dataKey: "poltrona" },
					],
					columnStyles: { id: { halign: "center" } },
					body: novosDados,
					theme: "striped",

					headStyles: {
						fillColor: [50, 50, 50],
					},
					bodyStyles: {
						fontSize: 7,
					},
					startY: 24,
					pageBreak: "auto",
					margin: { left: 4, right: 4, top: 4 },
				})
				const totalPaginas = doc.internal.getNumberOfPages()
				doc.setTextColor(0)
				doc.setFontSize(10)
				for (var i = 1; i <= totalPaginas; i++) {
					doc.setPage(i)
					doc.text(`Página ${String(i)} de ${String(totalPaginas)}`, 205, 294, null, null, "right")
					doc.text(hojeAgr, 5, 294)
				}
				window.open(doc.output("bloburl", { filename: "tabela_clientes.pdf" }))
			},
		},
	}
</script>

<style scoped></style>
