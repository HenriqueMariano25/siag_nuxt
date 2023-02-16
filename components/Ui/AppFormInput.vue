<template>
  <div class="flex flex-col text-gray-800 relative">
    <label for="inputPersonalizado" class="ml-1.5 text-xs font-medium mb-0.5">{{ label }}</label>
    <div class="w-full flex items-center">
      <input
        id="inputPersonalizado"
        name="inputPersonalizado"
        :placeholder="placeholder"
        :type="type"
        :value="value"
        v-on="inputListeners"
        class="h-9 w-full border border-gray-400 rounded-sm px-2 py-1 focus:border-grey-800 focus:outline-none focus:ring focus:ring-gray-300"
        :class="{'pr-10': limparCampo }"
      />
      <div class="absolute right-1 flex" v-if="limparCampo">
        <button class="hover:bg-gray-300 p-1 rounded-full text-gray-500 " @click="limpar()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor"
               class="w-6 h-6 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFormInput",
  props: {
    value: {
      type: [String, Number],
      default: undefined,
    },
    label: String,
    placeholder: String,
    type: {
      type: String,
      required: true,
    },
    limparCampo: {
      type: Boolean,
      default: false,
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
          vm.$emit('input', event.target.value);
        },
      };
    },
  },
  methods: {
    limpar() {
        this.$emit('limpar');
    }
  },
  watch: {
    value(value) {
      this.localValue = value;
    },
  },
};
</script>

<style scoped></style>
