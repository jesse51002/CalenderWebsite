import {GetScheduales, GetEvents, RemoveScheduale} from '../DataHandler.js'
import {setSchedualeEdit} from "./SchedualeManager.js"

var closedFunc = null;
var editSchedViewFunc = null;
var newSchedViewFunc = null;


const popUpWindow = document.getElementById("SchedualeManager");
popUpWindow.style.display = "none";

var managerObjs = [];

export function CloseDataManager(){
    popUpWindow.style.display = "none";
}

var DisplayScheduales = () => {

    for(let i = 0; i< managerObjs.length; i++){
        managerObjs[i].parentNode.removeChild(managerObjs[i]);
    }
    managerObjs = [];

    let scheduales = GetScheduales();

    for(let i = 0; i< scheduales.length; i++){
        let sched = scheduales[i];

        let curSched = document.createElement("div");
        curSched.className = "SchedualeObj";
        document.getElementById("SchedualesHolder").appendChild(curSched);
        managerObjs[managerObjs.length] = curSched;

        let curName = document.createElement("h2");
        curName.innerText = sched.name;
        curName.className = "SchedualeObjName";
        curSched.appendChild(curName);

        let curManageBtn = document.createElement("button");
        curManageBtn.className = "SchedualeObjManage";
        curManageBtn.innerText = "Manage";
        curSched.appendChild(curManageBtn);

        curManageBtn.onclick = () =>{
            setSchedualeEdit(sched.name, sched);
            editSchedViewFunc();
        }
        
        let curDeleteBtn = document.createElement("button");
        curDeleteBtn.className = "SchedualeObjDelete";
        curDeleteBtn.innerText = "Delete";
        curSched.appendChild(curDeleteBtn);
        
        curDeleteBtn.onclick = () => {
            let completeJson = JSON.stringify(
                {
                    name: sched.name,
                }
            );
            let xhr = new XMLHttpRequest();
            xhr.open("POST","http://localhost:5000/main/deleteScheduale",true);
            xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
            xhr.onload = function () {
                var data = JSON.parse(xhr.responseText);
                if (xhr.status == "201") {
                    RemoveScheduale(sched.name);
                    CloseDataManager();
                    closedFunc("SchedualeManager");
                    console.log("Edited Scheduale Data: " + data);
                    
                } else{
                    CloseDataManager();
                    closedFunc("SchedualeManager");
                }
            }
            xhr.send(completeJson); 
        }
    }
}

export function OpenDataManager(){
    if(popUpWindow.style.display === "none"){
        DisplayScheduales();
        popUpWindow.style.display = "block";
    }
}
popUpWindow.style.display = "none";


document.getElementById("SchedualeManagerCloseBtn").onclick = () =>{
    CloseDataManager();
    closedFunc("DataManager");
};

document.getElementById("SchedualeMangerCreateBtn").onclick = () =>{
    newSchedViewFunc();
};

export function dataRecieveClosedFunc(closeFunc){
    closedFunc = closeFunc;
}

export function getEditSchedViewFunc(func){
    editSchedViewFunc = func;
}

export function getNewSchedViewFunc(func){
    newSchedViewFunc = func;
}
