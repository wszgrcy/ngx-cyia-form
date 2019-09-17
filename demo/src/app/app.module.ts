import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CyiaFormModule, CyiaFormControlModule, CyiaMarkdownModule } from 'cyia-ngx-form';
import { TestFormModule } from './test-form/test-form.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CyiaFormModule,
    TestFormModule,
    BrowserAnimationsModule,
    CyiaMarkdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
