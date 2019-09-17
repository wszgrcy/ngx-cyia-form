import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaFormGroupComponent } from './cyia-form-group.component';
import { CyiaFormControlModule } from '../cyia-form-control/cyia-form-control.module';
import { CyiaFormControlComponent } from '../cyia-form-control/cyia-form-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormGroupService } from './cyia-form-group.service';

@NgModule({
  imports: [
    CommonModule,
    CyiaFormControlModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CyiaFormGroupComponent],
  exports: [CyiaFormGroupComponent],
  // providers:[CyiaFormGroupService]
})
export class CyiaFormGroupModule { }
