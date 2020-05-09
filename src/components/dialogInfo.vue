<template>
  <div>
    <v-ons-toolbar-button @click="infoDialogVisible = true">
      <i class="zmdi zmdi-info"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="infoDialogVisible" cancelable>
      <span slot="title">Info</span>
      <v-ons-list>
        <v-ons-list-header>作成日時</v-ons-list-header>
        <v-ons-list-item>{{ currentMemo.create_at }}</v-ons-list-item>
        <v-ons-list-header>更新日時</v-ons-list-header>
        <v-ons-list-item>{{ currentMemo.updated_at }}</v-ons-list-item>
        <v-ons-list-header>文字数（Byte数）</v-ons-list-header>
        <v-ons-list-item>{{ String(this.currentMemo.content.length) }}（{{ encodeURIComponent(currentMemo.content).replace(/%../g,"x").length }}）</v-ons-list-item>
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
    }
  }
};
</script>