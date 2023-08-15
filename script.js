const form = document.querySelector('.form');
const taskInput = document.querySelector('.task-input');
const tasksList = document.querySelector('.tasks-list');
const emptyList = document.querySelector('.empty-list');
const addDate = document.querySelector('.add-date');
let starType="";

let myDayTasks = [];
if(localStorage.getItem('myDayTasks')){
  myDayTasks=JSON.parse(localStorage.getItem('myDayTasks'));
}

myDayTasks.forEach(function(task){
  const cssClass = task.done ? "completed" : "";
  const cssClassImportant=task.important?"bxs-star": "bx-star";
  const now=new Date();
  const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const taskDate=new Date(task.date);
  const dateColor=today>taskDate?"text-danger":"text-muted";
    checkEmpty();
    const taskHTML = `<ul id="${task.id}" class="list-group list-group-horizontal rounded-0 bg-transparent d-flex justify-content-center">
  <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
    <div class="form-check" style="transform:translate(0px,-5px);">
      <button class="important" style="background:none;border:none; transform:translate(0px,8px);outline:none;"><i class="bx ${cssClassImportant} text-align-center" type="solid" style="font-size:25px;  color:gray;" data-action="important"></i></button>
    </div>
  </li>

  <li class="list-group-item px-5 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
    <p class="task-text lead fw-normal mb-0 ${cssClass}" >${task.text}</p>
  </li>
  <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
    <div class="d-flex flex-row justify-content-end mb-1">
        <a href="#!" class="${dateColor}" data-mdb-toggle="tooltip" title="Created date">
          <p class="mb-0"><i class="fas fa-info-circle me-2"></i>${task.date}</p>
        </a>
        <button class="button-delete btn-danger" style="border-radius:4px; margin-left:5px; transform:translate(0px,-3px);"  data-action="delete">Delete</button>
        <button class="button-delete btn-success" style="border-radius:4px; margin-left:5px; transform:translate(0px,-3px);"  data-action="complete">Completed</button>
    </div>
    
  </li>
  </ul>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML); 
})

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', removeTask);
tasksList.addEventListener('click', completed);
tasksList.addEventListener('click',important)

function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;
  const dateText = addDate.value;

  const newTasks = {
    id: Date.now(),
    text: taskText,
    done: false,
    important: false,
    date:dateText
  }

  
const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const taskDate=new Date(newTasks.date);
const dateColor=taskDate<today?"text-danger":"text-muted"

  myDayTasks.push(newTasks);
    const cssClass = newTasks.done ? "completed" : "";
    const taskHTML = `<ul id="${newTasks.id}" class="list-group list-group-horizontal rounded-0 bg-transparent d-flex justify-content-center">
  <li class="list-group-item d-flex align-items-center ps-0 pe-3 py-1 rounded-0 border-0 bg-transparent">
    <div class="form-check" style="transform:translate(0px,-5px);">
      <button class="important" style="background:none;border:none; transform:translate(0px,8px);outline:none;"><i class="bx bx-star text-align-center" type="solid" style="font-size:25px;  color:gray;" data-action="important"></i></button>
    </div>
  </li>

  <li class="list-group-item px-5 py-1 d-flex align-items-center flex-grow-1 border-0 bg-transparent">
    <p class="task-text lead fw-normal mb-0 ${cssClass}" >${newTasks.text}</p>
  </li>
  <li class="list-group-item ps-3 pe-0 py-1 rounded-0 border-0 bg-transparent">
    <div class="d-flex flex-row justify-content-end mb-1">
        <a href="#!" class="${dateColor}" data-mdb-toggle="tooltip" title="Created date">
          <p class="mb-0"><i class="fas fa-info-circle me-2"></i>${newTasks.date}</p>
        </a>
        <button class="button-delete btn-danger" style="border-radius:4px; margin-left:5px; transform:translate(0px,-3px);"  data-action="delete">Delete</button>
        <button class="button-delete btn-success" style="border-radius:4px; margin-left:5px; transform:translate(0px,-3px);"  data-action="complete">Completed</button>
    </div>
    
  </li>
  </ul>`;

    tasksList.insertAdjacentHTML('beforeend', taskHTML);
    taskInput.value = "";
    taskInput.focus();
    saveToLS();
    if (tasksList.children.length != 1) {
      emptyList.classList.add('none');
    }
  
}

function removeTask(event) {
  if (event.target.dataset.action === "delete") {
    const parentNode = event.target.closest('.list-group');
    parentNodeId = parentNode.id;

    const index = myDayTasks.findIndex((task) => {
      if (task.id == parentNodeId) {
        return true;
      }
    })
    myDayTasks.splice(index, 1);

    parentNode.remove();
  }
  if (tasksList.children.length === 1) {
    emptyList.classList.remove('none');
  }
  saveToLS();
}

function completed(event) {
  if (event.target.dataset.action === 'complete') {
    const parentNode = event.target.closest('.list-group');
    const parentNodeId = parentNode.id;

    const taskTitle=parentNode.querySelector('.task-text');
    taskTitle.classList.toggle('completed');
    const task = myDayTasks.find((task) => {
      if (task.id == parentNodeId) {
        return true;
      }
    })
    task.done = !task.done;
     saveToLS();
  }
 
}
function important(event) {
 if(event.target.dataset.action==='important'){
   const parentNode=event.target.closest('.list-group');
   const parentNodeId=parentNode.id;
   const boxIcon=parentNode.querySelector('.bx-star');
   boxIcon.classList.toggle("bxs-star");
   const taskImportant=parentNode.querySelector('.important');
   const task=myDayTasks.find((task)=>{
    if(task.id==parentNodeId){
      return true;
    }
   })
   task.important=!task.important;
   console.log(task);
 }
 saveToLS();
}
function saveToLS(){
  localStorage.setItem('myDayTasks',JSON.stringify(myDayTasks));
}
function checkEmpty(){
    emptyList.classList.add('none');
}