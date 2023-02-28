<template>
  <div class="flex itens-center justify-center">
    <button class="hover:bg-gray-300 rounded-xl p-1" @click="$emit('click')">
      <slot>

      </slot>
    </button>
  </div>
</template>

<script>
export default {
  name: "BotaoIcone"
}
</script>

<style scoped>

</style>
