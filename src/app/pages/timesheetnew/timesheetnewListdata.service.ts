import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
import { DatePipe } from '@angular/common';
import { GetPayrollBO } from './timesheetnew.model';
// import {  } from './timesheetnew.model';

@Injectable()

export class payrollservice extends Subject<DataStateChangeEventArgs>{
    originaldata: any = [];
    childData: any = [];
    
  public details: any = [];
  errorlist: any= [];
  serialno: any;
    constructor(private http: HttpClient, public global: GlobalComponent, public general: generalservice, public datePipe: DatePipe) {
        super();

    }
    public execute(state: GetPayrollBO): void {
        this.getList(state).subscribe(x => super.next(x));
    }

    getList(state?: GetPayrollBO): Observable<DataStateChangeEventArgs> {

        
        return  this.http.post<any>("api/Payroll/getPayrollunlockedFilter", state)
            .map(
                (response: any) => (<any>{
                    result: response['timesheetlist'],
                    count: response['totalCount']
                })).map((e: any) => {
                 //   console.log(e.totalCount)
                    e.result = this.setdata(e);
                //    console.log(e)

                    return e;
                })


                
    }

    setdata1(data) {
        let parentArray = [];
        let childArray = [];
       // console.log(data.result)
        let objArray: any = [];
      let objArray1: any = [];

      // this.parentData
      if (data.length != 0) {
          this.originaldata= data
    
      }

      
       
        return this.originaldata;
    }

    setdata(data) {
        let parentArray = [];
        let childArray = [];
     //   console.log(data.result)
        
        this.originaldata= data.result;
            let objArray: any = [];
            if (data.result.length != 0) {
         
   
       data.result.forEach(element => {
         let obj =
         {
           'id':element.id,
           'employeeID': element.employeeID,
          'employeeName':element.employeeName,
          'clientID': element.clientID,
         'clientName':element.clientName,
          'islocked':element.islocked,
          'lockStatus':element.islocked==false?"No":"Yes",
          'payDate':element.payDate!=null?this.datePipe.transform(element.payDate, "MM/dd/yyyy"):null,
          'payrollId':element.id,
          'totalAmount':element.totalAmount,
          'bit':0,
          'totalWorkedHrs':element.totalWorkedHrs         
         }
      //   console.log( element.payrollLineDetails,"payrollline");
       
         element.payrollLineDetails.forEach(element1 => {
           let obj1 =
         {
           'id':element1.id,
           'payrollId':element1.payrollId,
           'clientId':element1.clientId,
           'paydate':element.payDate,
           'islocked':element.islocked,
           //'employeeID': element.payroll[0].employeeID,
           'clientName':element1.clientName,
           'masterServiceId': element1.masterServiceId,
           'timesheetDate':this.datePipe.transform(element1.timesheetDate, "MM/dd/yyyy"),
           'serviceCode':  element1.serviceCode,
           "payablehrs": element1.payablehrs,
           'totalHours': element1.totalhrs,
           'notes': element1.notes,
           'employeeServicePayrate': element1.employeeServicePayrate,
           'timesheetId':element1.timesheetId,
           'payRateLid':element1.payRateLid
  
         }
         childArray.push(obj1);
         });
         
    //   console.log(childArray);
         parentArray.push(obj);
       });
  //     console.log(parentArray);
    //    this.parentData=parentArray;
       this.childData=childArray;
           }

       
        else {
            parentArray = []
            this.childData = [];
        }
        return parentArray;
    }

   
    getChildData(){
        return this.childData;

    }
  
getwholeData(){
  return this.originaldata;
}
}
