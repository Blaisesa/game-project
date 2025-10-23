const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");
const CANVAS_WIDTH = (gameCanvas.width = 600);
const CANVAS_HEIGHT = (gameCanvas.height = 400);

// Load all images
const background = new Image();
background.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";
const blueAlienImage = new Image();
blueAlienImage.src = "assets/images/blaise/aliens/blueAlien0.webp";
const greenAlienImage = new Image();
greenAlienImage.src = "assets/images/blaise/aliens/greenAlien0.webp";
const pinkAlienImage = new Image();
pinkAlienImage.src = "assets/images/blaise/aliens/pinkAlien0.webp";
const purpleAlienImage = new Image();
purpleAlienImage.src = "assets/images/blaise/aliens/purpleAlien0.webp";

//draws images on the canvas
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;

window.onload = () => {
    // initial static draw (images may still be loading, but this provides a starting frame)
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 275, 320, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.drawImage(blueAlienImage, 100, 50, 40, 40);
    ctx.drawImage(greenAlienImage, 150, 50, 40, 40);
    ctx.drawImage(pinkAlienImage, 200, 50, 40, 40);
    ctx.drawImage(purpleAlienImage, 250, 50, 40, 40);

    // initialize player position and start game loop after DOM ready
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 10;
    gameLoop();
};

// player object
const player = {
    speed: 3,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    x: 0,
    y: 0,
};

// player movement
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function updatePlayer() {
    // Move left
    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) {
        player.x -= player.speed;
    }
    // Move right
    if (
        (keys["ArrowRight"] || keys["d"]) &&
        player.x < CANVAS_WIDTH - player.width
    ) {
        player.x += player.speed;
    }
}
setInterval(updatePlayer, 1000 / 60);

// startGame function
function startGame() {
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 10;
    gameLoop();
}
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    ctx.drawImage(blueAlienImage, 100, 50, 40, 40);
    ctx.drawImage(greenAlienImage, 150, 50, 40, 40);
    ctx.drawImage(pinkAlienImage, 200, 50, 40, 40);
    ctx.drawImage(purpleAlienImage, 250, 50, 40, 40);
    requestAnimationFrame(gameLoop);
}
