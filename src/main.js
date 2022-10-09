import { createApp } from "vue";
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import http from "./util/http";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$http = http;
app.use(ElementPlus).mount("#app");
