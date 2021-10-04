import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { SettingList, LovBO, overallSideMenuItemBO, functionpermission } from './agency-settings.model';
import { AgencySettingService } from './agency-settings.service';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { Observable, Subject } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { CanDeactivate } from '@angular/router';
// import { ViewGuard } from './path of ViewGuard';

@Component({
  selector: 'app-agency-settings',
  templateUrl: './agency-settings.component.html',
  styleUrls: ['./agency-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgencySettingsComponent implements OnInit {
  subject: Subject<boolean>;
  AgencyArray: SettingList[];
  setting: SettingList = new SettingList();
  SessioLOVList: LovBO[];
  QPVLovList: LovBO[];
  TSLOVList: LovBO[];
  ClientLOVList: LovBO[];
  DaysLov: LovBO[];
  AgencyId = this.global.globalAgencyId;
  sidemenu: overallSideMenuItemBO[];
  fp: functionpermission;
  touched: boolean = false;

  constructor(public http: HttpClient, private formBuilder: FormBuilder,
    public global: GlobalComponent, public httpService: AgencySettingService,
    private ref: ChangeDetectorRef, public toastrService: ToastrService, public general: generalservice) {
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
  
  
  
  
  
     }

  ngOnInit() {
   // console.log(this.setting);
    
    // this.setting = new SettingList();
    this.fp = new functionpermission();
    this.filepermissionget();
    this.getAgencySetting();
    this.GetQlov();
    this.GetSessionlov();
    this.GetTSlov();
    this.GetClientlov();
    this.GetDayslov();
  }

  getAgencySetting() {
    // this.setting = new SettingList();
    let params = new URLSearchParams();
    params.append("AgencyId", this.AgencyId);
    this.httpService.getSettiings(params).subscribe((data: SettingList) => {
      this.setting = data;
      // this.AgencyArray.id = data.id;
      // this.AgencyArray.agencyId = data.agencyId;
      // this.AgencyArray.cOB_Config_IntakeProcess = data.coB_Config_IntakeProcess;
      // this.AgencyArray.cOB_Config_AddNew = data.coB_Config_AddNew;
      // this.AgencyArray.cOB_Config_CSVImport = data.coB_Config_CSVImport;
      // this.AgencyArray.qP_VisitFrequencyConfigLCode = data.qP_VisitFrequencyConfigLCode;
      // this.AgencyArray.qP_VisitFrequencyConfigLid = data.qP_VisitFrequencyConfigLid;
      // this.AgencyArray.eOB_AddNew = data.eoB_AddNew;
      // this.AgencyArray.eOB_OnboardCheckList = data.eoB_OnboardCheckList;
      // this.AgencyArray.eOB_CSVImport = data.eoB_CSVImport;
      // this.AgencyArray.sessionLogoutConfigLCode = data.sessionLogoutConfigLCode;
      // this.AgencyArray.sessionLogoutConfigLid = data.sessionLogoutConfigLid;
      // this.AgencyArray.sheduleConfig_QPSchedule = data.sheduleConfig_QPSchedule;
      // this.AgencyArray.scheduleConfig_PCAEmployeeSchdule = data.scheduleConfig_PCAEmployeeSchdule;
      // this.AgencyArray.timeSheetGenerationConfigLCode = data.timeSheetGenerationConfigLCode;
      // this.AgencyArray.timeSheetGenerationConfigLid = data.timeSheetGenerationConfigLid;
      // this.AgencyArray.clientSignatureConfigLCode = data.clientSignatureConfigLCode;
      // this.AgencyArray.clientSignatureConfigLid = data.clientSignatureConfigLid;
      // this.AgencyArray.verificationSetupConfig_GPSLocation = data.verificationSetupConfig_GPSLocation;
      // this.AgencyArray.verificationSetupConfig_TabletOrMobileUsingRFIDOrQRCode = data.verificationSetupConfig_TabletOrMobileUsingRFIDOrQRCode;
      // this.AgencyArray.manualTImesheetPayrollPeridConfig_Weekly = data.manualTImesheetPayrollPeridConfig_Weekly;
      // this.AgencyArray.manualTImesheetPayrollPeridConfig_BiWeekly = data.manualTImesheetPayrollPeridConfig_BiWeekly;
      //console.log(data);
    //  console.log("AgencyArray",this.AgencyArray);
    })
    // this.setting = new SettingList();
    // this.setting = this.AgencyArray;
  }
  
  GetQlov() {
    let params = new URLSearchParams();
    params.append("Code", "QPVISITFREQUENCYCONFIGURATION");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.qP_VisitFrequencyConfigLCode = data[0].lovCode;
      // this.QPVLovList = data[0].lovCode;
    //  console.log(data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }

  GetSessionlov() {
    let params = new URLSearchParams();
    params.append("Code", "SESSIONLOGOUTCONFIGURATION");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.sessionLogoutConfigLCode = data[0].lovCode;
      // this.SessioLOVList = data[0].lovCode;
      console.log(data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }
  
  GetTSlov() {
    let params = new URLSearchParams();
    params.append("Code", "TIMESHEETGENERATIONCONFIGURATION");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.timeSheetGenerationConfigLCode = data[0].lovCode;
      // this.TSLOVList = data[0].lovCode;
      console.log(data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }
  
  GetClientlov() {
    let params = new URLSearchParams();
    params.append("Code", "CLIENTSIGNATURECONFIGURATION");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.clientSignatureConfigLCode = data[0].lovCode;
      // this.ClientLOVList = data[0].lovCode;
      console.log(data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }
  GettimesheetLov() {
    let params = new URLSearchParams();
    params.append("Code", "WEEKLYTIMESHEETPERIOD");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.clientSignatureConfigLCode = data[0].lovCode;
      // this.ClientLOVList = data[0].lovCode;
      console.log("WEEKLYTIMESHEETPERIOD",data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }


  GetDayslov() {
    let params = new URLSearchParams();
    params.append("Code", "DAYS");
    this.httpService.getLov(params).subscribe((data: LovBO[]) => {
      // this.AgencyArray.qP_VisitFrequencyConfigLCode = data[0].lovCode;
      // this.QPVLovList = data[0].lovCode;
      this.DaysLov = data;
      console.log(data);
    })
    // console.log("AgencyArray",this.AgencyArray);
  }
  // //////////////////////////////////////////////////////////
  SaveOrUpdate() {
    console.log(this.setting.weekStartLid,"this.setting.weekStartLid===");
    
    var saveList: SettingList = JSON.parse(JSON.stringify(this.setting));
    // console.log(saveList,"saveList============");
    saveList.agencyId = parseInt(this.global.globalAgencyId);
    saveList.weekStartLid = saveList.weekStartLid == null ? null:+saveList.weekStartLid;
    saveList.weekEndLid =  saveList.weekEndLid == null ? null:+saveList.weekEndLid;
 //   console.log(saveList,"saveList============");
    
    this.httpService.saveupdate(saveList).subscribe((data: number) => {
 //     console.log("====save update=========", data);
      if (data) {
        this.toastrService.success(
        'Settings has been configured successfully!',
        'Settings Configuration'), 8000;
        this.touched = false;
        if (this.global.roleId != "SUPERADMIN") {
          this.getSideMenuBasedRole();
        }
        //====================== sucess message =============
        // this.getAgencySetting();
      }
    },(err: any) => {
      if(err){
       // console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    })
  }


  getSideMenuBasedRole() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.AgencyId);

    this.httpService.getSideMenuBasedRole(params).subscribe((data: overallSideMenuItemBO[]) => {
      this.global.AddMenuItems(data);
     // console.log(data);
    })
  }


  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "AGENCY");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
  }


   ///////////////////////CAN DEACTIVATE METHOD////////////////////////////////////////////////
   canDeactivate(): Observable<boolean> | boolean {
    // close:TemplateRef<any>;
    if (this.touched) {
      return confirm('Your changes are unsaved!! Do you like to exit');
    //  return this.dialogService.confirm('Unsaved changes not submitted yet, do you really want to leave page?');
    }
    return true;

  }

  change() {
    this.touched = true;

  }
  action(value) {
    this.subject.next(value);
    this.subject.complete();
  }
  // ngOnDestroy() {
  //   if (this.touched) {
  //     if(confirm('Your changes are unsaved!! Do you like to exit?') == true){
  //       return true;
  //     } else {
  //       return false;
  //       // this.ngOnInit();
  //     }
  //   //  return this.dialogService.confirm('Unsaved changes not submitted yet, do you really want to leave page?');
  //   } else {
  //   return true;
  //   }
  // }
    //   @Injectable()
    // export class CanDeactivateGuard implements CanDeactivate<UserFormComponent> {
    //   canDeactivate(component: UserFormComponent): boolean {
      
    //     // if(component.hasUnsavedData()){
    //       if (this.touched){
    //         if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //     return true;
    //   }
    // }
    keyPress(event: any) {
      const pattern = /[0-9]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  
}
