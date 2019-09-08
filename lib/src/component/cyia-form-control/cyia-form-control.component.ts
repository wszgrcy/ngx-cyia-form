import { Component, OnInit, forwardRef, Input, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CyiaFormControl } from '../../form/cyia-form.class';
import { CyiaFormControlFlag } from '../../type/form-control.type';
import { take } from "rxjs/operators";
import { FormControlType } from '../../enum/control-type.enum';
import { CyiaOption } from '../../type/options.type';
@Component({
  selector: 'cyia-form-control',
  templateUrl: './cyia-form-control.component.html',
  styleUrls: ['./cyia-form-control.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormControlComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': `cyiaFormControl&&(
      'label-position-'+cyiaFormControl.labelPosition+ ' '+cyiaFormControl.type+
      ' '+cyiaFormControl.class 
      )`,
    '[style.display]': `cyiaFormControl&&cyiaFormControl.hidden?'none':'' `

  }
})
export class CyiaFormControlComponent implements OnInit {
  static index = 0
  id = `cyia-form-control-${CyiaFormControlComponent.index++}`
  flag: CyiaFormControlFlag = {
    required: false,
    floatLabel: 'auto',
    formField: false
  }
  oldValue
  _value
  get value() {
    return this._value
  }
  set value(val) {
    this.valueChange(val)
    if (this._cyiaFormControl.type === FormControlType.autocomplete) {
      if (this._cyiaFormControl.filterPipe) {
        this._cyiaFormControl.filterPipe(this._cyiaFormControl, val).then((res) => {
          this.options = res
        })
      }
    }
  }
  readValue: string = ''
  options: CyiaOption[]
  /**
   * label显示,
   * 1.默认在左侧的 此时required用左侧,里面的required应该取消
   * 2.
   */
  /**
   * fill outline不能用 inline标签,显示不正常
   */
  @Input() set cyiaFormControl(value) {
    if (!value) return
    this.cyiaFormControlInput(value)
    //doc 取消上一次订阅
    this._cyiaFormControl && this._cyiaFormControl.change$.unsubscribe()
    //doc 订阅本次
    this.changeSubscribe(value)
    //doc 最后赋值
    this._cyiaFormControl = value
  }

  get cyiaFormControl() {
    return this._cyiaFormControl
  }
  _cyiaFormControl: CyiaFormControl
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  constructor(
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  registerOnChange(fn) {
    this.changeFn = fn;
  }
  registerOnTouched(fn) {
    this.touchedFn = fn;
  }

  writeValue(value) {
    if (value !== undefined) {
      this._value = this._cyiaFormControl.inputPipe ? this._cyiaFormControl.inputPipe(this._cyiaFormControl, value) : value
    }
  }
  valueChange(value: string) {
    if (this._cyiaFormControl.outputPipe)
      this._value = this._cyiaFormControl.outputPipe(this._cyiaFormControl, value)
    else
      this._value = value
    this.changeFn(this._value)
    this.touchedFn(this._value)
  }
  labelPositionChange(cyiaFormControl: CyiaFormControl) {
    if (cyiaFormControl.labelPosition == 'default') {
      this.flag.floatLabel = 'never'
      this.flag.required = false
    } else {
      this.flag.required = cyiaFormControl.required
    }
  }
  readValueChange(cyiaFormControl: CyiaFormControl) {
    if (cyiaFormControl.pattern == 'r') {
      this.readValue = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value
    }
  }
  oldValueChange(cyiaFormControl: CyiaFormControl) {
    this.oldValue = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value
  }
  formFieldChange(cyiaFormControl: CyiaFormControl) {
    this.flag.formField = cyiaFormControl.type == FormControlType.input || cyiaFormControl.type == FormControlType.select || cyiaFormControl.type == FormControlType.autocomplete
  }
  async optionsChange(cyiaFormControl: CyiaFormControl) {
    this.options = []
    this.options = (await cyiaFormControl.options(cyiaFormControl));
    let defaultVaule = this.options.find((option) => option.default);
    if (defaultVaule === undefined) return
    if (cyiaFormControl.value !== undefined) return
    cyiaFormControl.value = defaultVaule.value
    this._value = defaultVaule.value
  }
  inputValueChange(cyiaFormControl: CyiaFormControl) {
    this._value = cyiaFormControl.inputPipe ? cyiaFormControl.inputPipe(cyiaFormControl, cyiaFormControl.value) : cyiaFormControl.value
  }
  /**
   * 每次类变更的操作
   *
   * @author cyia
   * @date 2019-09-07
   * @param cyiaFormControl
   */
  cyiaFormControlInput(cyiaFormControl: CyiaFormControl) {
    this.inputValueChange(cyiaFormControl)
    this.labelPositionChange(cyiaFormControl)
    this.readValueChange(cyiaFormControl)
    this.oldValueChange(cyiaFormControl)
    this.formFieldChange(cyiaFormControl)
    this.optionsChange(cyiaFormControl)
  }
  changeSubscribe(cyiaFormControl: CyiaFormControl) {
    cyiaFormControl.change$.subscribe((val) => {
      switch (val.type) {
        case 'labelPosition':
          this.labelPositionChange(cyiaFormControl)
          break;
        case 'pattern':
          this.readValueChange(cyiaFormControl)
          break
        case 'value':
          this.inputValueChange(cyiaFormControl)
          this.readValueChange(cyiaFormControl)
          this.oldValueChange(cyiaFormControl)
          break
        case 'required':
          this.labelPositionChange(cyiaFormControl)
          break
        case 'type':
          this.formFieldChange(cyiaFormControl)
          break
        case 'options':
          this.optionsChange(cyiaFormControl)
          break
        default:
          break;
      }

      this.cd.markForCheck()
    })
  }

  /**
   * 目前是对于input的限制
   *
   * @author cyia
   * @date 2019-09-07
   * @param e
   */
  limit(e) {
    // console.log(e)
    if (e.inputType == 'insertText' || e.inputType == 'insertCompositionText' && e.data.trim()) {
      if (this.cyiaFormControl.limit && this.cyiaFormControl.limit(this.cyiaFormControl, e.data, this.value)) {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
          this.value = this.oldValue
          this.cd.detectChanges()
        })
      } else {
        this.oldValue = this.value;
        this.cyiaFormControl.value = this.value
      }
    }
  }
}
