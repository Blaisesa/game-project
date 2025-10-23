const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");
const CANVAS_WIDTH = gameCanvas.width = 600;
const CANVAS_HEIGHT = gameCanvas.height = 400;

// // Load images
const background = new Image();
background.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";
const blueAlienImage = new Image();
blueAlienImage.src = " assets/images/blaise/aliens/blueAlien0.webp";

const greenAlienImage = new Image();
greenAlienImage.src = "assets/images/blaise/aliens/greenAlien0.webp";

const pinkAlienImage = new Image();
pinkAlienImage.src = "assets/images/blaise/aliens/pinkAlien0.webp";

const purpleAlienImage = new Image();
purpleAlienImage.src = "assets/images/blaise/aliens/purpleAlien0.webp";

window.onload = () => {
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 275, 320, 50, 50);
    ctx.drawImage(blueAlienImage, 100, 50, 40, 40);
    ctx.drawImage(greenAlienImage, 150, 50, 40, 40);
    ctx.drawImage(pinkAlienImage, 200, 50, 40, 40);
    ctx.drawImage(purpleAlienImage, 250, 50, 40, 40);
};

