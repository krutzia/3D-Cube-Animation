const cube = document.querySelector('.cube');
const resetBtn = document.getElementById('resetBtn');

let isDragging = false;
let previousX;
let previousY;
let rotationX = -20;
let rotationY = -20;

let velocityX = 0;
let velocityY = 0;
let momentumID;

const friction = 0.95; // momentum friction

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateCubeRotation() {
  cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}

function onPointerDown(e) {
  isDragging = true;
  previousX = e.clientX || e.touches[0].clientX;
  previousY = e.clientY || e.touches[0].clientY;
  velocityX = 0;
  velocityY = 0;
  cube.style.transition = 'none';

  if (momentumID) {
    cancelAnimationFrame(momentumID);
  }
}

function onPointerMove(e) {
  if (!isDragging) return;

  const currentX = e.clientX || e.touches[0].clientX;
  const currentY = e.clientY || e.touches[0].clientY;

  const deltaX = currentX - previousX;
  const deltaY = currentY - previousY;

  // Update rotation angles and velocity for momentum
  rotationY += deltaX * 0.5;
  rotationX -= deltaY * 0.5;

  rotationX = clamp(rotationX, -90, 90);

  updateCubeRotation();

  velocityX = deltaX * 0.3;
  velocityY = deltaY * 0.3;

  previousX = currentX;
  previousY = currentY;
}

function applyMomentum() {
  if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01) {
    cancelAnimationFrame(momentumID);
    cube.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    return;
  }

  velocityX *= friction;
  velocityY *= friction;

  rotationY += velocityX;
  rotationX -= velocityY;

  rotationX = clamp(rotationX, -90, 90);

  updateCubeRotation();

  momentumID = requestAnimationFrame(applyMomentum);
}

function onPointerUp() {
  if (!isDragging) return;
  isDragging = false;
  momentumID = requestAnimationFrame(applyMomentum);
}

function resetCube() {
  rotationX = -20;
  rotationY = -20;
  velocityX = 0;
  velocityY = 0;
  cube.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  updateCubeRotation();
}

// Event listeners for mouse and touch events
cube.addEventListener('mousedown', onPointerDown);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);

cube.addEventListener('touchstart', onPointerDown);
window.addEventListener('touchmove', onPointerMove);
window.addEventListener('touchend', onPointerUp);

// Reset button listener
resetBtn.addEventListener('click', resetCube);

// Initialize cube rotation on page load
updateCubeRotation();




