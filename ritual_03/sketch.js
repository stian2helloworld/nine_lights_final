// =====================================================
// Ritual 03 – Full Version (Title/Instr Video + WebSerial + Transition + Result + Final)
// =====================================================

// ---------- Sensor ----------
let port;
let reader;
let readBuffer = "";
let waterLevel = 0;
let waterTriggered = false;
let waterDetectedTime = 0;
const waterThreshold = 1000;  

// ---------- App States ----------
let appState = "r3_title";
// r3_title → r3_instruction → r3_action → r3_transition → r3_result → r3_final

// ---------- Images ----------
let r3TitleBg, r3InstrBg, r3ActionBg;
let pourWaterImg, waterDetectedImg;
let r3ResultBg, finalResultBg;

// ---------- Videos ----------
let r3TitleVid, r3InstrVid;
let r3TransBgVid, r3TransFrameVid;
let r3PatternVid, r3DeerVid;
let finalDeerVid;

// ---------- Buttons ----------
let bottomBtnX, bottomBtnY, bottomBtnW, bottomBtnH;
let connectBtn;

// Final page invisible buttons
let finalLeftBtnX, finalLeftBtnY, finalLeftBtnW, finalLeftBtnH;
let finalRightBtnX, finalRightBtnY, finalRightBtnW, finalRightBtnH;

// Timers
let transitionStartTime = 0;
let resultStartTime = 0;


// =====================================================
// Preload
// =====================================================
function preload() {
  // 静态背景
  r3TitleBg  = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_titlepage.jpg");
  r3InstrBg  = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_instructionpage.jpg");
  r3ActionBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_actionpage.jpg");
  r3ResultBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_result.jpg"); // 可选
  finalResultBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/result_final.jpg");

  // Action 图标
  pourWaterImg     = loadImage("/nine_lights_final/ritual_03/ritual_03_images/pour_water.png");
  waterDetectedImg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/water_detected.png");
}


// =====================================================
// Setup
// =====================================================
function setup() {
  createCanvas(1080, 900);
  imageMode(CORNER);

  // ---------- Title / Instruction 视频 ----------
  r3TitleVid = makeVid("/nine_lights_final/ritual_03/ritual_03_images/ritual_water_03.webm");
  r3InstrVid = makeVid("/nine_lights_final/ritual_03/ritual_03_images/water_ritual03_instruction.webm");

  // ---------- Transition 视频 ----------
  r3TransBgVid    = makeVid("/nine_lights_final/ritual_03/ritual_03_images/cloud.webm");
  r3TransFrameVid = makeVid("/nine_lights_final/ritual_03/ritual_03_images/transitional_page03.webm");

  // ---------- Result 视频 ----------
  r3PatternVid = makeVid("/nine_lights_final/ritual_03/ritual_03_images/pattern_ritual03.webm");
  r3DeerVid    = makeVid("/nine_lights_final/ritual_03/ritual_03_images/deer_motion03.webm");

  // ---------- Final 视频 ----------
  // 如果你的文件名不叫这个，就自己改掉路径
  finalDeerVid = makeVid("/nine_lights_final/ritual_03/ritual_03_images/result_deer_motion.webm");

  // Bottom invisible button（Title / Instr 共用）
  bottomBtnW = 300;
  bottomBtnH = 120;
  bottomBtnX = width / 2 - bottomBtnW / 2;
  bottomBtnY = height - bottomBtnH - 40;

  // Connect 按钮（只在 action page 显示）
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
// Helper – create silent looping video
// =====================================================
function makeVid(path) {
  let v = createVideo(path);
  v.hide();
  v.volume(0);
  v.attribute("muted", "");    // ⭐ 为了 GitHub Pages / Chrome 自动播放
  v.loop();
  return v;
}

function stopAllVideos() {
  r3TitleVid.stop();
  r3InstrVid.stop();
  r3TransBgVid.stop();
  r3TransFrameVid.stop();
  r3PatternVid.stop();
  r3DeerVid.stop();
  finalDeerVid.stop();
}

function setState(next) {
  stopAllVideos();
  appState = next;

  if (next === "r3_title") {
    r3TitleVid.loop();
  }
  else if (next === "r3_instruction") {
    r3InstrVid.loop();
  }
  else if (next === "r3_transition") {
    r3TransBgVid.loop();
    r3TransFrameVid.loop();
    transitionStartTime = millis();
  }
  else if (next === "r3_result") {
    r3PatternVid.loop();
    r3DeerVid.loop();
    resultStartTime = millis();
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
        if (!isNaN(v)) {
          waterLevel = v;
          // console.log("Water Level:", waterLevel);
        }
      }
    }
  })();
}


