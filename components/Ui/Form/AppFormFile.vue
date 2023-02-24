<template>
  <div class="flex flex-col">
    <label :for="'inputFile'+id" class="ml-1.5 text-xs font-medium mb-0.5">{{ label }}<span v-if="obrigatorio" class="text-red-700">*</span></label>
    <input type="file" :id="'inputFile'+id" @change="onChange($event)"/>
  </div>
</template>

<script>
export default {
  name: "AppFormFile",
  props: {
    label: {
      type: String,
      required: true,
      default: ""
    },
    obrigatorio: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true,
      default: ""
    }
  },
  methods: {
    onChange($event) {
      let arquivo = $event.target.files[0]

      this.$emit('change', arquivo);
    }
  },
}
</script>

<style scoped>

</style>
