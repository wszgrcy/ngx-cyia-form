import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CyiaFormControl, Pattern, FormControlType, CyiaFormGroup } from 'cyia-ngx-form';
import { Validators } from '@angular/forms';
// import { FormControlType } from 'lib/src/enum/control-type.enum';
import { importScript } from "cyia-ngx-common";
@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss']
})
export class TestFormComponent implements OnInit {
  @ViewChild('optTemplate', { static: true }) optTemplate: TemplateRef<any>
  control: CyiaFormControl
  c2: CyiaFormControl
  c3: CyiaFormControl
  c4: CyiaFormControl
  c5: CyiaFormControl
  c6: CyiaFormControl
  c7: CyiaFormControl
  g1 = new CyiaFormGroup()
  g2 = new CyiaFormGroup()
  constructor() {

  }

  ngOnInit() {
    // import('monaco').then((e) => {
    //   console.log(e)
    //   console.log(e.getBuildInfo())
    // })

    this.control = new CyiaFormControl({
      key: 'control',
      value: '测试输入值',
      // value: ,
      label: '输入',
      placeholder: '输入占位符',
      labelPosition: 'default',
      appearance: 'fill',
      pattern: Pattern.w,
      validator: [Validators.required, Validators.maxLength(10), Validators.minLength(5),
      Validators.email, Validators.pattern(/a/),
      Validators.requiredTrue
      ],
      // limit: (control, data, value) => {
      //   if (value && value.length > 10) {
      //     return true
      //   }
      //   return false
      // }
    })

    this.c2 = new CyiaFormControl({
      type: FormControlType.select,
      pattern: Pattern.w,
      label: '选项',
      labelPosition: 'default',
      appearance: 'fill',
      required: true,
      // disabled: true,
      placeholder: '选项占位符',
      options: async () => [
        { label: '测试1', value: 1, default: true },
        { label: '测试2', value: 2, disabled: false },
      ],
      valueChange: async () => [{ type: 'value', value: '值变更111', target: ['111', 'control'] }]
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

    this.g1.controls.push(this.c2)
    let md = new CyiaFormControl({
      type: FormControlType.markdown,
      pattern: Pattern.w,
      height: 200
    })
    this.g1.controls.push(md)
    let g2 = new CyiaFormGroup()
    g2.key = '111'
    g2.controls.push(this.control)
    g2.gridTemplateAreas = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 0, 0, 0]]
    this.g1.controls.push(g2)

    this.g1.gridTemplateAreas = [[1, 1, 2, 2, 3], [0, 0, 2, 2, 0], [0, 0, 2, 2, 0]]
    this.g2 = g2


  }
  ngAfterViewInit(): void {
    setTimeout(() => {
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
        optionTemplate: this.optTemplate,
        filterPipe: async (th, value) => {
          return th.options(th).then((res) => res.filter((item) => `${item.value}`.includes(value)))
        }
      })

    }, 0);
  }

}