// =====================================================
// Draw
// =====================================================
function draw() {
  clear();

  if (appState === "r3_title")        drawTitle();
  else if (appState === "r3_instruction") drawInstruction();
  else if (appState === "r3_action")      drawAction();
  else if (appState === "r3_transition")  drawTransition();
  else if (appState === "r3_result")      drawResult();
  else if (appState === "r3_final")       drawFinal();

  if (appState === "r3_action") connectBtn.show();
  else connectBtn.hide();
}


// =====================================================
// Pages
// =====================================================

// ---------- Title Page (背景 + 视频居中) ----------
function drawTitle() {
  image(r3TitleBg, 0, 0, width, height);

  image(
    r3TitleVid,
    width / 2 - r3TitleVid.width  / 2,
    height / 2 - r3TitleVid.height / 2
  );

  // 需要的话可以在这里加 debug rect 看 bottom 按钮位置
  // noFill(); stroke(255,0,0); rect(bottomBtnX, bottomBtnY, bottomBtnW, bottomBtnH);
}

// ---------- Instruction Page ----------
function drawInstruction() {
  image(r3InstrBg, 0, 0, width, height);

  image(
    r3InstrVid,
    width / 2 - r3InstrVid.width  / 2,
    height / 2 - r3InstrVid.height / 2
  );
}

// ---------- Action Page ----------
function drawAction() {
  image(r3ActionBg, 0, 0, width, height);

  // 左下角水位
  fill(255);
  textSize(26);
  textAlign(LEFT, BOTTOM);
  text("Water Level: " + waterLevel, 30, height - 30);

  // 图标逻辑
  let detected = waterLevel >= waterThreshold;
  let icon = detected ? waterDetectedImg : pourWaterImg;

  let w = width * 0.3;
  let h = icon.height * (w / icon.width);
  let x = width / 2 - w / 2;
  let y = height - h - 40;

  if (frameCount % 60 < 30) {
    image(icon, x, y, w, h);
  }

  // 达标 → 开始计时
  if (detected && !waterTriggered) {
    waterTriggered = true;
    waterDetectedTime = millis();
  }

  // 达标 6 秒 → 进入 Transition
  if (waterTriggered && millis() - waterDetectedTime > 6000) {
    setState("r3_transition");
  }
}

// ---------- Transition Page ----------
function drawTransition() {
  image(r3TransBgVid, 0, 0, width, height);
  image(r3TransFrameVid, 0, 0, width, height);

  // 10 秒后自动进入 result page
  if (millis() - transitionStartTime > 10000) {
    setState("r3_result");
  }
}

// ---------- Result Page (Pattern + Deer) ----------
function drawResult() {
  // 如果你想要淡淡的静态背景：
  if (r3ResultBg) {
    image(r3ResultBg, 0, 0, width, height);
  }

  // pattern + deer 动画
  image(r3PatternVid, 0, 0, width, height);
  image(r3DeerVid,    0, 0, width, height);

  // 停留 15 秒 → Final Result
  if (millis() - resultStartTime > 15000) {
    setState("r3_final");
  }
}

// ---------- Final Page ----------
function drawFinal() {
  image(finalResultBg, 0, 0, width, height);
  image(finalDeerVid, 0, 0, width, height);

  // debug final buttons 时可以画出来看看
  // noFill(); stroke(0,255,0); rect(finalLeftBtnX, finalLeftBtnY, finalLeftBtnW, finalLeftBtnH);
  // noFill(); stroke(255,0,0); rect(finalRightBtnX, finalRightBtnY, finalRightBtnW, finalRightBtnH);
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
    waterTriggered = false;
    setState("r3_action");
  }

  // Final page invisible buttons
  else if (appState === "r3_final") {

    // 左下角 → 回到 starter page（根目录 index.html）
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
