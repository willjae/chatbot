(async function () {
  //验证是否登录
  const resp = await API.profile();
  const user = resp.data;
  if (!resp.data) {
    alert("未登录或登录已过期，请重新登录");
    location.href = "./login.html";
    return;
  }

  const doms = {
    aside: {
      nickname: $("#nickname"),
      loginId: $("#loginId"),
    },
    close: $(".close"),
    chatContainer: $(".chat-container"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  //在界面上显示用户信息
  doms.aside.nickname.innerText = user.nickname;
  doms.aside.loginId.innerText = user.loginId;

  // 加载历史记录
  async function loadHistory() {
    const resp = await API.history();
    for (const item of resp.data) {
      addMsg(item);
    }
    scrollBottom();
  }
  loadHistory();

  //发送消息
  async function sendMsg() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    addMsg({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await API.sendChat(content);
    addMsg({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  //绑定发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendMsg();
  };

  //添加消息至聊天页面
  /*
  content: "你几岁啦？"
  createdAt: 1651213093992
  from: "haha"
  to: null
  */
  function addMsg(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }
    const img = $$$("img");
    img.className = "chat-avatar";
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);
    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }

  //退出登录
  function loginOut() {
    API.loginOut();
    location.href = "./login.html";
  }
  doms.close.onclick = loginOut;

  //消息发送时间格式
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  // 让聊天区域的滚动条滚动到底
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
})();
