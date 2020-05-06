<template>
  <v-ons-navigator :page-stack="pageStack">
    <component
      :is="page"
      v-for="page in pageStack"
      :key="page.key"
      :page-stack="pageStack"
      :my-list="myList"
      :current-data="currentData"
      @change-data="changeData"
      :change-size="changeSize"
      :post-font-size="postFontSize"
      :change-sort="changeSort"
      :post-sort="postSort"
    ></component>
  </v-ons-navigator>
</template>

<script>
import _ from "lodash";
import page1 from "./components/Page1";

export default {
  data() {
    return {
      pageStack: [page1],
      myList: [],
      currentData: "",
      postFontSize: "1",
      postSort: "updated_at,desc"
    };
  },
  mounted() {
    if (localStorage.memo) {
      this.myList = JSON.parse(localStorage.memo);
    }
    if (localStorage.sort) {
      this.postSort = localStorage.sort;
    }
    if (localStorage.size) {
      this.postFontSize = localStorage.size;
    }
  },
  methods: {
    changeData(arr) {
      switch (arr[0]) {
        case "select":
          this.selectData(arr[1]);
          break;
        case "add":
          this.addData(arr[1]);
          break;
        case "label":
          this.labelData(arr[1]);
          break;
        case "delete":
          this.deleteData(arr[1]);
          break;
        default:
          console.log("error");
      }
    },
    selectData(e) {
      this.currentData = e;
    },
    addData(e) {
      this.myList.push({
        content: "",
        create_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        label: "#fafafa"
      });
      this.$set(this.myList, e, {
        content: "",
        create_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        label: "#fafafa"
      });
    },
    labelData(e) {
      var num = e[0],
        color = e[1];
      this.$set(this.myList[num], "label", color);
      this.$set(this.myList[num], "updated_at", new Date().toLocaleString());
    },
    deleteData(e) {
      this.myList.splice(e, 1);
    },
    changeSize(e) {
      this.postFontSize = e;
      localStorage.size = e;
    },
    changeSort(e) {
      var targetArr = e.split(",");
      this.myList = _.orderBy(this.myList, targetArr[0], targetArr[1]);
      localStorage.sort = e;
    }
  },
  watch: {
    myList: {
      handler(newData) {
        localStorage.memo = JSON.stringify(newData);
      },
      deep: true
    }
  }
};
</script>