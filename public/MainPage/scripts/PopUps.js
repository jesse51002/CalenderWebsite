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


var createNewProjPressed = (id) => {
    let width = document.getElementById("newProjWidth").value;
    let height = document.getElementById("newProjHeight").value;

    let errorMsg = document.getElementById("NewProjErrorMsg");

    if(width> 50 || height > 50 || width < 1 || height < 1){
        errorMsg.innerText = "The width and height must be in between 1 - 50";
    }
    else{
        errorMsg.innerText = "";
        createNewCanvas(width, height);
        newProjMenuPressed();
        console.log("Closed Tab");
    }
}

//document.getElementById("ProjAcceptBtn").onclick = createNewProjPressed;


//-----------------------------------------------------------------------------------

// New Daily Scheduale

var ScheduleEventHTML = "";

var events = [];
var curIndex;

var newSchedualeEvent = () => {
    curIndex++;

    let arrIndex = events.length;
    let eventsHolder = document.getElementById("NewSchedualeEventsHolder");

    let newEvent = document.createElement("div");
    newEvent.className = "NewSchedualeEvent";
    eventsHolder.appendChild(newEvent);
    events[events.length] = [newEvent, curIndex];

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

        for(let i = 0; i < days.length; i++){
            let curDay = document.createElement("button");
            curDay.className = "NewSchedualeEventDay";
            curDay.innerText = days[i];
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