// =====================================================
// Ritual 03 – Final Version (Web Serial + Images + Videos)
// =====================================================

// ---------- Sensor ----------
let port;                  
let reader;                
let readBuffer = "";       
let waterLevel = 0;
let waterTriggered = false;
let waterDetectedTime = 0;
const waterThreshold = 1023;   

// ---------- App States ----------
let appState = "r3_title";

// ---------- Images ----------
let r3TitleBg, r3InstrBg, r3ActionBg;
let pourWaterImg, waterDetectedImg;
let finalResultBg;

// ---------- Videos ----------
let r3TransBgVid, r3TransFrameVid;
let finalDeerVid;

// ---------- Buttons ----------
let bottomBtnX, bottomBtnY, bottomBtnW, bottomBtnH;
let connectBtn;

// Final page invisible buttons
let finalLeftBtnX, finalLeftBtnY, finalLeftBtnW, finalLeftBtnH;
let finalRightBtnX, finalRightBtnY, finalRightBtnW, finalRightBtnH;


// =====================================================
// Preload
// =====================================================
function preload() {
  r3TitleBg  = loadImage("/nine_lights_final/ritual_03/ritual03_images/ritual03_titlepage.jpg");

  // ⭐ NEW — blinking image for title
  r3TitleBlink = loadImage("/nine_lights_final/ritual_03/ritual03_images/ritual_water_03.png");

  r3InstrBg  = loadImage("/nine_lights_final/ritual_03/ritual03_images/ritual03_instructionpage.jpg");
  r3ActionBg = loadImage("/nine_lights_final/ritual_03/ritual03_images/ritual03_actionpage.jpg");

  pourWaterImg     = loadImage("/nine_lights_final/ritual_03/ritual03_images/pour_water.png");
  waterDetectedImg = loadImage("/nine_lights_final/ritual_03/ritual03_images/water_detected.png");

  finalResultBg = loadImage("/nine_lights_final/ritual_03/ritual03_images/result_final.jpg");
}


// =====================================================
// Setup
// =====================================================
function setup() {
  createCanvas(1080, 900);
  imageMode(CORNER);

  r3TransBgVid    = makeVid("/nine_lights_final/ritual_03/ritual03_images/cloud.webm");
  r3TransFrameVid = makeVid("/nine_lights_final/ritual_03/ritual03_images/transitional_page03.webm");
  finalDeerVid    = makeVid("/nine_lights_final/ritual_03/ritual03_images/result_deer_motion.webm");

  // Bottom invisible button
  bottomBtnW = 300;
  bottomBtnH = 120;
  bottomBtnX = width / 2 - bottomBtnW / 2;
  bottomBtnY = height - bottomBtnH - 40;

  // Connect button
  connectBtn = createButton("Connect ESP32");
  connectBtn.position(30, height - 90);
  connectBtn.style("font-size", "14px");
  connectBtn.style("padding", "6px 10px");
  connectBtn.style("background", "transparent");
  connectBtn.style("border", "1px solid white");
  connectBtn.style("color", "white");
  connectBtn.mousePressed(connectSerial);
  connectBtn.hide();

  // Final page invisible buttons
  finalLeftBtnW = 250;
  finalLeftBtnH = 120;
  finalLeftBtnX = 60;
  finalLeftBtnY = height - finalLeftBtnH - 40;

  finalRightBtnW = 250;
  finalRightBtnH = 120;
  finalRightBtnX = width - finalRightBtnW - 60;
  finalRightBtnY = height - finalRightBtnH - 40;

  setState("r3_title");
}


// =====================================================
// Helper
// =====================================================
function makeVid(path) {
  let v = createVideo(path);
  v.hide();
  v.volume(0);
  return v;
}

let transitionStartTime = 0;

function stopAllVideos() {
  r3TransBgVid.stop();
  r3TransFrameVid.stop();
  finalDeerVid.stop();
}

function setState(next) {
  stopAllVideos();
  appState = next;

  if (next === "r3_transition") {
    r3TransBgVid.loop();
    r3TransFrameVid.loop();
    transitionStartTime = millis();
  }
  else if (next === "r3_final") {
    finalDeerVid.loop();
  }
}


// =====================================================
// Serial
// =====================================================
async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    startReadLoop();
  } catch (err) {
    console.log("Serial connect cancelled:", err);
  }
}

async function startReadLoop() {
  const textDecoder = new TextDecoderStream();
  port.readable.pipeTo(textDecoder.writable);
  reader = textDecoder.readable.getReader();
  readBuffer = "";

  (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      readBuffer += value;
      let lines = readBuffer.split("\n");
      readBuffer = lines.pop();

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        let v = parseInt(line);
        if (!isNaN(v)) waterLevel = v;
      }
    }
  })();
}


