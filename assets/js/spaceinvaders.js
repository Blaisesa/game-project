const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

gameCanvas.width = CANVAS_WIDTH;
gameCanvas.height = CANVAS_HEIGHT;
gameCanvas.style.width = CANVAS_WIDTH + "px";
gameCanvas.style.height = CANVAS_HEIGHT + "px";


const backgroundImage = new Image();
backgroundImage.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";

backgroundImage.onload = function() {
    ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ctx.globalCompositeOperation = 'destination-over';
};

playerImage.onload = function() {
    const playerX = (CANVAS_WIDTH - playerImage.width) / 2;
    const playerY = CANVAS_HEIGHT - playerImage.height - 10;
    ctx.drawImage(playerImage, playerX, playerY);
    // ctx.globalCompositeOperation = 'source-over';
}
// player variables
// let playerX = 0;
// let playerY = 0;
// let PLAYER_SPEED = 5;

// keyboard handlers
// window.addEventListener("keydown", (e) => {
//     if (e.key === "a" || e.key === "ArrowLeft") {
//         e.preventDefault();
//         playerX -= PLAYER_SPEED;

//     }
// });
// playerImage.addEventListener("keyup", (e) => {
//     if (e.key === "d" || e.key === "ArrowRight") {
//         keyState[e.key] = false;
//         e.preventDefault();
//          playerX += PLAYER_SPEED * dt;
//     }
// });
