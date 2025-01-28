document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addButton");
  const todoList = document.getElementById("todoList");
  const searchInput = document.getElementById("searchInput");

  // Load tasks from localStorage when the page loads
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));

  // Add Task
  addButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
    addTask(taskText, false); // New task is not completed
    saveTaskToLocalStorage(taskText, false);
    taskInput.value = "";
  });

  // Search Functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const tasks = todoList.querySelectorAll("li");
    tasks.forEach(task => {
      const taskText = task.querySelector("span").textContent.toLowerCase();
      task.style.display = taskText.includes(query) ? "" : "none";
    });
  });

  // Add Task to List
  function addTask(taskText, isCompleted) {
    const li = document.createElement("li");

    // Circular Checkbox
    const checkbox = document.createElement("div");
    checkbox.classList.add("checkbox");
    if (isCompleted) {
      checkbox.classList.add("checked");
      li.classList.add("completed");
    }
    checkbox.addEventListener("click", () => {
      checkbox.classList.toggle("checked");
      li.classList.toggle("completed");
      updateTaskCompletionInLocalStorage(taskText, li.classList.contains("completed"));
    });
    li.appendChild(checkbox);

    // Task Text
    const span = document.createElement("span");
    span.textContent = taskText;
    li.appendChild(span);

    // Three Dots for Options
    const dots = document.createElement("span");
    dots.textContent = "⋮";
    dots.classList.add("dots");
    li.appendChild(dots);

    // Task Options (Edit & Delete)
    const taskOptions = document.createElement("div");
    taskOptions.classList.add("task-options");
    taskOptions.style.display = "none";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      if (!li.querySelector(".editInput")) {
        dots.style.display = "none";

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = span.textContent;
        editInput.classList.add("editInput");

        li.replaceChild(editInput, span);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.addEventListener("click", () => {
          const newTaskText = editInput.value.trim();
          if (newTaskText) {
            span.textContent = newTaskText;
            li.replaceChild(span, editInput);
            dots.style.display = "inline";
            updateTaskInLocalStorage(taskText, newTaskText);

            // Restore original Edit and Delete buttons
            taskOptions.innerHTML = ""; // Clear the taskOptions container
            taskOptions.appendChild(editBtn);
            taskOptions.appendChild(deleteBtn);

            taskOptions.style.display = "none";
          }
        });

        taskOptions.innerHTML = ""; // Clear the taskOptions container
        taskOptions.appendChild(saveBtn);
        taskOptions.appendChild(deleteBtn);
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      todoList.removeChild(li);
      removeTaskFromLocalStorage(taskText);
    });

    taskOptions.appendChild(editBtn);
    taskOptions.appendChild(deleteBtn);

    li.appendChild(taskOptions);

    dots.addEventListener("click", () => {
      taskOptions.style.display = "block";
      dots.style.display = "none";
    });

    todoList.appendChild(li);
  }

  // Save Task to localStorage
  function saveTaskToLocalStorage(taskText, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: isCompleted });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Remove Task from localStorage
  function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update Task Completion in localStorage
  function updateTaskCompletionInLocalStorage(taskText, isCompleted) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(task => task.text === taskText);
    if (task) {
      task.completed = isCompleted;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Update Task Text in localStorage
  function updateTaskInLocalStorage(oldTaskText, newTaskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks.find(task => task.text === oldTaskText);
    if (task) {
      task.text = newTaskText;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
});

