<template>
  <v-ons-page>
    <custom-toolbar :change-size="changeSize" :post-font-size="postFontSize" :back-label="'戻る'">編集</custom-toolbar>
    <div class="content">
      <p class="update-note">更新: {{ this.myList[this.currentData].updated_at }}</p>
      <textarea
        class="edit-area"
        v-model="editnow"
        placeholder="入力..."
        :style="{ fontSize: postFontSize + 'rem' }"
      ></textarea>
    </div>
  </v-ons-page>
</template>

<style>
.update-note {
  font-size: 60%;
  color: #666;
  text-align: center;
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
import _ from "lodash";
import customToolbar from "./CustomToolbar";

export default {
  data() {
    return {
      editnow: this.myList[this.currentData].content,
      sortBtn: false
    };
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
      this.$set(this.myList[this.currentData], "content", this.editnow);
      this.$set(
        this.myList[this.currentData],
        "updated_at",
        new Date().toLocaleString()
      );
    }
  },
  props: ["pageStack", "myList", "currentData", "changeSize", "postFontSize"],
  components: { customToolbar },
  key: "key_page2"
};
</script>