import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup,  AbstractControl, FormBuilder, Validators} from '@angular/forms'; 
import { EmailValidators } from 'ngx-validators'
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from '@angular/router';
import { GlobalComponent } from 'src/app/global/global.component';
import {  Menu} from 'src/app/theme/components/menu/menu.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  // public router: Router;
  // public form:FormGroup;
  // public email:AbstractControl;
  // public password:AbstractControl;

  LoginForm: FormGroup;
  submitted = false;
  warning: boolean;
  status: number;
  statusERR:string="";
  uname:any='';
  aCode:any='';
  isenable:boolean=false;
  Email: any;
  WebPassword: any;
  agencycode: any;
  userSelectedRole:any="";

  constructor(public http: HttpClient,private formBuilder: FormBuilder,public router:Router,
    public global:GlobalComponent,private ref: ChangeDetectorRef) {
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.LoginForm = this.formBuilder.group({
      Email: ['', Validators.required],
      WebPassword: ['', Validators.required],
      agencycode: ['', Validators.required],
    });
  
    // var mail = ["admin@dk.in","agent@dk.in"]
    // localStorage.setItem("email", JSON.stringify(mail));
      // this.router = router;
      // this.form = fb.group({
      //     "email": ['', Validators.compose([Validators.required, EmailValidators.normal])],
      //    "password": ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      // });

      // this.email = this.form.controls['email'];
      // this.password = this.form.controls['password'];
//  localStorage.set('email',"admin@dk.in") 

     
  }
  ngOnInit() {
    console.log("dispatch");
  }

  changepass()
  {
    let url = "Login/resetpassword?";
    let myParams = new URLSearchParams();
    myParams.append("userName", this.uname);
    this.global.userID=this.uname;
    myParams.append("DbCode", this.aCode);  
    console.log(this.uname);
         
    this.http.get(url + myParams).subscribe((data: any) => {
      console.log(data);
      alert("OTP has been sent to your E_Mail")
      this.router.navigateByUrl('/forgetpasslogin').then(()=>{
        this.global.loading = false
      })
      //this.getLocation = data
    },
      err => {
        alert(err.error)
      })
  }
////////////////////////////////////////////////////////
role:any="";
///////////////////////////////////
  getloginData()
  {
     
    return new Promise((resolve,reject)=>{
      var url = "api/Login/userlogin?";
      let myParams = new URLSearchParams();
      myParams.append("Username", this.Email);
      myParams.append("Password", this.WebPassword);
      myParams.append("AgencyCode", this.agencycode); 
      myParams.append("role", this.role); 
      myParams.append("type","webApp") 
    this.http.post(url+myParams,'').subscribe(
      (data: any) => {
         
        resolve(data);
        this.global.Adddata(data);
        localStorage.setItem("logindata",JSON.stringify(data)); 
      }, (err:HttpErrorResponse) => {
        reject(err)
       
          console.log("error",err.error);
          // console.log(err);
          this.warning = true;
          this.statusERR = err.error; 
          if (this.statusERR != "") {
          setTimeout(function(){
            this.statusERR = "";
          }.bind(this),6000)
        }
          
     
      });  
      });
  }
/////////////////////////////////////////////////
  rolelogin()
  {
    this.global.loading=true;
    this.role=this.userSelectedRole;
 //   this.closebtn();
    this.login()
    console.log(this.global.loading=true);
    
  }

  // closebtn()
