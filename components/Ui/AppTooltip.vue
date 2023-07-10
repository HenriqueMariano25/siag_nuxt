<template>
  <div class="relative geral" >
    <div class="corpo flex items-center" :class="{'hover:bg-gray-200 rounded-xl p-0.5':fundo}">
      <slot name="corpo">

      </slot>
    </div>
    <div class="bg-gray-900/90 absolute flex p-2 rounded text-white tooltip " :class="{ [largura]: largura, [posicao]: posicao }" style="z-index: 105">
      <slot name="tooltip">

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    largura: {
      type: [String],
    },
    posicao:{
      type: [String],
      default: 'left-0'
    },
    fundo: {
      type: [Boolean],
      default: false
    }
  }
}
</script>

<style scoped>
.geral{
  //z-index: 105;
}

.tooltip{
  visibility: hidden;
}

.geral:hover .tooltip{
  visibility: visible;
}


</style>
