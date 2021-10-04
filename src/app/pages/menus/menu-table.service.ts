import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { GetSMListBo} from './menus.model';
// import { MenuComponent} from './menus.component';
import { ErrorService } from 'src/app/services/error.service';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { GlobalComponent } from 'src/app/global/global.component';
@Injectable()

export class GetHTTPService extends Subject<DataStateChangeEventArgs>{
  constructor(private http: HttpClient, public errorService: ErrorService, public global: GlobalComponent,
    // public menu: MenuComponent
    ) {
    super();
  }
  public execute(state: GetSMListBo, type): void {
      console.log("type",type);
      if ( type == 'parent') {
        this.getMenuList(state).subscribe(x => super.next(x));
      } else if(type=='child'){
        this.getSMList(state).subscribe(x => super.next(x));
      }
  }
 
  getMenuList(state?: GetSMListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/SideMenuItems/getParentMenu?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['mList'],
            count: response['totalCount']
          }
      )).map((e: any)=>{
          this.setDroplist(e.result)
          return e;
      })
  }

  getSMList(state?: GetSMListBo): Observable<DataStateChangeEventArgs> {
    return this.http.post<any>("api/SideMenuItems/getSubMenu?", state)
      .pipe(map(
        (response: any) =>
          <any>{
            result: response['mList'],
            count: response['totalCount']
          }
      ))
  }
  MenuListDropDown = [];
  filter_data_ParentMenu=[];
  setDroplist(data){
    // let MenuListDropDown=[];
    // let filter_data_ParentMenu=[];
    this.MenuListDropDown = JSON.parse(JSON.stringify(data));
    console.log("this.MenuListDropDown",this.MenuListDropDown);
    this.MenuListDropDown = this.MenuListDropDown.filter(md=>md.parentMenuItemId==null && md.isFunctionRequired==false);
    // filter_data_ParentMenu = [];
    this.filter_data_ParentMenu = JSON.parse(JSON.stringify(data));
    // this.setfiltervalue(filter_data_ParentMenu);
    console.log("this.MenuListDropDown",this.MenuListDropDown);
    console.log("this.filter_data_ParentMenu",this.filter_data_ParentMenu);
    this.setfiltervalue();
    this.getdropdata();
  }
  setfiltervalue(){
    console.log("this.MenuListDropDown",this.MenuListDropDown);
    console.log("this.filter_data_ParentMenu",this.filter_data_ParentMenu);
      return this.filter_data_ParentMenu;
  }
  getdropdata() {
    console.log("this.MenuListDropDown",this.MenuListDropDown);
    console.log("this.filter_data_ParentMenu",this.filter_data_ParentMenu);
      return this.MenuListDropDown;
  }
}
