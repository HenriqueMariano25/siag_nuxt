<template>
  <div>
    <input type="checkbox" :id="'inputCheckbox' + id" :value="valor" v-model="model" >
    <label :for="'inputCheckbox' + id">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: "AppFormCheckbox",
  props: {
    label: {
      type: String,
      required: true,
      default: ""
    },
    valor: {
      type: [String, Number],
      required: true,
      default: ""
    },
    value: Array,
    id: {
      type: Number,
      required: true
    }
  },
  // data(){
  //   return{
  //     localValor: this.value
  //   }
  // },
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
