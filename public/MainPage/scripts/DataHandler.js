var CalenderData;
var UpdateViews;

let xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:5000/main/GetCalenderData", true);
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == "201") {
        CalenderData = data;
        console.log(data);
    } else if (xhr.status === "401") {
        console.log("Data from server:\n" + data);
    }
    else if (xhr.status === "501") {
        console.log(data);
    }
    else {
        //errorP.textContent = "Unknown Error";
        console.log(data);
    }
}
xhr.send();

export function AddScheduale(scheduale){
    if(!CalenderData){
        return false;
    } 

    CalenderData.scheduales[CalenderData.scheduales.length] = scheduale;
    if(UpdateViews){
        UpdateViews();
        return true;
    }
    else {
        return false;
    }
}

export function EditScheduale(name, newData){
    for(let i = 0; i< CalenderData.scheduales.length; i++){
        if(CalenderData.scheduales[i].name === name){
            CalenderData.scheduales[i] = newData;
            if(UpdateViews){
                UpdateViews();
                return true;
            }
            else {
                return false;
            }
        }
    }
}

export function RemoveScheduale(name){
    for(let i = 0; i< CalenderData.scheduales.length; i++){
        if(CalenderData.scheduales[i].name === name){
            CalenderData.scheduales.splice(i,1);
            if(UpdateViews){
                UpdateViews();
                return true;
            }
            else {
                return false;
            }
        }
    }
}

export function AddEvent(event){
    if(!CalenderData){
        return false;
    } 

    CalenderData.events[CalenderData.events.length] = event;
    if(UpdateViews){
        UpdateViews();
        return true;
    }
    else {
        return false;
    }
}

export function GetScheduales(){
    if(!CalenderData){
        return null;
    } 
    else{
        return CalenderData.scheduales;
    }
}

export function GetEvents(){
    if(!CalenderData){
        return null;
    } 
    else{
        return CalenderData.events;
    }
}

export function sendViewsUpdate(sentViewUpdate){
    UpdateViews = sentViewUpdate;
}