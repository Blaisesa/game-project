// Global variables & constants for the game
let board; // This specifies the game board canvas element
const rowCount = 20; // Number of rows in the game board
const colCount = 29; // Number of columns in the game board
const tileSize = 32; // Size of each tile in pixels
const boardWidth = colCount * tileSize; // Width of the game board in pixels
const boardHeight = rowCount * tileSize; // Height of the game board in pixels
let context; // Canvas rendering context

// Static image variables
// Aliens
let blueAlienImage;
let greenAlienImage;
let pinkAlienImage;
let purpleAlienImage;
// Resources
let nuclearWasteImage;
let powerUpImage;
let fullHeartImage;
let LostHeartImage;
let wallImage;
let ventImage;

// Animated image variables
let pacmanFrames;
const animationSpeed = 2; // Speed of animation
let portalFrames = [];
const portalAnimationSpeed = 5; // slower than pacman

// Game maps
// original level 0 map layout
const level0 = [
    // 0: empty, X: wall, x: vent, n: nuclear waste, +: power-up, 1: blue alien, 2: green alien, 3: pink alien, 4: purple alien, P: pacman start, p: portal, " ": food
    // "XXXXXXXXX XXXXXXXXXX XXXXXXXX",
    // "X                         n X",
    // "X XXXXXXX X XXXXXXXXXXXXXXX X",
    // "X       x X X       XXX +   X",
    // "X X X X X X X X X X X   XxX X",
    // "X X X X X X X X X X X XXXnX X",
    // "X XnX X X X X       X     X X",
    // "X X X X X X X XX XX X XXX X X",
    // "Xn  X X X X       X       X X",
    // "X XXX X X XXX 102 X X X X X X",
    // "      X X     0p0   X X X    ",
    // "X XXX X XXXXX 304 X X X X X X",
    // "X           X     X X X X X X",
    // "X XXXX XXXX X XXXXX X X X X X",
    // "X X                   X X X X",
    // "X X X XxX X XX X X X XX   X X",
    // "X X X   X X XX P X X n  X X X",
    // "X X X X X X XX X X X XX X X X",
    // "X    n     +                X",
    // "XXXXXXXXX XXXXXXXXXX XXXXXXXX",
    "XXXXXXXXX0XXXXXXXXXX0XXXXXXXX",
    "X0000000000000000000000000n0X",
    "X0XXXXXXX0X0XXXXXXXXXXXXXXX0X",
    "X0000000x0X0X0000000XXX0+000X",
    "X0X0X0X0X0X0X0X0X0X0X000XxX0X",
    "X0X0X0X0X0X0X0X0X0X0X0XXXnX0X",
    "X0XnX0X0X0X0X0000000X00000X0X",
    "X0X0X0X0X0X0X0XX0XX0X0XXX0X0X",
    "Xn00X0X0X0X0000000X0000000X0X",
    "X0XXX0X0X0XXX01020X0X0X0X0X0X",
    "000000X0X000000p0000X0X0X0000",
    "X0XXX0X0XXXXX03040X0X0X0X0X0X",
    "X00000000000X00000X0X0X0X0X0X",
    "X0XXXX0XXXX0X0XXXXX0X0X0X0X0X",
    "X0X0000000000000000000X0X0X0X",
    "X0X0X0XxX0X0XX0X0X0X0XX000X0X",
    "X0X0X000X0X0XX0P0X0X0n00X0X0X",
    "X0X0X0X0X0X0XX0X0X0X0XX0X0X0X",
    "X0000n00000+0000000000000000X",
    "XXXXXXXXX0XXXXXXXXXX XXXXXXXX",
];
// Additional levels (level1, level2, etc.)
const level1 = [
    // Level 1 map layout
    "XXXXXXXX XXXXXXXXXX XXXXXXXXX",
    "X1X      XXX+XXn           2X",
    "X X X XX X   x  XXXXXxXXXXX X",
    "X X Xn   x XXX XX           X",
    "X X XXXX x   X X  X XX X XX X",
    "X+       XXX X   XX+ X X Xn X",
    "XxXXXXXXXX   X X  XX   x   XX",
    "            XX XX nx X X X   ",
    "XXXXXXxXXXXXX   X XX X X XxXX",
    "X+            p             X",
    "X XXXXXX X XX P X X X X X XxX",
    "X        X  XX XX X X X X X X",
    "XXXX X XXXX  X    x X XnX X X",
    "     x  nX   X XXXX X x X x  ",
    "X XXXXXXXX X X     +X X X+X X",
    "X    X     X x XXXXxX X x XnX",
    "XxXX X XXX X X       nX X X X",
    "X nX X x   X X XXXXXXXX X X X",
    "X3     X X x X             4X",
    "XXXXXXXX XXXXXXXXXX XXXXXXXXX",
];
const level2 = [
    // Level 2 map layout
    "XXXXXXXXX XXXXXXXXXXXXXXXX XX",
    "X1      x XXXXX2            X",
    "X XX XX X     x XXXXXXXXXxX X",
    "X X+  X XXXXX X Xn       +X X",
    "X   X     X   X X XXXXXxX X X",
    "X X  nX X   X X x       X X X",
    "X XX XX XXX X X XXXXXXX    3X",
    "X           X4X         XXXxX",
    "X XXxXX XXX X XXXXXxXXXXX   X",
    "XP          X             p X",
    "XXXXXXXXXXXxXXXxXXXXXXXXX   X",
    "X2            X4  x   xnXXXxX",
    "   X XXXX XXxXX X X X X   X  ",
    "XXXX X    X   X X X X X X X X",
    "X      XX X X X x X x X x X X",
    "XX+XXX x    X X X X+X X X X X",
    "X      XX XnX X X X X X X X X",
    "XX XXX XX XxX x X X X X X X X",
    "Xn           1XnX   X   X  3X",
    "XXXXXXXXX XXXXXXXXXXXXXXXX XXX",
];
// ... Add more levels HERE ...
// For example: also make sure to use proper values for walls etc.. you can find them above
// const level3 = [
// "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XPX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XX",
// "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
// ];

