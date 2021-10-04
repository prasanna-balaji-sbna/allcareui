import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { generalservice } from 'src/app/services/general.service';
import {  Menu} from 'src/app/theme/components/menu/menu.model';
import { Employee } from '../pages/employee/emloyee.model';

export class GlobalComponent implements OnInit {
public globalColumn:any=[];
  public isEditCustomer:boolean;
  public isEditAgent:boolean;
  public isEditCsp:boolean;
  public isEditAsset:boolean;
  public authtoken: string;
  public isEditUser:boolean;
  globalemployee:number=0;
  globalemployeedata:Employee=new Employee();
  isDashBoard:boolean
  isAgentOn:boolean;
  isAgentAdd:boolean;
  isAgentDel:boolean;
  isAgentEdit:boolean;
  isAgentUpdate:boolean;
  isAssetOn:boolean;
  isAssetAdd:boolean;
  isAssetDel:boolean;
  isAssetEdit:boolean;
  isAssetUpdate:boolean;
  isCustomerOn:boolean;
  isCustomerAdd:boolean;
  isCustomerDel:boolean;
  isCustomerEdit:boolean;
  isCustomerUpdate:boolean;
  isCspOn:boolean;
  isCspAdd:boolean;
  isCspDel:boolean;
  isCspEdit:boolean;
  isCspUpdate:boolean;
  isMapCsp:boolean;
  isBankService:boolean;
  isAccount:boolean;
  isCashIn:boolean;
  isCashOut:boolean;
  isFund:boolean;
  // email:string;
  menu:boolean;
  cashin:boolean;
  cashout:boolean;
  fund:boolean;
  view:Boolean;
  
  editAgentId:number=0;

  // public globalAgencyId:any=0;
  // public roleId:string="SUPERADMIN";
  public apiKey: any;
  public otpuserId: any;
  public otp: any;
  public ResendEmail: any;
  public ResendAgencycode: any;
  public driverAdmin: any;
  public employee_ID: number;
  public group_Payor_ID: any;
  public security_Level: any;
  // public authtoken: string;
  public clientId:number;
  public userID: any;
  public driverName:any;
  public Van_ID:number;
  public getdate: any;
  public date: any = new Date();
  public ViewAll: boolean;
  public ShowOnly: boolean;
  public isAllData: boolean;
  public LegStatusFilter:any=[];
  public DriverList:any=[];
  public Accessright:boolean;
  public tblID:any;
  public emp_ID:number;
  public leg:any;
  public userRoleDropDown:any=[];
  public etblID:any;
  public deviceWidth:number;
  public van_ID:any;
  public etransID:any;
  public editinsnum:any;
  public FlatRatetblID:any=0;
  public transid:any;
  public tripDate:any;
  public locname:any;
  public tophy:any;
  public city:any;
  public state:any;
  public zip:any;
  public cllocname:any;
  public fromaddress:any;
  public fromaddress2:any; 
  public city1:any;
  public zip1:any;
  public state1:any;
  public altAddress1:any;
  public altAddress2:any;
  public altCity:any;
  public altHomeType:any;
  public altState:any;
  public altZip:any;
  public multipleriders:any;
  public loginUser:any;
  public globalAgencyId:any;
  public globalAgencyDropDown:any=[];
  public globalICD10List: any=[];
  public logginedUserName:any;
  public userDetail:any={};
  public agencyName:any=null;
  public agencyPhone:any=null;
  public  agencyLogo:any=null;
  public loading:boolean=false;
  public roleId:string="SUPERADMIN";
  public listId:any=3;
  public email: string;
  public deleteErr: string;
  public ErrorBool: boolean = false;
 public globalmenu:any=[]
 public userSelectedRole:string="";
  constructor( 
    // public phoneNoFormat:PhoneNumberFormatService,
    public http:HttpClient,
    public route:Router,
    public general: generalservice) { }

