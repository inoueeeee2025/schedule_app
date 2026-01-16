const days = ["月", "火", "水", "木", "金", "土", "日"];
const startHour = 6;
const endHour = 24;
const hourHeight = 40;

const weekView = document.getElementById("weekView");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const titleInput = document.getElementById("title");
const typeSelect = document.getElementById("type");
const typeNewInput = document.getElementById("typeNew");
const typeAddBtn = document.getElementById("typeAdd");
const typeAddOpenBtn = document.getElementById("typeAddOpen");
const typeAddCloseBtn = document.getElementById("typeAddClose");
const typeAddPanel = document.getElementById("typeAddPanel");
const typeColorInput = document.getElementById("typeColor");
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
const authOpenBtn = document.getElementById("authOpen");
const authModal = document.getElementById("authModal");
const authCancelBtn = document.getElementById("authCancel");
const upgradeBtn = document.getElementById("upgradeBtn");
const authLogoutBtn = document.getElementById("authLogout");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authLoginBtn = document.getElementById("authLogin");
const authStatus = document.getElementById("authStatus");
const syncRefreshBtn = document.getElementById("syncRefresh");
const syncMessage = document.getElementById("syncMessage");

function setAuthUI(isLoggedIn) {
    authOpenBtn.style.display = isLoggedIn ? "none" : "inline-block";
    authLogoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
    if (!isLoggedIn && syncRefreshBtn) syncRefreshBtn.style.display = "none";
}

// 現在表示中のToDoのキー（日付）を保持
let currentTodoDateKey = null;

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
let currentUid = null;
let currentUser = null;
let isProUser = false;
let syncEnabled = false;

let selectedDay = null;
let editingEvent = null;
let currentWeek = new Date();

const baseEventTypes = [
    { id: "school", label: "学校", color: "rgba(34, 34, 34, 0.75)" },
    { id: "work", label: "バイト", color: "rgba(139, 94, 59, 0.8)" },
    { id: "outing", label: "おでかけ", color: "rgba(246, 195, 68, 0.7)" },
    { id: "circle", label: "サークル", color: "rgba(124, 199, 255, 0.75)" },
    { id: "errand", label: "用事", color: "rgba(18, 48, 96, 0.75)" },
    { id: "sports", label: "運動", color: "rgba(255, 140, 0, 0.75)" }
];
const customTypeColors = ["#5b8def", "#d97706", "#10b981", "#ef4444", "#8b5cf6", "#0ea5e9"];

function loadCustomTypes() {
    try { return JSON.parse(localStorage.getItem("custom-event-types") || "[]"); }
    catch { return []; }
}

function saveCustomTypes(types) {
    localStorage.setItem("custom-event-types", JSON.stringify(types));
}

function getCustomTypeById(id) {
    return loadCustomTypes().find(t => t.id === id);
}

function renderTypeOptions(selectedId) {
    if (!typeSelect) return;
    const customTypes = loadCustomTypes();
    typeSelect.innerHTML = "";
    baseEventTypes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        typeSelect.appendChild(opt);
    });
    customTypes.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.label;
        typeSelect.appendChild(opt);
    });
    typeSelect.value = selectedId || "school";
}

function updateSyncStatus() {
    if (!currentUser) {
        authStatus.textContent = "同期状態: 未ログイン";
        if (syncRefreshBtn) syncRefreshBtn.style.display = "none";
        return;
    }
    if (isProUser) {
        authStatus.textContent = "同期状態: ログイン（Pro：同期中）";
        if (syncRefreshBtn) syncRefreshBtn.style.display = "none";
        return;
    }
    authStatus.textContent = "同期状態: ログイン（無料：ローカル保存）";
    if (syncRefreshBtn) syncRefreshBtn.style.display = "inline-block";
}

function setProState(nextIsPro) {
    isProUser = !!nextIsPro;
    syncEnabled = isProUser;
    updateSyncStatus();
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
        setProState(false);
        showSyncMessage("同期はプレミアム限定です。端末内には保存されています。アップグレードはこちら。", "warning");
        if (upgradeBtn) upgradeBtn.classList.add("attention");
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
cancelBtn.addEventListener("click", () => (modal.style.display = "none"));
deleteBtn.addEventListener("click", deleteEvent);
saveBtn.addEventListener("click", saveEvent);
bulkOpenBtn.addEventListener("click", openBulkModal);
bulkCancelBtn.addEventListener("click", closeBulkModal);
bulkDeleteBtn.addEventListener("click", bulkDeleteSelected);
authOpenBtn.addEventListener("click", openAuthModal);
authCancelBtn.addEventListener("click", closeAuthModal);
upgradeBtn.addEventListener("click", upgradeAccount);
authLoginBtn.addEventListener("click", () => emailPasswordLogin());
authLogoutBtn.addEventListener("click", () => logoutAccount());
if (syncRefreshBtn) {
    syncRefreshBtn.addEventListener("click", () => refreshProStatus({ forceRefresh: true, announce: true }));
}
typeAddBtn.addEventListener("click", addCustomType);
typeAddOpenBtn.addEventListener("click", () => typeAddPanel.classList.add("open"));
typeAddCloseBtn.addEventListener("click", () => typeAddPanel.classList.remove("open"));
typeNewInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCustomType();
});
// Firebase初期化
initFirebaseSync();
renderTypeOptions();
setAuthUI(false);
setProState(false);
clearSyncMessage();

