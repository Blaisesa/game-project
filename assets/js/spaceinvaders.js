const gameCanvas = document.getElementById("gamecanvas");
const ctx = gameCanvas.getContext("2d");
const CANVAS_WIDTH = (gameCanvas.width = 600);
const CANVAS_HEIGHT = (gameCanvas.height = 400);

// Load all images
const background = new Image();
background.src = "assets/images/rhys/background.png";
const playerImage = new Image();
playerImage.src = "assets/images/rhys/ship/frame0.png";
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

// enemy bullet constants & state
const ENEMY_BULLET_WIDTH = 6;
const ENEMY_BULLET_HEIGHT = 12;
const ENEMY_BULLET_SPEED = 3.5;
const enemyBullets = []; // { x, y, width, height, speed }
let lastEnemyShotTime = 0;
const ENEMY_FIRE_INTERVAL = 700; // ms average between enemy shots (will pick a random live alien)

// game state
let gameOver = false;
let victory = false;
// score
let score = 0;
// initialize highScore; will be loaded from localStorage (if present) in window.onload
let highScore = 0;

// Centralized game-over handler: shows a retry overlay and stops the game loop
function handleGameOver() {
    // set state and stop player updates
    gameOver = true;
    stopPlayerUpdates();

    // create update overlay
    let overlay = document.getElementById("gameOverOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "gameOverOverlay";
        overlay.style.position = "fixed";
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.background = "rgba(0,0,0,0.7)";
        overlay.style.zIndex = "1000";
        document.body.appendChild(overlay);
    }

    // update high score if this run produced a new one
    if (score > highScore) {
        highScore = score;
        try {
            localStorage.setItem("spaceinvadersHighScore", String(highScore));
        } catch (e) {
            // ignore localStorage errors
        }
        const pageHsEl =
            document.getElementById("highscore") ||
            document.querySelector("#highscore");
        if (pageHsEl) pageHsEl.innerText = `High Score: ${highScore}`;
    }

    // also set the final score element if present in the page
    const finalEl = document.getElementById("finalScore");
    if (finalEl) finalEl.innerText = `Final Score: ${score}`;

    overlay.innerHTML = `
        <div style="text-align:center;color:#fff;font-family:Arial, sans-serif;">
            <h1 style="margin:0 0 10px 0;">GAME OVER</h1>
            <p style="margin:0 0 20px 0;font-size:18px;">Final Score: ${score}</p>
            <button id="retryBtn" style="padding:10px 18px;font-size:16px;cursor:pointer;">Retry</button>
        </div>
    `;

    const retryBtn = document.getElementById("retryBtn");
    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            const ov = document.getElementById("gameOverOverlay");
            if (ov) ov.remove();
            // reset game state and start again
            startGame();
        });
    }
}

// victory screen with your final score and play again button
function handleVictory() {
    victory = true;
    stopPlayerUpdates();

    let overlay = document.getElementById("victoryOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "victoryOverlay";
        overlay.style.position = "fixed";
        overlay.style.left = "0";
        overlay.style.top = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.background = "rgba(0,0,0,0.7)";
        overlay.style.zIndex = "1000";
        document.body.appendChild(overlay);
    }

    // update high score if this run produced a new one
    if (score > highScore) {
        highScore = score;
        try {
            localStorage.setItem("spaceinvadersHighScore", String(highScore));
        } catch (e) {
            // ignore localStorage errors
        }
        const pageHsEl =
            document.getElementById("highscore") ||
            document.querySelector("#highscore");
        if (pageHsEl) pageHsEl.innerText = `High Score: ${highScore}`;
    }

    // also set the final score element if present in the page
    const finalEl = document.getElementById("finalScore");
    if (finalEl) finalEl.innerText = `Final Score: ${score}`;

    overlay.innerHTML = `
        <div style="text-align:center;color:#fff;font-family:Arial, sans-serif;">
            <h1 style="margin:0 0 10px 0;">CONGRATULATIONS!</h1>
            <p style="margin:0 0 20px 0;font-size:18px;">You killed all the aliens! Earth is saved!<p>
            <br> 
            <p>Final Score: ${score}</p>
            <button id="playAgainBtn" style="padding:10px 18px;font-size:16px;cursor:pointer;">Play Again</button>
        </div>
    `;

    const btn = document.getElementById("playAgainBtn");
    if (btn) {
        btn.addEventListener("click", () => {
            const ov = document.getElementById("victoryOverlay");
            if (ov) ov.remove();
            startGame();
        });
    }
}

// lives
const MAX_LIVES = 3;
let lives = MAX_LIVES;

