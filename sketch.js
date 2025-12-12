let appState = "title";

let bgTitleVid;
let logoVid;

let btnX, btnY, btnW, btnH;
let instructionBg;
let instructionVid;

let topBtnX, topBtnY, topBtnW, topBtnH;

// ⭐ New — title page button image
let titleBtnImg;
let titleBtnW = 300;
let titleBtnH = 120;
let titleBtnX, titleBtnY;

function preload() {
  // Title background VIDEO
  bgTitleVid = createVideo("/nine_lights_final/title_page/welcome_page.webm");
  bgTitleVid.hide();
  bgTitleVid.volume(0);
  bgTitleVid.attribute("muted", "");

  // Title logo video
  logoVid = createVideo("/nine_lights_final/title_page/title_page-1.webm");
  logoVid.hide();
  logoVid.volume(0);
  logoVid.attribute("muted", "");

  // ⭐ Load new button image
  titleBtnImg = loadImage("/nine_lights_final/title_page/button_title_page.png");

  // Instruction background
  instructionBg = loadImage("/nine_lights_final/general_instruction/instruction_page.jpg");

  // Instruction video
  instructionVid = createVideo("/nine_lights_final/general_instruction/general_instruction.webm");
  instructionVid.hide();
  instructionVid.volume(0);
  instructionVid.attribute("muted", "");
}

function setup() {
  createCanvas(1080, 900);

  bgTitleVid.loop();
  logoVid.loop();
  instructionVid.loop();

  // Invisible bottom button size ONLY for instruction page
  btnW = 300;
  btnH = 120;
  btnX = width / 2 - btnW / 2;
  btnY = height - 160;

  // Back button
  topBtnW = 150;
  topBtnH = 150;
  topBtnX = 20;
  topBtnY = 20;

  // ⭐ Position title-page button (bottom center)
  titleBtnW = 300;
  titleBtnH = 120;
  titleBtnX = width / 2 - titleBtnW / 2;
  titleBtnY = height - 180;
}

function draw() {
  if (appState === "title") {
    drawTitlePage();
  } 
  else if (appState === "instruction") {
    drawInstructionPage();
  }
}

function drawTitlePage() {
  // Background video
  image(bgTitleVid, 0, 0, width, height);

  // Logo video
  image(
    logoVid,
    width / 2 - logoVid.width / 2,
    height / 2 - logoVid.height / 2
  );

  // ⭐ Draw the button image
  image(titleBtnImg, titleBtnX, titleBtnY, titleBtnW, titleBtnH);
}

function drawInstructionPage() {
  image(instructionBg, 0, 0, width, height);
  image(
    instructionVid,
    width / 2 - instructionVid.width / 2,
    height / 2 - instructionVid.height / 2
  );
}

// --------------------------------------------------
// Unified Mouse Pressed
// --------------------------------------------------
function mousePressed() {

  // ===== TITLE PAGE =====
  if (appState === "title") {

    // ⭐ Button image clickable area
    if (
      mouseX > titleBtnX && mouseX < titleBtnX + titleBtnW &&
      mouseY > titleBtnY && mouseY < titleBtnY + titleBtnH
    ) {
      appState = "instruction";
      return;
    }
  }

  // ===== INSTRUCTION PAGE =====
  else if (appState === "instruction") {

    // Top-left back button
    if (
      mouseX > topBtnX && mouseX < topBtnX + topBtnW &&
      mouseY > topBtnY && mouseY < topBtnY + topBtnH
    ) {
      appState = "title";
      return;
    }

    // Bottom button → Ritual 01
    if (
      mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH
    ) {
      window.location.href = "/nine_lights_final/ritual_01/index.html";
      return;
    }
  }
}
