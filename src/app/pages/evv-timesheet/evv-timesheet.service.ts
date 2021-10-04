import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../list/list.model';


@Injectable({
  providedIn: 'root'
})
export class EvvTimesheetService {

  constructor(public http:HttpClient,public errorService: ErrorService) { }

   //===============================get Client===============================//

   getClient(params: URLSearchParams): Observable<any> {
    let url = "api/Client/GetClientListbyTd?"
    return this.http.get<any>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
    //===============================get Employee===============================//
  getEmployee(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Client/GetEmpListbyType?"
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }

   //===============================get service===============================//

   getservice(params: URLSearchParams): Observable<[{ Key: number, Value: string }]> {
    let url = "api/Timesheet/GetServicedropdownByAgencyService?";
    return this.http.get<[{ Key: number, Value: string }]>(url + params, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
    //===============================Update Timesheet===============================//
    update(data): Observable<number> {
      let url = "api/EvvTimesheet/updateEvv";
      return this.http.post<number>(url ,data, { observe: 'response' }).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
      )
    }


     /////////////////////////////// delete All timesheet////////////////////////////////////////////////////////

  deleteTimesheetdata(value: any) {
    let url="api/EvvTimesheet/deleteEvv";   
    return this.http.post<any>(url, value, { observe: 'response' }).pipe(
      map(data => data.body),
      catchError(this.errorService.handleError)
    )
  }
  
  getcolumwidth():Observable<any>
  {
  console.log("service working")

  let url = "api/ColumnChange/getwidth?";
  return  this.http.get<any>(url,{observe :'response'}).pipe(
  map(data => data.body ),
  catchError(this.errorService.handleError)
  )
  }
savecolumwidth(list:ColumnChangeBO):Observable<any>
{
console.log("service working")

let url = "api/ColumnChange/Savewidth?";
return  this.http.post<number>(url,list,{observe :'response'}).pipe(
map(data => data.body ),
catchError(this.errorService.handleError)
)
}


}
