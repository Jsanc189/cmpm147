"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/ 

const buildingPalettes = [
  { top: [240, 240, 240], left: [200, 200, 200], right: [160, 160, 160], window: [255, 255, 255] },
  { top: [250, 240, 220], left: [210, 200, 180], right: [170, 160, 140], window: [255, 244, 214] },
  { top: [230, 230, 255], left: [180, 180, 255], right: [140, 140, 220], window: [200, 230, 255] },
  { top: [220, 240, 250], left: [180, 200, 220], right: [140, 160, 180], window: [150, 200, 255] },
  { top: [210, 230, 250], left: [170, 190, 210], right: [130, 150, 170], window: [100, 150, 200] },
  { top: [200, 220, 240], left: [160, 180, 200], right: [120, 140, 160], window: [80, 120, 180] },
  { top: [190, 210, 230], left: [150, 170, 190], right: [110, 130, 150], window: [90, 90, 160] },
  { top: [180, 200, 210], left: [140, 160, 170], right: [100, 120, 130], window: [60, 100, 120] },
  { top: [170, 190, 200], left: [130, 150, 160], right: [90, 110, 120], window: [40, 80, 100] },
  { top: [255, 245, 220], left: [215, 205, 180], right: [175, 165, 140], window: [255, 240, 200] },
  { top: [255, 235, 200], left: [215, 195, 160], right: [175, 155, 120], window: [255, 210, 150] },
  { top: [255, 220, 180], left: [215, 180, 140], right: [175, 140, 100], window: [255, 190, 100] },
  { top: [240, 240, 240], left: [200, 200, 200], right: [160, 160, 160], window: [220, 220, 220] },
  { top: [220, 220, 220], left: [180, 180, 180], right: [140, 140, 140], window: [180, 180, 180] },
  { top: [250, 250, 200], left: [210, 210, 160], right: [170, 170, 120], window: [255, 255, 150] },
  { top: [255, 200, 200], left: [215, 160, 160], right: [175, 120, 120], window: [255, 180, 200] },
  { top: [240, 230, 255], left: [200, 190, 215], right: [160, 150, 175], window: [200, 180, 255] },
  { top: [220, 255, 240], left: [180, 215, 200], right: [140, 175, 160], window: [160, 255, 200] },
  { top: [200, 255, 230], left: [160, 215, 190], right: [120, 175, 150], window: [120, 255, 180] },
  { top: [240, 255, 255], left: [200, 215, 215], right: [160, 175, 175], window: [255, 255, 255] }
];

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  // return 64;
  return 20;
}
function p3_tileHeight() {
  // return 32;
  return 12;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() {
  fill(104,113,127);
  rect(0, 0, width, height);
  
}

function p3_drawTile(i, j) {
  stroke(0,0,0);
  
  let scale = 0.1;
  let noiseHeight = layeredNoise(i * scale, j * scale, 4, 0.5);
  let maxHeight = 200;
  let tileHeight = floor(noiseHeight * maxHeight);
  let hash = XXH.h32("tile:" + [i, j], worldSeed);
  let paletteIndex = hash % buildingPalettes.length;
  let palette = buildingPalettes[abs(paletteIndex)];
  
  push();
  
  let isClicked = (clicks[[i, j]] | 0) % 2 ===1; 
  

  if (isClicked == 1) {
    translate(0, -tileHeight);
    drawCubeFace(palette.top, -tw, 0, 0, th, tw, 0, 0, -th);
    drawCubeFace(palette.left, -tw, 0, 0, th, 0, th + tileHeight, -tw, tileHeight, isClicked, palette.window);
    drawCubeFace(palette.right, 0, th, tw, 0, tw, tileHeight, 0, th + tileHeight, isClicked, palette.window);
    fill(0, 0, 0, 255);
    noStroke();
    ellipse(0, 0, 10, 5);
    translate(0, -10);
    ellipse(0, 0, 10, 10);
    rect(-5, -2.5, 10, 12)
    fill(255, 255, 255);

  } else {
    drawCubeFace(palette.top, -tw, 0, 0, th, tw, 0, 0, -th);
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}


//code inspired from kdotJPG on reddit: https://www.reddit.com/r/Unity3D/comments/ig295a/perlin_noise_layering/
function layeredNoise(x, y, octaves = 4, persistence = 0.5, baseFrequency = 1.0) {
  let total = 0;
  let amp = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    let freq = baseFrequency * Math.pow(2,i);
    total += noise(x * freq, y * freq) * amp;
    maxValue += amp;
    amp += persistence;
  }
  return total / maxValue
}


function drawCubeFace(color, x1, y1, x2, y2, x3, y3, x4, y4, windows = false, windowColor = null) {
 
  //generates windows on the frame
  if (windows === true) {
    fill(...color);
    beginShape();
    vertex(x1, y1);
    vertex(x2, y2);
    vertex(x3, y3);
    vertex(x4, y4);
    endShape(CLOSE);
    noFill();
    stroke(windowColor);
    let winColor = windowColor || [60, 100, 180];
    let cols = 4;
    let rows = 8;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let topLeft = i / cols;
        let topRight = (i + 1) / cols;
        let bottomLeft = j / rows;
        let bottomRight = (j + 1) / rows;

        // Interpolate each point in the window quad
        let wx1 = lerp(lerp(x1, x4, bottomLeft), lerp(x2, x3, bottomLeft), topLeft);
        let wy1 = lerp(lerp(y1, y4, bottomLeft), lerp(y2, y3, bottomLeft), topLeft);
        let wx2 = lerp(lerp(x1, x4, bottomLeft), lerp(x2, x3, bottomLeft), topRight);
        let wy2 = lerp(lerp(y1, y4, bottomLeft), lerp(y2, y3, bottomLeft), topRight);
        let wx3 = lerp(lerp(x1, x4, bottomRight), lerp(x2, x3, bottomRight), topRight);
        let wy3 = lerp(lerp(y1, y4, bottomRight), lerp(y2, y3, bottomRight), topRight);
        let wx4 = lerp(lerp(x1, x4, bottomRight), lerp(x2, x3, bottomRight), topLeft);
        let wy4 = lerp(lerp(y1, y4, bottomRight), lerp(y2, y3, bottomRight), topLeft);

        drawCubeFace(winColor, wx1, wy1, wx2, wy2, wx3, wy3, wx4, wy4, false);

      }
    }
  } else {
    fill(...color, 170);
    stroke(...color);
    beginShape();
    vertex(x1, y1);
    vertex(x2, y2);
    vertex(x3, y3);
    vertex(x4, y4);
    endShape(CLOSE);
  }
}
