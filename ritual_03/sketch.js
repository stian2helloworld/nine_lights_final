// =====================================================
// Ritual 03 – Full Flow Version (Final Merged Version)
// title → instruction → action → transition → final
// Includes water gameplay, ESP32, and final animations
// =====================================================

// ---------- Sensor ----------
let port, reader, readBuffer = "";
let waterLevel = 0;
let waterTriggered = false;
let waterDetectedTime = 0;
const waterThreshold = 1023;

// ---------- App States ----------
let appState = "title";

// ---------- SOUND ----------
let waterBGM;
let transitionBGM;
let resultBGM;
let clickSound;

let audioUnlocked = false;

// ---------- Title Sound Prompt ----------
let soundDownImg;
let soundDownVisible = true;

// ---------- Assets ----------
let titleBg, instrBg, actionBg, finalBg;
let titleVid, instrVid, actionVid;
let transBgVid, transFrameVid;
let patternVid, deerVid;
let pourWaterImg, waterDetectedImg;

// Invisible bottom button height
const btnHeight = 200;

// Final page invisible buttons
let finalLeftBtn = { x: 60, y: 1600, w: 300, h: 200 };
let finalRightBtn = { x: 720, y: 1600, w: 300, h: 200 };

// Transition timer
let transStartTime = 0;

// Final page first-time flag
let finalStarted = false;

// ESP32 Connect button
let connectBtn;


// =====================================================
// Preload
// =====================================================
function preload() {
  // ----- SOUND -----
waterBGM = loadSound("/nine_lights_final/ritual_03/audio_03/water_sound.mp3");
transitionBGM = loadSound("/nine_lights_final/ritual_03/audio_03/transitional_sound.mp3");
resultBGM = loadSound("/nine_lights_final/ritual_03/audio_03/result_page_03.mp3");
clickSound = loadSound("/nine_lights_final/ritual_03/audio_03/clicking_sound.mp3");

  soundDownImg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/sound_down.png");

  // Title
  titleBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_titlepage.jpg");
  titleVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/ritual_water_03.webm", () => {
    titleVid.loop(); titleVid.volume(0); titleVid.hide();
  });

  // Instruction
  instrBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_instructionpage.jpg");
  instrVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/water_ritual03_instruction.webm", () => {
    instrVid.loop(); instrVid.volume(0); instrVid.hide();
  });

  // Action
  actionBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_actionpage_.jpg");
  actionVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/water_action.webm", () => {
    actionVid.loop(); actionVid.volume(0); actionVid.hide();
  });

  pourWaterImg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/pour_water.png");
  waterDetectedImg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/water_detected.png");

  // Transition
  transBgVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/cloud.webm", () => {
    transBgVid.volume(0); transBgVid.hide();
  });
  transFrameVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/transitional_page03.webm", () => {
    transFrameVid.volume(0); transFrameVid.hide();
  });

  // Final
  finalBg = loadImage("/nine_lights_final/ritual_03/ritual_03_images/ritual03_result.jpg");

  patternVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/pattern_ritual03.webm", () => {
    patternVid.volume(0); patternVid.hide();
  });
  deerVid = createVideo("/nine_lights_final/ritual_03/ritual_03_images/deer_motion03.webm", () => {
    deerVid.volume(0); deerVid.hide();
  });
}


// =====================================================
// Setup
// =====================================================
function setup() {
  createCanvas(1080, 900);

  // ESP32 Connect Button (small, bottom-left)
  connectBtn = createButton("Connect with esp 32");
  connectBtn.position(30, height - 100);
  connectBtn.style("font-size", "14px");
  connectBtn.style("padding", "6px 10px");
  connectBtn.style("background", "rgba(255,255,255,0.1)");
  connectBtn.style("border", "1px solid white");
  connectBtn.style("color", "white");
  connectBtn.style("border-radius", "6px");
  connectBtn.mousePressed(connectSerial);
  connectBtn.hide();
}

function startWaterBGM() {
  if (!audioUnlocked) {
    userStartAudio();           // 解锁浏览器音频
    waterBGM.loop();
    waterBGM.setVolume(0.4);
    audioUnlocked = true;
  }
}

