<template>
  <div class="side-item">
    <div class="side-item__btn" @click="accountDialogVisible = true">
      <i class="zmdi zmdi-account" :class="signinColor"></i>
      {{ lang.account }}
    </div>

    <v-ons-alert-dialog :visible.sync="accountDialogVisible" cancelable>
      <span slot="title">Account</span>
      <template v-if="viewMode === 'emailChange'">
        <p class="auth-decription">{{ lang.decriptionChangeMail }}</p>
        <v-ons-list>
          <v-ons-list-item modifier="nodivider">
            <div class="center">
              <v-ons-input
                placeholder="email"
                type="email"
                float
                v-model="inputChangeEmail"
                @blur="checkEmail"
              ></v-ons-input>
              <p v-if="mailErrorMsg" class="validation">{{ mailErrorMsg }}</p>
            </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider auth-item" @click="sendMailChangeCheck()">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.authEmail }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
      </template>
      <template v-if="viewMode === 'success'">
        <p style="padding: 1em;">
          {{ lang.loggingIn }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <v-ons-button
          modifier="large"
          style="margin-bottom:2em;"
          @click="signOutAuth"
        >{{ lang.logout }}</v-ons-button>
        <v-ons-button modifier="outline large" @click="changeAuthMail">{{ lang.changeEmail }}</v-ons-button>
        <v-ons-button modifier="outline large" @click="removeAuth">{{ lang.removeAuth }}</v-ons-button>
      </template>
      <template v-if="viewMode === 'emailVerify'">
        <p>
          {{ lang.verifyProgress }}:
          <br />
          {{ fbAuth.email }}
        </p>
        <v-ons-list modifier="auth-select" key="send-email">
          <v-ons-list-item modifier="nodivider auth-item" @click="mailLinkFlow(fbAuth.email)">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.sendEmailAgain }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <v-ons-button modifier="quiet">{{ lang.stopProgress }}</v-ons-button>
      </template>
      <template v-if="viewMode === 'email'">
        <p class="auth-decription">{{ lang.decriptionRegisterMail }}</p>
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
          <v-ons-list-item modifier="nodivider auth-item" @click="selectAuth('email')">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.authEmail }}
            </div>
          </v-ons-list-item>
        </v-ons-list>
        <p class="auth-decription">{{ lang.decriptionNoticeMail }}</p>
      </template>
      <template v-if="viewMode === 'init'">
        <p class="auth-decription">{{ lang.decriptionAuthInit }}</p>
        <v-ons-list modifier="auth-select" key="auth-select">
          <v-ons-list-item modifier="nodivider auth-item" @click="selectAuth('google')">
            <div class="content">
              <div class="google-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="22"
                  height="22"
                  viewBox="0 0 48 48"
                  style=" fill:#000000;"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              </div>
              {{ lang.authWithGoogle }}
            </div>
          </v-ons-list-item>
          <!--
          <v-ons-list-item modifier="nodivider auth-item" @click="selectAuth('facebook')">
              <div class="content">
                <i class="zmdi zmdi-facebook" style="color:#1774eb;"></i>{{ lang.authWithFacebook }}
              </div>
          </v-ons-list-item>
          <v-ons-list-item modifier="nodivider auth-item" @click="selectAuth('twitter')">
              <div class="content">
                <i class="zmdi zmdi-twitter" style="color:#1d9dec;"></i>{{ lang.authWithTwitter }}
              </div>
          </v-ons-list-item>
          -->
          <v-ons-list-item modifier="nodivider auth-item" @click="emailAuth">
            <div class="content">
              <i class="zmdi zmdi-email"></i>
              {{ lang.authWithEmail }}
            </div>
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

.auth-item {
  width: 100%;
  margin: 2px 5px;
  padding: 0.5em 1em;
  cursor: pointer;
}

.list-item--auth-item__center .content {
  display: flex;
  align-items: center;
}

.list--auth-select .list-item i,
.list--auth-select .list-item .google-icon {
  width: 44px;
}

