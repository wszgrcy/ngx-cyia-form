import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CyiaFormGroup, CyiaFormControl, CyiaFormArray } from '../../form/cyia-form.class';

@Component({
  selector: 'cyia-form-group',
  templateUrl: './cyia-form-group.component.html',
  styleUrls: ['./cyia-form-group.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormGroupComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyiaFormGroupComponent implements ControlValueAccessor {
  formGroup: FormGroup
  @Input() cyiaFormGroup: CyiaFormGroup
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  value
  constructor(private fb: FormBuilder) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes.cyiaFormGroup) {
      let formGroup = new FormGroup({})
      console.log(this.cyiaFormGroup)
      this.cyiaFormGroup.controls.forEach((item) => {
        if (item instanceof CyiaFormGroup) {
        } else if (item instanceof CyiaFormControl) {
          formGroup.addControl(item.key, this.fb.control(item.value, item.validator))
        } else if (item instanceof CyiaFormArray) {
        }

      })
      this.formGroup = formGroup
    }

  }
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
      this.value = value
    }
  }
  valueChange(value: string) {
    this.value = value
    this.changeFn(value)
    this.touchedFn(value)
  }
  getFormType(control) {
    if (control instanceof CyiaFormGroup) {
      return 'group'
    } else if (control instanceof CyiaFormControl) {
      return 'control'
    } else if (control instanceof CyiaFormArray) {
      return 'array'
    }
  }
}
