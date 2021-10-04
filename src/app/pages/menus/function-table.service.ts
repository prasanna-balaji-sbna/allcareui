import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetSMListBo} from './menus.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
@Injectable()

export class GetFuncHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent) {
    super();
  }
  public execute(state: GetSMListBo): void {
    this.getFuncList(state).subscribe(x => super.next(x));
  }
 
  getFuncList(state?: GetSMListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/MenuFunctionality/getMeunuFunctionality?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['fList'],
            count: response['totalCount']
          }
      ))


  }
}
