import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
// import {  GetListBO, WhereCondition } from './group-payor.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { GetGroupPayorServiceBO } from './group-payor-service.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent,private ngxService:NgxUiLoaderService, ) {
    super();
  }
  public execute(state: GetGroupPayorServiceBO): void {
    this.getList(state).subscribe(x => super.next(x));
    this.ngxService.stop()
  }
 
  // getList(state?: GetGroupPayorServiceBO): Observable<DataStateChangeEventArgs> {
  //   return this.http.post<any>("api/GroupPayorServiceTable/getPayorTotalItem?", state)
  //     .pipe(map(
  //       (response: any) =>
  //         <any>{
  //           result: response['lList'],
  //           count: response['totalCount']
  //         }
  //     ))


  // }
  getList(state?: GetGroupPayorServiceBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/GroupPayorServiceTable/getPayorTotalItemFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['lList'],
            count: response['totalCount']
          }
      ))


  }
}
