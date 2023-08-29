<template>
	<BaseDialog
		titulo="Criar PSP"
		:carregando="carregando"
		@cancelar="cancelar()">
		<template v-slot:corpo>
			<div class="px-2 gap-2 flex flex-col">
				<div class="flex flex-col gap-1 bg-blue-100 border border-blue-300">
          <div class="w-full bg-blue-300 flex text-xl px-1">
            <span>FUNCIONÁRIO</span>
          </div>
          <div class="flex flex-col gap-2 p-1">
            <div class="flex gap-2 items-end">
              <span><strong>Selecione um funcionário: </strong></span>
              <AppFormSelectCompleto
                id="funcionario"
                label="Funcionário"
                :options="funcionarios"
                v-model="psp.funcionario_id"
                class="grow" />
              <div class="flex self-end">
                <BotaoPadrao
                  texto="buscar"
                  cor="bg-primaria-200 hover:bg-primaria-500 text-white"
                  @clique="buscarFuncionario"
                  :disabled="psp.funcionario_id === null || psp.funcionario_id === ''">
                  <img
                    src="@/assets/icons/magnifier-w.svg"
                    alt=""
                    class="w-7 h-7" />
                </BotaoPadrao>
              </div>

            </div>
            <div class="grid grid-cols-4 gap-2">
              <AppFormInput
                id="funcao"
                type="text"
                label="Função"
                obrigatorio
                disabled
                readonly
                v-model="psp.cargo"
                placeholder="Ex: Programador" />
              <AppFormInput
                id="matricula"
                type="text"
                obrigatorio
                label="Matrícula"
                disabled
                readonly
                v-model="psp.chapa"
                placeholder="Ex: 195009999" />
              <AppFormInput
                id="cpf"
                type="text"
                label="CPF"
                obrigatorio
                disabled
                readonly
                v-model="psp.cpf"
                placeholder="EX: 123.456.789-12" />
              <AppFormInput
                id="setor"
                type="text"
                label="Setor"
                disabled
                obrigatorio
                readonly
                v-model="psp.setor"
                placeholder="Ex: Administração" />
              <AppFormInput
                id="data_admissao"
                type="date"
                label="Data de Admissão"
                disabled
                readonly
                obrigatorio
                v-model="psp.data_admissao"
              />
              <AppFormInput
                id="turno"
                type="text"
                label="Turno"
                obrigatorio
                disabled
                readonly
                placeholder="EX: Diurno"
                v-model="psp.turno" />
              <AppFormInput
                id="rg"
                type="text"
                label="RG"
                obrigatorio
                placeholder="EX: 12.345.678-9"
                v-model="psp.rg" />
              <AppFormInput
                id="email"
                type="text"
                label="E-mail"
                placeholder="EX: henrique.mariano@agnet.com.br"
                v-model="psp.email" />
              <AppFormInput
                id="celular"
                type="text"
                label="Celular"
                v-model="psp.celular" placeholder="EX: (22) 99123-4567" />
              <AppFormInput
                id="data_nascimento"
                type="date"
                label="Data de Nascimento"
                obrigatorio
                v-model="psp.data_nascimento"
              />

            </div>
          </div>
				</div>
        <div class="flex flex-col gap-1 bg-blue-100 border border-blue-300">
          <div class="p-1">
            <div class="w-full bg-blue-300 flex text-xl px-1">
              <span>PSP</span>
            </div>
            <div class="grid grid-cols-2">
              <div class="flex flex-col gap-1">
                <AppFormRadio
                  :itens="opcoesMotivo"
                  titulo="Motivo"
                  obrigatorio
                  v-model="psp.motivo"
                  id="motivo" />
                <AppFormInput
                  v-if="motivoOutro"
                  id="outros_motivo"
                  type="text"
                  label="Descrição do motivo"
                  obrigatorio
                  placeholder="Ex: Descreva o motivo"
                  v-model="psp.outros_descricao" />
              </div>
              <AppFormRadio
                :itens="opcoesMeioTransporte"
                titulo="Meio de Transporte"
                obrigatorio
                v-model="psp.motivo"
                id="motivo" />
              <AppFormRadio
                :itens="opcoesPrazos"
                titulo="Meio de Transporte"
                obrigatorio
                v-model="psp.motivo"
                id="motivo" />
            </div>
          </div>
        </div>
			</div>
		</template>
	</BaseDialog>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"

	export default {
		name: "DialogCriarPsp",
		components: {
			BaseDialog,
		},
		data() {
			return {
				carregando: false,
				psp: {
					funcionario_id: null,
          cargo: null,
          chapa: null,
          data_admissao: null,
          setor: null,
          rg: null,
          celular: null,
          email: null,
          turno: null,
          data_nascimento: null,
          motivo: null,
          outros_descricao: null,
          meio_transporte: null,
				},
				funcionarios: [],
        turnos: [],
        opcoesMotivo: [
          { label: "Baixada", valor: "Baixada" },
          { label: "Férias", valor: "Férias" },
          { label: "Mobilização fámiliar", valor: "Mobilização fámiliar" },
          { label: "Outros", valor: "outros" },
        ],
        opcoesMeioTransporte: [
          { label: "Rodoviário", valor: "Rodoviário" },
          { label: "Aérea", valor: "Aérea" },
        ],
        opcoesPrazos: [
          { label: "07 dias", valor: "07 dias" },
          { label: "15 dias", valor: "15 dias" },
          { label: "35 dias", valor: "35 dias" },
          { label: "45 dias", valor: "45 dias" },
          { label: "60 dias", valor: "60 dias" },
          { label: "90 dias", valor: "90 dias" },
        ],
			}
		},
    computed: {
      motivoOutro() {
        return this.psp.motivo === 'outros';
      }
    },
		created() {
			this.buscarFuncionarios()
      this.buscarTurnos()
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},
			async buscarFuncionarios() {
				let resp = await this.$axios.$get("/efetivo/buscar_responsaveis")

				if (!resp.falha) {
					let funcionarios = resp.dados.responsaveis

					this.funcionarios = funcionarios.map((o) => {
						return { id: o.id, nome: o.nome }
					})
				}
			},
      async buscarTurnos() {
        let resp = await this.$axios.$get("/efetivo/buscar/turnos")

        if (!resp.falha) {
          let turnos = resp.dados.turnos

          this.turnos = turnos.map((o) => {
            return { id: o.id, nome: o.descricao }
          })
        }
      },
      async buscarFuncionario(){
        let funcionario_id = this.psp.funcionario_id

        let resp = await this.$axios.$get("/psp/buscar/funcionario", {
          params: { id: funcionario_id },
        })

        if (!resp.falha) {
          let funcionario = resp.dados.funcionario

          console.log(funcionario)

          this.psp = Object.assign({},funcionario)
          this.psp.setor= funcionario.setor ? funcionario.setor.nome : null
          this.psp.data_admissao= funcionario.data_admissao ? this.$dayjs(funcionario.data_admissao).format("YYYY-MM-DD") : null
          this.psp.turno= funcionario.Turno ? funcionario.Turno.descricao : null
          // console.log(r)
        }
      }
		},
	}
</script>

<style scoped></style>
<script setup>
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
	import AppFormSelectCompleto from "~/components/Ui/Form/AppFormSelectCompleto.vue"
	import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue"
  import AppFormSelect from "~/components/Ui/AppFormSelect.vue";
  import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";
</script>
