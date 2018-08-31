import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CyiaFormService } from './form/form.service';

@NgModule({
    declarations: [],
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [CyiaFormService],
})
export class CyiaFormModule { }