export const lang = {
  namespaced: true,
  state: {
    langData: {
      ja: {
        noticeClose: "もう一度押すと終了します",
        noticeEmpty: "該当するアイテムがありません。",
        noticeTrash: "ゴミ箱のアイテムは30日後に完全に削除されます。",
        home: "ホーム",
        update: "更新",
        create: "作成",
        edit: "編集",
        createDate: "作成日時",
        updateDate: "更新日時",
        fontSize: "フォントサイズ",
        fontSmall: "小",
        fontLarge: "大",
        wordCount: "文字数",
        chars: "文字",
        goal: "目標達成済み",
        goalSet: "目標文字数設定",
        goalEmpty: "なし",
        total: "計",
        line: "行",
        lineNum: "行数",
        sheet: "枚",
        sheetNum: "ページ数",
        ok: "決定",
        close: "閉じる",
        cancel: "キャンセル",
        backLabel: "戻る",
        confirm: "確認",
        info: "情報",
        trashbox: "ゴミ箱",
        restore: "復元する",
        restoreTtl: "復元",
        restoreConfirm: "復元してよろしいですか？",
        restoreNotice: "復元しました。",
        erasure: "完全に削除する",
        erasureTtl: "完全に削除",
        erasureConfirm: "この操作はやり直せません。完全に削除してよろしいですか？",
        erasureNotice: "完全に削除しました。",
        langSetting: "言語設定",
        other: "その他",
        help: "ヘルプ",
        theme: "画面テーマ",
        sortTtl: "並べ替え",
        sortUpdateDesc: "更新日時新しい順",
        sortUpdateAsc: "更新日時古い順",
        sortCreateDesc: "作成日時新しい順",
        sortCreateAsc: "作成日時古い順",
        sortNameDesc: "五十音昇順",
        sortNameAsc: "五十音降順",
        label: "カラーラベル",
        filterTtl: "カラーフィルター",
        filterRemove: "フィルター解除",
        account: "アカウント",
        decriptionChangeMail: "認証するメールアドレスを変更するにはメールの受信確認が必要になります。変更申請後に届くメールのリンクを開くことで変更が完了します。",
        decriptionRegisterMail: "認証するメールアドレスと任意のパスワード（8文字以上）を入力してください。",
        decriptionNoticeMail: "初めて利用する場合は仮認証となり、メールアドレスの確認が必要になります。仮認証後に届く確認メールのリンクを開くことで認証が完了します。",
        decriptionAuthInit: "他のデバイスでも使用できるように、データをクラウド上に保存することができます。認証方法を選んでください。",
        authEmail: "メールアドレスで認証",
        changeEmail: "メールアドレス変更",
        changePassword: "パスワード変更",
        passwordChangeConfirm: "本当にパスワードを変更してよろしいですか？",
        emailPwInput: "パスワードを入力してください。",
        emailChangePwInput: "認証済みのパスワードを入力してください。",
        changeEmailNotice: "新しいメールアドレスに確認メールを送信しました。リンクからアクセスするとメールアドレス変更が完了します。",
        changePasswordNotice: "パスワードを変更しました。",
        changePasswordErr: "パスワードの変更に失敗しました。",
        resetPassword: "パスワードを忘れた",
        resetPasswordInput: "パスワードの再設定用メールを送信します。登録済みのメールアドレスを入力してください。",
        resetPasswordNotice: "パスワードの再設定用メールを送信しました。",
        resetPasswordErrInvalid: "有効なメールアドレスを入力してください。",
        resetPasswordErrNotfound: "該当するユーザーが見つかりませんでした。",
        resetPasswordErrOther: "パスワード再設定用メールの送信に失敗しました。",
        decriptionChangeMailProgress: "メールアドレス変更のキャンセルについては、元のメールアドレスに届く確認メールをご確認ください。",
        emailErrPw: "パスワードが認証できないか、ユーザーが存在しません。",
        emailErrMany: "失敗回数が多すぎます。後でもう一度やり直してください。",
        emailErrOther: "認証に失敗しました。",
        sendEmailAgain: "確認メールを再度送信",
        sendEmailConfirm: "まだメール認証は完了していません。認証を完了するために確認メールを送信しますか？",
        sendEmailNotice: "確認メールを送信しました。確認メールのリンクからアクセスして認証を完了してください。",
        sendEmailCancel: "確認メールの送信をキャンセルしました。",
        loggingIn: "ログイン中",
        logout: "ログアウト",
        loggedOut: "ログアウトしました。",
        logoutConfirm: "ログアウトするとクラウドの同期も解除されます。本当にログアウトしてよろしいですか？",
        removeAuth: "認証情報をすべて削除",
        removeAuthConfirm: "認証情報を削除するとクラウドに保存されているデータがすべて削除されます。この操作はもとに戻せません。本当に解除してよろしいですか？",
        removeAuthNotice: "認証情報をすべて削除しました。",
        cloud: "クラウド",
        sync: "同期中",
        syncNone: "同期解除中",
        cloudConfirm: "同期を開始すると更新日時の新しいデータで上書きされます。同期を開始してよろしいですか？",
        cloudConfirmStop: "同期を解除すると他のデバイスとの共有ができなくなります。本当に解除してよろしいですか？",
        cloudStart: "同期を開始しました。",
        cloudStop: "同期を解除しました。",
        verifyProgress: "仮認証中",
        stopProgress: "認証手続きをやめる",
        authWithGoogle: "Google認証",
        authWithFacebook: "Facebook認証",
        authWithTwitter: "Twitter認証",
        authWithEmail: "メールアドレス認証",
        loggedInGoogle: "Google認証でログインしました。",
        loggedInFacebook: "Facebook認証でログインしました。",
        loggedInTwitter: "Twitter認証でログインしました。",
        loggedInEmail: "メールアドレス認証でログインしました。",
        inputCheckEmpty: "入力してください。",
        inputCheckEmail: "正しいメールアドレスを入力してください。",
        inputCheckPassword: "パスワードは半角記号英数字8文字以上にしてください。",
        inputCheckSame: "新しいパスワードが古いパスワードと同じです。",
        copyTtl: "コピー",
        copyConfirm: "コピーしてよろしいですか？",
        copyNotice: "コピーしました。",
        deleteTtl: "削除",
        deleteConfirm: "削除してよろしいですか？",
        deleteNotice: "削除しました。",
        lavelRemove: "カラーラベル一括解除",
        favRemove: "ピン留め一括解除",
        markRemove: "文字数設定一括解除",
        localRemove: "ローカル一括削除",
        labelRemoveConfirm: "設定されているカラーラベルを一括解除して、すべてのメモにラベルの設定がない状態にします。この操作はもとに戻せません。本当に解除してよろしいですか？",
        labelRemoveNotice: "カラーラベルを一括解除しました。",
        favRemoveConfirm: "設定されているピン留めを一括解除して、すべてのメモにピン留めの設定がない状態にします。この操作はもとに戻せません。本当に解除してよろしいですか？",
        favRemoveNotice: "ピン留めを一括解除しました。",
        markRemoveConfirm: "設定されている目標文字数を一括解除して、すべてのメモに目標文字数の設定がない状態にします。この操作はもとに戻せません。本当に解除してよろしいですか？",
        markRemoveNotice: "目標文字数設定を一括解除しました。",
        localRemoveConfirm: "すべてのメモデータを一括で完全に削除します。ローカルとクラウドの両方からメモデータが完全に削除されます。この操作はもとに戻せません。本当に削除してよろしいですか？",
        localRemoveNotice: "すべてのメモデータを完全に削除しました。",
        linkConfirm: "リンクを開きますか？",
      },
      en: {
        noticeClose: "Press again to finish",
        noticeEmpty: "There are no applicable items.",
        noticeTrash: "Trash items will be permanently deleted after 30 days.",
        home: "Home",
        update: "updated",
        create: "created",
        edit: "Edit",
        createDate: "Creation date",
        updateDate: "Update date",
        fontSize: "Font size",
        fontSmall: "S",
        fontLarge: "L",
        wordCount: "Word count",
        chars: "characters",
        goal: "Goal achieved",
        goalSet: "Set the desired number of characters",
        goalEmpty: "None",
        total: "total",
        line: "lines",
        lineNum: "Number of lines",
        sheet: "sheets",
        sheetNum: "Number of pages",
        ok: "OK",
        close: "Close",
        cancel: "Cancel",
        backLabel: "back",
        confirm: "Confirm",
        info: "Infomation",
        trashbox: "Trash",
        restore: "Restore",
        restoreTtl: "Restore",
        restoreConfirm: "Are you sure you want to restore it?",
        restoreNotice: "Restored.",
        erasure: "Erasure",
        erasureTtl: "Erasure",
        erasureConfirm: "You cannot redo this operation. Are you sure you want to erasure it?",
        erasureNotice: "Erased it.",
        langSetting: "Language setting",
        other: "Other",
        help: "Help",
        theme: "Screen theme",
        sortTtl: "Sorting",
        sortUpdateDesc: "Updated time, descending",
        sortUpdateAsc: "Updated time, ascending",
        sortCreateDesc: "Created time, descending",
        sortCreateAsc: "Created time, ascending",
        sortNameDesc: "Name A to Z",
        sortNameAsc: "Name Z to A",
        label: "Color label",
        filterTtl: "Color Filter",
        filterRemove: "Filter removal",
        account: "account",
        decriptionChangeMail: "To change the authenticated email address, you need to confirm the receipt of the email. The change will be completed by opening the link in the email you receive after applying for the change.",
        decriptionRegisterMail: "Enter the email address to authenticate and any password (8 characters or more).",
        decriptionNoticeMail: "If you use it for the first time, it will be temporary authentication and you will need to confirm your email address. Authentication will be completed by opening the link in the confirmation email that you will receive after temporary authentication.",
        decriptionAuthInit: "You can store your data in the cloud for use on other devices. Please select an authentication method.",
        authEmail: "Logged in with Email",
        changeEmail: "E-mail address change",
        changePassword: "Password change",
        passwordChangeConfirm: "Are you sure you want to change your password?",
        emailPwInput: "Please enter your password.",
        emailChangePwInput: "Please enter a verified password.",
        changeEmailNotice: "A confirmation email has been sent to your new email address. The email address change will be completed when you access from the link.",
        changePasswordNotice: "Password changed.",
        changePasswordErr: "Password change failed.",
        resetPassword: "Forgot Password?",
        resetPasswordInput: "A password reset email will be sent. Please enter your registered email address.",
        resetPasswordNotice: "We have sent you a password reset email.",
        resetPasswordErrInvalid: "Please enter a valid email address.",
        resetPasswordErrNotfound: "The corresponding user was not found.",
        resetPasswordErrOther: "Failed to send the password reset email.",
        decriptionChangeMailProgress: "For cancellation of email address change, please check the confirmation email that was sent to your original email address.",
        emailErrPw: "The password is invalid or the user does not have a password.",
        emailErrMany: "Too many unsuccessful login attempts. Please try again later.",
        emailErrOther: "Certification failed.",
        sendEmailAgain: "Send confirmation email again",
        sendEmailConfirm: "Email verification has not been completed yet. Would you like to send a confirmation email to complete the verification?",
        sendEmailNotice: "A confirmation email has been sent. Please access from the link in the confirmation email to complete the authentication.",
        sendEmailCancel: "The confirmation email has been cancelled.",
        loggingIn: "Logging in",
        logout: "Log out",
        loggedOut: "Logged out.",
        logoutConfirm: "Logging out also unsynchronizes the cloud. Are you sure you want to log out?",
        removeAuth: "Delete all credentials",
        removeAuthConfirm: "Deleting the credentials will delete all data stored in the cloud. This operation cannot be undone. Are you sure you want to cancel it?",
        removeAuthNotice: "All credentials have been deleted.",
        cloud: "Cloud",
        sync: "In sync",
        syncNone: "Unsyncing",
        cloudConfirm: "When synchronization is started, the new data with the updated date will be overwritten. Are you sure you want to start the sync?",
        cloudConfirmStop: "If you cancel the synchronization, you will not be able to share with other devices. Are you sure you want to cancel it?",
        cloudStart: "Sync has started.",
        cloudStop: "The sync has been released.",
        verifyProgress: "Temporary certification in progress",
        stopProgress: "Stop certification process",
        authWithGoogle: "Logged in with Google",
        authWithFacebook: "Logged in with Facebook",
        authWithTwitter: "Logged in with Twitter",
        authWithEmail: "Logged in with Email",
        loggedInGoogle: "You have logged in with Google.",
        loggedInFacebook: "You have logged in with Facebook.",
        loggedInTwitter: "You have logged in with Twitter.",
        loggedInEmail: "You have logged in with Email.",
        inputCheckEmpty: "Please enter.",
        inputCheckEmail: "Please enter a valid email address.",
        inputCheckPassword: "The password should be 8 alphanumeric characters or more.",
        inputCheckSame: "The new password is the same as the old password.",
        copyTtl: "Copy",
        copyConfirm: "Are you sure you want to copy it?",
        copyNotice: "Copied it.",
        deleteTtl: "Delete",
        deleteConfirm: "Are you sure you want to delete?",
        deleteNotice: "It has been deleted.",
        lavelRemove: "Batch delete color labels",
        favRemove: "Batch delete pin settings",
        markRemove: "Batch delete character count settings",
        localRemove: "Delete all local data at once",
        labelRemoveConfirm: "Clear all the color labels that have been set so that all memos have no label settings. This operation cannot be undone. Are you sure you want to cancel it?",
        labelRemoveNotice: "All color labels have been released.",
        favRemoveConfirm: "All the pinnings that have been set will be canceled so that all memos have no pinning settings. This operation cannot be undone. Are you sure you want to cancel it?",
        favRemoveNotice: "All the pinnings have been released.",
        markRemoveConfirm: "The target number of characters that has been set is canceled all at once, so that all memos do not have the target number of characters set. This operation cannot be undone. Are you sure you want to cancel it?",
        markRemoveNotice: "The target character count settings have been cancelled.",
        localRemoveConfirm: "All memo data will be erased at once. The memo data is erased from both local and cloud. This operation cannot be undone. Are you sure you want to erase it?",
        localRemoveNotice: "All memo data has been erased.",
        linkConfirm: "Open the link?",
      }
    }
  },
  getters: {
    currentLang: (state, getters, rootState) => {
      if (rootState.memoData.selectLang === "en") {
        return state.langData.en;
      } else {
        return (navigator.language === 'ja' || navigator.language === "ja-JP") ? state.langData.ja : state.langData.en
      }
    },
  }
}