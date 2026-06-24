
if (!localStorage.getItem("playerLoggedIn")) {
    window.location.href = "login.html";
}

let randomNumber = Math.floor(Math.random() * 100) + 1;
// let randomNumber = Math.floor(Math.random() * 100) + 1;

let attempts = 10;
let score = 100; 


let totalScore = localStorage.getItem("totalScore") ? Number(localStorage.getItem("totalScore")) : 0;


document.addEventListener("DOMContentLoaded", () => {
    const totalScoreDisplay = document.getElementById("totalScoreDisplay"); 
    if (totalScoreDisplay) {
        totalScoreDisplay.innerHTML = totalScore;
    }
});

//

function checkGuess() {
    let guess = Number(document.getElementById("guessInput").value);
    let message = document.getElementById("message");

    if(guess === randomNumber){
        message.innerHTML = "⚠ Enter a valid number";
        return;
    }


    
    if(guess === randomNumber){
    message.innerHTML = "🎉 Congratulations! You Won!";
    message.style.color = "#22c55e";
    
   
    totalScore += score;
    
  
    localStorage.setItem("totalScore", totalScore);
    
  
    const totalScoreDisplay = document.getElementById("totalScoreDisplay");
    if (totalScoreDisplay) {
        totalScoreDisplay.innerHTML = totalScore;
    }
    return;
} 
//

    attempts--;
    score -= 10;

    document.getElementById("attempts").innerHTML = attempts;
    document.getElementById("score").innerHTML = score;

    if(attempts === 0){
        message.innerHTML = `💀 Game Over! Number was ${randomNumber}`;
        return;
    }

    if(guess > randomNumber){
        message.innerHTML = "📈 Too High! Try Lower";
    }
    else{
        message.innerHTML = "📉 Too Low! Try Higher";
    }
}

function restartGame(){
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 10;
    score = 100;

    document.getElementById("attempts").innerHTML = attempts;
    document.getElementById("score").innerHTML = score;
    document.getElementById("message").innerHTML = "Start guessing...";
    document.getElementById("message").style.color = "white"; 
    document.getElementById("guessInput").value = "";
}

// ==========================================
// PARTICLES CONFIGURATION BACKGROUND CODE
// ==========================================
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#a9cce3" }, 
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { 
            "enable": true, 
            "distance": 150, 
            "color": "#a9cce3", 
            "opacity": 0.4, 
            "width": 1 
        },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": { "enable": true, "mode": "grab" }, 
            "onclick": { "enable": true, "mode": "push" }
        }
    },
    "retina_detect": true
});
