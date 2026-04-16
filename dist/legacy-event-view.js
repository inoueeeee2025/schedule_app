export function getWeekRange(currentWeek, getWeekStart) {
    const weekStart = getWeekStart(currentWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return { weekStart, weekEnd };
}

export function buildWeekLabel(currentWeek) {
    const year = currentWeek.getFullYear();
    const month = currentWeek.getMonth() + 1;
    const weekNum = Math.ceil(currentWeek.getDate() / 7);
    return `${year}年${month}月第${weekNum}週`;
}

export function buildWeekHeaderItems(days, currentWeek, getWeekStart, getWeekDate, toISODate, toJPLabel) {
    const weekStart = getWeekStart(currentWeek);
    return days.map((_, i) => {
        const date = getWeekDate(weekStart, i);
        return {
            index: i,
            date,
            dateISO: toISODate(date),
            label: toJPLabel(date)
        };
    });
}

export function getCurrentDayHeaderIndex(currentWeek, getWeekStart, getMondayBasedDayIndex) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { weekStart, weekEnd } = getWeekRange(currentWeek, getWeekStart);
    if (today < weekStart || today > weekEnd) return -1;
    return getMondayBasedDayIndex(today);
}

export function buildDatePickerYears(centerYear, range = 5) {
    const years = [];
    for (let y = centerYear - range; y <= centerYear + range; y++) years.push(y);
    return years;
}

export function buildDatePickerMonths() {
    return Array.from({ length: 12 }, (_, i) => i + 1);
}

export function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

export function buildDatePickerDays(year, month) {
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

export function getSafeDatePickerDay(year, month, preferredDay) {
    const daysInMonth = getDaysInMonth(year, month);
    return Math.min(preferredDay || 1, daysInMonth);
}

export function buildDatePickerCalendarModel(year, month) {
    const first = new Date(year, month - 1, 1);
    const startDay = first.getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;
    const items = [];

    for (let i = 0; i < startDay; i++) {
        items.push({ type: "blank" });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        items.push({
            type: "day",
            day,
            isToday: isCurrentMonth && day === today.getDate()
        });
    }

    return items;
}

export function groupEventsByDay(events) {
    const grouped = new Map();
    events.forEach(ev => {
        if (!grouped.has(ev.day)) grouped.set(ev.day, []);
        grouped.get(ev.day).push(ev);
    });
    return grouped;
}

export function formatEventTimeRange(start, end) {
    const startMin = Math.round((start % 1) * 60);
    const endMin = Math.round((end % 1) * 60);
    const startStr = `${String(Math.floor(start)).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`;
    const endStr = `${String(Math.floor(end)).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
    return `${startStr}-${endStr}`;
}

export function buildEventLabel(ev) {
    return `${ev.title} (${formatEventTimeRange(ev.start, ev.end)})`;
}

export function sortEventsByDateTime(events) {
    return [...events].sort((a, b) => {
        const da = new Date(a.date);
        const db = new Date(b.date);
        if (da.getTime() !== db.getTime()) return da - db;
        return a.start - b.start;
    });
}

export function buildBulkEventLabel(ev, toJPLabel, format) {
    const dateObj = new Date(ev.date);
    return `${toJPLabel(dateObj)} ${ev.title} (${format(ev.start)}-${format(ev.end)})`;
}

export function collectBulkDeleteTargets(checkboxes, scope) {
    const processed = new Set();
    const targets = [];

    checkboxes.forEach(cb => {
        const dayIndex = parseInt(cb.dataset.day, 10);
        const id = Number(cb.dataset.id);
        const baseId = cb.dataset.baseId ? Number(cb.dataset.baseId) : NaN;
        const date = cb.dataset.date || null;
        const key = `${scope}-${Number.isNaN(baseId) ? id : baseId}-${date || ""}`;
        if (processed.has(key)) return;
        processed.add(key);

        targets.push({
            day: dayIndex,
            id,
            baseId: Number.isNaN(baseId) ? null : baseId,
            date
        });
    });

    return targets;
}

export function isLightColor(hex) {
    const cleaned = String(hex || "").replace("#", "");
    if (cleaned.length !== 6) return false;
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 170;
}

export function getEventCompletionState(ev) {
    const completed = !!ev.completed;
    return {
        completed,
        assigned: false
    };
}

export function getEventPositionStyle(ev, startHour, hourHeight) {
    return {
        top: `${(ev.start - startHour) * hourHeight}px`,
        height: `${(ev.end - ev.start) * hourHeight}px`
    };
}

export function getEventColorStyle(ev, customType) {
    if (customType) {
        return {
            background: customType.color,
            color: isLightColor(customType.color) ? "#222" : "#fff"
        };
    }

    if (ev.typeColor) {
        return {
            background: ev.typeColor,
            color: String(ev.typeColor).startsWith("#") && isLightColor(ev.typeColor) ? "#222" : "#fff"
        };
    }

    return {
        background: "",
        color: ""
    };
}

export function serializeDraggedEvent(ev) {
    return JSON.stringify(ev);
}

export function parseDraggedEvent(raw) {
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function shouldIgnoreEventClick(isDragging) {
    return !!isDragging;
}

export function buildMovedEvent(data, newDay) {
    return { ...data, day: newDay };
}

export function getTimelineHeight(startHour, endHour, hourHeight) {
    const totalHours = endHour - startHour + 1;
    return `${totalHours * hourHeight}px`;
}

export function buildTimelineHourMarks(startHour, endHour, hourHeight) {
    const marks = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        const top = `${(hour - startHour) * hourHeight}px`;
        marks.push({
            hour,
            top,
            label: `${hour}:00`
        });
    }
    return marks;
}

export function getTimelineCreateEventState(clientY, rectTop, startHour, hourHeight, dayIndex, format) {
    const y = clientY - rectTop;
    const hour = Math.floor(y / hourHeight) + startHour;
    return {
        selectedDay: dayIndex,
        start: format(hour),
        end: format(hour + 1)
    };
}
