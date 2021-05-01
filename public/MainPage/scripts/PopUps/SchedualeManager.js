import {AddScheduale, EditScheduale} from '../DataHandler.js'

var editMode = false;
var editName;
var editData;

var events = [];
var curIndex;
var errorP = document.getElementById("NewSchedualeErrorMsg");
let popUpWindow = document.getElementById("NewSchedualePopUp");
var closedFunc = null;

//New Scheaduale Event
var newSchedualeEvent = () => {
    curIndex++;

    let insideIndex=  curIndex;

    let arrIndex = events.length;
    let eventsHolder = document.getElementById("NewSchedualeEventsHolder");

    let newEvent = document.createElement("div");
    newEvent.className = "NewSchedualeEvent";
    eventsHolder.appendChild(newEvent);
    

        let eventTop = document.createElement("div");
        eventTop.className = "NewSchedualeEventTop";
        newEvent.appendChild(eventTop);

            let eventNameLabel = document.createElement("label");
            eventNameLabel.className = "PopUpLabel SchedualeEventNameLb";
            eventNameLabel.setAttribute("for","SchedualeEventName" + curIndex);
            eventNameLabel.innerText = "Event Name:";
            eventTop.appendChild(eventNameLabel);

            let eventNameForm = document.createElement("input");
            eventNameForm.className = "SchedualeEventName SchedualeEventInput";
            eventNameForm.name = "SchedualeEventName" + curIndex;
            eventNameForm.id = "SchedualeEventName" + curIndex;
            eventNameForm.type = "text";
            eventTop.appendChild(eventNameForm);

            let eventTimeLabel = document.createElement("label");
            eventTimeLabel.className = "PopUpLabel SchedualeEventTimeLb";
            eventTimeLabel.setAttribute("for","SchedualeEventTime" + curIndex);
            eventTimeLabel.innerText = "Event Time:";
            eventTop.appendChild(eventTimeLabel);

            let eventTimeForm = document.createElement("input");
            eventTimeForm.className = "SchedualeEventTime SchedualeEventInput";
            eventTimeForm.name = "SchedualeEventTime" + curIndex;
            eventTimeForm.id = "SchedualeEventTime" + curIndex;
            eventTimeForm.type = "time";
            eventTop.appendChild(eventTimeForm);


        let eventDays = document.createElement("div");
        eventDays.className = "NewSchedualeEventDays";
        newEvent.appendChild(eventDays);

        let days = ["Sun","Mon", "Tue", "Wed", "Thr", "Fri", "Sat"];
        let daySelected = [false, false,false,false,false,false,false];

        for(let i = 0; i < days.length; i++){
            let curDay = document.createElement("button");
            curDay.className = "NewSchedualeEventDay";
            curDay.id = "NewSchedualeEventDay" + curIndex + "-" + i;
            curDay.innerText = days[i];
            curDay.onclick = () => {
                daySelected[i] = !daySelected[i];
                if(daySelected[i]){
                    curDay.style.backgroundColor = "#d3ad8a";
                }
                else{
                    curDay.style.backgroundColor = "rgba(0,0,0,0)";
                }
            }

            eventDays.appendChild(curDay);
        }

        let removeButton = document.createElement("button");
        removeButton.className = "NewSchedualeEventRemove";
        removeButton.innerText = "Remove";
        removeButton.onclick = () =>{
            newEvent.remove();
            events.splice(arrIndex,1);
        }
        eventDays.appendChild(removeButton);

    let getEventData = () => {
        return {
            name: eventNameForm.value,
            time: eventTimeForm.value,
            days: daySelected
        };
    }

    let setEventData = (data) => {
        eventNameForm.value = data.name;
        eventTimeForm.value = data.time;
        daySelected = data.days;

        for(let i=0; i< daySelected.length; i++){
            if(daySelected[i]){
                document.getElementById("NewSchedualeEventDay" + insideIndex + "-" + i).style.backgroundColor = "#d3ad8a";
            }
        }

    }

    events[events.length] = [newEvent, getEventData, curIndex, setEventData];
}

document.getElementById("SchedualeNewEventBtn").onclick = newSchedualeEvent;

function removeSchedualeEvents(){
    for(let i = 0; i< events.length; i++){
        events[i][0].remove();
    }
    curIndex = 0;
    events = [];
}

