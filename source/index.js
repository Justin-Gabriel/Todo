let isIncomplete = false;
let isComplete = false;
let incompleteCount = 0;
let completeCount = 0;
let totalCount = 0;
let editTarget = null;
let saveButton = null;
let checkbox = null;
let taskValue = null;

const inputText = document.getElementById("input");
const inputBox = document.querySelector(".input-box");
const addButton = document.getElementById("btn1");
const inputs = document.querySelectorAll(".inputs");
const allTask = document.getElementById("all-task");
const incomplete = document.getElementById("incomplete");
const complete = document.getElementById("completed");
const completeTask = document.getElementById("completed-task");
const incompletedTask = document.getElementById("incompleted-task");
const entireTask = document.getElementById("entire-task");
const editPopup = document.querySelector(".pop-edit");
const tasks = document.querySelectorAll(".task");
const yesDelete = document.getElementById("yes-del");
const noDelete = document.getElementById("no-del");
const deletePopup = document.querySelector(".popup");
const yesEdit = document.getElementById("yes");
const noEdit = document.getElementById("no");


/**
 *  Function that is called when typing the task in the inputfield , which enables or disables the addButton
 * @param {Event} event 
 * @returns {void}
 */
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

/**
 *  Function that is called when clicking the add button 
 * It set the value to local storage
 */
function onAddButtonClick() {
  addButton.disabled = true;
  addButton.style.cursor = "no-drop";
  if (inputText.value) {
    const taskList = JSON.parse(localStorage.getItem("localItem")) || [];
    inputText.style.outline = "";
    inputText.placeholder = "Create Task...";
    taskList.unshift([inputText.value, false]);
    localStorage.setItem("localItem", JSON.stringify(taskList));
    inputText.blur();
  } else {
    inputText.style.outline = "solid red";
    inputText.placeholder = "Please Enter a task";
    inputText.focus();
  }
  if (inputText.value != "") {
    inputText.value = "";
  }
  completeTask.style.display = "none";
  incompletedTask.style.display = "none";
  entireTask.style.display = "none";
  incomplete.style.border = "none";
  complete.style.border = "none";
  showAllTask();
  textDecorate();
  checkBox();
}


/**
 * A function that is called when the Enter key is pressed  
 * @param {Object} event - The event object that is triggered by the key press
 * @returns {Void}
 */
function onEnter(event) {
  if (event.key === "Enter") {
    onAddButtonClick();
  }
}


/**
 * A function that is called when the cursor moves out of the input box
 * @param {Object} event - The event object that is triggered by the mouse leave
 * @returns {void}
 */
function inputBoxLeave(event) {
  inputText.style.outline = "";
  inputText.placeholder = "Create Task...";
}


/**
 * Shows all the added task 
 */
