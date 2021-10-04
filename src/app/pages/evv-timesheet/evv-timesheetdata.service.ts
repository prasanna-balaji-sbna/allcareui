import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { gettimesheetBO } from './evv-timesheet.model';
@Injectable()
export class EvvTimesheetdataService extends Subject<DataStateChangeEventArgs>{
  

 
  constructor(private http: HttpClient,public global: GlobalComponent,public general:generalservice,private ngxService: NgxUiLoaderService,
    private datepipe: DatePipe) {
    super();
  }
  public execute(state: gettimesheetBO): void {
    this.getList(state).subscribe(x => super.next(x ));
    this.ngxService.stop()
  }
  getList(state?: gettimesheetBO): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/EvvTimesheet/GetEvvTimesheet", state)
.map(
        (response: any) =>(<any>{
            result: response['timesheet'],
            count: response['total']
          }))
          .map((e:any)=>{
           //console.log(e)
            e.result.forEach(element => {
              
              element.isCliSignature=element.isCliSignature==true?"Yes":"No",
              element.isEmpSignature= element.isEmpSignature==true?"Yes":"No"
              // element.starttime=this.datepipe.transform(element.starttime, "HH:mm:ss");
              // element.endtime=this.datepipe.transform(element.endtime, "HH:mm:ss");
            })
           //console.log(e)
            return e;})


  }
}
