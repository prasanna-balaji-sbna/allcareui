import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { UserList, DropList, DropList1, functionpermission, GetUserListBo } from './users.model';
import { ErrorService } from 'src/app/services/error.service';
import { ColumnChangeBO } from '../list/list.model';

@Injectable()
export class UsersHttpService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }
    getUserList():Observable<UserList[]>
    {
        console.log("service working")

        let url = "api/User/GetUser";
        return  this.http.get<UserList[]>(url,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }
    
    gettoltaliteam(paramsData:GetUserListBo):Observable<UserList[]>
    {
        console.log("service working")

        let url = "api/User/GetuserItem?";
        return  this.http.post<UserList[]>(url,paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
      
        )
    }

    gettotalCount(paramsData:URLSearchParams):Observable<number>
    {
        console.log("service working")

        let url = "api/User/user_Count?";
        return  this.http.get<number>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    getDropList( paramsData:URLSearchParams):Observable<DropList1[]>
    {
        console.log("service working")

        let url = "api/LOV/getLovDropDown?";
        return  this.http.get<DropList1[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getUserRole( paramsData:URLSearchParams):Observable<DropList[]>
    {
        console.log("service working")

        let url = "api/LoginRole/getRole?";
        return  this.http.get<DropList[]>(url + paramsData ,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }
    
    getUserDropList( paramsData:URLSearchParams):Observable<DropList[]>
    {
        console.log("service working")

        let url = "api/User/GetUserDropDown?";
        return  this.http.get<DropList[]>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    getFilePermissions(paramsData:URLSearchParams):Observable<functionpermission>
    {
    let url="api/functionpermisssion/getfunctionpermission?";
    return  this.http.get<functionpermission>(url + paramsData,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    saveupdateUser(saveList :UserList):Observable<number>
    {
        const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
            }),
          };
        console.log("service working")
        let url = "api/User/SaveUser";
         return  this.http.post<number>(url ,saveList, {observe:'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }
    
    updateUser(paramsData: UserList):Observable<number>
    {
        const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
            }),
            // observe:'response'
          };
        console.log("service working")
        let url = "api/User/SaveUser";
        return  this.http.post<number>(url ,paramsData,httpOptions).pipe(
            // map(data => data.body ),
            catchError(this.errorService.handleError)
             )
    }
    
    ResetPassword(paramsData:URLSearchParams):Observable<any>
    {
        const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
            }),
            // observe:'response'
          };
        console.log("service working");
        console.log("Dat=======",paramsData);
        let url = "api/Login/ResetPassword?";
         return  this.http.post<number>(url+paramsData,httpOptions).pipe(
            // map(data => data.body ),
            catchError(this.errorService.handleError)
            )
    }

    deleteCareCoordinator(id:number):Observable<any>
    {
      let url = "api/CareCoordinator/DeleteCareCoordinator/"+id;
      return  this.http.delete<number>(url,{observe :'response'}).pipe(
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