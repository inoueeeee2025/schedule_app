export function getInitialAuthState() {
    return { isLoggedIn: false, plan: "free", user: null };
}

export function getAuthButtonDisabledState(disabled) {
    return {
        authLoginDisabled: !!disabled,
        signupSubmitDisabled: !!disabled
    };
}

export function runInitialUiSetup(handlers) {
    handlers.seedDefaultCustomTypesIfNeeded();
    handlers.migrateBaseTypesToCustomIfNeeded();
    handlers.bindUIHandlers();
    handlers.setTypePanelOpen(false);
    handlers.renderTypeOptions();
    handlers.renderColorOptions();
    handlers.renderTypeList();
    handlers.bindColorSwatches();
    handlers.applyAuthState(getInitialAuthState());
    handlers.clearSyncMessage();
}

export function applyAuthButtonDisabledState(handlers, disabled) {
    const state = getAuthButtonDisabledState(disabled);
    handlers.setAuthLoginDisabled(state.authLoginDisabled);
    handlers.setSignupSubmitDisabled(state.signupSubmitDisabled);
}

export function getRestoredAuthState(session, storedPlan) {
    if (session && session.userId) {
        return {
            isLoggedIn: true,
            user: { id: session.userId, email: session.email || "" },
            plan: storedPlan && storedPlan.plan ? storedPlan.plan : "free"
        };
    }

    return getInitialAuthState();
}

export function getSignedOutAuthState() {
    return getInitialAuthState();
}

export function buildStoredSessionPayload(user) {
    return {
        userId: user.uid,
        email: user.email || "",
        loggedInAt: new Date().toISOString()
    };
}

export function getPlusAuthState(user) {
    return {
        isLoggedIn: true,
        user: { id: user.id || user.uid, email: user.email || "" },
        plan: "plus"
    };
}

export function buildLocalUserAuth(email, id) {
    return {
        id,
        email: email || ""
    };
}

export function getAuthStateForPlan(user, plan) {
    return {
        isLoggedIn: true,
        user: { id: user.id || user.uid, email: user.email || "" },
        plan: plan || "free"
    };
}

export function getPlusActivationPayload(user) {
    const authUser = { id: user.id || user.uid, email: user.email || "" };
    return {
        authState: getPlusAuthState(authUser),
        session: buildStoredSessionPayload(authUser),
        planUserId: authUser.id
    };
}

export function applyPlusActivation(handlers, user) {
    const activation = getPlusActivationPayload(user);
    handlers.setStoredSession(activation.session);
    handlers.setStoredPlanForUser(activation.planUserId, "plus");
    handlers.applyAuthState(activation.authState);
    return activation;
}
