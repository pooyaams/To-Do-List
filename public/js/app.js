import {
    colorStars,
    getSavedTodos,
    idGenerator,
    newTodoContainerBtn,
    notyf,
    saveTodos, showConfirmModal, showTodos,
    toggleNewTodoContainer
} from "./utils/utils.js";
import {startTimer, stopTimer} from "./timer.js";

const mainContent = document.querySelector('#mainContent');
const loader = document.querySelector('#loader');
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
const filterCategory = document.querySelector('#filter-category');
const filterDifficulty = document.querySelector('#filter-difficulty');
const filterStatus = document.querySelector('#filter-status');

document.addEventListener('DOMContentLoaded', () => {
    loader.classList.add('hidden');
    mainContent.classList.remove('hidden');
});

let todos = getSavedTodos() || [];
let difficulty = 1;
let category = 'all';
let page = 1;
const todosPerPage = 5;
let stopIndex;
let showingTodos = [...todos];

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
        showingTodos = todos;
        showTodos(checkTodosCount(todos));
        resetFilters();
        notyf.success('New task added.');

        console.log(todos)

        // reset todo form
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
const checkTodosCount = (todosList) => {
    stopIndex = (page * todosPerPage);

    if(todosList.length === 0) { // no todo
        showMoreTodosBtn.classList.add('!hidden');
        showLessTodosBtn.classList.add('!hidden');
    } else if (stopIndex < todosList.length) { // if there is more todo to show
        showMoreTodosBtn.classList.remove('!hidden');
        showLessTodosBtn.classList.add('!hidden');
    } else { // all todos showd
        showMoreTodosBtn.classList.add('!hidden');

        if (todosList.length > todosPerPage) {
            showLessTodosBtn.classList.remove('!hidden');
        }else {
            showLessTodosBtn.classList.add('!hidden');
        }

    }

    return [...todosList].reverse().splice(0, stopIndex);
}
showTodos(checkTodosCount(todos));

// show more todos
showMoreTodosBtn.addEventListener('click', () => {
    page++;
    showTodos(checkTodosCount(showingTodos));
});

// show less todos
showLessTodosBtn.addEventListener('click', () => {
    page = 1;
    showTodos(checkTodosCount(showingTodos));
});

// complete todo
todosContainer.addEventListener('click', (event) => {
    const checkBtn = event.target.closest('.todo-checkbox-input');
    if (!checkBtn) return;

    const todoId = checkBtn.id.substring(10);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    if (checkBtn.checked) {
        todos[todoIndex].status = 'completed';
    } else {

        // check if todo was started before
        if (todos[todoIndex].timer === 0) {
            todos[todoIndex].status = 'notStarted';
        } else {
            todos[todoIndex].status = 'inProgress';
        }
    }
    todos[todoIndex].isComplete = checkBtn.checked;

    saveTodos(todos);
    filterTodos(); // if any filter is selected , show filtered todos
});

// delete todo
todosContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.deleteTodo');
    if (!deleteBtn) return;

    showConfirmModal('Delete this todo?', () => {
        const todoId = deleteBtn.dataset.id;
        const todoIndex = todos.findIndex(todo => todo.id === todoId);

        todos.splice(todoIndex, 1);
        saveTodos(todos);
        filterTodos(); // if any filter is selected , show filtered todos
    });
});

