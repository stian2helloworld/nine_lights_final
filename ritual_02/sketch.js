// =======================================================
// Ritual 02 – Ring the Bell of Awakening (ml5.js + FFT)
// =======================================================

// ===== Global Variables =====
let mic, fft;

// State Machine
let appState = "r2_title";
// Pages: "r2_title", "r2_instruction", "r2_action", "r2_transition", "r2_result"

// ===== Image & Video Assets =====

// Title Page
let r2TitleBg;
let r2TitleVid;

// Instruction Page
let r2InstrBg;
let r2InstrVid;

// Action Page
let r2ActionBg;
let r2ActionVid;
let ringBellImg;       // 未触发时的提示
let bellDetectedImg;   // 已触发时的提示

// Transitional Page
let r2TransBgVid;
let r2TransFrameVid;

// Result Page
let r2ResultBg;
let r2PatternVid;
let r2DeerVid;

// ===== Sound Detection Vars =====
let stableFrames = 0;
let detectCount = 0;
let bellTriggered = false;
let bellDetectedAt = 0;
let prevHigh = 0;

// ===== Buttons =====
let bottomBtnX, bottomBtnY, bottomBtnW, bottomBtnH;
let resultHomeBtnX, resultHomeBtnY, resultHomeBtnW, resultHomeBtnH;
let resultNextBtnX, resultNextBtnY, resultNextBtnW, resultNextBtnH;

// ===== Transitional Timer =====
let transitionStartTime = 0;


// =======================================================
// Preload
// =======================================================
function preload() {

  // Title
  r2TitleBg = loadImage("/nine_lights_final/ritual_02/ritual02_images/ritual02_bgpage.jpg");

  // Instruction
  r2InstrBg = loadImage("/nine_lights_final/ritual_02/ritual02_images/ritual02_intro.jpg");

  // Action
  r2ActionBg = loadImage("/nine_lights_final/ritual_02/ritual02_images/ritual02_action.jpg");
  r2RingBellImg = loadImage("/nine_lights_final/ritual_02/ritual02_images/ring_bell.png");
  r2SoundDetectedImg = loadImage("/nine_lights_final/ritual_02/ritual02_images/bell_detected.png");

  // Result
  r2ResultBg = loadImage("/nine_lights_final/ritual_02/ritual02_images/ritual02_result.jpg");
}



// =======================================================
// Setup
// =======================================================
function setup() {
  createCanvas(1080, 900);

  // ----- AUDIO -----
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  // ----- VIDEO ELEMENTS -----
  r2TitleVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/bell_motion.webm");
  r2TitleVid.hide();
  r2TitleVid.loop();

  r2InstrVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/bell_instruction.webm");
  r2InstrVid.hide();
  r2InstrVid.loop();

  r2ActionVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/ritual_sound_activation.webm");
  r2ActionVid.hide();
  r2ActionVid.loop();

  r2TransBgVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/cloud.webm");
  r2TransBgVid.hide();
  r2TransBgVid.loop();

  r2TransFrameVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/transitional_page02.webm");
  r2TransFrameVid.hide();
  r2TransFrameVid.loop();

  r2PatternVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/pattern_ritual02.webm");
  r2PatternVid.hide();
  r2PatternVid.loop();
  r2PatternVid.speed(0.5); // 慢一点更梦幻

  r2DeerVid = createVideo("/nine_lights_final/ritual_02/ritual02_images/deer_motion02.webm");
  r2DeerVid.hide();
  r2DeerVid.loop();


  // ===== BUTTONS =====
  bottomBtnW = 300;
  bottomBtnH = 120;
  bottomBtnX = width / 2 - bottomBtnW / 2;
  bottomBtnY = height - 160;

  resultHomeBtnW = 200;
  resultHomeBtnH = 120;
  resultHomeBtnX = 60;
  resultHomeBtnY = height - resultHomeBtnH - 40;

  resultNextBtnW = 200;
  resultNextBtnH = 120;
  resultNextBtnX = width - resultNextBtnW - 60;
  resultNextBtnY = height - resultNextBtnH - 40;
}



// =======================================================
// Draw Loop
// =======================================================
function draw() {
  if (appState === "r2_title")        drawR2Title();
  else if (appState === "r2_instruction") drawR2Instruction();
  else if (appState === "r2_action")      drawR2Action();
  else if (appState === "r2_transition")  drawR2Transition();
  else if (appState === "r2_result")      drawR2Result();
}



// =======================================================
// PAGE 1 — TITLE
// =======================================================
function drawR2Title() {
  image(r2TitleBg, 0, 0, width, height);

  // center video
  image(r2TitleVid, width/2 - r2TitleVid.width/2, height/2 - r2TitleVid.height/2);
}



