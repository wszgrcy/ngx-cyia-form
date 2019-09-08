// import { validatorConfig } from './../../../lib/src/form/form.define';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component } from '@angular/core';
import { componentType, ModelViewPropertyConfig, CustomValidator, CyiaFormService, _newArray, transform2FBConfig, mixinMVPArray, validatorConfig } from 'cyia-ngx-form';

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

  }
  ngOnInit(): void {

    this.createForm()
  }
  createForm() {
    /**配置的副本 */
    let configDuplicate: ModelViewPropertyConfig[] = _newArray(TEST_ARRAY);
    let formObject = transform2FBConfig(configDuplicate);
    console.log(formObject)
    /**设置验证器列表 */
    this.service.setValidatorList(null, [{
      name: 'customValidator',
      fn: customValidator
    }])
    let formGroup = this.service.object2Form({ value: formObject }, null, 2);

    console.log(formGroup)
  }
}


/**自定义写法 */
function customValidator(a, b): ValidatorFn {
  return (c: AbstractControl) => {
    console.log('运行', a, b)
    return { '测试错误': true }
  }
}
function _reduceControls(controlsConfig: { [k: string]: any }): { [key: string]: AbstractControl } {
  const controls: { [key: string]: AbstractControl } = {};
  Object.keys(controlsConfig).forEach(controlName => {
    // 获取控件的名称，然后基于控件对应的配置信息，创建FormControl控件，并保存到controls对象上
    controls[controlName] = this._createControl(controlsConfig[controlName]);
  });
  return controls;
}



export const TEST_ARRAY: ModelViewPropertyConfig[] = [
  {
    token: 'id', keyPath: ['id'], valuePath: ['id'], value: 123, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.UNDISPLAY, placeholder: '缺省提示', dataSource: {
      fn: dataSourceFromSelf,
      param: [],
      nextToken: '',
      delay: false
    }, list: [], variety: null
  },
  {
    token: 'validator', keyPath: ['validator'], valuePath: ['validator'], value: 11, disabled: false, required: false, validatorList: [{ name: 'maxLength', value: 1 }, { name: 'customValidator', value: [9, 2] }], label: '验证器测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', list: [], variety: null
  },
  {
    token: 'description', keyPath: ['description'], valuePath: ['description'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.INPUT, placeholder: '缺省提示', list: [], variety: null
  },
  {
    token: 'date', keyPath: ['date'], valuePath: ['date'], value: null, disabled: false, required: false, validatorList: null, label: '测试', sort: 1, type: componentType.UNDISPLAY, placeholder: '缺省提示', list: [], variety: null
  },

]


function dataSourceFromSelf(value): Promise<any> {
  return new Promise((res) => {
    console.log('通过自定义函数获得表单值或选项列表')
    res([{ label: value, value: value }])
  })
}
