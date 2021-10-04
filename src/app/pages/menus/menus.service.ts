import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { MenuList, SideMenuItemsBO, ColumnChangeBO } from './menus.model';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
export class MenuHttpService {
    constructor(private http: HttpClient,public errorService: ErrorService) { }

    GetMenuList():Observable<SideMenuItemsBO[]>
    {
        console.log("service working")
        let url = "api/SideMenuItems/getParentMenu";
        return  this.http.get<SideMenuItemsBO[]>(url,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    GetSubMenuList(value: number):Observable<SideMenuItemsBO[]>
    {
        console.log("service working")
        let url="api/SideMenuItems/getSubMenu?ParentMenuItemId="+value;
        return  this.http.get<SideMenuItemsBO[]>(url,{observe :'response'}).pipe(
        map(data => data.body),
        catchError(this.errorService.handleError)
        )
    }

    getfunctionMenuList(id: number):Observable<MenuList[]>
    {
        console.log("service working")
        let url="api/MenuFunctionality/getMeunuFunctionality?MenuItemId="+id;
        return  this.http.get<MenuList[]>(url,{observe :'response'}).pipe(
        map(data => data.body ),
        catchError(this.errorService.handleError)
        )
    }

    saveupdate(saveList :SideMenuItemsBO):Observable<number>
    {
        console.log("service working")
        let url = "api/SideMenuItems/saveSideMenuItems";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
         map(data => data.body ),
        catchError(this.errorService.handleError)
         )
    }
    
    saveupdateFunction(saveList :MenuList):Observable<number>
    {
        console.log("service working")
        let url = "api/MenuFunctionality/saveFunctionality";
         return  this.http.post<number>(url ,saveList,{observe :'response'}).pipe(
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