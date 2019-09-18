import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { InsertUrlComponent } from './insert-url.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  declarations: [InsertUrlComponent],
  exports: [InsertUrlComponent,MatDialogModule],
  entryComponents: [InsertUrlComponent]
})
export class InsertUrlModule { }