function openModal(eventObj = null) {
    editingEvent = eventObj;
    modalTitle.textContent = eventObj ? "予定を編集" : "予定を追加";
    modal.style.display = "flex";
    typeAddPanel.classList.remove("open");

    if (eventObj) {
        titleInput.value = eventObj.title;
        renderTypeOptions(eventObj.type);
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
    renderEvents();
    updateWeekView();
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

async function refreshProStatus({ forceRefresh = false, announce = false } = {}) {
    if (!firebaseAuth || !firebaseAuth.currentUser) return;
    const user = firebaseAuth.currentUser;
    try {
        if (forceRefresh) await user.getIdToken(true);
        const tokenResult = await user.getIdTokenResult();
        const nextIsPro = !!(tokenResult && tokenResult.claims && tokenResult.claims.isPro === true);
        setProState(nextIsPro);
        if (nextIsPro) {
            await hydrateFromRemote();
            if (announce) showSyncMessage("同期を有効化しました。", "success");
        } else if (announce) {
            showSyncMessage("このアカウントは無料プランです。同期はローカル保存で利用できます。", "info");
        }
    } catch (err) {
        handleSyncError(err);
    }
}

// ==================== Firebase同期 ====================
async function initFirebaseSync() {
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

        onAuthStateChanged(firebaseAuth, async (user) => {
            currentUser = user;
            if (!user) {
                currentUid = null;
                setProState(false);
                authLogoutBtn.disabled = true;
                setAuthUI(false);
                clearSyncMessage();
                return;
            }
            currentUid = user.uid;
            authLogoutBtn.disabled = false;
            setAuthUI(true);
            await refreshProStatus({ forceRefresh: false, announce: false });
        });
    } catch (e) {
        console.error("Firebase init failed", e);
    }
}

function openAuthModal() {
    authModal.style.display = "flex";
}

function closeAuthModal() {
    authModal.style.display = "none";
}

function upgradeAccount() {
    showSyncMessage("アップグレード後は「同期を有効化」を押してください。", "info");
    if (upgradeBtn) upgradeBtn.classList.add("attention");
}

async function logoutAccount() {
    if (!firebaseAuth) {
        showSyncMessage("認証の初期化に失敗しています。", "warning");
        return;
    }
    const { signOut } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signOut(firebaseAuth);
        currentUser = null;
        currentUid = null;
        setProState(false);
        setAuthUI(false);
        authLogoutBtn.disabled = true;
        clearSyncMessage();
    } catch (err) {
        showSyncMessage("ログアウトに失敗しました。時間を置いて再度お試しください。", "warning");
    }
}

function addCustomType() {
    const label = (typeNewInput.value || "").trim();
    if (!label) return;
    const customTypes = loadCustomTypes();
    const existing = customTypes.find(t => t.label === label);
    if (existing) {
        renderTypeOptions(existing.id);
        typeNewInput.value = "";
        return;
    }
    const id = `custom-${Date.now()}`;
    const color = (typeColorInput && typeColorInput.value)
        ? typeColorInput.value
        : customTypeColors[customTypes.length % customTypeColors.length];
    customTypes.push({ id, label, color });
    saveCustomTypes(customTypes);
    renderTypeOptions(id);
    typeNewInput.value = "";
    if (typeColorInput) typeColorInput.value = customTypeColors[customTypes.length % customTypeColors.length];
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

async function emailPasswordLogin() {
    if (!firebaseAuth) {
        showSyncMessage("認証の初期化に失敗しています。", "warning");
        return;
    }
    const email = (authEmail.value || "").trim();
    const password = authPassword.value || "";
    if (!email || !password) {
        showSyncMessage("メールとパスワードを入力してください。", "warning");
        return;
    }
    authStatus.textContent = "同期状態: ログイン処理中…";
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    try {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        closeAuthModal();
    } catch (err) {
        if (err.code === "auth/user-not-found") {
            // 初回は自動で作成
            try {
                await createUserWithEmailAndPassword(firebaseAuth, email, password);
                closeAuthModal();
            } catch (createErr) {
                showSyncMessage("新規登録に失敗しました。時間を置いて再度お試しください。", "warning");
                updateSyncStatus();
            }
        } else {
            showSyncMessage("ログインに失敗しました。メールとパスワードをご確認ください。", "warning");
            updateSyncStatus();
        }
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

