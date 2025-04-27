"use strict";


//partner Coded with Raven Cruz
//seed option variables
let blues = [];
let highlights = [];

const colorScale = 0.08;

let tilesetImage;
function p3_preload() {
  tilesetImage = loadImage("https://cdn.glitch.global/b020f7af-9930-4446-b7bd-6b081481e9b5/spritesheet.png?v=1745434001532");
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  
  //decided the color palette based on noise hash
  let paletteIndex = XXH.h32(key, 0) % 3;
  if (paletteIndex === 0) {
    blues =  [
      [120, 176, 141],
      [146, 200, 166],
      [126, 175, 146],
      [75, 128, 106],
      [103, 160, 134]
    ];
    highlights = [
      [200, 239, 185],
      [195, 232, 180],
      [195, 234, 203],
      [240, 255, 233],
      [204, 247, 212]
    ]
  } else if (paletteIndex === 1) {
    blues = [
      [102, 153, 204],
      [0, 102, 153],
      [51, 153, 204],
      [0, 76, 102],
      [102, 204, 255]
    ];
    highlights = [
      [204, 255, 255],
      [153, 255, 255],
      [102, 255, 255],
      [255, 255, 255],
      [204, 255, 229]
    ];
  } else {
    blues = [
      [70, 130, 180],
      [25, 25, 112],
      [65, 105, 225],
      [0, 0, 139],
      [30, 144, 255]
    ];
    highlights = [
      [173, 216, 230],
      [135, 206, 250], 
      [176, 224, 230],
      [224, 255, 255],
      [240, 255, 255]
    ]
  }
}

function p3_tileWidth() {
  return 6;
}
function p3_tileHeight() {
  return 4;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

const TILE_SIZE = 16;
const OUT_SIZE = 64;

//partner coded with Raven Cruz
function placeTile(i, j, ti, tj) {
  noSmooth();
  imageMode(CENTER);
  let noiseValue = noise(ti, tj);
  let index = floor(map(noiseValue, 0, 1, 0, shells1.length));
  let tileImage;

  //place image based on tile noisevalue
  if (noiseValue <.2) {
    tileImage = plants1[index];
  } else if (noiseValue >= .2 && noiseValue < .4) {
    tileImage = plants2[index];
  } else if (noiseValue >= .4 && noiseValue < .6) {
    tileImage = plants3[index];
  } else if (noiseValue >=.6 && noiseValue < .67) {
    tileImage = shells1[index];
  } else if (noiseValue >= .67 && noiseValue < .73) {
    tileImage = shells2[index];
  } else if (noiseValue >= .73 && noiseValue < .80) {
    tileImage = shells3[index];
  } else if (noiseValue >= .80 && noiseValue < .86) {
    tileImage = starFish1[index];
  } else if (noiseValue >= .86 && noiseValue < .93) {
    tileImage = starFish2[index];
  } else {
    tileImage = starFish3[index];
  }
  image(tilesetImage, 
    i , OUT_SIZE *.35, 
    OUT_SIZE, OUT_SIZE, 
    floor(TILE_SIZE * tileImage[0]), floor(TILE_SIZE * tileImage[1]), 
    TILE_SIZE, TILE_SIZE,
  );
}

//set background to constant color
function p3_drawBefore() {
    background([145, 199, 162]);
}


//from Wes Modes: https://wmodes.github.io/cmpm147/experiment4/index.html
function getNoiseColor(x, y, colorArray) {
  // Generate a noise value based on x and y
  let noiseValue = noise(x * colorScale, y * colorScale, frameCount * colorScale);
  
  if (noiseValue < 0.45 && noiseValue > 0.4){
    return[255,255,255, 200]
  }

  // Map the noise value to an index in the color array
  let index = floor(map(noiseValue, 0, 1, 0, colorArray.length));

  // Retrieve and return the selected color from the array
  return colorArray[index];
}

//partner Coded with Raven Cruz color assignment from Wes Modes: https://wmodes.github.io/cmpm147/experiment4/index.html
function p3_drawTile(i, j) {
  noStroke();
  
  //sets color of tiles based on noise and palette.
  if (XXH.h32("tile:" + [i, j], worldSeed) % 5 == 0) {
    const highlightColor = getNoiseColor(i, j, highlights);
    fill(...highlightColor, 100);
  } else {
    const tealColor = getNoiseColor(i,j, blues)
    fill(...tealColor, 100);
  }
  
  //draws sprites
  push();
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    placeTile(0, 0, i, j);
  } 

  //draws tiles
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);


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
  //text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}

//sprite lookup tables
const shells1 = [
    [0,0],
    [1,0],
    [2,0],
    [3,0],
    [0,1],
    [1,1],
    [2,1],
    [3,1],
    [0,2],
    [1,2],
    [2,2],
    [3,2],
    [0,3],
    [1,3],
    [2,3],
    [3,3]
  ]
  const shells2 = [
    [0,4],
    [1,4],
    [2,4],
    [3,4],
    [0,5],
    [1,5],
    [2,5],
    [3,5],
    [0,6],
    [1,6],
    [2,6],
    [3,6],
    [0,7],
    [1,7],
    [2,7],
    [3,7]
  ]
  const shells3 = [
    [0,8],
    [1,8],
    [2,8],
    [3,8],
    [0,9],
    [1,9],
    [2,9],
    [3,9],
    [0,10],
    [1,10],
    [2,10],
    [3,10],
    [0,11],
    [1,11],
    [2,11],
    [3,11]
  ]
  const starFish1 = [
    [4,0],
    [5,0],
    [6,0],
    [7,0],
    [4,1],
    [5,1],
    [6,1],
    [7,1],
    [4,2],
    [5,2],
    [6,2],
    [7,2],
    [4,3],
    [5,3],
    [6,3],
    [7,3]
  ]
  const starFish2 = [
    [4,4],
    [5,4],
    [6,4],
    [7,4],
    [4,5],
    [5,5],
    [6,5],
    [7,5],
    [4,6],
    [5,6],
    [6,6],
    [7,6],
    [4,7],
    [5,7],
    [6,7],
    [7,7]
  ]
  const starFish3 = [
    [4,8],
    [5,8],
    [6,8],
    [7,8],
    [4,9],
    [5,9],
    [6,9],
    [7,9],
    [4,9],
    [5,10],
    [6,10],
    [7,10],
    [4,11],
    [5,11],
    [6,11],
    [7,11]
  ]
  const plants1 = [
    [8,0],
    [9,0],
    [10,0],
    [11,0],
    [8,1],
    [9,1],
    [10,1],
    [11,1],
    [8,2],
    [9,2],
    [10,2],
    [11,2],
    [8,3],
    [9,3],
    [10,3],
    [11,3]
  ]
  const plants2 = [
    [8,4],
    [9,4],
    [10,4],
    [11,4],
    [8,5],
    [9,5],
    [10,5],
    [11,5],
    [8,6],
    [9,6],
    [10,6],
    [11,6],
    [8,7],
    [9,7],
    [10,7],
    [11,7]
  ]
  const plants3 = [
    [8,8],
    [9,8],
    [10,8],
    [11,8],
    [8,9],
    [9,9],
    [10,9],
    [11,9],
    [8,10],
    [9,10],
    [10,10],
    [11,10],
    [8,11],
    [9,11],
    [10,11],
    [11,11]
  ]