//draws images on the canvas
window.onload = () => {
    // initial static draw
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 275, 320, PLAYER_WIDTH, PLAYER_HEIGHT);
    ctx.drawImage(blueAlienImage, 100, 50, 40, 40);
    ctx.drawImage(greenAlienImage, 150, 50, 40, 40);
    ctx.drawImage(pinkAlienImage, 200, 50, 40, 40);
    ctx.drawImage(purpleAlienImage, 250, 50, 40, 40);

    // Load persisted high score (if any) and update the UI
    try {
        const stored = parseInt(
            localStorage.getItem("spaceinvadersHighScore"),
            10
        );
        if (!Number.isNaN(stored)) highScore = stored;
    } catch (e) {
        // localStorage might be unavailable in some embedded contexts; ignore errors
    }
    const hsEl =
        document.getElementById("highscore") ||
        document.querySelector("#highscore");
    if (hsEl) hsEl.innerText = `High Score: ${highScore}`;
    // initialize aliens and draws them
    createAliens();
    drawAliens();

    // initialize player position and start game loop after DOM ready
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 10;

    //updates start movement
    startPlayerUpdates();
    renderLives();
    gameLoop();
};

// update the lives UI in the page
function renderLives() {
    const el = document.getElementById("lives");
    if (!el) return;
    const full = "assets/images/blaise/fullHeart.webp";
    const lost = "assets/images/blaise/lostHeart.webp";
    let html = "Lives: ";
    for (let i = 0; i < MAX_LIVES; i++) {
        if (i < lives) {
            html += `<img src="${full}" alt="life" style="width:20px;height:20px;margin-left:4px">`;
        } else {
            html += `<img src="${lost}" alt="lost life" style="width:20px;height:20px;margin-left:4px">`;
        }
    }
    el.innerHTML = html;
}

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
    // Fire on Space key
    if (e.code === "Space") {
        fireBullet();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function updatePlayer() {
    if (gameOver || victory) return; // no movement after death or victory
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
    if (gameOver || victory) return;
    const now = Date.now();
    if (now - lastFireTime < FIRE_COOLDOWN) return; // enforce cooldown
    lastFireTime = now;

    const bx = player.x + player.width / 2 - BULLET_WIDTH / 2;
    // start slightly overlapping the player's top so it visually comes out
    const by = player.y - BULLET_HEIGHT / 2;
    bullets.push({
        x: bx,
        y: by,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        speed: BULLET_SPEED,
    });
}

// check if any alien overlaps the player -> trigger game over
function checkAlienPlayerCollision() {
    for (const a of aliens) {
        if (
            player.x < a.x + a.width &&
            player.x + player.width > a.x &&
            player.y < a.y + a.height &&
            player.y + player.height > a.y
        ) {
            // player hit by alien body: lose one life
            lives -= 1;
            renderLives();
            if (lives <= 0) {
                handleGameOver();
            } else {
                // reset player position and clear bullets so the player has a fresh start
                player.x = CANVAS_WIDTH / 2 - player.width / 2;
                player.y = CANVAS_HEIGHT - player.height - 10;
                bullets.length = 0;
                enemyBullets.length = 0;
            }
            return;
        }
    }
}

function updateBullets() {
    // move bullets
    for (const b of bullets) {
        b.y -= b.speed;
    }

    // check collisions and remove bullets/aliens that intersect
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
        const b = bullets[bi];
        // remove if off-screen
        if (b.y + b.height < 0) {
            bullets.splice(bi, 1);
            continue;
        }

        // check against aliens; iterate backwards so splicing is safe
        for (let ai = aliens.length - 1; ai >= 0; ai--) {
            const a = aliens[ai];
            // simple AABB collision
            if (
                b.x < a.x + a.width &&
                b.x + b.width > a.x &&
                b.y < a.y + a.height &&
                b.y + b.height > a.y
            ) {
                // collision: remove both bullet and alien
                bullets.splice(bi, 1);
                aliens.splice(ai, 1);
                // increase score for killing an alien
                score += 100;
                // update score in the DOM if present
                const scoreEl = document.querySelector("#score");
                if (scoreEl) scoreEl.innerText = `Score: ${score}`;
                // If we removed the last alien, trigger victory handler
                if (aliens.length === 0) {
                    handleVictory();
                }
                break; // bullet is gone, move to next bullet
            }
        }
    }
}

// enemy bullets update and collision with player
function updateEnemyBullets() {
    // move enemy bullets
    for (const b of enemyBullets) {
        b.y += b.speed;
    }

    // remove off-screen and check collision with player
    for (let ei = enemyBullets.length - 1; ei >= 0; ei--) {
        const eb = enemyBullets[ei];
        // off screen
        if (eb.y > CANVAS_HEIGHT) {
            enemyBullets.splice(ei, 1);
            continue;
        }

        // collision with player
        if (
            player.x < eb.x + eb.width &&
            player.x + player.width > eb.x &&
            player.y < eb.y + eb.height &&
            player.y + player.height > eb.y
        ) {
            // player hit by enemy bullet: lose a life
            enemyBullets.splice(ei, 1);
            lives -= 1;
            renderLives();
            if (lives <= 0) {
                handleGameOver();
                return;
            }
            // reset player position and clear bullets so player gets a fresh chance
            player.x = CANVAS_WIDTH / 2 - player.width / 2;
            player.y = CANVAS_HEIGHT - player.height - 10;
            bullets.length = 0;
            enemyBullets.length = 0;
            return;
        }
    }
}

