let appState = "title";

let bgTitleVid;   // ⭐ 改成 video
let logoVid;

let btnX, btnY, btnW, btnH;
let instructionBg;
let instructionVid;

let topBtnX, topBtnY, topBtnW, topBtnH;

function preload() {
  // ⭐ Title background VIDEO
  bgTitleVid = createVideo("/nine_lights_final/title_page/welcome_page.webm");
  bgTitleVid.hide();
  bgTitleVid.volume(0);
  bgTitleVid.attribute("muted", "");

  // Title logo video
  logoVid = createVideo("/nine_lights_final/title_page/title_page-1.webm");
  logoVid.hide();
  logoVid.volume(0);
  logoVid.attribute("muted", "");

  // Instruction background image
  instructionBg = loadImage("/nine_lights_final/general_instruction/instruction_page.jpg");

  // Instruction video
  instructionVid = createVideo("/nine_lights_final/general_instruction/general_instruction.webm");
  instructionVid.hide();
  instructionVid.volume(0);
  instructionVid.attribute("muted", "");
}

function setup() {
  createCanvas(1080, 900);

  // ⭐ Loop title background video
  bgTitleVid.loop();

  logoVid.loop();
  instructionVid.loop();

  // Bottom button
  btnW = 300;
  btnH = 120;
  btnX = width / 2 - btnW / 2;
  btnY = height - 160;

  // Left-top "back" button
  topBtnW = 150;
  topBtnH = 150;
  topBtnX = 20;
  topBtnY = 20;
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
  // ⭐ 先放背景视频
  image(bgTitleVid, 0, 0, width, height);

  // 再放中间 logo 视频（如果需要）
  image(
    logoVid,
    width / 2 - logoVid.width / 2,
    height / 2 - logoVid.height / 2
  );
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
// ❤️ Unified Mouse Pressed — ALL LOGIC HERE ❤️
// --------------------------------------------------
function mousePressed() {

  // ===== TITLE PAGE =====
  if (appState === "title") {
    if (mouseX > btnX && mouseX < btnX + btnW &&
        mouseY > btnY && mouseY < btnY + btnH) {

      appState = "instruction";
      return;
    }
  }

  // ===== INSTRUCTION PAGE =====
  else if (appState === "instruction") {

    // Top-left back button
    if (mouseX > topBtnX && mouseX < topBtnX + topBtnW &&
        mouseY > topBtnY && mouseY < topBtnY + topBtnH) {

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
