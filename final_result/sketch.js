// ===============================================
// FINAL PAGE – GitHub Pages Safe
// One looping video + UI overlay + 2 invisible buttons
// ===============================================

let finalVid;
let finalBtnImg;

// Invisible button areas (adjust if needed)
let leftBtn  = { x: 60,  y: 720, w: 300, h: 160 };   // → Title page
let rightBtn = { x: 720, y: 720, w: 300, h: 160 };  // → Ritual 01

function preload() {
  // Main looping video
  finalVid = createVideo("/nine_lights_final/final_result/ritual_final/final_reuslt_.webm");
  finalVid.hide();
  finalVid.volume(0);
  finalVid.attribute("muted", "");

  // UI overlay (full size 1080×900)
  finalBtnImg = loadImage("/nine_lights_final/final_result/ritual_final/bg_final_button.png");
}

function setup() {
  createCanvas(1080, 900);

  // ⭐ Autoplay-safe for GitHub Pages
  finalVid.elt.muted = true;  // required
  finalVid.loop();            // loop forever
}

function draw() {
  // Background video
  image(finalVid, 0, 0, width, height);

  // UI overlay on top
  image(finalBtnImg, 0, 0);
}

// --------------------------------------------------
// Invisible Buttons
// --------------------------------------------------
function mousePressed() {

  // Left bottom → Title page
  if (
    mouseX > leftBtn.x && mouseX < leftBtn.x + leftBtn.w &&
    mouseY > leftBtn.y && mouseY < leftBtn.y + leftBtn.h
  ) {
    window.location.href = "/nine_lights_final/index.html";
    return;
  }

  // Right bottom → Ritual 01
  if (
    mouseX > rightBtn.x && mouseX < rightBtn.x + rightBtn.w &&
    mouseY > rightBtn.y && mouseY < rightBtn.y + rightBtn.h
  ) {
    window.location.href = "/nine_lights_final/ritual_01/index.html";
    return;
  }
}
