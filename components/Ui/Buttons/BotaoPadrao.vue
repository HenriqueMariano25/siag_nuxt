<template>
  <button class="px-3 py-2 bg-gray-100 flex space-x-2 rounded-sm uppercase hover:bg-gray-400" @click="$emit('click')">
    <slot></slot>
    <span>{{ texto }}</span>
  </button>
</template>

<script>
export default {
  name: "BotaoPadrao",
  props: {
    texto: {
      type: String,
      required: true,
      default: ""
    }
  }
}
</script>

<style scoped>

</style>
