import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy, SimpleChanges, Renderer2, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CyiaFormGroup, CyiaFormControl } from '../../form/cyia-form.class';
import { LayoutStyle } from 'lib/src/type/form-group.type';

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
  host: {
    '[class]': 'cyiaFormGroup&&cyiaFormGroup.layoutStyle'
  }
})
export class CyiaFormGroupComponent implements ControlValueAccessor {
  @Input() cyiaFormGroup: CyiaFormGroup
  @ViewChildren('controlEl', { read: ElementRef }) controlList: QueryList<ElementRef>
  @ViewChild('wrapper', { static: false }) set wrapper(val: ElementRef<HTMLDivElement>) {
    this.setLayout(val)
  }
  formGroup: FormGroup
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  value
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cyiaFormGroup) {
      let formGroup = new FormGroup({})
      this.cyiaFormGroup.controls.forEach((item) => {
        if (item instanceof CyiaFormGroup) {
          formGroup.addControl(item.key, this.fb.control(undefined))
        } else if (item instanceof CyiaFormControl) {
          formGroup.addControl(item.key, this.fb.control(item.value, item.validator))
        }
        // else if (item instanceof CyiaFormArray) {
        //   formGroup.addControl(item.key, this.fb.control(undefined))
        // }
      })
      this.formGroup = formGroup
      this.valueChangeListener()
    }

  }
  ngOnInit() {
    setTimeout(() => {
      console.log(this.formGroup)
    }, 3000);
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
    }
    // else if (control instanceof CyiaFormArray) {
    //   return 'array'
    // }
  }
  valueChangeListener() {
    this.formGroup.valueChanges.subscribe((val) => {
      console.log(val)
      this.valueChange(val)
    })
  }
  setLayout(wrapper: ElementRef<HTMLDivElement>) {
    switch (this.cyiaFormGroup.layoutStyle) {
      case LayoutStyle.cssGrid:
        this.renderer.setStyle(wrapper.nativeElement, 'grid-template-areas', this.cyiaFormGroup.gridTemplateAreas.map((items) => `'${items.map((item) => item ? `a${item}` : '.').join(' ')}'`).join(' '))
        this.renderer.setStyle(wrapper.nativeElement, 'grid-template-columns', `repeat(${this.cyiaFormGroup.gridTemplateAreas[0].length}, 1fr)`)
        this.controlList.forEach((item, i) => this.renderer.setStyle(item.nativeElement, 'grid-area', `a${i + 1}`))
        break;

      default:
        break;
    }
  }
}
