import { ValidatorFn } from "@angular/forms";
//doc 新定义
export enum ValidatorType {
    /**内置有参数 */
    BuiltInWithoutParam = 1,
    /**内置无参数 */
    BuiltInWithParam = 2,
    /**自定义有参数 */
    CustomWithoutParam,
    /**自定义无参数 */
    CustomWithParam, Custom = 5,
    Unknown = 6
}
//用于设置自定义数组
export interface CustomValidator {
    (...param): ValidatorFn
}


/**
 *
 * 某一字段的验证及验证名字
 * @export
 */
export interface validatorItem {
    name: BuiltInValidatorName | CustomValidatorName;
    value: any;

}

/**
 *  验证项数组,供增加验证用
 *
 * @export
 */
export interface validatorConfig {
    /**验证的字段名 */
    name: string;
    /**验证器列表 */
    validatorList?: validatorItem[];
    /**字段类型(数组,对象,装对象的数组) */
    type?: formPropertyType;
    disable?: boolean;
}

export type BuiltInValidatorName = 'required' | 'max' | 'min' | 'maxLength' | 'minLength' | 'requiredTrue' | 'email' | 'pattern' | 'nullValidator'
export type CustomValidatorName = string

export enum formPropertyType {
    object = 1,
    array,
    /**直接量 */
    direct
}
/**model-view-config */
/**
 * @description 
 * @author cyia
 * @date 2018-09-17
 * @export
 */
export interface ModelViewPropertyConfig {
    /**确定字段的唯一值 */
    token?: string;
    /**key的路径值.最后一个为key值 */
    keyPath?: string[];
    /**value的路径值.一个key不一定对于他的value */
    valuePath?: string[];
    /**一般来说是keyPath的最后一个值 */
    key?: any;
    /**value值 */
    value?: any
    /**默认false禁用 */
    disabled?: boolean;
    /**默认fasel非必须,必须和验证是两回事 */
    required?: boolean;
    /**验证器列表 */
    validatorList?: validatorItem[];
    /**字段显示的名字 */
    label?: string;
    /**
     * @deprecated 将在未来5个版本后移除,使用order
     * 字段显示的位置 */
    sort?: number;
    /**字段显示的位置 */
    order?: number;
    /**字段对应的组件 */
    type?: componentType;
    /**占位符 */
    placeholder?: string;
    /**数据来源:下拉等传入值和显示值不一致和选项选择需要 */
    dataSource?: {
        fn?: dataSourceFunction
        param?: any[],
        nextToken?: string;//todo 根据token值返回所需参数.然后进行请求
        delay?: boolean;//todo 是否是启动时获取.默认true
        /**请求值的目标，当为both时返回格式需为['value','list'] */
        target?: 'list' | 'value' | 'both';
    }
    //todo 1.直接显示自己.2.接口请求.3.其他方法请求
    //todo 要是工厂类进行返回
    /**列表显示 */
    list?: any[]
    /**其他变种类型,用于混合 */
    variety?: { [name: string]: ModelViewPropertyConfig }
    /**
     * @deprecated 将在未来5个版本后移除,使用status
     * 默认true使用 */
    use?: boolean;
    /**可能有1.使用并且可以输入(正常操作),2.使用但是不能输入(disabled),3.看不见组件依靠其他赋值.4.直接在请求中没有此项  0b0000*/
    status?: number;
    /**子 */
    children?: ModelViewPropertyConfig[] | ModelViewPropertyConfig | ModelViewPropertyConfig[][];

}
export type dataSourceFunction = (...param) => Promise<any>

/**
 * doc 组件类型
 *
 * @export
 * @enum 
 */
export enum componentType {
    INPUT, SELECT_ONE, SELECT_MULTI, MARKDOWN, UPLOAD_ONE, UPLOAD_MULTI,
    ARRAY = 1000, OBJECT, VAR,
    UNDISPLAY = 9999
}
export enum varType {
}
export interface FormPropertyValueObj {
    value: any;
    disabled?: boolean;
    validatorList?: validatorItem[];
}
