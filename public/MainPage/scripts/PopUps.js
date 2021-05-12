import {openSchedualeManger, closeSchedualeManger, schedRecieveClosedFunc} from './PopUps/SchedualeManager.js'
import {openEventManager, closeEventManager, eventRecieveClosedFunc} from './PopUps/EventManager.js'
import {OpenDataManager, CloseDataManager, dataRecieveClosedFunc, getEditSchedViewFunc, getNewSchedViewFunc} from './PopUps/DataManager.js'
import {getOpenEventEdit, getOpenSchedEdit} from "./ViewsMaker.js"

var curPopUp = null;

var closeOpenPopUp = () => {
    if(curPopUp === null){
        return;
    }
    else if(curPopUp === "EventManager"){
        closeEventManager();
        curPopUp = null;
    }
    else if(curPopUp === "SchedualeManager"){
        closeSchedualeManger();
        curPopUp = null;
    }
    else if(curPopUp === "DataManager"){
        CloseDataManager();
        curPopUp = null;
    }
}

document.getElementById("NewSchedualeHeader").onclick = () => {
    if(curPopUp === null){
        openSchedualeManger("create");
        curPopUp = "SchedualeManager";
        
    }
    else if(curPopUp !== "SchedualeManager"){
        closeOpenPopUp();
        openSchedualeManger("create");
        curPopUp = "SchedualeManager";
    }
    else{
        closeOpenPopUp();
    }
};

document.getElementById("NewEventHeader").onclick = () => {
    if(curPopUp === null){
        openEventManager("create");
        curPopUp = "EventManager";
    }
    else if(curPopUp !== "EventManager"){
        closeOpenPopUp();
        openEventManager("create");
        curPopUp = "EventManager";
    }
    else{
        closeOpenPopUp();
    }
};

document.getElementById("ManageEventsHeader").onclick = () => {
    if(curPopUp === null){
        OpenDataManager();
        curPopUp = "DataManager";
    }
    else if(curPopUp !== "DataManager"){
        closeOpenPopUp();
        OpenDataManager();
        curPopUp = "DataManager";
    }
    else{
        closeOpenPopUp();
    }
}

var closedPopUp = (name) =>{
    if(name === curPopUp){
        curPopUp = null;
    }
}

var openSchedEditView = () => {
    if(curPopUp !== "SchedualeManager"){
        closeOpenPopUp();
    }
    
    openSchedualeManger("edit");
}

var openSchedNomralView = () => {
    if(curPopUp !== "SchedualeManager"){
        closeOpenPopUp();
    }
    
    openSchedualeManger("create");
}

var openEventEditView = () => {
    closeOpenPopUp();

    openEventManager("edit");
}

schedRecieveClosedFunc(closedPopUp);
eventRecieveClosedFunc(closedPopUp);
dataRecieveClosedFunc(closedPopUp);
getEditSchedViewFunc(openSchedEditView);
getNewSchedViewFunc(openSchedNomralView);
getOpenEventEdit(openEventEditView);
getOpenSchedEdit(openSchedEditView);




