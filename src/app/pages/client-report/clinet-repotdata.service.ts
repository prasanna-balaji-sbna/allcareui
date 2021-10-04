import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { gettimesheetBO } from './client-report-modal';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class GetclientReport extends Subject<DataStateChangeEventArgs>{
  
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: gettimesheetBO,): void {
  
  
      this.getList(state).subscribe(x => super.next(x ));
  
  }
 
  getList(state?: gettimesheetBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Client/getExpiredSAListnew", state)
.map(
        (response: any) =>(<any>{
            result: response['clientReport'],
            count: response['totalCount']
          })).map((e:any)=>{
           
          
           //console.log(e)
            return e;})


  }
  
}