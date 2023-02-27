<template>
  <div class=" fixed z-50 top-2 right-2 flex p-4 min-w-[500px] border-2 rounded-sm text-center"
       style="z-index: 100"
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
        <button @click="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
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