// Array of levels make sure to add new levels to this array otherwise they won't load
const levels = [level0, level1, level2]; // Array of levels

// Create sets for ingame objects
// Walls and Vents
const walls = new Set();
const vents = new Set();
// Resources
const nuclearWastes = new Set();
const powerUps = new Set();
const foods = new Set();

// Food pelets dont need a set as they will be checked directly on the board

// Aliens
const aliens = new Set();

// portal and pacman will be single objects as there is only one of each per level
let pacman;
let portal;
//  Game direction constants
const direction = ["U", "D", "L", "R"];

// Game state variables
let currentLevel = 0;
let score = 0;
let highScore = 0;
let lives = 3;
let level = 0;
// Game scaling variable needed for responsive canvas
let scale = 1; // Global scale factor
let gameOver = false;
let gameWin = false;
let levelComplete = false;
let powerUpActive = false;
let paused = false;
let mute = false;
// Touch control variables
// These will store the starting and ending touch positions to determine swipe direction
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Load the current level
const currentMap = levels[currentLevel];

// Resize canvas to fit window while maintaining aspect ratio
function resizeCanvas() {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    const scaleX = maxWidth / boardWidth;
    const scaleY = maxHeight / boardHeight;

    scale = Math.min(scaleX, scaleY); // Use this scale to draw everything

    board.width = boardWidth * scale; // Actual canvas width in pixels
    board.height = boardHeight * scale; // Actual canvas height in pixels

    context.imageSmoothingEnabled = false; // Preserve pixelated look

    draw(); // Redraw everything at new scale
}

// Initialize the game canvas and context
window.onload = function () {
    board = this.document.querySelector("#board");
    board.width = boardWidth;
    board.height = boardHeight;
    // Get 2D context for the board allowing us to draw on it
    context = board.getContext("2d");

    // Load images
    loadImages();
    // Load portal frames
    loadPortalFrames();
    // Load the initial map
    loadMap();
    // Start background music
    backgroundMusic();
    // Console log to confirm loading
    // console.log(`walls.size: ${walls.size}`);
    // console.log(`vents.size: ${vents.size}`);
    // console.log(`nuclearWastes.size: ${nuclearWastes.size}`);
    // console.log(`powerUps.size: ${powerUps.size}`);
    // console.log(`aliens.size: ${aliens.size}`);
    // console.log(`foods.size: ${foods.size}`);

    // Initialize Alien Movement
    for (let alien of aliens) {
        const newDirection = direction[Math.floor(Math.random() * 4)];
        if (!alien.updateDirection) {
            alien.direction = newDirection;
            alien.velocityX = 0;
            alien.velocityY = 0;
            alien.updateDirection = Movement.prototype.updateDirection; // Assign movement methods
            alien.updateVelocity = Movement.prototype.updateVelocity; // Assign movement methods
        }
        alien.updateDirection(newDirection);
    }
    // Start the game loop function
    update();

    // Event listener for keyboard input
    this.document.addEventListener("keyup", movePacman);
    // Remove default arrow key scrolling behavior
    window.addEventListener("keydown", function (e) {
        if (
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Space",
            ].includes(e.code)
        ) {
            e.preventDefault();
        }
    });
    // Event listener for touch controls
    // Touch start
    document.addEventListener(
        // touch start event to capture the initial touch position
        "touchstart",
        (e) => {
            const touch = e.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        },
        { passive: true }
    );

    // Touch end
    document.addEventListener(
        // touch end event to capture the final touch position
        "touchend",
        (e) => {
            const touch = e.changedTouches[0];
            touchEndX = touch.clientX;
            touchEndY = touch.clientY;
            // Calculate swipe direction and move pacman accordingly
            handleSwipe();
        },
        { passive: true }
    );

    // Event listener for window resize to make canvas responsive
    resizeCanvas(); // Initial resize
    window.addEventListener("resize", resizeCanvas);

    // Event listener for restart button
    document
        .querySelector("#restartButton")
        .addEventListener("click", restartGame);

    // Event listener to pause the game if user presses spacebar
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            paused = true;
        }
    });
    // Event listener to resume the game if user presses resume button
    document.querySelector("#resumeButton").addEventListener("click", () => {
        paused = false;
        document.querySelector("#pacman_gamePaused").classList.add("hidden");
        update();
    });
    // Restart level if user clicks restart level button and hide game paused screen
    document
        .querySelector("#restartButtonPaused")
        .addEventListener("click", () => {
            paused = false;
            document
                .querySelector("#pacman_gamePaused")
                .classList.add("hidden");
            restartGame();
        });
};

