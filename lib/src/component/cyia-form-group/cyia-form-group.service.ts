import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CyiaFormControlChange } from '../../type/change-type.type';

// @Injectable()
export class CyiaFormGroupService {
  event$ = new Subject<CyiaFormControlChange>()
  constructor() {
    console.log('构造')
  }

}
