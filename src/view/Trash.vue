<template>
  <v-ons-page>
    <custom-toolbar
      :back-label="backLabelTxt"
      :page-stack="pageStack"
      :page="page"
    >{{ lang.trashbox }}</custom-toolbar>
    <div class="content">
      <v-ons-gesture-detector>
        <div class="memo-wrap">
          <p class="list-decription">{{ lang.noticeTrash }}</p>
          <v-ons-list id="memo-list">
            <v-ons-list-item
              modifier="memo longdivider"
              tappable
              v-for="(item, index) in memoList"
              :key="index"
              @click="menuDialog(item.id)"
              :style="{ fontSize: fontSize + 'rem', borderColor: item.labelColor }"
            >
              <span class="list-item__title">
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
            </v-ons-list-item>
          </v-ons-list>
          <p v-if="emptyFlag" class="list-decription">{{ lang.noticeEmpty }}</p>
        </div>
      </v-ons-gesture-detector>
    </div>

    <v-ons-alert-dialog cancelable :visible.sync="dialogVisible" modifier="index">
      <v-ons-list modifier="trash-dialog">
        <v-ons-list-item @click="restorationDialog">
          <div class="center">
            <i class="zmdi zmdi-undo"></i>
            {{ lang.restore }}
          </div>
        </v-ons-list-item>
        <v-ons-list-item @click="erasureDialog">
          <div class="center">
            <i class="zmdi zmdi-blur"></i>
            {{ lang.erasure }}
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="dialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
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

.alert-dialog--index .list-item {
  cursor: pointer;
}

.list-decription {
  text-align: center;
  font-size: 70%;
  line-height: 1.4;
}

.list--trash-dialog .zmdi {
  margin-right: 0.5em;
  width: 22px;
  text-align: center;
}

/* desktop */
@media screen and (min-width: 640px) {
  #memo-list .list-item--memo:hover {
    filter: brightness(0.9);
  }

  .list-item__title {
    padding-right: 2em;
  }

  .list-item__subtitle {
    text-align: left;
  }
}
</style>

<script>
import customToolbar from "../components/CustomToolbar";

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
    backLabelTxt() {
      return this.lang.backLabel;
    },
    memoList() {
      return this.$store.getters.deletedList;
    },
    emptyFlag() {
      return this.$store.getters.deletedList.length === 0 ? true : false;
    },
    memoSortKey() {
      return this.$store.state.memoData.memoSort.key;
    },
    fontSize() {
      return this.$store.state.memoData.fontSize;
    }
  },
  mounted() {
    if (this.$store.state.otherPagePush) {
      this.$store.dispatch("otherPagePushCheck", "");
    }
  },
  methods: {
    menuDialog(id) {
      this.targetId = id;
      this.dialogVisible = true;
    },
    restorationDialog() {
      this.$ons.notification
        .confirm(this.lang.restoreConfirm, {
          title: this.lang.restoreTtl,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("restorationCheck", this.targetId);
            this.$ons.notification.toast(this.lang.restoreNotice, {
              timeout: 2000
            });
          }
        });
      this.dialogVisible = false;
    },
    erasureDialog() {
      this.$ons.notification
        .confirm(this.lang.erasureConfirm, {
          title: this.lang.erasureTtl,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("erasureCheck", this.targetId);
            this.$ons.notification.toast(this.lang.erasureNotice, {
              timeout: 2000
            });
          }
        });
      this.dialogVisible = false;
    }
  },
  props: ["pageStack", "page"],
  components: { customToolbar },
  key: "key_trash"
};
</script>