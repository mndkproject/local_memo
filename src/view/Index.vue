<template>
  <v-ons-page @show="show">
    <custom-toolbar :page-stack="pageStack" :page="page" :toggleSide="toggleSide">{{ lang.home }}</custom-toolbar>
    <div class="content">
      <div class="index-split">
        <div class="index-split__side">
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
                  :class="{'current-item':currentId === item.id}"
                >
                  <span class="list-item__title">
                    <i v-if="item.favorite" class="zmdi zmdi-bookmark"></i>
                    <template v-if="item.mark && item.mark !== ''">
                      <i
                        class="zmdi zmdi-check-circle mark-icon"
                        :class="{'done' : String(item.content.length) > Number(item.mark)}"
                      ></i>
                    </template>
                    {{ item.content.slice(0,24) }}
                  </span>
                  <span
                    v-if="memoSortKey === 'updated_at'"
                    class="list-item__subtitle"
                  >{{ (new Date(item.updated_at)).toLocaleString() }} {{ lang.update }}</span>
                  <span
                    v-else-if="memoSortKey === 'create_at'"
                    class="list-item__subtitle"
                  >{{ (new Date(item.create_at)).toLocaleString() }} {{ lang.create }}</span>
                  <span
                    v-else
                    class="list-item__subtitle"
                  >{{ (new Date(item.updated_at)).toLocaleString() }} {{ lang.update }}</span>

                  <div v-if="isPC" class="item-func" @click="menuDialog(item.id)">
                    <i class="zmdi zmdi-more-vert"></i>
                  </div>
                </v-ons-list-item>
              </v-ons-list>
              <p v-if="emptyFlag" class="list-decription">{{ lang.noticeEmpty }}</p>
            </div>
          </v-ons-gesture-detector>
        </div>
        <div class="index-split__content" v-if="isPC">
          <div class="index-split__inner">
            <edit-area v-if="currentEdit !== -1"></edit-area>
          </div>
        </div>
      </div>
    </div>

    <v-ons-alert-dialog cancelable :visible.sync="dialogVisible" modifier="index">
      <ul class="color-list">
        <li class="color-list__item" v-for="item in labelColors" :key="item">
          <v-ons-button
            class="color-list__btn"
            :style="{ background: item }"
            @click="selectLabel(item)"
          ></v-ons-button>
        </li>
      </ul>
      <p class="func-text">
        <i class="zmdi zmdi-bookmark" :class="favColor" @click="selectFavorite"></i>
        <i class="zmdi zmdi-copy" @click="copyDialog"></i>
        <i class="zmdi zmdi-delete" @click="deleteDialog"></i>
      </p>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="dialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
    <v-ons-fab modifier="memo" position="bottom right" @click="pagePush(-2)">
      <v-ons-icon icon="md-plus"></v-ons-icon>
    </v-ons-fab>
  </v-ons-page>
</template>

<style>
.index-split__content {
  display: none;
}

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
  position: relative;
  word-break: break-all;
  border-left: 10px solid transparent;
  box-sizing: border-box;
  cursor: pointer;
  transition: filter 0.2s linear, background-color 0.2s linear;
}

.list-item--memo__center {
  position: relative;
}

.list-item__subtitle {
  text-align: right;
}

.alert-dialog-title--index {
  display: none;
}

.alert-dialog-content--index {
  margin-top: 0;
}

.func-text {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2em;
}

.alert-dialog--index .func-text .zmdi {
  margin: 0 1em;
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

.list-decription {
  text-align: center;
  font-size: 70%;
  line-height: 1.4;
}

/* desktop */
@media screen and (min-width: 640px) {
  .index-split {
    display: flex;
    overflow: hidden;
    max-height: calc(100vh - 44px);
  }

  .index-split__content {
    position: relative;
    display: block;
    flex-grow: 4;
  }

  .index-split__side {
    width: 320px;
    overflow: auto;
  }

  #memo-list .list-item--memo:hover {
    filter: brightness(0.95);
  }

  .list-item__title {
    padding-right: 2em;
  }

  .list-item__subtitle {
    text-align: left;
  }

  .item-func {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    font-size: 22px;
    opacity: 0.5;
    transition: opacity 0.2s linear;
  }

  .item-func:hover {
    opacity: 1;
  }
}
</style>

