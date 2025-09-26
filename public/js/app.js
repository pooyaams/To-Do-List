import {toggleNewTodoContainer, newTodoContainerBtn} from "./utils/utils.js";


newTodoContainerBtn.addEventListener('click', () => {
    toggleNewTodoContainer();
});

const moreDetailsBtn = document.querySelectorAll('.moreDetailsBtn');

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
})