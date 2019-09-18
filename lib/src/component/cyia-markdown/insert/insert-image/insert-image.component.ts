import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageValidator } from '../../../../validator';

@Component({
  selector: 'app-insert-image',
  templateUrl: './insert-image.component.html',
  styleUrls: ['./insert-image.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsertImageComponent implements OnInit {
  formGroup: FormGroup
  srcFC: FormControl
  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<InsertImageComponent>
  ) {
    this.srcFC = new FormControl('', [Validators.required, ImageValidator()])
    this.formGroup = fb.group({
      'src': this.srcFC,
      alt: [''],
      title: ['']
    })
  }

  ngOnInit() {
    // this.srcFC.valueChanges.subscribe(() => {
    //   !this.srcFC.touched && this.srcFC.markAsTouched()
    // })

  }
  onSubmit() {
    console.log(this.formGroup)
    //![图片alt](图片地址 ''图片title'')
    this.dialogRef.close(`![${this.formGroup.value.alt}](${this.formGroup.value.src} '${this.formGroup.value.title}')`)
  }
  // onCancel() {
  //   this.dialogRef.close()
  // }
  // error(key: string) {
  //   console.log((<FormControl>this.formGroup.controls[key]))
  //   Object.values((<FormControl>this.formGroup.controls[key]).errors || {})[0]
  // }
}
