<template>
  <div class="flex flex-col">
    <label for="selectPersonalizado" class="ml-1.5 text-xs font-medium mb-0.5">{{ label }}</label>
    <select name="selectPersonalizado" id="selectPersonalizado" @change="onChange"
            class="h-9 border rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-gray-300"
            :class="{
                'bg-red-100 border-red-400 focus:ring-red-300': invalido,
                'bg-white border-gray-400 focus:ring-gray-300' : !invalido,
              }"
            :value="localValue">
      <option value="" disabled selected>Selecione</option>
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
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
    }
  },
  data() {
    return {
      localValue: this.value,
    };
  },

  methods: {
    onChange($evt) {
      this.localValue = $evt.target.value
      this.$emit('change', $evt.target.value);
    }
  },
  watch: {
    value(value) {
      this.localValue = value;
    },
  },
}
</script>

<style scoped>

</style>
