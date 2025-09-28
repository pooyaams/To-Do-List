import {formatDate, getSavedTodos, notyf} from "./utils/utils.js";
import {formatTime} from "./timer.js";

const exportContainer = document.querySelector('#exportContainer');

exportContainer.addEventListener('click', (event) => {
    event.preventDefault();

    const exportBtn = event.target.closest('.exportBtn');
    if (!exportBtn) return;

    const format = exportBtn.dataset.format;

    const todos = prepareTodosForExport();

    if (!todos.length) {
        notyf.error("please add todo first.");
        return;
    }

    if (format === 'pdf') {
        exportPdf(todos);
    }else if (format === 'csv') {
        exportCsv(todos);
    }else if(format === 'json') {
        exportJson(todos);
    }
});

const prepareTodosForExport = () => {
    const todos = getSavedTodos() || [];

    return  todos.map((todo) => {
        return {
            ...todo,
            createdAt: formatDate(todo.createdAt),
            timer: formatTime(todo.timer)
        }
    });
}

const handleDownload = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.append(a);

    a.href = url;
    a.download = name;
    a.click();
    a.remove();
}

const exportJson = (todos) => {

    const json = JSON.stringify(todos, null, 2)
    const blob = new Blob([json], {type: "application/json"});

    handleDownload(blob, 'todos.json');
}

const exportCsv = (todos) => {
    const keys = Object.keys(todos[0]);
    const rows = todos.map(todo => keys.map(key => `"${todo[key]}"`).join(","));
    const csv = [keys.join(','), ...rows].join('\n');

    const blob = new Blob([csv], {type: 'text/csv'});

    handleDownload(blob, 'todos.csv');
}

const exportPdf = (todos) => {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Todos List", 10, 10);

    let y = 20;

    todos.forEach((todo, index) => {
        const title = `${index + 1}. ${todo.title}`;
        const info = `category: ${todo.category} - status: ${todo.status}`;
        const times = `Created At: ${todo.createdAt} | Timer: ${todo.timer}`;

        pdf.setFontSize(14);
        pdf.setTextColor(255, 0, 0);
        pdf.text(title, 10, y);
        y += 7;

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(info, 14, y);
        y += 7;
        pdf.text(times, 14, y);
        y += 15;

        if (y > 280) {
            pdf.addPage();
            y = 20;
        }
    });

    pdf.save("todos.pdf");
}