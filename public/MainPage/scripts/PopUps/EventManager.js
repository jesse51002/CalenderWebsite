import {AddEvent, EditEvent, RemoveEvent} from '../DataHandler.js'

var editMode = false;
var editName;
var editData;

var allDay = document.getElementById("NewEventAllDay")
var popUpWindow = document.getElementById("NewEventPopUp");
var closedFunc = null;



var loadEditEventData = () => {
    document.getElementById("NewEventName").value = editData.name;
    document.getElementById("NewEventTime").value = editData.time;
    document.getElementById("NewEventDay").value = editData.date;
    document.getElementById("NewEventAllDay").checked = editData.allDay;
}

export function closeEventManager(){
    popUpWindow.style.display = "none";

    allDay.checked = false;

    let timeLabel = document.getElementById("NewEventTimeLb");
    let timeInput = document.getElementById("NewEventTime");

    timeInput.style.backgroundColor = "#c4c4c4";
    timeInput.style.color = "white";
    timeLabel.style.color = "white";
}

export function openEventManager(type){
    if(popUpWindow.style.display === "none"){
        popUpWindow.style.display = "block";
    }
    

    if(type === "create"){
        document.getElementById("NewEventAcceptBtn").innerText ="Create New";
        document.getElementById("NewEventTitle").innerText = "Create New Event";
        document.getElementById("NewEventDeleteBtn").style.display = "none";
        editMode = false;
    } 
    else if(type === "edit"){
        document.getElementById("NewEventAcceptBtn").innerText ="Confirm Edits";
        document.getElementById("NewEventTitle").innerText = "Edit Event";
        document.getElementById("NewEventDeleteBtn").style.display = "block";
        editMode = true;
        loadEditEventData();
    }
}
popUpWindow.style.display = "none";

document.getElementById("NewEventCloseBtn").onclick = () => {
    closeEventManager();
    closedFunc("EventManager");
};


allDay.addEventListener('change', (event) => {
    let timeLabel = document.getElementById("NewEventTimeLb");
    let timeInput = document.getElementById("NewEventTime");   

    if(allDay.checked){
        timeInput.style.backgroundColor = "black";
        timeInput.style.color = "black";
        timeLabel.style.color = "black"
    }
    else{
        timeInput.style.backgroundColor = "#c4c4c4";
        timeInput.style.color = "white";
        timeLabel.style.color = "white"
    }
  });


var createNewEvent = (id) => {
    if(!editMode){
        let jsonData = JSON.stringify( {
            name: document.getElementById("NewEventName").value,
            time: document.getElementById("NewEventTime").value,
            date: document.getElementById("NewEventDay").value,
            allDay: document.getElementById("NewEventAllDay").checked
        });

        let xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:5000/main/makeNewEvent",true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            console.log(xhr.responseText);
            var data = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "201") {
                closeEventManager();
                closedFunc("EventManager");
                AddEvent({
                    name: document.getElementById("NewEventName").value,
                    time: document.getElementById("NewEventTime").value,
                    date: document.getElementById("NewEventDay").value,
                    allDay: document.getElementById("NewEventAllDay").checked
                });
                console.log(data);
            } else if(xhr.status === "401"){
                console.log(data);
                if(data === "EventNameUsed"){
                    errorP.textContent = "You already have a event with that name";
                }
            }
            else if(xhr.status === "501"){
                errorP.textContent = "Error 501. Try Again.";
            }
            else{
                errorP.textContent = "Unknown Error";
            }
        }
        xhr.send(jsonData); 
    }
    else{
        let jsonData = JSON.stringify( 
            {
                name: editName,
                data: {
                        name: document.getElementById("NewEventName").value,
                        time: document.getElementById("NewEventTime").value,
                        date: document.getElementById("NewEventDay").value,
                        allDay: document.getElementById("NewEventAllDay").checked
                    }
            }
        );

        let xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:5000/main/editEvent",true);
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "201") {
                closeEventManager();
                closedFunc("EventManager");
                EditEvent(editName,{
                    name: document.getElementById("NewEventName").value,
                    time: document.getElementById("NewEventTime").value,
                    date: document.getElementById("NewEventDay").value,
                    allDay: document.getElementById("NewEventAllDay").checked
                });
                console.log(data);
            } else if(xhr.status === "401"){
                console.log(data);
                if(data === "EventNameUsed"){
                    errorP.textContent = "You already have a event with that name";
                }
            }
            else if(xhr.status === "501"){
                errorP.textContent = "Error 501. Try Again.";
            }
            else{
                errorP.textContent = "Unknown Error";
            }
        }
        xhr.send(jsonData); 
    }
}

document.getElementById("NewEventAcceptBtn").onclick = createNewEvent;


var deleteEvent = () =>{
    let completeJson = JSON.stringify(
        {
            name: editName,
        }
    );
    let xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:5000/main/deleteEvent",true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        if (xhr.status == "201") {
            RemoveEvent(editName);
            closeEventManager();
            closedFunc("EventManager");
            //console.log("Edited Scheduale Data: " + data);
            
        } else{
            CloseDataManager();
            closedFunc("EventManager");
        }
    }
    xhr.send(completeJson); 
}

document.getElementById("NewEventDeleteBtn").onclick = deleteEvent;

export function setEventEdit(name, data){
    editName = name;
    editData = data;
}

export function eventRecieveClosedFunc(closeFunc){
    closedFunc = closeFunc;
}