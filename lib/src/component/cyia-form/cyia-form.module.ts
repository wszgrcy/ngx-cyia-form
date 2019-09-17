import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFormComponent } from './cyia-form.component';
import { CyiaFormGroupModule } from '../cyia-form-group/cyia-form-group.module';

@NgModule({
  imports: [
    CommonModule,
    CyiaFormGroupModule
  ],
  declarations: [CyiaFormComponent]
})
export class CyiaFormModule { }
