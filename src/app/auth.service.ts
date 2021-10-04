import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from "@angular/router";
import { GlobalComponent } from './global/global.component';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { Observable } from 'rxjs'; // RXJS 6.0 >
// import {MyService} from './auth.service'
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from 'src/environments/environment';
@Injectable()

// @Injectable({
//   providedIn: 'root'
// })
export class AuthService {

    // url: string = "https://testapi.alltranssoftware.com:8444/";

//url: string = "https://sbnaapi.alltranssoftware.com:8443/API/api/"
//url: string = "https://adminapi.alltranssoftware.com:8443/API/api/"

// url: string = "https://sbnaapi.alltranssoftware.com:8444/API/api/"

// url: string = "http://sbnaapi.alltranssoftware.com/api/"
// url: string = "http://homecaretesting1.sbnasoftware.com/"

//  url: string ="http://192.168.101.149/api/"
 
// url: string ="http://localhost:60081/api/";
//  url: string ="http://192.168.101.149/api/";
  // url: string ="https://sbnaapi.alltranssoftware.com:8443/API/api/";
 //url:string= "https://allcare.azurewebsites.net/API/";
   url: string = "http://localhost:5000/";
//  url:string = environment.baseUrl;
 //url:string= "/API/";

  // url:String="http://digitalkendra.sbnasoftware.com/API/api/";
  // url:String="";

  jwtHelper: JwtHelper = new JwtHelper();

//   constructor(private router: Router,public global:GlobalComponent) {
//   }

//  intercept(request: HttpRequest<any>, next: HttpHandler, ):Observable<HttpEvent<any>> {

//      if (this.global.authtoken != null) {
//    if (this.jwtHelper.isTokenExpired(this.global.authtoken)) {
//      console.log("Authorization Expired.");
//      this.router.navigateByUrl("/login");
//    }
//  }

//    request = request.clone({
//      url: this.url + request.url,
//    setHeaders: {
//      Authorization: `Bearer ${this.global.authtoken}`
//    }
//    });
//    return next.handle(request)
   
   
//  }

 constructor(private router: Router,public global:GlobalComponent,private http:HttpClient) {
}

intercept(request: HttpRequest<any>, next: HttpHandler, ):Observable<HttpEvent<any>> {

   if (this.global.authtoken != null) {
// console.log(this.jwtHelper.getTokenExpirationDate(this.global.authtoken));

 if (this.jwtHelper.isTokenExpired(this.global.authtoken)) {
   console.log("Authorization Expired.");
   localStorage.clear();
   this.router.navigateByUrl("/login");
 }
}

 request = request.clone({
   url: this.url + request.url,    
 setHeaders: {
    // 'Content-Type': 'application/json; charset=utf-8',
   'Authorization': `Bearer ` + this.global.authtoken,
 }
 });

 
 return next.handle(request);
 
 
}
}
