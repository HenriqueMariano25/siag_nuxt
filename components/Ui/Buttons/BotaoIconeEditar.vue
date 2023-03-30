<template>
  <div class="flex itens-center w-10">
    <button class="hover:bg-blue-200 rounded-xl p-1" @click="$emit('click')">
      <img src="@/assets/icons/edit-b.svg" alt="close" class="w-7 h-7"/>
    </button>
  </div>
</template>

<script>
export default {
  name: "BotaoIconEditar"
}
</script>

<style scoped>

</style>
