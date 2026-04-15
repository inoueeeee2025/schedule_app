import { readJSON, writeJSON } from "./legacy-utils.js";

export function eventStorageKey(dayIndex) {
    return `events-day${dayIndex}`;
}

export function loadEventsForDay(dayIndex) {
    return readJSON(eventStorageKey(dayIndex), []);
}

export function saveEventsForDay(dayIndex, events) {
    writeJSON(eventStorageKey(dayIndex), events);
}

export function collectAllLocalEvents(days) {
    const result = [];
    days.forEach((_, i) => {
        loadEventsForDay(i).forEach(ev => result.push(ev));
    });
    return result;
}

export function resetLocalEvents(days, events) {
    days.forEach((_, i) => saveEventsForDay(i, []));
    events.forEach(ev => {
        const current = loadEventsForDay(ev.day);
        current.push(ev);
        saveEventsForDay(ev.day, current);
    });
}

export function generateRepeatDates(start, repeatType) {
    const dates = [];
    const maxRepeat = 52;
    const current = new Date(start);

    switch (repeatType) {
        case "daily":
            for (let i = 0; i < maxRepeat; i++) {
                current.setDate(current.getDate() + 1);
                dates.push(new Date(current));
            }
            break;
        case "weekly":
            for (let i = 0; i < maxRepeat; i++) {
                current.setDate(current.getDate() + 7);
                dates.push(new Date(current));
            }
            break;
        case "weekday":
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

function normalizeDate(value) {
    const date = value ? new Date(value) : new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

function filterSeriesEvents(events, baseId, changeStartDate) {
    return events.filter(ev => {
        if (ev.baseId !== baseId) return true;
        if (!ev.date) return false;
        const evDate = normalizeDate(ev.date);
        return evDate < changeStartDate;
    });
}

export function saveEventSeries(days, selectedDay, newEvent, changeStartDate, repeatDates, getDayIndex) {
    days.forEach((_, i) => {
        const filtered = filterSeriesEvents(loadEventsForDay(i), newEvent.baseId, changeStartDate);
        saveEventsForDay(i, filtered);
    });

    const dayEvents = loadEventsForDay(selectedDay);
    dayEvents.push(newEvent);
    saveEventsForDay(selectedDay, dayEvents);

    repeatDates.forEach(date => {
        const dayIndex = getDayIndex(date);
        const repeatedEvents = loadEventsForDay(dayIndex);
        repeatedEvents.push({
            ...newEvent,
            id: Date.now() + Math.random(),
            day: dayIndex,
            date: date.toISOString()
        });
        saveEventsForDay(dayIndex, repeatedEvents);
    });
}

export function deleteEventByScope(days, targetEvent, scope) {
    if (!targetEvent) return;

    const baseId = Number(targetEvent.baseId);
    const hasSeries = !Number.isNaN(baseId);
    const normalizedScope = hasSeries ? scope : "single";

    if (normalizedScope === "single") {
        const events = loadEventsForDay(targetEvent.day).filter(ev => ev.id !== targetEvent.id);
        saveEventsForDay(targetEvent.day, events);
        return;
    }

    if (normalizedScope === "all") {
        days.forEach((_, i) => {
            const events = loadEventsForDay(i).filter(ev => ev.baseId !== baseId);
            saveEventsForDay(i, events);
        });
        return;
    }

    const changeStartDate = normalizeDate(targetEvent.date);
    days.forEach((_, i) => {
        const events = filterSeriesEvents(loadEventsForDay(i), baseId, changeStartDate);
        saveEventsForDay(i, events);
    });
}

export function collectWeekEvents(days, weekStart, weekEnd) {
    const result = [];

    days.forEach((_, i) => {
        loadEventsForDay(i).forEach(ev => {
            if (!ev.date) return;
            const evDate = new Date(ev.date);
            if (evDate >= weekStart && evDate <= weekEnd) {
                result.push({ ...ev, day: i });
            }
        });
    });

    return result;
}

export function backfillEventTypeMeta(days, typeMap) {
    days.forEach((_, i) => {
        const events = loadEventsForDay(i);
        let changed = false;
        const updated = events.map(ev => {
            const meta = typeMap.get(ev.type);
            if (!meta) return ev;
            if (ev.typeLabel === meta.label && ev.typeColor === meta.color) return ev;
            changed = true;
            return { ...ev, typeLabel: meta.label, typeColor: meta.color };
        });
        if (changed) saveEventsForDay(i, updated);
    });
}

export function moveEventToDay(sourceDay, eventId, newDay, nextEvent) {
    const oldEvents = loadEventsForDay(sourceDay).filter(ev => ev.id !== eventId);
    saveEventsForDay(sourceDay, oldEvents);

    const newEvents = loadEventsForDay(newDay);
    newEvents.push(nextEvent);
    saveEventsForDay(newDay, newEvents);
}
