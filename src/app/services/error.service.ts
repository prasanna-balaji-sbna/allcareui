import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(public toastrService: ToastrService) { }

  handleError(error: HttpErrorResponse) {
   
    
      console.error("==========error occured =======",error);
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
      console.error("==========error errorMessage =======",errorMessage);
   //   alert(errorMessage);
    //   this.toastrService.error(errorMessage);
    //   setTimeout(() => {
    //     this.toastrService.clear();
    // },8000);
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error("==========error errorMessage =======",errorMessage);
    //  alert(errorMessage);
    //   this.toastrService.success(errorMessage);
    //   setTimeout(() => {
    //     this.toastrService.clear();
    // },8000);
    }
    // this.toastrService.success('Something went wrong!', errorMessage);
    return throwError(error);
  }
}
