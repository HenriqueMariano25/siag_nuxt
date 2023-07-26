<template>
  <div class="flex flex-col">
    <label for="selectPersonalizado" class="ml-1.5 text-sm mb-0.5" :class="{ 'text-red-600': invalido }">
      {{ label }}
      <span v-if="obrigatorio" class="text-red-700">*</span>
    </label>
    <select name="selectPersonalizado" id="selectPersonalizado"
            :disabled="disabled"
            v-model="model"
            @change="$emit('change', $event.target.value)"
            class="h-9 border rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-gray-300"
            :class="{
                'bg-red-100 border-red-400 focus:ring-red-300': invalido,
                'bg-white border-gray-400 focus:ring-gray-300' : !invalido,
                '!bg-gray-200 cursor-not-allowed': disabled || readonly
              }"
           >
      <option :value="null" disabled selected>Selecione</option>
      <option
        v-for="option in options"
        :key="option.id"
        :value="retornarObjeto ? option : option.id"
        :selected="value === option.id"
      >
        {{ option.nome }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "AppFormSelect",
  props: {
    label: String,
    value: {
      type: [String, Number, Object, Boolean],
      default: undefined,
    },
    options: {
      type: Array,
      default: () => [],
    },
    invalido: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      required: true
    },
    retornarObjeto:{
      type: Boolean,
      default: false
    },
    obrigatorio: {
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
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
