import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { getEmployee, GetpayeridBO, GetpayrateBO } from './emloyee.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class GetEmployeeservice extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: getEmployee): void {
    this.getList(state).subscribe(x => super.next(x ));
  }
  public executepayrate(state: GetpayrateBO): void {
    this.getListPayrate(state).subscribe(x => super.next(x ));
  }

  public executepayerId(state: GetpayeridBO): void {
    this.getListPayerID(state).subscribe(x => super.next(x ));
  }
  getList(state?: getEmployee): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Employee/getEmployeeFilter", state)
.map(
        (response: any) =>(<any>{
            result: response['employeelst'],
            count: response['employeeTotal']
          })).map((e:any)=>{
           //console.log(e)
            e.result.forEach(element => {
              
              element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
               element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
           //console.log(e)
            return e;})


  }

  getListPayrate(state?: GetpayrateBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/PayRateUnit/GetPayRateUnitList", state)
.map(
        (response: any) =>(<any>{
            result: response['returnBo'],
            count: response['totalCount']
          }))


  }


getListPayerID(state?: GetpayeridBO): Observable<DataStateChangeEventArgs> {
  return this.http.post<any>("api/PayorRequiredID/GetPayorRequiredIDList", state)
.map(
      (response: any) =>(<any>{
          result: response['returnBO'],
          count: response['totalCount']
        })).map((e:any)=>{
         //console.log(e)
          e.result.forEach(element => {
            
            // element.phone2 =(element.phone2!=null&&element.phone2!="")? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
            //  element.phone1=(element.phone1!=null&&element.phone1!="")?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
          })
         //console.log(e)
          return e;})


}
}
   
