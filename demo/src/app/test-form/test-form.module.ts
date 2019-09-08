import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestFormComponent } from './test-form.component';
import { CyiaFormControlModule } from 'cyia-ngx-form';

@NgModule({
  imports: [
    CommonModule,
    CyiaFormControlModule
  ],
  declarations: [TestFormComponent],
  exports: [TestFormComponent]
})
export class TestFormModule { }
