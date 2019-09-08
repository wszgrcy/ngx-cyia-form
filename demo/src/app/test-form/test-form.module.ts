import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestFormComponent } from './test-form.component';
import { CyiaFormControlModule, CyiaFormGroupModule } from 'cyia-ngx-form';

@NgModule({
  imports: [
    CommonModule,
    CyiaFormControlModule,
    CyiaFormGroupModule
  ],
  declarations: [TestFormComponent],
  exports: [TestFormComponent]
})
export class TestFormModule { }
