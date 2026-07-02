import "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js";

const firebaseConfig = {
   apiKey: "AIzaSyDyKVxvY5VIqcc9ObayEmkCdP1Id90wyMI",
   authDomain: "kartik-number-guessing-game.firebaseapp.com",
   projectId: "kartik-number-guessing-game",
   storageBucket: "kartik-number-guessing-game.firebasestorage.app",
   messagingSenderId: "1025033744157",
   appId: "1:1025033744157:web:f97901bccc04302fa4bbf4",
   measurementId: "G-ZFN8G36PXS"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

let isLoginMode = true;

window.toggleForm = function() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById("form-title");
    const subtitle = document.getElementById("form-subtitle");
    const mainBtn = document.getElementById("mainBtn");
    const toggleLink = document.getElementById("toggleLink");
    const message = document.getElementById("message");
    const nameFieldWrapper = document.getElementById("nameFieldWrapper"); 
    
    if(message) message.innerHTML = "";

    if (!isLoginMode) {
        title.innerHTML = "Player Sign Up";
        subtitle.innerHTML = "Create an account to start playing";
        mainBtn.innerHTML = "Sign Up";
        toggleLink.innerHTML = "Already have an account? Login";
        if(nameFieldWrapper) nameFieldWrapper.style.display = "block";
    } else {
        title.innerHTML = "Player Login";
        subtitle.innerHTML = "Login to save your high scores";
        mainBtn.innerHTML = "Login";
        toggleLink.innerHTML = "Don't have an account? Sign Up";
        if(nameFieldWrapper) nameFieldWrapper.style.display = "none";
    }
}

window.handleAuth = function() {
    const email = document.getElementById("emailInput").value.trim();
    const password = document.getElementById("passwordInput").value;
    const message = document.getElementById("message");
    const nameInput = document.getElementById("nameInput");

    if(!email || !password) {
        message.style.color = "#ef4444";
        message.innerHTML = "⚠ Please fill all fields";
        return;
    }

    // Har naye login/signup par pichle browser tab ka data clean karein
    sessionStorage.clear();

    if (isLoginMode) {
        // --- LOGIN LOGIC ---
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => { 
                const user = userCredential.user;
                
                // Firestore database se is user UID ka permanent username uthao
                db.collection("leaderboard").doc(user.uid).get()
                .then((doc) => {
                    let displayName = email.split('@')[0]; // Safe fallback name
                    let finalScore = 0;

                    if(doc.exists) {
                        displayName = doc.data().username || displayName;
                        finalScore = doc.data().totalScore || 0;
                    }

                    sessionStorage.setItem("currentUsername", displayName); 
                    sessionStorage.setItem("totalScore", finalScore);
                    sessionStorage.setItem("playerLoggedIn", "true"); 
                    sessionStorage.setItem("currentUserUid", user.uid); 

                    window.location.href = "game.html"; 
                });
            })
            .catch((error) => {
                message.style.color = "#ef4444";
                message.innerHTML = "❌ " + error.message;
            });
    } else {
        // --- SIGN UP LOGIC ---
        let nameValue = nameInput ? nameInput.value.trim() : "";
        
        // Name validation sirf signup mode ke liye strict rakha hai
        if(!nameValue) {
            message.style.color = "#ef4444";
            message.innerHTML = "⚠ Please enter your name before signing up";
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => { 
                const user = userCredential.user;

                // Cloud Firestore mein document key user.uid banai hai taaki accounts separate rahein
                db.collection("leaderboard").doc(user.uid).set({
                    uid: user.uid,
                    username: nameValue,
                    totalScore: 0,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    sessionStorage.setItem("currentUsername", nameValue);
                    sessionStorage.setItem("totalScore", "0");
                    sessionStorage.setItem("playerLoggedIn", "true"); 
                    sessionStorage.setItem("currentUserUid", user.uid);

                    message.style.color = "#22c55e";
                    message.innerHTML = "🎉 Account Created! Logging in...";
                    setTimeout(() => {
                        window.location.href = "game.html";
                    }, 1500);
                })
                .catch((err) => {
                    console.error("Firestore Error: ", err);
                    window.location.href = "game.html";
                });
            })
            .catch((error) => {
                message.style.color = "#ef4444";
                message.innerHTML = "❌ " + error.message;
            });
    }
}