function loadSchedualeEvents(){
    if(!editData){
        return null;
    }
    
    document.getElementById("SchedualeEventNameMain").value = editData.name;

    for(let i = 0;i< editData.events.length; i++){
        let curEvent = editData.events[i];
        newSchedualeEvent();
        events[events.length -1][3](curEvent);
    }
}

export function setSchedualeEdit(name, data){
    editName = name;
    editData = data;
}


export function openSchedualeManger(type){
    removeSchedualeEvents();
    if(popUpWindow.style.display === "none"){
        popUpWindow.style.display = "block";
    }

    if(type === "create"){
        editMode = false;
        newSchedualeEvent();
        document.getElementById("SchedualeMakerTitle").innerText = "Create Daily Scheduale";
        document.getElementById("SchedualeCreateBtn").innerText = "Create New Scheduale";
        document.getElementById("SchedualeEventNameMain").value = "";
        
    }
    else if(type === "edit"){
        editMode =true;
        document.getElementById("SchedualeMakerTitle").innerText = "Edit Daily Scheduale";
        document.getElementById("SchedualeCreateBtn").innerText = "Confirm Changes";
        loadSchedualeEvents();
    }

    
}
popUpWindow.style.display = "none";

export function closeSchedualeManger(){
    popUpWindow.style.display = "none";
}


document.getElementById("NewSchedualeCloseBtn").onclick = () => {
    closeSchedualeManger();
    closedFunc("SchedualeManager");
};


//Send Scheduale to server

var CreateTheScheduale = () => {
    let schedualeName = document.getElementById("SchedualeEventNameMain").value;

    if(schedualeName.length <=0){
        errorP.textContent = "There must be a name for the schedaule";
        return;
    }
 
    let eventsData = [];
    for(let i = 0; i < events.length; i++){
        eventsData[i] = events[i][1]();

        if(eventsData[i].name.length <=0){
            errorP.textContent = "There must be a name for every event";
            return;
        }
        if(eventsData[i].time.length <=0){
            errorP.textContent = "There must be a time for every event";
            return;
        }

        let days = eventsData[i].days;
        let singleDay = false;
        for(let j = 0; j < days.length; j++){
            if(eventsData[i].days[j]){
                singleDay = true;
                break;
            }
        }

        if(!singleDay){
            errorP.textContent = "A day has to be selected on every event";
            return;
        }
    }  

    if(!editMode){
        let completeJson = JSON.stringify(
            {
                name: schedualeName,
                events: eventsData
            }
        );

        let xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:5000/main/makeNewScheduale",true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            let data = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "201") {
                console.log("New Scheduale Data: " + data);
                AddScheduale({
                    name: schedualeName,
                    events: eventsData
                });
                closeSchedualeManger();
                closedFunc("SchedualeManager");
            } else if(xhr.status === "401"){
                console.log(data);
                if(data === "SchedualeNameUsed"){
                    errorP.textContent = "You already have a scheduale with that name";
                }
            }
            else if(xhr.status === "501"){
                errorP.textContent = "Error 501. Try Again.";
            }
            else{
                errorP.textContent = "Unknown Error";
            }
        }
        xhr.send(completeJson);  
    }
    else{
        let completeJson = JSON.stringify(
            {
                name: editName,

                data: {
                    name: schedualeName,
                    events: eventsData
                }
            }
        );
        let xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:5000/main/editScheduale",true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            let data = JSON.parse(xhr.responseText);
            if (xhr.status == "201") {
                EditScheduale(
                    editName,  
                    {
                        name: schedualeName,
                        events: eventsData}
                    );
                closeSchedualeManger();
                closedFunc("SchedualeManager");
                console.log("Edited Scheduale Data: " + data);
                
            } else if(xhr.status === "401"){
                errorP.textContent = "Error 401. Try Again.";
            }   
            else if(xhr.status === "501"){
                errorP.textContent = "Error 501. Try Again.";
            }
            else{
                errorP.textContent = "Unknown Error";
            }
        }
        xhr.send(completeJson);  
    }
}

document.getElementById("SchedualeCreateBtn").onclick = CreateTheScheduale;


export function schedRecieveClosedFunc(closeFunc){
    closedFunc = closeFunc;
}