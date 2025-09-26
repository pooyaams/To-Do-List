import {toggleNewTodoContainer, newTodoContainerBtn} from "./utils/utils.js";

const moreDetailsBtn = document.querySelectorAll('.moreDetailsBtn');
const exportBtn = document.querySelector('#exportBtn');
const exportContainer = document.querySelector('#exportContainer');


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


