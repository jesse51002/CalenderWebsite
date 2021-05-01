import {AddEvent} from '../DataHandler.js'

var allDay = document.getElementById("NewEventAllDay")
var popUpWindow = document.getElementById("NewEventPopUp");
var closedFunc = null;

export function closeEventManager(){
    popUpWindow.style.display = "none";

    allDay.checked = false;

    let timeLabel = document.getElementById("NewEventTimeLb");
    let timeInput = document.getElementById("NewEventTime");

    timeInput.style.backgroundColor = "#c4c4c4";
    timeInput.style.color = "white";
    timeLabel.style.color = "white";
}

export function openEventManager(){

    if(popUpWindow.style.display === "none"){
        popUpWindow.style.display = "block";
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
    let jsonData = JSON.stringify( {
        name: document.getElementById("NewEventName").value,
        time: document.getElementById("NewEventTime").value,
        date: document.getElementById("NewEventDay").value,
        allDay: document.getElementById("NewEventAllDay").checked
    });

    console.log("New Event Data: " + jsonData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:5000/main/makeNewEvent",true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
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

document.getElementById("NewEventAcceptBtn").onclick = createNewEvent;

export function eventRecieveClosedFunc(closeFunc){
    closedFunc = closeFunc;
}