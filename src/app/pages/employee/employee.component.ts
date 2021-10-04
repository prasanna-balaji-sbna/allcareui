import { Component, OnInit,ViewChild,Input, ChangeDetectorRef } from '@angular/core';
import {EmployeeListComponent} from './employee-list/employee-list.component';
import {EmployeeEditComponent} from './employee-edit/employee-edit.component';
import { IsViewEdit,Employee } from './emloyee.model';
import { GlobalComponent } from 'src/app/global/global.component';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent  {
  /////////////////////////////////////////////// Event Emitter variable ////////////////////////////////////
  Employee:Employee; 
  ViewEdit: IsViewEdit = new IsViewEdit();
  isEdit: boolean = false;
  constructor( private ref: ChangeDetectorRef,private global:GlobalComponent) { 
    
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
  }
  ngOnInit() {
   
   
    if( this.global.globalemployee!=0)
    {
      this.isEdit=true;
      console.log( this.global.globalemployee)
      this.ViewEdit = { isView: false, isEdit: true, isEditEmployee: true , editEmployee:this.global.globalemployee,Employeedata:this.global.globalemployeedata };
    }
    else
    {
      this.ViewEdit ={ isView: true, isEdit: true, isEditEmployee: false , editEmployee:0,Employeedata:new  Employee() }
    }
  }

 
  dataEmitfromChild(event: IsViewEdit) {
    //console.log(event)
    this.isEdit = event.isEdit;
    this.ViewEdit = event;
  }

}
