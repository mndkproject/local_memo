<template>
  <v-ons-page>
    <custom-toolbar
      :back-label="'戻る'"
      :label-btn="labelBtn"
      :info-btn="infoBtn"
      :page-stack="pageStack"
      :page="page"
    ></custom-toolbar>
    <div class="content">
      <div class="info-area">
        <p class="update-note">更新: {{ currentMemo.updated_at }}</p>
      </div>

      <textarea
        :class="isPC"
        class="edit-area"
        v-model="editnow"
        placeholder="入力..."
        :style="{ fontSize: fontSize + 'rem', borderColor: currentMemo.labelColor }"
      ></textarea>

      <div class="info-area">
        <p class="text-count">{{ chars }} chars, {{ lines }} lines, {{ sheets }} sheets</p>
      </div>
    </div>
  </v-ons-page>
</template>

<style>
.info-area {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 1em;
  width: 100%;
  max-width: calc(800px + 2em);
  font-size: 60%;
  color: #666;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 0;
  padding-bottom: 1em;
}

.text-count {
  line-height: 1.2;
}

.edit-area {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 5px;
  box-sizing: border-box;
  resize: none;
  width: 100%;
  max-width: 800px;
  height: 60%;
  min-height: 80%;
  line-height: 1.6;
  background-color: #fafafa;
  border: none;
  border-top: 5px solid #fafafa;
  font: inherit;
}

.edit-area--pc {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
}
</style>

<script>
import customToolbar from "./CustomToolbar";
import _ from "lodash";

export default {
  data() {
    return {
      editnow: "",
      labelBtn: true,
      infoBtn: true,
      isPC:
        this.$ons.platform.isIPhone() || this.$ons.platform.isAndroid()
          ? ""
          : "edit-area--pc"
    };
  },
  mounted() {
    this.editnow = this.currentMemo.content;
  },
  computed: {
    currentMemo() {
      return this.$store.state.memoData.memoList[
        this.$store.getters.currentIndex
      ];
    },
    fontSize() {
      return this.$store.state.memoData.fontSize;
    },
    chars() {
      return String(this.currentMemo.content.length);
    },
    lines() {
      return this.currentMemo.content.split("\n").length;
    },
    sheets() {
      var text = String(this.currentMemo.content);
      var lines = 0;

      var textArray = text.split("\n");

      textArray.forEach(t => {
        if (t.length === 0) {
          lines += 1;
        } else {
          t = t.slice(0, 1) === ("　" || "「") ? t : "　" + t;
          t = t
            .replace("。」", "」")
            .replace(/(\d{2})/g, "0")
            .replace(/[a-zA-Z]{2}/g, "a");

          let start = 0;
          let end = start + 21;
          while (start < t.length) {
            lines++;
            start = t.slice(-1) === ("。" || "、" || "」") ? end : end - 1;
            end = start + 21;
          }
        }
      });

      return ((lines / 20) | 0) + 1;
    }
  },
  watch: {
    editnow() {
      this.debouncedGetContent();
    }
  },
  created() {
    this.debouncedGetContent = _.debounce(this.getContent, 500);
  },
  methods: {
    pop() {
      this.pageStack.pop();
    },
    getContent() {
      if (this.editnow !== this.currentMemo.content) {
        this.$store.dispatch("contentCheck", this.editnow);
      }
    }
  },
  props: ["pageStack", "page"],
  components: { customToolbar },
  key: "key_page2"
};
</script>