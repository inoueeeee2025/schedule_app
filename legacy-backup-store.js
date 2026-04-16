import { loadTodoMemo, loadTodos, saveTodoMemo, saveTodos } from "./legacy-todo-store.js";
import { collectAllLocalEvents, resetLocalEvents } from "./legacy-event-store.js";

const currentBackupKey = "local-data-backup";
const undoStackKey = "local-data-backup-undo";
const redoStackKey = "local-data-backup-redo";
const maxHistorySize = 1;

function getTodoDateKeys() {
    const todoKeys = Object.keys(localStorage)
        .filter(key => key.startsWith("todos-"))
        .map(key => key.replace("todos-", ""));
    const memoKeys = Object.keys(localStorage)
        .filter(key => key.startsWith("todo-memo-"))
        .map(key => key.replace("todo-memo-", ""));
    return [...new Set([...todoKeys, ...memoKeys])];
}

function clearStoredTodos() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("todos-") || key.startsWith("todo-memo-")) {
            localStorage.removeItem(key);
        }
    });
}

function readStoredJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeStoredJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function saveWithQuotaFallback(key, value) {
    try {
        writeStoredJson(key, value);
        return true;
    } catch {
        return false;
    }
}

function createLocalDataSnapshot(days) {
    const todoDates = getTodoDateKeys();
    return {
        savedAt: new Date().toISOString(),
        events: collectAllLocalEvents(days),
        todos: todoDates.map(dateISO => ({
            dateISO,
            items: loadTodos(dateISO),
            memo: loadTodoMemo(dateISO)
        }))
    };
}

function getSnapshotFingerprint(snapshot) {
    if (!snapshot) return "";
    return JSON.stringify({
        events: Array.isArray(snapshot.events) ? snapshot.events : [],
        todos: Array.isArray(snapshot.todos) ? snapshot.todos : []
    });
}

function loadStack(key) {
    const stack = readStoredJson(key, []);
    return Array.isArray(stack) ? stack : [];
}

function saveStack(key, stack) {
    const trimmed = stack.slice(-maxHistorySize);
    if (saveWithQuotaFallback(key, trimmed)) return;
    saveWithQuotaFallback(key, trimmed.slice(-1));
}

function saveCurrentSnapshot(snapshot) {
    return saveWithQuotaFallback(currentBackupKey, snapshot);
}

function applySnapshot(days, snapshot) {
    if (!snapshot) return false;
    resetLocalEvents(days, Array.isArray(snapshot.events) ? snapshot.events : []);
    clearStoredTodos();
    (snapshot.todos || []).forEach(entry => {
        if (!entry || !entry.dateISO) return;
        saveTodos(entry.dateISO, entry.items || []);
        saveTodoMemo(entry.dateISO, entry.memo || "");
    });
    return true;
}

function moveStackSnapshot(sourceKey, destinationKey, currentSnapshot, days) {
    const source = loadStack(sourceKey);
    if (!source.length) return false;
    const nextSnapshot = source.pop();
    const destination = loadStack(destinationKey);
    if (currentSnapshot) destination.push(currentSnapshot);
    saveStack(sourceKey, source);
    saveStack(destinationKey, destination);
    const restored = applySnapshot(days, nextSnapshot);
    if (!restored) return false;
    saveCurrentSnapshot(nextSnapshot);
    return true;
}

export function saveLocalDataBackup(days) {
    const nextSnapshot = createLocalDataSnapshot(days);
    const currentSnapshot = loadLocalDataBackup();
    if (getSnapshotFingerprint(currentSnapshot) === getSnapshotFingerprint(nextSnapshot)) {
        if (!currentSnapshot) {
            const ok = saveCurrentSnapshot(nextSnapshot);
            return ok ? nextSnapshot : null;
        }
        return nextSnapshot;
    }
    const undoStack = loadStack(undoStackKey);
    if (currentSnapshot) undoStack.push(currentSnapshot);
    saveStack(undoStackKey, undoStack);
    saveStack(redoStackKey, []);
    const saved = saveCurrentSnapshot(nextSnapshot);
    return saved ? nextSnapshot : null;
}

export function loadLocalDataBackup() {
    return readStoredJson(currentBackupKey, null);
}

export function hasLocalDataBackup() {
    return !!loadLocalDataBackup();
}

export function restoreLocalDataBackup(days) {
    const snapshot = loadLocalDataBackup();
    if (!snapshot) return false;
    return applySnapshot(days, snapshot);
}

export function canUndoLocalDataBackup() {
    return loadStack(undoStackKey).length > 0;
}

export function canRedoLocalDataBackup() {
    return loadStack(redoStackKey).length > 0;
}

export function undoLocalDataBackup(days) {
    return moveStackSnapshot(undoStackKey, redoStackKey, loadLocalDataBackup(), days);
}

export function redoLocalDataBackup(days) {
    return moveStackSnapshot(redoStackKey, undoStackKey, loadLocalDataBackup(), days);
}

function getSnapshotLabel(snapshot) {
    if (!snapshot || !snapshot.savedAt) return "";
    const savedAt = new Date(snapshot.savedAt);
    if (Number.isNaN(savedAt.getTime())) return "";
    return `${savedAt.getMonth() + 1}/${savedAt.getDate()} ${String(savedAt.getHours()).padStart(2, "0")}:${String(savedAt.getMinutes()).padStart(2, "0")}`;
}

export function getLocalDataBackupLabel() {
    return getSnapshotLabel(loadLocalDataBackup());
}

export function getUndoLocalDataLabel() {
    const stack = loadStack(undoStackKey);
    return getSnapshotLabel(stack[stack.length - 1]);
}

export function getRedoLocalDataLabel() {
    const stack = loadStack(redoStackKey);
    return getSnapshotLabel(stack[stack.length - 1]);
}

export function purgeLocalDataBackups() {
    localStorage.removeItem(currentBackupKey);
    localStorage.removeItem(undoStackKey);
    localStorage.removeItem(redoStackKey);
}
