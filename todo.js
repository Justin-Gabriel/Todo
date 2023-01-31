let isIncomplete = false;
let isComplete = false;
let incompleteCount = 0;
let completeCount = 0;
let totalCount = 0;
let editTarget = null;
let saveButton = null;
let checkbox = null;
let taskValue = null;

let inputText = document.getElementById("input");
let inputBox = document.querySelector(".input-box");
let addButton = document.getElementById("btn1");
let inputs = document.querySelectorAll(".inputs");
let allTask = document.getElementById("all-task");
let incomplete = document.getElementById("incomplete");
let complete = document.getElementById("completed");
let completeTask = document.getElementById("completed-task");
let incompletedTask = document.getElementById("incompleted-task");
let entireTask = document.getElementById("entire-task");
let editPopup = document.querySelector(".pop-edit");
let tasks = document.querySelectorAll(".task");
let yesDelete = document.getElementById("yes-del");
let noDelete = document.getElementById("no-del");
let deletePopup = document.querySelector(".popup");
let yesEdit = document.getElementById("yes");
let noEdit = document.getElementById("no");

function onTaskTyping(event) {
  event.target.addEventListener("input", () => {
    if (event.target.value) {
      addButton.disabled = false;
      addButton.style.cursor = "pointer";
    } else {
      addButton.disabled = true;
    }
  });
}

function onAddButtonClick() {
  addButton.disabled = true;
  addButton.style.cursor = "no-drop";
  let text = document.getElementById("input");
  if (text.value) {
    text.style.outline = "";
    text.placeholder = "Create Task...";
    let taskList = JSON.parse(localStorage.getItem("localItem")) || [];
    taskList.unshift([text.value, false]);
    localStorage.setItem("localItem", JSON.stringify(taskList));
    text.blur();
  } else {
    text.style.outline = "solid red";
    text.placeholder = "Please Enter a task";
    text.focus();
  }
  if (text.value != "") {
    text.value = "";
  }
  completeTask.style.display = "none";
  incompletedTask.style.display = "none";
  entireTask.style.display = "none";
  incomplete.style.border = "none";
  complete.style.border = "none";
  showAllTask();
  loading();
  checkBox();
}

function onEnter(event) {
  if (event.key === "Enter") {
    onAddButtonClick();
  }
}

function inputBoxLeave(event) {
  let text = document.getElementById("input");
  text.style.outline = "";
  text.placeholder = "Create Task...";
}

function showAllTask() {
  let output = "";
  let block = document.querySelector(".blocks");
  let taskList = JSON.parse(localStorage.getItem("localItem"));
  taskList.forEach((element, index) => {
    output += `
            <div class="task" id="task${index}">
                <input type="checkbox" title ="Mark task as completed" class="checkbox" name="check" id="check${index}">
                <input class="inputs" title ="Double click to edit" id="${index}" maxlength="70" disabled="disabled" value="${element[0]}" >
                <button class="save" title ="Save" id="save${index}"><img src="images/saves.png" alt="" class="sav"></button>
                <button class="delete" title = "Delete" onClick="deleteItem(${index})"><img src="images/trash.svg" alt="" class="img1"></button> 
            </div>`;
  });
  block.innerHTML = output;
  allTask.style.border = "solid";
  if (taskList.length === 0) {
    entireTask.style.display = "block";
  } else {
    entireTask.style.display = "none";
  }
  showButtonValues();
}




/**
 * Returns the sum of all numbers passed to the function.
 * @param {Integer} index 
 */
function deleteItem(index) {
  
  deletePopup.style.display = "block";

  function onDeleteYes() {
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList.splice(index, 1);
    localStorage.setItem("localItem", JSON.stringify(taskList));
    deletePopup.style.display = "none";
    showAllTask();
    loading();
    showButtonValues();
    checkBox();
    if (isIncomplete == true) {
      isIncomplete = false;
  
      showIncompletedTask();
    }
    if (isComplete == true) {
      isComplete = false;
      showCompletedTask();
    }
    let tasks = document.querySelectorAll(".task");
    for (let task of tasks) {
      task.addEventListener("dblclick", editTask);
    }
    yesDelete.removeEventListener("click", onDeleteYes);
  }

  function onDeleteNo() {
    deletePopup.style.display = "none";
    noDelete.removeEventListener("click", onDeleteNo);
  }

  yesDelete.addEventListener("click", onDeleteYes);
  noDelete.addEventListener("click", onDeleteNo);
}

