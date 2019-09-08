import { Subject } from 'rxjs'
import { ChangeEmit } from '../decorator/change-emit.decorator'
import { ReturnBoolean } from '../type/return-boolean'
import { Validator, Validators, ValidatorFn } from '@angular/forms'
import { ReturnString } from '../type/return-string'
import { ReturnValue } from '../type/return-Value'
import { FormControlType } from '../enum/control-type.enum'
import { CyiaFormControlChange } from '../type/change-type.type'
import { ListenClass } from '../decorator/listen-class.decorator'
import { ChangeSubscribe } from '../decorator/change-subscribe.decorator'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { TemplateRef } from '@angular/core';
import { CyiaOption } from '../type/options.type';
// @ListenClass()
export class _CyiaFormControl<T = any>{
    key?: string = ''
    /**值变化,控件内 */
    @ChangeEmit()
    value?: T
    /**
     * doc 相关状态变化
     * 
     */
    /**是否禁用,控件内 */
    @ChangeEmit()
    disabled?: boolean = false
    /**占位符,控件内 */
    @ChangeEmit()
    placeholder?: string = ''
    @ChangeEmit()
    /**隐藏控件,控件内 */
    hidden?: boolean = false
    @ChangeEmit()
    /**显示标签,控件内 */
    label?: string;
    /**标签位置,控件内 */
    @ChangeEmit()
    labelPosition?: 'float' | 'inline' | 'default' | 'none' = 'default'
    /**是否必须,控件内 */
    required?= false
    @ChangeEmit()
    /**是否输出,group内 */
    output?: boolean = true
    @ChangeEmit()
    /**是否输出错误,group内 */
    outputError?: boolean = true
    /**加入到表单控件中,如果是true,那么还需要再加入回来,group内 */
    @ChangeEmit()
    join?: boolean = true
    /**用于区分不同控件,控件内 */
    @ChangeEmit()
    type?: FormControlType = FormControlType.input
    /**子类路径,控件内 */
    @ChangeEmit()
    subType?: string
    @ChangeEmit()
    pattern?: Pattern = Pattern.r
    /**不同样式 */
    @ChangeEmit()
    style?: Object
    @ChangeEmit()
    class?: string = ''
    /**除了label外,还应该有其他的.比如是不是必须
     * 是不是:
     * 后缀template
     * 前缀template
     */
    @ChangeEmit()
    display?: boolean = true
    /**验证器 */
    @ChangeEmit()
    validator?: ValidatorFn[]
    /**限制输入 */
    // @ChangeEmit()
    limit?: (arg0: this, now, value) => boolean;

    appearance?: MatFormFieldAppearance = 'legacy'
    /**select.radio,slider,slidetoggle,autocomplete,控件内 */
    options?: (arg0:this) => Promise<CyiaOption<T>[]> = async () => []
    /**自定义选项的模板,控件内 */
    optionTemplate?: TemplateRef<any>
    /**输入值,输出值管道转化,控件内 */
    inputPipe?: (arg0: this, value) => any
    outputPipe?: (arg0: this, value) => any
    /**autocomplete使用 */
    filterPipe?: (arg0: this, value) =>Promise<CyiaOption<T>[]> 
}
export class CyiaFormControl<T = any> extends _CyiaFormControl {
    change$: Subject<CyiaFormControlChange>

    constructor(cyiaFormControl?: _CyiaFormControl) {
        super()
        this.change$ = this._changeFn() as any
        // console.log(this.change$)
        this._setValue(cyiaFormControl)
    }

    /**控件路径,应该由grouop赋值 */
    path: string[]
    @ChangeSubscribe()
    private _changeFn() {

    }
    private _setValue(object) {
        if (!object) return
        for (const key in object) {
            if (!object.hasOwnProperty(key)) continue
            this[key] = object[key]
        }
    }
}
export class CyiaFormGroup {
    key: string
    controls: { [name: string]: CyiaFormControl | CyiaFormGroup | CyiaFormArray }
}
export class CyiaFormArray {
    list: (CyiaFormControl | CyiaFormGroup | CyiaFormArray)[]
}
export enum Pattern {
    w = 'w', r = 'r'
}