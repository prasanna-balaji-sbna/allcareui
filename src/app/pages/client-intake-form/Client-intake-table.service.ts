import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
// import { DischargeCodeDetailBO, functionpermission, GetListBO, WhereCondition } from './dccodes.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { getIntakeBO } from './client-intake-form.model';
import { generalservice } from 'src/app/services/general.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()

export class GetHTTPIntakeService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService,private ngxService:NgxUiLoaderService,private datepipe: DatePipe, public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: getIntakeBO): void {
    this.getList(state).subscribe(x => super.next(x));
    this.ngxService.stop()
  }
 
  getList(state?: getIntakeBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/IntakeApproval/getpendinglistFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['intakePendingList'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          element.phone =element.phone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone):null;
         
        })
        return e;})


  }
  public executeApprove(state: getIntakeBO): void {
    this.getApprove(state).subscribe(x => super.next(x));
    this.ngxService.stop()

  }
 
  getApprove(state?: getIntakeBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/IntakeApproval/getapprovedlistFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['intakeApprovalList'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          element.phone =element.phone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone):null;
         
        })
        return e;})


  }
  public executeReject(state: getIntakeBO): void {
    this.getReject(state).subscribe(x => super.next(x));
    this.ngxService.stop()

  }
 
  getReject(state?: getIntakeBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/IntakeApproval/getrejectedlistFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['intakeRejList'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          element.phone =element.phone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone):null;
         
        })
        return e;})


  }
}
