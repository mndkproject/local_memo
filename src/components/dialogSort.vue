<template>
  <div>
    <v-ons-toolbar-button @click="sortDialogVisible = true">
      <i class="zmdi zmdi-sort-asc"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="sortDialogVisible" cancelable>
      <span slot="title">並べ替え</span>
      <v-ons-list>
        <v-ons-list-item v-for="(item, $index) in sorts" :key="item.sort" tappable>
          <label class="left">
            <v-ons-radio :input-id="'sort-' + $index" :value="item.sort" v-model="selectedSort"></v-ons-radio>
          </label>
          <label :for="'sort-' + $index" class="center">{{ item.name }}</label>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="sortDialogVisible = false;">Cancel</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="selectSort">Ok</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortDialogVisible: false,
      sorts: [
        { sort: "create_at,desc", name: "作成日時新しい順" },
        { sort: "create_at,asc", name: "作成日時古い順" },
        { sort: "updated_at,desc", name: "更新日時新しい順" },
        { sort: "updated_at,asc", name: "更新日時古い順" },
        { sort: "content,asc", name: "五十音昇順" },
        { sort: "content,desc", name: "五十音降順" }
      ],
      selectedSort: "create_at,desc"
    };
  },
  mounted() {
    this.selectedSort = this.$store.getters.memoSortArr;
  },
  watch: {
    sortDialogVisible() {
      if (!this.sortDialogVisible) {
        this.selectedSort = this.$store.getters.memoSortArr;
      }
    }
  },
  methods: {
    selectSort() {
      var sendSortArr = this.selectedSort.split(",");
      this.$store.dispatch("sortCheck", {
        key: sendSortArr[0],
        order: sendSortArr[1]
      });
      this.sortDialogVisible = false;
    }
  }
};
</script>