"use strict";

const backgroundPalette = [
  [173, 216, 230], // Light Blue
  [255, 182, 193], // Light Red (pinkish)
  [255, 200, 150], // Light Orange
  [144, 238, 144], // Light Green
  [255, 255, 200], // Light Yellow
  [216, 191, 216]  // Light Purple (Lavender)
];


const circlePalettes = [
  { light: [255, 255, 255], dark: [0, 0, 139] },     // Blue (white to dark blue)
  { light: [255, 255, 255], dark: [139, 0, 0] },     // Red (white to dark red)
  { light: [255, 255, 255], dark: [255, 69, 0] },    // Orange (white to dark orange)
  { light: [255, 255, 255], dark: [0, 100, 0] },     // Green (white to dark green)
  { light: [255, 255, 255], dark: [204, 204, 0] },   // Yellow (white to olive-yellow)
  { light: [255, 255, 255], dark: [75, 0, 130] }     // Purple (white to dark purple)
];


// SFX from https://www.myinstants.com/en/instant/pop-sfx-75405/
let sound;
function p3_preload() {
  //sound = loadSound('https://cdn.glitch.global/f6b25ac8-b423-49b2-a0e8-a84e14e0c100/pop_7e9Is8L.mp3?v=1745711491448', soundLoaded);
  sound = loadSound('SFX/pop.mp3');
}

function soundLoaded() {
  console.log("sound is loaded");
}


function p3_setup() {}

let worldSeed;
let colorIndex;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  
  //set list color index based on noise
  let noiseValue = noise(worldSeed * 0.1);
  colorIndex = Math.floor(noiseValue * backgroundPalette.length); 
}

function p3_tileWidth() {
  return 15;
}
function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  
  let scale = 0.1;
  let soundNoise = noise(i * scale, j * scale);
  sound.rate(soundNoise * random(.1, 1));
  sound.setVolume(soundNoise / random(.1, 1));
  if((clicks[key] | 0) ===1) {
    sound.play();
  }
}

function p3_drawBefore() {
  fill(backgroundPalette[colorIndex]);
  noStroke();
  rect(0, 0, width, height)
  noFill();
}

function p3_drawTile(i, j) {
  noStroke();
  
  let scale = 0.1;
  let noiseHeight = layeredNoise(i * scale, j * scale, frameCount * scale * .1, 2, 0.5);
  
  let lightColor = circlePalettes[colorIndex].light;
  let darkColor = circlePalettes[colorIndex].dark;
  // Map noiseHeight (0 to 1) to blue color range
  let r = lerp(lightColor[0], darkColor[0], noiseHeight);   // Red grows from 0 to 255
  let g = lerp(lightColor[1], darkColor[1], noiseHeight);   // Green grows from 0 to 255
  let b = lerp(lightColor[2], darkColor[2], noiseHeight);   // Blue grows from 139 to 255

  fill(r, g, b);

  push();

  circle(0, 0, tw * noiseHeight);


  let n = clicks[[i, j]] | 0;
//   if (n === 1) {
//     sound.play();
    
//   }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  
  let scale = 0.1;
  
  let noiseHeight = layeredNoise(i * scale, j * scale, 8, 0.5);

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

function p3_drawAfter() {

}

//code inspired from kdotJPG on reddit: https://www.reddit.com/r/Unity3D/comments/ig295a/perlin_noise_layering/
function layeredNoise(x, y, z, octaves = 4, persistence = 0.5, baseFrequency = 1.0) {
  let total = 0;
  let amp = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    let freq = baseFrequency * Math.pow(2,i);
    total += noise(x * freq, y * freq, z * freq) * amp;
    maxValue += amp;
    amp += persistence;
  }
  return total / maxValue
}
