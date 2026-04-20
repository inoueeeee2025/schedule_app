import {
    format,
    getMondayBasedDayIndex,
    getWeekDate,
    getWeekStart,
    parseTime,
    readJSON,
    readText,
    toISODate,
    toJPLabel,
    writeJSON,
    writeText
} from "./legacy-utils.js";
import {
    baseEventTypes,
    customTypePalette,
    getAllTypes,
    getBaseTypes,
    getCustomTypeById,
    getVisibleCustomTypes,
    loadBaseTypeOverrides,
    loadCustomTypes,
    loadDeletedBaseTypes,
    loadTypeLabelCache,
    rebuildCustomTypesFromEvents,
    removeTypeLabelCache,
    resolveTypeMeta,
    saveBaseTypeOverrides,
    saveCustomTypes,
    saveDeletedBaseTypes,
    saveTypeLabelCache,
    syncTypeLabelCacheFromEvents,
    syncTypeLabelCacheFromTypes,
    typeLabelCacheKey,
    updateTypeLabelCache,
    ensureCustomTypesFromCache
} from "./legacy-type-store.js";
import {
    addTodoItem,
    clearCompletedTodoItems,
    deleteTodoItem,
    editTodoItem,
    loadTodoMemo,
    loadTodos,
    saveTodoMemo,
    saveTodos,
    toggleTodoItem,
    todoKey,
    todoMemoKey
} from "./legacy-todo-store.js";
import {
    createAndStoreLocalUser,
    clearStoredSession,
    findLocalUserByEmail,
    getLocalAuthUser,
    getStoredPlanForUser,
    getStoredSession,
    loadLocalUsers,
    saveLocalUsers,
    setStoredPlanForUser,
    setStoredSession,
    updateLocalUserById,
    verifyLocalUserCredentials
} from "./legacy-auth-store.js";
import {
    getAccountFieldState,
    getAccountModalFormState,
    getAccountUpdateSuccessMessage,
    getAuthReadyErrorMessage,
    getAuthSuccessCloseState,
    getModalDisplayState,
    getRequiresRecentLoginMessage,
    getSignupModalFormState,
    getInlineErrorState,
    getNextAuthState,
    getSyncMessageState,
    getSyncStatusText,
    getUpgradeFlowTarget,
    isPermissionDeniedError,
    mapAuthErrorMessage,
    validateAccountEmailForm,
    validateAccountPasswordForm,
    validateLoginForm,
    validateSignupForm
} from "./legacy-auth-view.js";
import {
    backfillEventTypeMeta as backfillStoredEventTypeMeta,
    collectWeekEvents as collectStoredWeekEvents,
    collectAllLocalEvents as collectStoredEvents,
    deleteEventByScope as deleteStoredEventByScope,
    generateRepeatDates,
    loadEventsForDay,
    moveEventToDay,
    resetLocalEvents as resetStoredEvents,
    saveEventSeries,
    saveEventsForDay
} from "./legacy-event-store.js";
import {
    buildMovedEvent,
    buildBulkEventLabel,
    buildDatePickerCalendarModel,
    buildDatePickerDays,
    buildDatePickerMonths,
    buildDatePickerYears,
    buildEventLabel,
    buildTimelineHourMarks,
    buildWeekHeaderItems,
    buildWeekLabel,
    collectBulkDeleteTargets,
    getEventColorStyle,
    getEventCompletionState,
    getEventPositionStyle,
    getTimelineCreateEventState,
    getTimelineHeight,
    getSafeDatePickerDay,
    getCurrentDayHeaderIndex,
    getWeekRange,
    groupEventsByDay,
    parseDraggedEvent,
    serializeDraggedEvent,
    shouldIgnoreEventClick,
    sortEventsByDateTime
} from "./legacy-event-view.js";
import {
    buildEventDraft,
    getClosedEventModalState,
    getEventModalState,
    getOpenedEventModalState
} from "./legacy-event-modal.js";
import { buildTodoPanelLabel, getMemoButtonLabel } from "./legacy-todo-view.js";
import {
    canRedoLocalDataBackup,
    canUndoLocalDataBackup,
    getRedoLocalDataLabel,
    getUndoLocalDataLabel,
    hasLocalDataBackup,
    purgeLocalDataBackups,
    redoLocalDataBackup,
    saveLocalDataBackup,
    undoLocalDataBackup
} from "./legacy-backup-store.js";
import {
    buildNewTypeDraft,
    buildTypeListItems,
    findSelectedType,
    findExistingTypeByLabel,
    getDefaultTypeColor,
    getTypeSelectState,
    normalizeTypeLabel,
    resolveTypeEditTarget
} from "./legacy-type-view.js";
import {
    applyPlusActivation,
    applyAuthButtonDisabledState,
    buildLocalUserAuth,
    buildStoredSessionPayload,
    getAuthStateForPlan,
    getPlusActivationPayload,
    getPlusAuthState,
    getSignedOutAuthState,
    getRestoredAuthState,
    runInitialUiSetup
} from "./legacy-app-init.js";

const days = ["月", "火", "水", "木", "金", "土", "日"];
const startHour = 6;
const endHour = 24;
const hourHeight = 40;

const weekView = document.getElementById("weekView");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const titleInput = document.getElementById("title");
const typeSelect = document.getElementById("type");
const typePickerBtn = document.getElementById("typePickerBtn");
const typePickerPanel = document.getElementById("typePickerPanel");
const typePickerList = document.getElementById("typePickerList");
const typeNewInput = document.getElementById("typeNew");
const typeAddBtn = document.getElementById("typeAdd");
const typeAddOpenBtn = document.getElementById("typeAddOpen");
const typeAddCloseBtn = document.getElementById("typeAddClose");
const typeAddPanel = document.getElementById("typeAddPanel");
const typeColorInput = document.getElementById("typeColor");
const typeColorPreview = document.getElementById("typeColorPreview");
const typeColorFreeBtn = document.getElementById("typeColorFreeBtn");
const typeEditSaveBtn = document.getElementById("typeEditSave");
const typeEditCancelBtn = document.getElementById("typeEditCancel");
const typeList = document.getElementById("typeList");
const tapToggleInput = document.getElementById("tapToggle");
const startInput = document.getElementById("start");
const endInput = document.getElementById("end");
const saveBtn = document.getElementById("save");
const deleteBtn = document.getElementById("delete");
const cancelBtn = document.getElementById("cancel");
const deleteScopeRow = document.getElementById("deleteScopeRow");
const deleteScopeSelect = document.getElementById("deleteScope");
const bulkOpenBtn = document.getElementById("bulkDeleteOpen");
const bulkModal = document.getElementById("bulkModal");
const bulkList = document.getElementById("bulkList");
const bulkDeleteBtn = document.getElementById("bulkDelete");
const bulkCancelBtn = document.getElementById("bulkCancel");
const bulkDeleteScope = document.getElementById("bulkDeleteScope");
// 先頭の取得群に追加
const repeatSelect = document.getElementById('repeat');
const todoPanel = document.getElementById("todoPanel");
const todoDateLabel = document.getElementById("todoDateLabel");
const todoInput = document.getElementById("todoInput");
const todoAdd = document.getElementById("todoAdd");
const todoList = document.getElementById("todoList");
const todoMemo = document.getElementById("todoMemo");
const todoMemoText = document.getElementById("todoMemoText");
const todoMemoEdit = document.getElementById("todoMemoEdit");
const todoMemoSave = document.getElementById("todoMemoSave");
const todoClose = document.getElementById("todoClose");
const todoClearDone = document.getElementById("todoClearDone");
const plusOpenBtn = document.getElementById("plusOpen");
const authOpenBtn = document.getElementById("authOpen");
const accountOpenBtn = document.getElementById("authAccount");
const authModal = document.getElementById("authModal");
const accountModal = document.getElementById("accountModal");
const plusModal = document.getElementById("plusModal");
const signupModal = document.getElementById("signupModal");
const paymentModal = document.getElementById("paymentModal");
const authCancelBtn = document.getElementById("authCancel");
const accountCloseBtn = document.getElementById("accountClose");
const plusCloseBtn = document.getElementById("plusClose");
const signupCancelBtn = document.getElementById("signupCancel");
const paymentBackBtn = document.getElementById("paymentBack");
const upgradeBtn = document.getElementById("upgradeBtn");
const accountLogoutBtn = document.getElementById("accountLogout");
const accountCancelBtn = document.getElementById("accountCancel");
const accountEmailToggleBtn = document.getElementById("accountEmailToggle");
const accountPasswordToggleBtn = document.getElementById("accountPasswordToggle");
const accountEmailFields = document.getElementById("accountEmailFields");
const accountPasswordFields = document.getElementById("accountPasswordFields");
const accountEmailCloseBtn = document.getElementById("accountEmailClose");
const accountPasswordCloseBtn = document.getElementById("accountPasswordClose");
const accountEmailInput = document.getElementById("accountEmail");
const accountCurrentPassword = document.getElementById("accountCurrentPassword");
const accountNewPassword = document.getElementById("accountNewPassword");
const accountNewPasswordConfirm = document.getElementById("accountNewPasswordConfirm");
const accountEmailUpdateBtn = document.getElementById("accountEmailUpdate");
const accountPasswordUpdateBtn = document.getElementById("accountPasswordUpdate");
const accountEmailError = document.getElementById("accountEmailError");
const accountPasswordError = document.getElementById("accountPasswordError");
const accountError = document.getElementById("accountError");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authLoginBtn = document.getElementById("authLogin");
const authError = document.getElementById("authError");
const plusLoginOpenBtn = document.getElementById("plusLoginOpen");
const plusChangeBtn = document.getElementById("plusChange");
const plusError = document.getElementById("plusError");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
const signupTerms = document.getElementById("signupTerms");
const signupSubmitBtn = document.getElementById("signupSubmit");
const signupError = document.getElementById("signupError");
const paymentSubmitBtn = document.getElementById("paymentSubmit");
const paymentError = document.getElementById("paymentError");
const authStatus = document.getElementById("authStatus");
const weekLabelBtn = document.getElementById("weekLabel");
const datePickerModal = document.getElementById("datePickerModal");
const datePickerYear = document.getElementById("datePickerYear");
const datePickerMonth = document.getElementById("datePickerMonth");
const datePickerDay = document.getElementById("datePickerDay");
const datePickerSearch = document.getElementById("datePickerSearch");
const datePickerCalendarToggle = document.getElementById("datePickerCalendarToggle");
const datePickerCalendar = document.getElementById("datePickerCalendar");
const syncRefreshBtn = document.getElementById("syncRefresh");
const undoBackupBtn = document.getElementById("undoBackup");
const redoBackupBtn = document.getElementById("redoBackup");
const syncMessage = document.getElementById("syncMessage");

function setAuthUI(isLoggedIn, plan) {
    const isPlus = plan === "plus";
    if (plusOpenBtn) plusOpenBtn.style.display = isPlus ? "none" : "inline-block";
    if (authOpenBtn) authOpenBtn.style.display = isLoggedIn ? "none" : "inline-block";
    if (accountOpenBtn) accountOpenBtn.style.display = isLoggedIn ? "inline-block" : "none";
    if (!isLoggedIn && syncRefreshBtn) syncRefreshBtn.style.display = "none";
}