// Calculate swipe direction and move pacman accordingly
function handleSwipe() {
    // Calculate differences in touch positions
    // Delta values represent the distance moved in each direction
    // Positive deltaX indicates a right swipe, negative indicates left
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Minimum swipe distance threshold (pixels)
    // This prevents accidental small movements such as taps from triggering a direction change
    const threshold = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        // Determine left or right swipe based on deltaX
        // If deltaX is positive, it's a right swipe; if negative, it's a left swipe
        if (deltaX > threshold) {
            pacman.updateDirection("R"); // Swipe right
            // Set next direction for smoother movement on mobile
            pacman.nextDirection = "R";
        } else if (deltaX < -threshold) {
            pacman.updateDirection("L"); // Swipe left
            // Set next direction for smoother movement on mobile
            pacman.nextDirection = "L";
        }
    } else {
        // Vertical swipe
        if (deltaY > threshold) {
            pacman.updateDirection("D"); // Swipe down
            // Set next direction for smoother movement on mobile
            pacman.nextDirection = "D";
        } else if (deltaY < -threshold) {
            pacman.updateDirection("U"); // Swipe up
            // Set next direction for smoother movement on mobile
            pacman.nextDirection = "U";
        }
    }
}

// Function to load images
function loadImages() {
    // Wall images
    wallImage = new Image();
    wallImage.src = "assets/images/blaise/wall.webp";

    ventImage = new Image();
    ventImage.src = "assets/images/blaise/vent.webp";
    // Resources
    nuclearWasteImage = new Image();
    nuclearWasteImage.src = "assets/images/blaise/nuclearWaste.png";

    powerUpImage = new Image();
    powerUpImage.src = "assets/images/blaise/powerUp.png";

    // Hearts
    fullHeartImage = new Image();
    fullHeartImage.src = "assets/images/blaise/fullHeart.webp";
    LostHeartImage = new Image();
    LostHeartImage.src = "assets/images/blaise/lostHeart.webp";

    // Aliens
    blueAlienImage = new Image();
    blueAlienImage.src = "assets/images/blaise/aliens/blueAlien0.webp";
    greenAlienImage = new Image();
    greenAlienImage.src = "assets/images/blaise/aliens/greenAlien0.webp";
    pinkAlienImage = new Image();
    pinkAlienImage.src = "assets/images/blaise/aliens/pinkAlien0.webp";
    purpleAlienImage = new Image();
    purpleAlienImage.src = "assets/images/blaise/aliens/purpleAlien0.webp";

    // Animated Pacman frames
    pacmanFrames = {
        R: [],
        L: [],
        U: [],
        D: [],
    };

    // Load Pacman frames
    const path = "assets/images/blaise/pacman/";
    for (let i = 0; i < 4; i++) {
        // Right, Left, Up, Down frames
        pacmanFrames["R"][i] = new Image();
        pacmanFrames["R"][i].src = `${path}right${i}.png`;

        pacmanFrames["L"][i] = new Image();
        pacmanFrames["L"][i].src = `${path}left${i}.png`;

        pacmanFrames["U"][i] = new Image();
        pacmanFrames["U"][i].src = `${path}up${i}.png`;

        pacmanFrames["D"][i] = new Image();
        pacmanFrames["D"][i].src = `${path}down${i}.png`;
    }
}

// Load the portal animation frames
function loadPortalFrames() {
    const path = "assets/images/blaise/portal/";
    for (let i = 0; i < 4; i++) {
        const img = new Image();
        img.src = `${path}frame${i}.webp`;
        portalFrames.push(img);
    }
}

