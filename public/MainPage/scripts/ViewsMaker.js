import {GetScheduales, GetEvents, sendViewsUpdate} from './DataHandler.js'
import {setEventEdit} from "./PopUps/EventManager.js"
import {setSchedualeEdit} from "./PopUps/SchedualeManager.js"

var currentView = "Day";

const monthView = document.getElementById("MonthView");
const dayView = document.getElementById("DayView");

var todayDate = new Date();
var currentMonth = todayDate.getMonth();
var currentYear = todayDate.getFullYear();

var openEventEditMode = null;
var openSchedEditMode = null;

const getMonthSize = (m,y) =>{
    switch(m){
        case 0: 
            return 31;
            break;
        case 1: 
            if(y % 4 === 0){
                return 29;
            }   
            return 28;
            break;
        case 2: 
            return 31;
            break;
        case 3: 
            return 30;
            break;
        case 4: 
            return 31;
            break;
        case 5: 
            return 30;
            break;
        case 6: 
            return 31;
            break;
        case 7: 
            return 31;
            break;
        case 8: 
            return 30;
            break;
        case 9: 
            return 31;
            break;
        case 10: 
            return 30;
            break;
        case 11: 
            return 31;
            break;
    }   
}

const makeMonthView = () => {
    const view = document.getElementById("MonthViewHolder");

    for(let i = 0; i < 6; i++){
        let row = document.createElement("div");
        row.className = "MonthRow";
        row.id = "MonthRow" + i;
        view.appendChild(row);

        for(let j = 0;j <7; j++){
            let day = document.createElement("button");
            day.className = "MonthDay";
            day.id = "MonthDay"+ i + "-" + j;
            row.appendChild(day);

            let dayTitle = document.createElement("h2");
            dayTitle.className = "MonthDayTitle";
            dayTitle.id = "MonthDayTitle"+ i + "-" + j;
            //dayTitle.innerText = dayDate.month + "/" +dayDate.day;
            day.appendChild(dayTitle);

            let dayData = document.createElement("div");
            dayData.className = "MonthDayDataHolder";
            dayData.id = "MonthDayData" + i + "-"+ j;
            day.appendChild(dayData);

            
        }
    }

    console.log("Made month view");
}
makeMonthView();

var calenderEvents = [];
const updateMonthView = () => {
    
    let monthName = "";

    switch(currentMonth){
        case 0: 
            monthName = "January";
            break;
        case 1: 
            monthName = "February";
            break;
        case 2: 
            monthName = "March";
            break;
        case 3: 
            monthName = "April";
            break;
        case 4: 
            monthName = "May";
            break;
        case 5: 
            monthName = "June";
            break;
        case 6: 
            monthName = "July";
            break;
        case 7: 
            monthName = "August";
            break;
        case 8: 
            monthName = "September";
            break;
        case 9: 
            monthName = "October";
            break;
        case 10: 
            monthName = "November";
            break;
        case 11: 
            monthName = "December";
            break;
    }   

    document.getElementById("MonthViewName").innerText = monthName + " " + currentYear;
    const startOffset = new Date(currentYear, currentMonth, 1).getDay();

    const getDate = (i,j) =>{
        const monthIndex = (i * 7) + j - startOffset;
        
        const curMonthSize = getMonthSize(currentMonth, currentYear);

        if(monthIndex < 0){
            let newMonth = currentMonth - 1;
            let newYear = currentYear;
            if(currentMonth -1 <= 0){
                newMonth = 11;
                newYear--;
            }

            let day = getMonthSize(newMonth, newYear)+ monthIndex;
            return {day: day, month: newMonth,year: newYear};
        }
        else if(monthIndex >= curMonthSize){
            let newMonth = currentMonth + 1;
            let newYear = currentYear;
            if(currentMonth +1 > 12){
                newMonth = 0;
                newYear++;
            }

            let day = (monthIndex - curMonthSize);
            return {day: day, month: newMonth,year: newYear};
        }
        else{
            let newMonth = currentMonth;
            let newYear = currentYear;
            let day = monthIndex;
            return {day: day, month: newMonth,year: newYear};
        }
    }

    for(let i = 0; i < calenderEvents.length; i++){
        calenderEvents[i].parentNode.removeChild(calenderEvents[i]);
    }
    calenderEvents = [];

    for(let i = 0; i < 6; i++){
        for(let j = 0;j <7; j++){

            let dayDate = getDate(i,j);

            let day = document.getElementById("MonthDay"+ i + "-" + j);   
            
            if(dayDate.month !== currentMonth){
                day.style.opacity = 0.5;
            }
            else{
                day.style.opacity = 1;
                
            }

            let dayTitle = document.getElementById("MonthDayTitle"+ i + "-" + j);          
            dayTitle.innerText = (dayDate.month + 1) + "/" + (dayDate.day + 1);
            
            let events = GetEvents();
            
            for(let event = 0;event < events.length; event ++){
                let eventThisDay = false;

                let stringDate = events[event].date.split("-");

                if(parseInt(stringDate[1]) === dayDate.month + 1 && parseInt(stringDate[2]) === dayDate.day + 1 && parseInt(stringDate[0]) === dayDate.year){
                    eventThisDay = true;
                }

                if(eventThisDay){
                    let dayData = document.getElementById("MonthDayData" + i + "-"+ j);

                    let curDayData = document.createElement("button");
                    curDayData.className = "MonthDayData";
                    curDayData.innerText = events[event].name;

                    curDayData.onclick = () => {
                        setEventEdit(events[event].name, events[event]);
                        openEventEditMode();
                    }

                    dayData.appendChild(curDayData);

                    calenderEvents[calenderEvents.length] = curDayData;
                }
            }
            

        }
    }

    console.log("Updated Month View");
};


