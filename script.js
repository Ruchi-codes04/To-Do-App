document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
        updateTasksList();
        updateStats();
    }
});

let tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById("taskInput");
    taskInput.value = tasks[index].text;

    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    
    // Ensure progress calculation is correct
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;

    // Confetti triggers only when all tasks are completed
    if (totalTasks > 0 && completedTasks === totalTasks) {
        blastConfetti();
    }
};



const updateTasksList = () => {
    const taskList = document.querySelector('.task-list'); // Using querySelector to select by class
    taskList.innerHTML = ""; // Clear the task list before updating

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
                <p>${task.text}</p>
            </div>
            <div class="icons">
                 <img src="Images/icons8-edit-64.png" class="edit-icon" alt="" />
                 <img src="Images/icons8-delete-30.png" class="delete-icon" alt="" />
                
            </div>
        </div>
        `;

        // Add event listeners for toggle, edit, and delete actions
        listItem.querySelector(".checkbox").addEventListener("change", () => toggleTaskComplete(index));
        listItem.querySelector('.edit-icon').addEventListener('click', () => editTask(index));
        listItem.querySelector('.delete-icon').addEventListener('click', () => deleteTask(index));

        taskList.append(listItem);
    });
};


document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

const blastConfetti = () => {
    const count = 200,
        defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
