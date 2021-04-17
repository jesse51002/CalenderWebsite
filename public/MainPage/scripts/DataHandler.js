var CalenderData;

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