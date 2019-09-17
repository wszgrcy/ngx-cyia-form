import { Component, OnInit, Input } from '@angular/core';
import { CyiaFormGroupService } from '../cyia-form-group/cyia-form-group.service';
import { CyiaFormGroup } from 'cyia-ngx-form';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

@Component({
  selector: 'app-cyia-form',
  templateUrl: './cyia-form.component.html',
  styleUrls: ['./cyia-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CyiaFormGroupService]
})
export class CyiaFormComponent implements OnInit {
  @Input() cyiaFormGroupList: CyiaFormGroup[] = []
  constructor() { }

  ngOnInit() {
  }

}
