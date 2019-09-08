import { Component, OnInit } from '@angular/core';
import { CyiaFormControl, Pattern, FormControlType } from 'cyia-ngx-form';
// import { FormControlType } from 'lib/src/enum/control-type.enum';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss']
})
export class TestFormComponent implements OnInit {
  control: CyiaFormControl
  c2: CyiaFormControl
  c3: CyiaFormControl
  c4: CyiaFormControl
  c5: CyiaFormControl
  c6: CyiaFormControl
  c7: CyiaFormControl
  constructor() { }

  ngOnInit() {
    this.control = new CyiaFormControl({
      value: '输入值',
      label: '测试',
      placeholder: '占位符',
      labelPosition: 'default',
      appearance: 'fill',
      pattern: Pattern.w,
      limit: (control, data, value) => {
        if (value && value.length > 10) {
          return true
        }
        return false
      }
    })

    this.c2 = new CyiaFormControl({
      type: FormControlType.select,
      pattern: Pattern.w,
      label: '选项',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled:true,
      placeholder: '选项占位符',
      options: async () => [
        { label: '测试1', value: 1, default: true },
        { label: '测试2', value: 2, disabled: true },
      ]
    })
    this.c3 = new CyiaFormControl({
      type: FormControlType.checkbox,
      pattern: Pattern.w,
      label: '选项',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled:true,
    })
    this.c4 = new CyiaFormControl({
      type: FormControlType.radio,
      pattern: Pattern.w,
      label: '选项',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled: true,
      // value: 1,
      options: async () => [
        { label: '测试1', value: 1 },
        { label: '测试2', value: 2, disabled: true, default: true },
      ]
    })
    this.c5 = new CyiaFormControl({
      type: FormControlType.slider,
      pattern: Pattern.w,
      label: '滑动条',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled: true,
      // value: 1,
    })
    this.c6 = new CyiaFormControl({
      type: FormControlType.slideToggle,
      pattern: Pattern.w,
      label: '开关',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled: true,
      // value: 1,
    })
    this.c7 = new CyiaFormControl({
      type: FormControlType.autocomplete,
      pattern: Pattern.w,
      label: '自动补全',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled: true,
      value: 1,
      options: async () => [
        { label: '测试1', value: 1 },
        { label: '测试2', value: 2, disabled: true, default: true },
      ],
      filterPipe: async (th, value) => {
        return th.options(th).then((res) => res.filter((item) => `${item.value}`.includes(value)))
      }
    })


    // this.control.disabled = true

    // this.control.hidden = true

  }

}
