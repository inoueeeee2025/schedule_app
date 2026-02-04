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

let selectedDay = null;
let editingEvent = null;
let currentWeek = new Date();
let pendingUpgrade = false;

const baseEventTypes = [];
const baseTypeOverridesKey = "base-event-type-overrides";
const baseTypeDeletedKey = "base-event-type-deleted";
const typeLabelCacheKey = "event-type-label-cache";
const customTypePalette = [
    "#123060",
    "#5b8def",
    "#0ea5e9",
    "#7cc7ff",
    "#10b981",
    "#f6c344",
    "#d97706",
    "#ff8c00",
    "#ef4444",
    "#8b5cf6",
    "#8b5e3b",
    "#333333"
];

let editingTypeId = null;
let editingTypeIsBase = false;
let typePanelLastFocus = null;

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

function loadCustomTypes() {
    try {
        const raw = JSON.parse(localStorage.getItem("custom-event-types") || "[]");
        if (!Array.isArray(raw)) return [];
        return raw.map(t => {
            if (!t || typeof t !== "object") return null;
            const id = typeof t.id === "string" ? t.id : null;
            if (!id) return null;
            const label = typeof t.label === "string" && t.label.trim() ? t.label : id;
            const color = typeof t.color === "string" && t.color ? t.color : customTypePalette[0];
            return { id, label, color, deleted: !!t.deleted };
        }).filter(Boolean);
    } catch {
        return [];
    }
}

function saveCustomTypes(types) {
    localStorage.setItem("custom-event-types", JSON.stringify(types));
}

function loadTypeLabelCache() {
    try {
        const raw = JSON.parse(localStorage.getItem(typeLabelCacheKey) || "{}");
        return raw && typeof raw === "object" ? raw : {};
    } catch {
        return {};
    }
}

function saveTypeLabelCache(cache) {
    localStorage.setItem(typeLabelCacheKey, JSON.stringify(cache));
}

function updateTypeLabelCache(typeId, label, color) {
    if (!typeId || !label) return;
    const cache = loadTypeLabelCache();
    const next = { label, color: color || "" };
    if (!cache[typeId] || cache[typeId].label !== next.label || cache[typeId].color !== next.color) {
        cache[typeId] = next;
        saveTypeLabelCache(cache);
    }
}

function removeTypeLabelCache(typeId) {
    if (!typeId) return;
    const cache = loadTypeLabelCache();
    if (cache[typeId]) {
        delete cache[typeId];
        saveTypeLabelCache(cache);
    }
}

function syncTypeLabelCacheFromTypes() {
    const cache = loadTypeLabelCache();
    let changed = false;
    getAllTypes().forEach(t => {
        if (!cache[t.id] || cache[t.id].label !== t.label || cache[t.id].color !== t.color) {
            cache[t.id] = { label: t.label, color: t.color || "" };
            changed = true;
        }
    });
    if (changed) saveTypeLabelCache(cache);
}

function syncTypeLabelCacheFromEvents() {
    const cache = loadTypeLabelCache();
    let changed = false;
    const events = collectAllLocalEvents();
    events.forEach(ev => {
        if (!ev || !ev.type || !ev.typeLabel) return;
        const color = ev.typeColor || cache[ev.type]?.color || "";
        if (!cache[ev.type] || cache[ev.type].label !== ev.typeLabel || cache[ev.type].color !== color) {
            cache[ev.type] = { label: ev.typeLabel, color };
            changed = true;
        }
    });
    if (changed) saveTypeLabelCache(cache);
}

function ensureCustomTypesFromCache() {
    const cache = loadTypeLabelCache();
    const customTypes = loadCustomTypes();
    let changed = false;
    Object.entries(cache).forEach(([id, meta]) => {
        if (!id.startsWith("custom-")) return;
        if (!meta || !meta.label) return;
        if (customTypes.some(t => t.id === id)) return;
        customTypes.push({
            id,
            label: meta.label,
            color: meta.color || customTypePalette[0]
        });
        changed = true;
    });
    if (changed) saveCustomTypes(customTypes);
}

function rebuildCustomTypesFromEvents() {
    const customTypes = loadCustomTypes();
    const existingIds = new Set(customTypes.map(t => t.id));
    let changed = false;
    const events = collectAllLocalEvents();
    const cache = loadTypeLabelCache();
    events.forEach(ev => {
        if (!ev || !ev.type || !String(ev.type).startsWith("custom-")) return;
        if (existingIds.has(ev.type)) return;
        const label = ev.typeLabel || cache[ev.type]?.label;
        if (!label) return;
        const color = ev.typeColor || cache[ev.type]?.color || customTypePalette[0];
        customTypes.push({ id: ev.type, label, color });
        existingIds.add(ev.type);
        changed = true;
    });
    if (changed) saveCustomTypes(customTypes);
}

function getVisibleCustomTypes() {
    return loadCustomTypes().filter(t => !t.deleted);
}

function getCustomTypeById(id) {
    return loadCustomTypes().find(t => t.id === id);
}

function loadBaseTypeOverrides() {
    try { return JSON.parse(localStorage.getItem(baseTypeOverridesKey) || "{}"); }
    catch { return {}; }
}

function saveBaseTypeOverrides(overrides) {
    localStorage.setItem(baseTypeOverridesKey, JSON.stringify(overrides));
}

function loadDeletedBaseTypes() {
    try { return JSON.parse(localStorage.getItem(baseTypeDeletedKey) || "[]"); }
    catch { return []; }
}

function saveDeletedBaseTypes(ids) {
    localStorage.setItem(baseTypeDeletedKey, JSON.stringify(ids));
}

function getBaseTypes() {
    const overrides = loadBaseTypeOverrides();
    const deleted = new Set(loadDeletedBaseTypes());
    return baseEventTypes
        .filter(t => !deleted.has(t.id))
        .map(t => ({ ...t, ...(overrides[t.id] || {}) }));
}

function getAllTypes() {
    return [...getBaseTypes(), ...getVisibleCustomTypes()];
}

