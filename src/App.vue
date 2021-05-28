<template>
  <div id="App">
    <div class="container">
      <div class="title">ENCAIK POINA</div>
      <div class="keyboard">
        <div
          :class="key.type?'black-key':'white-key'"
          v-for="key in keyboardTop"
          :key="key.name"
          @click="playKey(key.name)"
        >{{key.name}}</div>
      </div>
      <div class="keyboard">
        <div
          :class="key.type?'black-key':'white-key'"
          v-for="key in keyboardBottom"
          :key="key.name"
          @click="playKey(key.name)"
        >{{key.name}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Tone from 'tone';
let keyboardTop = [
  { name: "A1", type: 0 },
  { name: "Bb1", type: 1 },
  { name: "B1", type: 0 },
  { name: "C2", type: 0 },
  { name: "Db2", type: 1 },
  { name: "D2", type: 0 },
  { name: "Eb2", type: 1 },
  { name: "E2", type: 0 },
  { name: "F2", type: 0 },
  { name: "Gb2", type: 1 },
  { name: "G2", type: 0 },
  { name: "Ab2", type: 1 },
  { name: "A2", type: 0 },
  { name: "Bb2", type: 1 },
  { name: "B2", type: 0 },
  { name: "C3", type: 0 },
  { name: "Db3", type: 1 },
  { name: "D3", type: 0 },
  { name: "Eb3", type: 1 },
  { name: "E3", type: 0 },
  { name: "F3", type: 0 },
  { name: "Gb3", type: 1 },
  { name: "G3", type: 0 },
  { name: "Ab3", type: 1 },
  { name: "A3", type: 0 },
  { name: "Bb3", type: 1 },
  { name: "B3", type: 0 },
  { name: "C4", type: 0 },
  { name: "Db4", type: 1 },
  { name: "D4", type: 0 },
  { name: "Eb4", type: 1 },
  { name: "E4", type: 0 },
  { name: "F4", type: 0 },
  { name: "Gb4", type: 1 },
  { name: "G4", type: 0 },
  { name: "Ab4", type: 1 },
  { name: "A4", type: 0 },
  { name: "Bb4", type: 1 },
  { name: "B4", type: 0 },
  { name: "C5", type: 0 },
  { name: "Db5", type: 1 },
  { name: "D5", type: 0 },
  { name: "Eb5", type: 1 },
  { name: "E5", type: 0 }
];
let keyboardBottom = [
  { name: "F5", type: 0 },
  { name: "Gb5", type: 1 },
  { name: "G5", type: 0 },
  { name: "Ab5", type: 1 },
  { name: "A5", type: 0 },
  { name: "Bb5", type: 1 },
  { name: "B5", type: 0 },
  { name: "C6", type: 0 },
  { name: "Db6", type: 1 },
  { name: "D6", type: 0 },
  { name: "Eb6", type: 1 },
  { name: "E6", type: 0 },
  { name: "F6", type: 0 },
  { name: "Gb6", type: 1 },
  { name: "G6", type: 0 },
  { name: "Ab6", type: 1 },
  { name: "A6", type: 0 },
  { name: "Bb6", type: 1 },
  { name: "B6", type: 0 },
  { name: "C7", type: 0 },
  { name: "Db7", type: 1 },
  { name: "D7", type: 0 },
  { name: "Eb7", type: 1 },
  { name: "E7", type: 0 },
  { name: "F7", type: 0 },
  { name: "Gb7", type: 1 },
  { name: "G7", type: 0 },
  { name: "Ab7", type: 1 },
  { name: "A7", type: 0 },
  { name: "Bb7", type: 1 },
  { name: "B7", type: 0 },
  { name: "C8", type: 0 },
  { name: "Db8", type: 1 },
  { name: "D8", type: 0 },
  { name: "Eb8", type: 1 },
  { name: "E8", type: 0 },
  { name: "F8", type: 0 },
  { name: "Gb8", type: 1 },
  { name: "G8", type: 0 },
  { name: "Ab8", type: 1 },
  { name: "A8", type: 0 },
  { name: "Bb8", type: 1 },
  { name: "B8", type: 0 },
  { name: "C9", type: 0 }
];
let music = [
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "Eb5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "Eb5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.25 },
  { pitch: "A4", pitchTime: 2, playTime: 0.75 },
  { pitch: "C4", pitchTime: 2, playTime: 0.25 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "A4", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.75 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "Ab4", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.75 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "Eb5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "Eb5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.25 },
  { pitch: "A4", pitchTime: 2, playTime: 0.75 },
  { pitch: "C4", pitchTime: 2, playTime: 0.25 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "A4", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.75 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 0.25 },
  { pitch: "A4", pitchTime: 2, playTime: 0.75 },
  { pitch: "B4", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.75 },
  { pitch: "G4", pitchTime: 2, playTime: 0.25 },
  { pitch: "F5", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.75 },
  { pitch: "F4", pitchTime: 2, playTime: 0.25 },
  { pitch: "E5", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.75 },
  { pitch: "E4", pitchTime: 2, playTime: 0.25 },
  { pitch: "D5", pitchTime: 2, playTime: 0.25 },
  { pitch: "C5", pitchTime: 2, playTime: 0.25 },
  { pitch: "B4", pitchTime: 2, playTime: 1 },
]

const sampler = new Tone.Sampler({
  urls: {
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
    "A7": "A7.mp3",
    "C8": "C8.mp3",
  },
  release: 1,
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();



Tone.loaded().then(() => {
  let now = Tone.now()
  music.forEach(i => {
    sampler.triggerAttackRelease(i.pitch, `${i.pitchTime}n`, now);
    now += i.playTime;
  })
})

function playKey(key) {
  sampler.triggerAttackRelease(key, "8n");
}
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
  }
  .white-key {
    @include key;
    width: 50px;
    height: 200px;
    background-color: #fff;
    border: 2px solid gray;
    box-shadow: 2px 2px 0px 0px #fff;
    &:hover {
      background-color: #d6d6d6;
      box-shadow: 2px 2px 0px 0px #d6d6d6;
    }
    &:active {
      background-color: rgb(177, 177, 177);
      box-shadow: 2px 2px 0px 0px rgb(177, 177, 177);
    }
    .white-key + .white-key {
      margin-right: -1px;
    }
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
    &:hover {
      background-color: #2e2e2e;
      box-shadow: 2px 2px 0px 0px #2e2e2e;
    }
    &:active {
      background-color: rgb(80, 80, 80);
      box-shadow: 2px 2px 0px 0px rgb(80, 80, 80);
    }
  }
}
</style>
