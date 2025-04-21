// sketch.js - purpose and description here
// Author: Your Name
// Date:

/* exported generateGrid, drawGrid */
/* global placeTile */

//makes a list of characters using noise for different map biomes
/* exported generateGrid, drawGrid */
/* global placeTile */

//makes a list of characters using noise for different map biomes
function generateGrid(numCols, numRows) {
  let grid = [];
  
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let noiseValue = noise(i/8, j/10);
      if(noiseValue< .5) {
        let chestSpawn = floor(random(100));
        if (chestSpawn == 50){
          row.push("C");
        } else {
          row.push("_");
        }
      } else {
        row.push("D");
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
    '_': [groundEdgeLookup],
    'C': [chestLookup],
  };

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if(tileStyles[grid[i][j]]){
        placeTile(i, j, floor(random(21,24)), floor(random(21,24)));
        tileStyles[grid[i][j]].forEach(lookup => {
          drawContext(grid, i, j, grid[i][j], 0, 0, lookup);
        });
      } else {
        placeTile(i, j, 16, 16);
      }
    }
  }
  
  //fog over map.  User cursor draws light in circle
  fill(0,0,0, 180);
  rect(0,0,width, height);
  blendMode(OVERLAY);
  noStroke();
  fill(255,255,255,255)
  circle(mouseX, mouseY, 100);
  blendMode(BLEND);

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


const groundEdgeLookup = [
  [27,25], // 0000 - isolated
  [17,26], // 0001 - N only
  [25,27], // 0010 - S only
  [30,0], // NS
  [27,27], // E only
  [25,23], // N+E
  [25,21], // S+E
  [25,22], // NSE
  [26,26], // W only
  [27,23], // N+W
  [27,21], // S+W
  [27,22], // NSW
  [28,0], // E+W
  [26,23], // N+E+W
  [26,21], // S+E+W
  [31,30], // NSEW - full surround
]

const chestLookup = [
  [4,29], // 0000 - isolated
  [4,29], // 0001 - N only
  [4,29], // 0010 - S only
  [4,29], // NS
  [4,29], // E only
  [4,29], // N+E
  [4,29], // S+E
  [4,29], // NSE
  [4,29], // W only
  [4,29], // N+W
  [4,29], // S+W
  [4,29], // NSW
  [4,29], // E+W
  [4,29], // N+E+W
  [4,29], // S+E+W
  [4,29], // NSEW - full surround
]