function resolveTypeMeta(typeId, preferLabel) {
    if (!typeId) return null;
    const base = getBaseTypes().find(t => t.id === typeId);
    if (base) return base;
    const custom = loadCustomTypes().find(t => t.id === typeId);
    if (custom) return custom;
    const cached = loadTypeLabelCache()[typeId];
    const label = preferLabel || cached?.label || "";
    const color = cached?.color || "";
    return { id: typeId, label, color };
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
    const selectedType = types.find(t => t.id === selectedId) || resolveTypeMeta(selectedId) || types[0];
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
    typeSelect.innerHTML = "";
    allTypes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        typeSelect.appendChild(opt);
    });
    if (selectedId && !allTypes.some(t => t.id === selectedId)) {
        const fallback = resolveTypeMeta(selectedId, selectedLabel);
        const label = fallback?.label || "";
        if (label) {
            const opt = document.createElement("option");
            opt.value = selectedId;
            opt.textContent = label;
            typeSelect.appendChild(opt);
            typeSelect.value = selectedId;
            return;
        }
    }
    if (allTypes.length === 0) return;
    const fallbackId = allTypes[0].id;
    typeSelect.value = selectedId && allTypes.some(t => t.id === selectedId)
        ? selectedId
        : fallbackId;
    renderTypePicker(allTypes, typeSelect.value);
}

function renderColorOptions(selectedValue) {
    if (!typeColorInput) return;
    const value = selectedValue || customTypePalette[0];
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
    const allTypes = getAllTypes();
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

function getStoredSession() {
    try { return JSON.parse(localStorage.getItem("session") || "null"); }
    catch { return null; }
}

function setStoredSession(session) {
    localStorage.setItem("session", JSON.stringify(session));
}

function clearStoredSession() {
    localStorage.removeItem("session");
}

function getStoredPlanForUser(userId) {
    if (!userId) return null;
    try {
        const raw = JSON.parse(localStorage.getItem("plan") || "{}");
        return raw[userId] || null;
    } catch {
        return null;
    }
}

function setStoredPlanForUser(userId, plan) {
    if (!userId) return;
    const next = { userId, plan, updatedAt: new Date().toISOString() };
    let raw = {};
    try { raw = JSON.parse(localStorage.getItem("plan") || "{}"); }
    catch { raw = {}; }
    raw[userId] = next;
    localStorage.setItem("plan", JSON.stringify(raw));
}

function updateSyncStatus() {
    if (!authState.isLoggedIn) {
        authStatus.textContent = "未ログイン";
        if (syncRefreshBtn) syncRefreshBtn.style.display = "none";
        return;
    }
    if (authState.plan === "plus") {
        authStatus.textContent = " ログイン（Plus：同期中）";
        if (syncRefreshBtn) syncRefreshBtn.style.display = "none";
        return;
    }
    authStatus.textContent = "同期状態: ログイン（Free：ローカル保存）";
    if (syncRefreshBtn) syncRefreshBtn.style.display = "inline-block";
}

function applyAuthState({ isLoggedIn, user, plan }) {
    authState.isLoggedIn = !!isLoggedIn;
    authState.user = user || null;
    authState.plan = plan || "free";
    isProUser = authState.plan === "plus";
    syncEnabled = isProUser;
    setAuthUI(authState.isLoggedIn, authState.plan);
    updateSyncStatus();
    if (accountOpenBtn) accountOpenBtn.disabled = !authState.isLoggedIn;
    if (!authState.isLoggedIn && accountModal) closeAccountModal();
}

function initLocalSessionState() {
    const session = getStoredSession();
    if (session && session.userId) {
        const storedPlan = getStoredPlanForUser(session.userId);
        applyAuthState({
            isLoggedIn: true,
            user: { id: session.userId, email: session.email || "" },
            plan: storedPlan && storedPlan.plan ? storedPlan.plan : "free"
        });
        return;
    }
    applyAuthState({ isLoggedIn: false, plan: "free", user: null });
}

function clearSyncMessage() {
    if (!syncMessage) return;
    syncMessage.textContent = "";
    syncMessage.className = "sync-message";
    syncMessage.style.display = "none";
    if (upgradeBtn) upgradeBtn.classList.remove("attention");
}

function showSyncMessage(message, tone = "warning") {
    if (!syncMessage) return;
    syncMessage.textContent = message;
    syncMessage.className = `sync-message ${tone}`;
    syncMessage.style.display = message ? "block" : "none";
}

function setInlineError(el, message) {
    if (!el) return;
    el.textContent = message || "";
    el.style.display = message ? "block" : "none";
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

function loadLocalUsers() {
    try { return JSON.parse(localStorage.getItem("users") || "[]"); }
    catch { return []; }
}

function saveLocalUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
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
    const code = (err && err.code) ? String(err.code) : "";
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

function isPermissionDeniedError(err) {
    const code = (err && err.code) ? String(err.code) : "";
    const msg = (err && err.message) ? String(err.message) : "";
    return code.includes("permission-denied")
        || code.includes("PERMISSION_DENIED")
        || msg.includes("permission-denied")
        || msg.includes("PERMISSION_DENIED");
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
    const totalHours = endHour - startHour + 1;
    timeline.style.height = totalHours * hourHeight + "px";

    for (let h = startHour; h <= endHour; h++) {
        const line = document.createElement("div");
        line.className = "hour-line";
        line.style.top = (h - startHour) * hourHeight + "px";

        const label = document.createElement("div");
        label.className = "hour-label";
        label.style.top = (h - startHour) * hourHeight + "px";
        label.textContent = `${h}:00`;

        timeline.appendChild(line);
        timeline.appendChild(label);
    }

    timeline.addEventListener("dblclick", (e) => {
        selectedDay = i;
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const hour = Math.floor(y / hourHeight) + startHour;

        startInput.value = format(hour);
        endInput.value = format(hour + 1);
        openModal();
    });

    dayColumn.appendChild(timeline);
    weekView.appendChild(dayColumn);
});

// ==================== モーダル操作 ====================
function closeMainModal() {
    modal.style.display = "none";
    setTypePanelOpen(false);
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
    if (typePickerBtn) {
        typePickerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setTypePickerOpen();
        });
    }
    if (typeSelect) {
        typeSelect.addEventListener("change", () => {
            renderTypePicker(getAllTypes(), typeSelect.value);
        });
    }
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
    editingEvent = eventObj;
    modalTitle.textContent = eventObj ? "予定を編集" : "予定を追加";
    modal.style.display = "flex";
    setTypePanelOpen(false);

    if (eventObj) {
        titleInput.value = eventObj.title;
        renderTypeOptions(eventObj.type, eventObj.typeLabel);
        startInput.value = format(eventObj.start);
        endInput.value = format(eventObj.end);
        repeatSelect.value = eventObj.repeat || 'none';   // ← 追加
        if (typeof eventObj.tapToggle === "boolean") {
            tapToggleInput.checked = eventObj.tapToggle;
        } else {
            tapToggleInput.checked = eventObj.type === "school";
        }
        selectedDay = eventObj.day;
        deleteBtn.style.display = "inline-block";
        deleteScopeRow.style.display = "block";
        deleteScopeSelect.value = "single"; // 初期選択は単発削除に固定
    } else {
        titleInput.value = "";
        renderTypeOptions("school");                      // お好みで初期値
        startInput.value = "09:00";
        endInput.value = "10:00";
        repeatSelect.value = "none";                      // ← 追加
        tapToggleInput.checked = true;
        deleteBtn.style.display = "none";
        deleteScopeRow.style.display = "none";
        deleteScopeSelect.value = "single";
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
    updateWeekView();
    highlightCurrentDay();
    closeDatePicker();
}