function showButtonValues() {
  const allTask = document.getElementById("all-task");
  const incomplete = document.getElementById("incomplete");
  const completed = document.getElementById("completed");
  incompleteCount = 0;
  completeCount = 0;
  totalCount = document.querySelectorAll(".checkbox").length;
  for (let i = 0; i < totalCount; i++) {
    if (localStorage.length > 0) {
      let checklist = JSON.parse(localStorage.getItem("localItem"));
      let checked = checklist[i][1];

      if (checked) {
        completeCount += 1;
      } else incompleteCount += 1;
    }
  }
  allTask.innerHTML = `All tasks: ${totalCount}`;
  incomplete.innerHTML = `Incomplete: ${incompleteCount}`;
  completed.innerHTML = `Completed: ${completeCount}`;
}

function setCheckBox(event) {
  let taskList = JSON.parse(localStorage.getItem("localItem"));
  let checks = document.getElementById(String(event.target.id));
  taskList[event.target.id.slice(-1)][1] = checks.checked;
  localStorage.setItem("localItem", JSON.stringify(taskList));

  loading();
  showButtonValues();
  checkBox();
  if (isIncomplete == true) {
    isIncomplete = false;

    showIncompletedTask();
  }
  if (isComplete == true) {
    isComplete = false;
    showCompletedTask();
  }
}

function checkBox() {
  let checkboxs = document.querySelectorAll(".checkbox");
  for (let check of checkboxs) {
    check.addEventListener("change", setCheckBox);
  }
}

function loading() {
  let boxes = document.querySelectorAll(".checkbox").length;
  for (let i = 0; i < boxes; i++) {
    if (localStorage.length > 0) {
      let checklist = JSON.parse(localStorage.getItem("localItem"));
      let checked = checklist[i][1];
      let elems = document.getElementById(`check${i}`);
      elems.checked = checked;
      if (elems.checked) {
        elems.parentNode.style.backgroundColor = "#CD9E9E";
        elems.nextElementSibling.style.textDecoration = "line-through";
      } else {
        elems.parentNode.style.backgroundColor = "";
        elems.nextElementSibling.style.textDecoration = "";
      }
    }
  }
  let tasks = document.querySelectorAll(".task");
  for (let task of tasks) {
    task.addEventListener("dblclick", editTask);
  }
}

function setEditedTask() {
  checkbox.disabled = false;
  saveButton.classList.remove("open");
  if (taskValue != editTarget.value) {
    let checklist = JSON.parse(localStorage.getItem("localItem"));
    let checked = checklist[editTarget.id][1];
    if (checked) {
      let taskList = JSON.parse(localStorage.getItem("localItem"));
      taskList[editTarget.id][1] = false;
      localStorage.setItem("localItem", JSON.stringify(taskList));
    }
  }
  let taskList = JSON.parse(localStorage.getItem("localItem"));
  taskList[editTarget.id][0] = editTarget.value;
  localStorage.setItem("localItem", JSON.stringify(taskList));
  editTarget.disabled = "disabled";
  editTarget.parentNode.parentNode.removeEventListener("mouseout", onLeavingTask);
  let savetoast = document.querySelector(".savetoast");
  savetoast.style.visibility = "visible";
  let time = setTimeout(() => {
    savetoast.style.visibility = "hidden";
  }, 1000);
  editTarget.blur();
  loading();
  showButtonValues();
  checkBox();
}

function yesLeavingTask() {
  if (editTarget.value) {
    checkbox.disabled = false;
    saveButton.classList.remove("open");
    if (taskValue != editTarget.value) {
      let checklist = JSON.parse(localStorage.getItem("localItem"));
      let checked = checklist[editTarget.id][1];
      if (checked) {
        let taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList[editTarget.id][1] = false;
        localStorage.setItem("localItem", JSON.stringify(taskList));
      }
    }
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList[editTarget.id][0] = editTarget.value;
    localStorage.setItem("localItem", JSON.stringify(taskList));
    editTarget.disabled = "disabled";
    editPopup.style.display = "none";
    editTarget.parentNode.parentNode.removeEventListener("mouseleave", onLeavingTask);
    let savetoast = document.querySelector(".savetoast");
    savetoast.style.visibility = "visible";
    let time = setTimeout(() => {
      savetoast.style.visibility = "hidden";
    }, 1000);
    yesEdit.removeEventListener("click", yesLeavingTask);
    editTarget.blur();
    loading();
    showButtonValues();
    checkBox();

    if (isIncomplete == true) {
      isIncomplete = false;

      showIncompletedTask();
    }
    if (isComplete == true) {
      isComplete = false;
      showCompletedTask();
    }
  } else {
    editPopup.style.display = "none";
    let savetoast = document.querySelector(".warningtoast");
    savetoast.style.visibility = "visible";
    let time = setTimeout(() => {
      savetoast.style.visibility = "hidden";
    }, 1000);
    editTarget.focus();
    modifyTask();
  }
}

