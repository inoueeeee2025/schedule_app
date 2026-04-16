export function readJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function readText(key, fallback = "") {
    const value = localStorage.getItem(key);
    return value == null ? fallback : value;
}

export function writeText(key, value) {
    localStorage.setItem(key, value);
}

export function parseTime(t) {
    const [h, m] = t.split(":").map(Number);
    return h + m / 60;
}

export function format(t) {
    const h = Math.floor(t);
    const m = Math.round((t - h) * 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getWeekStart(baseDate) {
    const weekStart = new Date(baseDate);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

export function getWeekDate(baseDate, dayIndex) {
    const date = getWeekStart(baseDate);
    date.setDate(date.getDate() + dayIndex);
    return date;
}

export function getMondayBasedDayIndex(date) {
    return date.getDay() === 0 ? 6 : date.getDay() - 1;
}

export function toISODate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function toJPLabel(d) {
    const wd = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return `${d.getMonth() + 1}/${d.getDate()} (${wd})`;
}
