import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import {  getServiceEvalBO } from './service-evaluation.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, private ngxService: NgxUiLoaderService,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: getServiceEvalBO): void {
    this.getList(state).subscribe(x => super.next(x)

    );
    this.ngxService.stop()

  }
 
  getList(state?: getServiceEvalBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ServiceEvaluation/GetServiceFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['listcli1'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          element.phone =element.phone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone):null;
          element.firstName=element.lastName +"," +element.firstName
          if( element.isAnsweredCall!=null)
          {
            if(element.isAnsweredCall)
            {
              element.isAnsweredCall='Yes'
            }
            else
            {
              element.isAnsweredCall='No'
            }
          }
          else
          {
            element.isPCAPresent=null;
          }
          if( element.isPCAPresent!=null)
          {
            if(element.isPCAPresent)
            {
              element.isPCAPresent='Yes'
            }
            else
            {
              element.isPCAPresent='No'
            }
          }
          else
          {
            element.isPCAPresent=null;
          }
        
          console.log(element.isAnsweredCall);
         
          if (element.reviewDate == "0001-01-01T00:00:00") {
            element.reviewDate = "";
            
          }
        })
        return e;})


  }
}
