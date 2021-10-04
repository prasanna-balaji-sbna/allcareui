import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { resetBO, updatepassBO } from './resetpassword.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class resetpasswordHTTPService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }

    resendPassword(saveList :resetBO):Observable<any>
    {
        console.log("service working")
        let url = "api/Login/ForgetPassword?";
         return  this.http.post<any>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

    resetPassword(saveList :updatepassBO):Observable<any>
    {
        console.log("service working")
        let url = "api/Login/ChangePassword?";
         return  this.http.post<any>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

}