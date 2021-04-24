import {AddScheduale, AddEvent} from './DataHandler.js'

var curPopUp = null;

//New Event Pop Up

let allDay = document.getElementById("NewEventAllDay")


var NewEventPopUp = () =>{
    let popUpWindow = document.getElementById("NewEventPopUp");

    if(popUpWindow.style.display === "none"){
        if(curPopUp){
            return;
        }
        popUpWindow.style.display = "block";
        curPopUp = popUpWindow;
    }
    else{
        popUpWindow.style.display = "none";
        curPopUp = null;

        allDay.checked  = false;

        let timeLabel = document.getElementById("NewEventTimeLb");
        let timeInput = document.getElementById("NewEventTime");

        timeInput.style.backgroundColor = "#c4c4c4";
        timeInput.style.color = "white";
        timeLabel.style.color = "white";
    }
}


document.getElementById("NewEventCloseBtn").onclick = NewEventPopUp;
document.getElementById("NewEventHeader").onclick = NewEventPopUp;

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
            NewEventPopUp();
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


//-----------------------------------------------------------------------------------

// New Daily Scheduale

var ScheduleEventHTML = "";

var events = [];
var curIndex;
let errorP = document.getElementById("NewSchedualeErrorMsg");

//New Scheaduale Event
var newSchedualeEvent = () => {
    curIndex++;

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

    events[events.length] = [newEvent, getEventData, curIndex];
}

document.getElementById("SchedualeNewEventBtn").onclick = newSchedualeEvent;


var NewSchedualePopUp = () =>{
    let popUpWindow = document.getElementById("NewSchedualePopUp");

    for(let i = 0; i< events.length; i++){
        events[i][0].remove();
    }
    curIndex = 0;
    events = [];

    if(popUpWindow.style.display === "none"){
        if(curPopUp){
            return;
        }
        popUpWindow.style.display = "block";
        curPopUp = popUpWindow;
        newSchedualeEvent();
    }
    else{
        popUpWindow.style.display = "none";
        curPopUp = null;
    }
}


document.getElementById("NewSchedualeCloseBtn").onclick = NewSchedualePopUp;
document.getElementById("NewSchedualeHeader").onclick = NewSchedualePopUp;

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

        console.log();
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


    let completeJson = JSON.stringify(
        {
            name: schedualeName,
            events: eventsData
        }
    );
    console.log("New Scheduale Data: " + completeJson);

    let xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:5000/main/makeNewScheduale",true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        var data = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "201") {
            console.log(data);
            NewSchedualePopUp();
            AddScheduale({
                name: schedualeName,
                events: eventsData
            });
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

document.getElementById("SchedualeCreateBtn").onclick = CreateTheScheduale;
