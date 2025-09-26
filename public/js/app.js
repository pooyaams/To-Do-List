import {colorStars, newTodoContainerBtn, toggleNewTodoContainer} from "./utils/utils.js";

const moreDetailsBtn = document.querySelectorAll('.moreDetailsBtn');
const exportBtn = document.querySelector('#exportBtn');
const exportContainer = document.querySelector('#exportContainer');
const newTodoTitle = document.querySelector('#newTodoTitle');
const newTodoDescription = document.querySelector('#newTodoDescription');
const newTodoCategory = document.querySelector('#newTodoCategory');
const titleLength = document.querySelector('#titleLength');
const descriptionLength = document.querySelector('#descriptionLength');
const newTodoStars = document.querySelectorAll('.newTodoStars');

let difficulty = 1;
let category = 'all';

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