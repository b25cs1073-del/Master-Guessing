
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
    let guessInput = document.getElementById("guessInput").value;
    let message = document.getElementById("message");

    // 1. Check karo agar input khali hai
    if (guessInput === "") {
        message.innerHTML = "⚠ Enter a valid number";
        message.style.color = "#f87171"; // Red color
        return;
    }

    let guess = Number(guessInput);

    // 2. JAB USER WIN HO JAYE (Sahi guess kare) 🎉
    if (guess === randomNumber) {
        message.innerHTML = "🎉 Congratulations! You Won!";
        message.style.color = "#22c55e"; // Ekdum mast Green color
        
        // Total score update aur save karne ke liye
        totalScore += score;
        localStorage.setItem("totalScore", totalScore);
        
        const totalScoreDisplay = document.getElementById("totalScoreDisplay");
        if (totalScoreDisplay) {
            totalScoreDisplay.innerHTML = totalScore;
        }
        return; // Yahin se baahar nikal jao, niche ka code mat chalao!
    } 

    // 3. Agar guess galat hai, toh attempts aur score kam karo
    attempts--;
    score -= 10;

    document.getElementById("attempts").innerHTML = attempts;
    document.getElementById("score").innerHTML = score;

    // 4. Game Over check
    if (attempts === 0) {
        message.innerHTML = `💀 Game Over! Number was ${randomNumber}`;
        message.style.color = "#f87171";
        return;
    }

    // 5. Galat guess par high/low ka hint do
    if (guess > randomNumber) {
        message.innerHTML = "📈 Too High! Try Lower";
        message.style.color = "#38bdf8"; // Blue color
    } else {
        message.innerHTML = "📉 Too Low! Try Higher";
        message.style.color = "#38bdf8"; // Blue color
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
