import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CyiaFormGroup } from '../../form/cyia-form.class';

@Component({
  selector: 'app-cyia-form-group',
  templateUrl: './cyia-form-group.component.html',
  styleUrls: ['./cyia-form-group.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormGroupComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  }]
})
export class CyiaFormGroupComponent implements ControlValueAccessor {
  @Input() cyiaFormGroup: CyiaFormGroup
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  value
  constructor() { }
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
}
