import World from './world.js';

// Get the canvas element
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let world = new World();

// Create the animation loop
let old_time = 0;
let dt = 0;

function draw(timestamp) {
    dt = timestamp - old_time;
    if (old_time == 0) dt = 0;
    old_time = timestamp;
    

    // Update the world
    if (world.check_loaded()) {
        world.init();
        world.update(timestamp / 1000, dt / 1000);
        world.draw(context, canvas);
    }

    // Draw the animation
    requestAnimationFrame(draw);
}   

// Start the animation loop
requestAnimationFrame(draw);
