<template>
  <div>
    <div v-if="isLoading">
      <v-ons-progress-circular indeterminate></v-ons-progress-circular>
    </div>
    <div v-else>
      <v-ons-toolbar-button @click="shareDialogVisible = true">
        <i class="zmdi zmdi-cloud" v-if="shareCloud"></i>
        <i class="zmdi zmdi-cloud-outline" :class="signinColor" v-else></i>
      </v-ons-toolbar-button>
    </div>

    <v-ons-alert-dialog :visible.sync="shareDialogVisible" cancelable>
      <span slot="title">Cloud</span>
      <template v-if="viewMode === 'success'">
        <ons-list>
          <ons-list-item>
            <label class="center" for="switch1">同期{{ cloudSwitch ? '中' : '解除中' }}</label>
            <div class="right">
              <v-ons-switch input-id="switch1" v-model="cloudSwitch" @click="checkShare"></v-ons-switch>
            </div>
          </ons-list-item>
        </ons-list>
        <p style="padding: 1em;">
          {{ fbAuth.email }}
          <br />でログイン中
        </p>
        <v-ons-button modifier="large" style="margin-bottom:2em;" @click="signOutAuth">ログアウト</v-ons-button>
        <v-ons-button modifier="quiet large" @click="removeAuth">認証情報をすべて削除</v-ons-button>
      </template>
      <template v-if="viewMode === 'emailVerify'">
        <p>{{ fbAuth.email }} で仮認証中</p>
        <v-ons-list modifier="auth-select" key="send-email">
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="mailLinkFlow(fbAuth.email)">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>確認メールを再度送信
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
        <v-ons-button modifier="quiet">認証手続きをやめる</v-ons-button>
      </template>
      <template v-if="viewMode === 'email'">
        <p class="auth-decription">認証するメールアドレスと任意のパスワード（8文字以上）を入力してください。</p>
        <v-ons-list modifier="auth-select" key="auth-email">
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="email"
                type="email"
                float
                v-model="inputEmail"
                @blur="checkEmail"
              ></v-ons-input>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="password"
                float
                type="password"
                v-model="inputPassword"
                @blur="checkPassword"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('email')">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>メールアドレスで認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
        <p
          class="auth-decription"
        >初めて利用する場合は仮認証となり、メールアドレスの確認が必要になります。仮認証後に届く確認メールのリンクを開くことで認証が完了します。</p>
      </template>
      <template v-if="viewMode === 'init'">
        <p class="auth-decription">他のデバイスでも使用できるように、データをクラウド上に保存することができます。認証方法を選んでください。</p>
        <v-ons-list modifier="auth-select" key="auth-select">
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('google')">
              <div class="content">
                <i class="zmdi zmdi-google" style="color:#dc5246;"></i>Google認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <!--
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('facebook')">
              <div class="content">
                <i class="zmdi zmdi-facebook" style="color:#1774eb;"></i>Facebook認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="selectAuth('twitter')">
              <div class="content">
                <i class="zmdi zmdi-twitter" style="color:#1d9dec;"></i>Twitter認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
          -->
          <v-ons-list-item modifier="nodivider">
            <v-ons-card modifier="auth-item" @click="emailAuth">
              <div class="content">
                <i class="zmdi zmdi-email" style="color:#1e88e5;"></i>メールアドレス認証
              </div>
            </v-ons-card>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template slot="footer">
        <v-ons-alert-dialog-button @click="emailAuthCancel">Cancel</v-ons-alert-dialog-button>
      </template>
    </v-ons-alert-dialog>
  </div>
</template>

<style>
.auth-decription {
  font-size: 70%;
  line-height: 1.4;
}

.button--sendcheck:not(.button--material) {
  font-size: 100%;
}

.list--auth-select .list-item {
  padding-left: 0;
}

.list--auth-select .list-item .list-item__center {
  padding: 0;
}

.card--auth-item {
  width: 100%;
  margin: 2px 5px;
  padding: 0.5em 1em;
}

