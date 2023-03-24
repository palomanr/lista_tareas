/*Contendrá el código JavaScript con las funciones a implementar para proporcionar las funcionalidades deseadas. */
const taskList = [];

const taskListElem = document.querySelector("#tasklist");

const loadTasks = async () => {
  try {
    const response = await fetch("/tasks/get");
    const data = await response.json();
    console.log(data);
    data.forEach( item => {
      const li = document.createElement("li");
      li.innerHTML = item.title;
      taskListElem.appendChild(li);
    });
  } catch (err) {
    console.log(err);
  }
  
}

loadTasks();

const add = () => {}

const remove = () => {}

const toggleDone = () => {}

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);





