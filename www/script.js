/* Este es un código de JavaScript que utiliza Fetch API y manipula el DOM para crear una lista de tareas en una página web.*/
const taskList = [];

const taskListElem = document.querySelector("#tasklist");

/* Primero, se crea un array vacío llamado taskList, y se selecciona un elemento HTML con el ID "tasklist" utilizando querySelector. Esto se hace para poder agregar y eliminar elementos de la lista de tareas.

Luego se define una función asíncrona llamada loadTasks. Esta función utiliza la función fetch para obtener datos desde la URL "/tasks/get", y luego utiliza el método json para convertir la respuesta en un objeto JSON. A continuación, se recorre cada elemento del objeto JSON utilizando el método forEach, y se crea un elemento HTML <li> con el título de la tarea y se agrega a la lista de tareas con appendChild. Esta función también maneja cualquier error que pueda ocurrir al obtener los datos utilizando un bloque try/catch.

Después se llama la función loadTasks para cargar la lista de tareas desde el servidor. 
*/

const loadTasks = async () => {
  try {
    const response = await fetch("/tasks/get");
    const data = await response.json();
    console.log(data);
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = item.title;
      taskListElem.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
};

loadTasks();

/* Hay una función asíncrona llamada updateTasksOnServer. 
Esta función utiliza fetch para enviar una solicitud POST a la URL "/tasklist/update"
 con el array taskList convertido a formato JSON en el cuerpo de la solicitud. 
 También se especifica que el tipo de contenido es JSON en los encabezados. La respuesta
  del servidor también se convierte a un objeto JSON utilizando json, y se imprime 
  en la consola con console.log. Al igual que loadTasks, esta función también maneja 
  cualquier error que pueda ocurrir utilizando try/catch. 
*/
const updateTasksOnServer = async () => {
  try {
    const response = await fetch("/tasklist/update", {
      method: "POST",
      body: JSON.stringify(taskList),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

/* Hay una función asíncrona llamada add. Esta función se llama cuando se hace clic en el botón "Agregar" (identificado por el elemento HTML con el ID "fab-add").
 Primero, se selecciona el elemento de entrada de texto para obtener el valor del nombre 
 de la tarea. Si el valor no está vacío, se crea un nuevo objeto de tarea con un ID único, 
 el título de la tarea y el valor booleano "hecho" establecido en falso. Este objeto se 
 agrega al array taskList, y se crea un elemento HTML <li> con el título de la tarea y se 
 agrega a la lista de tareas con appendChild. Luego se borra el valor del campo de entrada 
 de texto y se llama a la función updateTasksOnServer. */
const add = async () => {
  const taskNameInput = document.querySelector("#task-name");
  const taskName = taskNameInput.value.trim();
  if (taskName !== "") {
    const newTask = {
      id: taskList.length + 1,
      title: taskName,
      done: false
    };
    taskList.push(newTask);
    const li = document.createElement("li");
    li.innerHTML = newTask.title;
    li.dataset.id = newTask.id;
    taskListElem.appendChild(li);
    taskNameInput.value = "";
    await updateTasksOnServer();
  }
};

/*Remove se llama cuando se desliza un elemento de la lista de tareas hacia la derecha. 
La función busca el índice del elemento en el array taskList, y si lo encuentra, elimina 
ese elemento del array utilizando el método splice. También elimina el elemento correspondiente 
del DOM utilizando remove, y llama a updateTasksOnServer para actualizar los datos en el servidor.*/
const remove = async id => {
  const taskIndex = taskList.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    taskList.splice(taskIndex, 1);
    const taskElem = document.querySelector(`li[data-id="${id}"]`);
    taskElem.remove();
    await updateTasksOnServer();
  }
};

/*toggleDone se llama cuando se toca un elemento de la lista de tareas durante un cierto tiempo.
 La función busca el índice del elemento en el array taskList, y si lo encuentra, cambia el valor 
 de la propiedad "hecho" del objeto tarea utilizando el operador de negación. 
También cambia la clase CSS del elemento correspondiente para mostrar si está hecho o no, y llama 
a updateTasksOnServer para actualizar los datos en el servidor.*/
const toggleDone = async id => {
  const taskIndex = taskList.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    taskList[taskIndex].done = !taskList[taskIndex].done;
    const taskElem = document.querySelector(`li[data-id="${id}"]`);
    taskElem.classList.toggle("done");
    await updateTasksOnServer();
  }
};

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);

taskListElem.addEventListener("touchstart", event => {
  const touch = event.touches[0];
  const taskElem = touch.target.closest("li");
  if (taskElem) {
    const taskId = parseInt(taskElem.dataset.id);
    taskElem.dataset.startX = touch.clientX;
    taskElem.dataset.startY = touch.clientY;
    taskElem.dataset.startTime = Date.now();
    taskElem.dataset.touched = true;
    setTimeout(() => {
      if (taskElem.dataset.touched === "true") {
        toggleDone(taskId);
      }
    }, 2000);
  }
});

taskListElem.addEventListener("touchmove", event => {
  const touch = event.touches[0];
  const taskElem = touch.target.closest("li");
  if (taskElem && taskElem.dataset.touched === "true") {
    const deltaX = touch.clientX - taskElem.dataset.startX;
    const deltaY = touch.clientY - taskElem.dataset.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    if (absDeltaX > 10 && absDeltaX > absDeltaY) {
      taskElem.dataset.touched = false;
      if (deltaX > 0) {
        remove(parseInt(taskElem.dataset.id));
      }
    }
  }
});

taskListElem.addEventListener("touchend", event => {
  const touch = event.changedTouches[0];
  const taskElem = touch.target.closest("li");
  if (taskElem) {
    taskElem.dataset.touched = false;
  }
});
