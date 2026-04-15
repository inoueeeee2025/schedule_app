export function getDefaultTypeColor(selectedValue, palette) {
    return selectedValue || palette[0];
}

export function findSelectedType(types, selectedId, resolveTypeMeta) {
    return types.find(t => t.id === selectedId) || resolveTypeMeta(selectedId) || types[0] || null;
}

export function getTypeSelectState(allTypes, selectedId, selectedLabel, resolveTypeMeta) {
    const hasSelected = selectedId && allTypes.some(t => t.id === selectedId);
    if (hasSelected) {
        return {
            options: allTypes,
            value: selectedId
        };
    }

    if (selectedId) {
        const fallback = resolveTypeMeta(selectedId, selectedLabel);
        const label = fallback?.label || "";
        if (label) {
            return {
                options: [...allTypes, { id: selectedId, label }],
                value: selectedId
            };
        }
    }

    return {
        options: allTypes,
        value: allTypes[0]?.id || ""
    };
}

export function buildTypeListItems(allTypes) {
    if (!Array.isArray(allTypes) || allTypes.length === 0) return [];
    return allTypes.map(type => ({
        id: type.id,
        label: type.label,
        color: type.color
    }));
}

export function normalizeTypeLabel(value) {
    return (value || "").trim();
}

export function findExistingTypeByLabel(allTypes, label, excludeId = null) {
    return allTypes.find(type => type.label === label && type.id !== excludeId) || null;
}

export function buildNewTypeDraft(label, color, customTypes, palette) {
    return {
        id: `custom-${Date.now()}`,
        label,
        color: color || palette[customTypes.length % palette.length]
    };
}

export function resolveTypeEditTarget(id, baseTypes, customTypes) {
    const baseTarget = baseTypes.find(type => type.id === id) || null;
    const customTarget = customTypes.find(type => type.id === id) || null;
    const target = baseTarget || customTarget;
    if (!target) return null;
    return {
        id,
        isBase: !!baseTarget,
        label: target.label,
        color: target.color
    };
}
