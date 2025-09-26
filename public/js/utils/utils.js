const newTodoContainer = document.querySelector('#newTodoContainer');
const newTodoForm = document.querySelector('#newTodoForm');
const newTodoContainerBtn = document.querySelector('#newTodoContainerBtn');

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

export {
    toggleNewTodoContainer,
    newTodoContainerBtn
}