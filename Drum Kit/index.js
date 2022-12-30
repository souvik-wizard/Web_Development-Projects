let len=document.querySelectorAll(".drum").length;
for (let i=0;i<len;i++ ){
    document.querySelectorAll(".drum")[i].addEventListener("click", function(){
        this.style.color="white"

        let enteredkey=this.innerHTML
        forSound(enteredkey)
        animation(enteredkey)

    })}
 

document.addEventListener("keypress", function(event){
    forSound(event.key)
    animation(event.key)
})


function forSound(key){
    switch (key) {
        case "w":
            var crash=new Audio('sounds/crash.mp3');  
            crash.play();
        case "a":
            var kick=new Audio('sounds/kick.mp3');  
            kick.play();
        case "s":
            var snare=new Audio('sounds/snare.mp3');  
            snare.play();
        case "d":
            var tom1=new Audio('sounds/tom-1.mp3');  
            tom1.play();
        case "j":
            var tom2=new Audio('sounds/tom-2.mp3');  
            tom2.play();
        case "k":
            var tom3=new Audio('sounds/tom-3.mp3');  
            tom3.play();
        case "l":
            var tom4=new Audio('sounds/tom-4.mp3');  
            tom4.play();

            break;
    
        default:console.log(key+" - Entered Key Not listed")
            break;
    }
}

function animation(currentkey){
    let pressedButton=document.querySelector("."+ currentkey)
    pressedButton.classList.add("pressed")

    setTimeout(function(){pressedButton.classList.remove("pressed")},100)

}