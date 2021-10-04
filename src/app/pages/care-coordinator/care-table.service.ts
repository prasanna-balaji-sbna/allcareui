import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { careCordinatorList, functionpermission, GetCareListBo, WhereCondition } from './care-coordinator.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService,private ngxService: NgxUiLoaderService, public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: GetCareListBo): void {
    this.getCareList(state).subscribe(x => super.next(x));
    this.ngxService.stop()
  }
 
  getCareList(state?: GetCareListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/CareCoordinator/GetCareCoordinatorListFilter?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['cList'],
            count: response['totalCount']
          })).map((e:any)=>{
           
            e.result.forEach(element => {
              element.telephone =element.telephone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.telephone):null;
               element.fax=element.fax!=null?this.general.reconverPhoneGoogleLibhttpsave(element.fax):null;
               element.alternate_Fax=element.alternate_Fax!=null?this.general.reconverPhoneGoogleLibhttpsave(element.alternate_Fax):null;
            })
           
            return e;})


  }
}
