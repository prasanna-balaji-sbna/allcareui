import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RolePermissionMenu } from './agencypermission.model';
import { catchError } from 'rxjs/operators';
import { Menu } from 'src/app/theme/components/menu/menu.model';
import { GlobalComponent } from 'src/app/global/global.component';
import { ErrorService } from 'src/app/error.service';

@Injectable({
  providedIn: 'root'
})
export class AgencyppermissionService {

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
   // console.log(data);
    
    let url="api/RolePermission/SaveAllMenuRolesAgencyPermission?isEnabled="+data.isEnabled+"&AgencyId="+data.AgencyId+"&UseridRoles="+data.UseridRoles;
    return this.httpClient.post(url,'').pipe(catchError(this.errorService.handleError));
  }
  public SaveRoleBasedMenu(data:any){
    return this.httpClient.post('api/RolePermission/SaveRoleBasedMenuAgencypermission?',data).pipe(catchError(this.errorService.handleError));
  }
  public getheaderrole(myparams:URLSearchParams){
    let url = "api/RolePermission/getMenuDataAgencypermission?";
    return this.httpClient.get<RolePermissionMenu>(url + myparams, ).pipe(catchError(this.errorService.handleError));
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
