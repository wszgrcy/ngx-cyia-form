import { validatorConfig } from './../../../lib/src/form/form.define';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component } from '@angular/core';
import { CustomValidator } from 'lib/src/form/form.define';
import { CyiaFormService } from 'lib/src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cyia-ngx-form';
  form: FormGroup;
  form1: FormGroup
  constructor(private fb: FormBuilder, private service: CyiaFormService) {
    this.form = fb.group({
      name1: ['cyia', [Validators.required]],
      name2: ['5', [Validators.max(5)]],
      name4: ['5', [Validators.min(5)]],
      name3: ['cyia', [Validators.maxLength(5)]],
      name5: ['cyia', [Validators.minLength(5)]],
      name6: ['true', [Validators.requiredTrue]],//doc 未知
      name7: ['af@sfd.sdf', [Validators.email]],
      name8: ['', [Validators.pattern(/^[a-z]{2,999}/)]],//doc 如果匹配为空那么也不报错
      name9: ['', [Validators.nullValidator]],//doc 不执行任何操作,打酱油
      name10: [{ value: '禁用', disabled: true }],
      test1: [{ value: fb.array([123]) }],
      test2: fb.array([123]),//doc数组的正确写法
      test3: { value: fb.array([123]), disabled: true },//doc数组的正确写法
      test4: { value: fb.group({ 123: 456 }) },
      test5: fb.group({ 123: 456 }),//doc 正确
      test6: [{ value: fb.group({ 123: 456 }) }],
      test7: [fb.group({ 123: 456 }), Validators.required],
      test8: fb.group({ 123: 456 }, { validator: [Validators.required, customValidator(9, 9)] }),//! group这种方式加验证器正确
      test9: fb.array([123], [customValidator(8, 8)]),//! array
      test10: fb.array([123], [customValidator(8, 8)])//! array
    }, { validator: customValidator(1, 5) })
    this.form.get('test5').setValidators(Validators.required)
    this.form.get('test10').disable()
    console.log(this.form)
    console.log(this.form.value)
    //doc判断是自定义的还是预设的
    console.log(Object.prototype.hasOwnProperty.call(Validators, 'required'))
    console.log(Object.prototype.hasOwnProperty.call(Validators, '123'))

    let a: CustomValidator[] = [customValidator];
    console.log(a)
    console.log(a[0].name)
  }
  ngOnInit(): void {
    this.service.setValidatorList(testValidatorArray, [customValidator])
    let tform = this.service.object2Form(testObj)
    console.log(tform)
    console.log(testObj)
    console.log(tform.value)
  }
}
/**自定义写法 */
function customValidator(a, b): ValidatorFn {
  return (c: AbstractControl) => {
    return { '测试错误': true }
  }
}
function _reduceControls(controlsConfig: { [k: string]: any }): { [key: string]: AbstractControl } {
  const controls: { [key: string]: AbstractControl } = {};
  // controlsConfig - {name: [...], account: this.fb.group(...)}
  Object.keys(controlsConfig).forEach(controlName => {
    // 获取控件的名称，然后基于控件对应的配置信息，创建FormControl控件，并保存到controls对象上
    controls[controlName] = this._createControl(controlsConfig[controlName]);
  });
  return controls;
}
//todo 1.获得数据key:value(来自请求)
//todo 2.验证器匹配 (自己写结构->完成)
//todo 3.是否禁用 (自己写)
const testObj = {
  // int: 1,
  // string: '2',
  string2: '324',
  // obj: {
  //   obj1: 1,
  //   obj2: '2'
  // },
  // array1no: [1, 2, 3],
  // array2: [{ a1: 1 }, { a2: 2 }],
  // array3: [[[456]]]
}
const testValidatorArray: validatorConfig[] = [
  // { name: 'int', validatorList: [{ name: 'required', value: true }, { name: 'email', value: true }] },
  // { name: 'string', validatorList: [{ name: 'required', value: true }], disable: true },
  { name: 'string2', validatorList: [{ name: 'maxLength', value: 1 }, { name: 'customValidator', value: [9, 2] }] }
]