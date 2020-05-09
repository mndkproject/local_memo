<template>
  <v-ons-page @show="show">
    <custom-toolbar
      :sort-btn="sortBtn"
      :filter-btn="filterBtn"
      :search-btn="searchBtn"
      :page-stack="pageStack"
      :page="page"
    ></custom-toolbar>
    <div class="content">
      <v-ons-gesture-detector>
        <div class="memo-wrap">
          <v-ons-list id="memo-list">
            <v-ons-list-item
              modifier="memo longdivider"
              tappable
              v-for="(item, index) in memoList"
              :key="index"
              @click="pagePush(item.id)"
              @hold="menuDialog(item.id)"
              :style="{ fontSize: fontSize + 'rem', borderColor: item.labelColor }"
            >
              <span class="list-item__title">{{ item.content.slice(0,24) }}</span>
              <span
                v-if="memoSortKey === 'updated_at'"
                class="list-item__subtitle"
              >{{ item.updated_at }}更新</span>
              <span
                v-else-if="memoSortKey === 'create_at'"
                class="list-item__subtitle"
              >{{ item.create_at }}作成</span>
              <span v-else class="list-item__subtitle">{{ item.updated_at }}更新</span>
            </v-ons-list-item>
          </v-ons-list>
          <p v-if="emptyFlag" style="text-align: center;">該当するアイテムがありません。</p>
        </div>
      </v-ons-gesture-detector>

      <v-ons-dialog cancelable :visible.sync="dialogVisible">
        <p style="text-align: center">Label</p>
        <ul class="color-list">
          <li class="color-list__item" v-for="item in labelColors" :key="item">
            <v-ons-button
              class="color-list__btn"
              :style="{ background: item }"
              @click="selectLabel(item)"
            ></v-ons-button>
          </li>
        </ul>
        <p style="text-align: center; padding-top: 1em;">Delete</p>
        <p style="text-align: center">
          <v-ons-icon icon="ion-ios-trash, material:md-delete" size="32px" @click="deleteDialog"></v-ons-icon>
        </p>
      </v-ons-dialog>
    </div>
    <v-ons-fab modifier="memo" class="add-btn" position="bottom right" @click="pagePush(-1)">
      <v-ons-icon icon="md-plus"></v-ons-icon>
    </v-ons-fab>
  </v-ons-page>
</template>

<style>
.memo-wrap {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

#memo-list {
  width: 100%;
}

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
      sortBtn: true,
      filterBtn: true,
      searchBtn: true
    };
  },
  computed: {
    memoList() {
      return this.$store.getters.sortedList;
    },
    labelColors() {
      return this.$store.state.labelColors;
    },
    memoSortKey() {
      return this.$store.state.memoData.memoSort.key;
    },
    fontSize() {
      return this.$store.state.memoData.fontSize;
    },
    emptyFlag() {
      return this.$store.getters.sortedList.length === 0 ? true : false;
    }
  },
  methods: {
    menuDialog(id) {
      this.$store.dispatch("idCheck", id);
      this.dialogVisible = true;
    },
    selectLabel(color) {
      this.$store.dispatch("labelCheck", color);
      this.$store.dispatch("idCheck", "");
      this.dialogVisible = false;
    },
    deleteDialog() {
      this.$ons.notification
        .confirm("削除してよろしいですか？", {
          title: "削除",
          cancelable: true
        })
        .then(response => {
          this.$store.dispatch("deleteCheck", response);
        });
      this.dialogVisible = false;
    },
    pagePush(id) {
      this.$store.dispatch("idCheck", id);
      this.$store.dispatch("addCheck");
      this.pageStack.push(page2);
    },
    show() {
      this.$store.dispatch("emptyCheck");
    }
  },
  props: ["pageStack", "page"],
  components: { customToolbar },
  key: "key_page1"
};
</script>