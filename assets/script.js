const TaskType = {
  private: { id: 'private', title: 'личная' },
  work: { id: 'work', title: 'рабочая' },
};

const tasks = JSON.parse(localStorage.getItem('tasks')) || [
  { title: 'Сделать что-то хорошее', done: false, description: '', type: TaskType.work.id, deadline: '2023-03-09' },
  {
    title: 'Прочитать все книги мира',
    done: false,
    description: 'К концу этого года',
    type: TaskType.private.id,
    deadline: '2023-03-09',
  },
  {
    title: 'Продумать план по захвату мира',
    done: false,
    description: 'Простой и эффективный',
    type: TaskType.work.id,
    deadline: '2023-03-09',
  },
  { title: 'Купить наркотики', done: true, description: '', type: TaskType.private.id, deadline: '2023-03-09' },
  {
    title: 'Спланировать, организовать и сделать кое-что, о чём нельзя говорить 🤫',
    done: false,
    description: '',
    type: TaskType.private.id,
    deadline: '2023-03-09',
  },
];

const form = document.querySelector('.form');
const titleField = document.querySelector('.form__title');
const descriptionField = document.querySelector('.form__description');
const typeField = document.querySelector('#form__type');
const dateField = document.querySelector('#form__date');
const submitButton = document.querySelector('.form__button');
const list = document.querySelector('.list');
const chevronButton = document.querySelector('.form__chevron');
const formDetails = document.querySelector('#form__details');

dateField.valueAsDate = getTomorrow();

let formExpanded = false;
let editTask = null;

// function initForm() {

// }

// TODO: move to utils?
function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

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
  const type = typeField.value;
  const deadline = dateField.value;

  if (!title || !TaskType[type]) {
    return;
  }

  if (editTask) {
    editTask.title = title;
    editTask.description = description;
    editTask.type = type;
    editTask.deadline = deadline;
    editTask = null;
  } else {
    const task = { title: title, done: false, description: description, type: type, deadline: deadline };
    tasks.push(task);
  }

  form.reset();
  dateField.valueAsDate = getTomorrow();
  expandDetails(false);
  displayTasks();
});

function displayTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  list.innerHTML = tasks
    .map((item, index) => {
      const checked = item.done ? 'checked' : '';
      const descriptionClassList = 'task__description' + (item.done ? ' task--done' : '');
      const type = TaskType[item.type]?.title || '';
      const deadline = item.deadline ? new Date(item.deadline).toLocaleDateString('ru-RU') : '';
      return `
        <li class="list__item task">
          <div class="task__title">
            <label class="task__label">
              <input class="task__checkbox" type="checkbox" ${checked} onclick="toggleTaskDone(${index})">
              <span>
                ${item.title}
              </span>
              <div class="task__tag task-type">
                ${type}
              </div>
              <div class="task__tag task-type">
                ${deadline}
              </div>
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
  typeField.value = editTask.type;
  dateField.value = editTask.deadline;
}

function deleteTask(id) {
  editTask = editTask?.id === id ? null : editTask;
  tasks.splice(id, 1);
  displayTasks();
}

displayTasks();
