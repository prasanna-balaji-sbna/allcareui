import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
// import { Listlst, functionpermission, GetListBO, WhereCondition } from './list.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { GetAgencyBO } from './agency.model';
import { generalservice } from 'src/app/services/general.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPServiceAgency extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent,public general:generalservice,private ngxService: NgxUiLoaderService) {
    super();
  }
  public execute(state: GetAgencyBO): void {
    this.getAgencyList(state).subscribe(x => super.next(x)
    );
  this.ngxService.stop()

  }
 
  getAgencyList(state?: GetAgencyBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/Agency/GetAgencyListFilterNew", state)
      .map(
        (response: any) =>
          (<any>{
            result: response['alist'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          element.phone =element.phone!=null? this.general.reconverPhoneGoogleLibhttpsave(element.phone):null;
        })
        return e;})
     
                   
        

  }
}
