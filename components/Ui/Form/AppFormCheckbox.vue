<template>
  <div class="flex">
    <input class="cursor-pointer mr-2" type="checkbox" :id="'inputCheckbox' + id" :value="valor" v-model="model" @click.stop>
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
      type: [String, Number, Array, Object, Boolean],
      required: true,
      default: ""
    },
    value: [Boolean, Array],
    id: {
      type: [Number, String],
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
