




import "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js";

// Aapka verified Firebase Config Object
const firebaseConfig = {
     apiKey: "AIzaSyDyKVxvY5VIqcc9ObayEmkCdP1Id90wyMI",

//   apiKey: "AIzaSyDyKVxvy5VIqcc90bayEmkCdP1Id90wyMI",
  authDomain: "kartik-number-guessing-game.firebaseapp.com",
  projectId: "kartik-number-guessing-game",
  storageBucket: "kartik-number-guessing-game.firebasestorage.app",
  messagingSenderId: "1025033744157",
  appId: "1:1025033744157:web:f97901bccc04302fa4bbf4",
  measurementId: "G-ZFN8G36PXS"
};

// Initialize Firebase using compat mode
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let isLoginMode = true;

// Screen toggle handle karne ke liye global window objects
window.toggleForm = function() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById("form-title");
    const subtitle = document.getElementById("form-subtitle");
    const mainBtn = document.getElementById("mainBtn");
    const toggleLink = document.getElementById("toggleLink");
    const message = document.getElementById("message");
    
    message.innerHTML = "";

    if (!isLoginMode) {
        title.innerHTML = "Player Sign Up";
        subtitle.innerHTML = "Create an account to start playing";
        mainBtn.innerHTML = "Sign Up";
        toggleLink.innerHTML = "Already have an account? Login";
    } else {
        title.innerHTML = "Player Login";
        subtitle.innerHTML = "Login to save your high scores";
        mainBtn.innerHTML = "Login";
        toggleLink.innerHTML = "Don't have an account? Sign Up";
    }
}

// Signup aur Login handler function
window.handleAuth = function() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const message = document.getElementById("message");

    if(!email || !password) {
        message.style.color = "#ef4444";
        message.innerHTML = "⚠ Please fill all fields";
        return;
    }

    if (isLoginMode) {
        // Login Processing
        auth.signInWithEmailAndPassword(email, password)
            .then(() => { 
                localStorage.setItem("playerLoggedIn", "true"); 
                window.location.href = "index.html"; 
            })
            .catch((error) => {
                message.style.color = "#ef4444";
                message.innerHTML = "❌ " + error.message;
            });
    } else {
        // Sign Up Processing
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => { 
                 localStorage.setItem("playerLoggedIn", "true"); 
                message.style.color = "#22c55e";
                message.innerHTML = "🎉 Account Created! Logging in...";
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            })
            .catch((error) => {
                message.style.color = "#ef4444";
                message.innerHTML = "❌ " + error.message;
            });
    }
}

// Background Particles initialization code
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#a9cce3" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5 },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#a9cce3", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2 }
    }
});
