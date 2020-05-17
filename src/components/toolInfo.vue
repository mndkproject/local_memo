<template>
  <div>
    <v-ons-toolbar-button @click="infoDialogVisible = true">
      <i class="zmdi zmdi-info"></i>
    </v-ons-toolbar-button>

    <v-ons-alert-dialog :visible.sync="infoDialogVisible" cancelable>
      <span slot="title">{{ lang.info }}</span>
      <v-ons-list>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.createDate }}</span>
            <span class="info-content">{{ (new Date(currentMemo.create_at)).toLocaleString() }}</span>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.updateDate }}</span>
            <span class="info-content">{{ (new Date(currentMemo.updated_at)).toLocaleString() }}</span>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.wordCount }} (Byte)</span>
            <span class="info-content">{{ chars }}{{ lang.chars }} ({{ bytes }}bytes)</span>
            <span class="info-mark" v-if="markNum && markNum !== '' && chars > Number(markNum)">
              <i class="zmdi zmdi-check-circle"></i>
              {{ lang.goal }}
            </span>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.goalSet }}</span>
            <span class="info-content">
              <span class="mark-btn" @click="changeMark">
                <i v-if="markEdit" class="zmdi zmdi-check"></i>
                <i v-else class="zmdi zmdi-edit"></i>
              </span>
              <span v-if="markEdit" class="mark-input">
                <v-ons-input type="number" placeholder="edit..." v-model="currentMarkNum"></v-ons-input>
                {{ lang.chars }}
              </span>
              <span v-else-if="markNum === ''" class="mark-input">{{ lang.goalEmpty }}</span>
              <span v-else class="mark-input">{{ markNum }}{{ lang.chars }}</span>
            </span>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.lineNum }}</span>
            <span class="info-content">{{ lines }}{{ lang.lines }}</span>
          </div>
        </v-ons-list-item>
        <v-ons-list-item>
          <div class="center">
            <span class="info-title">{{ lang.sheetNum }}</span>
            <span
              class="info-content"
            >{{ sheets }}{{ lang.sheet }} (20{{ lang.chars }}x20{{ lang.line }})</span>
          </div>
        </v-ons-list-item>
      </v-ons-list>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="infoDialogVisible = false;">{{ lang.close }}</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.info-title {
  width: 100%;
  font-size: 0.8em;
}

.info-content {
  display: flex;
}

.info-mark {
  display: flex;
  align-items: center;
  font-size: 0.8em;
}

.info-mark i {
  margin: 0 4px;
}

.mark-btn {
  font-size: 22px;
  margin-right: 8px;
}

.mark-input {
  display: flex;
  width: calc(100% - 30px);
  align-items: center;
  word-break: keep-all;
}
</style>

<script>
export default {
  data() {
    return {
      infoDialogVisible: false,
      markEdit: false,
      currentMarkNum: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    currentMemo() {
      return this.$store.state.memoData.memoList[
        this.$store.getters.currentIndex
      ];
    },
    chars() {
      return String(this.currentMemo.content.length);
    },
    bytes() {
      return encodeURIComponent(this.currentMemo.content).replace(/%../g, "x")
        .length;
    },
    lines() {
      return this.currentMemo.content.split("\n").length;
    },
    sheets() {
      var lines = this.currentMemo.content.split("\n");
      var count = 0;
      lines.forEach(line => {
        if (line.length === 0) {
          count += 1;
        } else {
          line = line.slice(-1) === ("。" || ".") ? line.slice(0, -1) : line;
          count += ((line.length / 20) | 0) + (line.length % 20 > 0 ? 1 : 0);
        }
      });
      return ((count / 20) | 0) + 1;
    },
    markNum() {
      return this.currentMemo.mark ? this.currentMemo.mark : "";
    }
  },
  mounted() {
    this.currentMarkNum = this.markNum;
  },
  methods: {
    changeMark() {
      if (this.markEdit) {
        this.$store.dispatch("setMarkCheck", this.currentMarkNum);
      }
      this.markEdit = !this.markEdit;
    }
  }
};
</script>