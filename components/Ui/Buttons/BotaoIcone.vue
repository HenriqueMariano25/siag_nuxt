<template>
  <div class="flex itens-center justify-center min-w-[14px] min-h-[14px] hover:bg-gray-300 rounded-full">
    <button class=" " @click="$emit('click')">
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
