// Global variables & constants for the game
let board;
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
]
// Additional levels (level1, level2, etc.) can be defined similarly

// Create sets for ingame objects
// Walls and Vents
const walls = new Set();
const vents = new Set();
// Resources
const nuclearWastes = new Set();
const powerUps = new Set();

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


