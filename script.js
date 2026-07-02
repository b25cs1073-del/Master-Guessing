// 🔥 BUG FIX: Akela tab memory segregation karne ke liye sessionStorage use kiya hai
if (!sessionStorage.getItem("playerLoggedIn")) {
    window.location.href = "index.html";
}

let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 10;
let score = 100; 
let totalScore = sessionStorage.getItem("totalScore") ? Number(sessionStorage.getItem("totalScore")) : 0;

document.addEventListener("DOMContentLoaded", () => {
    updateTotalScoreDisplays();
});

// 🏆 REAL-TIME CLOUD FIRESTORE LEADERBOARD LOGIC
function updateTotalScoreDisplays() {
    // 1. Game screen par total score card update karo
    const totalScoreDisplay = document.getElementById("totalScoreDisplay"); 
    if (totalScoreDisplay) totalScoreDisplay.innerHTML = totalScore;

    // 2. Agar screen par leaderboard container nahi hai toh ruk jao
    const leaderboardBody = document.getElementById("leaderboard-body");
    if (!leaderboardBody) return;

    // SessionStorage se current player ka live naam aur identity nikalo
    let savedUsername = sessionStorage.getItem("currentUsername") || "Player (You)";
    let currentUserUid = sessionStorage.getItem("currentUserUid");

    // Pehle se fix dummy players ka data list array
    let playersList = [
        { name: "Rahul_King", score: 320, isCurrentUser: false },
        { name: "Amit_Coder", score: 240, isCurrentUser: false },
        { name: "Ninja_Guess", score: 150, isCurrentUser: false }
    ];

    // 🌟 Firebase Firestore se baaki sabhi real players ka live score lekar aao
    firebase.firestore().collection("leaderboard").get()
    .then((querySnapshot) => {
        let firebasePlayers = [];
        
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            // Hum check karenge ki kya yeh login account ka unique ID hai
            if(data.username && data.totalScore !== undefined) {
                let isItMe = (doc.id === currentUserUid || data.username === savedUsername);
                firebasePlayers.push({
                    name: data.username,
                    score: Number(data.totalScore),
                    isCurrentUser: isItMe
                });
            }
        });

        // Agar current user ka data abhi Firebase par nahi hai, toh temporarily locally add karo
        let isCurrentUserExist = firebasePlayers.some(p => p.isCurrentUser);
        if (!isCurrentUserExist) {
            firebasePlayers.push({ name: savedUsername, score: totalScore, isCurrentUser: true });
        }

        // Dono data lists (Firebase + Dummy) ko aapas me merge karo
        let finalMap = new Map();
        [...firebasePlayers, ...playersList].forEach(p => {
            if(!finalMap.has(p.name) || p.isCurrentUser) {
                finalMap.set(p.name, p);
            }
        });

        let sortedPlayers = Array.from(finalMap.values());

        // 🌟 HIGHEST SCORE KE MUTABIK LIST KO SORT KARO
        sortedPlayers.sort((a, b) => b.score - a.score);

        // Purani local grid table rows saaf karo
        leaderboardBody.innerHTML = "";

        // Loop chalakar dynamic elements table par chipkao
        sortedPlayers.forEach((player, index) => {
            let rankEmoji = "";
            let rowClass = "";

            if (index === 0) rankEmoji = "🥇 1";
            else if (index === 1) rankEmoji = "🥈 2";
            else if (index === 2) rankEmoji = "🥉 3";
            else rankEmoji = `🎖️ ${index + 1}`;

            if (player.isCurrentUser) {
                rowClass = 'class="highlight-user"';
            }

            leaderboardBody.innerHTML += `
                <tr ${rowClass}>
                    <td>${rankEmoji}</td>
                    <td>${player.name} ${player.isCurrentUser ? "(You)" : ""}</td>
                    <td><b>${player.score}</b></td>
                </tr>
            `;
        });
    })
    .catch((error) => {
        console.error("Leaderboard loading error: ", error);
    });
}

