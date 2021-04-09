let nameTag = document.getElementById("NavNameTag");

if(nameTag.innerText.length > 0){
    document.getElementById("NavBtnLoggedOut").style.display = "none";
}
else{
    document.getElementById("NavBtnLoggedIn").style.display = "none";
}
