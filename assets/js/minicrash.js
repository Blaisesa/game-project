console.log("Mini-Crash loaded ✅");

/* -------------------------------
   MINI-CRASH GAME – GLOBAL STATE
   ------------------------------- */

// Game State Variables
let crashMult; // Random crash target (e.g., 3.42x)
let currentMult = 1; // Multiplier displayed in real time
let winMult = 0; // Multiplier cashed out at
let betValue = 1; // Player’s current bet
let winValue = 0; // Player’s win amount
let gameRunning = false; // Used to lock buttons during gameplay

// Timing + Growth
let loopTimer; // Controls the running setInterval loop
const multIncrement = 0.004; // Growth speed (bigger = faster)
const loopInterval = 10; // Interval in ms (100 = slow, 10 = fast)

// DOM Elements
let multDisplay, startBtn, cashoutBtn, rocket, betButtons;

// DOM ELEMENT HOOKS
multDisplay = document.getElementById("mult");
startBtn = document.getElementById("start-btn");
cashoutBtn = document.getElementById("cashout-btn");
rocket = document.getElementById("rocket");
betButtons = document.querySelectorAll(".bet-btn");
helpBtn = document.getElementById("help-btn");

/* -------------------------------
   MINI-CRASH GAME – FUNCTION MAP
   ------------------------------- */

// PRE-GAME PHASE
function initGame() {
    console.log("initGame() running...");
    resetGame(); // run immediately when the game loads
    // event listeners //
    startBtn.addEventListener("click", startGame);
    cashoutBtn.addEventListener("click", cashOut);
    helpBtn.addEventListener("click", showHelp);
}

function resetGame() {
    console.log("resetGame() running...");

    // 1. Reset multiplier display
    currentMult = 1.0;
    multDisplay.textContent = "x1.00";

    // 2. Reset buttons
    startBtn.disabled = false;
    cashoutBtn.disabled = true;

    // 3. Reset game state
    gameRunning = false;
}
// Unused for now //
// function setBet() {}

// START GAME PHASE
function startGame() {
    if (gameRunning) return; // 1️⃣ stop if already running

    console.log("startGame() running...");
    gameRunning = true;

    startBtn.disabled = true;
    cashoutBtn.disabled = false;

    currentMult = 1.0;
    crashMult = Math.random() * (25 - 1.5) + 1.5; // 2️⃣ random crash point

    console.log("crashMult =", crashMult.toFixed(2));
    multLoop(); // 3️⃣ start multiplier growth
}

// MULT LOOP PHASE
function multLoop() {
    // safety: don’t create two timers
    if (loopTimer) clearInterval(loopTimer);

    loopTimer = setInterval(() => {
        // 1) increase the mult
        currentMult += multIncrement;

        displayMult(); // <- show it on screen every tick

        console.log(
            `checking: ${currentMult.toFixed(
                2
            )} vs crash at ${crashMult.toFixed(2)}`
        );

        if (currentMult >= crashMult) {
            triggerCrash();
        }
    }, loopInterval);
}

function displayMult() {
    multDisplay.textContent = `x${currentMult.toFixed(2)}`;
}

function updateRocketPosition() {}

// CASH OUT PHASE (WIN)
function cashOut() {}

// CRASH PHASE (LOSE)
function triggerCrash() {
    console.log(`💥 Crash at ${currentMult.toFixed(2)}x`);
    console.log("Loop cleared:", loopTimer);
    clearInterval(loopTimer);
    loopTimer = null;
    // (next: show message, disable buttons, endRound())
}

// END ROUND PHASE
function endRound() {}

// 🧩 SUPPORT / UTILITY
function displayMessage(msg) {}
function showHelp() {}
function hideHelp() {}

// Run setup when page loads
window.addEventListener("DOMContentLoaded", initGame);
