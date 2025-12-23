let taskData = {}
let taskToDelete = null;
let taskToEdit = null;


const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress")
const done = document.querySelector("#done");
const columns = [todo,progress,done];
let dragElement = null;
const saveButton = document.querySelector("#save");
const editModal = document.querySelector(".edit-task-modal");
 saveButton.addEventListener("click",()=>{
        if (!taskToEdit) return;

        const newTitle = document.querySelector("#edit-title").value.trim();
        const newDesc  = document.querySelector("#edit-desc").value.trim();

        taskToEdit.querySelector("h2").innerText = newTitle;
        taskToEdit.querySelector("p").innerText  = newDesc;
         const tasksData = JSON.parse(localStorage.getItem("tasks"));

     
         const columnId = taskToEdit.parentElement.id;
         const tasksArray = tasksData[columnId];
         const index = Array.from(taskToEdit.parentElement.children).indexOf(taskToEdit);
         tasksArray[index] = { title: newTitle, desc: newDesc };
         localStorage.setItem("tasks", JSON.stringify(tasksData));
         taskToEdit = null;
        editModal.classList.remove("active");


    })


function addTask(title,des,column){
    const div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable","true")

    div.innerHTML =`<h2>${title}</h2><p>${des}</p><div class="btns"><button class="edit-btn" style="background-color:blue">Edit</button><button class="delete-btn">Delete</button></div>`
    column.appendChild(div)

    div.addEventListener("drag",(e) =>{
        dragElement = div;
    })

    const deleteButton = div.querySelector(".delete-btn");
    const modal = document.querySelector(".delete-modal")
    const canclTask = document.querySelector("#cancle-task");
    const deleteTask = document.querySelector("#delete-task");

    deleteButton.addEventListener("click",()=>{
        taskToDelete = div;
       modal.classList.add("active");
    })

    canclTask.addEventListener("click",()=>{
        taskToDelete=null
        modal.classList.remove("active");
    })

    deleteTask.addEventListener("click",()=>{
        if (!taskToDelete) return;
        taskToDelete.remove()
        updateTaskCount();
        taskToDelete=null;
        modal.classList.remove("active")
        
    })



    const editButton = div.querySelector(".edit-btn");
    
    

   editButton.addEventListener("click",()=>{
    taskToEdit = div;
    editModal.classList.add("active");

    document.querySelector("#edit-title").value = taskToEdit.querySelector("h2").innerText;
    document.querySelector("#edit-desc").value  = taskToEdit.querySelector("p").innerText;
   })
    
   
    return div;
}
 
function updateTaskCount(){
         columns.forEach(col =>{
            const tasks = col.querySelectorAll(".task");
            const count = col.querySelector(".right");

            taskData[col.id ] = Array.from(tasks).map(t =>{
                return{
                title:t.querySelector("h2").innerText,
                des:t.querySelector("p").innerText
                }
            })

            localStorage.setItem("tasks",JSON.stringify(taskData));

            count.innerText = tasks.length;
         })
}


if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task =>{
             addTask(task.title,task.des,column);
        })
    }
      updateTaskCount();
    
}


 

function addDragEventsOnColumn(column){
    column.addEventListener("dragenter",(e) =>{
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave",(e) =>{
        e.preventDefault();
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover",(e) =>{
        e.preventDefault();

    })

    column.addEventListener("drop",(e) =>{
        e.preventDefault();

         column.appendChild(dragElement);
         column.classList.remove("hover-over");

        updateTaskCount();

})
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// modal related logic
const toggleModalButton = document.querySelector("#toggle-modal")
const modalBg = document.querySelector(".modal .bg")
const modal = document.querySelector(".modal")
const addTaskButton = document.querySelector("#add-new-task")

toggleModalButton.addEventListener("click", () =>{
   modal.classList.toggle("active")
})

modalBg.addEventListener("click", ()=>{
    modal.classList.remove("active")
})

addTaskButton.addEventListener("click",()=>{
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDes = document.querySelector("#task-des-input").value;

    addTask(taskTitle,taskDes,todo);
    updateTaskCount();
    modal.classList.remove("active")

    document.querySelector("#task-title-input").value="";
    document.querySelector("#task-des-input").value="";

    
})