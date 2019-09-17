import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy, SimpleChanges, Renderer2, ViewChild, ViewContainerRef, ElementRef, ViewChildren, QueryList, Self, Host, SkipSelf, Optional, Injector, INJECTOR } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CyiaFormGroup, CyiaFormControl } from '../../form/cyia-form.class';
import { LayoutStyle } from '../../type/form-group.type';
import { CyiaFormGroupService } from './cyia-form-group.service';

@Component({
  selector: 'cyia-form-group',
  templateUrl: './cyia-form-group.component.html',
  styleUrls: ['./cyia-form-group.component.scss'],
  providers: [{
    useExisting: forwardRef(() => CyiaFormGroupComponent),
    provide: NG_VALUE_ACCESSOR,
    multi: true
  },
    // CyiaFormGroupService
    // {
    //   provide: CyiaFormGroupService,
    //   useFactory: (service) => {
    //     if (!service) {
    //       return new service()
    //     }
    //   },
    //   deps: [CyiaFormGroupService]
    // }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'cyiaFormGroup&&cyiaFormGroup.layoutStyle'
  }
})
export class CyiaFormGroupComponent implements ControlValueAccessor {
  @Input() cyiaFormGroup: CyiaFormGroup
  @Input() deep: number = 0
  @ViewChildren('controlEl', { read: ElementRef }) controlList: QueryList<ElementRef>
  @ViewChild('wrapper', { static: false }) set wrapper(val: ElementRef<HTMLDivElement>) {
    this.setLayout(val)
  }
  formGroup: FormGroup
  init = false
  private changeFn: Function = () => { };
  private touchedFn: Function = () => { };
  value
  @Input() service: CyiaFormGroupService
  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private injector: Injector
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.cyiaFormGroup && !this.init) {
      if (!this.deep) this.service = new CyiaFormGroupService()
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
      this.controlEventSubscribe()
      this.init = true
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
    }
    // else if (control instanceof CyiaFormArray) {
    //   return 'array'
    // }
  }
  valueChangeListener() {
    this.formGroup.valueChanges.subscribe((val) => {
      this.valueChange(val)
    })
  }
  /**
   * 其他控件发送事件时调用
   *
   * @author cyia
   * @date 2019-09-14
   */
  controlEventSubscribe() {
    if (this.deep) return
    this.service.event$.subscribe((e) => {
      let control: CyiaFormGroup | CyiaFormControl<any> = this.cyiaFormGroup
      try {
        e.target.forEach((key) => {
          control = (<CyiaFormGroup>control).getControl(key)
        })
        control[e.type] = e.value
      } catch (error) {
        console.warn('发生事件路径错误')
      }
    })
  }
  /**
   * 设置显示布局
   *
   * @author cyia
   * @date 2019-09-15
   * @param wrapper
   */
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
