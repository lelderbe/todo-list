const tasks = [];

function initMockData() {
  const data = [
    { title: 'Сделать что-то хорошее', done: false },
    { title: 'Прочитать все книги мира', done: false },
    { title: 'Продумать план по захвату мира', done: false },
    { title: 'Купить наркотики', done: true },
    { title: 'Спланировать, организовать и сделать кое-что, о чём нельзя говорить 🤫', done: false },
  ]
  tasks.push(...data);
}

initMockData();

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
    const checked = item.done ? 'checked' : '';
    const classList = 'list__item';
    return `
      <li class="${classList}">
        <label class="list__label">
          <input class="list__checkbox" type="checkbox" ${checked} onclick="toggleTaskDone(${index})">
          <span>
            ${item.title}
          </span>
        </label>
        <i class="trash fas fa-trash" onclick="deleteTask(${index})"></i>
      </li>
    `;
  }).join('');
}

function toggleTaskDone(id) {
  tasks[id].done = !tasks[id].done;
  displayTasks();
}

function deleteTask(id) {
  tasks.splice(id, 1);
  displayTasks();
}

displayTasks();