if(currentView === "Month"){ 
    dayView.style.display = "none";
    monthView.style.display = "flex";
}
else{
    monthView.style.display = "none";
    dayView.style.display = "flex";
}

//Day View

const dayCount = 3;
var currentDay = todayDate;

const makeDayView = () => {
    

    let dayView = document.getElementById("DayView");
    for(let i  = 0 ; i < dayCount; i++){
        let dayCard = document.createElement("div");
        dayCard.className = "DayCard";
        dayCard.id = "DayCard"+i;
        dayView.appendChild(dayCard);

        let dayTitle = document.createElement("h2");
        dayTitle.className = "DayTitle";
        dayTitle.id = "DayTitle" + i;
        //dayTitle.innerText = "Date";
        dayCard.appendChild(dayTitle);

        let dayDay = document.createElement("h3");
        dayDay.className = "DayDay";
        dayDay.id = "DayDay" + i;
        //dayTitle.innerText = "Date";
        dayCard.appendChild(dayDay);

        let dayItemHolder = document.createElement("div");
        dayItemHolder.className = "DayItemsHolder";
        dayItemHolder.id = "DayItemsHolder" + i;
        dayCard.appendChild(dayItemHolder);
        /*
        let dayItem = document.createElement("button");
        dayItem.className = "DayItem";
        dayItem.innerText = "Do the laundry - 7pm";
        dayItemHolder.appendChild(dayItem);
        */
        let addEventBtn = document.createElement("button");
        addEventBtn.className = "AddDayEvent";
        addEventBtn.id = "AddDayEvent" + i;
        dayCard.appendChild(addEventBtn);

        let eventBtnTxt = document.createElement("h2");
        eventBtnTxt.className = "AddEventTxt";
        eventBtnTxt.innerText = "Add Event";
        addEventBtn.appendChild(eventBtnTxt);
    }

    console.log("Made Day View");
}
makeDayView();