// =====================================================
// Draw
// =====================================================
function draw() {
  clear();

  if (appState === "r3_title") drawTitle();
  else if (appState === "r3_instruction") drawInstruction();
  else if (appState === "r3_action") drawAction();
  else if (appState === "r3_transition") drawTransition();
  else if (appState === "r3_final") drawFinal();

  if (appState === "r3_action") connectBtn.show();
  else connectBtn.hide();
}


// =====================================================
// Pages
// =====================================================
// ===== Title Page Fade Animation =====
// ===== Title Page Fade Animation + Floating =====
let fadeT = 0;     // 控制透明度的时间
let floatT = 0;    // 控制上下浮动的时间

function drawTitle() {

  image(r3TitleBg, 0, 0, width, height);
// --- Title page floating animation ---
let floatY = 0;          // 当前位移
let floatTarget = -30;   // 先往上 30px
let floatSpeed = 0.02;   // 移动的平滑程度（0.01 = 很慢，0.05 = 较快）
let blinkAlpha = 255;    // 闪烁透明度
let blinkDir = -6;       // 闪烁方向（-6 → 变透明，+6 → 变不透明）

  // ===== 更新时间 =====
  fadeT += 0.02;   // 控制呼吸速度（越小越慢）
  floatT += 0.01;  // 控制上下漂浮速度

  // ===== 透明度动画（自然呼吸曲线） =====
  let alpha = map(sin(fadeT), -1, 1, 50, 255);
  // 最暗为 50，让图永远不完全消失 → 仙气更足

  // ===== 漂浮动画（上下 10px 范围） =====
  let floatOffset = sin(floatT) * -10; 
  // 你也可以改为 * 20 让漂浮幅度更大

  // ===== 绘制 r3TitleBlink（ritual_water_03.png） =====
  push();
  tint(255, alpha);                     // 套透明度
  image(r3TitleBlink, 0, floatOffset, width, height); 
  pop();
}

function drawInstruction() {
  image(r3InstrBg, 0, 0, width, height);
}

function drawAction() {
  image(r3ActionBg, 0, 0, width, height);

  fill(255);
  textSize(26);
  textAlign(LEFT, BOTTOM);
  text("Water Level: " + waterLevel, 30, height - 30);

  let detected = waterLevel >= waterThreshold;
  let icon = detected ? waterDetectedImg : pourWaterImg;

  let w = width * 0.3;
  let h = icon.height * (w / icon.width);
  let x = width / 2 - w / 2;
  let y = height - h - 40;

  if (frameCount % 60 < 30) image(icon, x, y, w, h);

  if (detected && !waterTriggered) {
    waterTriggered = true;
    waterDetectedTime = millis();
  }

  if (waterTriggered && millis() - waterDetectedTime > 6000) {
    setState("r3_transition");
  }
}

function drawTransition() {
  image(r3TransBgVid, 0, 0, width, height);
  image(r3TransFrameVid, 0, 0, width, height);

  if (millis() - transitionStartTime > 10000) {
    setState("r3_final");
  }
}

function drawFinal() {
  image(finalResultBg, 0, 0, width, height);
  image(finalDeerVid, 0, 0, width, height);
}


// =====================================================
// Mouse
// =====================================================
function mousePressed() {

  // Title → Instruction
  if (appState === "r3_title" && insideBottom()) {
    setState("r3_instruction");
  }

  // Instruction → Action
  else if (appState === "r3_instruction" && insideBottom()) {
    setState("r3_action");
  }

  // ⭐ FINAL PAGE BUTTONS ⭐
  else if (appState === "r3_final") {

    // 左下角 → 回到 instruction
   // 左下角 → 回到 starter page
if (
  mouseX > finalLeftBtnX && mouseX < finalLeftBtnX + finalLeftBtnW &&
  mouseY > finalLeftBtnY && mouseY < finalLeftBtnY + finalLeftBtnH
) {
  window.location.href = "/nine_lights_final/index.html";
  return;
}

// 右下角 → Ritual 01
if (
  mouseX > finalRightBtnX && mouseX < finalRightBtnX + finalRightBtnW &&
  mouseY > finalRightBtnY && mouseY < finalRightBtnY + finalRightBtnH
) {
  window.location.href = "/nine_lights_final/ritual_01/index.html";
  return;
    }
  }
}

function insideBottom() {
  return (
    mouseX > bottomBtnX &&
    mouseX < bottomBtnX + bottomBtnW &&
    mouseY > bottomBtnY &&
    mouseY < bottomBtnY + bottomBtnH
  );
}
