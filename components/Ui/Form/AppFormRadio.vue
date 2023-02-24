<template>
  <div class="ml-2">
    <span :class="{'text-red-600':invalido}">
      <strong>
        {{ titulo }}<span v-if="obrigatorio" class="text-red-600 text-sm">*</span>
      </strong>
    </span>
    <div v-for="item in itens" v-if="itens.length > 0 && !simNao">
      <input type="radio" :id="'radio-'+item.valor" :value="item.valor" v-model="localValor">
      <label :for="'radio-'+item.valor">
        <span :class="{
            'text-red-500 font-bold':invalido
            }">
           {{ item.label }}
          </span>
      </label>
    </div>
    <div v-if="simNao">
      <div>
        <input type="radio" :id="'radio-sim'+id" :value="true" v-model="localValor">
        <label :for="'radio-sim'+id">
          <span :class="{
            'text-red-500 font-bold':invalido
            }">
            Sim
          </span>
        </label>
      </div>
      <div>
        <input type="radio" :id="'radio-nao'+id" :value="false" v-model="localValor">
        <label :for="'radio-nao'+id">
          <span :class="{
            'text-red-500 font-bold':invalido
            }">
            Não
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFormRadio",
  props:{
    itens: {
      type: Array,
      default: () => []
    },
    titulo: {
      type: String,
      required: true
    },
    value:{
      type: [String, Number, Boolean],
    },
    obrigatorio:{
      type: Boolean,
      default: false
    },
    simNao: {
      type: Boolean,
      default: false
    },
    id:{
      type: String,
      default: ''
    },
    invalido: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return{
      localValor: this.value
    }
  },
  watch: {
    localValor(val) {
      this.localValue = val;
      this.$emit("change", val)
    },
    value(val){
      this.localValue = val;
      this.$emit("change", val)
    },
  },
}
</script>

<style scoped>

</style>
