<template>
  <div id="App">
    <div class="container">
      <div class="title">ENCAIK PIANO</div>
      <div class="setting">
        <div class="setting-btn-group">
          <div
            class="setting-btn"
            @click="onNameTypeSet(0)"
          >键名</div>
          <div
            class="setting-btn"
            @click="onNameTypeSet(1)"
          >音名</div>
        </div>
      </div>
      <div class="keyboard">
        <div
          :class="key.keyType?'black-key':'white-key'"
          v-for="key in keyboard.slice(0,keyboard.length/2)"
          :key="key.pitchName"
          @click="playKey(key.pitchName)"
          :id="key.pitchName"
        >{{nameType?key.pitchName:key.keyName}}</div>
      </div>
      <div class="keyboard">
        <div
          :class="key.keyType?'black-key':'white-key'"
          v-for="key in keyboard.slice(keyboard.length/2)"
          :key="key.pitchName"
          @click="playKey(key.pitchName)"
          :id="key.pitchName"
        >{{nameType?key.pitchName:key.keyName}}</div>
      </div>
      <div class="text-input">
        <span>C4中央Do</span>
        <span>R四分休止符</span>
        <span>_（下划线）四分延音符</span>
        <span>-（减号）八分音符</span>
        <span>=（等号）十六分音符</span>
        <span>.（英文句号）附点音符</span>
      </div>
      <div class="music-input">
        <textarea
          rows="10"
          cols="200"
          v-model="musicStr"
        >
        </textarea>
      </div>
      <div class="setting">
        <div class="setting-btn-group">
          <div
            class="setting-btn"
            @click="resetInputArea()"
          >重置</div>
          <div
            class="setting-btn"
            @click="playInputArea()"
          >播放</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as Tone from 'tone';
