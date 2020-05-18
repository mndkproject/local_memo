<template>
  <div>
    <v-ons-toolbar-button @click="labelDialogVisible = true">
      <i class="zmdi zmdi-label"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="labelDialogVisible" cancelable>
      <span slot="title">{{ lang.label }}</span>
      <ul class="color-list">
        <li class="color-list__item" v-for="item in labelColors" :key="item">
          <v-ons-button
            class="color-list__btn"
            :style="{ background: item }"
            @click="selectLabel(item)"
          ></v-ons-button>
        </li>
      </ul>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="labelDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelDialogVisible: false,
      selectedLabel: "transparent"
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    labelColors() {
      return this.$store.state.labelColors;
    }
  },
  mounted() {
    this.selectedLabel = this.$store.state.memoData.memoList[
      this.$store.getters.currentIndex
    ].labelColor;
  },
  methods: {
    selectLabel(color) {
      this.$store.dispatch("labelCheck", {
        id: this.$store.state.currentId,
        color: color
      });
      this.labelDialogVisible = false;
    }
  }
};
</script>