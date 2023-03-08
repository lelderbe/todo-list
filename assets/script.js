const TaskType = {
  private: { id: 'private', title: 'личная' },
  work: { id: 'work', title: 'рабочая' },
};

const tasks = JSON.parse(localStorage.getItem('tasks')) || [
  { id: 1, title: 'Сделать что-то хорошее', done: false, description: '', type: TaskType.work.id, deadline: 0 },
  {
    id: 2,
    title: 'Прочитать все книги мира',
    done: false,
    description: 'К концу этого года',
    type: TaskType.private.id,
    deadline: 0,
  },
  {
    id: 3,
    title: 'Продумать план по захвату мира',
    done: false,
    description: 'Простой и эффективный',
    type: TaskType.work.id,
    deadline: 0,
  },
  { id: 4, title: 'Купить наркотики', done: true, description: '', type: TaskType.private.id, deadline: 0 },
  {
    id: 5,
    title: 'Спланировать, организовать и сделать кое-что, о чём нельзя говорить 🤫',
    done: false,
    description: '',
    type: TaskType.private.id,
    deadline: 0,
  },
];

// Create/edit form (header panel)
const form = document.querySelector('.form');
const formTitleField = document.querySelector('.form__title');
const formDescriptionField = document.querySelector('.form__description');
const formTypeField = document.querySelector('#form__type');
const formDateField = document.querySelector('#form__date');
const formSubmitButton = document.querySelector('.form__button');

const tasksList = document.querySelector('.list');
const chevronButton = document.querySelector('.form__chevron');
const formDetails = document.querySelector('#form__details');

// Filters panel
const filtersResetIcon = document.querySelector('.filters__icon');
const filtersTypeField = document.querySelector('#filters__type');
const filtersDoneField = document.querySelector('#filters__done');
const filtersDateField = document.querySelector('#filters__date');

// formDateField.valueAsDate = new Date(getTomorrow());

let formExpanded = false;
let editTask = null;

filtersTypeField.addEventListener('change', () => {
  setFiltersIcon();
  displayTasks();
});
filtersDoneField.addEventListener('change', () => {
  setFiltersIcon();
  displayTasks();
});
filtersDateField.addEventListener('change', () => {
  setFiltersIcon();
  displayTasks();
});

function getFilteredTasks() {
  const filterType = filtersTypeField.value;
  const filterDone = filtersDoneField.value;
  const filterDate = filtersDateField.value;

  function sortUp(a, b) {
    if (a.deadline === 0) {
      return 1;
    }
    if (b.deadline === 0) {
      return -1;
    }
    return a.deadline - b.deadline;
  }

  function sortDown(b, a) {
    if (a.deadline === 0) {
      return 1;
    }
    if (b.deadline === 0) {
      return -1;
    }
    return a.deadline - b.deadline;
  }

  const filtered = tasks
    .filter((item) => {
      if (filterType && item.type !== filterType) {
        return false;
      }
      return true;
    })
    .filter((item) => {
      if (filterDone && String(item.done) !== filterDone) {
        return false;
      }
      return true;
    });

  if (filterDate) {
    filterDate === 'up' ? filtered.sort(sortUp) : filtered.sort(sortDown);
  }

  return filtered;
}

function filtersReset() {
  filtersTypeField.value = '';
  filtersDoneField.value = '';
  filtersDateField.value = '';
  setFiltersIcon();
  displayTasks();
}

function setFiltersIcon() {
  const filterType = filtersTypeField.value;
  const filterDone = filtersDoneField.value;
  const filterDate = filtersDateField.value;

  filtersResetIcon.removeEventListener('click', filtersReset);

  if (filterType || filterDone || filterDate) {
    filtersResetIcon.classList.add('filters__icon_active');
    filtersResetIcon.addEventListener('click', filtersReset);
  } else {
    filtersResetIcon.classList.remove('filters__icon_active');
  }
}

// TODO: move to utils?
function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.getTime();
}

function expandFormDetails(expand) {
  formSubmitButton.textContent = editTask ? 'Сохранить' : 'Добавить задачу';
  formExpanded = expand === undefined ? !formExpanded : expand;
  if (formExpanded) {
    formDetails.classList.remove('hide');
    chevronButton.classList.add('invert');
  } else {
    formDetails.classList.add('hide');
    chevronButton.classList.remove('invert');
  }
  setDefaultFocus();
}

function setDefaultFocus() {
  formTitleField.focus();
}

chevronButton.addEventListener('click', () => expandFormDetails());

form.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (formTitleField.value === '' && formDescriptionField.value === '') {
    // Hit enter - expand details
    expandFormDetails();
    return;
  }

  const title = formTitleField.value.trim();
  const description = formDescriptionField.value.trim();
  const type = formTypeField.value;
  const deadline = formDateField.value ? new Date(formDateField.value).getTime() : 0;
  // const deadline = isNaN(new Date(formDateField.value).getTime()) ? 0 : new Date(formDateField.value).getTime();

  // TODO: add validation function
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
    const newTask = {
      id: Date.now(),
      title: title,
      done: false,
      description: description,
      type: type,
      deadline: deadline,
    };
    tasks.push(newTask);
  }

  form.reset();
  expandFormDetails(false);
  displayTasks();
});

function displayTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  const filtered = getFilteredTasks(tasks);
  tasksList.innerHTML = filtered
    .map((item) => {
      const checked = item.done ? 'checked' : '';
      const descriptionClassList = 'task__description' + (item.done ? ' task_done' : '');
      const typeTitle = TaskType[item.type]?.title || '';
      const deadline = item.deadline ? new Date(item.deadline).toLocaleDateString('ru-RU') : '&infin;';

      return `
        <li class="list__item task">
          <div class="task__title">
            <label class="task__label">
              <input class="task__checkbox" type="checkbox" ${checked} onclick="toggleTaskDone(${item.id})">
              <span>
                ${item.title}
              </span>
              <div class="task__tag task-type">
                ${typeTitle}
              </div>
              <div class="task__tag task-deadline">
                ${deadline}
              </div>
            </label>
            <i class="edit fas fa-pen" onclick="changeTask(${item.id})"></i>
            <i class="trash fas fa-trash" onclick="deleteTask(${item.id})"></i>
          </div>
          <div class="${descriptionClassList}">
            ${item.description}
          </div>
        </li>
    `;
    })
    .join('');
  setDefaultFocus();
}

function toggleTaskDone(id) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index !== -1) {
    tasks[index].done = !tasks[index].done;
    displayTasks();
  } else {
    // error ?
  }
}

function changeTask(id) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index !== -1) {
    editTask = tasks[index];
    expandFormDetails(true);
    formTitleField.value = editTask.title;
    formDescriptionField.value = editTask.description;
    formTypeField.value = editTask.type;
    formDateField.value = editTask.deadline ? new Date(editTask.deadline).toISOString().split('T')[0] : '';
  } else {
    // error ?
  }
}

function deleteTask(id) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index !== -1) {
    editTask = editTask === tasks[index] ? null : editTask;
    tasks.splice(index, 1);
    displayTasks();
  } else {
    // error ?
  }
}

displayTasks();
