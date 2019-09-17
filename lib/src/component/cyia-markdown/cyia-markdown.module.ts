import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CyiaMarkdownComponent } from './cyia-markdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSliderModule
  ],
  declarations: [CyiaMarkdownComponent],
  entryComponents: [CyiaMarkdownComponent],
  exports: [CyiaMarkdownComponent]
})
export class CyiaMarkdownModule {
  entry = CyiaMarkdownComponent
}
