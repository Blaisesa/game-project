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
let portalFrames;
const animationSpeed = 2; // Speed of animation

// Game maps
const level0 = [
    // 0: empty, X: wall, x: vent, n: nuclear waste, +: power-up, 1: blue alien, 2: green alien, 3: pink alien, 4: purple alien, P: pacman start, p: portal, " ": food
    "XXXXXXXXX XXXXXXXXXX XXXXXXXX",
    "X                          nX",
    "X XXXX XX X XXX XXXXX X XXXxX",
    "X       x X X       X X    +X",
    "X X X X X X   X X X X   XxX X",
    "X X X X X X X X X X X XXXnX X",
    "X XnX X X X X       X     X X",
    "X XxX X X X X XX XX X XXX X X",
    "Xn    X X         X       X X",
    "XXXXX X X XXX 1 2 X X X X X X",
    "      X X      p    X X X    ",
    "XXXXX X XXXXX 3 4 X X X X X X",
    "X           X     X   X   X X",
    "X XXXX XXXX X XXXXX X   X X X",
    "X                     X X X X",
    "X X X XxX X XX X X X XX   X X",
    "X X X   X X  X P   x n  X X X",
    "X X X X   X    X X X XX X X X",
    "X   Xn  X X+XX X   X  X X   X",
    "XXXXXXXXX XXXXXXXXXX XXXXXXXX",
];
// Additional levels (level1, level2, etc.) can be defined similarly

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
let lives = 3;
let level = 0;
let gameOver = false;
let gameWin = false;
let levelComplete = false;
let powerUpActive = false;
let paused = false;
let mute = false;

// Initialize the game canvas and context
window.onload = function () {
    board = this.document.querySelector("#board");
    board.width = boardWidth;
    board.height = boardHeight;
    // Get 2D context for the board allowing us to draw on it
    context = board.getContext("2d");

    // Load images
    loadImages();
    // Load the initial map
    loadMap();

    // Console log to confirm loading
    console.log(`walls.size: ${walls.size}`);
    console.log(`vents.size: ${vents.size}`);
    console.log(`nuclearWastes.size: ${nuclearWastes.size}`);
    console.log(`powerUps.size: ${powerUps.size}`);
    console.log(`aliens.size: ${aliens.size}`);
    console.log(`foods.size: ${foods.size}`);

    // Start the game loop function
    update();

    // Event listener for keyboard input
    this.document.addEventListener("keyup", movePacman);
};

