import { readJSON, writeJSON } from "./legacy-utils.js";

export const baseEventTypes = [];
export const baseTypeOverridesKey = "base-event-type-overrides";
export const baseTypeDeletedKey = "base-event-type-deleted";
export const typeLabelCacheKey = "event-type-label-cache";
export const customTypePalette = [
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

export function loadCustomTypes() {
    const raw = readJSON("custom-event-types", []);
    if (!Array.isArray(raw)) return [];
    return raw.map(t => {
        if (!t || typeof t !== "object") return null;
        const id = typeof t.id === "string" ? t.id : null;
        if (!id) return null;
        const label = typeof t.label === "string" && t.label.trim() ? t.label : id;
        const color = typeof t.color === "string" && t.color ? t.color : customTypePalette[0];
        return { id, label, color, deleted: !!t.deleted };
    }).filter(Boolean);
}

export function saveCustomTypes(types) {
    writeJSON("custom-event-types", types);
}

export function loadTypeLabelCache() {
    const raw = readJSON(typeLabelCacheKey, {});
    return raw && typeof raw === "object" ? raw : {};
}

export function saveTypeLabelCache(cache) {
    writeJSON(typeLabelCacheKey, cache);
}

export function updateTypeLabelCache(typeId, label, color) {
    if (!typeId || !label) return;
    const cache = loadTypeLabelCache();
    const next = { label, color: color || "" };
    if (!cache[typeId] || cache[typeId].label !== next.label || cache[typeId].color !== next.color) {
        cache[typeId] = next;
        saveTypeLabelCache(cache);
    }
}

export function removeTypeLabelCache(typeId) {
    if (!typeId) return;
    const cache = loadTypeLabelCache();
    if (cache[typeId]) {
        delete cache[typeId];
        saveTypeLabelCache(cache);
    }
}

export function syncTypeLabelCacheFromTypes(types) {
    const cache = loadTypeLabelCache();
    let changed = false;
    types.forEach(t => {
        if (!cache[t.id] || cache[t.id].label !== t.label || cache[t.id].color !== t.color) {
            cache[t.id] = { label: t.label, color: t.color || "" };
            changed = true;
        }
    });
    if (changed) saveTypeLabelCache(cache);
}

export function syncTypeLabelCacheFromEvents(events) {
    const cache = loadTypeLabelCache();
    let changed = false;
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

export function ensureCustomTypesFromCache() {
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

export function rebuildCustomTypesFromEvents(events) {
    const customTypes = loadCustomTypes();
    const existingIds = new Set(customTypes.map(t => t.id));
    let changed = false;
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

export function getVisibleCustomTypes() {
    return loadCustomTypes().filter(t => !t.deleted);
}

export function getCustomTypeById(id) {
    return loadCustomTypes().find(t => t.id === id);
}

export function loadBaseTypeOverrides() {
    return readJSON(baseTypeOverridesKey, {});
}

export function saveBaseTypeOverrides(overrides) {
    writeJSON(baseTypeOverridesKey, overrides);
}

export function loadDeletedBaseTypes() {
    return readJSON(baseTypeDeletedKey, []);
}

export function saveDeletedBaseTypes(ids) {
    writeJSON(baseTypeDeletedKey, ids);
}

export function getBaseTypes() {
    const overrides = loadBaseTypeOverrides();
    const deleted = new Set(loadDeletedBaseTypes());
    return baseEventTypes
        .filter(t => !deleted.has(t.id))
        .map(t => ({ ...t, ...(overrides[t.id] || {}) }));
}

export function getAllTypes() {
    return [...getBaseTypes(), ...getVisibleCustomTypes()];
}

export function resolveTypeMeta(typeId, preferLabel) {
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
