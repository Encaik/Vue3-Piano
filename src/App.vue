<template>
  <div id="App">
    <div class="container">
      <div class="piano-panel">
        <div class="title">ENCAIK PIANO</div>
        <div class="setting">
          <el-switch v-model="keyNameType" active-text="音名" inactive-text="键名" />
          <el-divider direction="vertical" />
          <span>乐器类型：</span>
          <el-select v-model="instrumentType" @change="onInstrumentTypeChange($event)">
            <el-option
              v-for="item in instrumentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="keyboard">
          <div
            :class="key.keyType ? 'black-key' : 'white-key'"
            v-for="key in keyboard"
            :key="key.pitchName"
            :id="key.pitchName"
            @mousedown="
              onNotePlay({ pitch: key.pitchName, playTime: noteDuration }, NotePlayType.mouse)
            "
          >
            {{ keyNameType ? key.pitchName : key.keyName }}
          </div>
        </div>
      </div>
      <el-card class="music-panel">
        <div class="option-bar">
          <div class="text-input">
            <span>C3中央Do</span>
            <span>C四分音符</span>
            <span>C/2八分音符</span>
            <span>C/4十六分音符</span>
            <span>C2二分音符</span>
            <span>C4全音符</span>
            <span>C'升八度</span>
            <span>C,降八度</span>
          </div>
          <div>
            <el-button type="primary" @click="onSubmitBtnClick()">提交</el-button>
            <el-button type="primary" @click="onResetBtnClick()">重置</el-button>
            <el-button type="primary" @click="onPlayBtnClick()">播放</el-button>
          </div>
        </div>
        <div class="music-input">
          <el-input
            v-model="txtMusic"
            :rows="6"
            type="textarea"
            placeholder="请输入乐谱"
          />
        </div>
      </el-card>
      <el-card class="score-panel">
        <div v-for="music in musicScoreList.data" :key="music.id">
          <el-button type="success" plain @click="onMusicScoreClick(music)">{{music.musicname}}</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="scoreSubmitVisible" title="提交曲谱">
      <el-form :model="form">
        <el-form-item label="歌曲名称">
          <el-input v-model="form.musicname" />
        </el-form-item>
        <el-form-item label="曲谱内容">
          <el-input
            v-model="form.musicscore"
            :rows="6"
            type="textarea"
            placeholder="请输入乐谱"
          />
        </el-form-item>
        <el-form-item label="歌曲作者">
          <el-input v-model="form.musicauthor" />
        </el-form-item>
        <el-form-item label="曲谱作者">
          <el-input v-model="form.scoreauthor" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmitScoreOk()">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,reactive,getCurrentInstance } from "vue";
import * as Tone from "tone";
import { ElMessage } from "element-plus";
import { parseMusic } from "music-score-transition";

let { proxy } = getCurrentInstance();

let sampler; // 采样器对象
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
  { keyName: "", pitchName: "C8", keyType: 0, keyMap: "" },
];

let instrumentUrlList = {
  "bass-electric": {
    E2: "E2.mp3",
    G2: "G2.mp3",
    E3: "E3.mp3",
    G3: "G3.mp3",
    E4: "E4.mp3",
    G4: "G4.mp3",
    E5: "E5.mp3",
    G5: "G5.mp3"
  },
  "bassoon": {
    A1: "A1.mp3",
    C2: "C2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
  },
  "cello": {
    A2: "A2.mp3",
    C2: "C2.mp3",
    A3: "A3.mp3",
    C3: "C3.mp3",
    A4: "A4.mp3",
    C4: "C4.mp3",
    A5: "A5.mp3",
    C5: "C5.mp3"
  },
  "clarinet": {
    D2: "D2.mp3",
    F2: "F2.mp3",
    D3: "D3.mp3",
    F3: "F3.mp3",
    D4: "D4.mp3",
    F4: "F4.mp3",
    D5: "D5.mp3",
  },
  "contrabass": {
    A1: "A1.mp3",
    E2: "E2.mp3",
  },
  "flute": {
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3"
  },
  "french-horn": {
    A0: "A0.mp3",
    F4: "F4.mp3",
  },
  "guitar-acoustic": {
    A1: "A1.mp3",
    B1: "B1.mp3",
    C2: "C2.mp3",
    A2: "A2.mp3",
    B2: "B2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    B3: "B3.mp3",
    C4: "C4.mp3"
  },
  "guitar-electric": {
    A2: "A2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    C5: "C5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
  },
  "guitar-nylon": {
    E2: "E2.mp3",
    A2: "A2.mp3",
    E3: "E3.mp3",
    A3: "A3.mp3",
    E4: "E4.mp3",
    A4: "A4.mp3",
    E5: "E5.mp3",
    A5: "A5.mp3",
  },
  "harmonium": {
    C2: "C2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    C5: "C5.mp3",
  },
  harp: {
    G1: "G1.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    G3: "G3.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
    G5: "G5.mp3",
    A6: "A6.mp3",
  },
  organ: {
    C1: "C1.mp3",
    A1: "A1.mp3",
    C2: "C2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    C5: "C5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
  },
  piano: {
    A0: "A0.mp3",
    C1: "C1.mp3",
    A1: "A1.mp3",
    C2: "C2.mp3",
    A2: "A2.mp3",
    C3: "C3.mp3",
    A3: "A3.mp3",
    C4: "C4.mp3",
    C5: "C5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
    A6: "A6.mp3",
    C7: "C7.mp3"
  },
  saxophone: {
    C3: "C3.mp3",
    A4: "A4.mp3",
    C4: "C4.mp3",
    A5: "A5.mp3",
  },
  trombone: {
    C2: "C2.mp3",
    F3: "F3.mp3",
  },
  trumpet: {
    A2: "A2.mp3",
    C3: "C3.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
  },
  tuba: {
    D2: "D2.mp3",
    D3: "D3.mp3",
  },
  violin: {
    A3: "A3.mp3",
    C4: "C4.mp3",
    A4: "A4.mp3",
    C5: "C5.mp3",
    A5: "A5.mp3",
    C6: "C6.mp3",
    A6: "A6.mp3",
    C7: "C7.mp3",
  },
  xylophone: {
    C4: "C4.mp3",
    C5: "C5.mp3",
    C6: "C6.mp3",
    C7: "C7.mp3",
  },
};

