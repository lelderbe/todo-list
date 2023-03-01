const tasks = JSON.parse(localStorage.getItem('tasks')) || [
  { title: 'Сделать что-то хорошее', done: false, description: '' },
  { title: 'Прочитать все книги мира', done: false, description: 'К концу этого года' },
  { title: 'Продумать план по захвату мира', done: false, description: 'Простой и эффективный' },
  { title: 'Купить наркотики', done: true, description: '' },
  { title: 'Спланировать, организовать и сделать кое-что, о чём нельзя говорить 🤫', done: false, description: '' },
];

const form = document.querySelector('.form');
const titleField = document.querySelector('.form__title');
const descriptionField = document.querySelector('.form__description');
const submitButton = document.querySelector('.form__button');
const list = document.querySelector('.list');
const chevronButton = document.querySelector('.form__chevron');
const formDetails = document.querySelector('#form__details');

let formExpanded = false;
let editTask = null;

function expandDetails(expand) {
  submitButton.textContent = editTask ? 'Сохранить' : 'Добавить задачу';
  formExpanded = expand === undefined ? !formExpanded : expand;
  if (formExpanded) {
    formDetails.classList.remove('hide');
    chevronButton.classList.add('invert');
  } else {
    formDetails.classList.add('hide');
    chevronButton.classList.remove('invert');
  }
  setInputFocus();
}

function setInputFocus() {
  titleField.focus();
}

chevronButton.addEventListener('click', (e) => {
  expandDetails();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (titleField.value === '' && descriptionField.value === '') {
    // Hit enter - expand details
    expandDetails();
    return;
  }

  const title = titleField.value.trim();
  const description = descriptionField.value.trim();
  if (!title) {
    return;
  }

  if (editTask) {
    editTask.title = title;
    editTask.description = description;
    editTask = null;
  } else {
    const task = { title: title, done: false, description: description };
    tasks.push(task);
  }

  form.reset();
  expandDetails(false);
  displayTasks();
});

function displayTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  list.innerHTML = tasks
    .map((item, index) => {
      const checked = item.done ? 'checked' : '';
      const descriptionClassList = 'task__description' + (item.done ? ' task--done' : '');
      return `
        <li class="list__item task">
          <div class="task__title">
            <label class="task__label">
              <input class="task__checkbox" type="checkbox" ${checked} onclick="toggleTaskDone(${index})">
              <span>
                ${item.title}
              </span>
            </label>
            <i class="edit fas fa-pen" onclick="changeTask(${index})"></i>
            <i class="trash fas fa-trash" onclick="deleteTask(${index})"></i>
          </div>
          <div class="${descriptionClassList}">
            ${item.description}
          </div>
        </li>
      `;
    })
    .join('');
  setInputFocus();
}

function toggleTaskDone(id) {
  tasks[id].done = !tasks[id].done;
  displayTasks();
}

function changeTask(id) {
  editTask = tasks[id];
  expandDetails(true);
  titleField.value = editTask.title;
  descriptionField.value = editTask.description;
}

function deleteTask(id) {
  editTask = editTask?.id === id ? null : editTask;
  tasks.splice(id, 1);
  displayTasks();
}

displayTasks();
