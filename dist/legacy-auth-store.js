import { readJSON, writeJSON } from "./legacy-utils.js";

export function getStoredSession() {
    return readJSON("session", null);
}

export function setStoredSession(session) {
    writeJSON("session", session);
}

export function clearStoredSession() {
    localStorage.removeItem("session");
}

export function getStoredPlanForUser(userId) {
    if (!userId) return null;
    const raw = readJSON("plan", {});
    return raw[userId] || null;
}

export function setStoredPlanForUser(userId, plan) {
    if (!userId) return;
    const next = { userId, plan, updatedAt: new Date().toISOString() };
    const raw = readJSON("plan", {});
    raw[userId] = next;
    writeJSON("plan", raw);
}

export function loadLocalUsers() {
    const users = readJSON("users", []);
    return Array.isArray(users) ? users : [];
}

export function saveLocalUsers(users) {
    writeJSON("users", users);
}

export function updateLocalUserById(userId, updater) {
    const users = loadLocalUsers();
    const nextUsers = users.map(user => (user.id === userId ? updater(user) : user));
    saveLocalUsers(nextUsers);
    return nextUsers;
}

export function findLocalUserByEmail(email, normalizeEmail) {
    return loadLocalUsers().find(user => normalizeEmail(user.email) === normalizeEmail(email)) || null;
}

export function createLocalUserRecord(email, passwordHash, salt) {
    return {
        id: `local-${Date.now()}`,
        email,
        passwordHash,
        salt,
        createdAt: new Date().toISOString()
    };
}

export function appendLocalUser(user) {
    const users = loadLocalUsers();
    users.push(user);
    saveLocalUsers(users);
    return user;
}

export function createAndStoreLocalUser(email, passwordHash, salt) {
    return appendLocalUser(createLocalUserRecord(email, passwordHash, salt));
}

export function verifyLocalUserCredentials(email, passwordHash, normalizeEmail) {
    const user = findLocalUserByEmail(email, normalizeEmail);
    if (!user) return { ok: false, code: "local/user-not-found" };
    if (passwordHash !== user.passwordHash) return { ok: false, code: "local/wrong-password" };
    return {
        ok: true,
        user: { id: user.id, email: user.email }
    };
}

export function getLocalAuthUser(user) {
    return { id: user.id, email: user.email };
}
