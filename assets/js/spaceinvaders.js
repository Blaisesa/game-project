const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");
const CANVAS_WIDTH = (gameCanvas.width = 600);
const CANVAS_HEIGHT = (gameCanvas.height = 400);

// Load all images
const background = new Image();
background.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";
// bullet image for player shots
const bulletImage = new Image();
bulletImage.src = "assets/images/rhys/laser-bullet.png";
const blueAlienImage = new Image();
blueAlienImage.src = "assets/images/blaise/aliens/blueAlien0.webp";
const greenAlienImage = new Image();
greenAlienImage.src = "assets/images/blaise/aliens/greenAlien0.webp";
const pinkAlienImage = new Image();
pinkAlienImage.src = "assets/images/blaise/aliens/pinkAlien0.webp";
const purpleAlienImage = new Image();
purpleAlienImage.src = "assets/images/blaise/aliens/purpleAlien0.webp";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
// bullet constants & state
const BULLET_WIDTH = 8;
const BULLET_HEIGHT = 16;
const BULLET_SPEED = 6;
const bullets = []; // { x, y, width, height, speed }
let lastFireTime = 0;
const FIRE_COOLDOWN = 200; // ms between shots

//draws images on the canvas
window.onload = () => {
    // initial static draw
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 275, 320, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.drawImage(blueAlienImage, 100, 50, 40, 40);
    ctx.drawImage(greenAlienImage, 150, 50, 40, 40);
    ctx.drawImage(pinkAlienImage, 200, 50, 40, 40);
    ctx.drawImage(purpleAlienImage, 250, 50, 40, 40);

    // initialize aliens and draws them
    createAliens();
    drawAliens();

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

const alienEnemy = {
    width: 40,
    height: 40,
    x: 0,
    y: 0,
    speed: 1.5,
};

// Global alien state
let pendingDirection = 1; // 1 = moving right, -1 = moving left
const aliens = []; // will hold individual alien objects {x,y,width,height,image,speed}

function createAliens(
    rows = 3,
    cols = 8,
    startX = 60,
    startY = 40,
    spacingX = 50,
    spacingY = 50
) {
    aliens.length = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // pick an image by row for variety
            const imgs = [
                blueAlienImage,
                greenAlienImage,
                pinkAlienImage,
                purpleAlienImage,
            ];
            const img = imgs[i % imgs.length];
            aliens.push({
                x: startX + j * spacingX,
                y: startY + i * spacingY,
                width: alienEnemy.width,
                height: alienEnemy.height,
                image: img,
                speed: alienEnemy.speed,
            });
        }
    }
}

function drawAliens() {
    for (const i of aliens) {
        ctx.drawImage(i.image, i.x, i.y, i.width, i.height);
    }
}
// player movement
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    // Fire on Space (use code for reliability across layouts)
    if (e.code === "Space") {
        fireBullet();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function updatePlayer() {
    // Moves the player left with arrow keys or 'a' key
    if ((keys["ArrowLeft"] || keys["a"]) && player.x > 0) {
        player.x -= player.speed;
    }
    // Moves the player right with arrow keys or 'd' key
    if (
        (keys["ArrowRight"] || keys["d"]) &&
        player.x < CANVAS_WIDTH - player.width
    ) {
        player.x += player.speed;
    }
}

// bullet function
function fireBullet() {
    const now = Date.now();
    if (now - lastFireTime < FIRE_COOLDOWN) return; // enforce cooldown
    lastFireTime = now;

    const bx = player.x + player.width / 2 - BULLET_WIDTH / 2;
    // start slightly overlapping the player's top so it visually comes out
    const by = player.y - BULLET_HEIGHT / 2;
    bullets.push({ x: bx, y: by, width: BULLET_WIDTH, height: BULLET_HEIGHT, speed: BULLET_SPEED });
}

function updateBullets() {
    for (const i of bullets) {
        i.y -= i.speed;
    }
    // remove bullets that have left the top of the screen
    for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + bullets[i].height < 0) bullets.splice(i, 1);
    }
}

function drawBullets() {
    for (const i of bullets) {
        // draw bullet image if loaded; fall back to a filled rect if not
        if (bulletImage.complete) {
            ctx.drawImage(bulletImage, i.x, i.y, i.width, i.height);
        } else {
            ctx.fillStyle = "#ff0";
            ctx.fillRect(i.x, i.y, i.width, i.height);
        }
    }
}

// update player position at 60fps
setInterval(updatePlayer, 1000 / 60);

// startGame function
function startGame() {
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 10;
    gameLoop();
}
// main game loop
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    // update bullets, aliens and render
    updateBullets();
    moveAliens();
    drawAliens();
    drawBullets();
    requestAnimationFrame(gameLoop);
}

// alien movement and behavior
function moveAliens() {
    if (aliens.length === 0) return;

    // Moves aliens horizontally
    for (const i of aliens) {
        i.x += i.speed * pendingDirection;
    }

    // Determine edges
    const leftmost = Math.min(...aliens.map((a) => a.x));
    const rightmost = Math.max(...aliens.map((a) => a.x + a.width));

    // If hitting right wall, move down and reverse movement
    if (rightmost >= CANVAS_WIDTH) {
        const overshoot = rightmost - CANVAS_WIDTH;
        if (overshoot > 0) {
            for (const i of aliens) i.x -= overshoot;
        }
        for (const i of aliens) i.y += 10; // descend a bit
        pendingDirection = -1;
        return;
    }

    // If hitting left wall, correct overshoot, move down and reverse
    if (leftmost <= 0) {
        const overshoot = -leftmost;
        if (overshoot > 0) {
            for (const i of aliens) i.x += overshoot;
        }
        for (const i of aliens) i.y += 7; // descend a bit
        pendingDirection = 1;
        return;
    }
}
