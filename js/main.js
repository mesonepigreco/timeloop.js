// Get the canvas element
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Create the animation loop
function draw(timestamp) {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw in the context a red circle
    context.save();
    context.beginPath();
    context.arc(300, 0.1 * timestamp, 50, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();

    // Draw the animation
    requestAnimationFrame(draw);
}   

// Start the animation loop
requestAnimationFrame(draw);
