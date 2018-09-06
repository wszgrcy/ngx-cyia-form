import { TypeJudgment, jsNativeType } from 'cyia-ngx-common';
import { Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators, FormArray, FormGroup } from '@angular/forms';
import { CustomValidator, ValidatorType, validatorConfig, formPropertyType, FormPropertyValueObj, validatorItem } from './form.define';
import { getValidatorsType } from './form.common';

@Injectable()
export class CyiaFormService {
    /**验证数组(包括自定义和内置两个) */
    private validatorConfigList: validatorConfig[] = [];
    /**自定义验证器函数的数组 */
    private customValidatorFunctionList: CustomValidator[] = []
    //!考虑一个对象,这对象中有数组/值/对象
    constructor(
        public fb: FormBuilder,
    ) { }


    /**
     *传入对象类型,返回实例化表单
     *
    
     * @returns 
     * @memberof CyiaFormService
     */
    /**
     *
     *
     * @param  object
     * @param  [validatorList=null] 对传入object进行验证器列表,验证对象是整个group
     * @param  [type=1] 2为新的生成方式,{value:xx,disabled:xx,...}
     * @returns 
     * @memberof CyiaFormService
     */
    object2Form(object, validatorList: ValidatorFn[] = null, type: number = 1): FormGroup {
        if (type == 2) {
            // if (validatorList)
            return this._setValOBJ(object)
            // return this.fb.group(this._setValOBJ(object))
        }
        if (validatorList)
            return this.fb.group(this.setValOBJ(object), { validator: validatorList })
        return this.fb.group(this.setValOBJ(object))
    }
    /**
     * 设置验证列表
     *
     * @param  validatorConfigList 验证列表
     * @param  [customValidator=null] 自定义函数列表
     * @memberof CyiaFormService
     */
    setValidatorList(validatorConfigList: validatorConfig[], customValidatorFunctionList: CustomValidator[] = null) {
        this.validatorConfigList = validatorConfigList;
        this.customValidatorFunctionList = customValidatorFunctionList;
    }
    /**
     *假设为对象,调用这个,
     *
     * @param  object
     * @param  [addControl=false] 首次调用为false,其他应该为true
     * @returns
     * @memberof FormG
     */
    private setValOBJ(object: Object, objValidatorList: ValidatorFn[] = null) {
        !objValidatorList && console.log('参数obj', object);
        /**带验证器对对象,把原对象加上验证器 */
        let returnObject: Object = {};
        //doc 保证是一个对象
        if (!(TypeJudgment.getType(object) == jsNativeType.object)) return;
        for (const name in object) {
            //doc name字段名,val字段值
            let val = object[name];
            let type = TypeJudgment.getType(val);
            let disabled, validatorList;
            if (!object.hasOwnProperty(name)) return;
            switch (type) {
                case jsNativeType.object://doc 禁用不行,验证器可以
                    [disabled, validatorList] = this.getValidatorConfig(name, formPropertyType.object);
                    Object.assign(returnObject, { [name]: this.setValOBJ(val, validatorList) });
                    break;
                case jsNativeType.array:
                    [disabled, validatorList] = this.getValidatorConfig(name, formPropertyType.array)
                    Object.assign(returnObject, { [name]: this.setValArray(val, validatorList) })
                    break;
                default://doc 默认为直接量
                    [disabled, validatorList] = this.getValidatorConfig(name, formPropertyType.direct)
                    Object.assign(returnObject, { [name]: [{ value: object[name], disabled: disabled }, validatorList] })
                    break;
            }
        }
        if (objValidatorList)
            return this.fb.group(returnObject, { validator: objValidatorList });
        return returnObject;
    }

    /**
     * doc 数组
     * ! 当数组是formgroup/formcontrol之类时,应该直接加入
     * @param  array 需要变成数组控件对数组
     * @param  name 控件数组对名字
     * @memberof FormG
     */
    private setValArray(array: Array<any>, arrayValidAtorList: ValidatorFn[] = null): FormArray | any[] {
        let type = TypeJudgment.getArrayType(array);
        let returnArray = array.map((val) => {
            switch (type) {
                case jsNativeType.array:
                    return this.setValArray(val)//doc都没有字段名
                case jsNativeType.object:
                    return this.setValOBJ(val)//doc都没有字段名
                default:
                    return val;
            }
        })
        if (arrayValidAtorList) {
            if (type == (jsNativeType.object || jsNativeType.array))
                return this.fb.array(returnArray, arrayValidAtorList)
            return [returnArray, arrayValidAtorList];
        } else {
            if (type == (jsNativeType.object || jsNativeType.array))
                return this.fb.array(returnArray)
            return returnArray;
        }
    }