var dayViewEvents = [];
const updateDayView = () =>{
    for(let i = 0; i < dayViewEvents.length; i++){
        dayViewEvents[i].parentNode.removeChild(dayViewEvents[i]);
    }
    dayViewEvents = [];

    for(var i = 0;i < dayCount; i++){
        let center = Math.floor(dayCount / 2);
        let offset = i - center;
        
        let curDay = currentDay.getDate() + offset;
        let curMonth = currentDay.getMonth();
        let curYear = currentDay.getFullYear();
        if(curDay <=0){
            if(curMonth <= 0){
                curMonth = 11;
                curYear--;
            }
            else{
                curMonth--;
            }

            curDay = getMonthSize(curMonth, curYear) + curDay;
        }
        else if(curDay > getMonthSize(curMonth, curYear)){
            curDay = (curDay - getMonthSize(curMonth, curYear));
            if(curMonth > 11){
                curMonth = 0;
                curYear++;
            }
            else{
                curMonth++;
            }
            
        }

        let curMonthString = "January";

        switch(curMonth){
            case 0: 
                curMonthString = "January";
                break;
            case 1: 
                curMonthString = "February";
                break;
            case 2: 
                curMonthString = "March";
                break;
            case 3: 
                curMonthString = "April";
                break;
            case 4: 
                curMonthString = "May";
                break;
            case 5: 
                curMonthString = "June";
                break;
            case 6: 
                curMonthString = "July";
                break;
            case 7: 
                curMonthString = "August";
                break;
            case 8: 
                curMonthString = "September";
                break;
            case 9: 
                curMonthString = "October";
                break;
            case 10: 
                curMonthString = "November";
                break;
            case 11: 
                curMonthString = "December";
                break;
        }   

        let dayTitle = document.getElementById("DayTitle" + i);

        let dayInd = currentDay.getDay() + offset;
        while(dayInd< 0){
            dayInd = 7 + dayInd;
        }
        dayInd = dayInd% 7;

        switch(dayInd){
            case 0:
                dayTitle.innerText = "Sunday";
                break;
            case 1:
                dayTitle.innerText = "Monday";
                break;
            case 2:
                dayTitle.innerText = "Tuesday";
                break;
            case 3:
                dayTitle.innerText = "Wednesday";
                break;
            case 4:
                dayTitle.innerText = "Thursday";
                break;
            case 5:
                dayTitle.innerText = "Friday";
                break;
            case 6:
                dayTitle.innerText = "Saturday";
                break;
        }

        let todayDate = new Date();
        

        let dayDay = document.getElementById("DayDay" + i);

        let end  = "th";
        if(curDay >= 10 && curDay <= 20){
            end = "th";
        }
        else if(curDay % 10 === 1){
            end = "st";
        }
        else if(curDay % 10 === 2){
            end = "nd";
        }
        else if(curDay % 10 === 3){
            end = "rd";
        }
        
        dayDay.innerText = curMonthString + " " + curDay + end;

        if(curDay === todayDate.getDate() && curMonth === todayDate.getMonth() && curYear === todayDate.getFullYear()){
            dayDay.innerText= "Today\n\n"+ dayDay.innerText;
        }

        let dayData = document.getElementById("DayItemsHolder" + i);

        let dayScheduales = [];

        let events = GetEvents();

        for (let event = 0; event < events.length; event++) {
            let eventThisDay = false;

            let stringDate = events[event].date.split("-");
            
            if (parseInt(stringDate[1]) === curMonth+1 && parseInt(stringDate[2]) === curDay  && parseInt(stringDate[0]) === curYear) {
                eventThisDay = true;
            }

            if (eventThisDay) {
                if(events[event].allDay){
                    for(let s = dayScheduales.length -1 ; s >= 0 ; s--){
                        dayScheduales[s+1] = dayScheduales[s];
                    }
                    dayScheduales[0] = events[event].name + " | " + "event";
                }
                else{
                    let addedEvent = false;

                    let curTime = events[event].time;
                    let curTimeSeperate = curTime.split(":");

                    for(let e =0;e < dayScheduales.length; e++){
                        let checkTime = dayScheduales[e].split(" | ")[0];
                        let checkTimeSeperate = checkTime.split(":");
                        
                        if(parseInt(checkTimeSeperate[0]) > parseInt(curTimeSeperate[0])){
                            for(let s = dayScheduales.length -1 ; s >= e ; s--){
                                dayScheduales[s+1] = dayScheduales[s];
                            }
                            dayScheduales[e] = events[event].time + " | " + events[event].name + " | " + "event";
                            addedEvent = true;
                            break;
                        }
                        else if(parseInt(checkTimeSeperate[0]) === parseInt(curTimeSeperate[0])){
                            if(parseInt(checkTimeSeperate[1]) >= parseInt(curTimeSeperate[1])){
                                for(let s = dayScheduales.length -1 ; s >= e ; s--){
                                    dayScheduales[s+1] = dayScheduales[s];
                                }
                                dayScheduales[e] = events[event].time + " | " + events[event].name + " | " + "event";
                                addedEvent = true;
                                break;
                            }
                        }
                    }
                    if(!addedEvent){
                        dayScheduales[dayScheduales.length] = events[event].time + " | " + events[event].name  + " | " + "event";
                    }
                }
                /*
                let curDayData = document.createElement("button");
                curDayData.className = "DayItem";
                curDayData.innerText = events[event].name;
                curDayData.style.backgroundColor = "#c7a354"
                dayData.appendChild(curDayData);

                dayViewEvents[dayViewEvents.length] = curDayData;

                curDayData.onclick = () => {
                    setEventEdit(events[event].name, events[event]);
                    openEventEditMode();
                }
                */
            }
        }
    
        let schedules = GetScheduales();
        let curDayWeek = new Date(curYear,curMonth,curDay).getDay();

        for (let sched = 0; sched < schedules.length; sched++) {         
            for (let event = 0; event < schedules[sched].events.length; event++) {
                if (schedules[sched].events[event].days[curDayWeek]) {
                    let addedEvent = false;

                    let curTime = schedules[sched].events[event].time;
                    let curTimeSeperate = curTime.split(":");

                    for(let e =0;e < dayScheduales.length; e++){
                        let checkTime = dayScheduales[e].split(" | ")[0];
                        let checkTimeSeperate = checkTime.split(":");
                        
                        if(parseInt(checkTimeSeperate[0]) > parseInt(curTimeSeperate[0])){
                            for(let s = dayScheduales.length -1 ; s >= e ; s--){
                                dayScheduales[s+1] = dayScheduales[s];
                            }
                            dayScheduales[e] = schedules[sched].events[event].time + " | " + schedules[sched].events[event].name + " | " + schedules[sched].name + " | " +"sched";
                            addedEvent = true;
                            break;
                        }
                        else if(parseInt(checkTimeSeperate[0]) === parseInt(curTimeSeperate[0])){
                            if(parseInt(checkTimeSeperate[1]) >= parseInt(curTimeSeperate[1])){
                                for(let s = dayScheduales.length -1 ; s >= e ; s--){
                                    dayScheduales[s+1] = dayScheduales[s];
                                }
                                dayScheduales[e] = schedules[sched].events[event].time + " | " + schedules[sched].events[event].name + " | " + schedules[sched].name + " | " + "sched";
                                addedEvent = true;
                                break;
                            }
                        }
                    }
                    if(!addedEvent){
                        dayScheduales[dayScheduales.length] = schedules[sched].events[event].time + " | " + schedules[sched].events[event].name + " | " + schedules[sched].name + " | " + "sched";
                    }
                }
                //console.log(schedules[sched].events[event].name + "::" + curDayWeek + "::" + schedules[sched].events[event].days[curDayWeek]);
            }
        }


        //console.log(dayScheduales);
        for(let s = 0; s < dayScheduales.length; s++){
            
            let curDayData = document.createElement("button");
            curDayData.className = "DayItem";

            let dayEventData = dayScheduales[s];
            let dayEventDataSplit = dayEventData.split(" | ");
            
            if(dayEventDataSplit.length === 2){
                curDayData.innerText = dayEventDataSplit[0];
                curDayData.style.backgroundColor = "#c7a354";

                curDayData.onclick = () => {
                    let eventData =  null;
                    
                    for(let event = 0; event< events.length; event++){
                        if(events[event].name == dayEventDataSplit[0]){
                            eventData = events[event];
                        }
                    }

                    if(!eventData){
                        return;
                    }

                    setEventEdit(dayEventDataSplit[0], eventData);
                    openEventEditMode();
                }
                dayData.appendChild(curDayData);
                dayViewEvents[dayViewEvents.length] = curDayData;
                continue;
            }

            let dayEventTime = dayEventDataSplit[0].split(":");

            if(parseInt(dayEventTime[0]) > 12){
                
                curDayData.innerText = parseInt(dayEventTime[0]) - 12 + ":" + dayEventTime[1] + " pm | " + dayEventDataSplit[1];
            }
            else{
                if(parseInt(dayEventTime[0]) === 12){
                    curDayData.innerText = dayEventDataSplit[0] + " pm | " + dayEventDataSplit[1];
                }
                else if(parseInt(dayEventTime[0]) === 0){
                    curDayData.innerText = 12 +":" + dayEventDataSplit[0].split(":")[1] + " am | " + dayEventDataSplit[1];
                }
                else{
                    curDayData.innerText = dayEventDataSplit[0] + " am | " + dayEventDataSplit[1];
                }
            }

            if(dayEventDataSplit[dayEventDataSplit.length - 1] === "event"){

                curDayData.onclick = () => {
                    let eventData =  null;
                    
                    for(let event = 0; event< events.length; event++){
                        if(events[event].name == dayEventDataSplit[1]){
                            eventData = events[event];
                        }
                    }

                    if(!eventData){
                        return;
                    }

                    setEventEdit(dayEventDataSplit[1], eventData);
                    openEventEditMode();
                }

                curDayData.style.backgroundColor = "#c7a354";
            }
            else if(dayEventDataSplit[dayEventDataSplit.length - 1] === "sched"){
                curDayData.onclick = () => {
                    let schedData =  null;
                    
                    for(let sched = 0;sched < schedules.length; sched++){
                        if(schedules[sched].name == dayEventDataSplit[2]){
                            schedData = schedules[sched];
                        }
                    }

                    if(!schedData){
                        return;
                    }

                    setSchedualeEdit(dayEventDataSplit[2], schedData);
                    openSchedEditMode();
                }
            }

            //curDayData.innerText = dayScheduales[s];
            dayData.appendChild(curDayData);

            dayViewEvents[dayViewEvents.length] = curDayData;
        }
        
    }

    console.log("Updated Day View");
}


