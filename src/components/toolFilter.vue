<template>
  <div>
    <v-ons-toolbar-button @click="filterDialogVisible = true" :class="filterActive">
      <i class="zmdi zmdi-filter-list"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="filterDialogVisible" cancelable>
      <span slot="title">{{ lang.filterTtl }}</span>
      <ul class="color-list">
        <li class="color-list__item" v-for="item in labelColors" :key="item">
          <v-ons-button
            class="color-list__btn"
            :style="{ background: item }"
            @click="selectFilter(item)"
          ></v-ons-button>
        </li>
        <v-ons-button
          modifier="large"
          style="margin: 1em 0 0"
          @click="selectFilter('')"
        >{{ lang.filterRemove }}</v-ons-button>
      </ul>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="filterDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.color-list__btn {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      filterDialogVisible: false,
      selectedFilter: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    labelColors() {
      return this.$store.state.labelColors;
    },
    filterActive() {
      return this.$store.state.memoData.filterColor !== ""
        ? "filter-active"
        : "";
    }
  },
  mounted() {
    this.selectedFilter = this.$store.state.memoData.filterColor;
  },
  methods: {
    selectFilter(color) {
      this.$store.dispatch("filterCheck", color);
      this.filterDialogVisible = false;
    }
  }
};
</script>