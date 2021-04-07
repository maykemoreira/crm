<template>
  <v-sheet class="mx-auto" max-width="900">
    <v-slide-group class=light
      show-arrows
      mandatory
      center-active
      v-model="indexItem"
      >
      <v-slide-item
        v-for="item in itemLista"
        :key="item.id"
        v-slot="{ active, toggle }"
      >
        <v-btn
          class="mx-2"
          :input-value="active"
          active-class="blue white--text"
          depressed
          rounded
          @click="toggle"
        >
          {{ item[parametroExibir] }}
        </v-btn>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
export default {
  props: {
    itemLista: Array,
    itemSelecionado: Number,
    parametroExibir: String
  },
  created () {
    this.selecionarItemInicial()
  },
  watch: {
    indexItem () {
      this.$emit('alterouItem', this.itemLista[this.indexItem])
    }
  },
  data: () => ({
    indexItem: null
  }),
  methods: {
    selecionarItemInicial () {
      this.indexItem = this.itemLista.findIndex(item => {
        return this.itemSelecionado === item.id
      })
    }
  }
}
</script>
<style>

.no-transition { transition: none; }

</style>