const changeViewsButton = () => {
    if(currentView === "Month"){
        monthView.style.display = "none";
        dayView.style.display = "flex";
        currentView = "Day";
    }
    else{
        dayView.style.display = "none";
        monthView.style.display = "flex";
        currentView = "Month";
    }
}
document.getElementById("ChangeViewsHeader").onclick = changeViewsButton;

export function upadteViews(){
    updateMonthView();
    updateDayView();
}
sendViewsUpdate(upadteViews);

const waitDataFunc = () => {
    setTimeout(function() {
        if(GetScheduales() && GetEvents()){
            updateMonthView();
            updateDayView();
            return;
        }
        else{
            //console.log(GetScheduales)
            waitDataFunc();
        }
        
    }, 500);
}

waitDataFunc();

const rightButtonPressed = () => {
    console.log(currentView)
    if(currentView === "Day"){
       let dayAddAmount = Math.ceil(dayCount / 2);
       let curDay = currentDay.getDate() + dayAddAmount;
       let curMonth = currentDay.getMonth();
       let curYear = currentDay.getFullYear();

       if(curDay <=0){
           if(curMonth <= 0){
               curMonth = 11;
               curYear--;
           }
           else{
               curMonth--;
           }

           curDay = getMonthSize(curMonth, curYear) + curDay;
       }
       else if(curDay > getMonthSize(curMonth, curYear)){
           curDay = (curDay - getMonthSize(curMonth, curYear));
           if(curMonth > 11){
               curMonth = 0;
               curYear++;
           }
           else{
               curMonth++;
           }
       }

       currentDay = new Date(curYear,curMonth,curDay);
       updateDayView();
    }
    else{
        currentMonth++;
        if(currentMonth > 11){
            currentYear++;
            currentMonth = 0;
        }
        updateMonthView();
    }
}