// 現在表示中のToDoのキー（日付）を保持
let currentTodoDateKey = null;

// Auth state
const authState = {
    isLoggedIn: false,
    plan: "free",
    user: null
};

// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuIzaGH_zFUGOyvg_Gt_bB1yBger-1IcQ",
    authDomain: "schedule-806c9.firebaseapp.com",
    projectId: "schedule-806c9",
    storageBucket: "schedule-806c9.firebasestorage.app",
    messagingSenderId: "223251388130",
    appId: "1:223251388130:web:23c4b2299a90b18daa70bb",
    measurementId: "G-JTXE30GS9X"
};
let firebaseApp = null;
let firebaseAuth = null;
let firestore = null;
let firebaseInitPromise = null;
let firebaseInitFailed = false;
let currentUid = null;
let currentUser = null;
let isProUser = false;
let syncEnabled = false;
let lastEventsMutationAt = 0;
let lastTodosMutationAt = 0;

let selectedDay = null;
let modalSelectedDate = null;
let editingEvent = null;
let currentWeek = new Date();
let pendingUpgrade = false;

let editingTypeId = null;
let editingTypeIsBase = false;
let typePanelLastFocus = null;
const eventDraftStorageKey = "event-modal-draft";
const currentWeekStorageKey = "current-week";
const currentTodoDateStorageKey = "current-todo-date";
const eventsDirtyStorageKey = "events-dirty";
const todosDirtyStorageKey = "todos-dirty";
const eventsMutationAtStorageKey = "events-mutation-at";
const eventsSyncedAtStorageKey = "events-synced-at";
const todosMutationAtStorageKey = "todos-mutation-at";
const todosSyncedAtStorageKey = "todos-synced-at";
const debugEventLogStorageKey = "debug-event-log";
const debugEventLogLimit = 200;

const seededTypeLabelCacheKey = "seeded-type-label-cache";
const seededCustomTypesKey = "seeded-custom-types";

function seedDefaultCustomTypesIfNeeded() {
    const alreadySeeded = localStorage.getItem(seededCustomTypesKey) === "1";
    const existing = loadCustomTypes();
    if (alreadySeeded || existing.length) return;
    const seed = [
        { label: "学校", color: "rgba(34, 34, 34, 0.75)" },
        { label: "バイト", color: "rgba(139, 94, 59, 0.8)" },
        { label: "おでかけ", color: "rgba(246, 195, 68, 0.7)" },
        { label: "サークル", color: "rgba(124, 199, 255, 0.75)" },
        { label: "用事", color: "rgba(18, 48, 96, 0.75)" },
        { label: "運動", color: "rgba(255, 140, 0, 0.75)" }
    ].map((t, idx) => ({
        id: `custom-seed-${idx}-${Date.now()}`,
        label: t.label,
        color: t.color
    }));
    saveCustomTypes(seed);
    const cache = loadTypeLabelCache();
    seed.forEach(t => {
        cache[t.id] = { label: t.label, color: t.color };
    });
    saveTypeLabelCache(cache);
    localStorage.setItem(seededCustomTypesKey, "1");
}

function migrateBaseTypesToCustomIfNeeded() {
    const alreadyMigrated = localStorage.getItem(seededTypeLabelCacheKey) === "1";
    if (alreadyMigrated) return;
    const seed = [
        { label: "学校", color: "rgba(34, 34, 34, 0.75)" },
        { label: "バイト", color: "rgba(139, 94, 59, 0.8)" },
        { label: "おでかけ", color: "rgba(246, 195, 68, 0.7)" },
        { label: "サークル", color: "rgba(124, 199, 255, 0.75)" },
        { label: "用事", color: "rgba(18, 48, 96, 0.75)" },
        { label: "運動", color: "rgba(255, 140, 0, 0.75)" }
    ];
    const customTypes = loadCustomTypes();
    const existingLabels = new Set(customTypes.map(t => t.label));
    const next = [...customTypes];
    seed.forEach((t, idx) => {
        if (existingLabels.has(t.label)) return;
        next.push({
            id: `custom-seed-${idx}-${Date.now()}`,
            label: t.label,
            color: t.color
        });
    });
    if (next.length !== customTypes.length) {
        saveCustomTypes(next);
        const cache = loadTypeLabelCache();
        next.forEach(t => {
            if (!cache[t.id]) cache[t.id] = { label: t.label, color: t.color };
        });
        saveTypeLabelCache(cache);
    }
    localStorage.setItem(seededTypeLabelCacheKey, "1");
}

function setTypePickerOpen(nextState) {
    if (!typePickerPanel || !typePickerBtn) return;
    const willOpen = typeof nextState === "boolean"
        ? nextState
        : !typePickerPanel.classList.contains("open");
    typePickerPanel.classList.toggle("open", willOpen);
    typePickerPanel.setAttribute("aria-hidden", willOpen ? "false" : "true");
    typePickerBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    if (willOpen) typePickerPanel.focus();
}

function applyTypePickerSelection(typeId) {
    if (!typeSelect) return;
    typeSelect.value = typeId;
    typeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    setTypePickerOpen(false);
}

function renderTypePicker(types, selectedId) {
    if (!typePickerBtn || !typePickerList) return;
    const list = typePickerList;
    list.innerHTML = "";
    if (!Array.isArray(types) || types.length === 0) {
        const empty = document.createElement("div");
        empty.className = "type-picker-item";
        empty.textContent = "種類がありません";
        empty.setAttribute("aria-disabled", "true");
        list.appendChild(empty);
        return;
    }
    const selectedType = findSelectedType(types, selectedId, resolveTypeMeta);
    const swatch = typePickerBtn.querySelector(".type-picker-swatch");
    const label = typePickerBtn.querySelector(".type-picker-label");
    if (swatch) swatch.style.background = selectedType?.color || "#cbd5e1";
    if (label) label.textContent = selectedType?.label || "種類を選択";

    types.forEach(t => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "type-picker-item";
        const isSelected = selectedType && t.id === selectedType.id;
        if (isSelected) item.classList.add("is-selected");
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", isSelected ? "true" : "false");
        item.addEventListener("click", () => applyTypePickerSelection(t.id));

        const itemSwatch = document.createElement("span");
        itemSwatch.className = "type-picker-swatch";
        itemSwatch.style.background = t.color;

        const itemLabel = document.createElement("span");
        itemLabel.textContent = t.label;

        item.appendChild(itemSwatch);
        item.appendChild(itemLabel);
        const actions = document.createElement("span");
        actions.className = "type-picker-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "編集";
        editBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTypePickerOpen(false);
            setTypePanelOpen(true);
            renderColorOptions(t.color);
            renderTypeList();
            bindColorSwatches();
            startEditType(t.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "削除";
        deleteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteType(t.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        item.appendChild(actions);
        list.appendChild(item);
    });
}

function renderTypeOptions(selectedId, selectedLabel) {
    if (!typeSelect) return;
    const allTypes = getAllTypes();
    const state = getTypeSelectState(allTypes, selectedId, selectedLabel, resolveTypeMeta);
    typeSelect.innerHTML = "";
    state.options.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        typeSelect.appendChild(opt);
    });
    if (!state.options.length) return;
    typeSelect.value = state.value;
    renderTypePicker(allTypes, typeSelect.value);
}

function renderColorOptions(selectedValue) {
    if (!typeColorInput) return;
    const value = getDefaultTypeColor(selectedValue, customTypePalette);
    applyTypeColor(value);
}

function syncPaletteActive(color) {
    const buttons = document.querySelectorAll(".color-swatch");
    buttons.forEach(btn => {
        const swatch = btn.getAttribute("data-color");
        if (swatch && swatch.toLowerCase() === String(color).toLowerCase()) {
            btn.classList.add("is-active");
        } else {
            btn.classList.remove("is-active");
        }
    });
}

function applyTypeColor(color) {
    if (!typeColorInput) return;
    typeColorInput.value = color;
    if (typeColorPreview) typeColorPreview.style.background = color;
    syncPaletteActive(color);
}

function bindColorSwatches() {
    const buttons = document.querySelectorAll(".color-swatch");
    buttons.forEach(btn => {
        if (btn.dataset.bound === "1") return;
        btn.dataset.bound = "1";
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const color = btn.getAttribute("data-color");
            if (!color) return;
            applyTypeColor(color);
        });
    });
}

