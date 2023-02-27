<template>
  <div class="flex">
    <input class="cursor-pointer" type="checkbox" :id="'inputCheckbox' + id" :value="valor" v-model="model" @click.stop>
    <label :for="'inputCheckbox' + id" v-if="label">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: "AppFormCheckbox",
  props: {
    label: {
      type: [String, Number],
      default: ""
    },
    valor: {
      type: [String, Number, Array, Object],
      required: true,
      default: ""
    },
    value: Array,
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
}
</script>

<style scoped>

</style>
