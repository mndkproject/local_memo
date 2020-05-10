import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash"

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    memoData: {
      memoList: [],
      fontSize: "1",
      memoSort: { key: "create_at", order: "desc" },
      filterColor: "",
      themeColor: false
    },
    currentId: "",
    labelColors: [
      "transparent",
      "#e91e63",
      "#ff5722",
      "#ffeb3b",
      "#8bc34a",
      "#03a9f4",
      "#673ab7"
    ],
    filterWord: ""
  },
  getters: {
    filteredList: (state) => {
      var resultList = state.memoData.memoList;
      if (state.memoData.filterColor !== "" && state.memoData.filterColor !== undefined) {
        resultList = state.memoData.memoList.filter(item => item.labelColor === state.memoData.filterColor)
      }
      if (state.filterWord !== "") {
        var testWords = new RegExp(state.filterWord.split(/\s+/).join("|"), "m");
        resultList = resultList.filter(item => testWords.test(item.content))
      }
      return resultList;
    },
    sortedList: (state, getters) => {
      return _.orderBy(getters.filteredList, state.memoData.memoSort.key, state.memoData.memoSort.order)
    },
    memoSortArr: (state) => {
      return Object.values(state.memoData.memoSort).join(',')
    },
    currentIndex: (state) => {
      return state.memoData.memoList.findIndex(el => el.id == state.currentId)
    }
  },
  mutations: {
    load(state, db) {
      if (db) {
        state.memoData = db;
      }
    },
    deleteData(state, payload) {
      state.memoData.memoList.splice(payload.currentIndex, 1);
      state.currentId = "";
    },
    addData(state) {
      var ID = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
      state.memoData.memoList.push({
        id: ID,
        content: "",
        create_at: new Date().toLocaleString(),
        updated_at: new Date().toLocaleString(),
        labelColor: state.memoData.filterColor !== "" ? state.memoData.filterColor : "transparent"
      });
      state.currentId = ID;
    },
    changeLabel(state, payload) {
      state.memoData.memoList[payload.currentIndex].labelColor = payload.color;
    },
    changeId(state, id) {
      state.currentId = id;
    },
    changeSort(state, sort) {
      state.memoData.memoSort = sort;
    },
    changeSize(state, size) {
      state.memoData.fontSize = size;
    },
    changeContent(state, payload) {
      state.memoData.memoList[payload.currentIndex].content = payload.newContent;
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().toLocaleString();
    },
    changeFilter(state, color) {
      state.memoData.filterColor = color;
    },
    filterRemove(state) {
      state.memoData.filterColor = "";
    },
    changeWordFilter(state, word) {
      state.filterWord = word;
    },
    changeTheme(state, boo) {
      state.memoData.themeColor = boo;
      console.log("changeTheme:" + state.memoData.themeColor);
    }
  },
  actions: {
    loadCheck({ commit }) {
      var db = "";
      if (localStorage.local_memo) {
        if (JSON.parse(localStorage.local_memo)) {
          db = JSON.parse(localStorage.local_memo);
        }
      } else if (localStorage.memo) {
        /* 古いデータを使ってた場合の処理 */
        db = JSON.parse(localStorage.memo);
        localStorage.removeItem("memo");
      }
      if (db !== "") {
        commit('load', db);
      }
    },
    emptyCheck({ commit, state, getters }) {
      if (getters.currentIndex !== "" && getters.currentIndex !== -1) {
        if (state.memoData.memoList[getters.currentIndex].content === "") {
          var payload = { currentIndex: getters.currentIndex };
          commit('deleteData', payload);
        }
      }
      commit('changeId', "");
    },
    deleteCheck({ commit, state, getters }, response) {
      if (state.memoData.memoList[getters.currentIndex] && response === 1) {
        var payload = { currentIndex: getters.currentIndex };
        commit('deleteData', payload);
      } else {
        commit('changeId', "");
      }
    },
    addCheck({ commit, state, getters }) {
      if (!state.memoData.memoList[getters.currentIndex]) {
        commit('addData');
      }
    },
    labelCheck({ commit, getters }, color) {
      if (getters.currentIndex !== "" && color) {
        var payload = { currentIndex: getters.currentIndex, color: color };
        commit('changeLabel', payload);
      }
    },
    idCheck({ commit, state }, id) {
      if (state.memoData.memoList.findIndex(el => el.id == id) >= 0) {
        commit('changeId', id);
      }
    },
    sortCheck({ commit }, sort) {
      if (sort.key && sort.order) {
        commit('changeSort', sort);
      }
    },
    sizeCheck({ commit }, size) {
      if (size) {
        commit('changeSize', size);
      }
    },
    contentCheck({ commit, getters }, newContent) {
      var payload = { currentIndex: getters.currentIndex, newContent: newContent };
      commit('changeContent', payload);
    },
    filterCheck({ commit, state }, color) {
      if (state.memoData.memoList.filter(item => item.labelColor === color).length >= 0) {
        commit('changeFilter', color);
      }
    },
    filterRemoveCheck({ commit, state }) {
      if (state.memoData.filterColor !== "") {
        commit('filterRemove');
      }
    },
    searchCheck({ commit }, word) {
      commit('changeWordFilter', word);
    },
    themeCheck({ commit }, boo) {
      commit('changeTheme', boo);
    }
  },
  modules: {
  }
})
