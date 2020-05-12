import Vue from 'vue'
import Vuex from 'vuex'
import _ from "lodash"
import firebase from "firebase";

Vue.use(Vuex)
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  snapshotState: null,
  state: {
    memoData: {
      memoList: [],
      fontSize: "1",
      memoSort: { key: "create_at", order: "desc" },
      filterColor: "",
      themeColor: false,
      authAccount: { signin: false, mail: "", provider: "", uid: "" },
      shareCloud: false,
      signinEmail: ""
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
    filterWord: "",
    isLoad: false
  },
  getters: {
    filteredList: (state) => {
      var resultList = state.memoData.memoList;
      resultList = state.memoData.memoList.filter(item => !item.delete);
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
    save(state) {
      state.isLoad = true;

      var newDB = JSON.stringify(state.memoData);
      var oldDB = localStorage.local_memo ? localStorage.local_memo : "";
      var newList = JSON.stringify(state.memoData.memoList);
      var oldList = localStorage.local_memo ? JSON.stringify(JSON.parse(localStorage.local_memo).memoList) : "";
      if (newList !== oldList) {
        firebase
          .firestore()
          .collection("/memos")
          .doc(state.memoData.authAccount.uid)
          .set({ data: state.memoData.memoList })
          .then(() => {
            console.log("cloud save is dane.");
          })
          .catch(error => {
            console.log("Error : ", error);
          })
          .then(() => {
            state.isLoad = false;
          })
      }
      if (newDB !== oldDB) {
        localStorage.local_memo = newDB;
        console.log("local save is dane.");
      } else {
        console.log("local change is none.");
      }

      state.isLoad = false;
    },
    load(state, db) {
      if (db) {
        state.memoData = db;
      }
    },
    isLoad(state, boo) {
      state.isLoad = boo;
    },
    deleteData(state, payload) {
      //ゴミ箱作るならここ変える
      state.memoData.memoList[payload.currentIndex].content = "";
      state.memoData.memoList[payload.currentIndex].updated_at = new Date().toLocaleString();
      Vue.set(state.memoData.memoList[payload.currentIndex], "delete", true);
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
    },
    changeSigninEmail(state, mail) {
      state.memoData.signinEmail = mail;
    },
    authAccountChange(state, account) {
      state.memoData.authAccount.signin = account.signin;
      state.memoData.authAccount.mail = account.mail;
      state.memoData.authAccount.provider = account.provider;
      state.memoData.authAccount.uid = account.uid;
    },
    shareCloudChange(state, isShare) {
      state.memoData.shareCloud = isShare;
      console.log("isShare:" + isShare);
    },
    contentSync(state, newData) {
      state.memoData.memoList = newData;
      firebase
        .firestore()
        .collection("/memos")
        .doc(state.memoData.authAccount.uid)
        .set({ data: newData })
        .then(() => {
          console.log("cloud save is dane.");
        })
        .catch(error => {
          console.log("Error : ", error);
        })
        .then(() => {
          state.isLoad = false;
        })
    },
  },
  actions: {
    loadCheck({ commit }) {
      var db = "";
      if (localStorage.local_memo) {
        if (JSON.parse(localStorage.local_memo.replace(',"["', ''))) {
          db = JSON.parse(localStorage.local_memo.replace(',"["', ''));
          //公開時には消す！
          if (!db.authAccount) {
            db.authAccount = { signin: false, mail: "", provider: "" };
            db.shareCloud = false;
            db.signinEmail = "";
            db.uid = "";
          }
        }
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
          commit('save');
        }
      }
      commit('changeId', "");
    },
    deleteCheck({ commit, state, getters }, response) {
      if (state.memoData.memoList[getters.currentIndex] && response === 1) {
        var payload = { currentIndex: getters.currentIndex };
        commit('deleteData', payload);
        commit('save');
      } else {
        commit('changeId', "");
      }
    },
    addCheck({ commit, state, getters }) {
      if (!state.memoData.memoList[getters.currentIndex]) {
        commit('addData');
        commit('save');
      }
    },
    labelCheck({ commit, getters }, color) {
      if (getters.currentIndex !== "" && color) {
        var payload = { currentIndex: getters.currentIndex, color: color };
        commit('changeLabel', payload);
        commit('save');
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
        commit('save');
      }
    },
    sizeCheck({ commit }, size) {
      if (size) {
        commit('changeSize', size);
        commit('save');
      }
    },
    contentCheck({ commit, getters }, newContent) {
      var payload = { currentIndex: getters.currentIndex, newContent: newContent };
      commit('changeContent', payload);
      commit('save');
    },
    filterCheck({ commit, state }, color) {
      if (state.memoData.memoList.filter(item => item.labelColor === color).length >= 0) {
        commit('changeFilter', color);
        commit('save');
      }
    },
    filterRemoveCheck({ commit, state }) {
      if (state.memoData.filterColor !== "") {
        commit('filterRemove');
        commit('save');
      }
    },
    searchCheck({ commit }, word) {
      commit('changeWordFilter', word);
    },
    themeCheck({ commit }, boo) {
      commit('changeTheme', boo);
      commit('save');
    },
    signinEmailCheck({ commit }, mail) {
      commit('changeSigninEmail', mail);
      commit('save');
    },
    authAccountCheck({ commit }, account) {
      commit('authAccountChange', account);
      commit('save');
    },
    shareCloudCheck({ commit }, isShare) {
      commit('shareCloudChange', isShare);
      commit('save');
    },
    contentSyncCheck({ commit, state }, data) {
      console.log("クラウドからロードするよ");
      //クラウドロード処理
      //クラウド同期処理
      var cloudData = data && data !== "" ? data.data : [];
      var update_flag = false;
      console.log("cloud get is dane.");
      let localData = JSON.parse(JSON.stringify(state.memoData.memoList));
      Array.prototype.forEach.call(cloudData, cloudItem => {
        var tarId = cloudItem.id;
        var tarItem = localData.find(
          localItem => localItem.id === tarId
        );
        if (tarItem) {
          var localIndex = localData.findIndex(
            localItem => localItem.id === tarId
          );
          var localUpdate = new Date(tarItem.updated_at).getTime();
          var cloudUpdate = new Date(cloudItem.updated_at).getTime();
          if (localUpdate > cloudUpdate) {
            update_flag = true;
          } else if (localUpdate < cloudUpdate) {
            localData[localIndex].content = cloudItem.content;
            localData[localIndex].labelColor = cloudItem.labelColor;
            localData[localIndex].updated_at = cloudItem.updated_at;
            update_flag = true;
          }
        } else {
          localData.push(cloudItem);
          update_flag = true;
        }
      });
      Array.prototype.forEach.call(localData, resultLocalItem => {
        var resultTarId = resultLocalItem.id;
        var resultTarItem = cloudData.find(
          cloudItem => cloudItem.id === resultTarId
        );
        if (!resultTarItem) {
          update_flag = true;
        }
      });
      //ローカル最新化＆クラウド最新化
      if (update_flag) {
        commit("contentSync", localData);
        commit('save');
        update_flag = false;
      } else {
        console.log("cloud change is none.");
        commit('isLoad', false);
      }
    },
    snapshotCheck({ dispatch, commit, state }, flag) {
      if (flag === "start") {
        if (this.snapshotState) {
          console.warn('なんかもう監視されてたよ', this.snapshotState)
          this.snapshotState()
          this.snapshotState = null
        }
        console.log("クラウド監視開始");
        this.snapshotState = firebase
          .firestore()
          .collection("/memos")
          .doc(state.memoData.authAccount.uid)
          .onSnapshot(data => {
            var source = data.metadata.hasPendingWrites ? "Local" : "Server";
            if (source === "Server") {
              console.log(source, " で更新されたからチェックするよ");
              dispatch('contentSyncCheck', data.data());
            }
          });
      } else if (flag === "stop") {
        if (this.snapshotState) {
          this.snapshotState()
          this.snapshotState = null
        }
        commit('isLoad', false);
        console.log("クラウド監視終了");
      }
    },
    isLoadCheck({ commit }, boo) {
      commit('isLoad', boo);
    }
  },
  modules: {
  }
})