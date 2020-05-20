<template>
  <div>
    <v-ons-toolbar-button @click="sizeDialogVisible = true">
      <i class="zmdi zmdi-format-size"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="sizeDialogVisible" cancelable>
      <span slot="title">{{ lang.fontSize }}</span>
      <v-ons-list>
        <v-ons-list-item
          v-for="(item, $index) in sizes"
          :key="item.name"
          tappable
          modifier="size-list"
        >
          <label class="left">
            <v-ons-radio
              :input-id="'size-' + $index+pageNum"
              :value="item.size"
              v-model="selectedSize"
            ></v-ons-radio>
          </label>
          <label :for="'size-' + $index+pageNum" class="center">{{ item.name }}</label>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="sizeDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="selectSize">Ok</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.list-item--size-list__center,
.list-item--size-list__left {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      sizeDialogVisible: false,
      sizes: [
        { size: "0.5", name: "50%" },
        { size: "0.8", name: "80%" },
        { size: "1", name: "100%(default)" },
        { size: "1.2", name: "120%" },
        { size: "1.5", name: "150%" },
        { size: "1.8", name: "180%" },
        { size: "2.4", name: "240%" },
        { size: "3", name: "300%" }
      ],
      selectedSize: "1",
      pageNum: this.page.key
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    }
  },
  mounted() {
    this.selectedSize = this.$store.state.memoData.fontSize;
  },
  watch: {
    sizeDialogVisible() {
      if (!this.sizeDialogVisible) {
        this.selectedSize = this.$store.state.memoData.fontSize;
      }
    }
  },
  methods: {
    selectSize() {
      this.$store.dispatch("sizeCheck", this.selectedSize);
      this.sizeDialogVisible = false;
    }
  },
  props: ["page"]
};
</script>