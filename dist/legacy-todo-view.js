export function buildTodoPanelLabel(dateObj, toJPLabel) {
    return `ToDo: ${toJPLabel(dateObj)}`;
}

export function getMemoButtonLabel(hasText) {
    return hasText ? "メモを編集" : "メモを追加";
}
