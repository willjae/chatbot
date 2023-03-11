const loginIdValidator = new FieldValidator("txtLoginId", async function (val) {
  if (!val) {
    return "账号不能为空";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    return "账号已存在";
  }
});

const nickNameValidator = new FieldValidator("txtNickname", async function (
  val
) {
  if (!val) {
    return "昵称不能为空";
  }
});

const pwdValidator = new FieldValidator("txtLoginPwd", async function (val) {
  if (!val) {
    return "密码不能为空";
  }
});

const pwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async function (val) {
    if (!val) {
      return "密码不能为空";
    }
    if (val !== pwdValidator.input.value) {
      return "两次输入密码不一致";
    }
  }
);
const form = $(".user-form");
form.onsubmit = async function (e) {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nickNameValidator,
    pwdValidator,
    pwdConfirmValidator
  );
  if (!result) {
    return; //验证未通过
  }
  const userData = {
    loginId: loginIdValidator.input.value,
    nickname: nickNameValidator.input.value,
    loginPwd: pwdValidator.input.value,
  };
  const resp = await API.reg(userData);
  console.log(resp);
  if (resp.code === 0) {
    alert("注册成功，点击跳转");
    location.href = "./login.html";
  }
};
