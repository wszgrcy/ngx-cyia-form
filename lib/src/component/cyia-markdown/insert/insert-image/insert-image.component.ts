import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-insert-image',
  templateUrl: './insert-image.component.html',
  styleUrls: ['./insert-image.component.scss']
})
export class InsertImageComponent implements OnInit {
  formGroup: FormGroup
  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<InsertImageComponent>
  ) {
    this.formGroup = fb.group({
      'src': ['', [Validators.required]],
      alt: [''],
      title: ['']
    })
  }

  ngOnInit() {
  }
  onSubmit() {
    //![图片alt](图片地址 ''图片title'')
    this.dialogRef.close(`![${this.formGroup.value.alt}](${this.formGroup.value.src} '${this.formGroup.value.title}')`)
  }
  // onCancel() {
  //   this.dialogRef.close()
  // }
}