//键盘渲染对象
let keyboard = [
  { keyName: "", pitchName: "A0", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Bb0", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "B0", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "C1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Db1", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "D1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Eb1", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "E1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "F1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Gb1", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "G1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Ab1", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "A1", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Bb1", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "B1", keyType: 0, keyMap: "" },
  { keyName: "Q", pitchName: "C2", keyType: 0, keyMap: "KeyQ" },
  { keyName: "2", pitchName: "Db2", keyType: 1, keyMap: "Digit2" },
  { keyName: "w", pitchName: "D2", keyType: 0, keyMap: "KeyW" },
  { keyName: "3", pitchName: "Eb2", keyType: 1, keyMap: "Digit3" },
  { keyName: "E", pitchName: "E2", keyType: 0, keyMap: "KeyE" },
  { keyName: "R", pitchName: "F2", keyType: 0, keyMap: "KeyR" },
  { keyName: "5", pitchName: "Gb2", keyType: 1, keyMap: "Digit5" },
  { keyName: "T", pitchName: "G2", keyType: 0, keyMap: "KeyT" },
  { keyName: "6", pitchName: "Ab2", keyType: 1, keyMap: "Digit6" },
  { keyName: "Y", pitchName: "A2", keyType: 0, keyMap: "KeyY" },
  { keyName: "7", pitchName: "Bb2", keyType: 1, keyMap: "Digit7" },
  { keyName: "U", pitchName: "B2", keyType: 0, keyMap: "KeyU" },
  { keyName: "I", pitchName: "C3", keyType: 0, keyMap: "KeyI" },
  { keyName: "9", pitchName: "Db3", keyType: 1, keyMap: "Digit9" },
  { keyName: "O", pitchName: "D3", keyType: 0, keyMap: "KeyO" },
  { keyName: "0", pitchName: "Eb3", keyType: 1, keyMap: "Digit0" },
  { keyName: "P", pitchName: "E3", keyType: 0, keyMap: "KeyP" },
  { keyName: "[", pitchName: "F3", keyType: 0, keyMap: "BracketLeft" },
  { keyName: "=", pitchName: "Gb3", keyType: 1, keyMap: "Equal" },
  { keyName: "]", pitchName: "G3", keyType: 0, keyMap: "BracketRight" },
  { keyName: "A", pitchName: "Ab3", keyType: 1, keyMap: "KeyA" },
  { keyName: "Z", pitchName: "A3", keyType: 0, keyMap: "KeyZ" },
  { keyName: "S", pitchName: "Bb3", keyType: 1, keyMap: "KeyS" },
  { keyName: "X", pitchName: "B3", keyType: 0, keyMap: "KeyX" },
  { keyName: "C", pitchName: "C4", keyType: 0, keyMap: "KeyC" },
  { keyName: "F", pitchName: "Db4", keyType: 1, keyMap: "KeyF" },
  { keyName: "V", pitchName: "D4", keyType: 0, keyMap: "KeyV" },
  { keyName: "G", pitchName: "Eb4", keyType: 1, keyMap: "KeyG" },
  { keyName: "B", pitchName: "E4", keyType: 0, keyMap: "KeyB" },
  { keyName: "N", pitchName: "F4", keyType: 0, keyMap: "KeyN" },
  { keyName: "J", pitchName: "Gb4", keyType: 1, keyMap: "KeyJ" },
  { keyName: "M", pitchName: "G4", keyType: 0, keyMap: "KeyM" },
  { keyName: "K", pitchName: "Ab4", keyType: 1, keyMap: "KeyK" },
  { keyName: ",", pitchName: "A4", keyType: 0, keyMap: "Comma" },
  { keyName: "L", pitchName: "Bb4", keyType: 1, keyMap: "KeyL" },
  { keyName: ".", pitchName: "B4", keyType: 0, keyMap: "Period" },
  { keyName: "/", pitchName: "C5", keyType: 0, keyMap: "Slash" },
  { keyName: "'", pitchName: "Db5", keyType: 1, keyMap: "Quote" },
  { keyName: "", pitchName: "D5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Eb5", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "E5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "F5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Gb5", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "G5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Ab5", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "A5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Bb5", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "B5", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "C6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Db6", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "D6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Eb6", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "E6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "F6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Gb6", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "G6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Ab6", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "A6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Bb6", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "B6", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "C7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Db7", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "D7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Eb7", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "E7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "F7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Gb7", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "G7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Ab7", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "A7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "Bb7", keyType: 1, keyMap: "" },
  { keyName: "", pitchName: "B7", keyType: 0, keyMap: "" },
  { keyName: "", pitchName: "C8", keyType: 0, keyMap: "" }
];
//歌谱字符串
/**
 * -八分音符
 * =十六分音符
 * -四份音符
 * .附点音符
 */


let musicStr = ref("C4-D4-E4-G4G4-R-E4-G4-E4-A4-G4-E4-G4.R-E4=G4=A4-A4-A4-A4-A4-G4-F4=G4=G4._E4B4-C5C5-C5-E4-R-E4-B4-B4C5-B4-G4.R-C4=G4=A4-A4-A4-A4-A4-G4-F4=G4=G4._");
function playMusic() {
  let noteDuration = 0.5;
  let music = [];//乐谱演奏对象
  let musicArr = musicStr.value.match(/[a-zA-Z]+[0-9]?(-|=)?\.?/g) || [];
  for (let item of musicArr) {
    console.log(item)
    let playTime = 0;
    let timeArr = item.match(/(-|=|\.)/g) || [];
    console.log(timeArr)
    if (timeArr.includes('-')) {
      playTime += noteDuration / 2
    } else if (timeArr.includes('=')) {
      playTime += noteDuration / 4
    } else if (timeArr.includes('_')) {
      playTime += noteDuration
    } else {
      playTime += noteDuration
    }
    if (timeArr.includes('.')) {
      playTime += playTime / 2
    }
    music.push({
      pitch: item.match(/[a-zA-Z]+[0-9]?/)[0],
      playTime,
    })
  }
  let now = Tone.now();
  music.forEach(i => {
    console.log(i);
    if (i.pitch !== "R") {
      sampler.triggerAttackRelease(i.pitch, "2n", now);
    }
    now += i.playTime;
  })
}
//采样器加载
const sampler = new Tone.Sampler({
  urls: {
    "A0": "A0.mp3",
    "C1": "C1.mp3",
    "A1": "A1.mp3",
    "C2": "C2.mp3",
    "A2": "A2.mp3",
    "C3": "C3.mp3",
    "A3": "A3.mp3",
    "C4": "C4.mp3",
    "C5": "C5.mp3",
    "A5": "A5.mp3",
    "C6": "C6.mp3",
    "A6": "A6.mp3",
    "C7": "C7.mp3",
  },
  release: 1,
  baseUrl: "/samples/piano/",
}).toDestination();
//采样器加载完成后演奏乐谱
Tone.loaded().then(() => {
  playMusic();
})
//单音演奏方法
function playKey(pitchName) {
  sampler.triggerAttackRelease(pitchName, "8n");
  let $el = document.getElementById(pitchName)
  $el.classList.add("key-active");
  setTimeout(() => {
    $el.classList.remove("key-active");
  }, 100)
}

function resetInputArea() {
  musicStr.value = "C4-D4-E4-G4G4-R-E4-G4-E4-A4-G4-E4-G4.R-E4=G4=A4-A4-A4-A4-A4-G4-F4=G4=G4._E4B4-C5C5-C5-E4-R-E4-B4-B4C5-B4-G4.R-C4=G4=A4-A4-A4-A4-A4-G4-F4=G4=G4._";
}

function playInputArea() {
  this.playMusic();
}

/* 设置 */
// 名称显示
let nameType = ref(1);

function onNameTypeSet(type) {
  nameType.value = type;
}


/*  键盘演奏逻辑 */
let pressKeys = new Map();
document.addEventListener("keydown", (event) => {
  //console.log(event);
  if (pressKeys.has(event.code)) return;
  pressKeys.set(event.code)
  let key = keyboard.filter(i => i.keyMap === event.code)?.[0];
  key ? playKey(key.pitchName) : null;
})
document.addEventListener("keyup", (event) => {
  pressKeys.delete(event.code)
})

/* 鼠标演奏逻辑 */
let isPlay = false;
document.addEventListener("mousedown", () => {
  isPlay = true;
})
document.addEventListener("mouseover", (event) => {
  if (isPlay && ['white-key', 'black-key'].includes(event.target.className)) {
    playKey(event.target.innerHTML);
  }
})
document.addEventListener("mouseup", () => {
  isPlay = false;
})

</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#App {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: cadetblue;
}
.container {
  padding: 25px;
}
.title {
  text-align: center;
  font-size: 40px;
  color: #2e2e2e;
  filter: drop-shadow(4px 4px 4px #2e2e2e);
  margin-bottom: 25px;
}
.setting {
  display: flex;
  justify-content: center;
  align-items: center;
  .setting-btn-group {
    display: flex;
    justify-content: center;
    align-items: center;
    .setting-btn {
      background-color: #4285f4;
      color: #fff;
      width: 120px;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      font-size: 0.9em;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #1f50a0;
      }
    }
  }
}
.keyboard {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 25px;
  @mixin key {
    border-radius: 0 0 5px 5px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    user-select: none;
    cursor: pointer;
    font-size: 8px;
    transition: all 0.2s ease-out;
    &:hover {
      background-color: #747474;
      box-shadow: 2px 2px 0px 0px #747474;
    }
  }
  .white-key {
    @include key;
    width: 50px;
    height: 200px;
    background-color: #fff;
    border: 2px solid gray;
    box-shadow: 2px 2px 0px 0px #fff;
  }
  .black-key {
    @include key;
    width: 32px;
    height: 125px;
    background-color: #000;
    border: 2px solid gray;
    margin: 0 -18px;
    z-index: 10;
    color: #fff;
    box-shadow: 2px 2px 0px 0px #000;
  }
  .key-active {
    background-color: #575757;
    box-shadow: 2px 2px 0px 0px #575757;
  }
}
.text-input {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 25px 0;
  color: #fff;
  font-size: 20px;
}
.music-input {
  display: flex;
  justify-content: center;
}
</style>
