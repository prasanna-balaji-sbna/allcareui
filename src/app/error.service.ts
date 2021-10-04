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
   // console.log("err response",error);
    
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
      // this.toastrService.error('error')
    } else {
      // Server-side errors
      errorMessage = `Message: ${error.error}`;
      // this.toastrService.error('error')

    }
    // this.toastrService.success('Something went wrong!', errorMessage);
    return throwError(errorMessage);
  }
}
