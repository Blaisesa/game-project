const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");
const CANVAS_WIDTH = gameCanvas.width = 600;
const CANVAS_HEIGHT = gameCanvas.height = 400;

// // Load images
const background = new Image();
background.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";

window.onload = () => {
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 275, 320, 50, 50);
};

