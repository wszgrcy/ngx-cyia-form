import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UrlValidator } from '../../../../validator';

@Component({
  selector: 'app-insert-url',
  templateUrl: './insert-url.component.html',
  styleUrls: ['./insert-url.component.scss']
})
export class InsertUrlComponent implements OnInit {
  formGroup: FormGroup
  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<InsertUrlComponent>
  ) {
    this.formGroup = fb.group({
      'src': ['', [Validators.required, UrlValidator()]],
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
