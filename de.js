

let input1 = document.querySelector('.input');
input1.addEventListener('click', (event) => {
    event.target.addEventListener('input',(e) =>{
        if(event.target.value){
            
            let btn = document.getElementById('btn1');
            btn1.disabled = false;
            btn1.style.cursor = "pointer"
        }else {
            btn1.disabled = true;
        }
    })
})

let btn1 = document.getElementById('btn1');

btn1.addEventListener('click',(e) => {
    btn1.disabled = true;
    btn1.style.cursor = "no-drop"
    let text = document.getElementById('input');
    if(text.value){
        text.style.outline = "";
        text.placeholder = "Create Task...";
        let taskList = JSON.parse(localStorage.getItem("localItem")) || [];
        taskList.unshift([text.value,false]);
        localStorage.setItem('localItem',JSON.stringify(taskList))
    }else {
        let inputBox = document.querySelector(".input-box")
        text.style.outline = "solid red";
        text.placeholder = "Please Enter a task";
        text.focus();

    }
    if(text.value !=""){
        text.value =""
    }
    showTask();
    loading();
    
})

let inputBox = document.querySelector(".input-box");
inputBox.addEventListener('mouseleave', (event) => {
    let text = document.getElementById('input');
    text.style.outline = "";
    text.placeholder = "Create Task...";
})

function showTask(){
    
        let output = '';
        let block = document.querySelector('.blocks')
        let taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList.forEach((element,index) => {
            output += `<div class="task" id="task${index}"><input type="checkbox" class="checkbox" name="check" id="check${index}">
            <input class="inputs"  id="${index}" maxlength="70" disabled="disabled" value="${element[0]}" onselect="return false">
            <button class="save" id="save${index}"><img src="images/saves.png" alt="" class="sav"></button>
            <button class="delete" onClick="deleteItem(${index})"><img src="images/trash.svg" alt="" class="img1"></button> </div>` 
            
        });
        block.innerHTML = output;
        
        buttonValues();

    }



showTask();
                


function deleteItem(index) {
    let popup = document.querySelector('.popup');
    popup.style.display = "block";
    const yes = document.getElementById('yesdel');
    
    let no = document.getElementById('nodel');

    
     function yess(){

        let taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList.splice(index,1)
        localStorage.setItem('localItem',JSON.stringify(taskList));
        popup.style.display= "none"
        showTask();
        loading();
        buttonValues();
        let tasks = document.querySelectorAll('.task')
        for (let task of tasks){
        task.addEventListener('dblclick', edit)
        }   
        buttonValues();
        yes.removeEventListener('click',yess)
        
    }

    yes.addEventListener('click',yess)
    


    function noo(){
        popup.style.display="none";

    }
    no.addEventListener('click',noo)


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

}
buttonValues();


function save(event){
    console.log(event.target);
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    let checkbox = document.getElementById(String(event.target.id));
    taskList[event.target.id.slice(-1)][1] = checkbox.checked;
    localStorage.setItem('localItem',JSON.stringify(taskList));
    loading();
    buttonValues(); 
}

let checkbox = document.querySelectorAll('.checkbox')
for(let check of checkbox){
    check.addEventListener('change', save);
}



function loading(){
    let boxes = document.querySelectorAll('.checkbox').length;
    for(let i = 0; i < boxes; i++){
        if(localStorage.length > 0){
          let checklist = JSON.parse(localStorage.getItem("localItem"));
          let checked = checklist[i][1]
          let elems = document.getElementById(`check${i}`)
          elems.checked = checked;
          if(elems.checked){
            elems.parentNode.style.backgroundColor = "#CD9E9E";
            elems.nextElementSibling.style.textDecoration = "line-through";

          }else{
            elems.parentNode.style.backgroundColor = "";
            elems.nextElementSibling.style.textDecoration = "";
          }
        }
    }
    let tasks = document.querySelectorAll('.task')
      for (let task of tasks){
          task.addEventListener('dblclick', edit)
      } 
}

loading();




let inputs = document.querySelectorAll('.inputs')

