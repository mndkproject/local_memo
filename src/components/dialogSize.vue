<template>
  <div>
    <v-ons-toolbar-button @click="alertDialogVisible = true">
      <i class="zmdi zmdi-more-vert"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="alertDialogVisible" cancelable>
      <span slot="title">フォントサイズ変更</span>
      <v-ons-list>
        <v-ons-list-item v-for="(item, $index) in sizes" :key="item.name" tappable>
          <label class="left">
            <v-ons-radio :input-id="'radio-' + $index" :value="item.size" v-model="selectedSize"></v-ons-radio>
          </label>
          <label :for="'radio-' + $index" class="center">{{ item.name }}</label>
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
        <v-ons-alert-dialog-button @click="canselSize">Cancel</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="sendSize">Ok</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  props: ["changeSize", "postFontSize"],
  data() {
    return {
      alertDialogVisible: false,
      sizes: [
        { size: "3", name: "特大（3）" },
        { size: "1.5", name: "大（1.5）" },
        { size: "1", name: "標準（1）" },
        { size: "0.8", name: "小（0.8）" }
      ],
      selectedSize: localStorage.size ? localStorage.size : this.postFontSize
    };
  },
  methods: {
    sendSize() {
      this.changeSize(this.selectedSize);
      this.alertDialogVisible = false;
    },
    canselSize() {
      this.selectedSize = this.postFontSize;
      this.alertDialogVisible = false;
    }
  }
};
</script>