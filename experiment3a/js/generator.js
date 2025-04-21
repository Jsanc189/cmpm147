// sketch.js - purpose and description here
// Author: Your Name
// Date:

/* exported generateGrid, drawGrid */
/* global placeTile */

//makes a list of characters using noise for different map biomes
function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let noiseValue = noise(i/8, j/7);
      if(.10 <= noiseValue && noiseValue < .40){
        row.push("W");
      } else if(.45 <= noiseValue  && noiseValue < .52) {
        row.push("F");
      } else if (.70 <= noiseValue && noiseValue < .72){
        row.push("H");
      } else {
        row.push("_");
      }
    }
    grid.push(row);
  } 
  return grid;
}

//Places sprite tiles based on list using lookup tables
function drawGrid(grid) {
  background(128);
  const tileStyles = {
    'W': [waterLookup, waterEdgeLookup],
    'F': [groundLookup, forestLookup],
    'H': [groundLookup, houseLookup],
  };

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(tileStyles[grid[i][j]]){
        tileStyles[grid[i][j]].forEach(lookup => {
          drawContext(grid, i, j, grid[i][j], 0, 0, lookup);
        });
      } else {
        placeTile(i, j, (floor(random(4))),0);
      }
    }
  }
  
  drawClouds(grid);

}



//checks each tile for what type of tiles are next to it
function gridCheck(grid, i, j, target) { 
  //if location i, j is inside the grid (not out of bounds), 
  //return true if grid[i][j] == target else return false
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] == target;
  }
  
  return false;
}


//
function gridCode(grid, i, j, target) {
  //Form a 4bit code using gridCheck on the north/south/east/west
  //neighbors of i,j for the target code.  You might use an example like
  //(northBit << 0) + southBit<<1) + (eastBit<<2)+(westBit<<3)
  const north = gridCheck(grid, i - 1, j, target);
  const south = gridCheck(grid, i + 1, j, target);
  const east = gridCheck(grid, i, j + 1, target);
  const west = gridCheck(grid, i, j - 1, target);
  
  //combine bits
  return (north << 0) + (south << 1) + (east << 2) + (west << 3);
}

function drawContext(grid, i, j, target, dti, dtj, lookupTable) {
  //get the code for this location and target.
  //Use the code as an array index to get a pair of tile offset
  const tileCode = gridCode(grid, i, j, target);
  const tileOffset = lookupTable[tileCode];
  
  if (tileOffset) {
    const offsetI = tileOffset[0];
    const offsetJ = tileOffset[1];
    placeTile(i, j, offsetI + dti, offsetJ + dtj)
  }
}


function drawClouds(grid) {
  noStroke();
  const noiseOffset = 100
  const noiseFactor = 10
  const cols = 40
  
  //mouse input
  let offsetX = mouseX * .002 + frameCount * .0007;
  let offsetY = mouseY * .005 + frameCount * .0003;
  
  fill(255, 255, 255);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cloudValue = noise(i / noiseFactor + noiseOffset + offsetX, j / noiseFactor + noiseOffset + offsetY);
      if (cloudValue > 0.65) {
        let x = j * width / cols;
        let y = i * width / cols;
        ellipse(x + 16, y + 16, 40, 30);
      }
    }
  }
  
}


const groundLookup = [
  [0,0], // 0000 - isolated
  [0,0], // 0001 - N only
  [0,0], // 0010 - S only
  [0,0], // NS
  [0,0], // E only
  [0,0], // N+E
  [0,0], // S+E
  [0,0], // NSE
  [0,0], // W only
  [0,0], // N+W
  [0,0], // S+W
  [0,0], // NSW
  [0,0], // E+W
  [0,0], // N+E+W
  [0,0], // S+E+W
  [0,0], // NSEW - full surround
]

const houseLookup = [
  [26,0], // 0000 - isolated
  [26,1], // 0001 - N only
  [26,2], // 0010 - S only
  [0,0], // NS
  [26,3], // E only
  [0,0], // N+E
  [0,0], // S+E
  [0,0], // NSE
  [26,0], // W only
  [0,0], // N+W
  [0,0], // S+W
  [0,0], // NSW
  [0,0], // E+W
  [0,0], // N+E+W
  [0,0], // S+E+W
  [0,0], // NSEW - full surround
]

const forestLookup = [
  [14,6], // 0000 - isolated
  [16,2], // 0001 - N only
  [14,0], // 0010 - S only
  [15, 6], // NS
  [15,2], // E only
  [15,2], // N+E
  [15,6], // S+E
  [15,1], // NSE
  [15,8], // W only
  [17,2], // N+W
  [17,0], // S+W
  [17,7], // NSW
  [16, 2], // E+W
  [16, 2], // N+E+W
  [16, 0], // S+E+W
  [16,6], // NSEW - full surround
];


const waterLookup = [
  [1,13], // 0000 - isolated
  [1,13], // 0001 - N only
  [1,13], // 0010 - S only
  [1,13], // NS
  [1,13], // E only
  [1,13], // N+E
  [1,13], // S+E
  [1,13], // NSE
  [1,13], // W only
  [1,13], // N+W
  [1,13], // S+W
  [1,13], // NSW
  [1,13], // E+W
  [1,13], // N+E+W
  [1,13], // S+E+W
  [1,13], // NSEW - full surround
]

const waterEdgeLookup = [
  [1,13], // 0000 - isolated
  [10, 2], // 0001 - N only
  [10,0], // 0010 - S only
  [9,1], // NS
  [1,13], // E only
  [9,2], // N+E
  [9,0], // S+E
  [9,1], // NSE
  [1,13], // W only
  [13,0], // N+W
  [11,0], // S+W
  [11,1], // NSW
  [1,13], // E+W
  [10,2], // N+E+W
  [10,0], // S+E+W
  [1,13], // NSEW - full surround
]


