import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetMSListBo, WhereCondition } from './manage.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent) {
    super();
  }
  public execute(state: GetMSListBo): void {
    this.getCareList(state).subscribe(x => super.next(x));
  }
 
  getCareList(state?: GetMSListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/MasterService/GetMasterServiceListFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['msList'],
            count: response['totalCount']
          }
      ))


  }
}
