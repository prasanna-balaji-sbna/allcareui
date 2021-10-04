import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { resetBO } from './forgotpassword.model';
import { ErrorService } from 'src/app/services/error.service';


@Injectable()
export class forgotpasswordHTTPService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }

    resetPassword(saveList :resetBO):Observable<any>
    {
       // console.log("service working")
        let url = "api/Login/ForgetPassword?";
         return  this.http.post<any>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }

}