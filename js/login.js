const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
});

const pwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "密码不能为空";
  }
});

const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(loginIdValidator, pwdValidator);
  if (!result) {
    return; //验证未通过
  }
  const userData = {
    loginId: loginIdValidator.input.value,
    loginPwd: pwdValidator.input.value,
  };
  const resp = await API.login(userData);
  console.log(resp);
  if (resp.code === 0) {
    alert("登录成功，点击跳转");
    location.href = "./index.html";
  } else {
    alert("账号或密码有误");
    pwdValidator.input.value = "";
  }
};
