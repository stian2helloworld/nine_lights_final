let appState = "title";

let bgTitle;
let logoVid;

let btnX, btnY, btnW, btnH;
let instructionBg;
let instructionVid;

let topBtnX, topBtnY, topBtnW, topBtnH;

function preload() {
  // Title background
  bgTitle = loadImage("title_page/title.jpg");

  // Title video
  logoVid = createVideo("title_page/title_page-1.webm");
  logoVid.hide();
  logoVid.volume(0);
  logoVid.attribute("muted", "");   // ⭐ 必须加！！！

  // Instruction background
  instructionBg = loadImage("general_instruction/instruction_page.jpg");

  // Instruction video
  instructionVid = createVideo("general_instruction/general_instruction.webm");
  instructionVid.hide();
  instructionVid.volume(0);
  instructionVid.attribute("muted", "");  // ⭐ 必须加！！！
}

function setup() {
  createCanvas(1080, 900);

  logoVid.loop();        
  instructionVid.loop(); 

  // Bottom button
  btnW = 300;
  btnH = 120;
  btnX = width / 2 - btnW / 2;
  btnY = height - 160;

  // Left-top "back" button (for instruction page)
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
  image(bgTitle, 0, 0, width, height);  // 先画背景！！！

  image(
    logoVid,
    width / 2 - logoVid.width / 2,
    height / 2 - logoVid.height / 2
  );   // 再画视频
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
// ❤️❤️ Unified Mouse Pressed — ALL LOGIC HERE ❤️❤️
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

    // 1️⃣ 左上角按钮 → 回到 Title
    if (mouseX > topBtnX && mouseX < topBtnX + topBtnW &&
        mouseY > topBtnY && mouseY < topBtnY + topBtnH) {

      appState = "title";
      return;
    }

   // 2️⃣ 底部按钮 → 跳转 Ritual 01
if (
  mouseX > btnX && mouseX < btnX + btnW &&
  mouseY > btnY && mouseY < btnY + btnH
) {
  window.location.href = "/ritual_01/index.html";
  return;
}
  }
}
