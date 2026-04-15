export function getSyncStatusText(isLoggedIn, plan) {
    if (!isLoggedIn) {
        return {
            text: "未ログイン",
            showRefresh: false
        };
    }

    if (plan === "plus") {
        return {
            text: " ログイン（Plus：同期中）",
            showRefresh: false
        };
    }

    return {
        text: "同期状態: ログイン（Free：ローカル保存）",
        showRefresh: true
    };
}

export function getNextAuthState(input) {
    return {
        isLoggedIn: !!input.isLoggedIn,
        user: input.user || null,
        plan: input.plan || "free",
        isProUser: (input.plan || "free") === "plus",
        syncEnabled: (input.plan || "free") === "plus"
    };
}

export function getSyncMessageState(message, tone = "warning") {
    return {
        text: message || "",
        className: `sync-message ${tone}`,
        display: message ? "block" : "none"
    };
}

export function getInlineErrorState(message) {
    return {
        text: message || "",
        display: message ? "block" : "none"
    };
}

export function isPermissionDeniedError(err) {
    const code = err && err.code ? String(err.code) : "";
    const message = err && err.message ? String(err.message) : "";
    return code.includes("permission-denied")
        || code.includes("PERMISSION_DENIED")
        || message.includes("permission-denied")
        || message.includes("PERMISSION_DENIED");
}

export function mapAuthErrorMessage(err, context) {
    const code = err && err.code ? String(err.code) : "";
    if (code === "local/email-already-in-use") return "このメールアドレスは既に登録されています。";
    if (code === "local/user-not-found") return "このメールアドレスは登録されていません。";
    if (code === "local/wrong-password") return "パスワードが正しくありません。";
    if (code === "local/invalid-email") return "メール形式が不正です。";
    if (code === "local/weak-password") return "パスワードは8文字以上にしてください。";

    if (context === "signup") {
        if (code === "auth/email-already-in-use") return "このメールアドレスは既に登録されています。";
        if (code === "auth/invalid-email") return "メール形式が不正です。";
        if (code === "auth/weak-password") return "パスワードが弱すぎます。8文字以上にしてください。";
        if (code === "auth/too-many-requests") return "操作回数が多すぎます。時間を置いて再度お試しください。";
        return "新規登録に失敗しました。時間を置いて再度お試しください。";
    }

    if (code === "auth/user-not-found") return "このメールアドレスは登録されていません。";
    if (code === "auth/wrong-password") return "パスワードが正しくありません。";
    if (code === "auth/invalid-credential") return "メールアドレスまたはパスワードが正しくありません。";
    if (code === "auth/invalid-email") return "メール形式が不正です。";
    if (code === "auth/too-many-requests") return "操作回数が多すぎます。時間を置いて再度お試しください。";
    return "ログインに失敗しました。メールとパスワードをご確認ください。";
}

export function getModalDisplayState(isOpen) {
    return isOpen ? "flex" : "none";
}

export function getAccountFieldState(isOpen) {
    return {
        classOpen: !!isOpen,
        ariaHidden: String(!isOpen),
        ariaExpanded: String(!!isOpen)
    };
}

export function getAccountModalFormState(userEmail) {
    return {
        email: userEmail || "",
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: ""
    };
}

export function getSignupModalFormState() {
    return {
        email: "",
        password: "",
        passwordConfirm: "",
        termsChecked: false
    };
}

export function getUpgradeFlowTarget(isLoggedIn) {
    return isLoggedIn ? "payment" : "signup";
}

export function getAuthSuccessCloseState({ closeAuth = false, closePlus = false, closeSignup = false, closePayment = false } = {}) {
    return {
        closeAuth: !!closeAuth,
        closePlus: !!closePlus,
        closeSignup: !!closeSignup,
        closePayment: !!closePayment,
        clearPendingUpgrade: true
    };
}

export function getAuthReadyErrorMessage(firebaseInitFailed) {
    return firebaseInitFailed
        ? "認証の初期化に失敗しました。再読み込みしてください。"
        : "認証の初期化中です。少し待ってから再度お試しください。";
}

export function validateLoginForm({ email, password, isValidEmail }) {
    if (!email || !password) return "メールとパスワードを入力してください。";
    if (!isValidEmail(email)) return "メール形式が不正です。";
    return "";
}

export function validateSignupForm({ email, password, passwordConfirm, agreed, isValidEmail }) {
    if (!email || !password || !passwordConfirm) return "メールとパスワードを入力してください。";
    if (!isValidEmail(email)) return "メール形式が不正です。";
    if (password.length < 8) return "パスワードは8文字以上で入力してください。";
    if (password !== passwordConfirm) return "パスワードが一致しません。";
    if (!agreed) return "利用規約への同意が必要です。";
    return "";
}

export function validateAccountEmailForm({ email, isValidEmail }) {
    if (!email) return "メールアドレスを入力してください。";
    if (!isValidEmail(email)) return "メール形式が不正です。";
    return "";
}

export function validateAccountPasswordForm({ currentPassword, nextPassword, nextPasswordConfirm }) {
    if (!currentPassword || !nextPassword || !nextPasswordConfirm) {
        return "現在のパスワードと新しいパスワードを入力してください。";
    }
    if (nextPassword.length < 8) return "パスワードは8文字以上にしてください。";
    if (nextPassword !== nextPasswordConfirm) return "新しいパスワードが一致しません。";
    return "";
}

export function getAccountUpdateSuccessMessage(target) {
    if (target === "email") return "メールアドレスを変更しました。";
    if (target === "password") return "パスワードを変更しました。";
    return "";
}

export function getRequiresRecentLoginMessage() {
    return "再ログインが必要です。ログアウト後、再度お試しください。";
}