.validation {
  font-size: 70%;
  line-height: 1.4;
}
</style>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      accountDialogVisible: false,
      inputEmail: "",
      inputPassword: "",
      mailErrorMsg: "",
      isSelectEmailAuth: false,
      inputChangeEmail: "",
      isChangeAuthMail: ""
    };
  },
  computed: {
    lang() {
      return this.$store.getters["lang/currentLang"];
    },
    fbAuth() {
      return this.$store.state.fbAuth;
    },
    signinColor() {
      return this.fbAuth.emailVerified ? "auth-signin" : "auth-signout";
    },
    viewMode() {
      if (this.isChangeAuthMail) {
        return "emailChange";
      } else if (this.fbAuth.emailVerified) {
        return "success";
      } else if (this.fbAuth.email !== "") {
        return "emailVerify";
      } else if (this.isSelectEmailAuth) {
        return "email";
      } else {
        return "init";
      }
    }
  },
  methods: {
    selectAuth(target) {
      if (target === "email") {
        if (this.inputEmail === "" || this.inputPassword === "") {
          this.mailErrorMsg = this.lang.inputCheckEmpty;
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
            this.$ons.notification.toast(this.lang.loggedInGoogle, {
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
    changeAuthMail() {
      this.isChangeAuthMail = true;
    },
    emailAuthCancel() {
      if (this.isChangeAuthMail) {
        this.isChangeAuthMail = false;
        this.mailErrorMsg = "";
      } else if (this.isSelectEmailAuth) {
        this.isSelectEmailAuth = false;
        this.mailErrorMsg = "";
      } else {
        this.accountDialogVisible = false;
      }
    },
    checkEmail() {
      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,100}))$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputEmail)) {
        this.mailErrorMsg = this.lang.inputCheckEmail;
      } else {
        this.mailErrorMsg = "";
      }
    },
    checkPassword() {
      var pattern = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{8,100}$/;
      if (this.inputPassword !== "" && !pattern.test(this.inputPassword)) {
        this.mailErrorMsg = this.lang.inputCheckPassword;
      } else {
        this.mailErrorMsg = "";
      }
    },
    sendMailChangeCheck() {
      console.log("変えるよ！");
    },
    sendMailCheck() {
      //Check if an account has been created
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
            //Account created, password verification
            firebase
              .auth()
              .signInWithEmailAndPassword(this.inputEmail, this.inputPassword)
              .then(result => {
                //Check email link verification
                if (result.user.emailVerified) {
                  //Verification completed
                  this.$ons.notification.toast(this.lang.loggedInEmail, {
                    timeout: 2000
                  });
                  console.log("user login success.");
                } else {
                  //Unauthenticated, to authentication flow
                  this.mailLinkFlow(this.inputEmail);
                }
              })
              .catch(error => {
                var errorMessage = " error: " + error.message;
                this.$ons.notification.toast(errorMessage, { timeout: 2000 });
                console.log(error.message);
              })
              .then(() => {});
          } else {
            //Account not created, account created
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                this.inputEmail,
                this.inputPassword
              )
              .then(() => {
                //Unauthenticated, to authentication flow
                this.mailLinkFlow(this.inputEmail);
              })
              .catch(error => {
                var errorMessage = " error: " + error.message;
                this.$ons.notification.toast(errorMessage, { timeout: 2000 });
                console.log(error.message);
              });
          }
        })
        .catch(error => {
          this.$ons.notification.toast("error: " + error.message, {
            timeout: 2000
          });
          console.log(error.message);
        });
    },
    mailLinkFlow(mail) {
      this.$ons.notification
        .confirm(this.lang.sendEmailConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            //Send confirmation email
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
                this.$ons.notification.toast(mail + this.lang.sendEmailNotice, {
                  timeout: 2000
                });
              })
              .catch(error => {
                this.$ons.notification.toast("error: " + error.message, {
                  timeout: 2000
                });
                console.log(error.message);
              });
          } else {
            this.$ons.notification.toast(this.lang.sendEmailCancel, {
              timeout: 2000
            });
          }
        });
    },
    signOutAuth() {
      this.$ons.notification
        .confirm(this.lang.logoutConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            this.$store.dispatch("shareCloudCheck", false);
            this.$store.dispatch("snapshotCheck", "stop");
            firebase
              .auth()
              .signOut()
              .then(() => {
                this.$ons.notification.alert(this.lang.loggedOut, {
                  title: this.lang.confirm,
                  cancelable: true
                });
                this.accountDialogVisible = false;
              })
              .catch(error => {
                this.$ons.notification.alert("error: " + error.message, {
                  title: this.lang.confirm,
                  cancelable: true
                });
              });
          }
        });
    },
    removeAuth() {
      this.$ons.notification
        .confirm(this.lang.removeAuthConfirm, {
          title: this.lang.confirm,
          cancelable: true
        })
        .then(response => {
          if (response === 1) {
            //ここに再認証入れる
            this.$store.dispatch("removeAuthCheck").then(() => {
              this.$ons.notification.alert(this.lang.removeAuthNotice, {
                title: this.lang.confirm,
                cancelable: true
              });
              this.accountDialogVisible = false;
            });
          }
        });
    }
  }
};
</script>