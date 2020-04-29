import axios from 'axios';
import qs from 'qs';

axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => Promise.reject(error));


axios.defaults.baseURL = 'http://127.0.0.1:7001/api/v1';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 5000; // 请求的超时时间
axios.defaults.headers['Content-type'] = 'application/json';
// 设置默认请求头，使post请求发送的是formdata格式数据// axios的header默认的Content-Type好像是'application/json;charset=UTF-8',我的项目都是用json格式传输，如果需要更改的话，可以用这种方式修改
// headers: {
// "Content-Type": "application/x-www-form-urlencoded"
// },
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 300; // default
};
axios.defaults.withCredentials = true; // 允许携带cookie
export default axios;
