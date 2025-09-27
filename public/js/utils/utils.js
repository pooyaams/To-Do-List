const newTodoContainer = document.querySelector('#newTodoContainer');
const newTodoForm = document.querySelector('#newTodoForm');
const newTodoContainerBtn = document.querySelector('#newTodoContainerBtn');

const notyf = new Notyf({
    duration: 3000,
    position: {
        x: 'right',
        y: 'top'
    },
    dismissible: false
});

const toggleNewTodoContainer = () => {
    const isOpen = newTodoContainerBtn.getAttribute('aria-expanded') === 'true';

    const icon = newTodoContainerBtn.querySelector('#plusCircleIcon');
    const height = newTodoContainer.scrollHeight;

    if (isOpen) {
        newTodoForm.setAttribute('aria-hidden', 'true');
        newTodoContainerBtn.setAttribute('aria-expanded', 'false');
        newTodoContainerBtn.classList.add('overflow-hidden');
        // newTodoContainer.classList.replace(`max-h-[${height}px]`, 'max-h-[56px]');
        newTodoContainer.style.maxHeight = '56px'
        icon.classList.remove('rotate-45');
    }else {
        newTodoForm.setAttribute('aria-hidden', 'false');
        newTodoContainerBtn.setAttribute('aria-expanded', 'true');
        newTodoContainerBtn.classList.remove('overflow-hidden');
        // newTodoContainer.classList.replace('max-h-[56px]', `max-h-[${height}px]`);
        newTodoContainer.style.maxHeight = height + 'px'
        icon.classList.add('rotate-45');
    }

}

const colorStars = (stars, range) => {
    stars.forEach((star) => {
        star.classList.remove('text-amber-500');
    });

    stars.forEach((star) => {
        if (+star.dataset.score <= range) {
            star.classList.add('text-amber-500');
        }
    })
}

const idGenerator = () => {
    return Date.now().toString() + (Math.floor(Math.random() * 10000000000)).toString();
}

const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
}

const getSavedTodos = () => {
    return JSON.parse(localStorage.getItem('todos'));
}

const showTodos = (todos) => {
    const container = document.querySelector('#todosContainer');
    container.innerHTML = '';

    todos.forEach((todo) => {
        const date = new Date(todo.createdAt);
        const createdAt = date.toLocaleDateString('en-Us', {
            year: 'numeric',
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "numeric"
        });

        let stars = '';
        for (let i = 0; i < todo.difficulty; i++) {
            stars += `
                <svg class="size-4 text-amber-500">
                    <use href="#star"></use>
                </svg> 
            `
        }
        for (let i = 0; i < 5 - todo.difficulty; i++) {
            stars += `
                <svg class="size-4">
                    <use href="#star"></use>
                </svg> 
            `
        }

        container.insertAdjacentHTML("beforeend",
            `
            <div class="relative w-full px-4 pb-4 pt-2 bg-white dark:bg-gray-800 rounded-lg my-shadow">
                <!--difficulty & edit & delete-->
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center justify-start gap-x-0.5 cursor-pointer text-gray-800 dark:text-gray-300">
                            ${stars}
                        </div>
                    </div>
                    <div class="flex-1">
                        <span id="timer-${todo.id}" class="flex items-start justify-center text-gray-500 dark:text-gray-500">00:00:00</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-end gap-x-2 text-gray-800 dark:text-gray-500">
                            <svg data-id="${todo.id}" class="deleteTodo size-5 cursor-pointer hover:text-emerald-500">
                                <use href="#trash"></use>
                            </svg>
                            <svg data-id="${todo.id}" class="editTodo size-5 cursor-pointer hover:text-emerald-500">
                                <use href="#edit"></use>
                            </svg>
                        </div>
                    </div>
                </div>

                <!--title-->
                <div class="flex items-center gap-x-3 my-4">
                    <div class="">
                        <input id="todoCheck-${todo.id}" ${todo.isComplete ? 'checked' : ''} type="checkbox" class="hidden peer todo-checkbox-input">
                        <label for="todoCheck-${todo.id}" class="todo-completed-checkbox z-20"></label>
                    </div>

                    <h3 class="flex-1 text-gray-800 dark:text-gray-100 text-sm lg:text-lg line-clamp-1 ${todo.isComplete ? 'line-through' : ''}">${todo.title}</h3>
                    <button data-id="${todo.id}" class="h-10 flex-center text-lg bg-emerald-500 hover:bg-emerald-400 text-gray-800 rounded-md cursor-pointer px-4">
                        start
                    </button>
                </div>

                <!--moreDetails-->
                <div class="text-gray-600 dark:text-gray-300 transition-[max-height] duration-300 overflow-hidden" style="max-height: 24px">
                    <button aria-expanded="false" class="moreDetailsBtn flex items-center gap-x-2 cursor-pointer">
                        <svg class="size-4 transition duration-300">
                            <use href="#chevron-down"></use>
                        </svg>
                        more details
                    </button>
                    <div
                       class="text-sm pt-3 pl-2 ml-[7px] text-gray-600 dark:text-gray-400 border-l border-gray-300 dark:border-gray-700">
                        <span class="text-emerald-500 text-base">
                            #${todo.category}
                        </span>
                        <p class="py-3 text-amber-500">
                            ${createdAt}
                        </p>
                        <p>
                            ${todo.description}
                        </p>
                    </div>
                </div>
                
                <div class="completed size-full bg-black/30 absolute inset-0 z-10 ${todo.isComplete ? '': 'hidden'}"></div>
            </div>

            `
        )
    });
}

const showConfirmModal = (title, callback) => {
    Swal.fire({
        title: title,
        showCancelButton: true,
        cancelButtonText: 'No',
        showConfirmButton: true,
        confirmButtonText: 'Yes',
        customClass: {
            popup: '!bg-white dark:!bg-gray-800 my-shadow',
            title: '!text-xl text-gray-800 dark:!text-gray-100',
            confirmButton: '!h-10 !flex !items-center !justify-center !bg-red-500 !text-gray-800 dark:!text-gray-100 !px-8  !shadow-none',
            cancelButton: '!h-10 !flex !items-center !justify-center !bg-transparent !border !border-gray-500 !text-gray-800 dark:!text-gray-100 !px-8 '
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}

export {
    toggleNewTodoContainer,
    newTodoContainerBtn,
    colorStars,
    idGenerator,
    saveTodos,
    getSavedTodos,
    notyf,
    showTodos,
    showConfirmModal
}