document.getElementById("CalenderRight").onclick = rightButtonPressed;

const leftButtonPressed = () => {
   if(currentView === "Day"){
      let dayAddAmount = -Math.ceil(dayCount / 2);
      let curDay = currentDay.getDate() + dayAddAmount;
      let curMonth = currentDay.getMonth();
      let curYear = currentDay.getFullYear();

      if(curDay <=0){
          if(curMonth <= 0){
              curMonth = 11;
              curYear--;
          }
          else{
              curMonth--;
          }

          curDay = getMonthSize(curMonth, curYear) + curDay;
      }
      else if(curDay > getMonthSize(curMonth, curYear)){
          curDay = (curDay - getMonthSize(curMonth, curYear));
          if(curMonth > 11){
              curMonth = 0;
              curYear++;
          }
          else{
              curMonth++;
          }
      }

      currentDay = new Date(curYear,curMonth,curDay);
      updateDayView();
   }
   else{
       currentMonth--;
       if(currentMonth < 0){
           currentYear--;
           currentMonth = 11;
       }
       updateMonthView();
   }
}
document.getElementById("CalenderLeft").onclick = leftButtonPressed;

export function getOpenEventEdit(func){
    openEventEditMode = func;
}

export function getOpenSchedEdit(func){
    openSchedEditMode = func;
}