<template>
	<div class="w-full flex flex-col gap-y-1 print:-m-3 print:-mt-4 bg-white">
    <CabecalhoPagina titulo="PRESENTES/NÃO PRESENTES" />
		<div class="flex bg-white p-1 gap-2 justify-between border border-gray-300 shadow print:hidden !mt-11">
			<div class="flex">
				<div class="flex items-end gap-2">
					<BotaoPadrao
						texto="imprimir"
						cor="bg-blue-300 !hover:bg-blue-400"
						:disabled="!buscouDados"
						@clique="mostrarDialogAgendadosSPresenca = true">
						<img
							src="@/assets/icons/printer-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
					<BotaoPadrao
						texto="Lista de funcionários"
						cor="bg-blue-300 !hover:bg-blue-400"
						:disabled="!buscouDados"
						@clique="listaFuncionarios()">
						<img
							src="@/assets/icons/list-b.svg"
							alt=""
							class="w-7 h-7" />
					</BotaoPadrao>
				</div>
			</div>
			<div class="flex gap-2">
				<AppFormInput
					id="data"
					type="date"
					v-model="data"
					label="Data" />
				<div class="flex items-end">
					<BotaoPadrao
            :disabled="data === null || data === ''"
						texto="Gerar kpi"
						@clique="gerarKpi()"
						cor="bg-gray-900 text-white"></BotaoPadrao>
				</div>
			</div>
		</div>
		<div class="border border-gray-300 relative print:hidden h-[635px] overflow-y-auto">
					<div class="flex flex-col " v-show="buscouDados">
            <div class="bg-blue-500 text-center">
              <span class="text-xl">FUNCIONÁRIOS AGENDADOS COM E SEM PRESENÇA</span>
            </div>
            <div class="flex divide-x divide-gray-800">
              <div class="w-5/12 flex flex-col items-center">
                <div class="w-full h-full flex justify-center items-center">
                  <div class="w-[580px] h-[480px]">
                    <ApexChart
                      class=""
                      type="pie"
                      :options="opcoesGraSemPresencaPorSetor"
                      :series="valoresGraSemPresencaPorSetor"
                      id="graSemPresencaPorSetor" />
                  </div>
                </div>
              </div>
              <div class="flex w-7/12" style="height: calc(100vh - 130px) ">
                <div class="w-full grid grid-cols-1 divide-y divide-gray-800">
                  <div class="flex w-full grow">
                    <div ref="graSemPresencaQuantSetor" class="flex  w-full !h-[200px]"></div>
                  </div>
                  <div class="flex h-[300px] w-full ">
                    <div ref="graSemPresencaCargosQuant" class="flex  w-full !h-[200px]"></div>
                  </div>
                </div>
              </div>
            </div>
					</div>




          <div class="flex flex-col divide-y divide-gray-800" v-show="buscouDados">
            <div class="bg-blue-500 text-center">
              <span class="text-xl">FUNCIONÁRIOS PRESENTES COM E SEM AGENDAMENTO</span>
            </div>
            <div class="flex divide-x divide-gray-800">
              <div class="flex flex-col w-4/12">
                <div class="w-full">
                  <div ref="graSemAgendamentoGeral" class="flex  w-full !h-[300px]"></div>
                </div>
              </div>
              <div class="flex flex-col w-8/12">
                <div class="w-full">
                  <div ref="graSemAgendamento" class="flex  w-full !h-[300px]"></div>
                </div>
              </div>

            </div>
            <div class="flex" style="">
              <div class="w-full grid grid-cols-1 divide-y divide-gray-800">

                <div class="flex h-[300px] w-full">
                  <div ref="graSemAgendamentoSetor" class="flex  w-full !h-[300px]"></div>
                </div>
              </div>
            </div>
          </div>

					<div
						class="flex w-full h-full absolute top-0 items-center justify-center bg-gray-700/70 gerandoKpi"
						v-if="gerandoKpi">
						<div class="p-2 bg-gray-800 rounded">
							<h1 class="text-4xl text-white">Gerando KPI, favor aguarde...</h1>
						</div>
					</div>
		</div>
		<DialogImprimirAgendadoSPresenca
			v-if="mostrarDialogAgendadosSPresenca"
      :data="data"
			@cancelar="mostrarDialogAgendadosSPresenca = false"
			:dados="dadosGraAgendadoSPresenca" />
	</div>