.list--auth-select .list-item i {
  width: 2em;
}

.validation {
  color: #ff5722;
  font-size: 70%;
  line-height: 1.4;
}

.auth-signin {
  color: #1e88e5;
}

.auth-signout {
  color: #ccc;
}
</style>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      shareDialogVisible: false,
      inputEmail: "",
      inputPassword: "",
      mailErrorMsg: "",
      isSelectEmailAuth: false,
      cloudSwitch: false,
      isLoading: ""
    };
  },
  computed: {
    fbAuth() {
      return this.$store.state.fbAuth;
    },
    shareCloud() {
      return this.$store.state.memoData.shareCloud;
    },
    signinColor() {
      return this.fbAuth.uid ? "auth-signin" : "auth-signout";
    },
    viewMode() {
      if (this.fbAuth.emailVerified === true) {
        return "success";
      } else if (this.fbAuth.email !== "") {
        return "emailVerify";
      } else if (this.isSelectEmailAuth === true) {
        return "email";
      } else {
        return "init";
      }
    }
  },
  mounted() {
    this.cloudSwitch = this.shareCloud;
  },
  methods: {
    selectAuth(target) {
      if (target === "email") {
        if (this.inputEmail === "" || this.inputPassword === "") {
          this.mailErrorMsg = "入力してください。";
        }
        if (this.mailErrorMsg !== "") {
          return;
        }

        this.sendMailCheck();
      } else if (target === "google") {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then(() => {
            this.$ons.notification.toast("Google認証でログインしました。", {
              timeout: 2000
            });
          })
          .catch(error => {
            alert(error.message);
          });
      }
    },
    emailAuth() {
      this.isSelectEmailAuth = true;
    },
    emailAuthCancel() {
      if (this.isSelectEmailAuth) {
        this.isSelectEmailAuth = false;
        this.mailErrorMsg = "";
      } else {
        this.shareDialogVisible = false;
      }
    },
    checkEmail() {
      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,100}))$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputEmail)) {
        this.mailErrorMsg = "正しいメールアドレスを入力してください。";
      } else {
        this.mailErrorMsg = "";
      }
    },
    checkPassword() {
      var pattern = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{8,100}$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputPassword)) {
        this.mailErrorMsg =
          "パスワードは半角記号英数字8文字以上にしてください。";
      } else {
        this.mailErrorMsg = "";
      }
    },
    sendMailCheck() {
      //アカウント作成済みか確認
      firebase
        .auth()
        .fetchSignInMethodsForEmail(this.inputEmail)
        .then(providers => {
          if (
            providers.findIndex(
              p =>
                p ===
                firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
            ) !== -1
          ) {
            //アカウント作成済み、パスワード照合
            firebase
              .auth()
              .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
              .then(result => {
                //メールリンク照合確認
                if (result.user.emailVerified) {
                  //照合完了
                  this.$ons.notification.toast(
                    "メールアドレス認証でログインしました。",
                    {
                      timeout: 2000
                    }
                  );
                  console.log("user login success.");
                } else {
                  //未認証、認証フローへ
                  this.mailLinkFlow(this.inputEmail);
                }
              })
              .catch(error => {
                var errorMessage =
                  error.message ===
                  "The email address is already in use by another account."
                    ? "このメールアドレスは既にほかのアカウントで使用されています。"
                    : " error: " + error.message;
                this.$ons.notification.toast(
                  "認証時にエラーがしました。" + errorMessage,
                  { timeout: 2000 }
                );
                console.log(error.message);
              })
              .then(() => {});
          } else {
            //アカウント未作成、アカウント作成
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.inputEmail,
                this.inputPassword
              )
              .then(() => {
                //未認証、認証フローへ
                this.mailLinkFlow(this.inputEmail);
              })
              .catch(error => {
                var errorMessage =
                  error.message ===
                  "The email address is already in use by another account."
                    ? "このメールアドレスは既にほかのアカウントで使用されています。"
                    : " error: " + error.message;
                this.$ons.notification.toast(
                  "認証時にエラーがしました。" + errorMessage,
                  { timeout: 2000 }
                );
                console.log(error.message);
              });
          }
        })
        .catch(error => {
          this.$ons.notification.toast(
            "認証時にエラーがしました。error: " + error.message,
            { timeout: 2000 }
          );
          console.log(error.message);
        });
    },
    mailLinkFlow(mail) {
      this.$ons.notification
        .confirm(
          "まだメール認証は完了していません。認証を完了するために確認メールを送信しますか？",
          { title: "確認", cancelable: true }
        )
        .then(response => {
          if (response === 1) {
            //確認メール送信
            var actionCodeSettings = {
              url:
                process.env.NODE_ENV === "development"
                  ? "http://localhost:8080"
                  : "https://mndkproject.github.io/local_memo/",
              handleCodeInApp: true
            };
            firebase
              .auth()
              .currentUser.sendEmailVerification(actionCodeSettings)
              .then(() => {
                this.$ons.notification.toast(
                  mail +
                    "に確認メールを送信しました。確認メールのリンクからアクセスして認証を完了してください。",
                  { timeout: 2000 }
                );
              })
              .catch(error => {
                this.$ons.notification.toast(
                  "認証時にエラーがしました。error: " + error.message,
                  { timeout: 2000 }
                );
                console.log(error.message);
              });
          } else {
            this.$ons.notification.toast(
              "メールアドレス認証をキャンセルしました。",
              { timeout: 2000 }
            );
          }
        });
    },
    signOutAuth() {
      this.$ons.notification
        .confirm(
          "ログアウトするとクラウドの同期も解除されます。本当にログアウトしてよろしいですか？",
          {
            title: "確認",
            cancelable: true
          }
        )
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("snapshotCheck", "stop");
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.$ons.notification.alert("ログアウトしました。", {
                  title: "確認",
                  cancelable: true
                });
                this.shareDialogVisible = false;
              })
              .catch(error => {
                this.$ons.notification.alert(
                  "ログアウト時にエラーが発生しました。",
                  {
                    title: "確認",
                    cancelable: true
                  }
                );
                console.log(`ログアウト時にエラーが発生しました (${error})`);
              });
          }
        });
    },
    removeAuth() {
      this.$ons.notification
        .confirm(
          "認証情報を削除するとクラウドに保存されているデータがすべて削除されます。この操作はもとに戻せません。本当に解除してよろしいですか？",
          {
            title: "確認",
            cancelable: true
          }
        )
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("removeAuthCheck").then(() => {
              this.$ons.notification.alert("認証情報をすべて削除しました。", {
                title: "確認",
                cancelable: true
              });
              this.shareDialogVisible = false;
            });
          }
        });
    },
    checkShare() {
      if (!this.shareCloud) {
        this.$ons.notification
          .confirm(
            "同期を開始すると更新日時の新しいデータで上書きされます。同期を開始してよろしいですか？",
            {
              title: "確認",
              cancelable: true
            }
          )
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", true);
              //クラウド同期処理
              this.$store.dispatch("snapshotCheck", "start");
              this.$ons.notification.alert("同期を開始しました。", {
                title: "確認",
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              this.cloudSwitch = false;
            }
          });
      } else {
        this.$ons.notification
          .confirm(
            "同期を解除すると他のデバイスとの共有ができなくなります。本当に解除してよろしいですか？",
            {
              title: "確認",
              cancelable: true
            }
          )
          .then(response => {
            if (response === 1) {
              this.$store.dispatch("shareCloudCheck", false);
              this.$store.dispatch("snapshotCheck", "stop");
              this.$ons.notification.alert("同期を解除しました。", {
                title: "確認",
                cancelable: true
              });
              this.shareDialogVisible = false;
            } else {
              this.cloudSwitch = true;
            }
          });
      }
    }
  }
};
</script>