import { Injectable } from '@angular/core';
import { IMyDpOptions,IMyDateModel, IMyInputFieldChanged} from 'mydatepicker';
// import { EmployeeRecordCreateComponent } from '../pages/employee-record-create/employee-record-create.component';
@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(
    // private employee:EmployeeRecordCreateComponent
    ) { }
  inputFeildchange(event: IMyInputFieldChanged) {
   // console.log(event);
    let value = event.value;   
    //console.log(value);
    if (value.length == 5 && value.substring(2, 3) != '/') {
    //  console.log(value)
    //  console.log(value.substring(2, 3))
      return value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
    
  }
  Datechange(event: IMyDateModel) {
    //console.log(event);
    return  event.formatted;
   
   
  }
  newone()
  {
  //  console.log("Before Call getEmployeeDetail");
    // this.employee.getEmployeeDetail();
  }
}