function renderTypeList() {
    if (!typeList) return;
    const allTypes = buildTypeListItems(getAllTypes());
    typeList.innerHTML = "";
    if (allTypes.length === 0) {
        const empty = document.createElement("li");
        empty.className = "type-item";
        empty.textContent = "追加した種類はありません";
        typeList.appendChild(empty);
        return;
    }
    allTypes.forEach(t => {
        const li = document.createElement("li");
        li.className = "type-item";

        const swatch = document.createElement("span");
        swatch.className = "type-swatch";
        swatch.style.background = t.color;

        const name = document.createElement("span");
        name.textContent = t.label;

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "編集";
        editBtn.addEventListener("click", () => startEditType(t.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "削除";
        deleteBtn.addEventListener("click", () => deleteType(t.id));

        li.appendChild(swatch);
        li.appendChild(name);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        typeList.appendChild(li);
    });
}

function updateSyncStatus() {
    const state = getSyncStatusText(authState.isLoggedIn, authState.plan);
    authStatus.textContent = state.text;
    if (syncRefreshBtn) syncRefreshBtn.style.display = state.showRefresh ? "inline-block" : "none";
}

function applyAuthState({ isLoggedIn, user, plan }) {
    const nextState = getNextAuthState({ isLoggedIn, user, plan });
    authState.isLoggedIn = nextState.isLoggedIn;
    authState.user = nextState.user;
    authState.plan = nextState.plan;
    isProUser = nextState.isProUser;
    syncEnabled = nextState.syncEnabled;
    setAuthUI(authState.isLoggedIn, authState.plan);
    updateSyncStatus();
    if (accountOpenBtn) accountOpenBtn.disabled = !authState.isLoggedIn;
    if (!authState.isLoggedIn && accountModal) closeAccountModal();
}

function initLocalSessionState() {
    const session = getStoredSession();
    const storedPlan = session && session.userId ? getStoredPlanForUser(session.userId) : null;
    applyAuthState(getRestoredAuthState(session, storedPlan));
}

function clearSyncMessage() {
    if (!syncMessage) return;
    const state = getSyncMessageState("", "warning");
    syncMessage.textContent = state.text;
    syncMessage.className = state.className;
    syncMessage.style.display = state.display;
    if (upgradeBtn) upgradeBtn.classList.remove("attention");
}

function showSyncMessage(message, tone = "warning") {
    if (!syncMessage) return;
    const state = getSyncMessageState(message, tone);
    syncMessage.textContent = state.text;
    syncMessage.className = state.className;
    syncMessage.style.display = state.display;
}

function updateBackupUi() {
    const hasBackup = hasLocalDataBackup();
    if (undoBackupBtn) {
        const canUndo = hasBackup && canUndoLocalDataBackup();
        undoBackupBtn.disabled = !canUndo;
        const label = getUndoLocalDataLabel();
        undoBackupBtn.title = label ? `元に戻す ${label}` : "元に戻す";
        undoBackupBtn.setAttribute("aria-label", label ? `元に戻す ${label}` : "元に戻す");
    }
    if (redoBackupBtn) {
        const canRedo = hasBackup && canRedoLocalDataBackup();
        redoBackupBtn.disabled = !canRedo;
        const label = getRedoLocalDataLabel();
        redoBackupBtn.title = label ? `取り消し ${label}` : "取り消し";
        redoBackupBtn.setAttribute("aria-label", label ? `取り消し ${label}` : "取り消し");
    }
}

function hasAnyLocalTodoData() {
    return Object.keys(localStorage).some(key => key.startsWith("todos-") || key.startsWith("todo-memo-"));
}

function snapshotLocalData() {
    const backup = saveLocalDataBackup(days);
    if (!backup) {
        console.warn("[backup] local backup skipped due to storage quota");
    }
    updateBackupUi();
}

function cleanupLegacyStoragePressure() {
    localStorage.removeItem("debug-event-log");
    try {
        const hasPressure = saveLocalDataBackup(days) === null;
        if (hasPressure) {
            purgeLocalDataBackups();
        }
    } catch {
        purgeLocalDataBackups();
    }
}

function ensureInitialBackup() {
    if (hasLocalDataBackup()) {
        updateBackupUi();
        return;
    }
    if (!collectAllLocalEvents().length && !hasAnyLocalTodoData()) {
        updateBackupUi();
        return;
    }
    snapshotLocalData();
}

function refreshAfterHistoryRestore(message) {
    markEventsDirty();
    markTodosDirty();
    renderEvents();
    updateWeekView();
    highlightCurrentDay();
    if (currentTodoDateKey) {
        renderTodoList(currentTodoDateKey);
        renderTodoMemo(currentTodoDateKey);
    }
    showSyncMessage(message, "success");
    updateBackupUi();
    syncEventsToRemote();
    syncTodosToRemote(currentTodoDateKey || undefined);
}

function undoLocalChanges() {
    if (!undoLocalDataBackup(days)) return;
    refreshAfterHistoryRestore("1つ前の状態に戻しました。");
}

function redoLocalChanges() {
    if (!redoLocalDataBackup(days)) return;
    refreshAfterHistoryRestore("取り消した変更を戻しました。");
}

function setInlineError(el, message) {
    if (!el) return;
    const state = getInlineErrorState(message);
    el.textContent = state.text;
    el.style.display = state.display;
}

function setButtonLoading(button, isLoading, loadingLabel) {
    if (!button) return;
    if (isLoading) {
        if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
        button.textContent = loadingLabel;
        button.disabled = true;
    } else {
        button.textContent = button.dataset.originalText || button.textContent;
        button.disabled = false;
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeEmail(email) {
    return (email || "").trim().toLowerCase();
}

function getDebugEventSnapshot() {
    const localEvents = collectStoredEvents(days);
    return {
        currentWeek: currentWeek instanceof Date && !Number.isNaN(currentWeek.getTime()) ? currentWeek.toISOString() : null,
        visibleWeek: buildWeekLabel(currentWeek),
        localEventCount: localEvents.length,
        localEvents: localEvents.map(ev => ({
            id: ev.id,
            baseId: ev.baseId,
            title: ev.title,
            day: ev.day,
            date: ev.date,
            start: ev.start,
            end: ev.end
        }))
    };
}

function pushDebugEventLog(label, extra = {}) {
    try {
        const entry = {
            at: new Date().toISOString(),
            label,
            ...extra,
            snapshot: {
                currentWeek: currentWeek instanceof Date && !Number.isNaN(currentWeek.getTime()) ? currentWeek.toISOString() : null,
                localEventCount: collectStoredEvents(days).length
            }
        };
        const raw = sessionStorage.getItem(debugEventLogStorageKey);
        const logs = raw ? JSON.parse(raw) : [];
        const nextLogs = Array.isArray(logs) ? [...logs, entry].slice(-debugEventLogLimit) : [entry];
        sessionStorage.setItem(debugEventLogStorageKey, JSON.stringify(nextLogs));
        console.log("[schedule-debug]", entry);
    } catch (error) {
        console.warn("[schedule-debug] failed to write log", error);
    }
}

function saveCurrentWeekState() {
    if (!(currentWeek instanceof Date) || Number.isNaN(currentWeek.getTime())) return;
    localStorage.setItem(currentWeekStorageKey, currentWeek.toISOString());
}

function restoreCurrentWeekState() {
    const raw = localStorage.getItem(currentWeekStorageKey);
    if (!raw) return;
    const restored = new Date(raw);
    if (Number.isNaN(restored.getTime())) return;
    currentWeek = restored;
}

function saveCurrentTodoState(dateISO) {
    if (!dateISO) {
        localStorage.removeItem(currentTodoDateStorageKey);
        return;
    }
    localStorage.setItem(currentTodoDateStorageKey, dateISO);
}

function restoreCurrentTodoState() {
    const dateISO = localStorage.getItem(currentTodoDateStorageKey);
    if (!dateISO) return;
    const restored = new Date(dateISO);
    if (Number.isNaN(restored.getTime())) return;
    openTodoForDate(restored);
}

function markEventsDirty() {
    lastEventsMutationAt = Date.now();
    localStorage.setItem(eventsMutationAtStorageKey, String(lastEventsMutationAt));
    localStorage.setItem(eventsDirtyStorageKey, "1");
}

function markTodosDirty() {
    lastTodosMutationAt = Date.now();
    localStorage.setItem(todosMutationAtStorageKey, String(lastTodosMutationAt));
    localStorage.setItem(todosDirtyStorageKey, "1");
}

function clearEventsDirty() {
    localStorage.removeItem(eventsDirtyStorageKey);
    localStorage.setItem(eventsSyncedAtStorageKey, String(Date.now()));
}

function clearTodosDirty() {
    localStorage.removeItem(todosDirtyStorageKey);
    localStorage.setItem(todosSyncedAtStorageKey, String(Date.now()));
}

function hasEventsDirty() {
    return localStorage.getItem(eventsDirtyStorageKey) === "1";
}

function hasTodosDirty() {
    return localStorage.getItem(todosDirtyStorageKey) === "1";
}

function getStoredNumber(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
}

function shouldPreferLocalEvents(hydrateStartedAt, hasLocalEvents) {
    const mutationAt = Math.max(lastEventsMutationAt, getStoredNumber(eventsMutationAtStorageKey));
    const syncedAt = getStoredNumber(eventsSyncedAtStorageKey);
    return hasLocalEvents && (hasEventsDirty() || mutationAt > syncedAt || mutationAt > hydrateStartedAt);
}

function shouldPreferLocalTodos(hydrateStartedAt) {
    const mutationAt = Math.max(lastTodosMutationAt, getStoredNumber(todosMutationAtStorageKey));
    const syncedAt = getStoredNumber(todosSyncedAtStorageKey);
    return hasTodosDirty() || mutationAt > syncedAt || mutationAt > hydrateStartedAt;
}

function loadEventDraft() {
    try {
        const raw = localStorage.getItem(eventDraftStorageKey);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearEventDraft() {
    localStorage.removeItem(eventDraftStorageKey);
}

function saveEventDraft() {
    if (editingEvent || !modal || modal.style.display !== "flex" || selectedDay == null) return;
    const payload = {
        title: titleInput ? titleInput.value || "" : "",
        type: typeSelect ? typeSelect.value || "" : "",
        start: startInput ? startInput.value || "09:00" : "09:00",
        end: endInput ? endInput.value || "10:00" : "10:00",
        repeat: repeatSelect ? repeatSelect.value || "none" : "none",
        tapToggle: !!(tapToggleInput && tapToggleInput.checked)
    };
    localStorage.setItem(eventDraftStorageKey, JSON.stringify(payload));
}

function applyEventDraft() {
    if (editingEvent) return false;
    const draft = loadEventDraft();
    if (!draft) return false;
    titleInput.value = draft.title || "";
    renderTypeOptions(draft.type || typeSelect.value || undefined, draft.type || undefined);
    startInput.value = draft.start || "09:00";
    endInput.value = draft.end || "10:00";
    repeatSelect.value = draft.repeat || "none";
    tapToggleInput.checked = !!draft.tapToggle;
    return true;
}

function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach(b => { binary += String.fromCharCode(b); });
    return btoa(binary);
}

function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
}

async function hashPassword(password, saltBase64) {
    const encoder = new TextEncoder();
    const salt = base64ToBuffer(saltBase64);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            hash: "SHA-256",
            salt,
            iterations: 120000
        },
        keyMaterial,
        256
    );
    return bufferToBase64(bits);
}

function generateSalt() {
    const saltBytes = new Uint8Array(16);
    crypto.getRandomValues(saltBytes);
    return bufferToBase64(saltBytes.buffer);
}

function mapAuthError(err, context) {
    return mapAuthErrorMessage(err, context);
}

function handleSyncError(err) {
    console.warn("Sync failed", err);
    if (isPermissionDeniedError(err)) {
        syncEnabled = false;
        if (authState.plan === "plus") {
            showSyncMessage("同期に失敗しました。サーバー設定を確認してください。端末内には保存されています。", "warning");
        } else {
            showSyncMessage("同期はPlusプラン限定です。端末内には保存されています。", "warning");
            if (upgradeBtn) upgradeBtn.classList.add("attention");
        }
        return;
    }
    showSyncMessage("同期に失敗しました。通信環境を確認してください。端末内には保存されています。", "warning");
}

// ==================== カラム生成 ====================
days.forEach((day, i) => {
    const dayColumn = document.createElement("div");
    dayColumn.className = "day-column";

    const dayHeader = document.createElement("div");
    dayHeader.className = "day-header";
    dayHeader.textContent = day;
    dayColumn.appendChild(dayHeader);

    const timeline = document.createElement("div");
    timeline.className = "timeline";
    timeline.dataset.day = i;
    timeline.style.height = getTimelineHeight(startHour, endHour, hourHeight);

    buildTimelineHourMarks(startHour, endHour, hourHeight).forEach(mark => {
        const line = document.createElement("div");
        line.className = "hour-line";
        line.style.top = mark.top;

        const label = document.createElement("div");
        label.className = "hour-label";
        label.style.top = mark.top;
        label.textContent = mark.label;

        timeline.appendChild(line);
        timeline.appendChild(label);
    });

    timeline.addEventListener("dblclick", (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const state = getTimelineCreateEventState(e.clientY, rect.top, startHour, hourHeight, i, format);
        selectedDay = state.selectedDay;
        startInput.value = state.start;
        endInput.value = state.end;
        openModal();
    });

    dayColumn.appendChild(timeline);
    weekView.appendChild(dayColumn);
});

// ==================== モーダル操作 ====================
function closeMainModal() {
    const state = getClosedEventModalState();
    modal.style.display = state.display;
    setTypePanelOpen(false);
    if (state.clearSelectedDate) modalSelectedDate = null;
    if (state.clearEditingEvent) editingEvent = null;
}

cancelBtn.addEventListener("click", closeMainModal);
deleteBtn.addEventListener("click", deleteEvent);
saveBtn.addEventListener("click", saveEvent);
bulkOpenBtn.addEventListener("click", openBulkModal);
bulkCancelBtn.addEventListener("click", closeBulkModal);
bulkDeleteBtn.addEventListener("click", bulkDeleteSelected);
if (plusOpenBtn) plusOpenBtn.addEventListener("click", openPlusModal);
if (authOpenBtn) authOpenBtn.addEventListener("click", openAuthModal);
if (accountOpenBtn) accountOpenBtn.addEventListener("click", openAccountModal);
function bindUIHandlers() {
    if (accountCloseBtn) accountCloseBtn.addEventListener("click", closeAccountModal);
    if (accountLogoutBtn) accountLogoutBtn.addEventListener("click", () => {
        logoutAccount();
        closeAccountModal();
    });
    if (accountCancelBtn) accountCancelBtn.addEventListener("click", () => cancelSubscription());
    if (accountEmailToggleBtn) accountEmailToggleBtn.addEventListener("click", () => toggleAccountFields("email"));
    if (accountPasswordToggleBtn) accountPasswordToggleBtn.addEventListener("click", () => toggleAccountFields("password"));
    if (accountEmailCloseBtn) accountEmailCloseBtn.addEventListener("click", () => toggleAccountFields("email", false));
    if (accountPasswordCloseBtn) accountPasswordCloseBtn.addEventListener("click", () => toggleAccountFields("password", false));
    if (accountEmailUpdateBtn) accountEmailUpdateBtn.addEventListener("click", () => updateAccountEmail());
    if (accountPasswordUpdateBtn) accountPasswordUpdateBtn.addEventListener("click", () => updateAccountPassword());
    if (authCancelBtn) authCancelBtn.addEventListener("click", closeAuthModal);
    if (signupCancelBtn) signupCancelBtn.addEventListener("click", closeSignupModal);
    if (plusCloseBtn) plusCloseBtn.addEventListener("click", closePlusModal);
    if (plusChangeBtn) plusChangeBtn.addEventListener("click", () => startPlusUpgrade());
    if (plusLoginOpenBtn) plusLoginOpenBtn.addEventListener("click", () => {
        pendingUpgrade = true;
        closePlusModal();
        openAuthModal();
    });
    if (paymentBackBtn) paymentBackBtn.addEventListener("click", () => {
        closePaymentModal();
        openPlusModal();
    });
    if (paymentSubmitBtn) paymentSubmitBtn.addEventListener("click", () => submitPaymentMock());
    if (signupSubmitBtn) signupSubmitBtn.addEventListener("click", () => emailPasswordSignup());
    if (upgradeBtn) upgradeBtn.addEventListener("click", () => {
        closeAuthModal();
        openPlusModal();
    });
    if (authLoginBtn) authLoginBtn.addEventListener("click", () => {
        console.log("[auth] login click", {
            hasFirebaseAuth: !!firebaseAuth,
            hasInitPromise: !!firebaseInitPromise,
            initFailed: firebaseInitFailed
        });
        emailPasswordLogin();
    });
    if (weekLabelBtn) weekLabelBtn.addEventListener("click", openDatePicker);
    if (modal) modal.addEventListener("click", (e) => {
        if (e.target === modal) closeMainModal();
    });
    if (bulkModal) bulkModal.addEventListener("click", (e) => {
        if (e.target === bulkModal) closeBulkModal();
    });
    if (authModal) authModal.addEventListener("click", (e) => {
        if (e.target === authModal) closeAuthModal();
    });
    if (plusModal) plusModal.addEventListener("click", (e) => {
        if (e.target === plusModal) closePlusModal();
    });
    if (signupModal) signupModal.addEventListener("click", (e) => {
        if (e.target === signupModal) closeSignupModal();
    });
    if (paymentModal) paymentModal.addEventListener("click", (e) => {
        if (e.target === paymentModal) closePaymentModal();
    });
    if (datePickerModal) datePickerModal.addEventListener("click", (e) => {
        if (e.target === datePickerModal) closeDatePicker();
    });
    if (accountModal) accountModal.addEventListener("click", (e) => {
        if (e.target === accountModal) closeAccountModal();
    });
    if (datePickerSearch) datePickerSearch.addEventListener("click", jumpToSelectedDate);
    if (datePickerCalendarToggle) {
        datePickerCalendarToggle.addEventListener("click", () => {
            if (!datePickerCalendar) return;
            datePickerCalendar.classList.toggle("open");
            datePickerCalendar.setAttribute("aria-hidden", String(!datePickerCalendar.classList.contains("open")));
            renderDatePickerCalendar();
        });
    }
    if (datePickerYear) datePickerYear.addEventListener("change", updateDatePickerDays);
    if (datePickerMonth) datePickerMonth.addEventListener("change", updateDatePickerDays);
    if (syncRefreshBtn) {
        syncRefreshBtn.addEventListener("click", () => refreshPlanStatus({ forceRefresh: true, announce: true }));
    }
    if (undoBackupBtn) undoBackupBtn.addEventListener("click", undoLocalChanges);
    if (redoBackupBtn) redoBackupBtn.addEventListener("click", redoLocalChanges);
    if (typePickerBtn) {
        typePickerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setTypePickerOpen();
        });
    }
    if (typeSelect) {
        typeSelect.addEventListener("change", () => {
            renderTypePicker(getAllTypes(), typeSelect.value);
            saveEventDraft();
        });
    }
    if (titleInput) titleInput.addEventListener("input", saveEventDraft);
    if (startInput) startInput.addEventListener("input", saveEventDraft);
    if (endInput) endInput.addEventListener("input", saveEventDraft);
    if (repeatSelect) repeatSelect.addEventListener("change", saveEventDraft);
    if (tapToggleInput) tapToggleInput.addEventListener("change", saveEventDraft);
    typeAddBtn.addEventListener("click", addCustomType);
    typeAddOpenBtn.addEventListener("click", () => {
        setTypePanelOpen(true);
        renderColorOptions();
        renderTypeList();
        bindColorSwatches();
    });
    typeAddCloseBtn.addEventListener("click", () => setTypePanelOpen(false));
    if (typeEditSaveBtn) typeEditSaveBtn.addEventListener("click", saveEditedType);
    if (typeEditCancelBtn) typeEditCancelBtn.addEventListener("click", clearTypeEdit);
    typeNewInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addCustomType();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setTypePickerOpen(false);
    });
    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "typeColorFreeBtn" && typeColorInput) {
            typeColorInput.click();
        }
        if (typePickerPanel && typePickerPanel.classList.contains("open")) {
            const target = e.target;
            const inPanel = typePickerPanel.contains(target);
            const inButton = typePickerBtn && typePickerBtn.contains(target);
            if (!inPanel && !inButton) setTypePickerOpen(false);
        }
    });
    if (typeColorInput) {
        typeColorInput.addEventListener("input", () => {
            applyTypeColor(typeColorInput.value);
        });
    }
    if (typeColorFreeBtn && typeColorInput) {
        typeColorFreeBtn.addEventListener("click", () => {
            typeColorInput.click();
        });
    }
}

