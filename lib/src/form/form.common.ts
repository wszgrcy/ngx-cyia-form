import { Validators } from "@angular/forms";
import { TypeJudgment, jsNativeType } from "cyia-ngx-common";
import { ValidatorType } from "./form.define";

/**
 *
 *
 * @export
 * @param {string} validatorName 验证器名字
 * @param {...any[]} params value的参数
 * @returns
 */
export function getValidatorsType(validatorName: string, ...params: any[]): ValidatorType {
    //doc 内置的
    if (Object.prototype.hasOwnProperty.call(Validators, validatorName)) {
        if (params.length == 1) {
            //doc 内置且不传参数类型
            if (TypeJudgment.getType(params[0]) == jsNativeType.bool) {
                return ValidatorType.BuiltInWithoutParam
            } else {
                return ValidatorType.BuiltInWithParam
            }
        }
    }
    //doc 自定义的
    else {
        if (!params.length) {
            return ValidatorType.CustomWithoutParam;
        } else {
            return ValidatorType.CustomWithParam;
        }
    }
    return ValidatorType.Unknown;
}
