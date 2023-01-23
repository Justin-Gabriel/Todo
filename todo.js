
btn1.addEventListener('click',() => {
    const text = document.getElementById('input');
    if(text.value){
        let taskList = JSON.parse(localStorage.getItem("localItem")) || [];
        // if(localItems === null) {
        //     taskList = [];
        // }else {
        //     taskList = localItems;
        // }
        taskList.push([text.value,false]);
        localStorage.setItem('localItem',JSON.stringify(taskList))
    }else {
        alert("Enter a task to add");
        text.focus();
    }
    if(text.value !=""){
        text.value =""
    }
    showTask();
    loading();
    
})
function showTask(){
    
        let output = '';
        let block = document.querySelector('.blocks')
        let taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList.forEach((element,index) => {
            output += `<div class="task" ><input type="checkbox" class="checkbox" name="check" id="${index}" >
            <input class="inputs"  id="${index}" maxlength="70" disabled="disabled" value="${element[0]}" onmouseout="out(event)">
          <button class="delete" onClick="deleteItem(${index})"><img src="images/trash.svg" alt="" class="img1"></button> </div>`
            
        });
        block.innerHTML = output;
        
        buttonValues();

    }

    
// function out(event){
//     console.log(event.target.value);
//     let vals = event.target.value;
//     console.log(vals);
//     // if(event.target.value="") {
//     //     event.target.value = vals;
//     //     console.log("after",event.target.value);
//     // }
// } 



showTask();
                

function deleteItem(index) {
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList.splice(index,1)
    localStorage.setItem('localItem',JSON.stringify(taskList));

    showTask();
    loading();
    buttonValues();
    let tasks = document.querySelectorAll('.task')
    for (let task of tasks){
    task.addEventListener('dblclick', edit)
    }   
    buttonValues();

}

function buttonValues(){
    const allTask= document.getElementById('all-task');
    const incomplete = document.getElementById('incomplete');
    const completed = document.getElementById('completed');
    let incompleteCount = 0;
    let completeCount = 0;
    let boxes = document.querySelectorAll('.checkbox').length;
    for(let i = 0; i < boxes; i++){
        if(localStorage.length > 0){
            let checklist = JSON.parse(localStorage.getItem("localItem"));
            let checked = checklist[i][1]

            if(checked){
                completeCount += 1
            } 
            else incompleteCount += 1
        }
    }
    allTask.innerHTML = `All tasks: ${boxes}` ;
    incomplete.innerHTML = `Incomplete: ${incompleteCount}` ;
    completed.innerHTML = `Completed: ${completeCount}` ;
    
    // let tasksss = document.querySelectorAll('.task');
    // for (let task of tasks){
    //     let bgColor = window.getComputedStyle(task, null).getPropertyValue("background-color");
    //     if(bgColor){
    //         console.log(bgColor);
    //     }

}
buttonValues();



// function save() {	
//     let boxes = document.querySelectorAll('.checkbox').length;
//     for(let i = 0; i < boxes; i++){
// 	  let checkbox = document.getElementById(String(i));
//       localStorage.setItem("checkbox" + String(i), checkbox.checked);	
//   }
//   loading()
// }
function save(event){
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    let checkbox = document.getElementById(String(event.target.id));
    taskList[event.target.id][1] = checkbox.checked;
    localStorage.setItem('localItem',JSON.stringify(taskList));
    loading()
    let tasks = document.querySelectorAll('.task')
    for (let task of tasks){
    task.addEventListener('dblclick', edit)
    buttonValues();
}   
}





// function loading(){
//     let boxes = document.querySelectorAll('.checkbox').length;
//     for(let i = 0; i < boxes; i++){
//         if(localStorage.length > 1){
//           let checked = JSON.parse(localStorage.getItem("checkbox" + String(i)));
//           document.getElementById(String(i)).checked = checked;
//         }
//       }
// }

function loading(){
    let boxes = document.querySelectorAll('.checkbox').length;
    for(let i = 0; i < boxes; i++){
        if(localStorage.length > 0){
          let checklist = JSON.parse(localStorage.getItem("localItem"));
          let checked = checklist[i][1]
          let elems = document.getElementById(String(i))
          elems.checked = checked;
          if(elems.checked){
            elems.parentNode.style.backgroundColor = "#CD9E9E";

          }else{
            elems.parentNode.style.backgroundColor = "";
          }
        }
      }
}

loading();

let blocks = document.querySelector('.blocks')
blocks.addEventListener('change', save);


let inputs = document.querySelectorAll('.inputs')

function edit(event){
    if(event.target.className === 'inputs'){
        
        event.target.disabled="";
        event.target.focus();
        let vals = event.target.value;
        blocks.addEventListener("keyup", function(event){ 
        if (event.key === "Enter"){
            event.preventDefault();
            if(event.target.value){
                let taskList = JSON.parse(localStorage.getItem("localItem"));
                taskList[event.target.id][0] = event.target.value;
                localStorage.setItem('localItem',JSON.stringify(taskList));
                event.target.blur();

            }
            else{
                alert("Enter a task");
                event.target;
            }

        }

        })
        
    }}

let tasks = document.querySelectorAll('.task')
for (let task of tasks){
    task.addEventListener('click', edit)
} 

// alltask button

function alltasks(){
    let tasks = document.querySelectorAll('.task')
    for (let task of tasks){
        console.log(task);
        task.style.display = "block"
    }
}

let allTask = document.getElementById('all-task');
allTask.addEventListener('dblclick',alltasks)


// incomplete button

function incompletes(){
    let tasks = document.querySelectorAll('.task')
    for (let i =0 ; i < tasks.length ; i++){
                let checklist = JSON.parse(localStorage.getItem("localItem"));
                let checked = checklist[i][1]
    
                if(checked){
                    tasks[i].style.display = "none"
                } 
                else tasks[i].style.display = "block"

        
    }
}

let incomplete = document.getElementById('incomplete');
incomplete.addEventListener('click',incompletes)


// complete button 
function completes(){
    let tasks = document.querySelectorAll('.task')
    for (let i =0 ; i < tasks.length ; i++){
                let checklist = JSON.parse(localStorage.getItem("localItem"));
                let checked = checklist[i][1]
    
                if(checked){
                    tasks[i].style.display = "block"
                } 
                else tasks[i].style.display = "none"

        
    }
}

let complete = document.getElementById('completed');
complete.addEventListener('click',completes)


