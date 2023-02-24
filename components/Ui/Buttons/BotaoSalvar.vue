<template>
  <button class="flex items-center px-3 text-black py-1 bg-gray-100 flex space-x-2 rounded-sm uppercase hover:bg-gray-300" @click.prevent.stop="$emit('click')">
    <img src="@/assets/icons/save-b.svg" alt="close" class="w-8 h-8"/>
    <span>Salvar</span>
  </button>
</template>

<script>
export default {
  name: "BotaoSalvar"
}
</script>

<style scoped>

</style>
