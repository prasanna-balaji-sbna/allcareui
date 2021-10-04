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
import { generalservice } from 'src/app/services/general.service';
import { getBatchFilter } from './batch.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPServiceBatchActive extends Subject<DataStateChangeEventArgs>{

  Alldata:any=[];
  claimWithoutBatch:any=[]
  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService, public errorService: ErrorService, public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: getBatchFilter): void {
    this.getActiveClaimWithoutBatchFun(state).subscribe(x => super.next(x));
    this.ngxService.stop()

  }

//   public executebatch(state: getBatchFilter): void {
//     this.getActiveClaimWithoutBatchFun(state).subscribe(x => super.next(x))
//     this.ngxService.stop()
//     ;
//   }
 
  getClaimWithoutBatch(state?: getBatchFilter): Observable<DataStateChangeEventArgs> {
    this.claimWithoutBatch=[];
    return this.http.post<any>("api/ClaimMaster/getBillingClaimWithoutBatch", state)
      .map(
        (response: any) =>
          (<any>{
            result: response['batchlist'],
            count: response['totalCount']
          }
      )).map((e:any)=>{
           
        e.result.forEach(element => {
          this.claimWithoutBatch.push(element);
        })
        return e;})
     
                   
        

  }


  getActiveClaimWithoutBatchFun(state?: getBatchFilter): Observable<DataStateChangeEventArgs> {
    this.Alldata=[];
   //console.log("rtyryt",state);
    
    return this.http.post<any>("api/ClaimMaster/getActiveClaimWithoutBatchNew", state)
      .map(
        (response: any) =>
          (<any>{
            result: response['batchlist'],
            count: response['totalCount'],
            idList: response['allData'],
            
          }
      )).map((e:any)=>{
        return e;
      });
     
                   
        

  }
setdata(data)
{
  this.Alldata=data.allData;
}
  getClaimdata()
  {
    return this.Alldata;
  }
}