function openModal(eventObj = null) {
    const modalState = getEventModalState(eventObj, {
        selectedDay,
        currentWeek,
        getWeekDate
    });
    const viewState = getOpenedEventModalState(modalState, format);
    editingEvent = eventObj;
    modalTitle.textContent = viewState.title;
    modal.style.display = viewState.display;
    setTypePanelOpen(false);

    titleInput.value = viewState.form.title;
    renderTypeOptions(viewState.form.typeId, viewState.form.typeLabel);
    startInput.value = viewState.form.start;
    endInput.value = viewState.form.end;
    repeatSelect.value = viewState.form.repeat;
    tapToggleInput.checked = viewState.form.tapToggle;
    selectedDay = viewState.form.selectedDay;
    modalSelectedDate = viewState.form.selectedDate;
    deleteBtn.style.display = viewState.deleteButtonDisplay;
    deleteScopeRow.style.display = viewState.deleteScopeRowDisplay;
    deleteScopeSelect.value = viewState.deleteScopeValue;
    if (!eventObj) {
        applyEventDraft();
        saveEventDraft();
    } else {
        clearEventDraft();
    }
}

function openDatePicker() {
    if (!datePickerModal || !datePickerYear || !datePickerMonth || !datePickerDay) return;
    const today = new Date();
    setupDatePickerOptions(today);
    if (datePickerCalendar) {
        datePickerCalendar.classList.remove("open");
        datePickerCalendar.setAttribute("aria-hidden", "true");
    }
    datePickerModal.style.display = "flex";
}

function closeDatePicker() {
    if (!datePickerModal) return;
    datePickerModal.style.display = "none";
}

function jumpToSelectedDate() {
    const selected = getDatePickerValue();
    if (!selected) return;
    currentWeek = selected;
    saveCurrentWeekState();
    updateWeekView();
    highlightCurrentDay();
    closeDatePicker();
}

function setupDatePickerOptions(baseDate) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;
    const day = baseDate.getDate();

    datePickerYear.innerHTML = "";
    buildDatePickerYears(year).forEach(y => {
        const opt = document.createElement("option");
        opt.value = String(y);
        opt.textContent = `${y}`;
        datePickerYear.appendChild(opt);
    });
    datePickerYear.value = String(year);

    datePickerMonth.innerHTML = "";
    buildDatePickerMonths().forEach(m => {
        const opt = document.createElement("option");
        opt.value = String(m);
        opt.textContent = `${m}`;
        datePickerMonth.appendChild(opt);
    });
    datePickerMonth.value = String(month);

    updateDatePickerDays(day);
    renderDatePickerCalendar();
}

function updateDatePickerDays(preferredDay) {
    if (!datePickerYear || !datePickerMonth || !datePickerDay) return;
    const year = parseInt(datePickerYear.value, 10);
    const month = parseInt(datePickerMonth.value, 10);
    if (!year || !month) return;
    const current = preferredDay || parseInt(datePickerDay.value || "1", 10);

    datePickerDay.innerHTML = "";
    buildDatePickerDays(year, month).forEach(d => {
        const opt = document.createElement("option");
        opt.value = String(d);
        opt.textContent = `${d}`;
        datePickerDay.appendChild(opt);
    });
    const safeDay = getSafeDatePickerDay(year, month, current);
    datePickerDay.value = String(safeDay);
    renderDatePickerCalendar();
}

function getDatePickerValue() {
    if (!datePickerYear || !datePickerMonth || !datePickerDay) return null;
    const year = parseInt(datePickerYear.value, 10);
    const month = parseInt(datePickerMonth.value, 10);
    const day = parseInt(datePickerDay.value, 10);
    if (!year || !month || !day) return null;
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
}