function notLeavingTask() {
  let taskList = JSON.parse(localStorage.getItem("localItem"));

  editTarget.value = taskList[editTarget.id][0];
  editPopup.style.display = "none";
  editTarget.disabled = "disabled";
  saveButton.classList.remove("open");
  checkbox.disabled = false;
  editTarget.parentNode.parentNode.removeEventListener("mouseleave", onLeavingTask);
  noEdit.removeEventListener("click", notLeavingTask);
  loading();
}

function onLeavingTask() {
  let taskList = JSON.parse(localStorage.getItem("localItem"));

  if (editTarget.value != taskList[editTarget.id][0]) {
    editPopup.style.display = "block";
    document.getElementById("h3-edit").innerHTML = editTarget.value;
    yesEdit.addEventListener("click", yesLeavingTask);
    noEdit.addEventListener("click", notLeavingTask);
  } else {
    editTarget.disabled = "disabled";
    saveButton.classList.remove("open");
    checkbox.disabled = false;
    loading();
  }
  editTarget.parentNode.removeEventListener("mouseleave", onLeavingTask);
}

function modifyTask() {
  
  if (editTarget.className === "inputs") {
    let indexs = editTarget.parentNode.id.slice(-1);
    checkbox = document.getElementById(`check${indexs}`);
    checkbox.disabled = true;
    editTarget.disabled = "";
    editTarget.focus();
    taskValue = editTarget.value;
    editTarget.value = "";
    editTarget.value = taskValue;

    saveButton = document.getElementById(`save${indexs}`);
    saveButton.classList.add("open");
    saveButton.addEventListener("click", onClickSaveButton);

    function onClickSaveButton() {
      if (editTarget.value) {
        setEditedTask();
      } else {
        let savetoast = document.querySelector(".warningtoast");
        savetoast.style.visibility = "visible";
        let time = setTimeout(() => {
          savetoast.style.visibility = "hidden";
        }, 1000);
        editTarget.focus();
        modifyTask();
      }
      saveButton.removeEventListener("click", onClickSaveButton);
      editTarget.parentNode.removeEventListener("mouseleave", onLeavingTask);
    }

    editTarget.parentNode.addEventListener("mouseleave", onLeavingTask);

    editTarget.parentNode.removeEventListener("dblclick", editTask);
  }
}

function editTask(event) {
  event.preventDefault();
  editTarget = event.target;
  modifyTask();
}

function showEntireTasks() {
  isIncomplete = false;
  isComplete = false;
  completeTask.style.display = "none";
  incompletedTask.style.display = "none";
  incomplete.style.border = "none";
  complete.style.border = "none";
  allTask.style.border = "solid";
  let tasks = document.querySelectorAll(".task");
  for (let task of tasks) {
    task.style.display = "block";
  }
  if (totalCount === 0) {
    entireTask.style.display = "block";
  }
}

function showIncompletedTask() {
  isIncomplete = true;
  isComplete = false;
  completeTask.style.display = "none";
  entireTask.style.display = "none";
  incomplete.style.border = "solid";
  allTask.style.border = "none";
  complete.style.border = "none";
  let tasks = document.querySelectorAll(".task");
  for (let i = 0; i < tasks.length; i++) {
    let checklist = JSON.parse(localStorage.getItem("localItem"));
    let checked = checklist[i][1];

    if (checked) {
      tasks[i].style.display = "none";
    } else tasks[i].style.display = "block";
  }
  if (incompleteCount === 0) {
    incompletedTask.style.display = "block";
  }
}

function showCompletedTask() {
  isComplete = true;
  isIncomplete = false;
  incompletedTask.style.display = "none";
  entireTask.style.display = "none";
  complete.style.border = "solid";
  incomplete.style.border = "none";
  allTask.style.border = "none";
  let tasks = document.querySelectorAll(".task");
  for (let i = 0; i < tasks.length; i++) {
    let checklist = JSON.parse(localStorage.getItem("localItem"));
    let checked = checklist[i][1];

    if (checked) {
      tasks[i].style.display = "block";
    } else tasks[i].style.display = "none";
  }
  if (completeCount === 0) {
    completeTask.style.display = "block";
  }
}

for (let task of tasks) {
  task.addEventListener("dblclick", editTask);
}

addButton.addEventListener("click", onAddButtonClick);
inputText.addEventListener("keypress", onEnter);
inputText.addEventListener("click", onTaskTyping);
inputBox.addEventListener("mouseleave", inputBoxLeave);
complete.addEventListener("click", showCompletedTask);
incomplete.addEventListener("click", showIncompletedTask);
allTask.addEventListener("click", showEntireTasks);

showAllTask();
showButtonValues();
checkBox();
loading();
