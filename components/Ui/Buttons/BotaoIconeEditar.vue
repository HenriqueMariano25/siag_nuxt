<template>
  <div class="flex itens-center w-10">
    <button class=" rounded-xl p-1 " :class="{'hover:bg-blue-200': !disabled, 'cursor-not-allowed': disabled} " @click="!disabled ? $emit('click') : null">
      <img src="@/assets/icons/edit-b.svg" alt="close" class="w-7 h-7" v-if="!disabled"/>
      <img src="@/assets/icons/edit-g.svg" alt="close" class="w-7 h-7" v-if="disabled"/>
    </button>
  </div>
</template>

<script>
export default {
  name: "BotaoIconEditar",
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>
