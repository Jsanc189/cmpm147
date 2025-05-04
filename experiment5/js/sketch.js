// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js
//let scale;
const targetWidth = 200;
const targetHeight = 200;

function preload() {
  let allInspirations = getInspirations();

  //load images and add option to drop down menu
  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl, img => {
      img.resize(targetWidth, targetHeight); // Resize each image to target dimensions
    });
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  //restarts exploration when drop down option changes
  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]); 
}

//updates 
function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  slider.value = 100;
  setup();
}

// setup() function is called once when the program starts
function setup() {
  currentCanvas = createCanvas(targetWidth, targetHeight);
  currentCanvas.parent(document.getElementById("active"));

  document.getElementById("inspo-img").src = currentInspiration.image.canvas.toDataURL();

  //set up score and pixel values
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;

  image(currentInspiration.image, 0,0, width * 2, height * 2);
  loadPixels();
  currentInspirationPixels = pixels;
  mutationTimer = 0;

}

//fitness function
function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}


//all the "tope scored images"
function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
  
} 

let mutationCount = 0;


//draws current design with a random seed
function draw() {
  //document.getElementById("inspiration").createElement("img");
  
  if(!currentDesign) {
    return;
  }

  mutationTimer += 1;
  if(mutationTimer >= 600){ 
    slider.value = slider.value - 1;
    mutationTimer = 0;
  }
  
  randomSeed(mutationCount++);
  currentDesign = JSON.parse(JSON.stringify(bestDesign));
  rate.innerHTML = slider.value;
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);
  
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  activeScore.innerHTML = nextScore;
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
    mutationTimer = 0;
  }
  

  
  fpsCounter.innerHTML = Math.round(frameRate());
}
