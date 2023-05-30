<template>
  <div class="absolute h-11 bg-primaria-700 top-0 w-full -ml-2 pl-2 pr-2 flex items-center text-white text-2xl"
       style="max-width: 100vw">
      <span>{{ titulo }}</span>
  </div>
</template>

<script>
export default {
  props: {
    titulo: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
