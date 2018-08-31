import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CyiaFormModule } from 'ngx-form';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CyiaFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
