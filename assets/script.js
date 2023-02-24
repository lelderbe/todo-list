const tasks = [];

const form = document.querySelector('.form');
// const addButton = document.querySelector('.form__button');
const inputField = document.querySelector('.form__input');
const list = document.querySelector('.list');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = inputField.value.trim();
  if (!title) {
    form.reset();
    return;
  }

  const task = { title: title, done: false };
  tasks.push(task);
  form.reset();
  displayTasks();
});

function displayTasks() {
  list.innerHTML = tasks.map((item, index) => {
    const checked = item.done;
    // const classList = checked ? 'list__item list__item--checked' :  'list__item';
    const classList = 'list__item';

    return `
      <li class="${classList}">
        <input class="list__checkbox" type="checkbox" ${checked ? 'checked' : ''} onclick="setTaskDone(${index})">
        <span>
          ${item.title}
        </span>
      </li>
    `;
  }).join('');
}

function setTaskDone(id) {
  tasks[id].done = !tasks[id].done;
  displayTasks();
}

function initMockData() {
  const data = [
    { title: 'Сделать что-то хорошее', done: false },
    { title: 'Прочитать все книги мира', done: false },
    { title: 'Продумать план по захвату мира', done: false },
    { title: 'Купить наркотики', done: true },
    { title: 'Спланировать, организовать и сделать кое-что о чём нельзя говорить 🤫', done: false },
  ]
  tasks.push(...data);
}

initMockData();
displayTasks();
