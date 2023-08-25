<template>
	<div>
		<BaseDialog
			:titulo="funcaoLocal.id === null ? 'Criar função' : `Editando função - ${funcao.descricao}`"
			:btnDeletar="funcaoLocal.id !== null"
			@deletar="deletarFuncao()"
			@cancelar="cancelar()">
			<template v-slot:corpo>
				<div class="px-2 grid grid-cols-12 gap-2">
					<AppFormInput
						id="codigo"
						type="text"
						label="Código"
            class="col-span-2"
						readonly
						v-model="funcaoLocal.id" />
					<AppFormInput
						id="numero_cbo"
						type="text"
            obrigatorio
						label="Número CBO"
            class="col-span-3"
            placeholder="Ex: 0000123"
            :invalido="erros.includes('numero_cbo')"
						v-model="funcaoLocal.numero_cbo" />
          <AppFormInput
            id="nome"
            type="text"
            label="Nome"
            obrigatorio
            class="col-span-7"
            placeholder="Ex: Programador"
            :invalido="erros.includes('nome')"
            v-model="funcaoLocal.nome" />
          <AppFormInput
            id="descricao"
            type="text"
            label="Descrição"
            obrigatorio
            class="col-span-9"
            placeholder="Ex: Função responsável por desenvolver os sistemas da obra"
            :invalido="erros.includes('descricao')"
            v-model="funcaoLocal.descricao" />
          <AppFormInput
            id="salario"
            type="text"
            label="Sálario"
            obrigatorio
            class="col-span-3"
            placeholder="Ex: 2500,00"
            :invalido="erros.includes('salario')"
            v-model="funcaoLocal.salario" />
          <AppFormRadio
            id="cct"
            simNao
            class="col-span-6"
            obrigatorio
            v-model="funcaoLocal.cct"
            :invalido="erros.includes('cct')"
            titulo="Está na CCT - Convensão Coletiva de Trabalho" />
          <AppFormRadio
            :itens="opcoesMaoObra"
            titulo="Tipo de Mão de Obra"
            id="tipo_mao_obra"
            class="col-span-6"
            obrigatorio
            v-model="funcaoLocal.tipo_mao_obra"
            :invalido="erros.includes('tipo_mao_obra')" />
          <div class="col-span-12">
            <span><strong>Setores</strong></span>
            <div class="grid grid-cols-4">
              <div v-for="setor of setores" class="">
                <AppFormCheckbox
                  :label="setor.nome"
                  :id="'checkbox'+setor.id+setor.nome"
                  :valor="setor.id"
                  v-model="funcaoLocal.setores" />
              </div>
            </div>
          </div>

				</div>
			</template>
      <template v-slot:rodape-btn-direito>
        <BotaoPadrao texto="salvar" @clique="funcaoLocal.id === null ? cadastrarFuncao() : editarFuncao()">
          <img src="@/assets/icons/save-b.svg" alt="" class="w-7 h-7">
        </BotaoPadrao>
      </template>
		</BaseDialog>
	</div>
</template>

<script>
	import BaseDialog from "~/components/Shared/BaseDialog.vue"
	import { buscarSetores } from "~/mixins/buscarInformacoes"
	import AppFormInput from "~/components/Ui/AppFormInput.vue"
  import AppFormRadio from "~/components/Ui/Form/AppFormRadio.vue";
  import AppFormCheckbox from "~/components/Ui/Form/AppFormCheckbox.vue";
  import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";

	export default {
		mixins: [buscarSetores],
		name: "DialogCriarFuncao",
		components: { BotaoPadrao, AppFormCheckbox, AppFormRadio, AppFormInput, BaseDialog },
		props: {
			funcao: {
				type: Object,
			},
		},
		data() {
			return {
				funcaoLocal: {
					id: null,
					nome: null,
					numero_cbo: null,
					descricao: null,
					tipo_mao_obra: null,
					cct: null,
					salario: null,
          setores: []
				},
				setores: [],
        erros: [],
        opcoesMaoObra: [
          { label: "Direta", valor: "direta" },
          { label: "Indireta", valor: "indireta" },
        ],
			}
		},
		async mounted() {
			this.setores = await this.buscarSetores()

      if (this.funcao) {
        let funcaoFormatada = Object.assign({}, this.funcao)
        funcaoFormatada['setores'] = this.funcao.setor.map(o => o.id)

        this.funcaoLocal = funcaoFormatada
      }
		},
		methods: {
			cancelar() {
				this.$emit("cancelar")
			},

      validarFormulario() {
        this.erros = []

        let camposObrigatorio = [
          "numero_cbo",
          "nome",
          "descricao",
          "tipo_mao_obra",
          "cct",
          "salario",
        ]

        for (let campo of camposObrigatorio) {
          if (this.funcaoLocal[`${campo}`] === null || this.funcaoLocal[`${campo}`] === "") this.erros.push(campo)
        }
      },

      async cadastrarFuncao(){
        let { numero_cbo, nome, descricao, tipo_mao_obra, setores, cct, salario } = this.funcaoLocal;

        this.validarFormulario()

        if (this.erros.length === 0) {

          try {
            let resp = await this.$axios.$post("/contratacao/funcao/cadastrar", {
              numero_cbo,
              nome: nome.trim(),
              descricao,
              tipo_mao_obra,
              setores,
              cct,
              salario
            })

            let funcaoCriada = resp.funcao
            this.$emit("cadastrado", funcaoCriada);

          } catch (error) {
            console.log(error);
          }
        }
      },

      async editarFuncao(){
        let { numero_cbo, nome, descricao, tipo_mao_obra, setores, cct, salario, id } = this.funcaoLocal;

        this.validarFormulario()

        if (this.erros.length === 0) {

          try {
            let resp = await this.$axios.$put("/contratacao/funcao/editar", {
              numero_cbo,
              nome: nome.trim(),
              descricao,
              tipo_mao_obra,
              id,
              setores,
              cct,
              salario
            })

            let funcaoEditada = resp.funcao
            this.$emit("editado", funcaoEditada);

          } catch (error) {
            console.log(error);
          }
        }
      },

			async deletarFuncao() {
        let { id } = this.funcaoLocal;
        try {
          await this.$axios.$delete("/contratacao/funcao/deletar", { params: { id } })

          this.$emit("deletado", id);
        } catch (error) {
          console.log(error);
        }
      },
		},
	}
</script>

<style scoped></style>
