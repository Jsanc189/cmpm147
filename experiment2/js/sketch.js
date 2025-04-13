// sketch.js - purpose and description here
// Author: Jackie Sanchez
// Date: 4/13/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
      this.property1 = param1;
      this.property2 = param2;
  }

  myMethod() {
      // code to run when method is called
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

let seed = 500;

const mountainColor = "#000000";
const starColor = "#a892d3";
let starList = [];
const stars = 1000;
let cloudList = [];
const clouds = 20;

const cloudColors = [
  [228, 127, 120],
  [205, 132, 177],
  [207, 129, 162],
  [251, 169, 166],
  [216, 112, 104],
];

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    setTimeout(resizeScreen, 100);
    //resizeScreen();
  });
  resizeScreen();

  document.getElementById("new-sky").addEventListener("click", () => {
    seed++;
    generateStars();
    generateClouds();
  });

  generateStars();
  generateClouds();

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  
  //sky creation
  noStroke();
  let skyX = 0;
  let skyY = 0;
  let gradient = .02
  for (let i = 0; i < 35; i++) {
    let intensity = gradient;
    fill(lerpColor(color(22,93,221), color(37, 12, 53), intensity));
    rect(skyX, skyY, skyX +(width/35), height);
    skyX = skyX + (width/50);
    gradient += .02;
  }

  skyX = 0;
  skyY = 0;
  gradient =.02;
  let darkLayers = 20;
  for (let i = 0; i < darkLayers; i++) {
    let intensity = gradient
    let offset = 5;
    let alpha = map(i, 0, darkLayers - 1, 180, 0);
    let darkColor = lerpColor(color(0,0,0), color(i*10,i*10,i*10), intensity);
    darkColor.setAlpha(alpha);
    
    fill(darkColor);
    rect(skyX, skyY, width, skyY + offset);
    skyY = skyY + offset;
    gradient = gradient + .02;
  }
  
  
  
  //mountain generation
  const peaks = random(450,500);
  const horizonHeight = height;
  let mountainPoints= [];
  
  //create points for the Mountain horizon
  for(let i = 0; i < peaks; i++) {
    let x = (width * i * 10) / peaks;
    let y = horizonHeight - (random(27,35))
    mountainPoints.push({x,y});
  }
  
  //logic from ChatGPT
  let highlightLines = 60;
  for (let i = 0; i < highlightLines; i++) {
    let offset = 1+ i * 2;
    let alpha = map(i, 0, highlightLines -1, 180, 0);
    let highlightColor = lerpColor(color(0,0,0), color(250,145, 112), .7);
    highlightColor.setAlpha(alpha);
    
    noFill();
    stroke(highlightColor);
    strokeWeight(1.9);
    beginShape();
    
    for (let pt of mountainPoints) {
      vertex(pt.x, pt.y - offset);
    }
    endShape();
  }
  
  
  stroke("#ffffff");
  strokeWeight(.1);
  fill(mountainColor);
  beginShape();
  vertex(0, horizonHeight);
  for (let point of mountainPoints) {
    vertex(point.x, point.y-3);
  }
  vertex(width, horizonHeight);
  endShape(CLOSE);
  
  
  // star generation
  stroke(starColor);
  strokeWeight(1);
  fill(starColor);
  for(let star of starList) {
    circle(star.x, star.y, star.r)
    star.x += star.d;
    
    if (star.x > width) {
      star.x = 0;
    }
  }
  
  //cloud generation
  for ( let cloud of cloudList) {
    drawCloud(cloud);
    cloud.x += cloud.drift;
    
    if (cloud.drift < 0 && cloud.x + cloud.r < 0) {
      cloud.x = width + cloud.r;
    } else if (cloud.drift > 0 && cloud.x - cloud.r > width) {
      cloud.x = -cloud.r;
    }
  }
  

}

function generateStars() {
  randomSeed(seed);
  starList = [];
  let numStars = random(stars);
  print(numStars);
  for (let i = 0; i < numStars; i ++) {
    let x = random(width);
    let y = random(0, height/ 9 * 7)
    let r = random(.01, 4);
    let d = random(0.01, .3);
    starList.push({x, y, r, d});
  }
  

}


//logic from chatGPT updated a variables and deleted some logic
function generateClouds() {
  randomSeed(seed);
  cloudList = [];
  for (let i = 0; i < clouds; i++) {
    let x = random(-100, width);
    let y = random(height * .7, height * .85);
    let r = random(40, 100);
    let drift = random(-0.05, -0.1);
    let color = random(cloudColors);
    let puffCount = 275;
    let puffs = [];
    for (let j = 0; j < puffCount; j++) {
      let xOffset = randomGaussian(0,r);
      let yOffset = randomGaussian(0,r * .25);
      let size = random(4, 18);
      puffs.push({ xOffset, yOffset, size });
    }
    cloudList.push({ x, y, r, color, puffs, drift });
  }
}

function drawCloud(cloud) {
  noStroke();
  let col = color(cloud.color[0], cloud.color[1], cloud.color[2], 35);
  fill(col);
  for (let puff of cloud.puffs) {
    let widthScale = random(0.7, 1.3);
    ellipse(
      cloud.x + puff.xOffset,
      cloud.y + puff.yOffset,
      puff.size,
      puff.size * widthScale
    );
  }
}