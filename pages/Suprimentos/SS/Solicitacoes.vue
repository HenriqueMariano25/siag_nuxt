<template>
  <div>
    <RodapePagina>
      <template v-slot>
        <div class="flex items-center w-full">
          <div class="flex w-full justify-end gap-4">
            <BotaoPadrao
              texto="Criar SS"
              @click="mostrarDialogCriarSolicitacao = true"
              >
              <template v-slot>
                <img src="@/assets/icons/add-b.svg" alt="close" class="w-8 h-8"/>
              </template>
            </BotaoPadrao>
<!--            <BotaoPadrao-->
<!--              texto="Processar Card"-->
<!--              :disabled="selecionados.length === 0"-->
<!--              @click="mostrarDialogProcessarCard = true">-->
<!--              <template v-slot>-->
<!--                <img-->
<!--                  src="@/assets/icons/check-circle-b.svg"-->
<!--                  alt="close"-->
<!--                  class="w-6 h-6"/>-->
<!--              </template>-->
<!--            </BotaoPadrao>-->
          </div>
        </div>
      </template>
    </RodapePagina>
    <DialogCriarSS v-if="mostrarDialogCriarSolicitacao" @cancelar="mostrarDialogCriarSolicitacao = false" :ss_id="ss_id" @adicionado="ssAdicionado"/>
    <AppAlerta
      tipo="sucesso"
      :mostrar="mostrarAlerta"
      @escondeu="mostrarAlerta = false">
      {{ textoAlerta }}
    </AppAlerta>
  </div>
</template>

<script>
import RodapePagina from "~/components/Shared/RodapePagina.vue";
import BotaoPadrao from "~/components/Ui/Buttons/BotaoPadrao.vue";
import DialogCriarSS from "~/components/Dialogs/Suprimentos/SS/DialogCriarSS.vue";
import AppAlerta from "~/components/Ui/AppAlerta.vue";
export default {
  name: "Solicitacoes",
  components:{
    RodapePagina,
    BotaoPadrao,
    DialogCriarSS,
    AppAlerta
  },
  data(){
    return{
      mostrarDialogCriarSolicitacao: false,
      ss_id: null,
      mostrarAlerta: false,
      textoAlerta: "",
    }
  },
  methods:{
    async ssAdicionado(){
      this.mostrarDialogCriarSolicitacao = false
      this.mostrarAlerta = true
      this.textoAlerta = "Solicitação criada com sucesso!"
    },
  }
}
</script>

<style scoped>

</style>
