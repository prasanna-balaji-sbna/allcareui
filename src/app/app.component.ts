import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { GlobalComponent } from 'src/app/global/global.component';
import { HttpClient } from '@angular/common/http';
import { GridComponent } from '@syncfusion/ej2-angular-grids';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public settings: Settings;
  menu: any;
  loginData: any = {};
  agencyData: any = {};
  constructor(public appSettings: AppSettings, private router: Router, public global: GlobalComponent, private http: HttpClient,
    private ref: ChangeDetectorRef) {
    this.settings = this.appSettings.settings;

  }

  ngOnInit() {
   // console.log(window.innerWidth);
   console.log(window)
    this.global.deviceWidth = window.innerWidth;
 //   window.addEventListener('scroll', this.scroll, true);
  
    this.loginData = localStorage.getItem("logindata");
    this.loginData = JSON.parse(this.loginData);
    this.agencyData = JSON.parse(localStorage.getItem("globalAgencyData"));
    if (this.loginData != null) {
      this.global.Adddata(this.loginData);
      if (this.agencyData != null) {
        this.global.Addagencydata(this.agencyData);
      }
 //     console.log("Im in app", this.agencyData);
  //    console.log("Im in loginData", this.loginData);
      this.getOverallAgencyDropDown();
      if (this.loginData.userId != null || this.loginData.userId != undefined) {
        this.getuserDropDown(this.loginData.userId)
        this.global.roleId = localStorage.getItem("SelectedRole");
        this.global.userSelectedRole=localStorage.getItem("SelectedRole");
      }
      // this.router.navigateByUrl("/csp");
      if (this.loginData.userId == 0) {
        this.router.navigateByUrl("/operational-dashboard");
      }
      else if (this.loginData.userId != 0 && this.loginData.userId != null && this.loginData.userId != undefined && this.global.roleId != "SUPERADMIN" && (this.global.roleId == "BILLINGADMIN" || this.global.roleId == "AGENCYADMIN")) {
        this.router.navigateByUrl("/operational-dashboard");

      }
      else if(this.global.roleId != "SUPERADMIN" && this.global.roleId != "BILLINGADMIN" && this.global.roleId != "AGENCYADMIN"){
        this.router.navigateByUrl("/operational-dashboard");
      }
    }
    else {
      this.router.navigateByUrl("/login");
    }
  }

  // getOverallAgencyDropDown(){
  //   let url = "api/Agency/OverallAgency";    
  //   this.http.get(url).subscribe((data) => {     
  //     this.global.globalAgencyDropDown=[];
  //     this.global.globalAgencyDropDown = data;
  //   },
  //     err => {
  //       console.log("errrr", err)
  //     })
  // }
  scroll = (event): void => {
  
    this.ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 10);
    
   };
   
  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

  getOverallAgencyDropDown() {
    let url = "api/Agency/OverallAgency";
    this.http.get(url).subscribe((data) => {
      this.global.globalAgencyDropDown = [];
      this.global.globalAgencyDropDown = data;
    },
      err => {
        console.log("errrr", err)
      })
  }

  getuserDropDown(id) {
    var url = "api/User/Getuserroledropdown?";
    let myParams = new URLSearchParams();
    myParams.append("userid", id);
    this.http.get(url + myParams).subscribe((data: any) => {


      this.global.userRoleDropDown = data;
    });
  }


}





