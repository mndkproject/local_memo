<template>
  <div>
    <v-ons-toolbar-button @click="filterDialogVisible = true" :style="{color:iconColor}">
      <i class="zmdi zmdi-filter-list"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="filterDialogVisible" cancelable>
      <span slot="title">Filter Color</span>
      <ul class="color-list">
        <li class="color-list__item" v-for="item in labelColors" :key="item">
          <v-ons-button
            class="color-list__btn"
            :style="{ background: item }"
            @click="selectFilter(item)"
          ></v-ons-button>
        </li>
        <v-ons-alert-dialog-button @click="removeFilter">Filter Remove</v-ons-alert-dialog-button>
      </ul>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="filterDialogVisible = false;">Cancel</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterDialogVisible: false,
      selectedFilter: ""
    };
  },
  computed: {
    labelColors() {
      return this.$store.state.labelColors;
    },
    iconColor() {
      return this.$store.state.memoData.filterColor !== ""
        ? "#e91e63"
        : "#0076ff";
    }
  },
  mounted() {
    this.selectedFilter = this.$store.state.memoData.filterColor;
  },
  methods: {
    selectFilter(color) {
      this.$store.dispatch("filterCheck", color);
      this.filterDialogVisible = false;
    },
    removeFilter() {
      this.$store.dispatch("filterRemoveCheck");
      this.filterDialogVisible = false;
    }
  }
};
</script>