function renderDatePickerCalendar() {
    if (!datePickerCalendar || !datePickerYear || !datePickerMonth) return;
    const year = parseInt(datePickerYear.value, 10);
    const month = parseInt(datePickerMonth.value, 10);
    if (!year || !month) return;

    datePickerCalendar.innerHTML = "";
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    weekdays.forEach(label => {
        const el = document.createElement("div");
        el.className = "date-picker-weekday";
        el.textContent = label;
        datePickerCalendar.appendChild(el);
    });

    buildDatePickerCalendarModel(year, month).forEach(item => {
        if (item.type === "blank") {
            const blank = document.createElement("div");
            blank.className = "date-picker-day is-muted";
            blank.textContent = "";
            datePickerCalendar.appendChild(blank);
            return;
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "date-picker-day";
        btn.textContent = String(item.day);
        if (item.isToday) {
            btn.classList.add("is-today");
        }
        btn.addEventListener("click", () => {
            if (datePickerDay) datePickerDay.value = String(item.day);
            const selected = getDatePickerValue();
            if (!selected) return;
            currentWeek = selected;
            saveCurrentWeekState();
            updateWeekView();
            highlightCurrentDay();
            closeDatePicker();
        });
        datePickerCalendar.appendChild(btn);
    });
}


// ==================== 今日をハイライト ====================
function highlightCurrentDay() {
    document.querySelectorAll(".day-header").forEach(h => h.classList.remove("current-day"));
    const dayIndex = getCurrentDayHeaderIndex(currentWeek, getWeekStart, getMondayBasedDayIndex);
    if (dayIndex < 0) return;
    const header = document.querySelectorAll(".day-header")[dayIndex];
    if (header) header.classList.add("current-day");
}

// ==================== 週切り替え ====================
document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() - 7);
    saveCurrentWeekState();
    updateWeekView();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() + 7);
    saveCurrentWeekState();
    updateWeekView();
});

function updateWeekView() {
    const weekLabel = document.getElementById('weekLabel');
    weekLabel.textContent = buildWeekLabel(currentWeek);

    const headerItems = buildWeekHeaderItems(days, currentWeek, getWeekStart, getWeekDate, toISODate, toJPLabel);
    document.querySelectorAll(".day-header").forEach((header, i) => {
        const item = headerItems[i];
        if (!item) return;
        header.textContent = item.label;
        header.dataset.date = item.dateISO;
        header.onclick = () => openTodoForDate(item.date);
    });

    highlightCurrentDay(); // 今日を黄色に
    renderEvents();
}

function renderTodoMemo(dateISO) {
    if (!todoMemo || !todoMemoText) return;
    const text = loadTodoMemo(dateISO);
    todoMemo.value = text;
    todoMemoText.textContent = text || "メモは未入力です";
    setMemoViewMode(!!text);
}

function renderTodoList(dateISO) {
    const items = loadTodos(dateISO);
    todoList.innerHTML = "";
    items.forEach(item => {
        const li = document.createElement("li");
        li.className = "todo-item";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!item.done;
        cb.onchange = () => {
            saveTodos(dateISO, toggleTodoItem(items, item.id, cb.checked));
            markTodosDirty();
            snapshotLocalData();
            renderTodoList(dateISO);
        };

        const span = document.createElement("span");
        span.className = "todo-text" + (item.done ? " done" : "");
        span.textContent = item.text;

        const del = document.createElement("button");
        del.className = "todo-delete";
        del.textContent = "削除";
        del.onclick = () => {
            saveTodos(dateISO, deleteTodoItem(items, item.id));
            markTodosDirty();
            snapshotLocalData();
            renderTodoList(dateISO);
            syncTodosToRemote(dateISO);
        };

        const edit = document.createElement("button");
        edit.className = "todo-edit";
        edit.textContent = "編集";
        edit.onclick = () => {
            const nextText = prompt("ToDoを編集", item.text);
            if (!nextText) return;
            const trimmed = nextText.trim();
            if (!trimmed) return;
            saveTodos(dateISO, editTodoItem(items, item.id, trimmed));
            markTodosDirty();
            snapshotLocalData();
            renderTodoList(dateISO);
            syncTodosToRemote(dateISO);
        };

        li.appendChild(cb);
        li.appendChild(span);
        li.appendChild(edit);
        li.appendChild(del);
        todoList.appendChild(li);
    });
}

function openTodoForDate(dateObj) {
    const dateISO = toISODate(dateObj);
    currentTodoDateKey = dateISO;
    saveCurrentTodoState(dateISO);

    todoDateLabel.textContent = buildTodoPanelLabel(dateObj, toJPLabel);
    renderTodoList(dateISO);
    renderTodoMemo(dateISO);
    syncTodosToRemote(dateISO);

    todoPanel.classList.add("open");
    todoPanel.setAttribute("aria-hidden", "false");

    // 入力フォーカス
    setTimeout(() => todoInput.focus(), 0);
}

function closeTodoPanel() {
    todoPanel.classList.remove("open");
    todoPanel.setAttribute("aria-hidden", "true");
    currentTodoDateKey = null;
    saveCurrentTodoState(null);
}

todoClose.addEventListener("click", closeTodoPanel);
todoPanel.addEventListener("click", (e) => {
    // パネルの外側（グレーの背景ではなく右サイドなので今回は不要）
    // ここでは閉じない仕様にしておく。必要なら条件追加で閉じても良い。
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text || !currentTodoDateKey) return;
    saveTodos(currentTodoDateKey, addTodoItem(loadTodos(currentTodoDateKey), text));
    markTodosDirty();
    snapshotLocalData();
    todoInput.value = "";
    renderTodoList(currentTodoDateKey);
    syncTodosToRemote(currentTodoDateKey);
}

function setMemoEditMode() {
    todoMemo.style.display = "block";
    todoMemoSave.style.display = "inline-block";
    todoMemoText.style.display = "none";
    todoMemoEdit.style.display = "none";
    setTimeout(() => todoMemo.focus(), 0);
}

function setMemoViewMode(hasText) {
    todoMemo.style.display = "none";
    todoMemoSave.style.display = "none";
    todoMemoText.style.display = "block";
    todoMemoEdit.style.display = "inline-block";
    todoMemoEdit.textContent = getMemoButtonLabel(hasText);
}

todoAdd.addEventListener("click", addTodo);

todoMemoSave.addEventListener("click", () => {
    if (!currentTodoDateKey) return;
    saveTodoMemo(currentTodoDateKey, todoMemo.value || "");
    markTodosDirty();
    snapshotLocalData();
    renderTodoMemo(currentTodoDateKey);
    syncTodosToRemote(currentTodoDateKey);
});
todoMemoEdit.addEventListener("click", () => {
    if (!currentTodoDateKey) return;
    setMemoEditMode();
});
todoMemo.addEventListener("blur", () => {
    if (!currentTodoDateKey) return;
    saveTodoMemo(currentTodoDateKey, todoMemo.value || "");
    markTodosDirty();
    snapshotLocalData();
});

todoClearDone.addEventListener("click", () => {
    if (!currentTodoDateKey) return;
    saveTodos(currentTodoDateKey, clearCompletedTodoItems(loadTodos(currentTodoDateKey)));
    markTodosDirty();
    snapshotLocalData();
    renderTodoList(currentTodoDateKey);
    syncTodosToRemote(currentTodoDateKey);
});



function toggleEventCompletion(ev) {
    const canToggle = true;
    if (!canToggle) return;
    const events = loadEventsForDay(ev.day);
    const idx = events.findIndex(x => x.id === ev.id);
    if (idx === -1) return;

    const nextCompleted = !events[idx].completed;
    events[idx].tapToggle = canToggle;
    events[idx].completed = nextCompleted;
    events[idx].completionTouched = true;
    events[idx].assigned = false;

    saveEventsForDay(ev.day, events);
    markEventsDirty();
    snapshotLocalData();
    renderEvents(); // 反映
    syncEventsToRemote();
}

// ==================== イベント保存 ====================
function saveEvent() {
    const type = typeSelect.value;
    const start = parseTime(startInput.value);
    const end = parseTime(endInput.value);
    const repeat = repeatSelect.value;

    const typeMeta = getAllTypes().find(t => t.id === type);
    const typeLabel = typeMeta ? typeMeta.label : type;
    const typeColor = typeMeta ? typeMeta.color : "";
    updateTypeLabelCache(type, typeLabel, typeColor);

    const draft = buildEventDraft({
        title: titleInput.value,
        type,
        typeLabel,
        typeColor,
        start,
        end,
        repeat,
        tapToggle: tapToggleInput.checked,
        selectedDay,
        modalSelectedDate,
        editingEvent
    }, {
        currentWeek,
        getWeekDate,
        daysLength: days.length
    });
    if (!draft) return;

    const repeatDates = repeat !== "none" ? generateRepeatDates(draft.eventDate, repeat) : [];
    saveEventSeries(days, selectedDay, draft.newEvent, draft.changeStartDate, repeatDates, getMondayBasedDayIndex);
    pushDebugEventLog("saveEvent:afterSaveEventSeries", {
        selectedDay,
        newEventId: draft.newEvent.id,
        newEventDate: draft.newEvent.date,
        repeat
    });
    markEventsDirty();
    snapshotLocalData();
    clearEventDraft();

    const closeState = getClosedEventModalState();
    modal.style.display = closeState.display;
    setTypePanelOpen(false);
    if (closeState.clearSelectedDate) modalSelectedDate = null;
    if (closeState.clearEditingEvent) editingEvent = null;
    renderEvents();
    updateWeekView();
    backfillEventTypeMeta();
    syncEventsToRemote();
}

function deleteEventByScope(targetEvent, scope) {
    deleteStoredEventByScope(days, targetEvent, scope);
}

function deleteEvent() {
    if (!editingEvent) return;

    const scope = deleteScopeSelect ? deleteScopeSelect.value : "future";
    deleteEventByScope(editingEvent, scope);
    markEventsDirty();
    snapshotLocalData();
    const closeState = getClosedEventModalState();
    modal.style.display = closeState.display;
    setTypePanelOpen(false);
    if (closeState.clearSelectedDate) modalSelectedDate = null;
    if (closeState.clearEditingEvent) editingEvent = null;
    renderEvents();
    syncEventsToRemote();
}

