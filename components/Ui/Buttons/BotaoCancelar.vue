<template>
  <button class="px-2 flex space-x-2 rounded-sm uppercase hover:text-gray-300 rounded" @click="$emit('click')">
    Cancelar
  </button>
</template>

<script>
export default {
  name: "BotaoCancelar"
}
</script>

<style scoped>

</style>
