const tasks = [];

const addForm = document.querySelector('.form');
// const addButton = document.querySelector('.form__button');
const inputField = document.querySelector('.form__input');
const list = document.querySelector('.list');

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push(inputField.value);
  addForm.reset();
  displayTasks();
});

function displayTasks() {
  list.innerHTML = tasks.map((item) => {
    return `<li class="list__item">${item}</li>`;
  }).join('');
}

displayTasks();
