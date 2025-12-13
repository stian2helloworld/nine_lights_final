// ===============================================
// FINAL PAGE – GitHub Pages Safe
// One looping video + UI overlay + 2 invisible buttons
// ===============================================
let finalVid;
let finalBtnImg;

let soundUpImg;
let soundUpVisible = true;

let resultBGM;
let clickSound;
let audioUnlocked = false;

let leftBtn  = { x: 60,  y: 720, w: 300, h: 160 };
let rightBtn = { x: 720, y: 720, w: 300, h: 160 };

function preload() {
  soundUpImg = loadImage("/nine_lights_final/final_result/ritual_final/sound_up.png");

  finalVid = createVideo("/nine_lights_final/final_result/ritual_final/final_reuslt_.webm");
  finalVid.hide();
  finalVid.volume(0);
  finalVid.attribute("muted", "");

  finalBtnImg = loadImage("/nine_lights_final/final_result/ritual_final/bg_final_button.png");

  resultBGM = loadSound("/nine_lights_final/final_result/audio_04/result_page_.mp3");
  clickSound = loadSound("/nine_lights_final/final_result/audio_04/clicking_sound.mp3");
}

function setup() {
  createCanvas(1080, 900);

  // ⭐ Autoplay-safe for GitHub Pages
  finalVid.elt.muted = true;  // required
  finalVid.loop();            // loop forever
}

function startResultBGM() {
  if (!audioUnlocked) {
    userStartAudio();          // ⭐ 解锁浏览器音频
    resultBGM.loop();          // ⭐ 自动播放
    resultBGM.setVolume(0.35);
    audioUnlocked = true;
  }
}

function draw() {
  image(finalVid, 0, 0, width, height);
  image(finalBtnImg, 0, 0);

  // ⭐ sound_up blinking（未解锁音频时）
  if (!audioUnlocked && soundUpVisible) {
    if (frameCount % 60 < 30) {   // 纯 blinking
      image(soundUpImg, 0, 0, width, height);
    }
  }
}

// --------------------------------------------------
// Invisible Buttons
// --------------------------------------------------
function mousePressed() {

  // ⭐ FIRST CLICK：解锁音频（不 return！）
  if (!audioUnlocked) {
    userStartAudio();
    resultBGM.loop();
    resultBGM.setVolume(0.35);
    audioUnlocked = true;
    soundUpVisible = false;
    // ❌ 不 return
  }

  // Left bottom → Title page
  if (
    mouseX > leftBtn.x && mouseX < leftBtn.x + leftBtn.w &&
    mouseY > leftBtn.y && mouseY < leftBtn.y + leftBtn.h
  ) {
    if (clickSound) clickSound.play();
    window.location.href = "/nine_lights_final/index.html";
    return;
  }

  // Right bottom → ✅ Final Result page
  if (
    mouseX > rightBtn.x && mouseX < rightBtn.x + rightBtn.w &&
    mouseY > rightBtn.y && mouseY < rightBtn.y + rightBtn.h
  ) {
    if (clickSound) clickSound.play();
    window.location.href = "/nine_lights_final/final_result/index.html";
    return;
  }
}
