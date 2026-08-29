/* =========================================
   SELECT ELEMENTS 
========================================= */
const addInput = document.querySelector("#add-inp"); 
const addButton = document.querySelector("#add-btn"); 
const todoDrop = document.querySelector(".todo-drop");
const completedDrop = document.querySelector(".completed-drop"); 
const emptyMessages = document.querySelectorAll(".empty-message"); 
const todoEmpty = emptyMessages[0]; 
const completedEmpty = emptyMessages[1]; 
const totalTasksCount = document.querySelector(".total-tasks-count"); 
const completedTasksCount = document.querySelector(".completed-tasks-count"); 

/* =========================================
   GLOBAL TASK 
========================================= */
// Update initial count 
function updateCount() {
    totalTasksCount.textContent = todoDrop.querySelectorAll(".dragitem").length; 
    completedTasksCount.textContent = completedDrop.querySelectorAll(".dragitem").length; 
};

// Update initial empty message 
function updateMessage() {
    if (todoDrop.querySelectorAll(".dragitem").length === 0) { 
        todoEmpty.style.display = "flex"; 
    } else { 
        todoEmpty.style.display = "none"; 
    } 
    
    if (completedDrop.querySelectorAll(".dragitem").length === 0) { 
        completedEmpty.style.display = "flex"; 
    } else { 
        completedEmpty.style.display = "none"; 
    } 
}


/* =========================================
   STORE TASK (LOCALSTORAGE)
========================================= */
let allTask = JSON.parse(localStorage.getItem("allTask")) || []; 

/* =========================================
   LOAD SAVED TASK 
========================================= */
allTask.forEach(function (taskDetails) { 
    const task = createTask(taskDetails.text); 
    
    // Reload howar por completed checked thakle completed-drop a jabe
    if (taskDetails.completed === true) {
        completedDrop.appendChild(task);
    } else {
        todoDrop.appendChild(task); 
    }
}); 

// Update initial count 
updateCount();

// Update initial empty message 
updateMessage();

/* =========================================
   ADD TASK 
========================================= */
addButton.addEventListener("click", addTask); 
addInput.addEventListener("keydown", function (event) { 
    if (event.key === "Enter") { 
        addTask(); 
    } 
}); 

function addTask() { 
    const taskText = addInput.value.trim(); 
    if (taskText === "") { 
        addInput.focus(); 
        return; 
    } 
    
    const task = createTask(taskText); 
    todoDrop.appendChild(task); 
    addInput.value = ""; 
    addInput.focus(); 
    
    // Array pushing
    allTask.push({ text: taskText, completed: false }); 
    localStorage.setItem("allTask", JSON.stringify(allTask)); 
    console.log(allTask); 
    
    // Update To Do count 
    totalTasksCount.textContent = todoDrop.querySelectorAll(".dragitem").length; 
    todoEmpty.style.display = "none"; 
} 

/* =========================================
   CREATE TASK 
========================================= */
function createTask(taskText) { 
    const task = document.createElement("div"); 
    task.className = "dragitem"; 
    task.draggable = true; 
    
    const taskTitle = document.createElement("p"); 
    taskTitle.textContent = taskText; 
    
    const deleteButton = document.createElement("button"); 
    deleteButton.className = "delete-btn"; 
    deleteButton.type = "button"; 
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; 
    
    task.appendChild(taskTitle); 
    task.appendChild(deleteButton); 

    // DELETE TASK EVENT
    deleteButton.addEventListener("click", function () { 
        task.remove(); 
        
        // Filter out the deleted task and save the remaining tasks to localStorage
        allTask = allTask.filter(function(item) {
            return item.text !== taskText;
        });
        localStorage.setItem("allTask", JSON.stringify(allTask));

        // UI Updates
        updateCount();
        updateMessage();
    }); 

    // DRAG START EVENT
    task.addEventListener("dragstart", function () { 
        task.classList.add("dragging"); 
    }); 

    // DRAG END EVENT
    task.addEventListener("dragend", function () { 
        task.classList.remove("dragging"); 
        todoDrop.classList.remove("dropColor"); 
        completedDrop.classList.remove("dropColor"); 
    }); 
    
    return task; 
} 

/* =========================================
   DROP AREAS (DRAG & DROP)
========================================= */
const dropAreas = [todoDrop, completedDrop]; 

dropAreas.forEach(function (dropArea) { 
    // DRAG OVER EVENT
    dropArea.addEventListener("dragover", function (event) { 
        event.preventDefault(); 
        dropArea.classList.add("dropColor"); 
    }); 
    
    // DRAG LEAVE EVENT
    dropArea.addEventListener("dragleave", function () { 
        dropArea.classList.remove("dropColor"); 
    }); 
    
    // DROP EVENT
    dropArea.addEventListener("drop", function (event) { 
        event.preventDefault(); 
        const draggingTask = document.querySelector(".dragging"); 
        
        // if (draggingTask) {
            dropArea.appendChild(draggingTask); 
            
            // Dragged task content checking
            const taskText = draggingTask.querySelector("p").textContent;
            
            // Drop zone targeted conditional tracking
            let isCompleted = false;
            if (dropArea.classList.contains("completed-drop")) {
                isCompleted = true;
            }

            // LocalStorage data status modifications
            allTask.forEach(function(item) {
                if (item.text === taskText) {
                    item.completed = isCompleted;
                }
            });
            localStorage.setItem("allTask", JSON.stringify(allTask));
        // }
        
        dropArea.classList.remove("dropColor"); 
        
        // UI Updates
        updateCount();
        updateMessage();
    }); 
});
