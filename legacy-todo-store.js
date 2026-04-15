import { readJSON, readText, writeJSON, writeText } from "./legacy-utils.js";

export function todoKey(dateISO) {
    return `todos-${dateISO}`;
}

export function todoMemoKey(dateISO) {
    return `todo-memo-${dateISO}`;
}

export function loadTodos(dateISO) {
    return readJSON(todoKey(dateISO), []);
}

export function saveTodos(dateISO, items) {
    writeJSON(todoKey(dateISO), items);
}

export function loadTodoMemo(dateISO) {
    return readText(todoMemoKey(dateISO), "");
}

export function saveTodoMemo(dateISO, text) {
    writeText(todoMemoKey(dateISO), text);
}

export function addTodoItem(items, text) {
    return [...items, { id: Date.now(), text, done: false }];
}

export function toggleTodoItem(items, id, done) {
    return items.map(item => (item.id === id ? { ...item, done } : item));
}

export function deleteTodoItem(items, id) {
    return items.filter(item => item.id !== id);
}

export function editTodoItem(items, id, text) {
    return items.map(item => (item.id === id ? { ...item, text } : item));
}

export function clearCompletedTodoItems(items) {
    return items.filter(item => !item.done);
}
