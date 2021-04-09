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


var NewSchedualePopUp = () =>{
    let popUpWindow = document.getElementById("NewSchedualePopUp");

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
    }
}


document.getElementById("NewSchedualeCloseBtn").onclick = NewSchedualePopUp;
document.getElementById("NewSchedualeHeader").onclick = NewSchedualePopUp;


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