function fixed (){
    document.getElementById("lalg").style.display = "inline-flex";
    document.getElementById("lfrtfit").style.display = "inline-flex";
    document.getElementById("lwrtfit").style.display = "none";
    document.getElementById("lbstfit").style.display = "inline-flex";
    if(document.getElementById("prtfixed").checked = true){
        document.getElementById("prtvar").disabled = true;
    } else{
        document.getElementById("prtvar").removeAttribute("disable");
    }
}

function variable (){
    document.getElementById("lalg").style.display = "inline-flex";
    document.getElementById("lwrtfit").style.display ="inline-flex";
    document.getElementById("lfrtfit").style.display ="inline-flex";
    document.getElementById("lbstfit").style.display ="none";
    if(document.getElementById("prtvar").checked = true){
        document.getElementById("prtfixed").disabled = true;
    } else{
        document.getElementById("prtfixed").removeAttribute("disable");
    }
}

