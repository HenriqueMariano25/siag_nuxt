<template>
  <div class="ml-2">
    <span :class="{'text-red-600':invalido}">
      <strong>
        {{ titulo }}<span v-if="obrigatorio" class="text-red-600 text-sm">*</span>
      </strong>
    </span>
    <div v-for="item in itens" v-if="itens.length > 0 && !simNao">
      <label class="flex flex-row items-center gap-1" :for="'inputRadio' + item.valor">
        <input class="cursor-pointer mr-2" type="radio" :id="'inputRadio' + item.valor" :value="item.valor" v-model="model"
               @click.stop>
        {{ item.label }}
      </label>

<!--      <input type="radio" :id="'radio-'+item.valor" :value="item.valor" v-model="model" :disabled="item.disabled || disabled" >-->
<!--      <label :for="'radio-'+item.valor">-->
<!--        <span :class="{-->
<!--            'text-red-500 font-bold':invalido-->
<!--            }">-->
<!--           {{ item.label }}-->
<!--          </span>-->
<!--      </label>-->
    </div>
    <div v-if="simNao">
      <div>
        <label class="flex flex-row items-center gap-1" :for="'radio-sim' + id">
          <input class="cursor-pointer mr-2" type="radio" :id="'radio-sim' + id" :value="true"
                 v-model="model"
                 @click.stop>
          <span :class="{
            'text-red-500 font-bold':invalido
            }">
            Sim
          </span>
        </label>
      </div>
      <div>
        <label class="flex flex-row items-center gap-1" :for="'radio-nao' + id">
          <input class="cursor-pointer mr-2" type="radio" :id="'radio-nao' + id" :value="false"
                 v-model="model"
                 @click.stop>
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
  props: {
    itens: {
      type: Array,
      default: () => []
    },
    titulo: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
    },
    obrigatorio: {
      type: Boolean,
      default: false
    },
    simNao: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
      required: true
    },
    invalido: {
      type: Boolean,
      default: false
    },
    disabled: {
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
  data() {
    return {
      localValor: this.value
    }
  },
  watch: {
    localValor(val) {
      this.localValue = val;
      this.$emit("change", val)
    },
    value(val) {
      this.localValue = val;
      this.$emit("change", val)
    },
  },
}
</script>

<style scoped>
input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  margin: 0;
}

input[type="radio"] {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.35em;
  height: 1.35em;
  border: 0.15em solid currentColor;
  border-radius: 100%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type="radio"]::before {
  content: "";
  width: 0.80em;
  height: 0.80em;
  transform: scale(0);
  border-radius: 100%;
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em #09234f;
  transform-origin: bottom left;
}

input[type="radio"]:checked::before {
  transform: scale(1);
}

input[type="radio"]:focus {
  outline: max(2px, 0.15em) solid currentColor;
  outline-offset: max(2px, 0.15em);
}

input[type="radio"]:hover {
  background-color: rgb(200, 200, 200);
}

input[type="radio"]:disabled {
  --form-control-color: #545458;
  color: #545458;
  cursor: not-allowed;
}


</style>