// edit todo
todosContainer.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.editTodo');
    if (!editBtn) return;

    const todoId = editBtn.dataset.id;
    const todoIndex = todos.findIndex(todo => todo.id === todoId);

    Swal.fire({
        title: 'Edit todo',
        html: `
        <form class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4">

            <div class="relative">
                <input type="text" autocomplete="off" maxlength="30" id="editTodoTitle"
                       class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-600 dark:border-gray-400 rounded-sm py-2 pl-2 pr-12 mt-1"
                       required value="${todos[todoIndex].title}" placeholder="Enter todo title">
                <div class="absolute right-2 top-4 text-xs text-gray-400 dark:text-gray-500">
                    <span id="editTitleLength">${todos[todoIndex].title.length}</span>
                    / 30
                </div>
            </div>
            <div class="relative mt-3">
                <textarea type="text"   maxlength="120" rows="3" id="editTodoDescription"
                          class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-600 dark:border-gray-400 rounded-sm pt-2 !pb-10 px-2 mt-1"
                          placeholder="Add description (optional)">${todos[todoIndex].description}</textarea>
                <div class="absolute right-3 bottom-3 text-xs text-gray-400 dark:text-gray-500">
                    <span id="editDescriptionLength">${todos[todoIndex].description.length}</span>
                    / 120
                </div>
            </div>
            <div class="flex items-center gap-x-3 mt-2">
                <!--category-->
                <div class="flex-1">
                    <select type="text" id="editTodoCategory"
                            class="w-full h-10 bg-gray-100 dark:bg-gray-800 border border-gray-600 dark:border-gray-400 rounded-sm px-2 mt-1">
                        <option value="all">All</option>
                        <option value="personal">Personal</option>
                        <option value="education">Education</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                    </select>
                </div>
                <!--difficulty-->
                <div class="flex-1">
                    <select type="text" id="editTodoDifficulty"
                            class="w-full h-10 bg-gray-100 dark:bg-gray-800 border border-gray-600 dark:border-gray-400 rounded-sm px-2 mt-1">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
               
            </div>
            <!--edit btn-->
            <div class="block mt-4">
                <button id="submitEditBtn" class="w-full h-10 flex-center gap-x-2 text-gray-800 bg-emerald-500 hover:bg-emerald-400 rounded-md cursor-pointer">
                    <svg class="size-5">
                        <use href="#edit"></use>
                    </svg>
                    Edit
                </button>
            </div>
        </form>
    `,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: true,
        customClass: {
            popup: '!bg-white dark:!bg-gray-800 my-shadow',
            title: '!text-xl text-gray-800 dark:!text-gray-100 !text-left',
            closeButton: '!shadow-none'
        }
    });

    const editTodoTitle = document.querySelector('#editTodoTitle');
    const editTodoDescription = document.querySelector('#editTodoDescription');
    const editTodoCategory = document.querySelector('#editTodoCategory');
    const editTodoDifficulty = document.querySelector('#editTodoDifficulty');
    const editTitleLength = document.querySelector('#editTitleLength');
    const editDescriptionLength = document.querySelector('#editDescriptionLength');
    const submitEditBtn = document.querySelector('#submitEditBtn');

    // show editing todo data
    editTodoCategory.value = todos[todoIndex].category;
    editTodoDifficulty.value = todos[todoIndex].difficulty;

    // handle edit todo title and description length
    editTodoTitle.addEventListener('input', (event) => {

        if (event.target.value.length > 30) {
            event.target.value = event.target.value.slice(0, 30);
        }
        console.log(event.target.value.length)
        editTitleLength.innerHTML = event.target.value.length;

    });
    editTodoDescription.addEventListener('input', (event) => {

        if (event.target.value.length > 120) {
            event.target.value = event.target.value.slice(0, 30);
        }

        editDescriptionLength.innerHTML = event.target.value.length;
    });

    // submit edit
    submitEditBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (editTodoTitle.value.trim() !== "") {
            todos[todoIndex].title = editTodoTitle.value.trim();
            todos[todoIndex].description = editTodoDescription.value.trim();
            todos[todoIndex].difficulty = editTodoDifficulty.value;
            todos[todoIndex].category = editTodoCategory.value;

            saveTodos(todos);
            filterTodos(); // if any filter is selected , show filtered todos
            notyf.success('Todo edited successfully.');
            Swal.close();
        } else {
            notyf.error('Title cannot be empty.');
        }
    })

});

// filters
const filterTodos = () => {
    page = 1;

    const category = filterCategory.value;
    const difficulty = filterDifficulty.value;
    const status = filterStatus.value;

    showingTodos = [...todos].filter((todo) => {
        return (category === 'all' || todo.category === category) &&
            (difficulty === 'all' || +todo.difficulty === +difficulty) &&
            (status === 'all' || todo.status === status)
    });

    showTodos(checkTodosCount(showingTodos));
}
const resetFilters = () => {
    filterCategory.selectedIndex = 0;
    filterDifficulty.selectedIndex = 0;
    filterStatus.selectedIndex = 0;
}

filterCategory.addEventListener('change', filterTodos);
filterDifficulty.addEventListener('change', filterTodos);
filterStatus.addEventListener('change', filterTodos);

// timer
todosContainer.addEventListener('click', (event) => {
    const startBtn = event.target.closest('.todoStartBtn');
    if (!startBtn) return;

    const todoId = startBtn.dataset.id;

    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    todos[todoIndex].status = 'inProgress';
    saveTodos(todos);

    startTimer(todoId, todos);
    startBtn.nextElementSibling.classList.remove('!hidden');
    startBtn.classList.add('!hidden');
}); // start timer
todosContainer.addEventListener('click', (event) => {
    const stopBtn = event.target.closest('.todoStopBtn');
    if (!stopBtn) return;

    const todoId = stopBtn.dataset.id;

    stopTimer(todoId);

    stopBtn.previousElementSibling.classList.remove('!hidden');
    stopBtn.classList.add('!hidden');
}); // stop timer