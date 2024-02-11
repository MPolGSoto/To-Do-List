'use strict';

// Esperamos a que el DOM cargue
document.addEventListener('DOMContentLoaded', function () {
  // Obtenemos referencias a los elementos del formulario y a las listas de tareas
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const prioritySelect = document.getElementById('prioritySelect');
  const normalTasksList = document.getElementById('normalTasksList');
  const importantTasksList = document.getElementById('importantTasksList');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');
  const toggleAllBtn = document.getElementById('toggleAllBtn');

  // Agregamos un evento de 'submit' al formulario para agregar tareas
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTask();
  });

  // Agregamos eventos a los botones de "Limpiar completadas" y "Alternar todas"
  toggleAllBtn.addEventListener('click', toggleAllTasks);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  // Cargamos las tareas guardadas al iniciar la página
  loadTasks();

  // Función para agregar una tarea
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

  // Función para crear un elemento de tarea
  function createTaskElement(text, priority) {
    const taskItem = document.createElement('li');
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.className = 'task-checkbox'; // Agregamos una clase para manejar los checkboxes

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

    return taskItem;
  }

  // Agregar evento 'change' para los checkboxes
  document.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
      const taskItem = event.target.closest('.task-item');
      taskItem.classList.toggle('completed', event.target.checked);
      updateCompletedState();
    }
  });

  // Función para actualizar el estado de las tareas completadas
  function updateCompletedState() {
    saveTasksToStorage();
  }

  // Función para eliminar tareas completadas
  function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.completed');
    completedTasks.forEach(task => task.remove());
    saveTasksToStorage();
  }

  // Función para guardar una tarea en el almacenamiento local
  function saveTaskToStorage(text, priority) {
    let tasks = getTasksFromStorage();
    const timestamp = new Date().toISOString();
    tasks.push({ text, priority, timestamp });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Función para guardar todas las tareas en el almacenamiento local
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

  // Función para cargar tareas desde el almacenamiento local
  function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
      const taskElement = createTaskElement(task.text, task.priority);
      taskElement.setAttribute('data-timestamp', task.timestamp);

      if (task.priority === 'normal') {
        normalTasksList.appendChild(taskElement);
      } else {
        importantTasksList.appendChild(taskElement);
      }
    });
  }

  // Función para obtener las tareas del almacenamiento local
  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  // Función para alternar todas las tareas completadas
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
