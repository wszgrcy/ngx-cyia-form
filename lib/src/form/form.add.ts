import { HttpRequestItem, CyiaHttpService, TypeJudgment, jsNativeType } from 'cyia-ngx-common';
import { ModelViewPropertyConfig, componentType, FormPropertyValueObj } from './form.define';
import { _getConfig2Object } from './form.core';

export function dataSourceFromReq(http: CyiaHttpService, httpRequestConfig: HttpRequestItem) {
    return http.request(httpRequestConfig).toPromise(this)
}

/**
 * 预定义返回自身值
 *
 * @export
 * @param  value
 * @returns 
 */
export function dataSourceFromSelf(value): Promise<any> {
    return new Promise((res) => {
        res({ label: this.value, value: this.value })
    })
}
//todo 1.返回
export function configValueInit(config: ModelViewPropertyConfig[], list) {
    let newConfig = _newArray(config)
    return mixinMVPArray(newConfig, list)
}

/**
 * 键值混合
 *
 * @param  configArray
 * @param  valueObj
 */
export function mixinMVPArray(configArray: ModelViewPropertyConfig[], valueObj: any) {
    console.log(configArray);
    configArray.map((val) => {
        val.key = val.key || val.keyPath[val.keyPath.length - 1]
        switch (val.type) {
            case componentType.ARRAY:
                val = mixinMVPArrayUseModel(val, valueObj)
                break;
            case componentType.OBJECT:
                val.children = mixinMVPArray(val.children as ModelViewPropertyConfig[], valueObj)
                break;
            default:
                console.log(val.token)
                val.value = getValue(val.valuePath || val.keyPath, valueObj)
                break;
        }
        return val
    })
    return configArray
}

function mixinMVPArrayUseModel(configObject: ModelViewPropertyConfig, valueObj: any) {
    /**应该是个数组 */
    let value: any[] = getValue(configObject.valuePath || configObject.keyPath, valueObj);
    console.log(value)
    /**保存元素模型供后来使用 */
    let childModel = _newArray(configObject.children[0])
    configObject.children = new Array(value.length);
    for (let i = 0; i < configObject.children.length; i++) {
        configObject.children[i] = _newArray(childModel);
        /**未填入数值的每一组元素 */
        let childValue: ModelViewPropertyConfig[] = configObject.children[i] as any;
        //todo 需要对数组进行赋值
        console.log(childValue)
        childValue = mixinMVPArray(childValue, value[i])
    }
    return configObject
}
/**获得数值 */
function getValue(pathArray: any[], valueObj) {
    let value = null;
    for (let i = 0; i < pathArray.length; i++) {
        const val = pathArray[i];
        if (!value)
            value = valueObj[val];
        else
            value = value[val];
        if (!value) break;
    }
    return value;
}
export function _newObj<T>(obj): T {
    let newObj = {} as any;
    for (const x in obj) {
        if (obj.hasOwnProperty(x)) {
            const element = obj[x];
            switch (TypeJudgment.getType(element)) {
                case jsNativeType.object:
                    newObj[x] = _newObj(element)
                    break;
                case jsNativeType.array:
                    newObj[x] = _newArray(element)
                    break;
                default:
                    newObj[x] = element
                    break;
            }
        }
    }
    return newObj
}
export function _newArray(array: Array<any>) {
    let newArray = new Array();
    /**数组中的元素类型 */
    let arrayType = TypeJudgment.getArrayType(array)
    switch (arrayType) {
        case jsNativeType.object:
            (<any[]>array).forEach((val, i) => {
                newArray[i] = _newObj(val);
            })
            break;
        case jsNativeType.array:
            (<any[]>array).forEach((val, i) => {
                newArray[i] = _newArray(val)
            })
        default:
            newArray = (<any[]>array).concat()
            break;
    }
    return newArray;
}


/**将模型转化为可以被表单使用的值 */
export function transform2FBConfig(config: ModelViewPropertyConfig[]): { [name: string]: FormPropertyValueObj } {
    return _getConfig2Object(config)
}
