<template>
  <div>
    <BaseDialog
      titulo="Adicionar Indicação"
      @cancelar="cancelar()">
        <template v-slot:corpo>
          <div class="px-2">
            <div class="mb-2">
              <table class="flex-col w-full">
                <thead class="">
                <tr class="uppercase px-2 py-1 text-sm text-white relative bg-primaria-700">
                  <th>Cod.</th>
                  <th>Função</th>
                  <th>Disciplina</th>
                  <th>Data Necessidade</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  class="bg-white cursor-pointer even:bg-neutral-200 hover:bg-gray-600 hover:text-white">
                  <td class="text-center px-1 py-0.5 border border-collapse border-gray-600">
                    {{ ("000000" + card.id).slice(-6) }}
                  </td>
                  <td class="px-1 py-0.5 border border-collapse border-gray-600">
                    {{ card["FuncaoCard.nome"] ? card["FuncaoCard.nome"] : "" }}
                  </td>
                  <td class="px-1 py-0.5 border border-collapse border-gray-600">
                    {{ card["DisciplinaCard.descricao"] ? card["DisciplinaCard.descricao"] : "" }}
                  </td>
                  <td class="px-1 py-0.5 border border-collapse border-gray-600">
                    {{ $dayjs(card.data_necessidade).format("DD/MM/YYYY") }}
                  </td>
                </tr>
                </tbody>
              </table>

            </div>
            <div
              class="bg-gray-300 p-2 rounded-sm border border-gray-400 col-span-2 grid grid-cols-2 gap-y-2 gap-x-3">
              <AppFormInput
                placeholder="Ex: JOAO MARIANO DA SILVA"
                label="Nome"
                type="text"
                semEspeciais
                obrigatorio
                id="nomeIndicacao"
                uppercase
                v-model="indicacao.nome"
                :invalido="erros.includes('nome')"/>
              <AppFormInput
                placeholder="Ex: (11)99123-4567"
                label="Telefone 1"
                type="text"
                obrigatorio
                id="telefoneIndicacao"
                mask="['(##)####-####','(##)#####-####']"
                v-model="indicacao.telefone"
                :invalido="erros.includes('telefone')"/>
              <AppFormInput
                placeholder="Ex: (11)99123-4567"
                label="Telefone 2"
                type="text"
                id="telefoneIndicacao"
                mask="['(##)####-####','(##)#####-####']"
                v-model="indicacao.telefone_2"/>
              <AppFormInput
                placeholder="Ex: (11)99123-4567"
                label="Telefone 3"
                type="text"
                id="telefoneIndicacao"
                mask="['(##)####-####','(##)#####-####']"
                v-model="indicacao.telefone_3"/>
              <AppFormInput
                placeholder="Ex: joao.mariano@agnet.com.br"
                label="E-mail"
                type="text"
                id="emailIndicacao"
                v-model="indicacao.email"/>
              <AppFormInput
                placeholder="Ex: JOSE MOREIRA"
                label="Quem indicou"
                type="text"
                obrigatorio
                id="indicandoIndicacao"
                v-model="indicacao.indicado_por"
                :invalido="erros.includes('indicado_por')"
                uppercase/>
              <AppFormInput
                placeholder="Ex: 123.456.789-10"
                label="CPF"
                type="text"
                id="cpfIndicacao"
                obrigatorio
                mask="###.###.###-##"
                :textoInvalido="erroCpf ? erroCpf : ''"
                v-model="indicacao.cpf"
                :invalido="erros.includes('cpf')"/>
              <div>
                <AppFormFile
                  label="Currículo em PDF"
                  id="curriculo"
                  @change="indicacao.pdf = $event"/>
                <a
                  target="_blank"
                  :href="`${urlFile}${card.Indicacao.url_pdf}`"
                  v-if="indicacao && indicacao.url_pdf !== null && indicacao.url_pdf !== ''
								"
                  class="border-2 border-gray-800 rounded flex px-2 hover:bg-gray-300 mt-2">
                  <img
                    src="@/assets/icons/file-b.svg"
                    alt=""
                    class="w-7 h-7"/>
                  Currículo
                </a>
              </div>
            </div>
          </div>
        </template>
      <template v-slot:rodape-btn-direito>
        <div class="flex items-center gap-5 text-black">
          <BotaoPadrao
            @click="adicionarIndicacao()"
            texto="adicionar">
            <img src="@/assets/icons/add-b.svg" alt="" class="w-7 h-7">
          </BotaoPadrao>
        </div>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";
import AppFormFile from "~/components/Ui/Form/AppFormFile.vue";
import AppFormInput from "~/components/Ui/AppFormInput.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import AppTooltip from "~/components/Ui/AppTooltip.vue";

export default {
  components: {AppTooltip, BotaoPadrao, AppFormInput, AppFormFile, BaseDialog},
  data() {
    return {
      indicacao: {
        nome: null,
        telefone: null,
        telefone_2: null,
        telefone_3: null,
        email: null,
        indicado_por: null,
        cpf: null,
        pdf: null,
        url_pdf: null,
      },
      erros: [],
      erroCpf: false,
    }
  },
  props: {
    card: {
      type: [Object],
    },
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    async adicionarIndicacao(){
      let indicacao = this.indicacao
      let card_id = this.card.id
      let usuario_id = this.$auth.user.id

      console.log(usuario_id)
      console.log(card_id)
      console.log(indicacao)

      this.validarFormulario()

      await this.validarCpf()

      const config = { headers: { "Content-Type": "multipart/form-data" } }
      let formData = new FormData()
      formData.append(`files`, this.indicacao.pdf)

      let rawData = {
        card_id: card_id,
        indicacao: indicacao,
        usuario_id: usuario_id,
      }

      rawData = JSON.stringify(rawData)
      formData.append("data", rawData)

      console.log(rawData)

      if (this.erros.length === 0) {

        let resp = await this.$axios.$post("/contracao/card/adicionar_indicacao", formData, config)

        console.log(resp)

        if(!resp.falha){
          this.$emit("indicacaoAdicionada", { indicacao, card_id})
        }
      }

    },

    validarFormulario() {
      this.erros = []

      let camposObrigatorio = [
        "nome",
        "telefone",
        "cpf",
        "indicado_por",
      ]

      for (let campo of camposObrigatorio) {
        if (this.indicacao[`${campo}`] === null || this.indicacao[`${campo}`] === "") this.erros.push(campo)
      }
    },

    async validarCpf() {
      let cpf = this.indicacao.cpf
      let indicacao_id = null

      if (cpf !== null && cpf !== "") {
        if (cpf.length === 14) {
          let resp = await this.$axios.$get("/contratacao/consultar_cpf", {
            params: { cpf, indicacao_id },
          })

          if (!resp.falha) {
            let valido = resp.dados.resposta

            if (!valido) {
              this.erros.push("cpf")
              this.erroCpf = "CPF DUPLICADO"
            }
          }
        } else {
          this.erros.push("cpf")
          this.erroCpf = "CPF INVÁLIDO"
        }
      } else {
        this.erros.push("cpf")
        this.erroCpf = "CPF VAZIO"
      }
    },
  },

}
</script>

<style scoped>

</style>
