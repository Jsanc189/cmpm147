// project.js - purpose and description here
// Author: Jackie Sanchez
// Date:4/6/2025


/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

//partner coding with Raven Cruz
function getInspirations() {
  return [
    {
      name: "Mars",
      assetUrl:
        "https://cdn.glitch.global/c3de7a6d-dbec-422f-8845-c1a3fd72fc7f/Mars.png?v=1746034471345",
      credit: "Hubble Space Telescope, 2007",
    },
    {
      name: "Pluto",
      assetUrl:
        "https://cdn.glitch.global/c3de7a6d-dbec-422f-8845-c1a3fd72fc7f/pluto.jpg?v=1746034816184",
      credit: "NASA New Horizons, July 2015",
    },
    {
      name: "Aurora Jupiter",
      assetUrl:
        "https://cdn.glitch.global/c3de7a6d-dbec-422f-8845-c1a3fd72fc7f/Aurora%20Jupiter.jpg?v=1746033909095",
      credit: "Hubble Space Telescope, 2016",
    },
  ];
}

function initDesign(inspiration) {
  const SCALE = 200 / inspiration.image.width;
  resizeCanvas(inspiration.image.width * SCALE, inspiration.image.height * SCALE);

  let design = {
    bg: 0,
    fg: [],
  };

  for (let i = 0; i < 5100; i++) {
    const x = random(width);
    const y = random(height);
    const w = random(width / 20);
    const h = random(height / 20);
    design.fg.push({
      x: x,
      y: y,
      w: w,
      h: h,
      fill: getAvgColor(
        inspiration.image,
        { min: x / SCALE, max: (x + w) / SCALE },
        { min: y / SCALE, max: (y + h) / SCALE }
      ),
    });
  }
  return design;
}

function getAvgColor(img, xRange, yRange) {
  img.loadPixels();

  let avgRed = 0;
  let avgGreen = 0;
  let avgBlue = 0;

  // Loop through the pixels X and Y
  for (let y = floor(yRange.min); y < floor(yRange.max); y++) {
    for (let x = floor(xRange.min); x < floor(xRange.max); x++) {
      // Calculate the pixel index
      const index = (y * img.width + x) * 4;

      // Sum the red, green, and blue values
      avgRed += img.pixels[index + 0];
      avgGreen += img.pixels[index + 1];
      avgBlue += img.pixels[index + 2];
    }
  }

  const numPixels = (yRange.max - yRange.min) * (xRange.max - xRange.min);

  avgRed /= numPixels;
  avgGreen /= numPixels;
  avgBlue /= numPixels;
  
  return {
    r: avgRed,
    g: avgGreen,
    b: avgBlue,
  };
}

function renderDesign(design, inspiration) {
  background(design.bg);
  noStroke();
  for (let box of design.fg) {
    fill(box.fill.r, box.fill.g, box.fill.b, 128);
    let shapeChoice =  floor(random(3));
    if (shapeChoice ==  0){
      rect(box.x, box.y, box.w, box.h);
    } else {
      ellipse(box.x, box.y, box.w / 2, box.h /2);
    } 
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);
  const SCALE = 200 / inspiration.image.width;

  for (let box of design.fg) {
    //get the average color from inpsiration image
    let avgColor = {
      r: box.fill.r,
      g: box.fill.g,
      b: box.fill.b
    };
    
    if(Math.floor(random(40) % 40) == 0){
      avgColor = getAvgColor (
        inspiration.image,
        { min: box.x / SCALE, max: (box.x + box.w)/ SCALE},
        { min: box.y / SCALE, max: (box.y + box.h) / SCALE}
      );
    }    
    
    let colorOffset = 10;
    let xyOffset = 7;
    
    box.fill.r = mut(box.fill.r, avgColor.r -  colorOffset, avgColor.r + colorOffset, rate);
    box.fill.g = mut(box.fill.g, avgColor.g - colorOffset, avgColor.g + colorOffset, rate);
    box.fill.b = mut(box.fill.b, avgColor.b - colorOffset, avgColor.b + colorOffset, rate);
    box.x = mut(box.x, box.x - xyOffset, box.x + xyOffset, rate);
    box.y = mut(box.y, box.y - xyOffset, box.y + xyOffset, rate);
    box.w = mut(box.w, box.w - xyOffset, box.w +xyOffset,  rate);
    box.h = mut(box.h, box.h - xyOffset, box.h + xyOffset, rate);
  }
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
