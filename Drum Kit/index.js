let len=document.querySelectorAll(".drum").length;
for (let i=0;i<len;i++ ){
    document.querySelectorAll(".drum")[i].addEventListener("click", function(){
        this.style.color="White"
    })}
    // var audio=new Audio('sounds/crash.mp3');  
    // audio.play();