// ==================== 一括削除 ====================
function collectWeekEvents() {
    const weekStart = getWeekStart(currentWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return collectStoredWeekEvents(days, weekStart, weekEnd);
}

function openBulkModal() {
    renderBulkList();
    if (bulkDeleteScope) bulkDeleteScope.value = "single";
    bulkModal.style.display = "flex";
}

function closeBulkModal() {
    bulkModal.style.display = "none";
}

function renderBulkList() {
    bulkList.innerHTML = "";
    const events = collectWeekEvents();
    if (!events.length) {
        const li = document.createElement("li");
        li.className = "bulk-empty";
        li.textContent = "今週の予定はありません";
        bulkList.appendChild(li);
        return;
    }

    sortEventsByDateTime(events).forEach(ev => {
        const li = document.createElement("li");
        li.className = "bulk-item";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.day = ev.day;
        cb.dataset.id = String(ev.id);
        cb.dataset.baseId = ev.baseId != null ? String(ev.baseId) : "";
        cb.dataset.date = ev.date || "";

        const label = document.createElement("span");
        label.className = "bulk-label";
        label.textContent = buildBulkEventLabel(ev, toJPLabel, format);

        li.appendChild(cb);
        li.appendChild(label);
        bulkList.appendChild(li);
    });
}

function bulkDeleteSelected() {
    const checked = Array.from(bulkList.querySelectorAll('input[type="checkbox"]:checked'));
    if (!checked.length) {
        closeBulkModal();
        return;
    }
    const scope = bulkDeleteScope ? bulkDeleteScope.value : "single";
    collectBulkDeleteTargets(checked, scope).forEach(target => deleteEventByScope(target, scope));
    markEventsDirty();
    snapshotLocalData();

    closeBulkModal();
    renderEvents();
    updateWeekView();
    syncEventsToRemote();
}

async function refreshPlanStatus({ forceRefresh = false, announce = false } = {}) {
    if (!firebaseAuth || !firebaseAuth.currentUser) return;
    const user = firebaseAuth.currentUser;
    try {
        if (forceRefresh) await user.getIdToken(true);
        await user.getIdTokenResult();
        const nextPlan = "plus";
        applyPlusActivation({
            setStoredSession,
            setStoredPlanForUser,
            applyAuthState
        }, user);
        if (pendingUpgrade) closePlusModal();
        if (nextPlan === "plus") {
            await hydrateFromRemote();
            if (announce) showSyncMessage("同期を有効化しました。", "success");
        } else if (announce) {
            showSyncMessage("このアカウントはFreeプランです。同期はローカル保存で利用できます。", "info");
        }
    } catch (err) {
        handleSyncError(err);
    }
}

// ==================== Firebase同期 ====================
async function initFirebaseSync() {
    if (firebaseInitPromise) return firebaseInitPromise;
    firebaseInitPromise = (async () => {
        try {
            const [{ initializeApp }] = await Promise.all([
                import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
            ]);
            const [{ getAuth, onAuthStateChanged }] = await Promise.all([
                import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
            ]);
            const [{ getFirestore }] = await Promise.all([
                import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"),
            ]);

            firebaseApp = initializeApp(firebaseConfig);
            firebaseAuth = getAuth(firebaseApp);
            firestore = getFirestore(firebaseApp);
            console.log("[auth] firebase init complete");

            onAuthStateChanged(firebaseAuth, async (user) => {
                currentUser = user;
                if (!user) {
                    currentUid = null;
                    applyAuthState(getSignedOutAuthState());
                    clearSyncMessage();
                    return;
                }
                currentUid = user.uid;
                setStoredSession(buildStoredSessionPayload(user));
                await refreshPlanStatus({ forceRefresh: false, announce: false });
            });
        } catch (e) {
            firebaseInitFailed = true;
            console.error("Firebase init failed", e);
            initLocalSessionState();
        }
    })();
    return firebaseInitPromise;
}

function setTypePanelOpen(isOpen) {
    if (!typeAddPanel) return;
    if (isOpen) {
        typePanelLastFocus = document.activeElement;
        typeAddPanel.classList.add("open");
        typeAddPanel.setAttribute("aria-hidden", "false");
        if ("inert" in typeAddPanel) typeAddPanel.inert = false;
        setTimeout(() => {
            if (typeNewInput) typeNewInput.focus();
        }, 0);
        return;
    }
    const wasOpen = typeAddPanel.classList.contains("open");
    typeAddPanel.classList.remove("open");
    typeAddPanel.setAttribute("aria-hidden", "true");
    if ("inert" in typeAddPanel) typeAddPanel.inert = true;
    if (!wasOpen && !typePanelLastFocus) return;
    const fallback = typeAddOpenBtn || modalTitle;
    const target = typePanelLastFocus || fallback;
    if (target && typeof target.focus === "function") {
        setTimeout(() => target.focus(), 0);
    }
    typePanelLastFocus = null;
}

async function ensureFirebaseReady() {
    if (firebaseAuth) return true;
    if (firebaseInitFailed) return false;
    if (firebaseInitPromise) {
        await firebaseInitPromise;
        return !!firebaseAuth && !firebaseInitFailed;
    }
    await initFirebaseSync();
    return !!firebaseAuth && !firebaseInitFailed;
}

function openAuthModal() {
    authModal.style.display = getModalDisplayState(true);
    setInlineError(authError, "");
}

function closeAuthModal() {
    authModal.style.display = getModalDisplayState(false);
    setInlineError(authError, "");
    pendingUpgrade = false;
}

function openAccountModal() {
    if (!accountModal) return;
    if (!authState.isLoggedIn) return;
    accountModal.style.display = getModalDisplayState(true);
    const emailState = getAccountFieldState(false);
    const passwordState = getAccountFieldState(false);
    if (accountEmailFields) {
        accountEmailFields.classList.toggle("is-open", emailState.classOpen);
        accountEmailFields.setAttribute("aria-hidden", emailState.ariaHidden);
    }
    if (accountPasswordFields) {
        accountPasswordFields.classList.toggle("is-open", passwordState.classOpen);
        accountPasswordFields.setAttribute("aria-hidden", passwordState.ariaHidden);
    }
    if (accountEmailToggleBtn) accountEmailToggleBtn.setAttribute("aria-expanded", emailState.ariaExpanded);
    if (accountPasswordToggleBtn) accountPasswordToggleBtn.setAttribute("aria-expanded", passwordState.ariaExpanded);
    const formState = getAccountModalFormState(authState.user && authState.user.email ? authState.user.email : "");
    if (accountEmailInput) accountEmailInput.value = formState.email;
    if (accountCurrentPassword) accountCurrentPassword.value = formState.currentPassword;
    if (accountNewPassword) accountNewPassword.value = formState.newPassword;
    if (accountNewPasswordConfirm) accountNewPasswordConfirm.value = formState.newPasswordConfirm;
    setInlineError(accountEmailError, "");
    setInlineError(accountPasswordError, "");
    setInlineError(accountError, "");
}

function closeAccountModal() {
    if (!accountModal) return;
    accountModal.style.display = getModalDisplayState(false);
    setInlineError(accountEmailError, "");
    setInlineError(accountPasswordError, "");
    setInlineError(accountError, "");
}

function toggleAccountFields(target, nextState = null) {
    const isEmail = target === "email";
    const fields = isEmail ? accountEmailFields : accountPasswordFields;
    const toggleBtn = isEmail ? accountEmailToggleBtn : accountPasswordToggleBtn;
    if (!fields || !toggleBtn) return;
    const willOpen = typeof nextState === "boolean" ? nextState : !fields.classList.contains("is-open");
    const state = getAccountFieldState(willOpen);
    fields.classList.toggle("is-open", state.classOpen);
    fields.setAttribute("aria-hidden", state.ariaHidden);
    toggleBtn.setAttribute("aria-expanded", state.ariaExpanded);
    if (!willOpen) {
        if (isEmail) setInlineError(accountEmailError, "");
        else setInlineError(accountPasswordError, "");
    }
}

function openSignupModal() {
    if (!signupModal) return;
    signupModal.style.display = getModalDisplayState(true);
    const formState = getSignupModalFormState();
    if (signupEmail) signupEmail.value = formState.email;
    if (signupPassword) signupPassword.value = formState.password;
    if (signupPasswordConfirm) signupPasswordConfirm.value = formState.passwordConfirm;
    if (signupTerms) signupTerms.checked = formState.termsChecked;
    setInlineError(signupError, "");
}

function closeSignupModal() {
    if (!signupModal) return;
    signupModal.style.display = getModalDisplayState(false);
    setInlineError(signupError, "");
    pendingUpgrade = false;
}

function openPlusModal() {
    if (!plusModal) return;
    plusModal.style.display = getModalDisplayState(true);
    setInlineError(plusError, "");
}

function closePlusModal() {
    if (!plusModal) return;
    plusModal.style.display = getModalDisplayState(false);
    setInlineError(plusError, "");
    pendingUpgrade = false;
}

function openPaymentModal() {
    if (!paymentModal) return;
    paymentModal.style.display = getModalDisplayState(true);
    setInlineError(paymentError, "");
}

function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.style.display = getModalDisplayState(false);
    setInlineError(paymentError, "");
    pendingUpgrade = false;
}

function startPlusUpgrade() {
    setInlineError(plusError, "");
    pendingUpgrade = true;
    if (getUpgradeFlowTarget(authState.isLoggedIn) === "signup") {
        closePlusModal();
        openSignupModal();
        return;
    }
    closePlusModal();
    openPaymentModal();
}

async function submitPaymentMock() {
    setInlineError(paymentError, "");
    const ok = window.confirm("Plusプラン（月額240円）に申し込みますか？");
    if (!ok) {
        setInlineError(paymentError, "支払いをキャンセルしました。");
        return;
    }
    if (!authState.user) {
        setInlineError(paymentError, "ログイン状態を確認できません。");
        return;
    }
    // TODO: Stripe Checkout / Customer Portal をここで呼び出す
    // NOTE: Netlify Functions 等のサーバー側処理が必要になります
    applyPlusActivation({
        setStoredSession,
        setStoredPlanForUser,
        applyAuthState
    }, authState.user);
    // TODO: ユーザー単位の保存キーに移行する場合はここで移行処理を行う
    const closeState = getAuthSuccessCloseState({ closePayment: true, closePlus: true, closeSignup: true });
    if (closeState.closePayment) closePaymentModal();
    if (closeState.closePlus) closePlusModal();
    if (closeState.closeSignup) closeSignupModal();
    if (closeState.clearPendingUpgrade) pendingUpgrade = false;
}

async function logoutAccount() {
    if (!firebaseAuth) {
        clearStoredSession();
        applyAuthState(getSignedOutAuthState());
        clearSyncMessage();
        return;
    }
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signOut(firebaseAuth);
        currentUser = null;
        currentUid = null;
        clearStoredSession();
        applyAuthState(getSignedOutAuthState());
        clearSyncMessage();
    } catch (err) {
        showSyncMessage("ログアウトに失敗しました。時間を置いて再度お試しください。", "warning");
    }
}

