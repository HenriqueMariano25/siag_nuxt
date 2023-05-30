<template>
  <div>
    <BaseDialog
      titulo="Alterar candidato"
      @cancelar="cancelar()">
        <template v-slot:corpo>
          <div class="px2">
            <div></div>
          </div>
        </template>
    </BaseDialog>
  </div>
</template>

<script>
import BaseDialog from "~/components/Shared/BaseDialog.vue";

export default {
  components: {
    BaseDialog
  },
  props: {
    cards: {
      type: [Array],
    }
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    }
  }
};
</script>

<style scoped>

</style>
<script setup>
import AppFormInput from "~/components/Ui/AppFormInput.vue";
</script>
