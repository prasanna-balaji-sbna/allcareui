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
import { Getbatchfile, getBatchFilter } from './batch.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()

export class GetHTTPServiceViewbatch extends Subject<DataStateChangeEventArgs>{

    batchData:any=[];
  constructor(private http: HttpClient,private ngxService: NgxUiLoaderService, public errorService: ErrorService, public global: GlobalComponent,public general:generalservice) {
    super();
  }
  public execute(state: Getbatchfile): void {
    this.getBatch(state).subscribe(x => super.next(x));
    this.ngxService.stop()

  }

  getBatch(state: Getbatchfile):Observable<DataStateChangeEventArgs> {

    let url = "api/BatchFile/GetBatchFile?";
    return this.http.post<any>("api/BatchFile/GetBatchFile", state)
        .map(
            (response: any) =>
              (<any>{
                result: response['batchList'],
                count: response['totalCount']
              }
          )).map((e:any)=>{
               console.log(e);
               
            // e.result.forEach(element => {
            //   this.batchData.push(element);
            // })
            return e;})
         
                       

    
}


  getbatchData()
  {
    return this.batchData;
  }
}