// =======================================================
// PAGE 2 — INSTRUCTION
// =======================================================
function drawR2Instruction() {
  image(r2InstrBg, 0, 0, width, height);

  image(
    r2InstrVid,
    width/2 - r2InstrVid.width/2,
    height/2 - r2InstrVid.height/2
  );
}



// =======================================================
// PAGE 3 — ACTION (MIC INPUT + FFT)
// =======================================================
// =======================================================
// PAGE 3 — ACTION (MIC INPUT + FFT + HIGH-FREQ BAR)
// =======================================================
function drawR2Action() {
  image(r2ActionBg, 0, 0, width, height);
  image(r2ActionVid, 0, 0, width, height);

// ===== FFT 声音分析 =====
let spectrum = fft.analyze();

// 聚焦高频
let highFreqEnergy = fft.getEnergy(2000, 8000);

// ===== 检测铃声音 =====
let bellNow = highFreqEnergy > 95;

// ===== 稳定帧计数 =====
if (bellNow) {
  stableFrames++;
} else {
  stableFrames = 0;
}

// ===== 一次有效敲击 =====
if (stableFrames >= 15) {
  detectCount++;
  stableFrames = 0;
  console.log("🔔 valid ring:", detectCount);
}

// ===== UI：提示图片（闪烁）=====
let statusImg = bellNow ? r2SoundDetectedImg : r2RingBellImg;

let w = width * 0.30;
let h = statusImg.height * (w / statusImg.width);
let x = width / 2 - w / 2;
let y = height - h - 40;

if (frameCount % 60 < 30) {
  image(statusImg, x, y, w, h);
}

// ===== 仪式完成：累计 7 次有效敲击 =====
if (detectCount >= 7 && !bellTriggered) {
  bellTriggered = true;
  transitionStartTime = millis();
  appState = "r2_transition";
  return;
}

// ===== Debug UI =====
fill(255);
textSize(18);
textAlign(LEFT, BOTTOM);

// 数字展示
text("Frequency: " + nf(highFreqEnergy, 1, 1), 40, height - 90);
text("Amount: " + nf(highFreqEnergy, 1, 1), 40, height - 65);

// 蓝色能量条
fill(100, 200, 255);
noStroke();
let barWidth = map(highFreqEnergy, 0, 255, 0, 180);
rect(40, height - 50, barWidth, 10);
  
// =======================================================
// PAGE 4 — TRANSITION
// =======================================================
// ====== Page: Transitional ======
function drawR2Transition() {
  // 背景 cloud 视频
  image(r2TransBgVid, 0, 0, width, height);

  // overlay transitional_page02 视频
  image(r2TransFrameVid, 0, 0, width, height);

  // 自动 30 秒后跳 result
  if (millis() - transitionStartTime > 6000) { 
    appState = "r2_result";
  }
}


// =======================================================
// PAGE 5 — RESULT
// =======================================================
function drawR2Result() {
  image(r2ResultBg, 0, 0, width, height);

  image(r2PatternVid, 0, 0);
  image(r2DeerVid, 0, 0);

  // Debug buttons（测试用）
  // fill(0,255,0,80); rect(resultHomeBtnX, resultHomeBtnY, resultHomeBtnW, resultHomeBtnH);
  // fill(255,0,0,80); rect(resultNextBtnX, resultNextBtnY, resultNextBtnW, resultNextBtnH);
}



// =======================================================
// Mouse Interaction
// =======================================================
function mousePressed() {

  // --- TITLE → INSTRUCTION ---
  if (appState === "r2_title") {
    if (
      mouseX > bottomBtnX && mouseX < bottomBtnX + bottomBtnW &&
      mouseY > bottomBtnY && mouseY < bottomBtnY + bottomBtnH
    ) {
      appState = "r2_instruction";
      return;
    }
  }


  // --- INSTRUCTION → ACTION ---
  else if (appState === "r2_instruction") {
    if (
      mouseX > bottomBtnX && mouseX < bottomBtnX + bottomBtnW &&
      mouseY > bottomBtnY && mouseY < bottomBtnY + bottomBtnH
    ) {
      detectCount = 0;
      bellTriggered = false;
      appState = "r2_action";
      return;
    }
  }


// --- RESULT: left button → back to starter title page ---
if (
  mouseX > resultHomeBtnX && mouseX < resultHomeBtnX + resultHomeBtnW &&
  mouseY > resultHomeBtnY && mouseY < resultHomeBtnY + resultHomeBtnH
) {
  window.location.href = "/nine_lights_final/index.html";
  return;
}

// --- RESULT: right button → go to Ritual 03 ---
if (
  mouseX > resultNextBtnX && mouseX < resultNextBtnX + resultNextBtnW &&
  mouseY > resultNextBtnY && mouseY < resultNextBtnY + resultNextBtnH
) {
  window.location.href = "/nine_lights_final/ritual_03/index.html";
  return;
}
}
