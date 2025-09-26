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

export {
    toggleNewTodoContainer,
    newTodoContainerBtn,
    colorStars,
    idGenerator,
    saveTodos,
    getSavedTodos,
    notyf,
}