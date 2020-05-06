<template>
  <v-ons-page @show="show">
    <custom-toolbar
      :change-size="changeSize"
      :post-font-size="postFontSize"
      :sort-btn="sortBtn"
      :change-sort="changeSort"
      :post-sort="postSort"
    >一覧</custom-toolbar>
    <div class="content">
      <v-ons-gesture-detector>
        <v-ons-list id="memo-list">
          <v-ons-list-item
            modifier="memo longdivider"
            tappable
            v-for="(item, index) in myList"
            :key="index"
            @click="pagePush(index)"
            @hold="menuDialog(index)"
            :style="{ fontSize: postFontSize + 'rem', borderColor: item.label }"
          >
            <span class="list-item__title">{{ item.content.slice(0,24) }}</span>
            <span class="list-item__subtitle">{{ item.updated_at }}</span>
          </v-ons-list-item>
        </v-ons-list>
      </v-ons-gesture-detector>

      <v-ons-dialog cancelable :visible.sync="dialogVisible">
        <p style="text-align: center">Label</p>
        <ul class="color-list">
          <li class="color-list__item" v-for="item in colors" :key="item">
            <v-ons-button
              class="color-list__btn"
              :style="{ background: item }"
              @click="label(selectNum, item)"
            ></v-ons-button>
          </li>
        </ul>
        <p style="text-align: center; padding-top: 1em;">Delete</p>
        <p style="text-align: center">
          <v-ons-icon
            icon="ion-ios-trash, material:md-delete"
            size="32px"
            @click="deleteDialog(selectNum)"
          ></v-ons-icon>
        </p>
      </v-ons-dialog>
    </div>
    <v-ons-fab modifier="memo" class="add-btn" position="bottom right" @click="pagePush(-1)">
      <v-ons-icon icon="md-plus"></v-ons-icon>
    </v-ons-fab>
  </v-ons-page>
</template>

<style>
#memo-list .list-item--memo {
  background-color: #fafafa;
  word-break: break-all;
  border-left: 10px solid #fafafa;
  box-sizing: border-box;
}

.list-item__subtitle {
  text-align: right;
  color: #8a949b;
}

.color-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}

.color-list__item {
  width: 20%;
  margin: 5px;
}

.color-list__item .button {
  width: 100%;
  height: 32px;
  line-height: 32px;
}
</style>

<script>
import customToolbar from "./CustomToolbar";
import page2 from "./Page2";

export default {
  data() {
    return {
      dialogVisible: false,
      selectNum: "",
      colors: [
        "#fafafa",
        "#e91e63",
        "#ff5722",
        "#ffeb3b",
        "#8bc34a",
        "#03a9f4",
        "#673ab7"
      ],
      sortBtn: true
    };
  },
  methods: {
    menuDialog(index) {
      this.selectNum = index;
      this.dialogVisible = true;
    },
    label(index, color) {
      this.$emit("change-data", ["label", [index, color]]);
      this.selectNum = "";
      this.dialogVisible = false;
    },
    deleteDialog(index) {
      this.$ons.notification
        .confirm("削除してよろしいですか？", {
          title: "削除",
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$emit("change-data", ["delete", index]);
          }
        });
      this.selectNum = "";
      this.dialogVisible = false;
    },
    pop() {
      this.pageStack.pop();
    },
    pagePush(index) {
      if (index === -1) {
        this.$emit("change-data", ["add", Object.keys(this.myList).length]);
        index = Object.keys(this.myList).length - 1;
      }
      this.$emit("change-data", ["select", index]);
      this.pageStack.push(page2);
    },
    show() {
      if (
        this.currentData !== "" &&
        this.myList[this.currentData].content === ""
      ) {
        this.$emit("change-data", ["delete", this.currentData]);
      }
    }
  },
  props: [
    "pageStack",
    "myList",
    "currentData",
    "changeSize",
    "postFontSize",
    "changeSort",
    "postSort"
  ],
  components: { customToolbar },
  key: "key_page1"
};
</script>