// Load map and initialize game objects this will also be used to reset levels
function loadMap() {
    // Clear previous level data
    walls.clear();
    vents.clear();
    foods.clear();
    nuclearWastes.clear();
    powerUps.clear();
    aliens.clear();

    // Get the current map layout
    const map = levels[currentLevel];

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = map[r];
            const levelChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (levelChar === "X") {
                // Wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            } else if (levelChar === "x") {
                // Vent
                const vent = new Block(ventImage, x, y, tileSize, tileSize);
                vents.add(vent);
            } else if (levelChar === "n") {
                // Nuclear Waste
                const nuclearWaste = new Block(
                    nuclearWasteImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                nuclearWastes.add(nuclearWaste);
            } else if (levelChar === "+") {
                // Power-Up
                const powerUp = new Block(
                    powerUpImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                powerUps.add(powerUp);
            } else if (levelChar === "1") {
                // Blue Alien
                const alien = new Block(
                    blueAlienImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                alien.updateDirection = Movement.prototype.updateDirection; // Assign movement methods
                alien.updateVelocity = Movement.prototype.updateVelocity; // Assign movement methods
                // set initial direction and velocity
                alien.speed = tileSize / 4; // Alien speed
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.direction = newDirection;
                alien.updateVelocity();
                aliens.add(alien);
            } else if (levelChar === "2") {
                // Green Alien
                const alien = new Block(
                    greenAlienImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                alien.updateDirection = Movement.prototype.updateDirection; // Assign movement methods
                alien.updateVelocity = Movement.prototype.updateVelocity; // Assign movement methods
                // set initial direction and velocity
                alien.speed = tileSize / 4; // Alien speed
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.direction = newDirection;
                alien.updateVelocity();
                aliens.add(alien);
            } else if (levelChar === "3") {
                // Pink Alien
                const alien = new Block(
                    pinkAlienImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                alien.updateDirection = Movement.prototype.updateDirection; // Assign movement methods
                alien.updateVelocity = Movement.prototype.updateVelocity; // Assign movement methods
                // set initial direction and velocity
                alien.speed = tileSize / 4; // Alien speed
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.direction = newDirection;
                alien.updateVelocity();
                aliens.add(alien);
            } else if (levelChar === "4") {
                // Purple Alien
                const alien = new Block(
                    purpleAlienImage,
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                alien.updateDirection = Movement.prototype.updateDirection; // Assign movement methods
                alien.updateVelocity = Movement.prototype.updateVelocity; // Assign movement methods
                // set initial direction and velocity
                alien.speed = tileSize / 4; // Alien speed
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.direction = newDirection;
                alien.updateVelocity();
                aliens.add(alien);
            } else if (levelChar === "P") {
                // Pacman Start
                pacman = new Block(
                    pacmanFrames["R"][1],
                    x,
                    y,
                    tileSize,
                    tileSize
                );
                // Movement properties and starting direction
                pacman.direction = "R"; // Initial direction
                // Assigning next direction to implement smoother direction changes
                pacman.nextDirection = "R"; // Start moving right
                // Reset velocities
                pacman.velocityX = 0;
                pacman.velocityY = 0;
                pacman.speed = tileSize / 4; // Pacman speed
                pacman.updateDirection = Movement.prototype.updateDirection;
                pacman.updateVelocity = Movement.prototype.updateVelocity;
            } else if (levelChar === " ") {
                // Food pellet (placed in the center of the tile)
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            // Portal to be added later
        }
    }
}

// Load Game Music Effects
function backgroundMusic() {
    // Check if mute is enabled
    if (mute) return;
    const bgMusic = new Audio("assets/sounds/blaise/background.mp3");
    bgMusic.loop = true; // Loop the background music
    bgMusic.volume = 0.1; // Set volume (0.0 to 1.0)
    bgMusic.play(); // Start playing the music
    // Play music after the first interaction due to browser policies
    document.addEventListener(
        "click",
        function playMusic() {
            bgMusic.play();
            document.removeEventListener("click", playMusic);
        },
        { once: true }
    );
}
// Food eaten sound effect
function playFoodSound() {
    if (mute) return;
    const foodSound = new Audio("assets/sounds/blaise/chomp.mp3");
    foodSound.volume = 0.1; // Set volume (0.0 to 1.0)
    foodSound.play();
}
// Eat Nuclear Waste sound effect
function playNuclearWasteSound() {
    if (mute) return;
    const nuclearWasteSound = new Audio(
        "assets/sounds/blaise/eatnuclearWaste.mp3"
    );
    nuclearWasteSound.volume = 0.3; // Set volume (0.0 to 1.0)
    nuclearWasteSound.play();
}
// Power-Up sound effect
function playPowerUpSound() {
    if (mute) return;
    const powerUpSound = new Audio("assets/sounds/blaise/powerUp.mp3");
    powerUpSound.volume = 0.4; // Set volume (0.0 to 1.0)
    powerUpSound.play();
}
// Death sound effect
function playDeathSound() {
    if (mute) return;
    const deathSound = new Audio("assets/sounds/blaise/death.mp3");
    deathSound.volume = 0.4; // Set volume (0.0 to 1.0)
    deathSound.play();
}
// Eating alien sound effect
function playEatAlienSound() {
    if (mute) return;
    const eatAlienSound = new Audio("assets/sounds/blaise/eatAlien.mp3");
    eatAlienSound.volume = 0.3; // Set volume (0.0 to 1.0)
    eatAlienSound.play();
}
// Play portal sound effect
function playPortalSound() {
    if (mute) return;
    const portalSound = new Audio("assets/sounds/blaise/portal.mp3");
    portalSound.volume = 0.4; // Set volume (0.0 to 1.0)
    portalSound.play();
}

// Update function for game objects and redrawing the canvas
function update() {
    // Pacman animation logic
    //Only animate if pacman is moving and game is not over or paused
    if (
        !gameOver &&
        !paused &&
        (pacman.velocityX !== 0 || pacman.velocityY !== 0)
    ) {
        pacman.frameCounter++;
        // Change frame every 'animationSpeed' updates
        if (pacman.frameCounter >= animationSpeed) {
            // Reset counter and update frame index
            pacman.frameCounter = 0;
            pacman.frameIndex = (pacman.frameIndex + 1) % 4;
        }
    } else if (pacman.velocityX === 0 && pacman.velocityY === 0) {
        // Reset to mouth half open when not moving
        pacman.frameIndex = 1;
    }
    // Check for game over
    if (gameOver) {
        // show game over screen
        document.querySelector("#pacman_gameOver").classList.remove("hidden");
        return;
    }
    // Check for paused
    if (paused) {
        // show paused screen
        document.querySelector("#pacman_gamePaused").classList.remove("hidden");
        return;
    }
    // Update canvas in a loop
    // Update based on velocities within the move function
    move();
    // Redraw all game objects
    draw();
    // Check for level completion
    checkLevelComplete();
    // We set it using a timeout instead of setInterval to have more control
    setTimeout(update, 40); // Update every 50 milliseconds (20 FPS)
}

// draw function to render all game objects on the canvas
function draw() {
    context.clearRect(0, 0, board.width, board.height);

    context.save(); // Save current context
    context.scale(scale, scale); // Scale everything by the scale factor

    // Draw Pacman
    if (pacman) {
        const frame = pacmanFrames[pacman.direction][pacman.frameIndex];
        context.drawImage(
            frame,
            pacman.x,
            pacman.y,
            pacman.width,
            pacman.height
        );
    }

    // Draw Portal
    if (portal) {
        portal.frameCounter++;
        if (portal.frameCounter >= portalAnimationSpeed) {
            portal.frameCounter = 0;
            portal.frameIndex = (portal.frameIndex + 1) % portalFrames.length;
        }
        context.drawImage(
            portalFrames[portal.frameIndex],
            portal.x,
            portal.y,
            portal.width,
            portal.height
        );
    }

    // Draw walls
    for (let wall of walls) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    // Draw aliens, vents, power-ups, nuclear waste, food, etc.
    for (let alien of aliens) {
        context.drawImage(
            alien.image,
            alien.x,
            alien.y,
            alien.width,
            alien.height
        );
    }

    for (let vent of vents) {
        context.drawImage(vent.image, vent.x, vent.y, vent.width, vent.height);
    }

    for (let nuclearWaste of nuclearWastes) {
        context.drawImage(
            nuclearWaste.image,
            nuclearWaste.x,
            nuclearWaste.y,
            nuclearWaste.width,
            nuclearWaste.height
        );
        context.globalCompositeOperation = "destination-over";
    }

    for (let powerUp of powerUps) {
        context.drawImage(
            powerUp.image,
            powerUp.x,
            powerUp.y,
            powerUp.width,
            powerUp.height
        );
        context.globalCompositeOperation = "destination-over";
    }

    for (let food of foods) {
        context.fillStyle = "green";
        context.beginPath();
        context.arc(
            food.x + food.width / 2,
            food.y + food.height / 2,
            food.width / 2,
            0,
            Math.PI * 2
        );
        context.fill();
        // z index to show under pacman and aliens
        context.globalCompositeOperation = "destination-over";
    }
    // Change the score display in the HTML
    document.querySelector("#score").innerText = `Score: ${score}`;
    // Update lives img display in the HTML
    // Get lifeImages from the DOM
    const lifeImages = document.querySelectorAll("#lives img");
    // Update life images based on current lives
    if (lifeImages && lifeImages.length >= 3) {
        lifeImages[0].src =
            lives >= 1
                ? "assets/images/blaise/fullHeart.webp"
                : "assets/images/blaise/lostHeart.webp";
        lifeImages[1].src =
            lives >= 2
                ? "assets/images/blaise/fullHeart.webp"
                : "assets/images/blaise/lostHeart.webp";
        lifeImages[2].src =
            lives >= 3
                ? "assets/images/blaise/fullHeart.webp"
                : "assets/images/blaise/lostHeart.webp";
    }
    // update the level display in the HTML
    document.querySelector("#level").innerText = `Level: ${currentLevel + 1}`;

    context.restore(); // Restore unscaled context for HTML overlays
}

// move function to update game object positions
function move() {
    // Update pacman to next direction if possible
    // Try to update direction if nextDirection is different
    if (pacman.nextDirection !== pacman.direction) {
        // Create a next position for the next move
        const next = {
            x: pacman.x,
            y: pacman.y,
            width: pacman.width,
            height: pacman.height,
        };
        const speed = pacman.speed;

        // Move next position slightly in the next direction
        if (pacman.nextDirection === "U") next.y -= speed;
        else if (pacman.nextDirection === "D") next.y += speed;
        else if (pacman.nextDirection === "L") next.x -= speed;
        else if (pacman.nextDirection === "R") next.x += speed;

        // Check if turning is possible (no wall collision)
        let canTurn = true;
        for (let wall of walls) {
            if (collision(next, wall)) {
                canTurn = false;
                break;
            }
        }
        // Check for vents and prevent turning into them
        for (let vent of vents) {
            if (collision(next, vent)) {
                canTurn = false;
                break;
            }
        }
        // Check if pacman is near the center of a tile to allow turning
        // This is to ensure smooth turning at intersections
        if (
            Math.abs(pacman.x % tileSize) < 2 &&
            Math.abs(pacman.y % tileSize) < 2
        ) {
            canTurn = canTurn;
        } else {
            canTurn = false;
        }
        // If clear, actually change direction
        if (canTurn) {
            pacman.updateDirection(pacman.nextDirection);
        }
    }
    // Update pacman position based on velocity
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    // Prevent pacman from leaving the canvas boundaries
    pacman.x = Math.max(0, Math.min(pacman.x, boardWidth - pacman.width));
    pacman.y = Math.max(0, Math.min(pacman.y, boardHeight - pacman.height));
    // Check for collisions with walls
    for (let wall of walls) {
        if (collision(pacman, wall)) {
            // Collision detected, revert position
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with vents
    for (let vent of vents) {
        if (collision(pacman, vent)) {
            // Horizontal collision
            if (
                pacman.velocityX > 0 &&
                pacman.x + pacman.width > vent.x &&
                pacman.x < vent.x + vent.width
            ) {
                pacman.x = vent.x - pacman.width;
            } else if (
                pacman.velocityX < 0 &&
                pacman.x < vent.x + vent.width &&
                pacman.x + pacman.width > vent.x + vent.width
            ) {
                pacman.x = vent.x + vent.width;
            }

            // Vertical collision
            if (
                pacman.velocityY > 0 &&
                pacman.y + pacman.height > vent.y &&
                pacman.y < vent.y
            ) {
                pacman.y = vent.y - pacman.height;
            } else if (
                pacman.velocityY < 0 &&
                pacman.y < vent.y + vent.height &&
                pacman.y + pacman.height > vent.y + vent.height
            ) {
                pacman.y = vent.y + vent.height;
            }

            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with portal
    if (portal && collision(pacman, portal)) {
        // Move to next level
        currentLevel++;
        if (currentLevel < levels.length) {
            loadMap(currentLevel);
            portal = null; // hide portal
            playPortalSound(); // Play portal sound effect
            // Delay for a second before starting next level
            setTimeout(() => {
                // Reset pacman and alien positions
                resetPositions();
            }, 3000);
        }
    }

    // Check for collisions with food pellets
    for (let food of foods) {
        if (collision(pacman, food)) {
            // Collision detected, remove food pellet
            foods.delete(food);
            score += 10; // Increase score
            playFoodSound(); // Play food eaten sound effect
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with nuclear wastes
    for (let nuclearWaste of nuclearWastes) {
        if (collision(pacman, nuclearWaste)) {
            // Collision detected, remove nuclear waste
            nuclearWastes.delete(nuclearWaste);
            playNuclearWasteSound(); // Play nuclear waste eaten sound effect
            score += 50; // Increase score
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with power-ups
    for (let powerUp of powerUps) {
        if (collision(pacman, powerUp)) {
            // Collision detected, remove power-up
            powerUps.delete(powerUp);
            playPowerUpSound(); // Play power-up sound effect
            // Activate power-up effect logic here
            powerUpActive = true;
            powerUpEffect();
            break; // Exit loop after handling collision
        }
    }
    // Teleport tunnels logic
    if (pacman.x <= 0) {
        pacman.x = boardWidth - pacman.width;
    } else if (pacman.x >= boardWidth - pacman.width) {
        pacman.x = 0;
    }
    if (pacman.y <= 0) {
        pacman.y = boardHeight - pacman.height;
    } else if (pacman.y + pacman.height >= boardHeight) {
        pacman.y = 0;
    }

    // Alien Movement
    for (let alien of aliens) {
        alien.x += alien.velocityX;
        alien.y += alien.velocityY;
        // Prevent alien from leaving the canvas boundaries
        alien.x = Math.max(0, Math.min(alien.x, boardWidth - alien.width));
        alien.y = Math.max(0, Math.min(alien.y, boardHeight - alien.height));
        // Check for collisions with walls
        for (let wall of walls) {
            if (collision(alien, wall)) {
                // Collision detected, revert position
                alien.x -= alien.velocityX;
                alien.y -= alien.velocityY;
                // Choose a new random direction
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.updateDirection(newDirection);
                break; // Exit loop after handling collision
            }
        }
        // Teleport tunnels logic for aliens
        if (alien.x <= 0) {
            alien.x = boardWidth - alien.width;
        } else if (alien.x >= boardWidth - alien.width) {
            alien.x = 0;
        }
        if (alien.y <= 0) {
            alien.y = boardHeight - alien.height;
        } else if (alien.y + alien.height >= boardHeight) {
            alien.y = 0;
        }
        // Randomly change direction at intervals
        if (alien.x % tileSize === 0 && alien.y % tileSize === 0) {
            if (Math.random() < 0.4) {
                const newDirection = direction[Math.floor(Math.random() * 4)];
                alien.updateDirection(newDirection);
            }
        }
        // Check for collisions with aliens
        if (!powerUpActive && collision(pacman, alien)) {
            // Collision detected between pacman and alien
            playDeathSound(); // Play death sound effect
            // Decrease life function
            death();
            // For example, reset positions
            resetPositions();
        }
        if (powerUpActive) {
            // Aliens move away from Pacman
            const dx = alien.x - pacman.x;
            const dy = alien.y - pacman.y;
            // Determine direction to move away
            if (Math.abs(dx) > Math.abs(dy)) {
                alien.updateDirection(dx > 0 ? "R" : "L");
            } else {
                alien.updateDirection(dy > 0 ? "D" : "U");
            }
            // Slow down aliens
            alien.speed = tileSize / 8; // Reduce speed
            alien.updateVelocity();
        }
        if (powerUpActive && collision(pacman, alien)) {
            // Collision detected between pacman and alien during power-up
            playEatAlienSound(); // Play eat alien sound effect
            score += 200; // Increase score for eating alien
            // Reset alien position
            alien.reset();
            const newDirection = direction[Math.floor(Math.random() * 4)];
            alien.updateDirection(newDirection);
        }
        if (!powerUpActive) {
            // Reset alien speed
            alien.speed = tileSize / 4; // Normal speed
            alien.updateVelocity();
        }
    }
}

// Power-up effect for aliens
function powerUpEffect() {
    if (powerUpActive) {
        // Change alien images to frightened versions
        for (let alien of aliens) {
            const imgPath = alien.image.src;
            if (imgPath.includes("blueAlien0")) {
                alien.image.src = "assets/images/blaise/aliens/blueAlien1.webp";
            } else if (imgPath.includes("greenAlien0")) {
                alien.image.src =
                    "assets/images/blaise/aliens/greenAlien1.webp";
            } else if (imgPath.includes("pinkAlien0")) {
                alien.image.src = "assets/images/blaise/aliens/pinkAlien1.webp";
            } else if (imgPath.includes("purpleAlien0")) {
                alien.image.src =
                    "assets/images/blaise/aliens/purpleAlien1.webp";
            }
        }

        // 10s timer before calling if statement
        setTimeout(() => {
            powerUpActive = false;
            revertPowerUpEffect();
        }, 10000); // Power-up lasts for 10 seconds
    }
}

// Revert alien images back to normal after power-up effect ends
function revertPowerUpEffect() {
    for (let alien of aliens) {
        const imgPath = alien.image.src;
        if (imgPath.includes("blueAlien1")) {
            alien.image.src = "assets/images/blaise/aliens/blueAlien0.webp";
        } else if (imgPath.includes("greenAlien1")) {
            alien.image.src = "assets/images/blaise/aliens/greenAlien0.webp";
        } else if (imgPath.includes("pinkAlien1")) {
            alien.image.src = "assets/images/blaise/aliens/pinkAlien0.webp";
        } else if (imgPath.includes("purpleAlien1")) {
            alien.image.src = "assets/images/blaise/aliens/purpleAlien0.webp";
        }
    }
}

// increment level function
function checkLevelComplete() {
    if (foods.size === 0) {
        // Instead of immediately loading next level, spawn portal
        if (!portal) {
            spawnPortal(); // Show portal
        }
    }
}


// Spawn the portal
function spawnPortal() {
    const portalTiles = 3; // 3x3 portal
    const map = levels[currentLevel];

    let portalRow = 0;
    let portalCol = 0;

    // Find the "p" tile in the current map
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            if (map[r][c] === "p") {
                portalRow = r;
                portalCol = c;
                break;
            }
        }
    }

    // Calculate top-left corner so the portal is centered on the "p" tile
    const x = (portalCol - Math.floor(portalTiles / 2)) * tileSize;
    const y = (portalRow - Math.floor(portalTiles / 2)) * tileSize;

    // Create the portal block with 3x3 size
    portal = new Block(portalFrames[0], x, y, tileSize * portalTiles, tileSize * portalTiles);
    portal.frameIndex = 0;
    portal.frameCounter = 0;
}


// Death function to handle life decrement and reset positions
function death() {
    lives--;
    if (lives <= 0) {
        gameOver = true;
        // Check high score and update if necessary
        if (score > highScore) {
            highScore = score;
            document.querySelector(
                "#highScore"
            ).innerText = `High Score: ${highScore}`;
        }
        // Show final score on game over screen
        document.querySelector(
            "#finalScore"
        ).innerText = `Final Score: ${score}`;
    }
}

// Game over screen button functions
function restartGame() {
    // Reset game state variables
    powerUpActive = false;
    // Reset UI elements
    document.querySelector("#pacman_gameOver").classList.add("hidden");
    // Reset score and lives
    score = 0;
    lives = 3;
    currentLevel = 0;
    // Restart game loop
    gameOver = false;
    loadMap(currentLevel);
    resetPositions();
    update();
}

// Moving pacman class to handle
function movePacman(e) {
    // Determine desired direction
    let desired;
    // Update pacman direction based on arrow key input
    if (e.code === "ArrowUp" || e.code === "KeyW") {
        desired = "U";
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        desired = "D";
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        desired = "L";
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        desired = "R";
    }
    if (!desired) return; // Exit if no valid direction
    // Set pacman's next direction
    pacman.nextDirection = desired;
    // Allow pacman to move right away if currently stationary
    if (pacman.velocityX === 0 && pacman.velocityY === 0) {
        pacman.updateDirection(desired);
    }
}

// collision detection function AABB method
function collision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Reset function to reset game objects to starting positions
function resetPositions() {
    // Reset pacman position
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    // Reset aliens positions
    for (let alien of aliens) {
        alien.reset();
        const newDirection = direction[Math.floor(Math.random() * 4)];
        if (!alien.updateDirection) {
            alien.direction = newDirection;
            alien.velocityX = 0;
            alien.velocityY = 0;
            alien.updateDirection = Movement.prototype.updateDirection;
            alien.updateVelocity = Movement.prototype.updateVelocity;
        }
        alien.updateDirection(newDirection);
    }
}

// constructors for game objects will go here (Pacman, Alien, Resource, etc.)
class Block {
    constructor(image, x, y, width, height) {
        // Position
        this.image = image;
        this.x = x;
        this.y = y;
        // Dimensions
        this.width = width;
        this.height = height;

        // Starting position (aliens)
        this.startX = x;
        this.startY = y;

        // Animated reset state
        this.frameIndex = 1; // Start at frame 1 (mouth half open)
        this.frameCounter = 0;
    }
    // Reset position method
    // This will be used to reset aliens and pacman to their starting positions
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        // Reset animation state
        this.frameIndex = 1; // Reset to frame 1 (mouth half open)
    }
}

// movement and game logic
class Movement {
    constructor() {
        // Movement properties
        this.direction = "R"; // Default direction
        this.velocityX = 0; // Velocity in X direction
        this.velocityY = 0; // Velocity in Y direction
    }
    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity(); // Update velocity based on new direction

        // If direction changed, reset frame index for animation
        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let wall of walls) {
            if (collision(this, wall)) {
                // Collision detected, revert to previous direction and velocity
                this.x -= this.velocityX; // Revert X position
                this.y -= this.velocityY; // Revert Y position
                this.direction = prevDirection; // Revert to previous direction
                this.updateVelocity(); // Revert velocity
                break; // Exit loop after handling collision
            }
        }
    }
    updateVelocity() {
        // Update velocity based on direction
        const speed = this.speed || tileSize / 4;
        if (this.direction === "U") {
            // Up
            this.velocityX = 0;
            this.velocityY = -speed;
        } else if (this.direction === "D") {
            // Down
            this.velocityX = 0;
            this.velocityY = speed;
        } else if (this.direction === "L") {
            // Left
            this.velocityX = -speed;
            this.velocityY = 0;
        } else if (this.direction === "R") {
            // Right
            this.velocityX = speed;
            this.velocityY = 0;
        }
    }
}
