<template>
  <div class="w-full">
    <CabecalhoPagina titulo="Chips" />
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
        @atualizar="buscarChips"
        :temDetalhes="false">
        <template v-slot:[`body.acoes`]="{ item }">
          <div class="flex">
            <BotaoPadrao
              @clique="
							chip = item
							mostrarDialogCriarChip = true
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
        <template v-slot:[`body.data_ativacao`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.data_ativacao">
						{{ $dayjs(item.data_ativacao).format("DD/MM/YYYY") }}
					</span>
        </template>
        <template v-slot:[`body.PlanoChip.nome`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.PlanoChip">
						{{ item.PlanoChip.nome }}
					</span>
        </template>
        <template v-slot:[`body.Funcionario.nome`]="{ item }">
					<span
            class="whitespace-nowrap "
            :class="{'bg-red-500 p-1 !text-black rounded': item.Funcionario.data_demissao}"
            v-if="item.Funcionario">
						{{ item.Funcionario.nome }}
					</span>
          <span
            class="whitespace-nowrap bg-green-500 p-1 !text-black rounded shadow"
            v-if="!item.Funcionario">
						EM ESTOQUE
					</span>
        </template>
        <template v-slot:[`body.Funcionario.setor.nome`]="{ item }">
					<span
            class="whitespace-nowrap"
            v-if="item.Funcionario && item.Funcionario.setor">
						{{ item.Funcionario.setor.nome }}
					</span>
        </template>
        <template v-slot:[`body.SituacaoChip.descricao`]="{ item }">
					<span
            class="whitespace-nowrap">
						{{ item.SituacaoChip.descricao }}
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
              @clique="mostrarDialogCriarChip = true"
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
    <DialogCriarChip
      v-if="mostrarDialogCriarChip"
      @cancelar="
				mostrarDialogCriarChip = false
				chip = null
			"
      @cadastrado="cadastrado"
      @editado="editado"
      @deletado="deletado"
      :chip="chip" />
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
import DialogCriarChip from "~/components/Dialogs/Administracao/Ti/Chips/DialogCriarChip.vue";

export default {
  components: { DialogCriarChip, AppAlerta, RodapePagina, BotaoPadrao, CabecalhoPagina, TabelaPadrao },
  data() {
    return {
      cabecalho: [
        { nome: "", valor: "acoes", largura: "w-14" },
        { nome: "Número", valor: "numero", filtro: true, ordenar: true },
        { nome: "Data Ativação", valor: "data_ativacao" },
        { nome: "SimCard", valor: "sim_card", ordenar: true, filtro: true },
        { nome: "Plano", valor: "PlanoChip.nome", filtro: true, ordenar: true },
        { nome: "Funcionário", valor: "Funcionario.nome", filtro: true, ordenar: true },
        { nome: "Setor", valor: "Funcionario.setor.nome", filtro: true, ordenar: true },
        { nome: "Situação", valor: "SituacaoChip.descricao", filtro: true},
      ],
      filtros: {},
      ordem: null,
      totalItens: 0,
      dados: [],
      itensPorPagina: 100,
      pagina: 1,
      mostrarDialogCriarChip: false,
      chip: null,
      mostrarAlerta: false,
      textoAlerta: null,
    }
  },
  created() {
    this.buscarChips()
  },
  methods: {
    async buscarChips() {
      let filtros = this.filtros
      let ordem = this.ordem

      let resp = await this.$axios.$get("/ti/chip/buscarTodos", {
        params: {
          page: this.pagina - 1,
          size: this.itensPorPagina,
          filtros,
          ordem,
        },
      })
      console.log(resp)

      if (!resp.falha) {
        this.dados = resp.dados.chips
        this.totalItens = resp.dados.total
      }
    },
    cadastrado({ chip, sair }) {
      if(sair){
        this.mostrarDialogCriarChip = false
        this.textoAlerta = "Chip cadastrado com sucesso!"
        this.mostrarAlerta = true
      }
      this.chip = chip
      this.dados.push(chip)
      this.totalItens += 1
    },

    editado({ chip, sair }) {
      if(sair){
        this.chip = null
        this.mostrarDialogCriarChip = false
        this.textoAlerta = "Funcionário no chip editado com sucesso!"
        this.mostrarAlerta = true
      }
      let idx = this.dados.findIndex( o => o.id === chip.id)
      if(idx >= 0){
        this.dados[idx] = Object.assign(this.dados[idx], chip)
      }
    },

    deletado(id) {
      let idx = this.dados.findIndex((o) => o.id === id)
      this.dados.splice(idx, 1)

      this.mostrarDialogCriarChip = false
      this.textoAlerta = "Chip deletada com sucesso!"
      this.mostrarAlerta = true
      this.chip = null
      this.totalItens -= 1
    },

    totalOcupacao(item) {

      let totalFuncionario = item.Funcionarios ? item.Funcionarios.length : 0
      let totalTerceiros = item.TerceirosRota ? item.TerceirosRota.length : 0

      return (totalFuncionario + totalTerceiros)

    },

    async gerarRelatorio(rota) {
      let funcionariosPorRota = []

      let funcionarios = await this.$axios.$get("/transporte/rotas/funcionarios", { params: { id: rota.id } }).then(resp => resp.funcionarios)

      funcionariosPorRota = funcionarios

      let terceiros = await this.$axios.$get("/transporte/terceiros/rota", { params: { rota_id: rota.id } }).then(resp => resp.terceiros)

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

      let hojeAgr = this.$dayjs().format("DD/MM/YYYY HH:mm:ss");

      let novosDados = JSON.parse(JSON.stringify(funcOrdenados));
      var doc = new jsPDF({});
      doc.page = 1;
      doc.setProperties({
        title: "Relatório pontos de embarque",
      });

      const logo = require("@/assets/img/logoagcnovo.png");
      var imgLogo = new Image();
      imgLogo.src = logo;

      doc.addImage(imgLogo, "PNG", 4, 6, 50, 9);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("RELATÓRIO PASSAGEIROS POR ROTA", 75, 9);
      doc.setFontSize(14);
      doc.text(`ROTA`, 190, 9);
      doc.text(`${rota.numero}`, 190, 14);
      doc.setFontSize(12);
      doc.text(`Passageiros: ${funcionariosPorRota.length}`, 4, 20);
      doc.text(
        `Disponíveis: ${46 - parseInt(funcionariosPorRota.length)}`,
        60,
        20
      );

      doc.line(4, 22, 206, 22);
      doc.setFontSize(14);
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
      });
      const totalPaginas = doc.internal.getNumberOfPages();
      doc.setTextColor(0);
      doc.setFontSize(10);
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i);
        doc.text(
          `Página ${String(i)} de ${String(totalPaginas)}`,
          205,
          294,
          null,
          null,
          "right"
        );
        doc.text(hojeAgr, 5, 294);
      }
      window.open(doc.output("bloburl", { filename: "tabela_clientes.pdf" }));
    }
  },
}
</script>

<style scoped></style>