async function updateAccountEmail() {
    if (!authState.isLoggedIn || !authState.user) {
        setInlineError(accountEmailError, "ログイン状態を確認できません。");
        return;
    }
    const nextEmail = (accountEmailInput && accountEmailInput.value ? accountEmailInput.value : "").trim();
    setInlineError(accountEmailError, "");
    const emailValidationError = validateAccountEmailForm({ email: nextEmail, isValidEmail });
    if (emailValidationError) {
        setInlineError(accountEmailError, emailValidationError);
        return;
    }
    if (!firebaseAuth || !firebaseAuth.currentUser) {
        try {
            const users = loadLocalUsers();
            const normalized = normalizeEmail(nextEmail);
            const exists = users.find(u => normalizeEmail(u.email) === normalized && u.id !== authState.user.id);
            if (exists) {
                setInlineError(accountEmailError, "このメールアドレスは既に登録されています。");
                return;
            }
            updateLocalUserById(authState.user.id, user => ({ ...user, email: normalized }));
            const localUser = buildLocalUserAuth(normalized, authState.user.id);
            setStoredSession(buildStoredSessionPayload(localUser));
            applyAuthState(getAuthStateForPlan(localUser, authState.plan));
            setInlineError(accountEmailError, getAccountUpdateSuccessMessage("email"));
        } catch (err) {
            setInlineError(accountEmailError, mapAuthError(err, "signup"));
        }
        return;
    }
    try {
        const { updateEmail } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
        const user = firebaseAuth.currentUser;
        await updateEmail(user, nextEmail);
        const nextUser = buildLocalUserAuth(nextEmail, user.uid);
        setStoredSession(buildStoredSessionPayload(nextUser));
        applyAuthState(getAuthStateForPlan(nextUser, authState.plan));
        setInlineError(accountEmailError, getAccountUpdateSuccessMessage("email"));
    } catch (err) {
        if (err && err.code === "auth/requires-recent-login") {
            setInlineError(accountEmailError, getRequiresRecentLoginMessage());
            return;
        }
        setInlineError(accountEmailError, mapAuthError(err, "signup"));
    }
}

async function updateAccountPassword() {
    if (!authState.isLoggedIn || !authState.user) {
        setInlineError(accountPasswordError, "ログイン状態を確認できません。");
        return;
    }
    const currentPassword = accountCurrentPassword && accountCurrentPassword.value ? accountCurrentPassword.value : "";
    const nextPassword = accountNewPassword && accountNewPassword.value ? accountNewPassword.value : "";
    const nextPasswordConfirm = accountNewPasswordConfirm && accountNewPasswordConfirm.value ? accountNewPasswordConfirm.value : "";
    setInlineError(accountPasswordError, "");
    const passwordValidationError = validateAccountPasswordForm({
        currentPassword,
        nextPassword,
        nextPasswordConfirm
    });
    if (passwordValidationError) {
        setInlineError(accountPasswordError, passwordValidationError);
        return;
    }
    if (!firebaseAuth || !firebaseAuth.currentUser) {
        try {
            await localLogin(authState.user.email || "", currentPassword);
            const salt = generateSalt();
            const passwordHash = await hashPassword(nextPassword, salt);
            updateLocalUserById(authState.user.id, user => ({ ...user, salt, passwordHash }));
            setInlineError(accountPasswordError, getAccountUpdateSuccessMessage("password"));
        } catch (err) {
            setInlineError(accountPasswordError, mapAuthError(err, "login"));
        }
        return;
    }
    try {
        const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
        const user = firebaseAuth.currentUser;
        const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, nextPassword);
        setInlineError(accountPasswordError, getAccountUpdateSuccessMessage("password"));
    } catch (err) {
        if (err && err.code === "auth/requires-recent-login") {
            setInlineError(accountPasswordError, getRequiresRecentLoginMessage());
            return;
        }
        setInlineError(accountPasswordError, mapAuthError(err, "signup"));
    }
}

function cancelSubscription() {
    if (!authState.isLoggedIn || !authState.user) {
        setInlineError(accountError, "ログイン状態を確認できません。");
        return;
    }
    if (!confirm("解約しますか？同期は停止されます。")) return;
    setStoredPlanForUser(authState.user.id, "free");
    applyAuthState(getAuthStateForPlan(authState.user, "free"));
    setInlineError(accountError, "解約しました。同期は停止されます。");
}

function addCustomType() {
    const label = normalizeTypeLabel(typeNewInput.value);
    if (!label) return;
    const customTypes = loadCustomTypes();
    const existing = findExistingTypeByLabel(getAllTypes(), label);
    if (existing) {
        renderTypeOptions(existing.id);
        typeNewInput.value = "";
        return;
    }
    const draft = buildNewTypeDraft(
        label,
        typeColorInput && typeColorInput.value ? typeColorInput.value : "",
        customTypes,
        customTypePalette
    );
    customTypes.push(draft);
    saveCustomTypes(customTypes);
    updateTypeLabelCache(draft.id, draft.label, draft.color);
    snapshotLocalData();
    renderTypeOptions(draft.id);
    renderTypeList();
    typeNewInput.value = "";
    renderColorOptions();
}

function startEditType(id) {
    const target = resolveTypeEditTarget(id, getBaseTypes(), loadCustomTypes());
    if (!target) return;
    editingTypeId = target.id;
    editingTypeIsBase = target.isBase;
    typeNewInput.value = target.label;
    renderColorOptions(target.color);
    if (typeEditSaveBtn) typeEditSaveBtn.disabled = false;
    if (typeEditCancelBtn) typeEditCancelBtn.disabled = false;
}

function saveEditedType() {
    if (!editingTypeId) return;
    const label = normalizeTypeLabel(typeNewInput.value);
    if (!label) return;
    const color = (typeColorInput && typeColorInput.value) ? typeColorInput.value : customTypePalette[0];
    const existsLabel = findExistingTypeByLabel(getAllTypes(), label, editingTypeId);
    if (existsLabel) return;
    if (editingTypeIsBase) {
        const overrides = loadBaseTypeOverrides();
        overrides[editingTypeId] = { label, color };
        saveBaseTypeOverrides(overrides);
    } else {
        const customTypes = loadCustomTypes();
        const updated = customTypes.map(t => {
            if (t.id !== editingTypeId) return t;
            return { ...t, label, color, deleted: false };
        });
        saveCustomTypes(updated);
    }
    updateTypeLabelCache(editingTypeId, label, color);
    snapshotLocalData();
    renderTypeOptions(editingTypeId);
    renderTypeList();
    clearTypeEdit();
    renderEvents();
    backfillEventTypeMeta();
}

function clearTypeEdit() {
    editingTypeId = null;
    editingTypeIsBase = false;
    typeNewInput.value = "";
    renderColorOptions();
    if (typeEditSaveBtn) typeEditSaveBtn.disabled = true;
    if (typeEditCancelBtn) typeEditCancelBtn.disabled = true;
}

function deleteType(id) {
    const allTypes = getAllTypes();
    const target = allTypes.find(t => t.id === id);
    if (!target) return;
    if (allTypes.length <= 1) return;
    if (!confirm(`「${target.label}」を削除しますか？`)) return;
    const isBase = baseEventTypes.some(t => t.id === id);

    if (isBase) {
        const deleted = new Set(loadDeletedBaseTypes());
        deleted.add(id);
        saveDeletedBaseTypes([...deleted]);
        const overrides = loadBaseTypeOverrides();
        if (overrides[id]) {
            delete overrides[id];
            saveBaseTypeOverrides(overrides);
        }
    } else {
        const next = loadCustomTypes().map(t => {
            if (t.id !== id) return t;
            return { ...t, deleted: true };
        });
        saveCustomTypes(next);
    }

    const remainingTypes = getAllTypes();
    const fallbackId = remainingTypes.length ? remainingTypes[0].id : null;
    snapshotLocalData();
    renderTypeOptions(fallbackId || undefined);
    renderTypeList();
    clearTypeEdit();
    renderEvents();
}

function backfillEventTypeMeta() {
    const typeMap = new Map(getAllTypes().map(t => [t.id, t]));
    backfillStoredEventTypeMeta(days, typeMap);
}


function collectAllLocalEvents() {
    return collectStoredEvents(days);
}

async function hydrateFromRemote() {
    if (!syncEnabled || !firestore || !currentUid) return;
    const hydrateStartedAt = Date.now();
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const eventsSnap = await getDocs(collection(firestore, "users", currentUid, "events"));
        const todosSnap = await getDocs(collection(firestore, "users", currentUid, "todos"));

        const remoteEvents = [];
        eventsSnap.forEach(doc => remoteEvents.push(doc.data()));

        const remoteTodos = [];
        todosSnap.forEach(doc => remoteTodos.push({ id: doc.id, ...doc.data() }));

        const localEvents = collectAllLocalEvents();
        const hasRemoteEvents = remoteEvents.length > 0;
        const hasRemoteTodos = remoteTodos.length > 0;
        const preferLocalEvents = shouldPreferLocalEvents(hydrateStartedAt, localEvents.length > 0);
        const preferLocalTodos = shouldPreferLocalTodos(hydrateStartedAt);
        pushDebugEventLog("hydrateFromRemote:decision", {
            remoteEventCount: remoteEvents.length,
            localEventCountBeforeHydrate: localEvents.length,
            hasRemoteEvents,
            preferLocalEvents,
            preferLocalTodos
        });

        if (preferLocalEvents) {
            await syncEventsToRemote();
        } else if (hasRemoteEvents) {
            resetLocalEvents(remoteEvents);
        } else if (localEvents.length) {
            await syncEventsToRemote(); // 初回: ローカルをアップロード
        }

        if (preferLocalTodos) {
            await syncTodosToRemote(); // ローカル未同期を優先してアップロード
        } else if (hasRemoteTodos) {
            resetLocalTodos(remoteTodos);
        } else {
            await syncTodosToRemote(); // 現在の全ToDoをアップロード
        }

        renderEvents();
        updateWeekView();
    } catch (err) {
        handleSyncError(err);
    }
}

function resetLocalEvents(events) {
    pushDebugEventLog("resetLocalEvents:before", {
        incomingEventCount: Array.isArray(events) ? events.length : 0
    });
    resetStoredEvents(days, events);
    updateBackupUi();
    pushDebugEventLog("resetLocalEvents:after", {
        incomingEventCount: Array.isArray(events) ? events.length : 0
    });
}

function resetLocalTodos(remoteTodos) {
    remoteTodos.forEach(({ id, items, memo }) => {
        if (!id) return;
        saveTodos(id, items || []);
        saveTodoMemo(id, memo || "");
    });
    updateBackupUi();
    if (currentTodoDateKey) {
        renderTodoList(currentTodoDateKey);
        renderTodoMemo(currentTodoDateKey);
    }
}

