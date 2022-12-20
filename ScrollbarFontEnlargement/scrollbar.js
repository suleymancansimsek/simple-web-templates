const scrollbarContainer = document.getElementById("scrollbar-container");
const scrollbar = document.getElementById("scrollbar");

let isDragging = false;
let currentX;
let currentFontSize = 100; // Initial font size is 100%

scrollbar.addEventListener("mousedown", e => {
  isDragging = true;
  currentX = e.clientX;
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;

  const deltaX = e.clientX - currentX;
  currentX = e.clientX;

  currentFontSize += deltaX;
  currentFontSize = Math.max(50, currentFontSize); // Minimum font size is 50%
  currentFontSize = Math.min(200, currentFontSize); // Maximum font size is 200%

  document.body.style.fontSize = `${currentFontSize}%`;

  // Update the position of the scrollbar handle
  const scrollbarContainerRect = scrollbarContainer.getBoundingClientRect();
  scrollbar.style.left = Math.max(0, Math.min(currentX - scrollbarContainerRect.left, scrollbarContainerRect.width - scrollbar.offsetWidth)) + "px";
  scrollbar.style.transition = "left 0.1s ease-out";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  scrollbar.style.transition = ""; // Remove the transition effect
});