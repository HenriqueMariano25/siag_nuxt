<template>
  <div class="w-full h-full absolute top-0 left-0 bg-black/30 justify-center items-center flex " style="z-index: 100">
    <div class="bg-white w-3/4 flex flex-col rounded" style="z-index: 101;">
      <div class="rounded-t bg-primaria-700 text-white px-2 py-1 flex items-center justify-between">
        <span class="text-3xl">{{ titulo }}</span>
        <button class="text-white fill-white" @click="$emit('cancelar')">
          <img src="@/assets/icons/close-w.svg" alt="close" class="w-7 h-7"/>
        </button>
      </div>
      <div class="py-2 flex w-full">
        <slot name="corpo"></slot>
      </div>
      <div class="rounded-b bg-primaria-700 text-white px-2 py-1 flex items-center justify-between">
        <slot name="rodape">
          <BotaoCancelar @click="$emit('cancelar')" />
          <slot name="rodape-btn-direito"></slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import BotaoCancelar from "~/components/Ui/Buttons/BotaoCancelar.vue";
import BotaoSalvar from "~/components/Ui/Buttons/BotaoSalvar.vue";
export default {
  name: "BaseDialog",
  props: {
    titulo: {
      type: String,
      required: true,
      default: ""
    }
  },
  components:{
    BotaoCancelar,
    BotaoSalvar
  }
}
</script>

<style scoped>

</style>