async function syncEventsToRemote() {
    if (!syncEnabled || !firestore || !currentUid) return;
    try {
        const { collection, getDocs, writeBatch, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const colRef = collection(firestore, "users", currentUid, "events");
        const snap = await getDocs(colRef);
        const localEvents = collectAllLocalEvents();
        const localIds = new Set(localEvents.map(ev => String(ev.id)));
        pushDebugEventLog("syncEventsToRemote:start", {
            remoteDocCount: snap.size,
            localEventCount: localEvents.length
        });

        const batch = writeBatch(firestore);
        snap.forEach(d => {
            if (!localIds.has(d.id)) batch.delete(d.ref);
        });
        localEvents.forEach(ev => {
            batch.set(doc(colRef, String(ev.id)), ev);
        });
        await batch.commit();
        clearEventsDirty();
        pushDebugEventLog("syncEventsToRemote:done", {
            localEventCount: localEvents.length
        });
    } catch (err) {
        handleSyncError(err);
    }
}

async function syncTodosToRemote(targetDate) {
    if (!syncEnabled || !firestore || !currentUid) return;
    try {
        const { collection, getDocs, writeBatch, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
        const colRef = collection(firestore, "users", currentUid, "todos");
        const snap = await getDocs(colRef);

        const batch = writeBatch(firestore);

        if (targetDate) {
            const items = loadTodos(targetDate);
            const memo = loadTodoMemo(targetDate);
            batch.set(doc(colRef, targetDate), { items, memo });
        } else {
            // 全件同期
            const todoKeys = Object.keys(localStorage).filter(k => k.startsWith("todos-"));
            const memoKeys = Object.keys(localStorage).filter(k => k.startsWith("todo-memo-"));
            const localDates = new Set([
                ...todoKeys.map(k => k.replace("todos-", "")),
                ...memoKeys.map(k => k.replace("todo-memo-", ""))
            ]);
            snap.forEach(d => {
                if (!localDates.has(d.id)) batch.delete(d.ref);
            });
            localDates.forEach(dateISO => {
                const items = loadTodos(dateISO);
                const memo = loadTodoMemo(dateISO);
                batch.set(doc(colRef, dateISO), { items, memo });
            });
        }

        await batch.commit();
        clearTodosDirty();
    } catch (err) {
        handleSyncError(err);
    }
}

async function localSignup(email, password) {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) throw { code: "local/invalid-email" };
    if (password.length < 8) throw { code: "local/weak-password" };
    const exists = findLocalUserByEmail(normalized, normalizeEmail);
    if (exists) throw { code: "local/email-already-in-use" };
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const user = createAndStoreLocalUser(normalized, passwordHash, salt);
    return getLocalAuthUser(user);
}

async function localLogin(email, password) {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) throw { code: "local/invalid-email" };
    const user = findLocalUserByEmail(normalized, normalizeEmail);
    if (!user) throw { code: "local/user-not-found" };
    const passwordHash = await hashPassword(password, user.salt);
    const result = verifyLocalUserCredentials(normalized, passwordHash, normalizeEmail);
    if (!result.ok) throw { code: result.code };
    return getLocalAuthUser(result.user);
}

async function emailPasswordLogin() {
    const ready = await ensureFirebaseReady();
    if (!ready || !firebaseAuth) {
        setInlineError(authError, getAuthReadyErrorMessage(firebaseInitFailed));
        return;
    }
    const email = (authEmail.value || "").trim();
    const password = authPassword.value || "";
    setInlineError(authError, "");
    const loginError = validateLoginForm({ email, password, isValidEmail });
    if (loginError) {
        setInlineError(authError, loginError);
        return;
    }
    authStatus.textContent = "同期状態: ログイン処理中…";
    setButtonLoading(authLoginBtn, true, "ログイン中…");
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        const shouldUpgrade = pendingUpgrade;
        const closeState = getAuthSuccessCloseState({ closeAuth: true, closePlus: shouldUpgrade });
        if (closeState.closeAuth) closeAuthModal();
        if (closeState.closePlus) closePlusModal();
        if (closeState.clearPendingUpgrade) pendingUpgrade = false;
    } catch (err) {
        setInlineError(authError, mapAuthError(err, "login"));
        updateSyncStatus();
    } finally {
        setButtonLoading(authLoginBtn, false, "ログイン");
    }
}

async function emailPasswordSignup() {
    const ready = await ensureFirebaseReady();
    if (!ready || !firebaseAuth) {
        setInlineError(signupError, getAuthReadyErrorMessage(firebaseInitFailed));
        return;
    }
    const email = (signupEmail && signupEmail.value ? signupEmail.value : "").trim();
    const password = signupPassword && signupPassword.value ? signupPassword.value : "";
    const passwordConfirm = signupPasswordConfirm && signupPasswordConfirm.value ? signupPasswordConfirm.value : "";
    const agreed = !!(signupTerms && signupTerms.checked);

    setInlineError(signupError, "");
    const signupValidationError = validateSignupForm({
        email,
        password,
        passwordConfirm,
        agreed,
        isValidEmail
    });
    if (signupValidationError) {
        setInlineError(signupError, signupValidationError);
        return;
    }

    setButtonLoading(signupSubmitBtn, true, "登録中…");
    try {
        if (!firebaseAuth) {
            const localUser = await localSignup(email, password);
            applyPlusActivation({
                setStoredSession,
                setStoredPlanForUser,
                applyAuthState
            }, localUser);
        } else {
            const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            if (result && result.user) {
                const userInfo = buildLocalUserAuth(result.user.email || email, result.user.uid);
                applyPlusActivation({
                    setStoredSession,
                    setStoredPlanForUser,
                    applyAuthState
                }, userInfo);
            }
        }
        const closeState = getAuthSuccessCloseState({ closeSignup: true, closePlus: true });
        if (closeState.closeSignup) closeSignupModal();
        if (closeState.closePlus) closePlusModal();
        if (closeState.clearPendingUpgrade) pendingUpgrade = false;
    } catch (err) {
        setInlineError(signupError, mapAuthError(err, "signup"));
    } finally {
        setButtonLoading(signupSubmitBtn, false, "登録");
    }
}

// ==================== 描画 ====================
function renderEvents() {
    document.querySelectorAll(".event").forEach(e => e.remove());
    const { weekStart, weekEnd } = getWeekRange(currentWeek, getWeekStart);
    const weekEvents = collectStoredWeekEvents(days, weekStart, weekEnd);
    const groupedEvents = groupEventsByDay(weekEvents);
    pushDebugEventLog("renderEvents", {
        renderedEventCount: weekEvents.length,
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString()
    });

    days.forEach((_, i) => {
        const timeline = document.querySelector(`.timeline[data-day="${i}"]`);
        if (!timeline) return;
        const events = groupedEvents.get(i) || [];
        events.forEach(ev => {
            const eventElement = createEventElement(ev);
            timeline.appendChild(eventElement);
        });
    });
}


function createEventElement(ev) {
    const div = document.createElement("div");
    div.classList.add("event", ev.type);
    const completion = getEventCompletionState(ev);
    if (completion.completed) {
        div.classList.add("completed");
    }
    if (completion.assigned) {
        div.classList.add("assigned");
    }
    const customType = getCustomTypeById(ev.type);
    const colorStyle = getEventColorStyle(ev, customType);
    if (colorStyle.background) div.style.background = colorStyle.background;
    if (colorStyle.color) div.style.color = colorStyle.color;
    div.draggable = true;

    div.textContent = buildEventLabel(ev);
    const positionStyle = getEventPositionStyle(ev, startHour, hourHeight);
    div.style.top = positionStyle.top;
    div.style.height = positionStyle.height;

    // ドラッグとの誤爆防止用フラグ
    let isDragging = false;

    div.addEventListener("dragstart", (e) => {
        isDragging = true;
        e.dataTransfer.setData("text/plain", serializeDraggedEvent(ev));
    });

    div.addEventListener("dragend", () => {
        // クリックと競合しないよう少し後で解除
        setTimeout(() => { isDragging = false; }, 0);
    });

    div.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        openModal(ev);
    });

    div.addEventListener("click", (e) => {
        e.stopPropagation();
        if (shouldIgnoreEventClick(isDragging)) return;
        toggleEventCompletion(ev);
        syncEventsToRemote();
    });

    return div;
}


// ==================== ドラッグ＆ドロップ ====================
document.querySelectorAll(".timeline").forEach((tl) => {
    tl.addEventListener("dragover", (e) => e.preventDefault());
    tl.addEventListener("drop", (e) => {
        e.preventDefault();
        const data = parseDraggedEvent(e.dataTransfer.getData("text/plain"));
        if (!data) return;
        const newDay = parseInt(tl.dataset.day);
        moveEventToDay(data.day, data.id, newDay, buildMovedEvent(data, newDay));
        markEventsDirty();
        snapshotLocalData();

        renderEvents();
        syncEventsToRemote();
    });
});

// ==================== 初回描画 ====================
syncTypeLabelCacheFromEvents(collectAllLocalEvents());
ensureCustomTypesFromCache();
rebuildCustomTypesFromEvents(collectAllLocalEvents());
syncTypeLabelCacheFromTypes(getAllTypes());
backfillEventTypeMeta();
renderEvents();
updateWeekView();
highlightCurrentDay();
(function () {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
    });

    navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    const bar = document.createElement("div");
                    bar.style.position = "fixed";
                    bar.style.left = "12px";
                    bar.style.right = "12px";
                    bar.style.bottom = "12px";
                    bar.style.padding = "10px 12px";
                    bar.style.background = "#111827";
                    bar.style.color = "#fff";
                    bar.style.borderRadius = "10px";
                    bar.style.zIndex = "9999";
                    bar.style.display = "flex";
                    bar.style.alignItems = "center";
                    bar.style.justifyContent = "space-between";
                    bar.innerHTML = '<span style="font-size:13px">新しいバージョンがあります</span>';

                    const btn = document.createElement("button");
                    btn.textContent = "更新";
                    btn.style.border = "none";
                    btn.style.background = "#2563eb";
                    btn.style.color = "#fff";
                    btn.style.padding = "8px 12px";
                    btn.style.borderRadius = "8px";
                    btn.style.cursor = "pointer";

                    btn.onclick = () => {
                        newWorker.postMessage({ type: "SKIP_WAITING" });
                    };

                    bar.appendChild(btn);
                    document.body.appendChild(bar);
                }
            });
        });
    });
})();

async function initLegacyScheduleApp() {
    restoreCurrentWeekState();
    cleanupLegacyStoragePressure();
    ensureInitialBackup();
    window.__scheduleDebug = {
        getLogs: () => {
            const raw = sessionStorage.getItem(debugEventLogStorageKey);
            return raw ? JSON.parse(raw) : [];
        },
        clearLogs: () => sessionStorage.removeItem(debugEventLogStorageKey),
        snapshot: () => getDebugEventSnapshot()
    };
    pushDebugEventLog("initLegacyScheduleApp:start");

    runInitialUiSetup({
        seedDefaultCustomTypesIfNeeded,
        migrateBaseTypesToCustomIfNeeded,
        bindUIHandlers,
        setTypePanelOpen,
        renderTypeOptions,
        renderColorOptions,
        renderTypeList,
        bindColorSwatches,
        applyAuthState,
        clearSyncMessage
    });

    applyAuthButtonDisabledState({
        setAuthLoginDisabled: disabled => {
            if (authLoginBtn) authLoginBtn.disabled = disabled;
        },
        setSignupSubmitDisabled: disabled => {
            if (signupSubmitBtn) signupSubmitBtn.disabled = disabled;
        }
    }, true);

    await initFirebaseSync();

    if (!firebaseInitFailed) {
        applyAuthButtonDisabledState({
            setAuthLoginDisabled: disabled => {
                if (authLoginBtn) authLoginBtn.disabled = disabled;
            },
            setSignupSubmitDisabled: disabled => {
                if (signupSubmitBtn) signupSubmitBtn.disabled = disabled;
            }
        }, false);
    }

    restoreCurrentTodoState();
    updateBackupUi();
    pushDebugEventLog("initLegacyScheduleApp:done");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLegacyScheduleApp, { once: true });
} else {
    initLegacyScheduleApp();
}
