import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RolePermissionMenu } from './roles.model';
import { catchError } from 'rxjs/operators';
import { GlobalComponent } from 'src/app/global/global.component';
import { ErrorService } from 'src/app/error.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient,public errorService: ErrorService,public global: GlobalComponent) { }

  public sendGetRequest(){
    return this.httpClient.get<any[]>('/assets/roles.json').pipe(catchError(this.errorService.handleError));
  }
  public getPermissionData(){
    return this.httpClient.get<RolePermissionMenu[]>('api/RolePermission/getMenudata').pipe(catchError(this.errorService.handleError));
  }
  public saveRoleData(data:any[]){
    return this.httpClient.post('api/RolePermission/saveOrUpdatePermission',data).pipe(catchError(this.errorService.handleError));
  }

  public newRole(data:any){
    return this.httpClient.post('api/LoginRole/saveRole',data).pipe(catchError(this.errorService.handleError));
  }
  public SaveAllMenuRoles(data:any){
    return this.httpClient.post('api/RolePermission/SaveAllMenuRoles?isEnabled='+data,'').pipe(catchError(this.errorService.handleError));
  }
  public SaveRoleBasedMenu(data:any){
    return this.httpClient.post('api/RolePermission/SaveRoleBasedMenu?',data).pipe(catchError(this.errorService.handleError));
  }
  public getheaderrole(data:URLSearchParams){
    return this.httpClient.get<RolePermissionMenu>('api/RolePermission/getMenudata?'+data).pipe(catchError(this.errorService.handleError));
  }
  // public getSideMenu(){
  //         let local=localStorage.getItem('email')
  //         if(local=="admin@dk.in")
  //         {
  //           this.global.levelCode = 1000;
  //           this.global.agentId = 125;
  //           this.global.agentRole = "Digital Kendra";
  //         }
  //         else if(local=="agent@dk.in")
  //         {
  //           this.global.levelCode = 5000;
  //           this.global.agentId = 120;
  //           this.global.agentRole = "Agent";
  //         }
  //     return this.httpClient.get<Array<Menu>>('RolesPermission/getSideMenuItems?Role='+this.global.agentRole).pipe(catchError(this.errorService.handleError));
  //   }
}