function showAllTask() {
  let output = "";
  const block = document.querySelector(".blocks");
  const taskList = JSON.parse(localStorage.getItem("localItem"));
  taskList.forEach((element, index) => {
    output += `
            <div class="task" id="task${index}">
                <input type="checkbox" title ="Mark task as completed" class="checkbox" name="check" id="check${index}">
                <input class="inputs" title ="Double click to edit" id="${index}" maxlength="70" disabled="disabled" value="${element[0]}" >
                <button class="save" title ="Save" id="save${index}"><img src="images/saves.png" alt="Save Button" class="save-img"></button>
                <button class="delete" title = "Delete" onClick="deleteTask(${index})"><img src="images/trash.svg" alt="Delete Button" class="delete-img"></button> 
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
 * A  function that is called when we press the delete button 
 * @param {Integer} index 
 * @returns {void}
 */
function deleteTask(index) {
  
  deletePopup.style.display = "block";

  /**
   * Function that is called when we click "yes" button in the delete popup
   * It deletes the task
   */
  function onDeleteYes() {
    const taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList.splice(index, 1);
    localStorage.setItem("localItem", JSON.stringify(taskList));
    deletePopup.style.display = "none";
    showAllTask();
    textDecorate();
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
    const tasks = document.querySelectorAll(".task");
    for (let task of tasks) {
      task.addEventListener("dblclick", editTask);
    }
    yesDelete.removeEventListener("click", onDeleteYes);
  }
 
  /**
   * A function that is called when we click "no" button in the delete popup
   */
  function onDeleteNo() {
    deletePopup.style.display = "none";
    noDelete.removeEventListener("click", onDeleteNo);
  }

  yesDelete.addEventListener("click", onDeleteYes);
  noDelete.addEventListener("click", onDeleteNo);
}

/**
 * Shows the count of all task, incomplete task, complete task
 */
function showButtonValues() {
  incompleteCount = 0;
  completeCount = 0;
  totalCount = document.querySelectorAll(".checkbox").length;
  for (let i = 0; i < totalCount; i++) {
    if (localStorage.length > 0) {
      const checklist = JSON.parse(localStorage.getItem("localItem"));
      const checked = checklist[i][1];

      if (checked) {
        completeCount += 1;
      } else incompleteCount += 1;
    }
  }
  allTask.innerHTML = `All tasks: ${totalCount}`;
  incomplete.innerHTML = `Incomplete: ${incompleteCount}`;
  complete.innerHTML = `Completed: ${completeCount}`;
}


/**
 * A function that is called when clicking the checkbox
 * @param {Object} event - The event object is triggered when clicking checkbox
 * @returns {void}
 */
function setCheckBox(event) {
  const taskList = JSON.parse(localStorage.getItem("localItem"));
  const checks = document.getElementById(String(event.target.id));
  taskList[event.target.id.slice(-1)][1] = checks.checked;
  localStorage.setItem("localItem", JSON.stringify(taskList));

  textDecorate();
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

/**
 *  sets change event listener for each checkbox
 */
function checkBox() {
  const checkboxs = document.querySelectorAll(".checkbox");
  for (let check of checkboxs) {
    check.addEventListener("change", setCheckBox);
  }
}

/**
 * Decorate  text of each task based on its checked status
 */
function textDecorate() {
  const boxes = document.querySelectorAll(".checkbox").length;
  const tasks = document.querySelectorAll(".task");
  for (let i = 0; i < boxes; i++) {
    if (localStorage.length > 0) {
      const checklist = JSON.parse(localStorage.getItem("localItem"));
      const checked = checklist[i][1];
      const elems = document.getElementById(`check${i}`);
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
  for (let task of tasks) {
    task.addEventListener("dblclick", editTask);
  }
}

/**
 * Save the edited task
 */
function setEditedTask() {
  const savetoast = document.querySelector(".savetoast");
  checkbox.disabled = false;
  saveButton.classList.remove("open");
  if (taskValue != editTarget.value) {
    const checklist = JSON.parse(localStorage.getItem("localItem"));
    const checked = checklist[editTarget.id][1];
    if (checked) {
      const taskList = JSON.parse(localStorage.getItem("localItem"));
      taskList[editTarget.id][1] = false;
      localStorage.setItem("localItem", JSON.stringify(taskList));
    }
  }
  const taskList = JSON.parse(localStorage.getItem("localItem"));
  taskList[editTarget.id][0] = editTarget.value;
  localStorage.setItem("localItem", JSON.stringify(taskList));
  editTarget.disabled = "disabled";
  editTarget.parentNode.parentNode.removeEventListener("mouseout", onLeavingTask);
  savetoast.style.visibility = "visible";
  const time = setTimeout(() => {
    savetoast.style.visibility = "hidden";
  }, 1000);
  editTarget.blur();
  textDecorate();
  showButtonValues();
  checkBox();
}

/**
 * Function that is called when we click "yes" button  in  edittask leaving popup
 * It saves the edited task to the local storage
 */
function yesLeavingTask() {
  const savetoast = document.querySelector(".savetoast");
  if (editTarget.value) {
    checkbox.disabled = false;
    saveButton.classList.remove("open");
    if (taskValue != editTarget.value) {
      const checklist = JSON.parse(localStorage.getItem("localItem"));
      const checked = checklist[editTarget.id][1];
      if (checked) {
        const taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList[editTarget.id][1] = false;
        localStorage.setItem("localItem", JSON.stringify(taskList));
      }
    }
    const taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList[editTarget.id][0] = editTarget.value;
    localStorage.setItem("localItem", JSON.stringify(taskList));
    editTarget.disabled = "disabled";
    editPopup.style.display = "none";
    editTarget.parentNode.parentNode.removeEventListener("mouseleave", onLeavingTask);
    savetoast.style.visibility = "visible";
    const time = setTimeout(() => {
      savetoast.style.visibility = "hidden";
    }, 1000);
    yesEdit.removeEventListener("click", yesLeavingTask);
    editTarget.blur();
    textDecorate();
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
    const warningtoast = document.querySelector(".warningtoast");
    editPopup.style.display = "none";
 
    warningtoast.style.visibility = "visible";
    const time = setTimeout(() => {
      warningtoast.style.visibility = "hidden";
    }, 1000);
    editTarget.focus();
    modifyTask();
  }
}

/**
 * Function that is called when we click "no" in the edited task leaving popup
 * @returns {void}
 */
function notLeavingTask() {
  const taskList = JSON.parse(localStorage.getItem("localItem"));
  editTarget.value = taskList[editTarget.id][0];
  editPopup.style.display = "none";
  editTarget.disabled = "disabled";
  saveButton.classList.remove("open");
  checkbox.disabled = false;
  editTarget.parentNode.parentNode.removeEventListener("mouseleave", onLeavingTask);
  noEdit.removeEventListener("click", notLeavingTask);
  textDecorate();
}

/**
 * Shows a popup to confirm the changes made to the task
 * @returns {void}
 */
function onLeavingTask() {
  const taskList = JSON.parse(localStorage.getItem("localItem"));
  if (editTarget.value != taskList[editTarget.id][0]) {
    editPopup.style.display = "block";
    document.getElementById("h3-edit").innerHTML = editTarget.value;
    yesEdit.addEventListener("click", yesLeavingTask);
    noEdit.addEventListener("click", notLeavingTask);
  } else {
    editTarget.disabled = "disabled";
    saveButton.classList.remove("open");
    checkbox.disabled = false;
    textDecorate();
  }
  editTarget.parentNode.removeEventListener("mouseleave", onLeavingTask);
}

/**
 *  A function that is used to edit the task
 */
function modifyTask() {
  
  if (editTarget.className === "inputs") {
    const indexs = editTarget.parentNode.id.slice(-1);
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

    /**
     * Function that is called when clicking the save button
     * It saves the edited task to the local storage
     */
    function onClickSaveButton() {
      if (editTarget.value) {
        setEditedTask();
      } else {
        const warningtoast = document.querySelector(".warningtoast");
        warningtoast.style.visibility = "visible";
        const time = setTimeout(() => {
          warningtoast.style.visibility = "hidden";
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

/**
 * A function that is called when doubleclicking the task
 * @param {Object} event - The event object is triggered by the double click
 * @returns {void}
 */
function editTask(event) {
  event.preventDefault();
  editTarget = event.target;
  modifyTask();
}

/**
 * A function that is called when clicking the "all-task" button 
 * It shows the entire task
 */
function showEntireTasks() {
  const tasks = document.querySelectorAll(".task");
  isIncomplete = false;
  isComplete = false;
  completeTask.style.display = "none";
  incompletedTask.style.display = "none";
  incomplete.style.border = "none";
  complete.style.border = "none";
  allTask.style.border = "solid";
  for (let task of tasks) {
    task.style.display = "block";
  }
  if (totalCount === 0) {
    entireTask.style.display = "block";
  }
}

/**
 * A function that is called when clicking the "incomplete" button
 * It shows all incomplete tasks
 */
function showIncompletedTask() {
  const tasks = document.querySelectorAll(".task");
  isIncomplete = true;
  isComplete = false;
  completeTask.style.display = "none";
  entireTask.style.display = "none";
  incomplete.style.border = "solid";
  allTask.style.border = "none";
  complete.style.border = "none";
  for (let i = 0; i < tasks.length; i++) {
    const checklist = JSON.parse(localStorage.getItem("localItem"));
    const checked = checklist[i][1];

    if (checked) {
      tasks[i].style.display = "none";
    } else tasks[i].style.display = "block";
  }
  if (incompleteCount === 0) {
    incompletedTask.style.display = "block";
  }
}

/**
 * A function that is called when clicking "complete" task button 
 * It shows all complete tasks
 */

function showCompletedTask() {
  const tasks = document.querySelectorAll(".task");
  isComplete = true;
  isIncomplete = false;
  incompletedTask.style.display = "none";
  entireTask.style.display = "none";
  complete.style.border = "solid";
  incomplete.style.border = "none";
  allTask.style.border = "none";
  for (let i = 0; i < tasks.length; i++) {
    const checklist = JSON.parse(localStorage.getItem("localItem"));
    const checked = checklist[i][1];

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
textDecorate();
