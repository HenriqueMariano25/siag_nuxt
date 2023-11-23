<template>
  <div class=" fixed z-50 top-2 right-2 flex p-4 min-w-[500px] border-2 rounded-sm text-center print:hidden"
       style="z-index: 110"
    :class="{
      'bg-red-300 border-red-700 ' :tipo === 'erro',
      'bg-green-300 border-green-700 ' :tipo === 'sucesso',
      'bg-yellow-300 border-yellow-500 ' :tipo === 'alerta',
    }"
       v-if="mostrar"
  >
    <div class="w-full">
      <span>
        <slot></slot>
      </span>
    </div>
    <div>
      <span>
        <button @click="$emit('escondeu')">
         <img src="@/assets/icons/close-b.svg" alt="" class="w-7 h-7">
        </button>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: "AppAlerta",
  props: {
    tipo: {
      type: String,
      require: true,
      default: "sucesso"
    },
    mostrar:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    mostrar(valor){
      if(valor === true){
        setTimeout(() => {
          this.$emit("escondeu")
        }, 3000)
      }
    }
  }
}
</script>

<style scoped>

</style>