  ngOnInit() {
  }
  Adddata(data) {
    this.authtoken =data.tokenString;
    // this.authtoken = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3VzZXJkYXRhIjoiMCIsInVuaXF1ZV9uYW1lIjoiU1VQRVJBRE1JTiIsIm5hbWVpZCI6IlNVUEVSQURNSU4iLCJyb2xlIjoiU1VQRVJBRE1JTiIsIm5iZiI6MTU5MTg1Mjc1OCwiZXhwIjoxNTkyMjEyNzU4LCJpYXQiOjE1OTE4NTI3NTh9.yIqy17p5Q-swP3gtBp4R9Ikhjv5CjbrhsJbGD8cn5XP0-G0fEywlUFD09GA_DDUr44MglNWNNmyC44aGzhaD3Q"
   // console.log("this.authtoken",this.authtoken);
  //  console.log("this.authtoken chnages",data.tokenString);     
  //  console.log("menulist",data.menuList);
          
  

    this.logginedUserName=data.userName;
    
    this.agencyLogo=data.agencyLogo;
    this.agencyName=data.agencyName;
    this.agencyPhone=data.phone;
    this.userID=data.userId;
  //  console.log(this.userID,"UserId==================");
    
    this.roleId=data.roleId[0];
    if( this.agencyPhone!=null){
      this.agencyPhone = this.general.converPhoneGoogleLib(this.agencyPhone);
    }
    this.globalAgencyId=data.agencyId;
    this.AddMenuItems(data.menuList);
  }
  AddMenuItems(data){
    let menu:any=[]
    let i:number=1;
    data.forEach(element => {
      let temp:any={}      
      temp.id=i;
      temp.title=element.title;
      temp.routerLink=element.link;
      temp.href=null;
      temp.icon=element.icon;
      temp.target=null;
     
     temp.parentId=0;
    
     
     if(element.children!=null && element.children.length>0)
     {
      
      let j:number=i+1;
      element.children.forEach(element => {
        let submenu:any={}
        submenu.id=j;
        submenu.title=element.title;
        submenu.routerLink=element.link;
        submenu.href=null;
        submenu.icon=element.icon;
        submenu.target=null;
        submenu.hasSubMenu=false;
        submenu.parentId=i;
       
        menu.push(submenu);
        j++;
     });
     i=j-1;
     temp.hasSubMenu=true;
    } 
    else
    {
      temp.hasSubMenu=false;
    }
   
   // console.log(temp)
    menu.push(temp);
    i++;
     });

     this.globalmenu=menu;
    // if(data.length!=0){
    //   data.forEach(element => {
    //     if(element.children==null){
    //     element.id=id++;
    //     element.title=element.title;
    //     element.routerLink=element.link.split(splitdata)[1];
    //     element.href=null;
    //     element.icon=element.icon.split(/fa fa-/)[1];
    //     element.hasSubMenu=false;
    //     element.parentId= 0;
    //       this.globalmenu.push(element);
    //     }
    //     else{
    //     element.children.forEach(element => {
    //       element.id=id++;
    //       element.title=element.title;
    //       element.routerLink=element.link.split(/pages/)[1];
    //       element.href=null;
    //       element.icon=element.icon!=null?element.icon.split(/fa fa-/)[1]:null;
    //       element.hasSubMenu=true;
    //       element.parentId= element.id;
    //       this.globalmenu.push(element);
    //     });
    //     }
    //     });
    // }
   // console.log("gobal menu",this.globalmenu);    
    localStorage.setItem("globalMENU_ITEMS",JSON.stringify(this.globalmenu));
  }
  Addagencydata(data){
    this.agencyLogo=data.agencyLogo;
    this.agencyName=data.agencyName;
    this.agencyPhone=data.phone;
    if( this.agencyPhone!=null){
      this.agencyPhone = this.general.converPhoneGoogleLib(this.agencyPhone);
      // this.agencyPhone=this.phoneNoFormat.getPhoneNumber(this.agencyPhone);
      // this.agencyPhone=this.phoneNoFormat.phoneNoToFormat( this.agencyPhone);
    }
    this.globalAgencyId=data.agencyId;
  }
   
  onRefreshGetData(selectedAgencyId){
    var agency_Id:any=0;
    let url = "api/Agency/OverallAgencyInfo?";   
    let myparams=new URLSearchParams(); 
    if(selectedAgencyId==''){
      myparams.append("agencyId",agency_Id);
    }
    else{
      myparams.append("agencyId",selectedAgencyId);
    }
    this.http.get(url+myparams).subscribe((data:any) => {
    //  console.log("data",data); 
      if(data!=null){
        this.agencyLogo=data.agencyLogo;
        this.agencyName=data.agencyName;
        if( data.phone!=null){
          data.phone = this.general.converPhoneGoogleLib(data.phone);
          this.agencyPhone = this.general.converPhoneGoogleLib(data.phone);
          // data.phone=this.phoneNoFormat.getPhoneNumber(data.phone);
          // this.agencyPhone=this.phoneNoFormat.phoneNoToFormat( data.phone);
        }  
        else{
          this.agencyPhone=null;
        }     
        data.agencyId=selectedAgencyId; 
        this.globalAgencyId= selectedAgencyId;    
        localStorage.setItem("globalAgencyData",JSON.stringify(data));
        if (this.userID == 0) {
          this.route.navigate(["/operational-dashboard"]);
        }
        else if (this.userID != 0 && this.userID != null && this.userID != undefined) {
          this.route.navigate(['/operational-dashboard']);
        }
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        if (this.userID == 0) {
          this.route.navigate(["/operational-dashboard"]);
        }
        else if (this.userID != 0 && this.userID != null && this.userID != undefined) {
          this.route.navigate(['/operational-dashboard']);
        }
      }
      else{
        this.agencyLogo=null;
        this.agencyName=null;
        this.agencyPhone=null; 
        this.globalAgencyId=0;
        this.route.navigateByUrl('/csp');
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate(['/csp']);
      }
    }
  )
   
  
  }

}
