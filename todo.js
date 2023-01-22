btn1.addEventListener('click',() => {
    const text = document.getElementById('input');
    if(text.value){
        let taskList = JSON.parse(localStorage.getItem("localItem")) || [];
        // if(localItems === null) {
        //     taskList = [];
        // }else {
        //     taskList = localItems;
        // }
        taskList.push(text.value);
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
        let blocks = document.querySelector('.blocks')
        let taskList = JSON.parse(localStorage.getItem("localItem"));
        taskList.forEach((element,index) => {
            output += `<div class="task"><input type="checkbox" class="checkbox" name="check" id="${index}" >
            <p class="inputs" maxlength="80" id="${index}">${element}</p>
          <button class="delete" onClick="deleteItem(${index})"><img src="images/trash.svg" alt="" class="img1"></button> </div>`
            
        });
        blocks.innerHTML = output;
        
    }

    
    



showTask();

function deleteItem(index) {
    let taskList = JSON.parse(localStorage.getItem("localItem"));
    taskList.splice(index,1)
    localStorage.setItem('localItem',JSON.stringify(taskList));
    localStorage.removeItem('checkbox'+String(index));
    // localStorage.setItem("checkbox" + String(index), checkbox.checked = false);
    // save();

    showTask();
    loading();

}

//  let totals = document.querySelectorAll('.checkbox');
// console.log(totals);
// for (let i=0 ; i < totals.length; i++)  {
//      console.log(totals[i].checked);

//  }
function buttonValues(){
    const allTask= document.getElementById('all-task');
    const incomplete = document.getElementById('incomplete');
    const completed = document.getElementById('completed');
    allTask.innerHTML = `All tasks: ${document.querySelectorAll('.checkbox').length}` ;
    incomplete.innerHTML = `Incomplete: ${document.querySelectorAll('.checkbox').length}` ;
    completed.innerHTML = `Completed: ${document.querySelectorAll('.checkbox').length}` ;

   
}
buttonValues();



function save() {	
    let boxes = document.querySelectorAll('.checkbox').length;
    for(let i = 0; i < boxes; i++){
	  let checkbox = document.getElementById(String(i));
      localStorage.setItem("checkbox" + String(i), checkbox.checked);	
  }
  loading()
}

function loading(){
    let boxes = document.querySelectorAll('.checkbox').length;
    for(let i = 0; i < boxes; i++){
        if(localStorage.length > 1){
          let checked = JSON.parse(localStorage.getItem("checkbox" + String(i)));
          document.getElementById(String(i)).checked = checked;
        }
      }
}

loading();

let blocks = document.querySelector('.blocks')
blocks.addEventListener('change', save);


let inputs = document.querySelectorAll('.inputs')
console.log(inputs);
function yes(event){
    if(event.target.className == 'inputs'){
        console.log(event.target.innerHTML);
        event.target.contentEditable="true" ;
        console.log(typeof +event.target.id);
        let taskList = JSON.parse(localStorage.getItem("localItem"));
        console.log(taskList[+event.target.id]);
        //taskList[id]
    }
    
}
blocks.addEventListener('dblclick', yes)

 

