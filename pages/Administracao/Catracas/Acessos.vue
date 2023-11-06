<template>
	<div class="w-full">
		<CabecalhoPagina titulo="Acessos nas catraca" />
		<div class="relative">
			<div class="!mt-11 p-1.5 bg-white grid grid-cols-12 gap-x-2 gap-y-1 items-center">
				<AppFormInput
					id="data_inicial"
					type="date"
					label="Data inicial"
					class="col-span-3"
					v-model="acesso.data_inicial" />
				<AppFormInput
					id="data_final"
					type="date"
					label="Data final"
          class="col-span-3"
					v-model="acesso.data_final" />
				<AppFormInput
					id="hora_inicial"
					type="time"
					label="Hora inicial"
          class="col-span-3"
					v-model="acesso.hora_inicial" />
				<AppFormInput
					id="hora_final"
					type="time"
					label="Hora final"
          class="col-span-3"
					v-model="acesso.hora_final" />
        <AppFormInput
          id="nome"
          type="text"
          label="Nome"
          class="col-span-6"
          placeholder="Ex: HENRIQUE MARIANO"
          v-model="acesso.nome" />
        <AppFormInput
          id="empresa"
          type="text"
          label="Empresa"
          placeholder="Ex: GNA"
          class="col-span-5"
          v-model="acesso.empresa" />
				<BotaoPadrao
					class="self-end"
					texto="buscar"
					cor="bg-primaria-100 hover:bg-primaria-200 text-white"
					@clique="buscarAcessos()">
					<img
						src="@/assets/icons/magnifier-w.svg"
						alt=""
						class="w-7 h-7" />
				</BotaoPadrao>
			</div>

			<div class="flex w-full mt-2">
				<TabelaPadrao
					:cabecalho="cabecalho"
					:dados="dados"
					:itensPorPagina="itensPorPagina"
					:pagina="pagina"
					dadosSql
					@pagina="pagina = $event"
					@filtros="filtros = $event"
					@ordem="ordem = $event"
					:totalItens="totalItens"
          @itensPorPagina="itensPorPagina = $event"
					altura="calc(100vh - 308px)"
					@atualizar="buscarAcessos()"
					:temDetalhes="false">
					<template v-slot:[`body.DataHora`]="{ item }">
						<span class="whitespace-nowrap">
							{{ $dayjs(item.DataHora).utc().format("DD/MM/YYYY HH:mm:ss") }}
						</span>
					</template>
          <template v-slot:[`body.func.Matricula`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Matricula }}
						</span>
          </template>
          <template v-slot:[`body.func.Nome`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Nome }}
						</span>
          </template>
          <template v-slot:[`body.depa.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Funcao }}
						</span>
          </template>
          <template v-slot:[`body.localOrig.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Origem }}
						</span>
          </template>
          <template v-slot:[`body.locaAces.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Local }}
						</span>
          </template>
          <template v-slot:[`body.empr.Descricao`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.Empresa }}
						</span>
          </template>
          <template v-slot:[`body.bilh.NumInner`]="{ item }">
						<span class="whitespace-nowrap">
							{{ item.NumInner }}
						</span>
          </template>
				</TabelaPadrao>
			</div>

			<div
				class="absolute w-full h-full bg-black/80 text-white top-0 border border-black text-center items-center flex flex-col justify-center gap-3"
				style="z-index: 102"
				v-if="buscandoDados">
				<div class="square-circle-5"></div>
				<span class="text-4xl font-bold">BUSCANDO DADOS, FAVOR AGUARDE</span>
			</div>
		</div>
    <RodapePagina>
      <template v-slot>
        <div class="flex items-center gap-2 w-full">
          <BotaoPadrao texto="Excel" @clique="gerarExcel()" :disabled="buscandoDados">
            <img src="@/assets/icons/excel-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
          <BotaoPadrao texto="Relátorio" @clique="gerarRelatorio()" :disabled="buscandoDados">
            <img src="@/assets/icons/printer-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </RodapePagina>
	</div>
</template>

<script>
	import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import { buscarTerceiros } from "~/mixins/buscarInformacoes"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import TabelaPadrao from "~/components/Ui/TabelaPadrao.vue"
  import RodapePagina from "~/components/Shared/RodapePagina.vue";
  import gerarExcel from "~/functions/gerarExcel";
  import { jsPDF } from "jspdf";
  import "jspdf-autotable"

	export default {
		mixins: [buscarTerceiros],
		name: "Acessos",
		components: { RodapePagina, TabelaPadrao, BotaoPadrao, AppFormSelectCompleto, AppFormInput, CabecalhoPagina },
		data() {
			return {
				acesso: {
					data_inicial: this.$dayjs().format("YYYY-MM-DD"),
					data_final: this.$dayjs().format("YYYY-MM-DD"),
					hora_inicial: "00:00",
					hora_final: "23:59",
          nome: null,
          empresa: null,
				},
        locaisAcesso: [],
				terceiros: [],
				filtros: [],
				ordem: null,
				totalItens: 0,
				dados: [],
				itensPorPagina: 100,
				pagina: 1,
				buscandoDados: false,

			}
		},
		computed: {
      cabecalho(){
        return [
          { nome: "Matricula", valor: "func.Matricula", filtro: true },
          { nome: "Nome", valor: "func.Nome", filtro: true },
          { nome: "Cargo", valor: "depa.Descricao", filtro: true },
          {
            nome: "Origem", valor: "localOrig.Descricao", filtro: true,
            mostrarVazio: false,
            opcoes:
              this.locaisAcesso.length > 0 ?
                Array.from(
                  new Set(
                    this.locaisAcesso
                      .map((item) => {
                        return { id: item.Descricao, texto: item.Descricao }
                      }),
                  ),
                )
                : []
          },
          {
            nome: "Entrou no", valor: "locaAces.Descricao", filtro: true,
            mostrarVazio: false,
            opcoes:
              this.locaisAcesso.length > 0 ?
                Array.from(
                  new Set(
                    this.locaisAcesso
                      .map((item) => {
                        return { id: item.Descricao, texto: item.Descricao }
                      }),
                  ),
                )
                : []
          },
          { nome: "Catraca", valor: "bilh.NumInner", filtro: true },
          { nome: "Data e Hora", valor: "DataHora", ordenar: true },
          { nome: "Empresa", valor: "empr.Descricao", filtro: true },
        ]
      }
		},
		async created() {
			let terceiros = await this.buscarTerceiros()
			this.terceiros = terceiros.map((o) => {
				return { id: o.nome, nome: o.nome }
			})
      await this.buscarLocaisAcesso()
		},
		methods: {
			async buscarAcessos() {
				this.buscandoDados = true
				let page = this.pagina
				let size = this.itensPorPagina
				let filtros = this.filtros

        let { nome, empresa } = this.acesso

        if(nome !== null && nome !== ""){
          filtros.push(`AND LOWER(func.Nome) LIKE LOWER('%${nome}%')`)
        }
        if(empresa !== null && empresa !== ""){
          filtros.push(`AND LOWER(empr.Descricao) LIKE LOWER('%${empresa}%')`)
        }

				let resp = await this.$axios.$get("/catraca/acessos/novo_padrao", {
					params: { ...this.acesso, page, size, filtros },
				})

				if (!resp.falha) {
					this.dados = resp.dados.acessos
          this.totalItens = resp.dados.total
					this.buscandoDados = false
				}
			},
      async buscarLocaisAcesso(){
        let resp = await this.$axios.$get("/catraca/locais_acesso")

        if(!resp.falha){
          this.locaisAcesso = resp.dados.locaisAcesso
        }
      },
      async gerarExcel(){
        let cabecalho = [
          "Matricula",
          "Nome",
          "Cargo",
          "Origem",
          "Entrou no",
          "Catraca",
          "Data/Hora",
          "Empresa",
        ]
        let nomeArquivo

        nomeArquivo = "acesso_catraca"

        let dados = this.dados
        let itens = []

        for (let item of dados) {
          let temp = []
          temp.push(item.Matricula)
          temp.push(item.Nome)
          temp.push(item.Funcao)
          temp.push(item.Origem)
          temp.push(item.Local)
          temp.push(item.NumInner)
          temp.push(this.$dayjs(item.DataHora).utc().format("DD/MM/YYYY HH:mm:ss"))
          temp.push(item.Empresa)
          temp.push(item.rota)
          temp.push(item.cartao)
          itens.push(temp)
        }
        gerarExcel(cabecalho, itens, nomeArquivo)
      },
      async gerarRelatorio(){
        let dados = this.dados

        let hojeAgr = this.$dayjs().format("DD/MM/YYYY hh:mm:ss")

        let novosDados = JSON.parse(JSON.stringify(dados))
        for (let dado of novosDados) {
          dado["data_hora"] = this.$dayjs(dado.DataHora).utc().format("DD/MM/YYYY HH:mm:ss")
        }
        var doc = new jsPDF({ orientation: "landscape" })
        doc.page = 1
        doc.setProperties({
          title: "Efetivo",
        })
        doc.setFontSize(10)
        doc.text(hojeAgr, 287, 10, null, null, "right")
        doc.line(10, 12, 287, 12)
        doc.setFontSize(24)
        doc.text(`Acessos nas catracas`, 10, 22)
        doc.setFontSize(14)
        doc.text(`Total: ${dados.length}`, 287, 21, null, null, "right")
        doc.setFontSize(5)
        doc.autoTable({
          head: [["Matricula", "Nome", "Cargo", "Entrou no", "Catraca", "Data/Hora"]],
          columns: [
            { header: "Matricula", dataKey: "Matricula" },
            { header: "Nome", dataKey: "Nome" },
            { header: "Cargo", dataKey: "Funcao" },
            { header: "Entrou no", dataKey: "Local" },
            { header: "Catraca", dataKey: "NumInner" },
            { header: "Data/Hora", dataKey: "data_hora" },
          ],
          columnStyles: { id: { halign: "center" } },
          body: novosDados,
          theme: "striped",
          headStyles: {
            fillColor: [50, 50, 50],
          },
          startY: 25,
          pageBreak: "auto",
          margin: { left: 8, right: 8, top: 10 },
          styles: {
            fontSize: 8,
          },
        })
        const totalPaginas = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        for (var i = 1; i <= totalPaginas; i++) {
          doc.setPage(i)
          doc.text(`Página ${String(i)} de ${String(totalPaginas)}`, 287, 205, null, null, "right")
        }
        window.open(doc.output("bloburl", { filename: "tabela_clientes.pdf" }))
      }
		},
	}
</script>

<style scoped>
	.square-circle-5 {
		width: 65px;
		aspect-ratio: 1;
		position: relative;
	}

	.square-circle-5:before,
	.square-circle-5:after {
		content: "";
		position: absolute;
		border-radius: 50px;
		box-shadow: 0 0 0 3px inset #fff;
		animation: sc5 2.5s infinite;
	}

	.square-circle-5:after {
		animation-delay: -1.25s;
		border-radius: 0;
	}

	@keyframes sc5 {
		0% {
			inset: 0 35px 35px 0;
		}
		12.5% {
			inset: 0 35px 0 0;
		}
		25% {
			inset: 35px 35px 0 0;
		}
		37.5% {
			inset: 35px 0 0 0;
		}
		50% {
			inset: 35px 0 0 35px;
		}
		62.5% {
			inset: 0 0 0 35px;
		}
		75% {
			inset: 0 0 35px 35px;
		}
		87.5% {
			inset: 0 0 35px 0;
		}
		100% {
			inset: 0 35px 35px 0;
		}
	}
</style>
