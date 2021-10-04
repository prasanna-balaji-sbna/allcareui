import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {EditDetailsClient} from '../client-parent/client-parent.model';
@Component({
  selector: 'app-client-parent',
  templateUrl: './client-parent.component.html',
  styleUrls: ['./client-parent.component.scss']
})
export class ClientParentComponent implements OnInit {
  EditOptions:EditDetailsClient=new EditDetailsClient();
  EditData:boolean=false;
  isConsumer:boolean=false;
  constructor(private ref: ChangeDetectorRef) {
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
   }

  ngOnInit(): void {
  }
  dataEmitfromChild(event: EditDetailsClient) {
   // console.log("Incoming edit event",event);    
    this.EditData = event.isEdit;
    this.EditOptions = event;
    this.isConsumer=event.iscounsumer;
  }
}
