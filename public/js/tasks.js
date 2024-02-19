const initTasks = () => {
    const tasks = localStorage.getItem("tasks");
    if(tasks) {
        outputTasks();
    }else {
        let newArray = [];
        localStorage.setItem("tasks", JSON.stringify(newArray));
    }
}

//check unique ID
const checkID = (id) => {
    let newID = id;
    var tasks = fetchTasks();
    if(tasks && tasks.length > 0) {
        tasks.forEach(task => {
            if(task.id === id) {
                newID = Math.trunc(Math.random() * 100);
            }
        });
    }
    return newID;
}

const fetchTasks = () => {
    const tasks = Array.from(JSON.parse(localStorage.getItem('tasks')));
    if(tasks.length === 0) return [];
    return tasks;
}

const outputTasks = () => {
    const tasks = fetchTasks();
    if(tasks.length) {
        let taskBody = document.getElementById("task-body");
        let count = 1;
        tasks.forEach(task => {
            let newTask = `<tr class="todo-list ptl--hover draggable" draggable="true">
            <td>
                <div class="checkbox-group d-flex">
                    <div class="checkbox-theme-default custom-checkbox checkbox-group__single d-flex">
                        <input class="checkbox todocheckbox" type="checkbox" data-todo-id="${task.id}" id="check-grp-td${count}" ${task.isCompleted? "checked":""}>
                        <label for="check-grp-td${count}" class="fs-14 color-primary ${task.isCompleted? "strikethrough":""}">
                            ${task.description}
                        </label>
                    </div>
                </div>
            </td>
            <td>
                <div class="todo-list__right">
                    <ul class="d-flex align-content-center justify-content-end">
                        <li>
                            <a href="#"><i class="fa fa-arrows-alt" aria-hidden="true"></i></a>
                        </li>                
                        <li>
                            <i class="fa fa-trash-alt todo-del" aria-hidden="true" data-task-id="${task.id}"></i>
                         </li>
                    </ul>
                </div>
            </td>
        </tr>`;
            taskBody.insertAdjacentHTML('beforeend', newTask);
            count++;
        });
    }
}

//clear tasks
const clearTasks = () => {
    let taskBody = document.getElementById("task-body");
    taskBody.innerHTML = '';
}

//add task
const addTask = (e) => {
    e.preventDefault();
    var tasks = fetchTasks();
    const taskDescription = document.getElementById("new-task-desc").value;
    let task = {
        id: checkID(Math.trunc(Math.random() * 100)),
        isCompleted: false,
        description: taskDescription
    }
    if(Number(taskDescription) !== 0) {
        tasks.push(task);
        location.reload();
    }else {
        alert("You haven't added a task yet.")
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    outputTasks();
}


//edit task status
const toggleCheckTask = (e) => {
    e.preventDefault();
    const id = Number(e.target.dataset.todoId);
    var tasks = fetchTasks();
    if(tasks.length) {
        tasks.forEach(task => {
            if(task.id === id) {
                task.isCompleted? task.isCompleted = false : task.isCompleted = true;
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    clearTasks();
    outputTasks();
}



//delete task
const deleteTask = (e) => {
    e.preventDefault();
    const id = Number(e.target.dataset.taskId);
    var tasks = fetchTasks();
    if(tasks.length) {
        tasks.forEach(task => {
            if(task.id === id) {
                tasks = tasks.filter((el) => el !== task); 
            }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    location.reload();
}


//initialise
document.addEventListener("DOMContentLoaded", function() {
    initTasks();
    const todoChecks = Array.from(document.querySelectorAll(".todocheckbox"));
    todoChecks.forEach(checker => checker.addEventListener('click', toggleCheckTask));
    const deleteBtns = Array.from(document.querySelectorAll(".todo-del"));
    deleteBtns.forEach(del => del.addEventListener('click', deleteTask));
});
document.getElementById("add-task").addEventListener('click', addTask);