    /**
     * *假设为对象,调用这个,
     * * 新版
     * @param  object
     * @param  [addControl=false] 首次调用为false,其他应该为true
     * @returns
     * @memberof FormG
     */
    private _setValOBJ(
        object: {
            value: {
                [name: string]: FormPropertyValueObj
            },
            disabled?: boolean,
            validatorList?: validatorItem[]
        }
    ) {
        /**带验证器对对象,把原对象加上验证器 */
        let returnObject: Object = {};
        //doc 保证是一个对象

        if (!(TypeJudgment.getType(object.value) == jsNativeType.object) || (object.value.hasOwnProperty('disabled') && TypeJudgment.getType(object.value.disabled) == jsNativeType.bool)) return;
        console.log('外部', object)
        //doc 目前值在object.value中
        for (const name in object.value) {
            if (!object.value.hasOwnProperty(name)) return;
            let val = object.value[name];
            let type = TypeJudgment.getType(val.value);
            let validatorList = this._setValidators(val.validatorList)
            switch (type) {
                case jsNativeType.object://doc 禁用不行,验证器可以
                    Object.assign(returnObject, { [name]: this._setValOBJ(val) });
                    break;
                case jsNativeType.array:
                    Object.assign(returnObject, { [name]: this._setValArray(val) })
                    break;
                default://doc 默认为直接量
                    Object.assign(returnObject, { [name]: [{ value: val.value, disabled: val.disabled || false }, validatorList] })
                    break;
            }
        }
        console.log(returnObject)
        // if (object.validatorList)
        return this.fb.group(returnObject, { validator: object.validatorList });
        // return returnObject;
    }
    /**
    *
    * * 新数组
    * @param  object
    * @returns 
    * @memberof CyiaFormService
    */
    private _setValArray(
        object: {
            value: any[],
            disabled?: boolean,
            validatorList?: validatorItem[]
        }
    ): FormArray | any[] {
        let type = TypeJudgment.getArrayType(object.value);
        let returnArray = object.value.map((val) => {
            switch (type) {
                case jsNativeType.array:
                    return this._setValArray(val)//doc都没有字段名
                case jsNativeType.object:
                    return this._setValOBJ(val)//doc都没有字段名
                default:
                    return val;
            }
        })
        if (object.validatorList) {
            if (type == (jsNativeType.object || jsNativeType.array))
                return this.fb.array(returnArray, this._setValidators(object.validatorList))
            return [returnArray, this._setValidators(object.validatorList)];
        } else {
            if (type == (jsNativeType.object || jsNativeType.array))
                return this.fb.array(returnArray)
            return returnArray;
        }
    }
    /**
  * doc 根据字段的名进行判断,满足验证器的条件
  * 
  * @param  name 字段名
  * @returns 
  * @memberof FormG
  */
    private _setValidators(validatorList: validatorItem[]): ValidatorFn[] {
        if (!validatorList) return [];
        /**验证数组 */
        let validatorArray = new Array<ValidatorFn>();
        validatorList.forEach((validatorObj) => {
            let type = getValidatorsType(validatorObj.name, ...validatorObj.value);
            switch (type) {
                case ValidatorType.BuiltInWithoutParam:
                    validatorArray.push(Validators[validatorObj.name])
                    break;
                case ValidatorType.BuiltInWithParam:
                    validatorArray.push(Validators[validatorObj.name](validatorObj.value));
                    break;
                case ValidatorType.CustomWithoutParam:
                    validatorArray.push(this.customValidatorFunctionList.find((val) => {
                        return val.name === validatorObj.name
                    }))
                    break;
                case ValidatorType.CustomWithParam:
                    validatorArray.push(this.customValidatorFunctionList.find((val) => {
                        return val.name === validatorObj.name
                    })(...validatorObj.value))
                    break;
                default:
                    break;
            }
        })
        validatorArray = validatorArray.filter((val) => { return val });
        return validatorArray || [];
    }
    /**
     * doc 根据字段的名进行判断,满足验证器的条件
     * 
     * @param  name 字段名
     * @returns 
     * @memberof FormG
     */
    private setValidators(validatorItem: validatorConfig): ValidatorFn[] {
        if (!validatorItem.validatorList) return [];
        /**验证数组 */
        let validatorArray = new Array<ValidatorFn>();
        validatorItem.validatorList.forEach((validatorObj) => {
            let type = getValidatorsType(validatorObj.name, ...validatorObj.value);
            switch (type) {
                case ValidatorType.BuiltInWithoutParam:
                    validatorArray.push(Validators[validatorObj.name])
                    break;
                case ValidatorType.BuiltInWithParam:
                    validatorArray.push(Validators[validatorObj.name](validatorObj.value));
                    break;
                case ValidatorType.CustomWithoutParam:
                    validatorArray.push(this.customValidatorFunctionList.find((val) => {
                        return val.name === validatorObj.name
                    }))
                    break;
                case ValidatorType.CustomWithParam:
                    validatorArray.push(this.customValidatorFunctionList.find((val) => {
                        return val.name === validatorObj.name
                    })(...validatorObj.value))
                    break;
                default:
                    break;
            }
        })
        validatorArray = validatorArray.filter((val) => { return val });
        return validatorArray || [];
    }

    /**
     * 获得禁用值,和验证器列表
     *
     * @param  name 
     * @param  [type=formPropertyType.direct] 验证类型
     * @returns 
     * @memberof CyiaFormService
     */
    private getValidatorConfig(name: string, type = formPropertyType.direct): [boolean, ValidatorFn[]] {
        let validatorItem = this.validatorConfigList.find((val) => {
            return (val.name == name) && (type == val.type || !val.type)
        })
        if (!validatorItem) return [false, []];
        return [validatorItem.disable, this.setValidators(validatorItem)]
    }
}