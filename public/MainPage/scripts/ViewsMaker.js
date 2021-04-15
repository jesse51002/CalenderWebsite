var currentView = "Month";

const monthView = document.getElementById("MonthView");
const dayView = document.getElementById("DayView");

var todayDate = new Date();
var currentMonth = todayDate.getMonth();
var currentYear = todayDate.getFullYear();

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

            let dayDayCur = document.createElement("div");
            dayDayCur.className = "MonthDayData";
            dayDayCur.innerText = "Things";
            dayData.appendChild(dayDayCur);
        }
    }
}
makeMonthView();

const updateMonthView = () => {
    const startOffset = new Date(currentYear, currentMonth, 1).getDay();

    const getDate = (i,j) =>{

        

        const monthIndex = (i * 7) + j - startOffset;
        console
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


        }
    }
};
updateMonthView();

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
        dayTitle.innerText = "Date";
        dayCard.appendChild(dayTitle);

        let dayItemHolder = document.createElement("div");
        dayItemHolder.className = "DayItemsHolder";
        dayItemHolder.id = "DayItemsHolder" + i;
        dayCard.appendChild(dayItemHolder);

        let dayItem = document.createElement("button");
        dayItem.className = "DayItem";
        dayItem.innerText = "Do the laundry - 7pm";
        dayItemHolder.appendChild(dayItem);

        let addEventBtn = document.createElement("button");
        addEventBtn.className = "AddDayEvent";
        addEventBtn.id = "AddDayEvent" + i;
        dayCard.appendChild(addEventBtn);

        let eventBtnTxt = document.createElement("h2");
        eventBtnTxt.className = "AddEventTxt";
        eventBtnTxt.innerText = "Add Event";
        addEventBtn.appendChild(eventBtnTxt);
    }
}
makeDayView();

const updateDayView = () =>{
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

        let end  = "th";
        if(curDay % 10 === 1){
            end = "st";
        }
        else if(curDay % 10 === 2){
            end = "nd";
        }
        else if(curDay % 10 === 3){
            end = "rd";
        }

        let dayTitle = document.getElementById("DayTitle" + i);

        dayTitle.innerText = curMonthString + " " + curDay + end;
    }
}
updateDayView();

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


