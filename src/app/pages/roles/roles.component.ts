import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { roleMenu, RolePermissionMenu } from './roles.model';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl, FormControlName } from '@angular/forms';
import { AngularTreeGridComponent } from 'angular-tree-grid';
import { RolesService } from './roles.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/error.service';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush



})
export class RolesComponent implements OnInit {
  @ViewChild('angularGrid') angularGrid: AngularTreeGridComponent;
header:any=[];
isEvv:boolean=false;
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
  constructor(private router: Router,public global:GlobalComponent,public rolesService: RolesService,
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
  console.log(saveData,"save Data======");
  saveData.isEvv=this.isEvv;
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
  
      console.log(item);
      this.header.push({ th: item });  
      console.log(this.header);
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
    let url="api/RolePermission/SaveRoleBasedMenu?";
    let obj={
      RoleId:Role.roleHeading,
      isRoleEnabled:Role.isRoleEnabled
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
      let url="api/RolePermission/SaveAllMenuRoles?";
      // let myparams=new URLSearchParams();   
      // myparams.append("isEnabled",isEnabled);
         this.rolesService.SaveAllMenuRoles(isEnabled).subscribe((data:any)=>{
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
      isEvv:this.isEvv
    };
    this.rolesService.newRole(obj).subscribe((data:any)=>{
      this.getHeaderRole();
      //console.log("p2", this.headList);   
      document.getElementById('roleadd').click();
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
      this.toastr.success("Role has been created successfully", "Role created");
      setTimeout(() => {
        this.toastr.clear();
      }, 8000);
    },
    (err: HttpErrorResponse) => {
      if(err){
        console.log("err.error",err);
        let response:any=err;
        this.toastr.error(response,'Error'),8000;
      }
      }
    )

  }


    //================================================ get table header - role =======================//
 
    getHeaderRole() {
      let url = "api/RolePermission/getMenudata";
     let param =new URLSearchParams();
      param.append("isEvv",this.isEvv.toString())
      this.rolesService.getheaderrole(param).subscribe((data:RolePermissionMenu)=>{
        console.log("datajson", data);
        this.rolePermisssionList = data;
  
      },
        (err: HttpErrorResponse) => {
          this.roleAlerts = "";
          this.roleAlerts = err.error;
          if (this.roleAlerts != "") {
            setTimeout(function () {
              this.roleAlerts = "";
            }.bind(this), 8000);
          }
        });
    }
    switchchange()
    {
      this.getHeaderRole();
    }
  
}
