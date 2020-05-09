<template>
  <div>
    <v-ons-toolbar-button @click="infoDialogVisible = true">
      <i class="zmdi zmdi-info"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="infoDialogVisible" cancelable>
      <span slot="title">Info</span>
      <v-ons-list style="height: 50vh; overflow-y: scroll;">
        <v-ons-list-header>作成日時</v-ons-list-header>
        <v-ons-list-item>{{ currentMemo.create_at }}</v-ons-list-item>
        <v-ons-list-header>更新日時</v-ons-list-header>
        <v-ons-list-item>{{ currentMemo.updated_at }}</v-ons-list-item>
        <v-ons-list-header>文字数（Byte数）</v-ons-list-header>
        <v-ons-list-item>{{ chars }} chars（{{ bytes }} bytes）</v-ons-list-item>
        <v-ons-list-header>行数</v-ons-list-header>
        <v-ons-list-item>{{ lines }} lines</v-ons-list-item>
        <v-ons-list-header>原稿用紙換算枚数</v-ons-list-header>
        <v-ons-list-item>{{ sheets }} sheets</v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="infoDialogVisible = false;">Cancel</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoDialogVisible: false
    };
  },
  computed: {
    currentMemo() {
      return this.$store.state.memoData.memoList[
        this.$store.getters.currentIndex
      ];
    },
    chars() {
      return String(this.currentMemo.content.length);
    },
    bytes() {
      return encodeURIComponent(this.currentMemo.content).replace(/%../g, "x")
        .length;
    },
    lines() {
      return this.currentMemo.content.split("\n").length;
    },
    sheets() {
      var lines = this.currentMemo.content.split("\n");
      var count = 0;
      lines.forEach(line => {
        if (line.length === 0) {
          count += 1;
        } else {
          line = line.slice(-1) === ("。" || ".") ? line.slice(0, -1) : line;
          count += ((line.length / 20) | 0) + (line.length % 20 > 0 ? 1 : 0);
        }
      });
      return ((count / 20) | 0) + 1;
    }
  }
};
</script>