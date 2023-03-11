/**
 * 表单项验证函数
 * @param {string} txtId
 *  @param {function} validatorFunc
 */
class FieldValidator {
  constructor(txtId, validatorFunc) {
    this.input = $("#" + txtId);
    this.p = $("#" + txtId).nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validator();
    };
  }
  async validator() {
    const errMsg = await this.validatorFunc(this.input.value);
    if (errMsg) {
      this.p.innerText = errMsg;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 对传入的验证器进行统一验证
   * @param {FieldValidator[]} validators
   */
  static async validate(...FieldValidators) {
    const proms = FieldValidators.map((item) => {
      return item.validator();
    });
    const results = await Promise.all(proms);
    return results.every((item) => item);
  }
}
