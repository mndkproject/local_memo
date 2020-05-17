<template>
  <div class="side-item">
    <div class="side-item__btn" @click="themeDialogVisible = true">
      <i class="zmdi zmdi-brightness-6"></i>
      {{ lang.theme }}
    </div>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="themeDialogVisible" cancelable>
      <span slot="title">{{ lang.theme }}</span>
      <v-ons-list>
        <v-ons-list-item
          v-for="(item, $index) in themes"
          :key="item"
          tappable
          modifier="theme-list"
        >
          <label class="left">
            <v-ons-radio :input-id="'theme-' + $index" :value="item" v-model="selectedTheme"></v-ons-radio>
          </label>
          <label :for="'theme-' + $index" class="center">
            <div class="pallete-box" :class="item">
              <div class="pallete-background pallete-col4"></div>
              <div class="pallete-base pallete-col4"></div>
              <div class="pallete-text pallete-col2"></div>
              <div class="pallete-weak pallete-col2"></div>
              <div class="pallete-strong"></div>
              <div class="pallete-point"></div>
            </div>
          </label>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="themeDialogVisible = false">{{ lang.close }}</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="selectTheme">{{ lang.ok }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.pallete-box {
  display: flex;
  width: 100%;
}

.pallete-box div {
  flex-grow: 1;
  height: 44px;
}

.pallete-box .pallete-col2 {
  flex-grow: 2;
}

.pallete-box .pallete-col4 {
  flex-grow: 4;
}
</style>

<script>
export default {
  data() {
    return {
      themeDialogVisible: false,
      themes: [
        "default",
        "theme1",
        "theme2",
        "theme3",
        "theme4",
        "theme5",
        "theme6",
        "theme7",
        "theme8",
        "theme9",
        "theme10",
        "theme11",
        "theme12",
        "theme13",
        "theme14",
        "theme15",
        "theme16",
        "theme17"
      ],
      selectedTheme: "default"
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    currentSelectTheme() {
      return this.$store.state.memoData.themeColor
        ? this.$store.state.memoData.themeColor
        : "default";
    }
  },
  mounted() {
    this.selectedTheme =
      this.currentSelectTheme !== "" ? this.currentSelectTheme : "default";
  },
  watch: {
    themeDialogVisible() {
      if (!this.themeDialogVisible) {
        this.selectedTheme = this.$store.state.memoData.themeColor;
      }
    }
  },
  methods: {
    selectTheme() {
      this.$store.dispatch("themeCheck", this.selectedTheme);
      document.body.classList.remove("darkmode");
      document.body.classList.remove(...this.themes);
      document.body.classList.toggle(this.selectedTheme);
      this.themeDialogVisible = false;
    }
  }
};
</script>