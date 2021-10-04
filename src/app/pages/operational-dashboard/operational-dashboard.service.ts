
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
// import {Employee,PayorRequiredID ,PayRollInformation,PayRateUnit,OnboardList,returnonboard,zip,getEmployee } from './emloyee.model';
import { ErrorService } from 'src/app/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class OperationalService {
  constructor(private http: HttpClient,public errorService: ErrorService) { }


  //////////////////////get Onboard/////////////////////////////////////
  getOIGAnalysis():Observable<any>
  {
   let url = "api/Employee/GetOIGData?"
   return  this.http.get<any>(url ,{observe :'response'}).pipe(
     map(data => data.body ),
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
}
