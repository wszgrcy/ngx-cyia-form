import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-insert-image',
  templateUrl: './insert-image.component.html',
  styleUrls: ['./insert-image.component.scss']
})
export class InsertUrlComponent implements OnInit {
  formGroup: FormGroup
  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<InsertUrlComponent>
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
    //[超链接名](超链接地址 "超链接title")
    this.dialogRef.close(`[${this.formGroup.value.alt}](${this.formGroup.value.src} '${this.formGroup.value.title}')`)
  }
  // onCancel() {
  //   this.dialogRef.close()
  // }
}