<script>
import customToolbar from "../components/CustomToolbar";
import editor from "./Editor";
import trash from "./Trash";
import editArea from "../components/editArea";

export default {
  data() {
    return {
      dialogVisible: false,
      targetId: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
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
    },
    favColor() {
      return this.targetIndex >= 0 &&
        this.$store.state.memoData.memoList[this.targetIndex].favorite
        ? "fav"
        : "";
    },
    isPC() {
      return !this.$ons.platform.isIPhone() &&
        !this.$ons.platform.isAndroid() &&
        window.innerWidth >= 640
        ? true
        : false;
    },
    currentEdit() {
      return this.$store.getters.currentIndex
        ? this.$store.getters.currentIndex
        : false;
    },
    currentId() {
      return this.$store.state.currentId;
    },
    targetIndex() {
      return this.$store.state.memoData.memoList.findIndex(
        item => item.id === this.targetId
      );
    },
    otherPagePush() {
      return this.$store.state.otherPagePush;
    }
  },
  mounted() {
    if (window.location.search.length) {
      var title = new URL(document.location).searchParams.get("name")
        ? new URL(document.location).searchParams.get("name")
        : "";
      var text = new URL(document.location).searchParams.get("description")
        ? new URL(document.location).searchParams.get("description")
        : "";
      var url = new URL(document.location).searchParams.get("link")
        ? new URL(document.location).searchParams.get("link")
        : "";
      if (title || text || url) {
        history.replaceState(null, null, "/");
        if (!this.isPC) {
          history.pushState(null, null, null);
          this.pageStack.push(editor);
        }
        this.$store.dispatch("idCheck", -2);
        this.$store.dispatch("addCheck");
        this.$store.dispatch("contentCheck", title + "\n" + text + "\n" + url);
      }
    }
  },
  watch: {
    otherPagePush() {
      if (this.otherPagePush) {
        switch (this.otherPagePush) {
          case "trash":
            history.pushState(null, null, null);
            this.pageStack.push(trash);
            break;
          default:
            break;
        }
      }
    }
  },
  methods: {
    menuDialog(id) {
      if (
        event.target.className !== "item-func" &&
        event.target.className !== "zmdi zmdi-more-vert" &&
        this.isPC
      ) {
        return;
      } else {
        this.targetId = id;
      }
      this.dialogVisible = true;
    },
    selectLabel(color) {
      this.$store.dispatch("labelCheck", { color: color, id: this.targetId });
      this.dialogVisible = false;
    },
    selectFavorite() {
      this.$store.dispatch("favoriteCheck", this.targetId);
      this.dialogVisible = false;
    },
    copyDialog() {
      this.$ons.notification
        .confirm(this.lang.copyConfirm, {
          title: this.lang.copyTtl,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("copyCheck", this.targetId);
            this.$ons.notification.toast(this.lang.copyNotice, {
              timeout: 2000
            });
          }
        });
      this.dialogVisible = false;
    },
    deleteDialog() {
      this.$ons.notification
        .confirm(this.lang.deleteConfirm, {
          title: this.lang.deleteTtl,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("deleteCheck", this.targetId);
            this.$ons.notification.toast(this.lang.deleteNotice, {
              timeout: 2000
            });
          }
        });
      this.dialogVisible = false;
    },
    pagePush(id) {
      if (
        event.target.className !== "item-func" &&
        event.target.className !== "zmdi zmdi-more-vert"
      ) {
        if (this.isPC) {
          this.$store.dispatch("emptyCheck");
        } else {
          history.pushState(null, null, null);
          this.pageStack.push(editor);
        }
        this.$store.dispatch("idCheck", id);
        this.$store.dispatch("addCheck");
      }
    },
    show() {
      this.$store.dispatch("idCheck", "");
      this.$store.dispatch("emptyCheck");
    }
  },
  props: ["pageStack", "page", "toggleSide"],
  components: { customToolbar, editArea },
  key: "key_index"
};
</script>