// Choose a random live alien to fire. Prefer aliens that are lowest in their column so bullets can be seen.
function pickRandomAlienShooter() {
    if (aliens.length === 0) return null;

    // Group aliens by approximate column (round x to nearest 10)
    const cols = new Map();
    for (const a of aliens) {
        // bucket by x position rounded to 10 pixels
        const key = Math.round(a.x / 10) * 10;
        if (!cols.has(key)) cols.set(key, []);
        cols.get(key).push(a);
    }

    // For each column pick the bottom-most alien
    const bottomAliens = [];
    for (const group of cols.values()) {
        let bottom = group[0];
        for (const g of group) {
            if (g.y > bottom.y) bottom = g;
        }
        bottomAliens.push(bottom);
    }

    if (bottomAliens.length === 0) return null;
    // pick a random bottom alien
    return bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
}

// spawn an enemy bullet from a given alien
function enemyFireFromAlien(alien) {
    if (!alien) return;
    const ex = alien.x + alien.width / 2 - ENEMY_BULLET_WIDTH / 2;
    const ey = alien.y + alien.height;
    enemyBullets.push({
        x: ex,
        y: ey,
        width: ENEMY_BULLET_WIDTH,
        height: ENEMY_BULLET_HEIGHT,
        speed: ENEMY_BULLET_SPEED,
    });
}

// decide when enemies should shoot; called from moveAliens or gameLoop
function maybeEnemiesShoot() {
    if (gameOver || victory) return;
    const now = Date.now();
    if (now - lastEnemyShotTime < ENEMY_FIRE_INTERVAL) return;
    lastEnemyShotTime = now;

    // 40% chance to fire each interval to make it feel less regular
    if (Math.random() > 0.4) return;

    const shooter = pickRandomAlienShooter();
    if (shooter) enemyFireFromAlien(shooter);
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

function drawEnemyBullets() {
    for (const i of enemyBullets) {
        // draw as red bullets (no asset available currently)
        ctx.fillStyle = "#ff3b3b";
        ctx.fillRect(i.x, i.y, i.width, i.height);
    }
}

// player update interval handle so we can start/stop on game start/over
let playerIntervalId = null;
function startPlayerUpdates() {
    if (playerIntervalId) clearInterval(playerIntervalId);
    playerIntervalId = setInterval(updatePlayer, 1000 / 60);
}
function stopPlayerUpdates() {
    if (playerIntervalId) {
        clearInterval(playerIntervalId);
        playerIntervalId = null;
    }
}

// startGame function
function startGame() {
    // reset player position
    player.x = CANVAS_WIDTH / 2 - player.width / 2;
    player.y = CANVAS_HEIGHT - player.height - 10;
    // remove any leftover game over overlay (if present)
    const ov = document.getElementById("gameOverOverlay");
    if (ov) ov.remove();
    const vo = document.getElementById("victoryOverlay");
    if (vo) vo.remove();
    // reset state
    bullets.length = 0;
    enemyBullets.length = 0;
    // reset score
    score = 0;
    const scoreEl = document.querySelector("#score");
    if (scoreEl) scoreEl.innerText = `Score: ${score}`;
    // reset lives
    lives = MAX_LIVES;
    renderLives();
    createAliens();
    pendingDirection = 1;
    gameOver = false;
    victory = false;
    // start or resume the loop
    startPlayerUpdates();
    // reset shot timers so enemies/players can't immediately fire
    lastEnemyShotTime = 0;
    lastFireTime = 0;
    gameLoop();
}
// main game loop
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // update bullets, aliens and render
    updateBullets();
    updateEnemyBullets();
    moveAliens();

    // check collision between aliens and the player
    if (!gameOver) checkAlienPlayerCollision();
    drawAliens();
    drawBullets();
    drawEnemyBullets();

    // If game over, draw overlay and stop further updates (halt the game)
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#e90b0bff";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        // stop player updates and do not request another animation frame
        stopPlayerUpdates();
        return;
    }

    // Victory overlay
    if (victory) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "#270ae1ff"; // green
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "CONGRATULATIONS!",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 - 10
        );
        ctx.font = "18px Arial";
        ctx.fillText(
            "You Killed All The Aliens! Earth is Safe!",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 + 25
        );
        // stop player updates and do not continue the loop
        stopPlayerUpdates();
        return;
    }

    requestAnimationFrame(gameLoop);
}

// alien movement and behavior
function moveAliens() {
    if (aliens.length === 0) return;

    // allow aliens to occasionally shoot while they move
    maybeEnemiesShoot();

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

    // If hitting left wall, move down and reverse
    if (leftmost <= 0) {
        const overshoot = -leftmost;
        if (overshoot > 0) {
            for (const i of aliens) i.x += overshoot;
        }
        for (const i of aliens) i.y += 12; // descend value
        pendingDirection = 1;
        return;
    }
}
