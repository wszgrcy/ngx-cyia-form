import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestFormComponent } from './test-form.component';
import { CyiaFormControlModule, CyiaFormGroupModule, CyiaMarkdownModule } from 'cyia-ngx-form';

@NgModule({
  imports: [
    CommonModule,
    CyiaFormControlModule,
    CyiaFormGroupModule,
    CyiaMarkdownModule
  ],
  declarations: [TestFormComponent],
  exports: [TestFormComponent]
})
export class TestFormModule { }