// SECTION TOGGLE VIEW CONTROL LOGIC WITH COLORFUL DYNAMIC LIGHTING
function showSection(sectionName, element) {
    // 1. Sabhi sections ko pehle hide (gayab) karo
    document.querySelectorAll('.dynamic-section').forEach(section => {
        section.style.display = 'none';
    });

    // 2. 🌟 NAVBAR BOX HIGHLIGHT LOGIC: Sabhi links se active color mitao
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active-nav-btn');
    });

    // Agar function ko direct HTML element pass hua hai toh use active karo
    if (element) {
        element.classList.add('active-nav-btn');
    } else {
        // Fallback: Agar direct element na mile (jaise page load par), toh ID or trigger se dhoondo
        const activeLink = document.querySelector(`nav a[onclick*="${sectionName}"]`);
        if (activeLink) activeLink.classList.add('active-nav-btn');
    }

    // 3. Jis section par click hua hai, sirf use dikhao
    if (sectionName === 'game') {
        const gameBox = document.getElementById('game-box');
        if (gameBox) gameBox.style.display = 'block';
    } 
    else if (sectionName === 'profile') {
        const profileSec = document.getElementById('profile-section');
        if (profileSec) profileSec.style.display = 'block';
        
        // Scores aur real-time elements refresh karne ke liye
        if (document.getElementById('prof-total-score')) document.getElementById('prof-total-score').innerText = totalScore;
        if (document.getElementById('prof-current-score')) document.getElementById('prof-current-score').innerText = score;
        
        let savedUsername = sessionStorage.getItem("currentUsername");
        const profUser = document.getElementById('prof-username');
        if (profUser) {
            profUser.innerText = savedUsername ? savedUsername : "Kartik_Player";
        }
    } 
    else if (sectionName === 'leaderboard') {
        const leaderboardSec = document.getElementById('leaderboard-section');
        if (leaderboardSec) leaderboardSec.style.display = 'block';
        updateTotalScoreDisplays(); // Cloud Database data fetch trigger
    } 
    else if (sectionName === 'contact') {
        const contactSec = document.getElementById('contact-section');
        if (contactSec) contactSec.style.display = 'block';
    }
}

function checkGuess() {
    let guessInput = document.getElementById("guessInput").value;
    let message = document.getElementById("message");
    let guessButton = document.querySelector(".action-btn");

    if (guessInput === "") {
        message.innerHTML = "⚠ Enter a valid number";
        message.style.color = "#f87171";
        return;
    }

    let guess = Number(guessInput);

    if (guess === randomNumber) {
        message.innerHTML = "🎉 Congratulations! You Won!";
        message.style.color = "#22c55e";
        
        totalScore += score;
        sessionStorage.setItem("totalScore", totalScore);
        updateTotalScoreDisplays();

        // 🌟 MULTI-ACCOUNT COLLISION AVOIDANCE ENGINE (FIRESTORE SYNC BY UID)
        let currentUserUid = sessionStorage.getItem("currentUserUid");
        let savedUsername = sessionStorage.getItem("currentUsername") || "Player";
        
        if (currentUserUid) {
            firebase.firestore().collection("leaderboard").doc(currentUserUid).set({
                username: savedUsername,
                totalScore: totalScore,
                lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true })
            .then(() => {
                console.log("Score saved successfully via private tab key.");
            })
            .catch((error) => {
                console.error("Firebase database error: ", error);
            });
        }
        
        if (guessButton) {
            guessButton.disabled = true;
            guessButton.style.opacity = "0.5";
            guessButton.style.cursor = "not-allowed";
        }
        return;
    } 

    attempts--;
    score -= 10;

    document.getElementById("attempts").innerHTML = attempts;
    document.getElementById("score").innerHTML = score;

    if (attempts === 0) {
        message.innerHTML = `💀 Game Over! Number was ${randomNumber}`;
        message.style.color = "#f87171";
        if (guessButton) {
            guessButton.disabled = true;
            guessButton.style.opacity = "0.5";
            guessButton.style.cursor = "not-allowed";
        }
        return;
    }

    if (guess > randomNumber) {
        message.innerHTML = "📈 Too High! Try Lower";
        message.style.color = "#38bdf8"; 
    } else {
        message.innerHTML = "📉 Too Low! Try Higher";
        message.style.color = "#38bdf8"; 
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

    let guessButton = document.querySelector(".action-btn");
    if (guessButton) {
        guessButton.disabled = false;
        guessButton.style.opacity = "1";
        guessButton.style.cursor = "pointer";
    }
}

function logoutUser() {
    if (confirm("Do you really want to logout from this session?")) {
        sessionStorage.clear(); 
        window.location.href = "index.html"; 
    }
}

function shownav(){
    let show = document.querySelector('.mobile-dropdown');
    if(show) show.style.display = 'flex';
}
function hidenav(){
    let hide = document.querySelector('.mobile-dropdown');
    if(hide) hide.style.display = 'none';
}

particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#a9cce3" }, 
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": true, "distance": 150, "color": "#a9cce3", "opacity": 0.4, "width": 1 },
        "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } }
    },
    "retina_detect": true
});
