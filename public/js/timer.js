import {saveTodos} from "./utils/utils.js";

let timers = {}

const startTimer = (todoId, todos) => {
    if (timers[todoId]) return;

    timers[todoId] = setInterval(() => {
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            const time = todos[todoIndex].timer++;
            saveTodos(todos);
            updateTodoTime(todoId, time);
        }
    }, 1000);
}

const updateTodoTime = (todoId, time) => {
    const timerElm = document.querySelector(`#timer-${todoId}`);
    if (timerElm) timerElm.innerHTML = formatTime(time);
}

const formatTime = (second) => {
    const h = String(Math.floor(second / 3600)).padStart(2, '0');
    const m = String(Math.floor((second % 3600) / 60) ).padStart(2, '0');
    const s = String(second % 60).padStart(2, '0');

    return `${h}:${m}:${s}`;
}

const stopTimer = (todoId) => {
    clearInterval(timers[todoId]);
    delete timers[todoId];
}

export {
    startTimer,
    formatTime,
    stopTimer
}