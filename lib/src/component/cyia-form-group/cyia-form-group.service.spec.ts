/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CyiaFormGroupService } from './cyia-form-group.service';

describe('Service: CyiaFormGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CyiaFormGroupService]
    });
  });

  it('should ...', inject([CyiaFormGroupService], (service: CyiaFormGroupService) => {
    expect(service).toBeTruthy();
  }));
});