//歌谱字符串
/**
 * -八分音符
 * =十六分音符
 * -四份音符
 * .附点音符
 */
let txtMusic = ref("");
let musicScoreList = reactive({data:[]});

/**
 * 点击歌曲按钮加载曲谱
 */
function onMusicScoreClick(music) {
  txtMusic.value = music.musicscore;
}

let noteDuration = 0.25; // 单个音符时长

const NotePlayType = {
  auto: 1,
  mouse: 2,
  keyboard: 3,
};

/**
 * 初始化
 */
function init() {
  getMusicList();
  sampler = sampleInit(instrumentType.value);
  onMouseListener();
  onKeyboardListener();
}

/**
 * 歌曲列表
 */
function getMusicList() {
  proxy.$http.get("").then(res=>{
    musicScoreList.data=res;
  });
}

/**
 * 采样器初始化
 */
function sampleInit(instrumentType) {
  const sampler = new Tone.Sampler({
    urls: instrumentUrlList[instrumentType],
    release: 1,
    baseUrl: `./samples/${instrumentType}/`,
  }).toDestination();
    //采样器加载完成后演奏乐谱
  Tone.loaded().then(() => {
    ElMessage({
      message: "资源加载完成",
      type: "success",
    });
  });
  return sampler;
}

/**
 * 提交曲谱到服务器
 */

let scoreSubmitVisible = ref(false);
const form = reactive({
  musicname:"",
  musicscore:"",
  musicauthor:"",
  scoreauthor:""
});

function onSubmitBtnClick() {
  form.musicscore = txtMusic.value;
  scoreSubmitVisible.value = true;
}

function onSubmitScoreOk() {
  proxy.$http.post("add",form).then(()=>{
    getMusicList();
    scoreSubmitVisible.value = false;
    form.musicname = "";
    form.musicscore = "";
    form.musicauthor = "";
    form.scoreauthor = "";
  });
}

/**
 * 播放曲谱
 */
function onPlayBtnClick() {
  onTxtMusicPlay();
}

/**
 * 重置文本曲谱
 */
function onResetBtnClick() {
  txtMusic.value = "";
}

/**
 * 单音演奏
 */
function onNotePlay(note, notePlayType) {
  switch (notePlayType) {
  case NotePlayType.auto:
    onNotePlayByAuto(note);
    break;
  case NotePlayType.mouse:
    onNotePlayByMouse(note);
    break;
  case NotePlayType.keyboard:
    onNotePlayByKeyboard(note);
    break;
  }
}

/**
 * 自动触发单音演奏
 */
function onNotePlayByAuto(note) {
  sampler.triggerAttackRelease(
    note.pitch,
    `${(note.playTime / noteDuration) * 2}n`,
    note.contextTime
  );
  let $el = document.getElementById(note.pitch);
  setTimeout(() => {
    $el.classList.add("key-active");
    setTimeout(() => {
      $el.classList.remove("key-active");
    }, 100);
  }, note.realTime * 1000);
}

/**
 * 鼠标触发单音演奏
 */
function onNotePlayByMouse(note) {
  sampler.triggerAttackRelease(note.pitch, `${(note.playTime / noteDuration) * 2}n`);
  let $el = document.getElementById(note.pitch);
  $el.classList.add("key-active");
  $el.addEventListener("mouseup", removeKeyActiveClass);
  $el.addEventListener("mouseleave", removeKeyActiveClass);
  function removeKeyActiveClass() {
    $el.classList.remove("key-active");
    $el.removeEventListener("mouseup", removeKeyActiveClass);
    $el.removeEventListener("mouseleave", removeKeyActiveClass);
  }
}

/**
 * 键盘触发单音演奏
 */
function onNotePlayByKeyboard(note) {
  sampler.triggerAttackRelease(note.pitch, `${(note.playTime / noteDuration) * 2}n`);
  let $el = document.getElementById(note.pitch);
  $el.classList.add("key-active");
}

