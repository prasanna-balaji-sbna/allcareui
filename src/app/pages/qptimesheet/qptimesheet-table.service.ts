import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { gettimesheet } from './qptimesheet.model';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs, endEdit } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';

import { generalservice } from 'src/app/services/general.service';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()

export class QPtimesheetdataservice extends Subject<DataStateChangeEventArgs>{
    childdata: any = [];
    timelst: any = [];
    constructor(private http: HttpClient, public global: GlobalComponent,private ngxService: NgxUiLoaderService, public general: generalservice, public datePipe: DatePipe) {
        super();

    }
    public execute(state: gettimesheet): void {
        this.getList(state).subscribe(x => super.next(x));
    this.ngxService.stop()

    }

    getList(state?: gettimesheet): Observable<DataStateChangeEventArgs> {
        return this.http.post<any>("api/Timesheet/GetQpTimesheet", state)
            .map(
                (response: any) => (<any>{
                    result: response['qpTimesheet'],
                    count: response['timesheetTotal']
                }))
    }

    // setdata(data) {
    //     let parentArray = [];
    //     let childArray = [];
    //    // console.log(data.result)
    //     if (data.result.length != 0) {
    //         data.result.forEach(element => {
    //             if (element.timesheet.length != 0) {

    //                 //  let data=e.result
    //                 //parentData
    //                 // resultdata.timesheetdata.forEach(element => {
    //                 let obj =
    //                 {
    //                     'clientName': element.timesheet[0].clientName,


    //                     'fromDate': this.datePipe.transform(element.timesheet.reduce(function (res, obj) {
    //                         return (new Date(obj.timesheetDate).getTime() < new Date(res.timesheetDate).getTime()) ? obj : res;
    //                     }).timesheetDate, "MM/dd/yyyy"),
    //                     'toDate': this.datePipe.transform(element.timesheet.reduce(function (res, obj) {
    //                         return (new Date(obj.timesheetDate).getTime() > new Date(res.timesheetDate).getTime()) ? obj : res;
    //                     }).timesheetDate, "MM/dd/yyyy"),
    //                     'isCliSignature': element.timesheet[0].isCliSignature == true ? 'YES' : 'NO',
    //                     'isEmpSignature': element.timesheet[0].isEmpSignature == true ? 'YES' : 'NO',
    //                     'eTimesheet': element.timesheet[0].etimesheet == true ? 'YES' : 'NO',
    //                     'EmployeeName': element.timesheet[0].employeeName,
    //                     'timesheetStatusLid': element.timesheet[0].timesheetStatus != null ? element.timesheet[0].timesheetStatus : "",
    //                     'serialNo': element.serialNumber,
    //                     'service': element.timesheet[0].masterCode,
    //                     'totalHours': element.timesheet[0].totalHours,
    //                     'timesheetDate': this.datePipe.transform(element.timesheetDate, "MM/dd/yyyy"),
    //                     "payer": element.payerName,
    //                     'notes': element.timesheetNotes,
    //                     'timeSheetId': element.id,
    //                     // 'timesheetStatusLid': element.timesheetStatus != null ? element.timesheetStatus : "",
    //                     'clientId': element.timesheet[0].clientId,
    //                     'employeeId': element.timesheet[0].employeeId
    //                 }
    //                 parentArray.push(obj);

    //                 element.timesheet.forEach(element => {
    //                     let obj1 =
    //                     {


    //                         'timesheetDate': this.datePipe.transform(element.timesheetDate, "MM/dd/yyyy"),
    //                         "payer": element.payerName,
    //                         'notes': element.timesheetNotes,
    //                         'timeSheetId': element.id,
    //                         'timesheetStatusLid': element.timesheetStatus != null ? element.timesheetStatus : "",
    //                         'serialNo': element.serialNumber,
    //                         'service': element.masterCode,
    //                         'totalHours': element.totalHours,
    //                     }
    //                     childArray.push(obj1);
    //                     //   });




    //                 });
    //                 this.childdata = childArray;

    //                 //console.log("child array service", this.childdata)
    //             }
    //             else {
    //                 parentArray = [];
    //                 this.childdata = [];
    //             }
    //         });
    //     }
    //     else {
    //         parentArray = []
    //     }
    //     return parentArray;
    // }
    // getchilddata() {
    //     return this.childdata;
    // }
}
