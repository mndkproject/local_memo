<template>
  <div>
    <v-ons-toolbar-button @click="sortDialogVisible = true">
      <i class="zmdi zmdi-sort-asc"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog modifier="rowfooter" :visible.sync="sortDialogVisible" cancelable>
      <span slot="title">{{ lang.sortTtl }}</span>
      <v-ons-list>
        <v-ons-list-item
          v-for="(item, $index) in sorts"
          :key="item.sort"
          tappable
          modifier="sort-list"
        >
          <label class="left">
            <v-ons-radio :input-id="'sort-' + $index" :value="item.sort" v-model="selectedSort"></v-ons-radio>
          </label>
          <label :for="'sort-' + $index" class="center">{{ item.name }}</label>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="sortDialogVisible = false;">{{ lang.cancel }}</v-ons-alert-dialog-button>
        <v-ons-alert-dialog-button @click="selectSort">{{ lang.ok }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.list-item--sort-list__center,
.list-item--sort-list__left {
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      sortDialogVisible: false,
      selectedSort: "create_at,desc"
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    sorts() {
      return [
        { sort: "updated_at,desc", name: this.lang.sortUpdateDesc },
        { sort: "updated_at,asc", name: this.lang.sortUpdateAsc },
        { sort: "create_at,desc", name: this.lang.sortCreateDesc },
        { sort: "create_at,asc", name: this.lang.sortCreateAsc },
        { sort: "content,asc", name: this.lang.sortNameDesc },
        { sort: "content,desc", name: this.lang.sortNameAsc }
      ];
    }
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