/**
 * 鼠标滑动演奏监听
 */
function onMouseListener() {
  let isMouseDown = false;
  document.addEventListener("mousedown", () => {
    isMouseDown = true;
  });
  document.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
  document.addEventListener("mouseover", (e) => {
    if (isMouseDown && ["white-key", "black-key"].includes(e.target.className)) {
      onNotePlay({ pitch: e.target.innerText, playTime: noteDuration }, NotePlayType.mouse);
    }
  });
}

/**
 * 键盘演奏监听
 */
function onKeyboardListener() {
  let pressKeys = new Map();
  document.addEventListener("keydown", (event) => {
    if (pressKeys.has(event.code)) return;
    pressKeys.set(event.code);
    const key = keyboard.filter((i) => i.keyMap === event.code)?.[0];
    if (key) {
      onNotePlay({ pitch: key.pitchName, playTime: noteDuration }, NotePlayType.keyboard);
    }
  });
  document.addEventListener("keyup", (event) => {
    pressKeys.delete(event.code);
    const key = keyboard.filter((i) => i.keyMap === event.code)?.[0];
    if (key) {
      document.getElementById(key.pitchName).classList.remove("key-active");
    }
  });
}

/**
 * 文本乐谱演奏
 */
function onTxtMusicPlay() {
  let noteList = parseMusic(txtMusic.value); // 音符列表
  let contextTime = Tone.immediate(); // 音符演奏时机（上下文）
  let realTime = 0; // 音符实际时间
  noteList.forEach((note) => {
    if (note.pitch !== "R") {
      onNotePlay(
        {
          ...note,
          contextTime,
          realTime,
        },
        NotePlayType.auto
      );
    }
    contextTime += note.playTime;
    realTime += note.playTime;
  });
}

//----------键名显示内容逻辑----------

let keyNameType = ref(true);

//----------乐器类型切换逻辑----------

let instrumentType = ref("piano");
let instrumentOptions = [
  {
    value: "bass-electric",
    label: "电贝司",
  },
  {
    value: "bassoon",
    label: "巴松",
  },
  {
    value: "cello",
    label: "大提琴",
  },
  {
    value: "clarinet",
    label: "单簧管",
  },
  {
    value: "contrabass",
    label: "倍低音",
  },
  {
    value: "flute",
    label: "长笛",
  },
  {
    value: "french-horn",
    label: "法国号",
  },
  {
    value: "guitar-acoustic",
    label: "民谣吉他",
  },
  {
    value: "guitar-electric",
    label: "电吉他",
  },
  {
    value: "guitar-nylon",
    label: "古典吉他",
  },
  {
    value: "harmonium",
    label: "小风琴",
  },
  {
    value: "harp",
    label: "竖琴",
  },
  {
    value: "organ",
    label: "管风琴",
  },
  {
    value: "piano",
    label: "钢琴",
  },
  {
    value: "saxophone",
    label: "萨克斯",
  },
  {
    value: "trombone",
    label: "长号",
  },
  {
    value: "trumpet",
    label: "小号",
  },
  {
    value: "tuba",
    label: "大号",
  },
  {
    value: "violin",
    label: "小提琴",
  },
  {
    value: "xylophone",
    label: "木琴",
  }
];

/**
 * 乐器类型切换
 */
function onInstrumentTypeChange(instrumentType) {
  sampler = sampleInit(instrumentType);
}

init();
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
#App {
  width: 100%;
  min-height: 100vh;
  background: #4eb5ff;
}
.container {
  padding: 25px;
  .piano-panel {
    border-radius: 15px;
    background: #222222;
    box-shadow: inset 0px 0px 9px 7px #8f8f8f;
    .title {
      font-size: 30px;
      color: #d1d0d0;
      padding: 20px 25px;
    }
    .setting {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      .el-switch__label:not(.is-active) {
        color: #fff;
      }
    }
  }
  .music-panel {
    margin-top: 30px;
    .option-bar {
      display: flex;
      justify-content: space-between;
      .text-input {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;
        font-size: 20px;
      }
    }
    .music-input {
      display: flex;
      justify-content: center;
    }
  }
  .score-panel{
    margin-top: 30px;
    .el-card__body{
      display: flex;
      gap:8px;
    }
  }
}
.keyboard {
  display: flex;
  justify-content: center;
  padding: 25px;
  @mixin key {
    border-radius: 0 0 5px 5px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    user-select: none;
    cursor: pointer;
    font-size: 10px;
  }
  .white-key {
    @include key;
    flex: 1 1;
    height: 200px;
    background: #fff;
    box-shadow: inset 0px 0px 0px 1px #979797;
    &.key-active {
      background: linear-gradient(0deg, #6c6c6c, #fff);
    }
    &:hover {
      background: #b7b7b7;
    }
  }
  .black-key {
    @include key;
    flex: 1 1;
    height: 125px;
    background: #000;
    margin: 0 -18px;
    z-index: 10;
    color: #fff;
    box-shadow: inset 0px 0px 0px 1px #979797;
    &.key-active {
      background: linear-gradient(0deg, #6c6c6c, #000);
    }
    &:hover {
      background: #666;
    }
  }
}
</style>
