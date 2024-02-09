'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const normalTasksList = document.getElementById('normalTasksList');
  const importantTasksList = document.getElementById('importantTasksList');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const toggleAllBtn = document.getElementById('toggleAllBtn');

  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTask();
  });

  toggleAllBtn.addEventListener('click', toggleAllTasks);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  loadTasks();

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      const priority = prioritySelect.value;
      const taskElement = createTaskElement(taskText, priority);

      if (priority === 'normal') {
        normalTasksList.appendChild(taskElement);
      } else {
        importantTasksList.appendChild(taskElement);
      }

      saveTaskToStorage(taskText, priority);
      taskInput.value = '';
    }
  }

  function createTaskElement(text, priority) {
    const taskItem = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';

    const priorityClass = priority === 'importante' ? 'important-task' : '';
    taskItem.className = `task-item ${priorityClass}`;

    const taskTextElement = document.createElement('span');
    taskTextElement.textContent = text;

    // Agregar span para la fecha
    const taskDateElement = document.createElement('span');
    taskDateElement.className = 'task-date';
    const date = new Date().toLocaleString();
    taskDateElement.textContent = ` (${date})`;

    taskItem.appendChild(taskCheckbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(taskDateElement);

    taskCheckbox.addEventListener('change', function () {
      taskItem.classList.toggle('completed', taskCheckbox.checked);
      updateCompletedState();
    });

    return taskItem;
  }

  function updateCompletedState() {
    saveTasksToStorage();
  }

  function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.completed');
    completedTasks.forEach(task => task.remove());
    saveTasksToStorage();
  }

  function saveTaskToStorage(text, priority) {
    let tasks = getTasksFromStorage();
    const timestamp = new Date().toISOString();
    tasks.push({ text, priority, timestamp });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function saveTasksToStorage() {
    let tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
      const text = taskItem.querySelector('span').textContent;
      const priority = taskItem.classList.contains('important-task') ? 'importante' : 'normal';
      const timestamp = taskItem.getAttribute('data-timestamp');
      const completed = taskItem.classList.contains('completed');

      tasks.push({ text, priority, timestamp, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
      const taskElement = createTaskElement(task.text, task.priority);
      taskElement.classList.toggle('completed', task.completed);
      taskElement.setAttribute('data-timestamp', task.timestamp);

      if (task.priority === 'normal') {
        normalTasksList.appendChild(taskElement);
      } else {
        importantTasksList.appendChild(taskElement);
      }
    });
  }

  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  function toggleAllTasks() {
    const allTasks = document.querySelectorAll('.task-item input[type="checkbox"]');
    allTasks.forEach(checkbox => {
      checkbox.checked = !checkbox.checked;
      const taskItem = checkbox.closest('.task-item');
      taskItem.classList.toggle('completed', checkbox.checked);
    });
    updateCompletedState();
  }
});
