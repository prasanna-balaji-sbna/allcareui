import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { importBO } from './reports.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class reportdata extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: importBO): void {
    this.getList(state).subscribe(x => super.next(x ));
  }
 
  getList(state?: importBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Import/Getspendown", state)
.map(
        (response: any) =>(<any>{
          idList: response['selectAll'],
            result: response['spendown'],
            count: response['totalCount']
          }))


  }
}
