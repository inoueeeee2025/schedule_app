export function getEventModalState(eventObj, context = {}) {
    const fallbackDay = Number.isInteger(context.selectedDay) ? context.selectedDay : null;
    const fallbackDate = fallbackDay != null && context.currentWeek && typeof context.getWeekDate === "function"
        ? context.getWeekDate(context.currentWeek, fallbackDay)
        : null;

    if (eventObj) {
        return {
            title: "予定を編集",
            form: {
                title: eventObj.title,
                typeId: eventObj.type,
                typeLabel: eventObj.typeLabel,
                start: eventObj.start,
                end: eventObj.end,
                repeat: eventObj.repeat || "none",
                tapToggle: typeof eventObj.tapToggle === "boolean"
                    ? eventObj.tapToggle
                    : eventObj.type === "school",
                selectedDay: eventObj.day,
                selectedDate: eventObj.date || null
            },
            deleteButtonDisplay: "inline-block",
            deleteScopeRowDisplay: "block",
            deleteScopeValue: "single"
        };
    }

    return {
        title: "予定を追加",
        form: {
            title: "",
            typeId: "school",
            typeLabel: "",
            start: 9,
            end: 10,
            repeat: "none",
            tapToggle: true,
            selectedDay: fallbackDay,
            selectedDate: fallbackDate ? fallbackDate.toISOString() : null
        },
        deleteButtonDisplay: "none",
        deleteScopeRowDisplay: "none",
        deleteScopeValue: "single"
    };
}

export function buildEventDraft(input, context = {}) {
    const title = (input.title || "").trim();
    if (!title) return null;
    if (!Number.isFinite(input.start) || !Number.isFinite(input.end) || input.start >= input.end) return null;
    if (!Number.isInteger(input.selectedDay) || input.selectedDay < 0 || input.selectedDay >= context.daysLength) return null;

    const eventDate = input.modalSelectedDate
        ? new Date(input.modalSelectedDate)
        : context.getWeekDate(context.currentWeek, input.selectedDay);
    if (Number.isNaN(eventDate.getTime())) return null;
    eventDate.setHours(0, 0, 0, 0);

    const changeStartDate = input.editingEvent && input.editingEvent.date
        ? new Date(input.editingEvent.date)
        : new Date(eventDate);
    changeStartDate.setHours(0, 0, 0, 0);

    const baseId = input.editingEvent ? input.editingEvent.baseId : Date.now();
    const eventId = Date.now();

    return {
        changeStartDate,
        eventDate,
        newEvent: {
            id: eventId,
            baseId,
            title,
            type: input.type,
            typeLabel: input.typeLabel,
            typeColor: input.typeColor,
            start: input.start,
            end: input.end,
            day: input.selectedDay,
            date: eventDate.toISOString(),
            repeat: input.repeat,
            tapToggle: !!input.tapToggle,
            completed: input.editingEvent
                ? !!input.editingEvent.completed || (input.editingEvent.type === "school" && input.editingEvent.assigned)
                : false
        }
    };
}

export function getClosedEventModalState() {
    return {
        display: "none",
        clearEditingEvent: true,
        clearSelectedDate: true
    };
}

export function getOpenedEventModalState(state, format) {
    return {
        title: state.title,
        display: "flex",
        form: {
            title: state.form.title,
            typeId: state.form.typeId,
            typeLabel: state.form.typeLabel,
            start: format(state.form.start),
            end: format(state.form.end),
            repeat: state.form.repeat,
            tapToggle: state.form.tapToggle,
            selectedDay: state.form.selectedDay,
            selectedDate: state.form.selectedDate || null
        },
        deleteButtonDisplay: state.deleteButtonDisplay,
        deleteScopeRowDisplay: state.deleteScopeRowDisplay,
        deleteScopeValue: state.deleteScopeValue
    };
}
