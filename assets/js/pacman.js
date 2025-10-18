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