import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { exceededhourBO } from './employee-report.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class GetEmployeeReprtservice extends Subject<DataStateChangeEventArgs>{
  monthlist:any=[]
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: exceededhourBO,type,month): void {
    this.monthlist=month
    if(type=="UMPI")
    {
      this.getList(state).subscribe(x => super.next(x ));
    }
    else
    {
      this.getExceedList(state).subscribe(x => super.next(x ));
    }
  }
 
  getList(state?: exceededhourBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Employee/Getpendingumpifilter", state)
.map(
        (response: any) =>(<any>{
            result: response['employeelst'],
            count: response['employeeTotal']
          })).map((e:any)=>{
           
            e.result.forEach(element => {
               element.phone1=element.phone1!=null?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
            })
           //console.log(e)
            return e;})


  }
  getExceedList(state?: exceededhourBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Employee/GetEmployeeExceedHoursfilter", state)
.map(
        (response: any) =>(<any>{
            result: response['employeelst'],
            count: response['employeeTotal']
          })).map((e:any)=>{
           if(e.result!=null)
           {
            e.result.forEach(element => {
              element.phone1=element.phone1!=null?this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null
              element.month=this.monthlist.filter(m=>m.value==new Date().getMonth()+1)[0].label
              
           })
           }
          
           //console.log(e)
            return e;})


  }
}