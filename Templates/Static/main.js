function checked() {
    var btnfix = document.getElementById ("prtfixed");
    var btnvar = document.getElementById("prtvar");
    if(btnfix.click === true){
        document.getElementById ("wrtfit").disabled = true;
    }else{
        if(btnvar.click === true){
            document.getElementById ("bstfit").disabled = true;
        }
    }
}
