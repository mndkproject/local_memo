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
      <p class="update-note">更新: {{ currentMemo.updated_at }}</p>

      <textarea
        :class="isPC"
        class="edit-area"
        v-model="editnow"
        placeholder="入力..."
        :style="{ fontSize: fontSize + 'rem', borderColor: currentMemo.labelColor }"
      ></textarea>
    </div>
  </v-ons-page>
</template>

<style>
.update-note {
  font-size: 60%;
  color: #666;
  text-align: center;
  box-sizing: border-box;
  margin-bottom: 0;
  padding-bottom: 1em;
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