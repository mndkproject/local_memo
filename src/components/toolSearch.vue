<template>
  <div>
    <v-ons-toolbar-button @click="setSearchBox">
      <i class="zmdi zmdi-search"></i>
    </v-ons-toolbar-button>

    <div v-if="searchBoxVisible" class="top-search-box">
      <div class="top-search-box__inner">
        <v-ons-search-input
          class="top-search-box__input"
          placeholder="search..."
          v-model="searchWord"
          @blur="blurFocus"
        ></v-ons-search-input>
        <div class="top-search-box__close" @click="searchCancel">
          <i class="zmdi zmdi-close"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.top-search-box {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: calc(100% - 10px);
  margin: 5px;
  line-height: 1em;
  box-sizing: border-box;
  z-index: 20000;
  pointer-events: none;
}

.top-search-box__inner {
  position: relative;
  width: 100%;
  max-width: 800px;
  pointer-events: auto;
}

.top-search-box__input {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  width: 100%;
}

.top-search-box__close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  font-size: 18px;
}
</style>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      searchWord: "",
      searchBoxVisible: false
    };
  },
  watch: {
    searchWord() {
      this.debouncedGetSearch();
    },
    pageStack() {
      if (this.searchWord === "") {
        this.searchBoxVisible = false;
      }
    }
  },
  created() {
    this.debouncedGetSearch = _.debounce(this.getSearch, 500);
  },
  methods: {
    getSearch() {
      if (this.searchWord !== this.$store.state.filterWord) {
        this.$store.dispatch("searchCheck", this.searchWord);
      }
    },
    searchCancel() {
      this.searchWord = "";
      this.searchBoxVisible = false;
    },
    setSearchBox() {
      this.searchBoxVisible = true;
    },
    blurFocus() {
      if (this.searchWord === "") {
        this.searchBoxVisible = false;
      }
    }
  },
  props: ["pageStack"]
};
</script>