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
    "XXXXXXXXX XXXXXXXXX XXXXXXXXX",
    "X                          nX",
    "X XXXX XX X XXX XXXXX X XXXxX",
    "X       x X X       X X    +X",
    "X X X X X X   X X X X   XxX X",
    "X X X X X X X X X X X XXXnX X",
    "X XnX X X X X       X X   X X",
    "X XxX X X X X XX XX X XXX X X",
    "Xn    X X         X       X X",
    "XXXXX X X XXX 1 2 X X X X X X",
    "0     X X      p    X X X   0",
    "XXXXX X XXXXX 3 4 X X X X X X",
    "X           X     X   X   X X",
    "X XXXX XXXX X XXXXX X   X X X",
    "X                     X X X X",
    "X X X XxX X XX X X X XX   X X",
    "X X X   X X  X P   x n  X X X",
    "X X X X   X    X X X XX X X X",
    "X   Xn  X X+XX X   X  X X   X",
    "XXXXXXXXX XXXXXXXXX XXXXXXXXX",
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
    console.log(walls.size);
    console.log(vents.size);
    console.log(nuclearWastes.size);
    console.log(powerUps.size);
    console.log(aliens.size);
    console.log(foods.size);
    
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
            } else if (levelChar === " ") {
                // Food pellet (placed in the center of the tile)
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
            // Portal to be added later
        }
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
}