// =====================================================
// Draw Loop
// =====================================================
function draw() {
  clear();

  if (appState === "title") {
    drawTitle();
    connectBtn.hide();
  }
  else if (appState === "instruction") {
    drawInstruction();
    connectBtn.hide();
  }
  else if (appState === "action") {
    drawAction();
    connectBtn.show();
  }
  else if (appState === "transition") {
    drawTransition();
    connectBtn.hide();
  }
  else if (appState === "final") {
    drawFinal();
    connectBtn.hide();
  }
}


// =====================================================
// Pages
// =====================================================
function drawTitle() {
  background(titleBg);
  image(titleVid, 0, 0, width, height);

  // 🔊 sound_down 提示（未解锁音频时显示）
  if (!audioUnlocked && soundDownVisible) {
    if (frameCount % 60 < 30) {   // 纯 blinking
      image(soundDownImg, 0, 0, width, height);
    }
  }
}

function drawInstruction() {
  background(instrBg);
  image(instrVid, 0, 0, width, height);
}

function drawAction() {
  background(actionBg);
  image(actionVid, 0, 0, width, height);

  // Water level UI
  fill(255);
  textSize(26);
  text("Water Level: " + waterLevel, 30, height - 30);

  let detected = waterLevel >= waterThreshold;
  let icon = detected ? waterDetectedImg : pourWaterImg;

  let w = width * 0.3;
  let h = icon.height * (w / icon.width);
  let x = width / 2 - w / 2;
  let y = height - h - 40;

  if (frameCount % 60 < 30) image(icon, x, y, w, h);

  // Detection logic
  if (detected && !waterTriggered) {
    waterTriggered = true;
    waterDetectedTime = millis();
  }

  if (waterTriggered && millis() - waterDetectedTime > 2000) {
  appState = "transition";
  transStartTime = millis();

  // 🔊 SOUND SWITCH
  waterBGM.stop();
  transitionBGM.loop();
  transitionBGM.setVolume(0.45);

  transBgVid.loop();
  transFrameVid.loop();

  actionVid.stop();
}
}

function drawTransition() {
  image(transBgVid, 0, 0, width, height);
  image(transFrameVid, 0, 0, width, height);

  if (millis() - transStartTime > 7000) {
    appState = "final";
  }
}


function drawFinal() {

  // Start videos ONLY when entering final (fixes disappearing bug)
  if (!finalStarted) {

  transitionBGM.stop();

  resultBGM.loop();
  resultBGM.setVolume(0.35);

  transBgVid.stop();
  transFrameVid.stop();

  patternVid.loop();
  deerVid.loop();

  finalStarted = true;
}

  image(finalBg, 0, 0, width, height);
  image(patternVid, 0, 0, width, height);
  image(deerVid, 0, 0, width, height);
}


// =====================================================
// Click Logic
// =====================================================
function mousePressed() {

  // ⭐ TITLE：第一次点击 sound_down → 只解锁音频，不做任何跳转
  if (appState === "title" && !audioUnlocked) {
    startWaterBGM();
    soundDownVisible = false;
    return; // ⛔ 关键：直接中断，防止命中底部按钮
  }

  // Bottom invisible button（只在音频已解锁后生效）
  if (mouseY > height - btnHeight) {

    clickSound.play();

    if (appState === "title") {
      appState = "instruction";
      return;
    }

    if (appState === "instruction") {
      appState = "action";
      return;
    }
  }

  // Final Page Buttons —— 在 result 状态下生效
if (appState === "result") {

  if (
    mouseX > finalLeftBtn.x && mouseX < finalLeftBtn.x + finalLeftBtn.w &&
    mouseY > finalLeftBtn.y && mouseY < finalLeftBtn.y + finalLeftBtn.h
  ) {
    clickSound.play();
    window.location.href = "/nine_lights_final/index.html";
    return;
  }

  if (
    mouseX > finalRightBtn.x && mouseX < finalRightBtn.x + finalRightBtn.w &&
    mouseY > finalRightBtn.y && mouseY < finalRightBtn.y + finalRightBtn.h
  ) {
    clickSound.play();
    window.location.href = "/nine_lights_final/final_result/index.html";
    return;
  }
}
}


// =====================================================
// SERIAL HANDLING
// =====================================================
async function connectSerial() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    startReadLoop();
  } catch (err) {
    console.log("Serial connect connected:", err);
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