function setupDatePickerOptions(baseDate) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;
    const day = baseDate.getDate();

    datePickerYear.innerHTML = "";
    for (let y = year - 5; y <= year + 5; y++) {
        const opt = document.createElement("option");
        opt.value = String(y);
        opt.textContent = `${y}`;
        datePickerYear.appendChild(opt);
    }
    datePickerYear.value = String(year);

    datePickerMonth.innerHTML = "";
    for (let m = 1; m <= 12; m++) {
        const opt = document.createElement("option");
        opt.value = String(m);
        opt.textContent = `${m}`;
        datePickerMonth.appendChild(opt);
    }
    datePickerMonth.value = String(month);

    updateDatePickerDays(day);
    renderDatePickerCalendar();
}

function updateDatePickerDays(preferredDay) {
    if (!datePickerYear || !datePickerMonth || !datePickerDay) return;
    const year = parseInt(datePickerYear.value, 10);
    const month = parseInt(datePickerMonth.value, 10);
    if (!year || !month) return;
    const daysInMonth = new Date(year, month, 0).getDate();
    const current = preferredDay || parseInt(datePickerDay.value || "1", 10);

    datePickerDay.innerHTML = "";
    for (let d = 1; d <= daysInMonth; d++) {
        const opt = document.createElement("option");
        opt.value = String(d);
        opt.textContent = `${d}`;
        datePickerDay.appendChild(opt);
    }
    const safeDay = Math.min(current || 1, daysInMonth);
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

    const first = new Date(year, month - 1, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;

    for (let i = 0; i < startDay; i++) {
        const blank = document.createElement("div");
        blank.className = "date-picker-day is-muted";
        blank.textContent = "";
        datePickerCalendar.appendChild(blank);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "date-picker-day";
        btn.textContent = String(d);
        if (isCurrentMonth && d === today.getDate()) {
            btn.classList.add("is-today");
        }
        btn.addEventListener("click", () => {
            if (datePickerDay) datePickerDay.value = String(d);
            const selected = getDatePickerValue();
            if (!selected) return;
            currentWeek = selected;
            updateWeekView();
            highlightCurrentDay();
            closeDatePicker();
        });
        datePickerCalendar.appendChild(btn);
    }
}


// ==================== 時間変換 ====================
function parseTime(t) {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
}

function format(t) {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ==================== 今日をハイライト ====================
function highlightCurrentDay() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 現在表示している週の月曜～日曜を計算
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // まず全てリセット
    document.querySelectorAll(".day-header").forEach(h => h.classList.remove("current-day"));

    // 今日が今の週に含まれていればその曜日を黄色に
    if (today >= weekStart && today <= weekEnd) {
        const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
        const header = document.querySelectorAll(".day-header")[dayIndex];
        if (header) header.classList.add("current-day");
    }
}

// ==================== 週切り替え ====================
document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateWeekView();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateWeekView();
});

function updateWeekView() {
    const weekLabel = document.getElementById('weekLabel');
    const year = currentWeek.getFullYear();
    const month = currentWeek.getMonth() + 1;
    const weekNum = Math.ceil(currentWeek.getDate() / 7);
    weekLabel.textContent = `${year}年${month}月第${weekNum}週`;

    // 今週の月曜から日曜の日付を計算
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    // 曜日ヘッダーに実日付を埋め込み & クリックでToDoを開く
    document.querySelectorAll(".day-header").forEach((header, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const label = toJPLabel(date);
        header.textContent = label;
        header.dataset.date = toISODate(date); // ← この日付キーでToDo保存

        // クリックで当日のToDoパネルを開く
        header.onclick = () => openTodoForDate(date);
    });

    highlightCurrentDay(); // 今日を黄色に
    renderEvents();
}

function todoKey(dateISO) {
    return `todos-${dateISO}`; // 例: todos-2025-10-25
}

function todoMemoKey(dateISO) {
    return `todo-memo-${dateISO}`;
}

function loadTodos(dateISO) {
    try { return JSON.parse(localStorage.getItem(todoKey(dateISO)) || "[]"); }
    catch { return []; }
}

function saveTodos(dateISO, items) {
    localStorage.setItem(todoKey(dateISO), JSON.stringify(items));
}

function loadTodoMemo(dateISO) {
    return localStorage.getItem(todoMemoKey(dateISO)) || "";
}