//   {
//     var modal = document.getElementById("myModal");
//     modal.style.display = "none";
//    // this.LoginForm.reset();
//   //  this.isenable=false;
//   }
  //////////////////////////////////////////////
  logindata()
  {
    console.log("data=======login");
    
    this.global.loading=true;
    this.getloginData().then((res:any)=>{
      console.log(res)
      let data=res;
       if(data.roleId.length>1)
       {
        let selectedRole="";
       
         selectedRole= localStorage.getItem('SelectedRole')   
         let val=data.roleId.filter(s=>s==selectedRole);
        if(selectedRole==""||val.length==0) 
        {
          console.log("insideif")
          this.getuserDropDown(data.userId);
           this.global.loading=false;
           
          document.getElementById("openmultilogin").click()
        } 
        else{
          this.role=selectedRole;
          this.login()
        }
       
        console.log("true")
       }
       else if(data.roleId[0]=="SUPERADMIN")
        {
          this.role=data.roleId[0];
         console.log(data.roleId[0]);
          localStorage.setItem('SelectedRole',data.roleId[0]);
          this.setdata(data);
          this.global.loading=false; 
        }
         else
         {
          console.log("insideifelseifelse")
          this.role=data.roleId[0];
         
          localStorage.setItem('SelectedRole',data.roleId[0]);
          this.setdata(data);
          this.global.loading=false; 
      }

    }).
    catch((err) => {
      this.global.loading=false;
        console.log("error",err);
        // console.log(err);
        this.warning = true;
        this.status = err.error;
        setTimeout(function(){
          this.warning=false;
        }.bind(this),6000)
        // this.router.navigateByUrl('/pages/alltransclient');
        console.log(err.error);
        this.global.loading = false
    })
  }
  //////////////////////////////////////////////
  login(){
   
  // this.global.loading=true;
    var url = "api/Login/userlogin?";
    let myParams = new URLSearchParams();
    myParams.append("Username", this.Email);
    myParams.append("Password", this.WebPassword);
    myParams.append("AgencyCode", this.agencycode); 
    myParams.append("role", this.role);  
    myParams.append("type","webApp")    
    this.http.post(url+myParams,'').subscribe(
      (data: any) => {  
      if(this.userSelectedRole!="")
      {
        document.getElementById("openmultilogin").click()
        this.userSelectedRole=""
      }
      this.setdata(data);
        this.global.loading=false; 
      
      },
      (err:HttpErrorResponse)=>{
        this.global.loading=false;
        console.log("error",err.error);
        // console.log(err);
        this.warning = true;
        this.status = err.error;
        setTimeout(function(){
          this.warning=false;
        }.bind(this),6000)
        // this.router.navigateByUrl('/pages/alltransclient');
        console.log(err.error);
        this.global.loading = false
      })
  }
  //////////////////////////////////////////////
    forgotpassword()
    {
    this.router.navigateByUrl("/forgot-password")
    }
  ////////////////////////////////////////////////
  RoleList:any=[];
  //////////////////
  getuserDropDown(id)
  {
    var url = "api/User/Getuserroledropdown?";
      let myParams = new URLSearchParams();
      myParams.append("userid", id);
      this.http.get(url+myParams).subscribe((data:any)=>{
      
      this.RoleList=data;
        this.global.userRoleDropDown=this.RoleList;
      });
  }
  ////////////////////////////////////////////////
  setdata(data)
  {
    let menu:any=[]
    let i:number=1;
    console.log(data)
    console.log(i)
    data.menuList.forEach(element => {
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
   
    console.log(temp)
    menu.push(temp);
    i++;
     });

     this.global.globalmenu=menu;
     localStorage.setItem("globalMENU_ITEMS",JSON.stringify(this.global.globalmenu));
      console.log(  this.global.globalmenu)
      if (this.global.userID == 0) {
        this.router.navigateByUrl("/operational-dashboard");
      }
      else if (this.global.userID != 0 && this.global.userID != null && this.global.userID != undefined) {
        this.router.navigateByUrl("/operational-dashboard");

      }
    // this.router.navigateByUrl('/csp');
    let val=localStorage.getItem('SelectedRole')
    if(this.role!= val)
  {
    localStorage.setItem('SelectedRole',this.role);
    this.global.userSelectedRole=this.role;
  }
    this.global.Adddata(data);

    localStorage.setItem("logindata",JSON.stringify(data));  
    if(data.agencyOverallList!=null){
      this.global.globalAgencyDropDown=data.agencyOverallList;
    }    
  }
  //////////////////////////////////////////////
  // public onSubmit(values:Object):void {
  //     // if (this.form.valid) {
  //     //     this.router.navigate(['/agent']);

  //     localStorage.setItem('email',"admin@dk.in") 
  //     localStorage.setItem('email',"agent@dk.in") 

    
  //     // console.log("email");
     


  //   console.log(this.form.get('email'));

  //   if(this.email.value=="admin@dk.in" && this.password.value=="123456")
  //   {
  //     localStorage.setItem('email',"admin@dk.in") 
  //     this.global.email="admin@dk.in"
  //     this.router.navigate(['/roles'])
  //   }
  //   else if(this.email.value=="agent@dk.in" && this.password.value=="123456")
  //   {
  //   localStorage.setItem('email',"agent@dk.in") 
  //   this.global.email="agent@dk.in"
  //   this.router.navigate(['/roles'])
  //   }
  //   else{
  //     alert('error')
  //   }
   
  //     }
  

  // ngAfterViewInit(){
  //     document.getElementById('preloader').classList.add('hide');  
 
  // }
 
  // Forgot()
  // {
  //   this.router.navigate(['/forgot-password'])

  // }
}
