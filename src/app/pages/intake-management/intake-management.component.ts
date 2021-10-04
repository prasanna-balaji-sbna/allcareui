import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intake-management',
  templateUrl: './intake-management.component.html',
  styleUrls: ['./intake-management.component.scss']
})
export class IntakeManagementComponent implements OnInit {

  constructor( private ref: ChangeDetectorRef) {

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
   }

  ngOnInit(): void {
  }

}
