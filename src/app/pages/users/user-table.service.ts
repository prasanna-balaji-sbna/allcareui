import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetUserListBo, WhereCondition } from './users.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent, public general:generalservice) {
    super();
  }
  public execute(state: GetUserListBo): void {
    this.getCareList(state).subscribe(x => super.next(x));
  }
 
  getCareList(state?: GetUserListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/User/GetuserItem?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['uList'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
            e.result.forEach(element => {
              element.phone1 =element.phone1!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone1):null;
              element.phone2 =element.phone2!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone2):null;
            })
           
            return e;})


  }
}