</template>

<script>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
	import AppTabs from "~/components/Ui/AppTabs.vue"
	import DialogImprimirAgendadoSPresenca from "~/components/Dialogs/Administracao/Rh/HoraExtra/DialogImprimirAgendadoSPresenca.vue"
  import { Workbook } from "exceljs";
  import dayjs from "dayjs";
  import * as fs from "file-saver";
  import CabecalhoPagina from "~/components/Shared/CabecalhoPagina.vue";

	export default {
		components: { CabecalhoPagina, DialogImprimirAgendadoSPresenca, AppTabs, BotaoPadrao, AppFormInput },
		data() {
			return {
				mostrarDialogAgendadosSPresenca: false,

				valoresGraSemPresencaPorSetor: [],
				opcoesGraSemPresencaPorSetor: {
					chart: {
						type: "pie",
					},
					title: {
						text: "Funcionários ausentes por setor",
						align: "center",
					},
					labels: [],
					legend: {
						position: "top",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
            }
          },
          exporting: {
            enabled: false,
          },
					responsive: [
						{
							breakpoint: 480,
							options: {
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				valoresGraSemPresencaQuantSetor: [],
				opcoesGraSemPresencaQuantSetor: {
					chart: {
						type: "bar",
            height: 280,
					},
					title: {
						text: "Funcionários total/ausentes por setor",
						align: "center",
					},
          exporting: {
            enabled: false,
          },
					legend: {
						position: "top",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
					labels: [],
					responsive: [
						{
							breakpoint: 480,
							options: {
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				valoresGraSemPresencaCargosQuant: [],
				opcoesGraSemPresencaCargosQuant: {
					chart: {
						type: "bar",
            height: 280,
					},
					title: {
						text: "Ausencias por função",
						align: "center",
					},
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
					labels: [],
          exporting: {
            enabled: false,
          },
					responsive: [
						{
							breakpoint: 480,
							options: {
								chart: {
									width: 200,
								},
								legend: {
									position: "bottom",
								},
							},
						},
					],
				},

				data: null,
				tabs: [
					{ nome: "Agendados s/ Presença", valor: "agend_s_presenca" },
					{ nome: "Presentes s/ Agendamento", valor: "pres_s_agendamento" },
				],
        tab: null,
				agendSPresenca: {
					totalAgend: 0,
					totalAusente: 0,
					direto: 0,
					indireto: 0,
				},
				graficosCriados: false,
				gerandoKpi: false,
				buscouDados: false,
				funcionariosAgendados: [],
				funcPresenteSemAgend: [],


        //PRESENTES S/ AGENDAMENTOS

        // -> Presentes com e sem agendamentos
        valoresGraSemAgendamentoGeral: [3],
        opcoesGraSemAgendamentoGeral: {
          chart: {
            type: "donut",
          },
          title: {
            text: "Presentes com e sem agendamento",
            offsetY: 0,
            align: 'top',
            style: {
              color: '#444',
              fontSize: '18px',
              fontWeight: 'bold',
            }
          },
          labels: [],
          legend: {
            position: "right",
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '14px',
            }
          },
          exporting: {
            enabled: false,
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },

        // -> Sem agendamento por setor
        valoresGraSemAgendamentoSetor: [],
        opcoesGraSemAgendamentoSetor: {
          chart: {
            type: "bar",
            stacked: true,
            toolbar: {
              show: false,
              offsetX: 0,
              offsetY: 0,
            },
            height: "100%",
            width: "100%",
          },

          title: {
            text: "Sem agendamentos por setor",
            offsetY: 0,
            align: 'top',
            style: {
              color: '#444',
              fontSize: '18px',
              fontWeight: 'bold',
            }
          },
          plotOptions: {
            bar: {
              dataLabels: {
                // hideOverflowingLabels: false,
                position: "top", // Define a posição dos data labels como "top"
              },
              minHeight: 1
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            // offsetY: 10,
            style: {
              fontSize: '14px',
              colors: ["#304758"]
            }
          },
          exporting: {
            enabled: false,
          },

        },

        // -> Sem agendamento
        valoresGraSemAgendamento: [],
        opcoesGraSemAgendamento: {
          chart: {
            id: "presentesSemAgendamento",
            toolbar: {
              show: false,
              offsetX: 0,
              offsetY: 0,
            },
            height: "100%",
            width: "100%",
            type: 'bar',
          },
          title: {
            text: 'Sem Agendamento, Sem Aprovação e Sem Aprovação Site Manager',
            offsetY: 0,
            align: 'top',
            style: {
              color: '#444',
              fontSize: '18px',
              fontWeight: 'bold',
            }
          },
          dataLabels: {
            enabled: true,
            offsetY: 30,
            style: {
              colors: ["#222"],
              fontSize: "17px",
            },
          },
        },
			}
		},

    computed: {
			dadosGraAgendadoSPresenca() {
				let agendSPresenca = this.agendSPresenca

				let valoresGraSemPresencaPorSetor = this.valoresGraSemPresencaPorSetor
				let opcoesGraSemPresencaPorSetor = this.opcoesGraSemPresencaPorSetor

				let valoresGraSemPresencaQuantSetor = this.valoresGraSemPresencaQuantSetor
				let opcoesGraSemPresencaQuantSetor = this.opcoesGraSemPresencaQuantSetor

				let valoresGraSemPresencaCargosQuant = this.valoresGraSemPresencaCargosQuant
				let opcoesGraSemPresencaCargosQuant = this.opcoesGraSemPresencaCargosQuant

        let valoresGraSemAgendamento = this.valoresGraSemAgendamento
        let opcoesGraSemAgendamento = this.opcoesGraSemAgendamento

        let valoresGraSemAgendamentoSetor = this.valoresGraSemAgendamentoSetor
        let opcoesGraSemAgendamentoSetor = this.opcoesGraSemAgendamentoSetor

        let valoresGraSemAgendamentoGeral = this.valoresGraSemAgendamentoGeral
        let opcoesGraSemAgendamentoGeral = this.opcoesGraSemAgendamentoGeral

				return {
					valoresGraSemPresencaPorSetor,
					opcoesGraSemPresencaPorSetor,
					valoresGraSemPresencaQuantSetor,
					opcoesGraSemPresencaQuantSetor,
					valoresGraSemPresencaCargosQuant,
					opcoesGraSemPresencaCargosQuant,
					agendSPresenca,
          valoresGraSemAgendamento,
          opcoesGraSemAgendamento,
          valoresGraSemAgendamentoSetor,
          opcoesGraSemAgendamentoSetor,
          valoresGraSemAgendamentoGeral,
          opcoesGraSemAgendamentoGeral
				}
			},
		},
		methods: {
      async renderizarGraSemPresencaCargosQuant(){

        let opcoes = Object.assign({}, this.opcoesGraSemPresencaCargosQuant)

        let valores = this.valoresGraSemPresencaCargosQuant

        const chartContainer = this.$refs.graSemPresencaCargosQuant;

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,

          series: valores,
        });

        await chart.render();
      },

      async renderizarGraSemPresencaQuantSetor() {

        let opcoes = Object.assign({}, this.opcoesGraSemPresencaQuantSetor)

        let valores = this.valoresGraSemPresencaQuantSetor

        const chartContainer = this.$refs.graSemPresencaQuantSetor;

        const chart = new ApexCharts(chartContainer, {
          ...opcoes,
          series: valores,
        });

        await chart.render();
      },

			async gerarKpi() {
				this.gerandoKpi = true
        this.buscouDados = false
				let data = this.data

				let resp = await this.$axios.$get("/hora_extra/kpi/presentes_nao_presente", {
					params: { data },
				})

				if (!resp.falha) {
					this.buscouDados = true
					let dados = resp.dados
          await this.gerarGraficosSemAgendamento(dados)

					this.agendSPresenca.totalAgend = dados.agendamentos.length
					let chapasPresentes = dados.presentes.map((o) => o.chapa)

					// Separa os agendamento sem presença
					let semPresenca = dados.agendamentos.filter((o) => !chapasPresentes.includes(o.chapa))
					this.funcionariosAgendados = semPresenca

					this.agendSPresenca.totalAusente = semPresenca.length
					this.agendSPresenca.direto = semPresenca.filter(
						(o) => o.Funcionario && o.Funcionario.direto_indireto === "D",
					).length
					this.agendSPresenca.indireto = semPresenca.filter(
						(o) => o.Funcionario && o.Funcionario.direto_indireto === "I",
					).length

					// Conta a ocorrencia de sem presença por setor
					let semPresSetor = semPresenca.reduce((array, valor) => {
						if (valor.Setor && valor.Setor.nome) {
							if (array[valor.Setor.nome]) {
								array[valor.Setor.nome] += 1
							} else {
								array[valor.Setor.nome] = 1
							}
						}
						return array
					}, {})

					this.opcoesGraSemPresencaPorSetor = {
						...this.opcoesGraSemPresencaPorSetor,
						labels: Object.keys(semPresSetor),
					}

					this.valoresGraSemPresencaPorSetor = [...Object.values(semPresSetor)]

					// Separa quantidade de sem presença com quantidade de funcionario por setor
					let semPresQuantiFunci = [
						{ data: [], label: "Total de Funcionários", backgroundColor: "#014461" },
						{ data: [], label: "Funcionários ausentes", backgroundColor: "#22AA99" },
					]
					for (let sem of Object.keys(semPresSetor)) {
						semPresQuantiFunci[0].data.push(dados.funciPorSetor[sem])
						semPresQuantiFunci[1].data.push(semPresSetor[sem])
					}

					this.opcoesGraSemPresencaQuantSetor = {
						...this.opcoesGraSemPresencaQuantSetor,
						xaxis: {
							categories: Object.keys(semPresSetor),
						},
					}

					this.valoresGraSemPresencaQuantSetor = [
						{ name: "Total por setor", group: "totalSetor", data: [...semPresQuantiFunci[0].data] },
						{
							name: "Ausentes por setor",
							group: "ausentesSetor",
							data: [...semPresQuantiFunci[1].data],
						},
					]

					let todosCargos = semPresenca.map((o) => o.Funcionario.cargo)

					let cargosContados = todosCargos.reduce((array, valor) => {
						if (array[valor]) {
							array[valor]++
						} else {
							array[valor] = 1
						}
						return array
					}, {})

					this.opcoesGraSemPresencaCargosQuant = {
						...this.opcoesGraSemPresencaCargosQuant,
            yaxis: {
              labels: {
                formatter: function (value) {
                  return Math.floor(value); // Arredonda para o número inteiro mais próximo
                },
              },
            },
						xaxis: {
							categories: Object.keys(cargosContados),
							labels: {
								rotate: -45,
                rotateAlways: false
							},
						},
					}

					this.valoresGraSemPresencaCargosQuant = [
						{
							name: "Quant. por cargos",
							group: "quantCargo",
							data: [...Object.values(cargosContados)],
						},
					]

          await this.renderizarGraSemPresencaCargosQuant()
          await this.renderizarGraSemPresencaQuantSetor()

          await this.renderizarGraSemAgendamento()

					this.gerandoKpi = false
				}
			},

      async gerarGraficosSemAgendamento(dados){
        let { presentes, agendamentos } = dados

        let semAgendamento = []
        let semAprovGestor = []
        let semAprovSite = []
        let agendados = []

        for(let presente of presentes){
          let idx = agendamentos.findIndex( o => o.chapa === presente.chapa)

          if(idx < 0){
            semAgendamento.push(presente)
            this.funcPresenteSemAgend.push({ ...presente, motivo: 'Sem agendamento'})
          }else{
            let agend = agendamentos[idx]
            if(agend.aprovacao_he === true){
              agendados.push(presente)
            }else if(agend.aprovacao_he === null) {
              semAprovGestor.push(presente)
              this.funcPresenteSemAgend.push({ ...presente, motivo: 'Sem aprovação Gestor' })
            }else if(agend.aprovacao_he === true && (agend.precisa_aprovacao_situacao === true && agend.aprovacao_situacao === null )){
              semAprovSite.push(presente)
              this.funcPresenteSemAgend.push({ ...presente, motivo: 'Sem aprovação Site Manager' })
            }
          }
        }

        //Grafico de Pizza
        this.opcoesGraSemAgendamentoGeral = {
          ...this.opcoesGraSemAgendamentoGeral,
          labels: ['Agendados', 'Sem Agendamento', 'Sem Aprov. Gestor', 'Sem Aprov. Site Manager'],
        }

        this.valoresGraSemAgendamentoGeral = [agendados.length, semAgendamento.length, semAprovGestor.length, semAprovSite.length ]

        let semAgendamentoSetor = semAgendamento.reduce((array, valor) => {
          if (valor.setor) {
            if (array[valor.setor]) {
              array[valor.setor] += 1
            } else {
              array[valor.setor] = 1
            }
          }
          return array
        }, {})

        let semAprovGestorSetor = semAprovGestor.reduce((array, valor) => {
          if (valor.setor) {
            if (array[valor.setor]) {
              array[valor.setor] += 1
            } else {
              array[valor.setor] = 1
            }
          }
          return array
        }, {})

        let semAprovSiteSetor = semAprovSite.reduce((array, valor) => {
          if (valor.setor) {
            if (array[valor.setor]) {
              array[valor.setor] += 1
            } else {
              array[valor.setor] = 1
            }
          }
          return array
        }, {})

        let cabecalhoSetor = [ ...Object.keys(semAgendamentoSetor), ...Object.keys(semAprovGestorSetor), ...Object.keys(semAprovSiteSetor)]

        let cabecalhoSetorUnicos = cabecalhoSetor.filter((item, index) => {
          return cabecalhoSetor.indexOf(item) === index;
        }).sort()

        let quantSemAgendamento = { name: "Sem agendamento", data: []}
        let quantSemAprovGestor = { name: "Sem aprov. Gestor", data: [] }
        let quantSemAprovSite = { name: "Sem apro. Site Manager", data: [] }

        for(let cab of cabecalhoSetorUnicos){
          quantSemAgendamento.data.push( semAgendamentoSetor[cab] ? semAgendamentoSetor[cab] : 0)
          quantSemAprovGestor.data.push(semAprovGestorSetor[cab] ? semAprovGestorSetor[cab] : 0)
          quantSemAprovSite.data.push(semAprovSiteSetor[cab] ? semAprovSiteSetor[cab] : 0)
        }

        //Grafico de Coluna
        this.opcoesGraSemAgendamentoSetor = {
          ...this.opcoesGraSemAgendamentoSetor,
          xaxis: {
            categories: cabecalhoSetorUnicos,
          },
        }

        this.valoresGraSemAgendamentoSetor = [
          quantSemAgendamento,
          quantSemAprovGestor,
          quantSemAprovSite
        ]

        //Grafico de Coluna Sem Agendamento
        this.valoresGraSemAgendamento = [
          { name: "Funcionários", data: [semAgendamento.length, semAprovGestor.length, semAprovSite.length]},
        ]

        this.opcoesGraSemAgendamento = {
          ...this.opcoesGraSemAgendamento,
          xaxis: {
            labels: {
              rotate: -45
            },
            categories: ['Sem agendamento', 'Sem aprov. Gestor', 'Sem aprov. Site Manager'],
            tickPlacement: 'on'
          },
        }

      },

      async renderizarGraSemAgendamento(){
        let opcoesGraSemAgendamentoSetor = Object.assign({}, this.opcoesGraSemAgendamentoSetor)

        let valoresGraSemAgendamentoSetor = this.valoresGraSemAgendamentoSetor

        const chartContainer = this.$refs.graSemAgendamentoSetor;

        const chart = new ApexCharts(chartContainer, {
          ...opcoesGraSemAgendamentoSetor,
          series: valoresGraSemAgendamentoSetor,
        });

        await chart.render();


        let opcoesGraSemAgendamento = Object.assign({}, this.opcoesGraSemAgendamento)

        let valoresGraSemAgendamento = this.valoresGraSemAgendamento

        const chartContainerSem = this.$refs.graSemAgendamento;

        const chartSem = new ApexCharts(chartContainerSem, {
          ...opcoesGraSemAgendamento,
          series: valoresGraSemAgendamento,
        });

        await chartSem.render();

        let opcoesGraSemAgendamentoGeral = Object.assign({}, this.opcoesGraSemAgendamentoGeral)

        let valoresGraSemAgendamentoGeral = this.valoresGraSemAgendamentoGeral

        const chartContainerGeral = this.$refs.graSemAgendamentoGeral;

        const chartGeral = new ApexCharts(chartContainerGeral, {
          ...opcoesGraSemAgendamentoGeral,
          series: valoresGraSemAgendamentoGeral,
        });

        await chartGeral.render();
      },

      async listaFuncionarios() {
        let funcionarios = this.funcionariosAgendados
        let presentes = this.funcPresenteSemAgend

        let cabecalhoAgendamento = ["Nome", "Chapa", "Cargo", "Hora do agendamento"]
        let nomeArquivo

        nomeArquivo = "funcionarios"

        let cabecalhoPresentes = ["Nome", "Chapa", "Setor", "Motivo"]

        let fname = nomeArquivo;


        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Agendamento sem presença', {
          views: [{ state: "frozen", ySplit: 1 }],
        });
        worksheet.addRow(cabecalhoAgendamento);
        worksheet.autoFilter = "A1:I1";

        worksheet.eachRow(function(row, rowNumber) {
          row.eachCell((cell) => {
            if (rowNumber == 1) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "f5b914" },
              };
              cell.style = { font: { bold: true, size: 14 } };
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
          row.commit();
        });

        let itens = []
        for (let item of funcionarios) {
          let temp = []
          temp.push(item.Funcionario ? item.Funcionario.nome : "")
          temp.push(item.Funcionario ? item.chapa : "")
          temp.push(item.Funcionario ? item.Funcionario.cargo : "")
          temp.push(this.$dayjs(item.createdAt).format("DD/MM/YYYY HH:mm"))
          itens.push(temp)
        }

        for (let item of itens) {
          worksheet.addRow(item);
        }

        worksheet.columns.forEach(function(column) {
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function(cell) {
            if (cell.value) var columnLength = cell.value.length;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          });
          column.width = dataMax < 12 ? 12 : dataMax;
        });


        let worksheetSegunda = workbook.addWorksheet('Presença sem agendamento', {
          views: [{ state: "frozen", ySplit: 1 }],
        });
        worksheetSegunda.addRow(cabecalhoPresentes);
        worksheetSegunda.autoFilter = "A1:I1";

        worksheetSegunda.eachRow(function(row, rowNumber) {
          row.eachCell((cell) => {
            if (rowNumber == 1) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "f5b914" },
              };
              cell.style = { font: { bold: true, size: 14 } };
            }
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
          row.commit();
        });

        let itensPresentes = []
        for (let item of presentes) {
          let temp = []
          temp.push(item.nome)
          temp.push(item.chapa)
          temp.push(item.setor ? item.setor : "")
          temp.push(item.motivo)
          itensPresentes.push(temp)
        }

        for (let item of itensPresentes) {
          worksheetSegunda.addRow(item);
        }

        worksheetSegunda.columns.forEach(function(column) {
          var dataMax = 0;
          column.eachCell({ includeEmpty: true }, function(cell) {
            if (cell.value) var columnLength = cell.value.length;
            if (columnLength > dataMax) {
              dataMax = columnLength;
            }
          });
          column.width = dataMax < 12 ? 12 : dataMax;
        });


        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fs.saveAs(
            blob,
            fname + "-" + dayjs().format("DD_MM_YYYY") + ".xlsx"
          );
        });
      },
		},
	}
</script>

<style scoped>
</style>
