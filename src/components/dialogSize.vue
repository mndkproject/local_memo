<template>
  <div>
    <v-ons-toolbar-button @click="sizeDialogVisible = true">
      <i class="zmdi zmdi-format-size"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="sizeDialogVisible" cancelable>
      <span slot="title">フォントサイズ変更</span>
      <v-ons-list>
        <v-ons-list-item v-for="(item, $index) in sizes" :key="item.name" tappable>
          <label class="left">
            <v-ons-radio
              :input-id="'radio-' + $index+pageNum"
              :value="item.size"
              v-model="selectedSize"
            ></v-ons-radio>
          </label>
          <label :for="'radio-' + $index+pageNum" class="center">{{ item.name }}</label>
        </v-ons-list-item>
      </v-ons-list>

      <v-ons-row style="margin-top: 1em;">
        <v-ons-col width="40px" style="text-align: center; line-height: 31px;">小</v-ons-col>
        <v-ons-col>
          <v-ons-range min="0.3" max="8" step="0.1" v-model="selectedSize" style="width: 100%;"></v-ons-range>
        </v-ons-col>
        <v-ons-col width="40px" style="text-align: center; line-height: 31px;">大</v-ons-col>
      </v-ons-row>
      <p style="text-align: center;">フォントサイズ: {{ selectedSize }}</p>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="sizeDialogVisible = false;">Cancel</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="selectSize">Ok</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sizeDialogVisible: false,
      sizes: [
        { size: "3", name: "特大（3）" },
        { size: "1.5", name: "大（1.5）" },
        { size: "1", name: "標準（1）" },
        { size: "0.8", name: "小（0.8）" }
      ],
      selectedSize: "1",
      pageNum: this.page.key
    };
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