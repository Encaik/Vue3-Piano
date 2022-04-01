import axios from "axios";

const config = {
  baseURL: "http://124.222.1.235:3000/piano",
  timeout: 10000,
};

const http = axios.create(config);

// 默认 post 请求，使用 application/json 形式
http.defaults.headers.post["Content-Type"] = "application/json";


//封装下post
http.post = function(url,data){
  return new Promise((resolve) => {
    axios({
      method: "post",
      url:config.baseURL + url,
      data,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then(response => {
      resolve(response);
    });
  });
};

http.interceptors.response.use(
  response => {
    return response.data;
  }
);

export default http;