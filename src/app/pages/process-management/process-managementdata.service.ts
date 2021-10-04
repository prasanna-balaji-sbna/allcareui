import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetPMListBo } from './process-management.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: GetPMListBo): void {
    this.getCareList(state).subscribe(x => super.next(x));
  }
 
  getCareList(state?: GetPMListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/ProcessManagement/getProcess?", state)
    .pipe(map(
        (response: any) =>
          <any>{
            result: response['pmList'],
            count: response['totalCount']
          }))
  }
}
