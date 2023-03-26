const taskList = [];
const taskList2 = document.getElementById("task-list");
let startX;
let timer;
let startY;

function createLi(task) {
  const taskItem = document.createElement("li");
  taskItem.id = task.id;
  taskItem.textContent = task.title;
  taskList2.appendChild(taskItem);
  taskItem.style.backgroundColor = task.done ? "green" : "red"; //ternary operator for color based on task.done value
  taskItem.addEventListener('touchstart', function(e) {
  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
  timer = setTimeout(function() {
  toggleDone(e);
  }, 2000);
  });
  taskItem.addEventListener('touchmove', function(e) {
  clearTimeout(timer);
  });
  taskItem.addEventListener('touchend', function(e) {
  let endX = e.changedTouches[0].pageX;
  let endY = e.changedTouches[0].pageY;
  let distance = endX - startX;
  let absDistanceX = Math.abs(distance);
  let absDistanceY = Math.abs(endY - startY);
  if (endX > startX && distance >= 50 && absDistanceY < 10) {
  remove();
  }
  clearTimeout(timer);
  });
}

async function loadTasks() {
  const response = await fetch("/tasks/get");
  const tasks = await response.json(); // better naming for the variable
  tasks.forEach(task => {
  taskList.push(task);
  createLi(task);
  });
  Swal.fire({ //alert refactor for more reusability
  icon: 'success',
  title: 'Tareas añadidas',
  showConfirmButton: false,
  timer: 2000
  }).then(() => {
  navigator.vibrate(300); //navigator.vibrate inside then() to ensure the alert is closed
  });
}

function add() {
  const input = document.getElementById("task-name");
  const title = input.value.trim();
  if (title.length > 0) {
    const id = taskList.reduce((max, t) => t.id > max ? t.id : max, -1) + 1; //using reduce to get the max id and avoiding for loop
    const task = { id, title, done: false };
    taskList.push(task);
    updateJson();
    input.value = '';
    createLi(task);
    Swal.fire({
    icon: 'success',
    title: 'Tarea añadida',
    showConfirmButton: false,
    timer: 2000
    }).then(() => {
    navigator.vibrate(300);
    });
  }
}

function remove() {
  const taskItem = event.target;
  const taskId = taskItem.id;
  const index = taskList.findIndex(task => task.id == taskId); //using findIndex to get the index of the task to remove
  if (index !== -1) {
    taskList.splice(index, 1);
    updateJson();
    taskItem.parentNode.removeChild(taskItem);
    Swal.fire({
    icon: 'warning',
    title: 'Tarea eliminada',
    showConfirmButton: false,
    timer: 2000,
    }).then(() => {
    navigator.vibrate(300);
    });
  }
}

const toggleDone = (event) => {
  const taskItem = event.target.closest('li');
  if (!taskItem) return;

  const taskId = taskItem.id;
  const task = taskList.find(t => t.id === taskId);
  if (!task) return;

  task.done = !task.done;
  updateJson();

  const successIcon = task.done ? 'success' : 'warning';
  const successMessage = task.done ? 'Tarea completada' : 'Tarea reactivada';

  taskItem.style.backgroundColor = task.done ? 'green' : 'red';
  Swal.fire({
    icon: successIcon,
    title: successMessage,
    showConfirmButton: false,
    timer: 2000,
  });
  navigator.vibrate(300);
};

//Funcion para actualizar el fichero json
const updateJson = async () => {
  const respuesta = await fetch("/tasklist/update", {
    method: "POST",
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
    },
    body: JSON.stringify(taskList)
  });
  const mensaje = await respuesta.text();
  console.log(mensaje);
}

const addButton = document.querySelector("#fab-add");
loadTasks(); //Mostrar tareas
addButton.addEventListener("click", add); //Añadir tarea