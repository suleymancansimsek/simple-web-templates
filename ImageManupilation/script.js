// The JavaScript code

// Get the input field and the go button
const imageUrlField = document.getElementById('image-url');
const goButton = document.getElementById('go-button');

// Get the image container element
const imageContainer = document.getElementById('image-container');

// When the go button is clicked, redraw the image with dots
goButton.addEventListener('click', () => {
  // Get the image URL from the input field
  const imageUrl = imageUrlField.value;

  // Create a canvas element
  const canvas = document.createElement('canvas');

  // Append the canvas to the image container
  imageContainer.innerHTML = '';
  imageContainer.appendChild(canvas);

  // Get the 2D context of the canvas
  const ctx = canvas.getContext('2d');

  // Create an image element and set its src to the image URL
  const image = new Image();
  image.src = imageUrl;

  // When the image is loaded, draw it on the canvas
  image.onload = () => {
    // Set the size of the canvas to the size of the image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);

    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Iterate over each pixel in the image data
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Get the red, green, and blue values of the pixel
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      // Calculate the grayscale value of the pixel using the luminosity formula
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      // Set the red, green, and blue values of the pixel to the grayscale value
      imageData.data[i] = gray;
      imageData.data[i + 1] = gray;
      imageData.data[i + 2] = gray;
    }

    // Put the modified image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Redraw the image on the canvas using dots
    for (let x = 0; x < canvas.width; x += 5) {
      for (let y = 0; y < canvas.height; y += 5) {
        // Get the pixel data at the current position
        const pixelData = ctx.getImageData(x, y, 1, 1).data;

        // Get the grayscale value of the pixel
        const gray = pixelData[0];

        // Set the fill style to black or white depending on the grayscale value
        ctx.fillStyle = gray > 128 ? 'black' : 'white';

        // Draw a dot at the current position
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };
});
