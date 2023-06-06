<template>
  <div class="w-full flex-col">
    <div class="h-10 w-full flex flex-col text-black print:hidden">
      <div class="w-full flex divide-x divide-gray-700 bg-blue-100 ">
        <template v-for="tab of tabs">
          <button
            :key="tab.valor"
            class="hover:bg-blue-200 py-1.5 w-full text-center text-[0.9rem] "
            :class="{
							'!bg-blue-300 border-b-4 !border-blue-700': tabAtual === tab.valor,
							'!bg-gray-300 text-gray-600 !cursor-not-allowed': tab.disabled === true,
						}"
            @click="tab.disabled !== true ? (tabAtual = tab.valor) : null; $emit('tab', tabAtual)">
            <span class="text-center">{{ tab.nome.toUpperCase() }}</span>
          </button>
        </template>
      </div>
    </div>
    <div
      class=""
      v-for="tab of tabs">
      <slot :name="'tab.' + tab.valor" v-if="tabAtual === tab.valor" ></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppTabs",
  props: {
    tabs: {
      type: [Array],
      required: true,
    },
  },
  mounted() {
    this.tabAtual = this.tabs[0].valor
    this.$emit("tab", this.tabAtual)
  },
  data() {
    return {
      tabAtual: null,
    }
  },
}
</script>

<style scoped></style>
