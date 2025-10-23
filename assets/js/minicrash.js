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
let messageDisplay = document.querySelector("#message-panel h1");

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

    //reset message colour
        messageDisplay.style.color = "#e4e8f2";


}
// Unused for now //
// function setBet() {}

// START GAME PHASE
function startGame() {
    if (gameRunning) return; // (1). stop if already running

    console.log("startGame() running...");
    gameRunning = true;

    startBtn.disabled = true;
    cashoutBtn.disabled = false;

    currentMult = 1.0;
    crashMult = Math.random() * (25 - 1.5) + 1.5; // (2). random crash point

    console.log("crashMult =", crashMult.toFixed(2));
    multLoop(); // (3). start multiplier growth
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
function cashOut() {
    // 1. cheeck if game loop is running
    if (!gameRunning) return; // if game not running, do nothing

    // 2. stop loop - clearInterval(loopTimer)

    clearInterval(loopTimer);
    loopTimer = null; // clears the handle

    // 3. save winMult = currentMult
    winMult = currentMult;

    // 4. calculate winValue = betValue * winMult

    winValue = betValue * winMult;

    // 5. display winValue, and endRound
    displayMessage(`You won €${winValue.toFixed(2)} at ${winMult.toFixed(2)}x`);
    endRound();
}

// CRASH PHASE (LOSE)
function triggerCrash() {
    console.log(`💥 Crash at ${currentMult.toFixed(2)}x`);
    // console.log("Loop cleared:", loopTimer);
    clearInterval(loopTimer);
    loopTimer = null;
    //displat etx in red
    displayMessage(`You crashed at ${currentMult.toFixed(2)}x`, "crash");

    endRound();

    // (next: show message, disable buttons, endRound())
}

// END ROUND PHASE
function endRound() {
    console.log("endRound() running...");

    // 1. Disable buttons
    startBtn.disabled = true;
    cashoutBtn.disabled = true;

    // 2. Wait 2 seconds before reset
    setTimeout(() => {
        console.log("Resetting game after delay...");
        resetGame();
        document.querySelector("#start-btn").innerText = `REPLAY`;
    }, 2000);


}

// SUPPORT / UTILITY
function displayMessage(msg, type) {
    if (type === "crash") {
        messageDisplay.style.color = "red";
    } else if (type === "win") {
        messageDisplay.style.color = "#6de0ff";
    } else {
        messageDisplay.style.color = "#e4e8f2";
    }

    // console.log("MESSAGE", msg);
    messageDisplay.textContent = msg;
    setTimeout(function () {
        messageDisplay.textContent = "Mini-Crash!";
    }, 4000);
}

function showHelp() {}
function hideHelp() {}

// Run setup when page loads
window.addEventListener("DOMContentLoaded", initGame);
