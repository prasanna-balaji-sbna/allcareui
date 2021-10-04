import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RolePermissionMenu } from '../agencypermission/agencypermission.model';
import { AngularTreeGridComponent } from 'angular-tree-grid';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { GlobalComponent } from 'src/app/global/global.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/error.service';
import { AgencyppermissionService } from './agencypermission.service';

@Component({
  selector: 'app-agencypermission',
  templateUrl: './agencypermission.component.html',
  styleUrls: ['./agencypermission.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgencypermissionComponent implements OnInit {
  @ViewChild('angularGrid') angularGrid: AngularTreeGridComponent;
  header:any=[];
  
  headerName:any="";
  editField: string;
  masterSelected:boolean;
  checklist:any;
  rolesdata:Array<RolePermissionMenu>=[];
  // rolesdata:RolePermissionMenu[];
  changeEnableData=[];
  form : FormGroup ;
  menuData=[];
  roleAlerts: any = "";
  rolePermisssionList:RolePermissionMenu = new RolePermissionMenu();
  selectAll:boolean=false;
  role=new FormControl('',Validators.required)
    constructor(private router: Router,public global:GlobalComponent,public rolesService: AgencyppermissionService,
      public toastr: ToastrService,public errorService:ErrorService,private ref: ChangeDetectorRef) { 
      this.masterSelected = false;
     // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
  
  
      
    }
  ngOnInit(): void {
   
    this.getHeaderRole();
  }
    //  getPermission(){
    //    this.rolesService.getPermissionData().subscribe((data:RolePermissionMenu[])=>{
    //      this.rolesdata = data;
    // //      console.log(this.rolesdata);
         
    // //    })
    //  }
     isSaveClicked:boolean;
     saveRole(){
      this.isSaveClicked = true;
      this.rolesService.saveRoleData(this.changeEnableData).subscribe((data:any)=>{
        this.toastr.success('Roles Updated Successfully', 'Roles Updated');
      this.isSaveClicked = false;
  
      },
      err=>{
      this.isSaveClicked = false;
      // this.errorService.check(err);      
      })
     }
  
  
    //================================================save Role and permissions=======//
   // loading:boolean=false;
   saveRoleandPermissions(saveData){
  //  console.log(saveData,"save Data======");
    saveData.agencyid= this.global.globalAgencyId;
    this.global.loading=true;
    let url="api/RolePermission/saveOrUpdatePermission";
    this.rolesService.saveRoleData(saveData).subscribe((data:any)=>{
      //console.log(data);
      saveData.rolePermissionId=data;
      this.getHeaderRole();
    
        this.global.loading=false;
      
     
    },
    (err:HttpErrorResponse)=>{
      //console.log("err",err.error);
    })
  }
    addRole(item)
    {
    
       // console.log(item);
        this.header.push({ th: item });  
    //    console.log(this.header);
        this.rolesService.sendGetRequest().subscribe((data)=>{
   
      
    })
  }
  Addrole() {  
    this.headerName=""; 
    
  }
  
     //=============================Role Based permisssion======================//
    
    //================================================save Role and permissions=======//
    //loading:boolean=false;
    SaveRoleBasedMenu(Role){
      ////console.log(Role,isEnabled);
       this.global.loading=true;
      //this.loading=true;
      let url="api/RolePermission/SaveRoleBasedMenuAgencypermission?";
      let obj={
        RoleId:Role.roleHeading,
        isRoleEnabled:Role.isRoleEnabled,
        AgencyId:this.global.globalAgencyId,
        UserId:this.global.userID
      }
          this.rolesService.SaveRoleBasedMenu(obj).subscribe((data:any)=>{
        //console.log(data);
       
        this.getHeaderRole();
        
          this.global.loading=false;
      
        // this.global.loading=false;
      },
      (err:HttpErrorResponse)=>{
        //console.log("err",err.error);
        // this.global.loading=false;
      })
    }
      //================================================save Role and permissions=======//
      SaveAllMenuRoles(isEnabled){  
        console.log("isEnabled",isEnabled); 
         this.global.loading=true;  
        let url="api/RolePermission/SaveAllMenuRolesAgencyPermission?";
    let obj = {
      isEnabled:isEnabled,
      AgencyId:this.global.globalAgencyId,
      UseridRoles:this.global.userID
    }
        // let myparams=new URLSearchParams();   
        // myparams.append("isEnabled",isEnabled);
        // myparams.append("AgencyId",this.global.globalAgencyId);
        // myparams.append("UseridRoles",this.global.userID);
           this.rolesService.SaveAllMenuRoles(obj).subscribe((data:any)=>{
          //console.log(data);
          // this.global.loading=false;
          
            this.global.loading=false;
      
          this.getHeaderRole();
        },
        (err:HttpErrorResponse)=>{
          // this.global.loading=false;
          //console.log("err",err.error);
        })
      }
    updateList(id: number, property: string, event: any) {
      const editField = event.target.textContent;
      this.header[id][property] = editField;
    }
    changeValue(id: number, property: string, event: any) {
      this.editField = event.target.textContent;
    }
    roleMap(){
      this.router.navigate(['/role-map'])
    }
  
  
  ////////===============New Role Fun==============================////////////////////////
    addroles(headerName) {
      let url = "api/LoginRole/saveRole";
      let obj = {
        RoleId:headerName,
        RoleName:headerName,
        AgencyId:this.global.globalAgencyId
      };
      this.rolesService.newRole(obj).subscribe((data:any)=>{
       
        //console.log("p2", this.headList);   
        document.getElementById('openModal1').click();
        var tbl = document.getElementsByTagName("body")[0];
        var tr = tbl.getElementsByTagName("tr");
        for (var i = 0; i < tr.length; i++) {
          var td = document.createElement('td');
          td.style.padding = "7px";
          td.style.borderBottom = "2px solid #ddd";
          td.style.textAlign = "center";
          td.style.border = "0px";
          // var input: any = document.createElement('INPUT');
          // input.type = 'checkbox';
          // td.appendChild(input);
          tr[i].appendChild(td);    
        }
        this.getHeaderRole();
        this.toastr.success("Role has been created successfully", "Role created");
        setTimeout(() => {
          this.toastr.clear();
        }, 8000);
       
      },
        (err: HttpErrorResponse) => {
          // this.SaveRoleeerr = "";
          // this.SaveRoleeerr = err.error;
          // if (this.SaveRoleeerr != "") {
          //   setTimeout(function () {
          //     this.SaveRoleeerr = "";
          //   }.bind(this), 8000);
          // }
          this.toastr.error(err.error);
          setTimeout(() => {
            this.toastr.clear();
          }, 8000);
        }
      )
  
    }
  
  
      //================================================ get table header - role =======================//
   
      getHeaderRole() {
        let url = "api/RolePermission/getMenudata";
        let myparams=new URLSearchParams();   
        myparams.append("AgencyId",this.global.globalAgencyId);
        myparams.append("UserId",this.global.userID);
        this.rolesService.getheaderrole(myparams).subscribe((data:RolePermissionMenu)=>{
          console.log("datajson", data);
          
          setTimeout(function () {
            this.rolePermisssionList = data;
          }.bind(this), 800);
          //this.listValues=data.tableData;
    
        },
          (err: HttpErrorResponse) => {
            this.roleAlerts = "";
            this.roleAlerts = err.error;
            if (this.roleAlerts != "") {
              setTimeout(function () {
                this.roleAlerts = "";
              }.bind(this), 8000);
              //console.log("agencyid", err.error);
            }
          });
      }
    

}
