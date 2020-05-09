<template>
  <v-ons-page>
    <custom-toolbar :back-label="'戻る'" :label-btn="labelBtn" :info-btn="infoBtn"></custom-toolbar>
    <div class="content">
      <p
        class="update-note"
        :style="{ borderColor: currentMemo.labelColor }"
      >更新: {{ currentMemo.updated_at }}</p>
      <textarea
        class="edit-area"
        v-model="editnow"
        placeholder="入力..."
        :style="{ fontSize: fontSize + 'rem' }"
      ></textarea>
    </div>
  </v-ons-page>
</template>

<style>
.update-note {
  font-size: 60%;
  color: #666;
  text-align: center;
  border-bottom: 5px solid #fafafa;
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
  height: 60%;
  min-height: 80%;
  line-height: 1.2;
  background-color: #fafafa;
  border: none;
  font: inherit;
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
      infoBtn: true
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
  props: ["pageStack"],
  components: { customToolbar },
  key: "key_page2"
};
</script>