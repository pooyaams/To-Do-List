const themeToggleBtn = document.querySelector('#themeToggleBtn');
const themeSun = document.querySelector('#themeSun');
const themeMoon = document.querySelector('#themeMoon');

window.addEventListener('load', () => {

    let theme = localStorage.getItem('theme') || 'dark';
    changeTheme(theme);

    themeToggleBtn.addEventListener('click', () => {
        theme = localStorage.getItem('theme');

        if (theme === 'dark') {
            changeTheme('light');
        }else {
            changeTheme('dark');
        }
    });

});

const changeTheme = (theme) => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeSun.classList.remove('hidden');
        themeMoon.classList.add('hidden');
        localStorage.setItem('theme', theme);
    }else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        themeSun.classList.add('hidden');
        themeMoon.classList.remove('hidden');
        localStorage.setItem('theme', theme);
    }
}