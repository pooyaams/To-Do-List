import {
    colorStars,
    getSavedTodos,
    idGenerator,
    newTodoContainerBtn,
    notyf,
    saveTodos, showTodos,
    toggleNewTodoContainer
} from "./utils/utils.js";

const exportBtn = document.querySelector('#exportBtn');
const exportContainer = document.querySelector('#exportContainer');
const newTodoTitle = document.querySelector('#newTodoTitle');
const newTodoDescription = document.querySelector('#newTodoDescription');
const newTodoCategory = document.querySelector('#newTodoCategory');
const titleLength = document.querySelector('#titleLength');
const descriptionLength = document.querySelector('#descriptionLength');
const newTodoStars = document.querySelectorAll('.newTodoStars');
const submitTodo = document.querySelector('#submitTodo');
const todosContainer = document.querySelector('#todosContainer');
const showMoreTodosBtn = document.querySelector('#showMoreTodos');
const showLessTodosBtn = document.querySelector('#showLessTodos');

let todos = getSavedTodos() || [];
let difficulty = 1;
let category = 'all';
let page = 1;
const todosPerPage = 5;
let stopIndex;

// show todos more details
document.addEventListener('click', (event) => {
    const btn = event.target.closest('.moreDetailsBtn');
    if (!btn) return;

    const isOpen = btn.getAttribute('aria-expended') === 'true';
    const icon = btn.querySelector('svg');

    if (isOpen) {
        btn.parentElement.style.maxHeight = '24px';
        btn.setAttribute('aria-expended', 'false');
        icon.classList.remove('rotate-180');
    } else {
        btn.parentElement.style.maxHeight = btn.parentElement.scrollHeight + 'px';
        btn.setAttribute('aria-expended', 'true');
        icon.classList.add('rotate-180');
    }
})


// show export box
exportBtn.addEventListener('click', () => {
    exportContainer.classList.toggle('hidden');
});
document.addEventListener('click', (event) => {
    if (event.target !== exportBtn) {
        exportContainer.classList.add('hidden');
    }
});

// show todo create form
newTodoContainerBtn.addEventListener('click', () => {
    toggleNewTodoContainer();
});

// handle new todo form
newTodoTitle.addEventListener('input', (event) => {

    if (event.target.value.length > 30) {
        event.target.value = event.target.value.slice(0, 30);
    }

    titleLength.innerHTML = event.target.value.length;
});
newTodoDescription.addEventListener('input', (event) => {

    if (event.target.value.length > 120) {
        event.target.value = event.target.value.slice(0, 30);
    }

    descriptionLength.innerHTML = event.target.value.length;
});

//difficulty stars
newTodoStars.forEach((star) => {
    star.addEventListener('mouseenter', (event) => {
        const score = +event.target.dataset.score;
        colorStars(newTodoStars, score);
    });

    star.addEventListener('mouseleave', () => {
        colorStars(newTodoStars, difficulty);
    });

    star.addEventListener('click', () => {
        difficulty = +star.dataset.score;
        colorStars(newTodoStars, difficulty);
    });
});

// handle category
newTodoCategory.addEventListener('change', (event) => {
    category = event.target.value;
});

// create todo
submitTodo.addEventListener('click', (e) => {
    e.preventDefault();
    const title = newTodoTitle.value.trim();
    const description = newTodoDescription.value.trim();

    if (title !== "") {
        const todo = {
            id: idGenerator(),
            title,
            description,
            category,
            difficulty,
            timer: 0,
            status: 'notStarted',
            isComplete: false,
            createdAt: Date.now()
        }

        todos.push(todo);
        saveTodos(todos);
        notyf.success('New task added.');
        showTodos(checkTodosCount());

        newTodoTitle.value = '';
        newTodoDescription.value = '';
        category = 'all';
        difficulty = 1;
        colorStars(newTodoStars, 1);
        newTodoCategory.selectedIndex = 0;
    } else {
        notyf.error('Title cannot be empty.');
    }
});

// show todos
const checkTodosCount = () => {
     stopIndex = (page * todosPerPage);

    if (stopIndex >= todos.length) {
        showMoreTodosBtn.classList.add('!hidden');
        showLessTodosBtn.classList.remove('!hidden');
    }else {
        showMoreTodosBtn.classList.remove('!hidden');
        showLessTodosBtn.classList.add('!hidden');
    }

    return [...todos].reverse().splice(0, stopIndex)
}
showTodos(checkTodosCount());

// show more todos
showMoreTodosBtn.addEventListener('click', () => {
    page++;
    showTodos(checkTodosCount());
});

// show less todos
showLessTodosBtn.addEventListener('click', () => {
    page = 1;
    showTodos(checkTodosCount());
});

// complete todo
todosContainer.addEventListener('click', (event) => {
    const checkBtn = event.target.closest('.todo-checkbox-input');
    if (!checkBtn) return;

    const todoId = checkBtn.id.substring(10);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    todos[todoIndex].isComplete = checkBtn.checked;
    saveTodos(todos);
    showTodos(checkTodosCount());
})
