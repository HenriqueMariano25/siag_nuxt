<template>
  <div class="flex flex-col relative">
      <label :for="'inputPersonalizado'+id" class="ml-1.5 text-xs font-medium mb-0.5">{{ label }}<span
        v-if="obrigatorio" class="text-red-700">*</span>
      </label>
    <div>
      <textarea
        :id="'inputPersonalizado'+id"
        :name="'inputPersonalizado'+id"
        :rows="linhas"
        :placeholder="placeholder"
        class="w-full border rounded-sm px-2 py-1 focus:border-grey-800 focus:outline-none bg-white border-gray-400 focus:ring-gray-300'"
        :class="{'!bg-red-100 !border-red-400 !focus:ring-red-300': invalido,}"
        :value="value"
        v-on="inputListeners"
      >
      </textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFormTextarea",
  props: {
    value: {
      type: [String, Number],
      default: undefined,
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    obrigatorio: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true,
      default: ""
    },
    invalido: {
      type: Boolean,
      default: false
    },
    linhas: {
      type: [Number, String],
      default: 3
    }
  },
  data() {
    return {
      localValue: this.value,
    };
  },
  computed: {
    inputListeners() {
      const vm = this;
      return {
        ...this.$listeners,
        input(event) {

          vm.$emit('input',event.target.value);
        },
      };
    },
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
