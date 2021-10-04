import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { filters, sortingObj, SaveTimeSheet, returnTimesheet,TimesheetreturnBO } from './timesheet.model';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { PayrollexcelBO, timesheetClientAuthBO, ClientBO1, PayrollId, UpdatepaydateBO } from './timesheetnew.model';
import { StatusList } from '../agency/agency.model';
import { EmployeeList, PayorList } from '../batch/batch.model';
import { ColumnChangeBO } from '../icd10/icd10.model';

@Injectable({
   providedIn: 'root'
})
export class TimesheetnewService {

   constructor(private http: HttpClient, public errorService: ErrorService) { }
   ///


   getExcelData(paramsData: URLSearchParams): Observable<PayrollexcelBO[]> {

      let url = "api/Payroll/getExceldata?"


      return this.http.get<PayrollexcelBO[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }

   getAuthoizationDetails(paramsData: URLSearchParams): Observable<timesheetClientAuthBO[]> {

      let url = "api/Timesheet/FilteracctoStartdate?";


      return this.http.get<timesheetClientAuthBO[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }

   getstatus(paramsData: URLSearchParams): Observable<StatusList[]> {

      let url = "api/LOV/LovDropDownBatch?"


      return this.http.get<StatusList[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }

   getEmployeeList(paramsData: URLSearchParams): Observable<EmployeeList[]> {

      let url = "api/Client/GetEmpListbyId?"


      return this.http.get<EmployeeList[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }

   getClientList(paramsData: URLSearchParams): Observable<ClientBO1[]> {

      let url = "api/Client/GetClientListbyTd?"


      return this.http.get<ClientBO1[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }
   getPayorList(paramsData: URLSearchParams): Observable<PayorList[]> {

      let url = "api/GroupPayor/CommonGetGPList?";


      return this.http.get<PayorList[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }
   saveupdate(saveList: PayrollexcelBO): Observable<PayrollexcelBO> {

      let url = "api/Agency/SaveAgency";

      return this.http.post<PayrollexcelBO>(url, saveList, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)
      )
   }

   UnLockStatus(saveList: PayrollId): Observable<number> {

      let url = "api/Payroll/UnLockPayroll?PayrollId=" + saveList.PayrollId;

      return this.http.post<number>(url, '', { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)
      )
   }
   confirmLockStatus(saveList: PayrollId): Observable<number> {

      let url = "api/Payroll/LockPayroll?PayrollId=" + saveList.PayrollId;

      return this.http.post<number>(url, '', { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)
      )
   }
   UpdatePaydate(saveList:UpdatepaydateBO): Observable<number> {
    //  console.log("savelist=============", saveList);

      let url = "api/Payroll/UpdatePaydate?";

      return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)
      )

   }

   
   UpdateTimesheet(saveList): Observable<number> {

      let url =  "api/Payroll/UpdatePayroll";

      return this.http.post<number>(url, saveList, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)
      )
   }
   getpdfData(paramsData: URLSearchParams): Observable<PayrollexcelBO[]> {

      let url = "api/Payroll/getPayrollReport?"


      return this.http.get<PayrollexcelBO[]>(url + paramsData, { observe: 'response' }).pipe(
         map(data => data.body),
         catchError(this.errorService.handleError)

      )
   }

   getcolumwidth():Observable<any>
   {
 //  console.log("service working")

   let url = "api/ColumnChange/getwidth?";
   return  this.http.get<any>(url,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
   }
   savecolumwidth(list:ColumnChangeBO):Observable<any>
   {
 //  console.log("service working")

   let url = "api/ColumnChange/Savewidth?";
   return  this.http.post<number>(url,list,{observe :'response'}).pipe(
   map(data => data.body ),
   catchError(this.errorService.handleError)
   )
   }

}