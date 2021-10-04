import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetCHListBo, WhereCondition } from './clearing-house.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent,private ngxService:NgxUiLoaderService,) {
    super();
  }
  public execute(state: GetCHListBo): void {
    this.getCareList(state).subscribe(x => super.next(x));
    this.ngxService.stop()
    
  }
 
  getCareList(state?: GetCHListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ClearingHouse/GetClearingHouseList?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['chList'],
            count: response['totalCount']
          }
      ))


  }
}
