import { validatorConfig } from './../../../lib/src/form/form.define';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component } from '@angular/core';
import { CustomValidator } from 'lib/src/form/form.define';
import { CyiaFormService, _newArray, transform2FBConfig, mixinMVPArray } from 'lib/src';
import { componentType, ModelViewPropertyConfig } from 'ngx-form';

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
    // this.form = fb.group({
    //   name1: ['cyia', [Validators.required]],
    //   name2: ['5', [Validators.max(5)]],
    //   name4: ['5', [Validators.min(5)]],
    //   name3: ['cyia', [Validators.maxLength(5)]],
    //   name5: ['cyia', [Validators.minLength(5)]],
    //   name6: ['true', [Validators.requiredTrue]],//doc 未知
    //   name7: ['af@sfd.sdf', [Validators.email]],
    //   name8: ['', [Validators.pattern(/^[a-z]{2,999}/)]],//doc 如果匹配为空那么也不报错
    //   name9: ['', [Validators.nullValidator]],//doc 不执行任何操作,打酱油
    //   name10: [{ value: '禁用', disabled: true }],
    //   test1: [{ value: fb.array([123]) }],
    //   test2: fb.array([123]),//doc数组的正确写法
    //   test3: { value: fb.array([123]), disabled: true },//doc数组的正确写法
    //   test4: { value: fb.group({ 123: 456 }) },
    //   test5: fb.group({ 123: 456 }),//doc 正确
    //   test6: [{ value: fb.group({ 123: 456 }) }],
    //   test7: [fb.group({ 123: 456 }), Validators.required],
    //   test8: fb.group({ 123: 456 }, { validator: [Validators.required, customValidator(9, 9)] }),//! group这种方式加验证器正确
    //   test9: fb.array([123], [customValidator(8, 8)]),//! array
    //   test10: fb.array([123], [customValidator(8, 8)])//! array
    // }, { validator: customValidator(1, 5) })
    // this.form.get('test5').setValidators(Validators.required)
    // this.form.get('test10').disable()
    // console.log(this.form)
    // console.log(this.form.value)
    // //doc判断是自定义的还是预设的
    // console.log(Object.prototype.hasOwnProperty.call(Validators, 'required'))
    // console.log(Object.prototype.hasOwnProperty.call(Validators, '123'))

    // let a: CustomValidator[] = [customValidator];
    // console.log(a)
    // console.log(a[0].name)
  }
  ngOnInit(): void {
    // this.service.setValidatorList(testValidatorArray, [customValidator])
    // let tform = this.service.object2Form(testObj)
    // console.log(tform)
    // console.log(testObj)
    // console.log(tform.value)
    this.copyobj()
  }
  copyobj() {
    /**配置的副本 */
    let configDuplicate: ModelViewPropertyConfig[] = _newArray(TEST_ARRAY);
    let obj = mixinMVPArray(configDuplicate, {
      name: '测试123',
      t2: { name: '普通的一个对象' },
      t3: [{ name: '数组第一个' }, { name: '数组第二个' }],
      id: 1
    })
    console.log(configDuplicate)
    // let selobj = obj.find((value) => {
    //   return value.token == 'select'
    // })
    // this.selvalue = selobj.value;
    // selobj.dataSource.fn(selobj.value).then((res) => {
    //   console.log(res)
    //   this.list = res
    // })
    let nameV = transform2FBConfig(obj);
    console.warn(nameV);
    // console.warn(this.fb.group(nameV))
    let bb = this.service.object2Form({ value: nameV }, null, 2)
    console.log(bb)
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


export const TEST_ARRAY: ModelViewPropertyConfig[] = [
  {
    token: 'sel', keyPath: ['name'], valuePath: ['name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
      fn: dataSourceFromSelf,
      param: [],
      nextToken: '',
      delay: false
    }, list: [], variety: null
  },
  {
    token: 'select', keyPath: ['id'], valuePath: ['id'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
      fn: dataSourceFromSelf,
      param: [],
      nextToken: '',
      delay: false
    }, list: [], variety: null
  },
  {
    token: 'sel2', keyPath: ['t2'], valuePath: ['t2'], disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.OBJECT, placeholder: '缺省提示', dataSource: {
      fn: dataSourceFromSelf,
      param: [],
      nextToken: '',
      delay: false
    }, list: [], variety: null, children: [
      {
        token: 'sel21', keyPath: ['t2', 'name'], valuePath: ['t2', 'name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
          fn: dataSourceFromSelf,
          param: [],
          nextToken: '',
          delay: false
        }, list: [], variety: null
      },
    ]
  },
  {
    token: 'sel3', keyPath: ['t3'], valuePath: ['t3'], disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.ARRAY, placeholder: '缺省提示', dataSource: {
      fn: dataSourceFromSelf,
      param: [],
      nextToken: '',
      delay: false
    }, list: [], variety: null, children: [
      [{
        token: 'sel31', keyPath: ['name'], valuePath: ['name'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', dataSource: {
          fn: dataSourceFromSelf,
          param: [],
          nextToken: '',
          delay: false
        }, list: [], variety: null
      }]

    ]
  }
]



function dataSourceFromSelf(value): Promise<any> {
  return new Promise((res) => {
    console.log(this)
    res([{ label: value, value: value }])
  })
}
