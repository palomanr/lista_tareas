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

const add = () => {
    const input = document.getElementById('new-task');
    const title = input.value.trim();
  
    if (title !== '') {
      const newList = {
        id: taskList.length + 1,
        title,
        done: false
      };
  
      taskList.push(newList);
      input.value = '';
      renderTodos();
    }
}

add();



const remove = () => {
    tasks = taskList.filter(task => task.id !== id);
    renderTodos();
}

remove();

const toggleDone = () => {
    tasks = tasks.map(task  => {
        if (task.id === id) {
          return {
            ...task ,
            done: !task.done
          };
        } else {
          return task;
        }
      });
      renderTodos();
}

toggleDone();

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);



function renderTodos() {
  const list = document.getElementById('todos');
  list.innerHTML = '';

  todos.forEach(task  => {
    const li = document.createElement('li');
    li.textContent = task.title;

    if (task.done) {
      li.classList.add('done');
    }

    li.addEventListener('click', () => toggleDone(todo.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => remove(todo.id));

    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}







