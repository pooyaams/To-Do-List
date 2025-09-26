import {
    colorStars,
    getSavedTodos,
    idGenerator,
    newTodoContainerBtn,
    notyf,
    saveTodos,
    toggleNewTodoContainer
} from "./utils/utils.js";

const moreDetailsBtn = document.querySelectorAll('.moreDetailsBtn');
const exportBtn = document.querySelector('#exportBtn');
const exportContainer = document.querySelector('#exportContainer');
const newTodoTitle = document.querySelector('#newTodoTitle');
const newTodoDescription = document.querySelector('#newTodoDescription');
const newTodoCategory = document.querySelector('#newTodoCategory');
const titleLength = document.querySelector('#titleLength');
const descriptionLength = document.querySelector('#descriptionLength');
const newTodoStars = document.querySelectorAll('.newTodoStars');
const submitTodo = document.querySelector('#submitTodo');

const todos = getSavedTodos() || [];
let difficulty = 1;
let category = 'all';
let page = 1;

// show todos more details
moreDetailsBtn.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        const isOpen = btn.getAttribute('aria-expended') === 'true';
        const icon = btn.querySelector('svg');

        if (isOpen) {
            btn.parentElement.style.maxHeight = '24px';
            btn.setAttribute('aria-expended', 'false');
            icon.classList.remove('rotate-180');
        }else {
            btn.parentElement.style.maxHeight = btn.parentElement.scrollHeight + 'px';
            btn.setAttribute('aria-expended', 'true');
            icon.classList.add('rotate-180');
        }
    })
});

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

        newTodoTitle.value = '';
        newTodoDescription.value = '';
        category = 'all';
        difficulty = 1;
        colorStars(newTodoStars, 1);
        newTodoCategory.selectedIndex = 0;
    }else {
        notyf.error('Title cannot be empty.');
    }
});