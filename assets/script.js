const TaskType = {
  private: { id: 'private', title: 'личная' },
  work: { id: 'work', title: 'рабочая' },
};

const tasks = JSON.parse(localStorage.getItem('tasks')) || [
  {
    id: 1,
    title: 'Сделать что-то хорошее',
    done: false,
    description: '',
    type: TaskType.work.id,
    deadline: '',
  },
  {
    id: 2,
    title: 'Прочитать все книги мира',
    done: false,
    description: 'К концу этого года',
    type: TaskType.private.id,
    deadline: '',
  },
  {
    id: 3,
    title: 'Продумать план по захвату мира',
    done: false,
    description: 'Простой и эффективный',
    type: TaskType.work.id,
    deadline: '',
  },
  { id: 4, title: 'Купить наркотики', done: true, description: '', type: TaskType.private.id, deadline: '' },
  {
    id: 5,
    title: 'Спланировать, организовать и сделать кое-что, о чём нельзя говорить 🤫',
    done: false,
    description: '',
    type: TaskType.private.id,
    deadline: '',
  },
];

// Create/edit form (header panel)
const form = document.querySelector('.form');
const formTitleField = document.querySelector('.form__title');
const formDescriptionField = document.querySelector('.form__description');
const formTypeField = document.querySelector('#form__type');
const formDateField = document.querySelector('#form__date');
const formTimeField = document.querySelector('#form__time');
const formSubmitButton = document.querySelector('.form__button');

const tasksList = document.querySelector('.list');
const chevronButton = document.querySelector('.form__chevron');
const formDetails = document.querySelector('#form__details');

// Filters panel
// const filtersResetIcon = document.querySelector('.filters__icon');
const filtersTypeField = document.querySelector('#filters__type');
const filtersDoneField = document.querySelector('#filters__done');
const filtersDateField = document.querySelector('#filters__date');
// const sidebarChevronButton = document.querySelector('#sidebar__chevron');

let formExpanded = false;
let editTask = null;
let sidebarShow = false;

filtersTypeField.addEventListener('change', () => {
  // setFiltersIcon();
  displayTasks();
});
filtersDoneField.addEventListener('change', () => {
  // setFiltersIcon();
  displayTasks();
});
filtersDateField.addEventListener('change', () => {
  // setFiltersIcon();
  displayTasks();
});
// sidebarChevronButton.addEventListener('click', () => expandFilters());
chevronButton.addEventListener('click', () => expandFormDetails());

formTitleField.addEventListener('keypress', (e) => {
  if (e.key == "Escape") {
    console.log('ESC pressed');
  }
});

function getFilteredTasks() {
  const filterType = filtersTypeField.value;
  const filterDone = filtersDoneField.value;
  const filterDate = filtersDateField.value;

  function sortUp(a, b) {
    if (!a.deadline) {
      return 1;
    }
    if (!b.deadline) {
      return -1;
    }
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
  }

  function sortDown(b, a) {
    if (!a.deadline) {
      return 1;
    }
    if (!b.deadline) {
      return -1;
    }
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
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
  // setFiltersIcon();
  displayTasks();
}

// function setFiltersIcon() {
//   const filterType = filtersTypeField.value;
//   const filterDone = filtersDoneField.value;
//   const filterDate = filtersDateField.value;

//   filtersResetIcon.removeEventListener('click', filtersReset);

//   if (filterType || filterDone || filterDate) {
//     filtersResetIcon.classList.add('filters__icon_active');
//     filtersResetIcon.addEventListener('click', filtersReset);
//   } else {
//     filtersResetIcon.classList.remove('filters__icon_active');
//   }
// }

function expandFilters(expand) {
  sidebarShow = expand === undefined ? !sidebarShow : expand;
  if (sidebarShow) {
    sidebarPanel.classList.add('sidebar_show');
    sidebarChevronButton.classList.add('invert');
  } else {
    sidebarPanel.classList.remove('sidebar_show');
    sidebarChevronButton.classList.remove('invert');
  }
  setDefaultFocus();
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
  const deadline = formDateField.value ? formDateField.value + 'T' + (formTimeField.value ? formTimeField.value : '00:00' ) : '';

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
  function getItemColor(item) {
    const hours6 = 6 * 60 * 60 * 1000;
    const hours3 = 3 * 60 * 60 * 1000;
    const now = new Date();
    const deadlineTime = new Date(item.deadline);
    const diff = deadlineTime - now;
    let taskColor = (!item.done && diff <= hours6) ? 'expired6h' : '';
    taskColor = (!item.done && diff <= hours3) ? 'expired3h' : taskColor;
    return taskColor;
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  const filtered = getFilteredTasks(tasks);
  tasksList.innerHTML = filtered
    .map((item) => {
      const checked = item.done ? 'checked' : '';
      const descriptionClassList = 'task__description' + (item.done ? ' task_done' : '');
      const typeTitle = TaskType[item.type]?.title || '';
      const deadline = item.deadline ? new Date(item.deadline).toLocaleString('ru-RU') : '';
      const taskColor = getItemColor(item);

      return `
        <li class="list__item task">
          <div class="task__title">
            <label class="task__label ${taskColor}">
              <input class="task__checkbox" type="checkbox" ${checked} onclick="toggleTaskDone(${item.id})">
              <span>
                ${item.title}
              </span>
              <div class="task__tag task-type">
                ${typeTitle}
              </div>
              <div class="task__tag task-deadline ${deadline ? '' : 'hide'}">
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
    formDateField.value = editTask.deadline ? editTask.deadline.split('T')[0] : '';
    formTimeField.value = editTask.deadline ? editTask.deadline.split('T')[1] : '';
  }
}

function deleteTask(id) {
  const index = tasks.findIndex((item) => item.id === id);
  if (index !== -1) {
    editTask = editTask === tasks[index] ? null : editTask;
    tasks.splice(index, 1);
    displayTasks();
  }
}

displayTasks();
