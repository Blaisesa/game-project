const joystick = document.getElementById("joystick");
const activeKeys = new Set();

// Maps all keys to joystick direction parts
const keyDirectionMap = {
    ArrowUp: "U",
    KeyW: "U",
    ArrowDown: "D",
    KeyS: "D",
    ArrowRight: "R",
    KeyD: "R",
    ArrowLeft: "L",
    KeyA: "L",
};

// Update joystick image based on active keys
function updateJoystick() {
    let src = "assets/images/joystick/";

    if (activeKeys.has("U")) {
        src += "forward.png";
    } else if (activeKeys.has("D")) {
        src += "backward.png";
    } else if (activeKeys.has("L")) {
        src += "left.png";
    } else if (activeKeys.has("R")) {
        src += "right.png";
    } else {
        src += "central.png";
    }

    joystick.src = src;
}

// Listen for keydown events
window.addEventListener("keydown", (e) => {
    const direction = keyDirectionMap[e.code];
    if (direction) {
        activeKeys.add(direction);
        updateJoystick();
        resetJoystick();
    }
});

// listen for mobile touch events
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
        Swipe();
    },
    { passive: true }
);
// Determine swipe direction and update joystick
function Swipe() {
    const X = touchEndX - touchStartX;
    const Y = touchEndY - touchStartY;
    const absDeltaX = Math.abs(X);
    const absDeltaY = Math.abs(Y);
    const swipeThreshold = 30; // Minimum distance for a swipe
    if (absDeltaX < swipeThreshold && absDeltaY < swipeThreshold) {
        return; // Not a valid swipe
    }
    if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (X > 0) {
            activeKeys.add("R");
        } else {
            activeKeys.add("L");
        }
    } else {
        // Vertical swipe
        if (Y > 0) {
            activeKeys.add("D");
        } else {
            activeKeys.add("U");
        }
    }

    updateJoystick();
    resetJoystick();
}

// Reset joystick after 100ms on keyup or touchend
function resetJoystick() {
    setTimeout(() => {
        activeKeys.clear();
        updateJoystick();
    }, 150);
}