function edit(event){

    event.preventDefault();
    function saved(){
        if(event.target.className === 'inputs'){
            let indexs = event.target.parentNode.id.slice(-1)
            let checkbox = document.getElementById(`check${indexs}`)
            checkbox.disabled = true;
            event.target.disabled="";
            event.target.focus();
            let vals = event.target.value;
            event.target.value = "";
            event.target.value = vals;
    
            // function keys(event){ 
    
            function saves(e){
                function sav(){
                    checkbox.disabled = false;
                    save.classList.remove('open')
                    if(vals != event.target.value){
                        let checklist = JSON.parse(localStorage.getItem("localItem"));
                        let checked = checklist[event.target.id][1];
                        if(checked){
                            let taskList = JSON.parse(localStorage.getItem("localItem"));
                            taskList[event.target.id][1] = false;
                            localStorage.setItem('localItem',JSON.stringify(taskList));
                        }
                    }
                    let taskList = JSON.parse(localStorage.getItem("localItem"));
                    taskList[event.target.id][0] = event.target.value;
                    localStorage.setItem('localItem',JSON.stringify(taskList));
                    event.target.disabled="disabled";
                    event.target.parentNode.parentNode.removeEventListener('mouseout',disable);
                    let savetoast = document.querySelector('.savetoast')
                    savetoast.style.visibility = "visible"
                    let time = setTimeout( () => {
                        savetoast.style.visibility = "hidden"
                    },1000);
                    event.target.blur();
                    loading();
                    buttonValues();
                }
    
                if(event.target.value){
                    sav();
                }
                else{
     
                    let savetoast = document.querySelector('.warningtoast')
                    savetoast.style.visibility = "visible"
                    let time = setTimeout( () => {
                        savetoast.style.visibility = "hidden"
                    },1000);
                    event.target.focus();
                    console.log(event.target.className);
                    saved();
    
                    
    
                }
                
                save.removeEventListener('click',saves);
                event.target.parentNode.removeEventListener('mouseleave',disable) 
                
    
                
            }
            let save = document.getElementById(`save${indexs}`);
            save.classList.add('open')
            save.addEventListener('click',saves)
    
            function disable(e){
                // if(e.target.className == "task"){
                    let pop = document.querySelector('.popedit');
                    pop.style.display = "block";
                    let yess = document.getElementById('yess');
                    
                    let noo = document.getElementById('noo');
    
                    function yessss(){
                        if(event.target.value){
                            checkbox.disabled = false;
                            save.classList.remove('open');
                            if(vals != event.target.value){
                                let checklist = JSON.parse(localStorage.getItem("localItem"));
                                let checked = checklist[event.target.id][1];
                                if(checked){
                                    let taskList = JSON.parse(localStorage.getItem("localItem"));
                                    taskList[event.target.id][1] = false;
                                    localStorage.setItem('localItem',JSON.stringify(taskList));
                                }
                            }
                            let taskList = JSON.parse(localStorage.getItem("localItem"));
                            taskList[event.target.id][0] = event.target.value;
                            localStorage.setItem('localItem',JSON.stringify(taskList));
                            event.target.disabled="disabled";
                            pop.style.display = "none";
                            event.target.parentNode.parentNode.removeEventListener('mouseout',disable);
                            let savetoast = document.querySelector('.savetoast')
                            savetoast.style.visibility = "visible"
                            let time = setTimeout( () => {
                                savetoast.style.visibility = "hidden"
                            },1000);
                            yes.removeEventListener('click',yess)
                            event.target.blur();
                            loading();
                            buttonValues();
                        
            
                            
            
                        }
                        else{
                            pop.style.display = "none";
                            let savetoast = document.querySelector('.warningtoast')
                            savetoast.style.visibility = "visible"
                            let time = setTimeout( () => {
                                savetoast.style.visibility = "hidden"
                            },1000);
                            event.target.focus();
                            saved();
                        }
                    }
                    yess.addEventListener('click',yessss)
    
                    function noo(){
                        event.target.value = vals;
                        pop.style.display = "none";
                        event.target.disabled="disabled";
                        save.classList.remove('open');
                        checkbox.disabled = false;
                        event.target.parentNode.parentNode.removeEventListener('mouseout',disable);
                        no.removeEventListener('click',noo);
                        loading();
    
    
    
                    }
                    noo.addEventListener('click',noo)
                // }
                event.target.parentNode.removeEventListener('mouseleave',disable)  
            }
    
            event.target.parentNode.addEventListener('mouseleave',disable)
            console.log("yes",event.target.parentNode);
            
    
            event.target.parentNode.removeEventListener('dblclick',edit)
        }
    }
    saved();

}


let tasks = document.querySelectorAll('.task')
for (let task of tasks){
    task.addEventListener('dblclick', edit)
} 


// alltask button

function alltasks(){
    let tasks = document.querySelectorAll('.task')
    for (let task of tasks){
        task.style.display = "block"
    }

}

let allTask = document.getElementById('all-task');
allTask.addEventListener('click',alltasks)


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






