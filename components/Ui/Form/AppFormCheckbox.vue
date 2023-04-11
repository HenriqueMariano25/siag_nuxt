<template>
  <label class="flex flex-row items-center gap-1" :for="'inputCheckbox' + valor">
    <input class="cursor-pointer mr-2" type="checkbox" :id="'inputCheckbox' + valor" :value="valor" v-model="model"
           @click.stop>
    {{ label }}
  </label>
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
    value: [Boolean, Array, String],
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
        console.log(value)
        this.$emit("input", value);
      },
    },
  },
  methods:{
    click(){
      console.log("aqui")
      this.$emit('click')
    }
  }
}
</script>

<style scoped>

input[type="checkbox"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  margin: 0;
}

input[type="checkbox"] {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.30em;
  height: 1.30em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em #061733;
  transform-origin: bottom left;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

input[type="checkbox"]:focus {
  outline: max(2px, 0.15em) solid currentColor;
  outline-offset: max(2px, 0.15em);
}

input[type="checkbox"]:hover {
  background-color: rgb(200,200,200);
}

input[type="checkbox"]:disabled {
  --form-control-color: #545458;

  color: #545458;
  cursor: not-allowed;
}

</style>
