const API = (function () {
  const BASE_URL = "http://study.duyiedu.com";
  const TOKEN_KEY = "token";

  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers: headers });
  }

  function post(path, data) {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
  }
  //注册
  async function reg(userInfo) {
    const resp = await post("/api/user/reg", userInfo);
    return await resp.json();
  }

  //登录
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }
  //判断id是否已经存在
  async function exists(loginId) {
    const resp = await get("/api/user/exists?loginId=" + loginId);
    return resp.json();
  }
  //当前登录用户信息
  async function profile() {
    const resp = await get("/api/user/profile");
    return resp.json();
  }
  //发送消息
  async function sendChat(content) {
    const resp = await post("/api/chat", content);
    return await resp.json();
  }
  //获取聊天记录
  async function history() {
    const resp = await get("/api/chat/history");
    return resp.json();
  }
  //退出登录
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  //返回api对象
  return { reg, login, exists, profile, sendChat, history, loginOut };
})();
