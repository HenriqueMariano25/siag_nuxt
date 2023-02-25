<template>
  <div class="w-full flex-col">
    <div class="bg-primaria-700 h-14 w-full flex text-white">
      {{ tabs }}

      <button v-for="tab in tabs" :key="tab.nome" class="px-4 border-b-4 border-b-white hover:bg-blue-500" @click="$emit('teste', tab.click)">
        Controle
      </button>
    </div>
    <div class="">
      <slot name="conteudo">

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTabs",
  props:{
    tabs:{
      type: [Array],
      required: true
    }
  }
}
</script>

<style scoped>

</style>
