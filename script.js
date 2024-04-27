document.addEventListener("DOMContentLoaded", function() {
    const addItemForm = document.getElementById("add-item-section");
    const itemNameInput = document.getElementById("item-name");
    const itemDateInput = document.getElementById("item-date");
    const itemPrioritySelect = document.getElementById("item-priority");
    const todayTasksContainer = document.getElementById("today-tasks");
    const futureTasksContainer = document.getElementById("future-tasks");
    const completedTasksContainer = document.getElementById("completed-tasks");
  
    // Load tasks from localStorage on page load
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // Function to render tasks
    function renderTasks() {
      todayTasksContainer.innerHTML = "";
      futureTasksContainer.innerHTML = "";
      completedTasksContainer.innerHTML = "";
  
      tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        if (task.completed) {
          taskCard.classList.add("completed");
        } else if (new Date(task.date) < new Date()) {
          taskCard.classList.add("high-priority");
        }
  
        taskCard.innerHTML = `
          <p>Name: ${task.name}</p>
          <p>Date: ${task.date}</p>
          <p>Priority: ${task.priority}</p>
          <button class="delete-btn" data-index="${tasks.indexOf(task)}">Delete</button>
          <button class="complete-btn" data-index="${tasks.indexOf(task)}">${task.completed ? "Undo" : "Complete"}</button>
        `;
  
        if (new Date(task.date).toDateString() === new Date().toDateString()) {
          todayTasksContainer.appendChild(taskCard);
        } else if (new Date(task.date) > new Date() || !task.completed) {
          futureTasksContainer.appendChild(taskCard);
        } else {
          completedTasksContainer.appendChild(taskCard);
        }
      });
  
      // Add event listeners for delete and complete buttons
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          const index = parseInt(btn.getAttribute("data-index"));
          tasks.splice(index, 1);
          localStorage.setItem("tasks", JSON.stringify(tasks));
          renderTasks();
        });
      });
  
      document.querySelectorAll(".complete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
          const index = parseInt(btn.getAttribute("data-index"));
          tasks[index].completed = !tasks[index].completed;
          localStorage.setItem("tasks", JSON.stringify(tasks));
          renderTasks();
        });
      });
    }
  
    // Add item form submission
    addItemForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const itemName = itemNameInput.value.trim();
      const itemDate = itemDateInput.value;
      const itemPriority = itemPrioritySelect.value;
  
      if (itemName === "" || itemDate === "") {
        alert("Please fill out all fields");
        return;
      }
  
      const newTask = {
        name: itemName,
        date: itemDate,
        priority: itemPriority,
        completed: false
      };
  
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
  
      // Clear form fields
      itemNameInput.value = "";
      itemDateInput.value = "";
      itemPrioritySelect.value = "high";
    });
  
    // Render tasks on page load
    renderTasks();
  });
  