function saveTodoMemo(dateISO, text) {
    localStorage.setItem(todoMemoKey(dateISO), text);
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
            item.done = cb.checked;
            saveTodos(dateISO, items);
            renderTodoList(dateISO);
        };

        const span = document.createElement("span");
        span.className = "todo-text" + (item.done ? " done" : "");
        span.textContent = item.text;

        const del = document.createElement("button");
        del.className = "todo-delete";
        del.textContent = "削除";
        del.onclick = () => {
            const next = items.filter(x => x.id !== item.id);
            saveTodos(dateISO, next);
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
            item.text = trimmed;
            saveTodos(dateISO, items);
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

    todoDateLabel.textContent = `ToDo: ${toJPLabel(dateObj)}`;
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
}

todoClose.addEventListener("click", closeTodoPanel);
todoPanel.addEventListener("click", (e) => {
    // パネルの外側（グレーの背景ではなく右サイドなので今回は不要）
    // ここでは閉じない仕様にしておく。必要なら条件追加で閉じても良い。
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text || !currentTodoDateKey) return;
    const items = loadTodos(currentTodoDateKey);
    items.push({ id: Date.now(), text, done: false });
    saveTodos(currentTodoDateKey, items);
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
    todoMemoEdit.textContent = hasText ? "メモを編集" : "メモを追加";
}

todoAdd.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodo();
});

todoMemoSave.addEventListener("click", () => {
    if (!currentTodoDateKey) return;
    saveTodoMemo(currentTodoDateKey, todoMemo.value || "");
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
});

todoClearDone.addEventListener("click", () => {
    if (!currentTodoDateKey) return;
    const items = loadTodos(currentTodoDateKey).filter(i => !i.done);
    saveTodos(currentTodoDateKey, items);
    renderTodoList(currentTodoDateKey);
    syncTodosToRemote(currentTodoDateKey);
});



function toggleEventCompletion(ev) {
    const canToggle = typeof ev.tapToggle === "boolean"
        ? ev.tapToggle
        : ev.type === "school";
    if (!canToggle) return;
    const key = `events-day${ev.day}`;
    const events = JSON.parse(localStorage.getItem(key) || "[]");
    const idx = events.findIndex(x => x.id === ev.id);
    if (idx === -1) return;

    const nextCompleted = !events[idx].completed;
    events[idx].tapToggle = canToggle;
    events[idx].completed = nextCompleted;
    if (events[idx].type === "school") {
        events[idx].assigned = nextCompleted;
    }

    localStorage.setItem(key, JSON.stringify(events));
    renderEvents(); // 反映
    syncEventsToRemote();
}

function toISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function toJPLabel(d) {
    const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()} (${wd})`;
}



// ==================== イベント保存 ====================
function saveEvent() {
    const title = titleInput.value.trim();
    const type = typeSelect.value;
    const start = parseTime(startInput.value);
    const end = parseTime(endInput.value);
    const repeat = repeatSelect.value; // ← 変更

    if (!title || start >= end) return;

    const typeMeta = getAllTypes().find(t => t.id === type);
    const typeLabel = typeMeta ? typeMeta.label : type;
    const typeColor = typeMeta ? typeMeta.color : "";
    updateTypeLabelCache(type, typeLabel, typeColor);

    const key = `events-day${selectedDay}`;

    const eventDate = new Date(currentWeek);
    eventDate.setDate(eventDate.getDate() - eventDate.getDay() + selectedDay + 1);

    // 編集時は基準日以降だけを更新するためのしきい値
    const changeStartDate = editingEvent && editingEvent.date
        ? new Date(editingEvent.date)
        : new Date(eventDate);
    changeStartDate.setHours(0, 0, 0, 0);

    const baseId = editingEvent ? editingEvent.baseId : Date.now();
    const newEvent = {
        id: Date.now(),
        baseId,
        title,
        type,
        typeLabel,
        typeColor,
        start,
        end,
        day: selectedDay,
        date: eventDate.toISOString(),
        repeat,
        tapToggle: !!tapToggleInput.checked,
        completed: editingEvent
            ? !!editingEvent.completed || (editingEvent.type === "school" && editingEvent.assigned)
            : false
    };

    // ① まず同じ baseId を全曜日から削除（編集時は既存シリーズを消す）
    days.forEach((_, i) => {
        const k = `events-day${i}`;
        let evs = JSON.parse(localStorage.getItem(k) || "[]");
        evs = evs.filter(ev => {
            if (ev.baseId !== baseId) return true;
            if (!ev.date) return false;
            const evDate = new Date(ev.date);
            evDate.setHours(0, 0, 0, 0);
            return evDate < changeStartDate; // 過去は残し、基準日以降を差し替え
        });
        localStorage.setItem(k, JSON.stringify(evs));
    });

    // ② その後に “いまの曜日” の配列を取り直して新イベントを追加
    let events = JSON.parse(localStorage.getItem(key) || "[]"); // ← ここで取り直すのがポイント
    events.push(newEvent);
    localStorage.setItem(key, JSON.stringify(events));

    // ③ 繰り返しを展開
    if (repeat !== 'none') {
        const repeatDates = generateRepeatDates(eventDate, repeat);
        repeatDates.forEach(date => {
            const dayIndex = (date.getDay() + 6) % 7; // 月曜=0
            const repeatKey = `events-day${dayIndex}`;
            const repeatEvents = JSON.parse(localStorage.getItem(repeatKey) || "[]");
            repeatEvents.push({
                ...newEvent,
                id: Date.now() + Math.random(),
                day: dayIndex,
                date: date.toISOString(),
            });
            localStorage.setItem(repeatKey, JSON.stringify(repeatEvents));
        });
    }

    modal.style.display = "none";
    setTypePanelOpen(false);
    renderEvents();
    updateWeekView();
    backfillEventTypeMeta();
    syncEventsToRemote();
}

function deleteEventByScope(targetEvent, scope) {
    if (!targetEvent) return;
    const baseId = Number(targetEvent.baseId);
    const hasSeries = !Number.isNaN(baseId);
    const normalizedScope = hasSeries ? scope : "single";

    if (normalizedScope === "single") {
        const key = `events-day${targetEvent.day}`;
        let events = JSON.parse(localStorage.getItem(key) || "[]");
        events = events.filter(ev => ev.id !== targetEvent.id);
        localStorage.setItem(key, JSON.stringify(events));
        return;
    }

    if (normalizedScope === "all") {
        days.forEach((_, i) => {
            const key = `events-day${i}`;
            let events = JSON.parse(localStorage.getItem(key) || "[]");
            events = events.filter(ev => ev.baseId !== baseId);
            localStorage.setItem(key, JSON.stringify(events));
        });
        return;
    }

    const changeStartDate = targetEvent.date ? new Date(targetEvent.date) : new Date();
    changeStartDate.setHours(0, 0, 0, 0);

    days.forEach((_, i) => {
        const key = `events-day${i}`;
        let events = JSON.parse(localStorage.getItem(key) || "[]");
        events = events.filter(ev => {
            if (ev.baseId !== baseId) return true;
            if (!ev.date) return false;
            const evDate = new Date(ev.date);
            evDate.setHours(0, 0, 0, 0);
            return evDate < changeStartDate;
        });
        localStorage.setItem(key, JSON.stringify(events));
    });
}

function deleteEvent() {
    if (!editingEvent) return;

    const scope = deleteScopeSelect ? deleteScopeSelect.value : "future";
    deleteEventByScope(editingEvent, scope);
    modal.style.display = "none";
    setTypePanelOpen(false);
    renderEvents();
    syncEventsToRemote();
}

// ==================== 一括削除 ====================
function collectWeekEvents() {
    const result = [];
    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    days.forEach((_, i) => {
        const key = `events-day${i}`;
        const events = JSON.parse(localStorage.getItem(key) || "[]");
        events.forEach(ev => {
            if (!ev.date) return;
            const evDate = new Date(ev.date);
            if (evDate >= weekStart && evDate <= weekEnd) {
                result.push({ ...ev, day: i });
            }
        });
    });
    return result;
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

    events.sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        if (da.getTime() !== db.getTime()) return da - db;
        return a.start - b.start;
    });

    events.forEach(ev => {
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
        const dateObj = new Date(ev.date);
        label.textContent = `${toJPLabel(dateObj)} ${ev.title} (${format(ev.start)}-${format(ev.end)})`;

        li.appendChild(cb);
        li.appendChild(label);
        bulkList.appendChild(li);
    });
}

function bulkDeleteSelected() {
    const checked = bulkList.querySelectorAll('input[type="checkbox"]:checked');
    if (!checked.length) {
        closeBulkModal();
        return;
    }
    const scope = bulkDeleteScope ? bulkDeleteScope.value : "single";
    const processed = new Set();

    checked.forEach(cb => {
        const dayIndex = parseInt(cb.dataset.day, 10);
        const id = Number(cb.dataset.id);
        const baseId = cb.dataset.baseId ? Number(cb.dataset.baseId) : NaN;
        const date = cb.dataset.date || null;
        const key = `${scope}-${Number.isNaN(baseId) ? id : baseId}-${date || ""}`;
        if (processed.has(key)) return;
        processed.add(key);

        deleteEventByScope({
            day: dayIndex,
            id,
            baseId: Number.isNaN(baseId) ? null : baseId,
            date
        }, scope);
    });

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
        setStoredPlanForUser(user.uid, "plus");
        applyAuthState({
            isLoggedIn: true,
            user: { id: user.uid, email: user.email || "" },
            plan: nextPlan
        });
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
                    applyAuthState({ isLoggedIn: false, plan: "free", user: null });
                    clearSyncMessage();
                    return;
                }
                currentUid = user.uid;
                setStoredSession({
                    userId: user.uid,
                    email: user.email || "",
                    loggedInAt: new Date().toISOString()
                });
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
    authModal.style.display = "flex";
    setInlineError(authError, "");
}

function closeAuthModal() {
    authModal.style.display = "none";
    setInlineError(authError, "");
    pendingUpgrade = false;
}

function openAccountModal() {
    if (!accountModal) return;
    if (!authState.isLoggedIn) return;
    accountModal.style.display = "flex";
    if (accountEmailFields) {
        accountEmailFields.classList.remove("is-open");
        accountEmailFields.setAttribute("aria-hidden", "true");
    }
    if (accountPasswordFields) {
        accountPasswordFields.classList.remove("is-open");
        accountPasswordFields.setAttribute("aria-hidden", "true");
    }
    if (accountEmailToggleBtn) accountEmailToggleBtn.setAttribute("aria-expanded", "false");
    if (accountPasswordToggleBtn) accountPasswordToggleBtn.setAttribute("aria-expanded", "false");
    if (accountEmailInput) {
        accountEmailInput.value = authState.user && authState.user.email ? authState.user.email : "";
    }
    if (accountCurrentPassword) accountCurrentPassword.value = "";
    if (accountNewPassword) accountNewPassword.value = "";
    if (accountNewPasswordConfirm) accountNewPasswordConfirm.value = "";
    setInlineError(accountEmailError, "");
    setInlineError(accountPasswordError, "");
    setInlineError(accountError, "");
}

function closeAccountModal() {
    if (!accountModal) return;
    accountModal.style.display = "none";
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
    fields.classList.toggle("is-open", willOpen);
    fields.setAttribute("aria-hidden", String(!willOpen));
    toggleBtn.setAttribute("aria-expanded", String(willOpen));
    if (!willOpen) {
        if (isEmail) setInlineError(accountEmailError, "");
        else setInlineError(accountPasswordError, "");
    }
}

function openSignupModal() {
    if (!signupModal) return;
    signupModal.style.display = "flex";
    if (signupEmail) signupEmail.value = "";
    if (signupPassword) signupPassword.value = "";
    if (signupPasswordConfirm) signupPasswordConfirm.value = "";
    if (signupTerms) signupTerms.checked = false;
    setInlineError(signupError, "");
}

function closeSignupModal() {
    if (!signupModal) return;
    signupModal.style.display = "none";
    setInlineError(signupError, "");
    pendingUpgrade = false;
}

function openPlusModal() {
    if (!plusModal) return;
    plusModal.style.display = "flex";
    setInlineError(plusError, "");
}

function closePlusModal() {
    if (!plusModal) return;
    plusModal.style.display = "none";
    setInlineError(plusError, "");
    pendingUpgrade = false;
}

function openPaymentModal() {
    if (!paymentModal) return;
    paymentModal.style.display = "flex";
    setInlineError(paymentError, "");
}

function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.style.display = "none";
    setInlineError(paymentError, "");
    pendingUpgrade = false;
}

function startPlusUpgrade() {
    setInlineError(plusError, "");
    pendingUpgrade = true;
    if (!authState.isLoggedIn) {
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
    setStoredPlanForUser(authState.user.id, "plus");
    applyAuthState({ isLoggedIn: true, user: authState.user, plan: "plus" });
    // TODO: ユーザー単位の保存キーに移行する場合はここで移行処理を行う
    closePaymentModal();
    closePlusModal();
    closeSignupModal();
    pendingUpgrade = false;
}

async function logoutAccount() {
    if (!firebaseAuth) {
        clearStoredSession();
        applyAuthState({ isLoggedIn: false, plan: "free", user: null });
        clearSyncMessage();
        return;
    }
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signOut(firebaseAuth);
        currentUser = null;
        currentUid = null;
        clearStoredSession();
        applyAuthState({ isLoggedIn: false, plan: "free", user: null });
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
    if (!nextEmail) {
        setInlineError(accountEmailError, "メールアドレスを入力してください。");
        return;
    }
    if (!isValidEmail(nextEmail)) {
        setInlineError(accountEmailError, "メール形式が不正です。");
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
            const updatedUsers = users.map(u => (
                u.id === authState.user.id ? { ...u, email: normalized } : u
            ));
            saveLocalUsers(updatedUsers);
            setStoredSession({
                userId: authState.user.id,
                email: normalized,
                loggedInAt: new Date().toISOString()
            });
            applyAuthState({ isLoggedIn: true, user: { ...authState.user, email: normalized }, plan: authState.plan });
            setInlineError(accountEmailError, "メールアドレスを変更しました。");
        } catch (err) {
            setInlineError(accountEmailError, mapAuthError(err, "signup"));
        }
        return;
    }
    try {
        const { updateEmail } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
        const user = firebaseAuth.currentUser;
        await updateEmail(user, nextEmail);
        setStoredSession({
            userId: user.uid,
            email: nextEmail,
            loggedInAt: new Date().toISOString()
        });
        applyAuthState({ isLoggedIn: true, user: { id: user.uid, email: nextEmail }, plan: authState.plan });
        setInlineError(accountEmailError, "メールアドレスを変更しました。");
    } catch (err) {
        if (err && err.code === "auth/requires-recent-login") {
            setInlineError(accountEmailError, "再ログインが必要です。ログアウト後、再度お試しください。");
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
    if (!currentPassword || !nextPassword || !nextPasswordConfirm) {
        setInlineError(accountPasswordError, "現在のパスワードと新しいパスワードを入力してください。");
        return;
    }
    if (nextPassword.length < 8) {
        setInlineError(accountPasswordError, "パスワードは8文字以上にしてください。");
        return;
    }
    if (nextPassword !== nextPasswordConfirm) {
        setInlineError(accountPasswordError, "新しいパスワードが一致しません。");
        return;
    }
    if (!firebaseAuth || !firebaseAuth.currentUser) {
        try {
            await localLogin(authState.user.email || "", currentPassword);
            const users = loadLocalUsers();
            const salt = generateSalt();
            const passwordHash = await hashPassword(nextPassword, salt);
            const updatedUsers = users.map(u => (
                u.id === authState.user.id ? { ...u, salt, passwordHash } : u
            ));
            saveLocalUsers(updatedUsers);
            setInlineError(accountPasswordError, "パスワードを変更しました。");
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
        setInlineError(accountPasswordError, "パスワードを変更しました。");
    } catch (err) {
        if (err && err.code === "auth/requires-recent-login") {
            setInlineError(accountPasswordError, "再ログインが必要です。ログアウト後、再度お試しください。");
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
    applyAuthState({ isLoggedIn: true, user: authState.user, plan: "free" });
    setInlineError(accountError, "解約しました。同期は停止されます。");
}

function addCustomType() {
    const label = (typeNewInput.value || "").trim();
    if (!label) return;
    const customTypes = loadCustomTypes();
    const existing = getAllTypes().find(t => t.label === label);
    if (existing) {
        renderTypeOptions(existing.id);
        typeNewInput.value = "";
        return;
    }
    const id = `custom-${Date.now()}`;
    const color = (typeColorInput && typeColorInput.value)
        ? typeColorInput.value
        : customTypePalette[customTypes.length % customTypePalette.length];
    customTypes.push({ id, label, color });
    saveCustomTypes(customTypes);
    updateTypeLabelCache(id, label, color);
    renderTypeOptions(id);
    renderTypeList();
    typeNewInput.value = "";
    renderColorOptions();
}

function startEditType(id) {
    const baseTypes = getBaseTypes();
    const customTypes = loadCustomTypes();
    const baseTarget = baseTypes.find(t => t.id === id);
    const customTarget = customTypes.find(t => t.id === id);
    const target = baseTarget || customTarget;
    if (!target) return;
    editingTypeId = id;
    editingTypeIsBase = !!baseTarget;
    typeNewInput.value = target.label;
    renderColorOptions(target.color);
    if (typeEditSaveBtn) typeEditSaveBtn.disabled = false;
    if (typeEditCancelBtn) typeEditCancelBtn.disabled = false;
}

function saveEditedType() {
    if (!editingTypeId) return;
    const label = (typeNewInput.value || "").trim();
    if (!label) return;
    const color = (typeColorInput && typeColorInput.value) ? typeColorInput.value : customTypePalette[0];
    const existsLabel = getAllTypes().find(t => t.label === label && t.id !== editingTypeId);
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

    removeTypeLabelCache(id);
    const remainingTypes = getAllTypes();
    const fallbackId = remainingTypes.length ? remainingTypes[0].id : null;
    if (fallbackId) {
        replaceDeletedTypeInEvents(id, fallbackId);
    }
    renderTypeOptions(fallbackId || undefined);
    renderTypeList();
    clearTypeEdit();
    renderEvents();
}

function replaceDeletedTypeInEvents(typeId, fallbackId) {
    days.forEach((_, i) => {
        const key = `events-day${i}`;
        const events = JSON.parse(localStorage.getItem(key) || "[]");
        let changed = false;
        const updated = events.map(ev => {
            if (ev.type !== typeId) return ev;
            changed = true;
            return {
                ...ev,
                type: fallbackId,
                typeLabel: undefined,
                typeColor: undefined
            };
        });
        if (changed) localStorage.setItem(key, JSON.stringify(updated));
    });
}

function backfillEventTypeMeta() {
    const typeMap = new Map(getAllTypes().map(t => [t.id, t]));
    days.forEach((_, i) => {
        const key = `events-day${i}`;
        const events = JSON.parse(localStorage.getItem(key) || "[]");
        let changed = false;
        const updated = events.map(ev => {
            const meta = typeMap.get(ev.type);
            if (!meta) return ev;
            if (ev.typeLabel === meta.label && ev.typeColor === meta.color) return ev;
            changed = true;
            return { ...ev, typeLabel: meta.label, typeColor: meta.color };
        });
        if (changed) localStorage.setItem(key, JSON.stringify(updated));
    });
}


function collectAllLocalEvents() {
    const result = [];
    days.forEach((_, i) => {
        const key = `events-day${i}`;
        const events = JSON.parse(localStorage.getItem(key) || "[]");
        events.forEach(ev => result.push(ev));
    });
    return result;
}

async function hydrateFromRemote() {
    if (!syncEnabled || !firestore || !currentUid) return;
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

        if (hasRemoteEvents) {
            resetLocalEvents(remoteEvents);
        } else if (localEvents.length) {
            await syncEventsToRemote(); // 初回: ローカルをアップロード
        }

        if (hasRemoteTodos) {
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
    days.forEach((_, i) => localStorage.setItem(`events-day${i}`, "[]"));
    events.forEach(ev => {
        const key = `events-day${ev.day}`;
        const arr = JSON.parse(localStorage.getItem(key) || "[]");
        arr.push(ev);
        localStorage.setItem(key, JSON.stringify(arr));
    });
}

function resetLocalTodos(remoteTodos) {
    remoteTodos.forEach(({ id, items, memo }) => {
        if (!id) return;
        localStorage.setItem(todoKey(id), JSON.stringify(items || []));
        localStorage.setItem(todoMemoKey(id), memo || "");
    });
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

        const batch = writeBatch(firestore);
        snap.forEach(d => {
            if (!localIds.has(d.id)) batch.delete(d.ref);
        });
        localEvents.forEach(ev => {
            batch.set(doc(colRef, String(ev.id)), ev);
        });
        await batch.commit();
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
    } catch (err) {
        handleSyncError(err);
    }
}

async function localSignup(email, password) {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) throw { code: "local/invalid-email" };
    if (password.length < 8) throw { code: "local/weak-password" };
    const users = loadLocalUsers();
    const exists = users.find(u => normalizeEmail(u.email) === normalized);
    if (exists) throw { code: "local/email-already-in-use" };
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    const user = {
        id: `local-${Date.now()}`,
        email: normalized,
        passwordHash,
        salt,
        createdAt: new Date().toISOString()
    };
    users.push(user);
    saveLocalUsers(users);
    return { id: user.id, email: user.email };
}

async function localLogin(email, password) {
    const normalized = normalizeEmail(email);
    if (!isValidEmail(normalized)) throw { code: "local/invalid-email" };
    const users = loadLocalUsers();
    const user = users.find(u => normalizeEmail(u.email) === normalized);
    if (!user) throw { code: "local/user-not-found" };
    const passwordHash = await hashPassword(password, user.salt);
    if (passwordHash !== user.passwordHash) throw { code: "local/wrong-password" };
    return { id: user.id, email: user.email };
}

async function emailPasswordLogin() {
    const ready = await ensureFirebaseReady();
    if (!ready || !firebaseAuth) {
        setInlineError(
            authError,
            firebaseInitFailed
                ? "認証の初期化に失敗しました。再読み込みしてください。"
                : "認証の初期化中です。少し待ってから再度お試しください。"
        );
        return;
    }
    const email = (authEmail.value || "").trim();
    const password = authPassword.value || "";
    setInlineError(authError, "");
    if (!email || !password) {
        setInlineError(authError, "メールとパスワードを入力してください。");
        return;
    }
    if (!isValidEmail(email)) {
        setInlineError(authError, "メール形式が不正です。");
        return;
    }
    authStatus.textContent = "同期状態: ログイン処理中…";
    setButtonLoading(authLoginBtn, true, "ログイン中…");
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        const shouldUpgrade = pendingUpgrade;
        closeAuthModal();
        if (shouldUpgrade) closePlusModal();
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
        setInlineError(
            signupError,
            firebaseInitFailed
                ? "認証の初期化に失敗しました。再読み込みしてください。"
                : "認証の初期化中です。少し待ってから再度お試しください。"
        );
        return;
    }
    const email = (signupEmail && signupEmail.value ? signupEmail.value : "").trim();
    const password = signupPassword && signupPassword.value ? signupPassword.value : "";
    const passwordConfirm = signupPasswordConfirm && signupPasswordConfirm.value ? signupPasswordConfirm.value : "";
    const agreed = !!(signupTerms && signupTerms.checked);

    setInlineError(signupError, "");
    if (!email || !password || !passwordConfirm) {
        setInlineError(signupError, "メールとパスワードを入力してください。");
        return;
    }
    if (!isValidEmail(email)) {
        setInlineError(signupError, "メール形式が不正です。");
        return;
    }
    if (password.length < 8) {
        setInlineError(signupError, "パスワードは8文字以上で入力してください。");
        return;
    }
    if (password !== passwordConfirm) {
        setInlineError(signupError, "パスワードが一致しません。");
        return;
    }
    if (!agreed) {
        setInlineError(signupError, "利用規約への同意が必要です。");
        return;
    }

    setButtonLoading(signupSubmitBtn, true, "登録中…");
    try {
        if (!firebaseAuth) {
            const localUser = await localSignup(email, password);
            setStoredSession({ userId: localUser.id, email: localUser.email, loggedInAt: new Date().toISOString() });
            setStoredPlanForUser(localUser.id, "plus");
            applyAuthState({ isLoggedIn: true, user: localUser, plan: "plus" });
        } else {
            const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
            const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            if (result && result.user) {
                const userInfo = { id: result.user.uid, email: result.user.email || email };
                setStoredSession({
                    userId: userInfo.id,
                    email: userInfo.email,
                    loggedInAt: new Date().toISOString()
                });
                setStoredPlanForUser(userInfo.id, "plus");
                applyAuthState({
                    isLoggedIn: true,
                    user: userInfo,
                    plan: "plus"
                });
            }
        }
        closeSignupModal();
        closePlusModal();
    } catch (err) {
        setInlineError(signupError, mapAuthError(err, "signup"));
    } finally {
        setButtonLoading(signupSubmitBtn, false, "登録");
    }
}

// ==================== 描画 ====================
function renderEvents() {
    document.querySelectorAll(".event").forEach(e => e.remove());

    const weekStart = new Date(currentWeek);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    days.forEach((_, i) => {
        const key = `events-day${i}`;
        const events = JSON.parse(localStorage.getItem(key) || "[]");

        events.forEach(ev => {
            const eventDate = ev.date ? new Date(ev.date) : null;

            // ✅ 「繰り返し/単発」関係なく、その週に属する“その日のインスタンスだけ”表示
            const inThisWeek = eventDate && eventDate >= weekStart && eventDate <= weekEnd;

            if (inThisWeek) {
                const timeline = document.querySelector(`.timeline[data-day="${i}"]`);
                if (timeline) {
                    const eventElement = createEventElement(ev);
                    timeline.appendChild(eventElement);
                }
            }
        });
    });
}


// ==================== イベント要素作成 ====================
function isLightColor(hex) {
    const cleaned = hex.replace("#", "");
    if (cleaned.length !== 6) return false;
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 170;
}

function createEventElement(ev) {
    const div = document.createElement("div");
    div.classList.add("event", ev.type);
    const completed = !!ev.completed || (ev.type === "school" && ev.assigned);
    if (completed) {
        div.classList.add("completed");
    }
    if (ev.type === 'school' && completed) {
        div.classList.add('assigned');
    }
    const customType = getCustomTypeById(ev.type);
    if (customType) {
        div.style.background = customType.color;
        div.style.color = isLightColor(customType.color) ? "#222" : "#fff";
    } else if (ev.typeColor) {
        div.style.background = ev.typeColor;
        if (String(ev.typeColor).startsWith("#")) {
            div.style.color = isLightColor(ev.typeColor) ? "#222" : "#fff";
        } else {
            div.style.color = "#fff";
        }
    }
    div.draggable = true;

    const startMin = Math.round((ev.start % 1) * 60);
    const endMin = Math.round((ev.end % 1) * 60);
    const startStr = `${String(Math.floor(ev.start)).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
    const endStr = `${String(Math.floor(ev.end)).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    div.textContent = `${ev.title} (${startStr}-${endStr})`;


    div.style.top = (ev.start - startHour) * hourHeight + "px";
    div.style.height = (ev.end - ev.start) * hourHeight + "px";

    // ドラッグとの誤爆防止用フラグ
    let isDragging = false;

    div.addEventListener("dragstart", (e) => {
        isDragging = true;
        e.dataTransfer.setData("text/plain", JSON.stringify(ev));
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
        if (isDragging) return;              // ドラッグ時は無視
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
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const newDay = parseInt(tl.dataset.day);

        const keyOld = `events-day${data.day}`;
        let oldEvents = JSON.parse(localStorage.getItem(keyOld) || "[]");
        oldEvents = oldEvents.filter((ev) => ev.id !== data.id);
        localStorage.setItem(keyOld, JSON.stringify(oldEvents));

        const keyNew = `events-day${newDay}`;
        const newEvents = JSON.parse(localStorage.getItem(keyNew) || "[]");
        newEvents.push({ ...data, day: newDay });
        localStorage.setItem(keyNew, JSON.stringify(newEvents));

        renderEvents();
        syncEventsToRemote();
    });
});

// ==================== 繰り返し処理 ====================
function generateRepeatDates(start, repeatType) {
    const dates = [];
    const maxRepeat = 52;
    let current = new Date(start);

    switch (repeatType) {
        case 'daily':
            for (let i = 0; i < maxRepeat; i++) {
                current.setDate(current.getDate() + 1);
                dates.push(new Date(current));
            }
            break;
        case 'weekly':
            for (let i = 0; i < maxRepeat; i++) {
                current.setDate(current.getDate() + 7);
                dates.push(new Date(current));
            }
            break;
        case 'weekday':
            for (let i = 0; i < maxRepeat * 2; i++) {
                current.setDate(current.getDate() + 1);
                if (current.getDay() !== 0 && current.getDay() !== 6) {
                    dates.push(new Date(current));
                }
            }
            break;
    }
    return dates;
}

// ==================== 初回描画 ====================
syncTypeLabelCacheFromEvents();
ensureCustomTypesFromCache();
rebuildCustomTypesFromEvents();
syncTypeLabelCacheFromTypes();
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

document.addEventListener("DOMContentLoaded", async () => {
    seedDefaultCustomTypesIfNeeded();
    migrateBaseTypesToCustomIfNeeded();
    bindUIHandlers();
    setTypePanelOpen(false);
    renderTypeOptions();
    renderColorOptions();
    renderTypeList();
    bindColorSwatches();
    applyAuthState({ isLoggedIn: false, plan: "free", user: null });
    clearSyncMessage();

    if (authLoginBtn) authLoginBtn.disabled = true;
    if (signupSubmitBtn) signupSubmitBtn.disabled = true;

    await initFirebaseSync();

    if (!firebaseInitFailed) {
        if (authLoginBtn) authLoginBtn.disabled = false;
        if (signupSubmitBtn) signupSubmitBtn.disabled = false;
    }
});