// Function to load images
function loadImages() {
    // Wall images
    wallImage = new Image();
    wallImage.src = "../../assets/images/blaise/wall.webp";

    ventImage = new Image();
    ventImage.src = "../../assets/images/blaise/vent.webp";
    // Resources
    nuclearWasteImage = new Image();
    nuclearWasteImage.src = "../../assets/images/blaise/nuclearWaste.png";

    powerUpImage = new Image();
    powerUpImage.src = "../../assets/images/blaise/powerUp.png";

    // Hearts
    fullHeartImage = new Image();
    fullHeartImage.src = "../../assets/images/blaise/fullHeart.webp";
    LostHeartImage = new Image();
    LostHeartImage.src = "../../assets/images/blaise/lostHeart.webp";

    // Aliens
    blueAlienImage = new Image();
    blueAlienImage.src = "../../assets/images/blaise/aliens/blueAlien0.webp";
    greenAlienImage = new Image();
    greenAlienImage.src = "../../assets/images/blaise/aliens/greenAlien0.webp";
    pinkAlienImage = new Image();
    pinkAlienImage.src = "../../assets/images/blaise/aliens/pinkAlien0.webp";
    purpleAlienImage = new Image();
    purpleAlienImage.src =
        "../../assets/images/blaise/aliens/purpleAlien0.webp";

    // Animated Pacman frames
    pacmanFrames = {
        R: [],
        L: [],
        U: [],
        D: [],
    };

    // Load Pacman frames
    const path = "../../assets/images/blaise/pacman/";
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

// Load map and initialize game objects this will also be used to reset levels
function loadMap() {
    // Clear previous level data
    walls.clear();
    vents.clear();
    foods.clear();
    nuclearWastes.clear();
    powerUps.clear();
    aliens.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = level0[r];
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
                pacman.direction = "R";
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
    // Update canvas in a loop
    // Update based on velocities within the move function
    move();
    // Redraw all game objects
    draw();
    // We set it using a timeout instead of setInterval to have more control
    setTimeout(update, 50); // Update every 50 milliseconds (20 FPS)
}

// draw function to render all game objects on the canvas
function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight); // Clear the canvas

    // Draw Pacman with current animation frame
    if (pacman) {
        const currentPacmanFrame =
            pacmanFrames[pacman.direction][pacman.frameIndex];

        context.drawImage(
            currentPacmanFrame,
            pacman.x,
            pacman.y,
            pacman.width,
            pacman.height
        );
    }
    // Aliens
    for (let alien of aliens) {
        context.drawImage(
            alien.image,
            alien.x,
            alien.y,
            alien.width,
            alien.height
        );
    }
    // Walls
    for (let wall of walls) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }
    // Vents
    for (let vent of vents) {
        context.drawImage(vent.image, vent.x, vent.y, vent.width, vent.height);
    }
    // Nuclear Wastes
    for (let nuclearWaste of nuclearWastes) {
        context.drawImage(
            nuclearWaste.image,
            nuclearWaste.x,
            nuclearWaste.y,
            nuclearWaste.width,
            nuclearWaste.height
        );
    }
    // Power-Ups
    for (let powerUp of powerUps) {
        context.drawImage(
            powerUp.image,
            powerUp.x,
            powerUp.y,
            powerUp.width,
            powerUp.height
        );
    }
    // Foods pellets
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
    }
    // Drawing for score and lives within the html
    document.querySelector("#score").innerText = `Score: ${score}`;
    // Lives display as hearts
    document.querySelector(
        "#lives"
    ).innerHTML = `lives: ${'<img src="assets/images/blaise/fullHeart.webp" alt="">'.repeat(
        lives
    )}${'<img src="assets/images/blaise/lostHeart.webp" alt="">'.repeat(
        3 - lives
    )}`;
}

// move function to update game object positions
function move() {
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
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with food pellets
    for (let food of foods) {
        if (collision(pacman, food)) {
            // Collision detected, remove food pellet
            foods.delete(food);
            score += 10; // Increase score
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with nuclear wastes
    for (let nuclearWaste of nuclearWastes) {
        if (collision(pacman, nuclearWaste)) {
            // Collision detected, remove nuclear waste
            nuclearWastes.delete(nuclearWaste);
            score += 50; // Increase score
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with power-ups
    for (let powerUp of powerUps) {
        if (collision(pacman, powerUp)) {
            // Collision detected, remove power-up
            powerUps.delete(powerUp);
            // Activate power-up effect logic here
            break; // Exit loop after handling collision
        }
    }
    // Check for collisions with aliens
    for (let alien of aliens) {
        if (collision(pacman, alien)) {
            // Collision check console log
            // console.log("Pacman collided with an alien!");
            // lives -= 1;
        }
        // Check for game over
        if (lives <= 0) {
            gameOver = true;
            // Game over console log
            // console.log("Game Over!");
        }
    }
}



// Moving pacman class to handle
function movePacman(e) {
    // Update pacman direction based on arrow key input
    if (e.code === "ArrowUp" || e.code === "KeyW") {
        pacman.updateDirection("U");
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
        pacman.updateDirection("D");
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        pacman.updateDirection("L");
    } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        pacman.updateDirection("R");
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
        if (this.direction === "U") {
            // Up
            this.velocityX = 0;
            this.velocityY = -tileSize / 4;
        } else if (this.direction === "D") {
            // Down
            this.velocityX = 0;
            this.velocityY = tileSize / 4;
        } else if (this.direction === "L") {
            // Left
            this.velocityX = -tileSize / 4;
            this.velocityY = 0;
        } else if (this.direction === "R") {
            // Right
            this.velocityX = tileSize / 4;
            this.velocityY = 0;
        }
    }
}
