import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent,DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { ManageHttpService } from './manage.service';
import { ServiceList, sortingObj, DropList, functionpermission, GetMSListBo, WhereCondition, GetMAListBo, GetMSAListBo, ActivityList, ServiceActivityList,columnWidth,ColumnChangeBO } from './manage.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './manage-table.service';
import { GetHTTPService1 } from './activity-table.service';
import { GetHTTPService2 } from './serviceactivity-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Tooltip } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageComponent implements OnInit {


  // =============Main initialization==============================//
  selectedtab:string="Service";
  ServiceArray: ServiceList[];
  Service: ServiceList =new ServiceList();
  Activity: ActivityList =new ActivityList();
  ServiceActivity: ServiceActivityList =new ServiceActivityList();
  StatusList: DropList[];
  MSsendBO:GetMSListBo = new GetMSListBo();
  MSsendBO1:GetMAListBo = new GetMAListBo();
  MSsendBO2:GetMSAListBo = new GetMSAListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();

  ColumnArray_service: columnWidth[]
  ColumnArray_activity: columnWidth[]
  ColumnArray_serviceactivity: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
 

  // ======================Form Initialization===================== //
  ServiceForm: FormGroup;
  ActivityForm: FormGroup;

  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('gridactivity') public gridactivity: GridComponent;
  @ViewChild('gridserviceactivity') public gridserviceactivity: GridComponent;
  filter: IFilter;  
  // Filter_drop: searchfilterDetails;
  TotalCount: number;  
  public pageSizes: number[] = [10,15,20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public data1: Observable<DataStateChangeEventArgs>;
  public data2: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  // ================Other initialization======================= //
  filterSelect_service: number;
  pagshort: sortingObj = new sortingObj();
  ModalType: string;
  fp: functionpermission;
  ServiceActivityArray: any = [];
  valuechangeService: any = [];
  deleteAlert: boolean = false;
  deleteError: any = "";


  constructor(public http: HttpClient, private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,private ref: ChangeDetectorRef,
    public global: GlobalComponent, public httpService: ManageHttpService,@Inject(GetHTTPService1) public gethttp1:GetHTTPService1,@Inject(GetHTTPService2) public gethttp2:GetHTTPService2,
    public toastrService: ToastrService, public general: generalservice) { 
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.data1=gethttp1;
      this.data2=gethttp2;
      this.ServiceForm = this.formBuilder.group({
        Code: [' ', Validators.required],
        Modifier1: [' '],
        Modifier2: [' '],
        Modifier3: [' '],
        Modifier4: [' '],
        Name: ['', Validators.required],
        Description: ['', Validators.required],
        BillingUnit: [''],
        Status: ['', Validators.required],
        Ratio: ['', Validators.required],
      });
      this.ActivityForm = this.formBuilder.group({
        Code: [' ', Validators.required],
        Name: ['', Validators.required],
        Status: ['', Validators.required]
      });
    }
    type:string="";
    public dataStateChange(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.MSsendBO.orderColumn = state.sorted[0].name;
        this.MSsendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.MSsendBO.field=state.action.currentFilterObject.field;
        this.MSsendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.MSsendBO.operator=state.action.currentFilterObject.operator;
        this.MSsendBO.value=state.action.currentFilterObject.value.toString();
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.MSsendBO.field="MasterServiceName";
        this.MSsendBO.matchCase=false;
        this.MSsendBO.operator="startswith";
        this.MSsendBO.value="";
        this.MSsendBO.type="string";
      }
    }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].ManageServices_ServiceTab.Pagesize!=state.take)
        {
          this.arraycol[0].ManageServices_ServiceTab.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }
    this.MSsendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.getService();
  }
    
  public dataStateChange1(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.MSsendBO1.orderColumn = state.sorted[0].name;
        this.MSsendBO1.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.MSsendBO1.field=state.action.currentFilterObject.field;
        this.MSsendBO1.matchCase=state.action.currentFilterObject.matchCase;
        this.MSsendBO1.operator=state.action.currentFilterObject.operator;
        this.MSsendBO1.value=state.action.currentFilterObject.value.toString();
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.MSsendBO1.field="MasterServiceName";
        this.MSsendBO1.matchCase=false;
        this.MSsendBO1.operator="startswith";
        this.MSsendBO1.value="";
        this.MSsendBO1.type="string";
      }
    }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].ManageServices_ActivityTab.Pagesize!=state.take)
        {
          this.arraycol[0].ManageServices_ActivityTab.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }
    this.MSsendBO1.agencyId=parseInt(this.global.globalAgencyId);
    this.getActivity();
  }
  
  public dataStateChange2(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.MSsendBO2.orderColumn = state.sorted[0].name;
        this.MSsendBO2.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.MSsendBO2.field=state.action.currentFilterObject.field;
        this.MSsendBO2.matchCase=state.action.currentFilterObject.matchCase;
        this.MSsendBO2.operator=state.action.currentFilterObject.operator;
        this.MSsendBO2.value=state.action.currentFilterObject.value.toString();
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.MSsendBO2.field="MasterServiceName";
        this.MSsendBO2.matchCase=false;
        this.MSsendBO2.operator="startswith";
        this.MSsendBO2.value="";
        this.MSsendBO2.type="string";
      }
    }


    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].ManageServices_ServiceActivityTab.Pagesize!=state.take)
        {
          this.arraycol[0].ManageServices_ServiceActivityTab.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }  if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].List.Pagesize!=state.take)
        {
          this.arraycol[0].List.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }
    this.MSsendBO2.agencyId=parseInt(this.global.globalAgencyId);
    this.getServiceActivity();
  }

  ngOnInit() {
    this.conditionlist.push(new WhereCondition());
    this.filterSelect_service = 1;
    this.fp = new functionpermission();
    this.getService();
    // this.getActivity();
    // this.getServiceActivity();
    this.getTotalCount();
    this.getStatusDrop();
    this.getServiceTypeSatus();
    this.filepermissionget();
    this.toolbar = ['ColumnChooser'];
    this.filterOptions = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    console.log("Agency Id",this.global.globalAgencyId);
    this.getColumnwidth();
  }

  onActionBegin(args) { 
    
  }
  public onActionComplete(args) { 

    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.grid.columns.forEach(element => {
        if (element.visible == false && element.headerText != "Actions" && element.headerText != "") {
          hidearr.push(element.headerText);
        }
        if (element.visible == true && element.headerText != "Actions" && element.headerText != "") {
          showarr.push(element.headerText);
        }
      })

      console.log(hidearr, "hidearr")
      console.log(showarr, "showarr");
      console.log(this.arraycol, "arraycol");

      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {

        this.arraycol[0].ManageServices_ServiceTab.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].ManageServices_ServiceTab.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].ManageServices_ServiceTab.ShowColumns.length != count1 || this.arraycol[0].ManageServices_ServiceTab.HideColumns.length != count) {
          this.arraycol[0].ManageServices_ServiceTab.ShowColumns = showarr;
          this.arraycol[0].ManageServices_ServiceTab.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.MSsendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.MSsendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
  {
    this.MSsendBO.type=args.columnType
    console.log( this.MSsendBO)
  }
    
  }  
  
  public onActionComplete1(args) { 

    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.gridactivity.columns.forEach(element => {
        if (element.visible == false && element.headerText != "Actions" && element.headerText != "") {
          hidearr.push(element.headerText);
        }
        if (element.visible == true && element.headerText != "Actions" && element.headerText != "") {
          showarr.push(element.headerText);
        }
      })

      console.log(hidearr, "hidearr")
      console.log(showarr, "showarr");
      console.log(this.arraycol, "arraycol");

      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {

        this.arraycol[0].ManageServices_ActivityTab.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].ManageServices_ActivityTab.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].ManageServices_ActivityTab.ShowColumns.length != count1 || this.arraycol[0].ManageServices_ActivityTab.HideColumns.length != count) {
          this.arraycol[0].ManageServices_ActivityTab.ShowColumns = showarr;
          this.arraycol[0].ManageServices_ActivityTab.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.MSsendBO1.currentpageno = this.gridactivity.pagerModule.pagerObj.currentPage;
    this.MSsendBO1.pageitem= this.gridactivity.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
  {
    this.MSsendBO1.type=args.columnType
    console.log( this.MSsendBO1)
  }
    
  }  
  
  public onActionComplete2(args) { 

    if (args.requestType == "columnstate") {
      let hidearr = [];
      let showarr = [];
      this.gridserviceactivity.columns.forEach(element => {
        if (element.visible == false && element.headerText != "Actions" && element.headerText != "") {
          hidearr.push(element.headerText);
        }
        if (element.visible == true && element.headerText != "Actions" && element.headerText != "") {
          showarr.push(element.headerText);
        }
      })

      console.log(hidearr, "hidearr")
      console.log(showarr, "showarr");
      console.log(this.arraycol, "arraycol");

      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {

        this.arraycol[0].ManageServices_ServiceActivityTab.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].ManageServices_ServiceActivityTab.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].ManageServices_ServiceActivityTab.ShowColumns.length != count1 || this.arraycol[0].ManageServices_ServiceActivityTab.HideColumns.length != count) {
          this.arraycol[0].ManageServices_ServiceActivityTab.ShowColumns = showarr;
          this.arraycol[0].ManageServices_ServiceActivityTab.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.MSsendBO2.currentpageno = this.gridserviceactivity.pagerModule.pagerObj.currentPage;
    this.MSsendBO2.pageitem= this.gridserviceactivity.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
  {
    this.MSsendBO2.type=args.columnType
    console.log( this.MSsendBO2)
  }
    
  }  
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
   }
   showactivity() {
    this.gridactivity.columnChooserModule.openColumnChooser(); // give X and Y axis
   }
   showserviceact() {
    this.gridserviceactivity.columnChooserModule.openColumnChooser(); // give X and Y axis
   }

  Createupdate(type: string) {
    console.log("Modal Type==",this.ModalType);
    if (type == 'new') {
      this.ModalType ='new';
      // this.ServiceForm.value.Status = "1";
      this.ServiceForm.reset();
      this.ServiceForm.controls.Status.setValue(1);
      // this.ServiceForm.setValue({
      //   Status: this.Service.statusLid,
      //   // secondControllerName: this.initialValues.value2,
      //   // other controller names goes here
      // });
      this.Service = new ServiceList();
      this.Service.statusLid = 1;
      this.valueschangesService();
    } else {
      this.valueschangesService();
      this.ModalType = 'edit';
    }
  }
  
  CreateupdateActivity(type: string) {
    console.log("Modal Type==",this.ModalType);
    if (type == 'new') {
      this.ModalType ='new';
      this.ActivityForm.reset();
      this.ActivityForm.controls.Status.setValue(1);
      this.Activity = new ActivityList();
      this.Activity.statusLid = 1;
      this.valuchangesActivity();
    } else {
      this.valuchangesActivity();
      this.ModalType = 'edit';
    }
  }
  
  CreateupdateServiceActivity(type: string) {
    console.log("Modal Type==",this.ModalType);
    if (type == 'new') {
      this.ModalType ='new';
      this.ServiceActivityArray1 = [];
      this.selectedActivities = [];
      this.availableActivities = [];
      this.valuchangesServiceActivity();
    } else {
      this.valuchangesServiceActivity();
      this.ModalType = 'edit';
    }
  }

  selectActivityDetails(data: ActivityList){
    this.Activity = JSON.parse(JSON.stringify(data));
  }
  
  ServiceActivityArray1: any = [];
  selectServiceActivityDetails(data){
    this.ServiceActivityArray1.masterServiceId = data.masterServiceId.toString();
    this.getActivityTypeSatus(this.ServiceActivityArray1.masterServiceId);
  }

  ShowStatus: boolean = false;
  serviceFilter(filter) {
    this.filterSelect_service = parseInt(filter);
    if(this.filterSelect_service == 0){
      this.ShowStatus = true;
    }
    this.getService();
    this.getTotalCount();
  }
  
  ActivityFilter(filter) {
    this.filterSelect_service = parseInt(filter);
    if(this.filterSelect_service == 0){
      this.ShowStatus = true;
    }
    this.getActivity();
  }
  
  ServiceActivityFilter(filter) {
    this.filterSelect_service = parseInt(filter);
    if(this.filterSelect_service == 0){
      this.ShowStatus = true;
    }
    this.getServiceActivity();
  }

  Refresh() {
    this.MSsendBO.field="MasterServiceName";
    this.MSsendBO.value="";
    this.filterSelect_service = 1;
    this.getService();
  }
  
  RefreshActivity() {
    this.MSsendBO1.field="MasterActivityName";
    this.MSsendBO1.value="";
    this.filterSelect_service = 1;
    this.getActivity();
  }
  
  RefreshServiceActivity() {
    this.MSsendBO2.field="MasterServiceName";
    this.MSsendBO2.value="";
    this.getServiceActivity();
  }

  setDefaultValue(){
  }

  selectDetails(ServiceDetails: ServiceList) {
    this.Service = JSON.parse(JSON.stringify(ServiceDetails));
  }

  getService() {
    this.MSsendBO.LovCode=this.filterSelect_service;
    this.MSsendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.MSsendBO);
    console.log(" this.gethttp.",this.data);
    // this.MSsendBO.LovCode=this.filterSelect_service;
    // this.MSsendBO.pageitem=this.pagshort.itemperpage;
    // this.MSsendBO.currentpageno=this.pagshort.currentPgNo;
    // this.MSsendBO.orderColumn=this.pagshort.shortcolumn;
    // this.MSsendBO.orderType=this.pagshort.shortType;
    // this.MSsendBO.AgencyId=parseInt(this.global.globalAgencyId);
    
    // console.log("this.conditionlist.length",this.conditionlist.length);
    // if(this.conditionlist.length!=0){
    //   this.MSsendBO.conitionBO=this.conditionlist;
    // }
    // else{
    //   this.conditionlist.push(new WhereCondition());
    //   this.MSsendBO.conitionBO=this.conditionlist;
    // }
    // console.log("this.MSsendBO",this.MSsendBO);
    // this.httpService.getServiceList(this.MSsendBO).subscribe((data: ServiceList[]) => {
    //   this.ServiceArray = data;
    //   console.log(data);
    // })
  }

  getActivity() {
    this.MSsendBO1.LovCode=this.filterSelect_service;
    this.MSsendBO1.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp1.execute(this.MSsendBO1);
    console.log(" this.gethttp.",this.data1);
  }
  
  getServiceActivity() {
    this.MSsendBO2.LovCode=this.filterSelect_service;
    this.MSsendBO2.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp2.execute(this.MSsendBO2);
    console.log(" this.gethttp.",this.data2);
  }

  getTotalCount() {
    let params = new URLSearchParams();
    params.append("LovCode", this.filterSelect_service.toString());
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.gettotalCount(params).subscribe((data: number) => {
      console.log("total count==", data);
      this.TotalCount = data;
    });
  }

  getServiceTypeSatus() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getServiceStatusList(params).subscribe((data: any) => {
      console.log("ServiceActivityArray data==", data);
      this.ServiceActivityArray = data;
      console.log("ServiceActivityArray",data);
      this.ServiceActivityArray.forEach(element => {
        element.label = element.name;
        element.value = element.id.toString();
      })
    });
  }
  
  selectedServiceID: string;
  availableActivities: any = [];
  selectedActivities: any = [];
  getActivityTypeSatus(serviceId) {
    let params = new URLSearchParams();
    params.append("serviceId", serviceId);
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getActivityStatusList(params).subscribe((data: any) => {
      console.log("ServiceActivityArray data==", data);
      this.availableActivities = data.availableActivityPair;
      this.selectedActivities = data.selectedAcitivityPair;
    });
  }

  getStatusDrop() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatusList(params).subscribe((data: DropList[]) => {
      this.StatusList = data;
      console.log(data);
    })
  }


  SaveOrUpdateService() {
    if(this.ModalType == 'new') {
      this.Service.id = 0;
    }
    console.log("Agency Id",this.global.globalAgencyId);
    this.Service.billingLid = null;
    this.Service.statusLid = Math.floor(Number(this.Service.statusLid));
    this.Service.agencyId = parseInt(this.global.globalAgencyId);
    console.log("this.Service",this.Service);
    this.httpService.saveupdateService(this.Service).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        this.valueschangesService();
        //====================== sucess message =============
        if (this.ModalType == 'new') {
          this.toastrService.success('Service saved successfully', 'Service Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getService();
          this.getTotalCount();
          document.getElementById('modal').click();
        } else {
          this.toastrService.success('Service updated successfully', 'Service Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getService();
          this.getTotalCount();
          document.getElementById('modal').click();
        }
         
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }
  
  SaveOrUpdateActivity() {
    if(this.ModalType == 'new') {
      this.Activity.id = 0;
    }
    console.log("Agency Id",this.global.globalAgencyId);
    this.Activity.statusLid = Math.floor(Number(this.Activity.statusLid));
    this.Activity.agencyId = parseInt(this.global.globalAgencyId);
    console.log("this.Service",this.Service);
    this.httpService.saveupdateActivity(this.Activity).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        this.valuchangesActivity();
        //====================== sucess message =============
        if (this.ModalType == 'new') {
          this.toastrService.success('Activity saved successfully', 'Activity Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getActivity();
          document.getElementById('Activitymodal').click();
        } else {
          this.toastrService.success('Activity updated successfully', 'Activity Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getActivity();
          document.getElementById('Activitymodal').click();
        }
         
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }
  
  SaveOrUpdateServiceActivity(ServiceActivityArray1) {
    ServiceActivityArray1.masterServiceId = Math.floor(Number(ServiceActivityArray1.masterServiceId));
    if (this.selectedActivities.length != 0) {
      this.selectedActivities.forEach(element => {
        element.masterServiceId = ServiceActivityArray1.masterServiceId,
          element.id = 0,
          element.masterActivityId = element.Key,
          element.agencyId = parseInt(this.global.globalAgencyId)
      })
    }
    else {
      this.selectedActivities.push({
        masterServiceId: ServiceActivityArray1.masterServiceId
      })
    }
    console.log("selected activities", this.selectedActivities);
    this.httpService.saveupdateServiceActivity(this.selectedActivities).subscribe((data: any) => {
      console.log("====save update=========", data);
      if (data) {
        this.valuchangesServiceActivity();
        //====================== sucess message =============
        if (this.ModalType == 'new') {
          this.toastrService.success('ServiceActivity saved successfully', 'ServiceActivity Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          document.getElementById('ServiceActivitymodal').click();
        } else {
          this.toastrService.success('ServiceActivity updated successfully', 'ServiceActivity Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          document.getElementById('ServiceActivitymodal').click();
        }
         this.getServiceActivity();
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }


  deleteStatus() {
    // let url = "api/MasterService/DeleteMasterService/"+this.Service.id;
    // document.getElementById('deleteStatusmodal').click();
    // this.http.delete(url).subscribe((data: any) => {
    //   // this.toastrService.show(
    //   //   "GroupPayor has been Deleted Successfully",
    //   //   "GroupPayor Deleted ",
    //   //   { status }), 8000
    //   // ref.close();
    //   this.toastrService.error('Deleted SuccessFully'),8000;

    //   this.getService();
    //   this.getTotalCount();
    // },(err: any) => {
    //   if(err){
    //     console.log("err.error",err.error);
    //     this.toastrService.error(err.error,'Error'),8000;
    //   }
    // )
    this.httpService.DeleteStatus(this.Service.id).subscribe((data: any) => {
      if (data) {

        // const index: number = this.ServiceArray.indexOf(this.Service);
        // if (index !== -1) {
        //   this.ServiceArray.splice(index,1);
        // }|

        console.log("=========== delete function =========", data);
        document.getElementById('deleteservicemodal').click();
        this.getService();
        this.getTotalCount();
        this.toastrService.success('Service deleted successfully', 'Service deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.getService();
      }

    },(err: any) => {
      if(err){
    let val=    err.error.match(/violates foreign key constraint/g)

        console.log("err.error",val.length);
        if(val.length>0)
        {
          let val1=err.error.split('table');
          console.log(val1);
          this.toastrService.error('Service already used in '+val1[2],'Error'),8000;
        }
        else{
          this.toastrService.error(err.error,'Error'),8000;
        }
        
      }
    }
    );
  }
  
  deleteActivity() {
    this.httpService.DeleteActivity(this.Activity.id).subscribe((data: any) => {
      if (data) {
        console.log("=========== delete function =========", data);
        document.getElementById('deleteActivitymodal').click();
        this.getActivity();
        this.toastrService.success('Activity deleted successfully', 'Activity Deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.getActivity();
      }

    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  filepermissionget() {``
    let params = new URLSearchParams();
    params.append("pagecode", "ManageServices");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
  }

 valueschangesService() {
   this.valuechangeService = {
    Code: 0,
    Modifier1: 0,
    Modifier2: 0,
    Modifier3: 0,
    Modifier4: 0,
    Name: 0,
    Description: 0,
    BillingUnit: 0,
    Status: 0,
    Ratio: 0,
   }
 }

 ActivityBool: boolean = false;
 ServiceActivityBool: boolean = false;
 valuchangesActivity(){
   this.ActivityBool = false;
 }
 checkpopActivity(){
   this.ActivityBool = true;
 }
 
 valuchangesServiceActivity(){
   this.ServiceActivityBool = false;
 }
 checkpopServiceActivity(){
   this.ServiceActivityBool = true;
 }
 checkpopupService(value) {
   if (value == "Code") {
     this.valuechangeService.Code++;
   }
   if (value == "Modifier1") {
     this.valuechangeService.Modifier1++;
   }
   if (value == "Modifier2") {
    this.valuechangeService.Modifier2++;
  } if (value == "Modifier3") {
    this.valuechangeService.Modifier3++;
  } if (value == "Modifier4") {
    this.valuechangeService.Modifier4++;
  } if (value == "Name") {
    this.valuechangeService.Name++;
  } if (value == "Description") {
    this.valuechangeService.Description++;
  }if (value == "BillingUnit") {
    this.valuechangeService.BillingUnit++;
  }if (value == "Status") {
    this.valuechangeService.Status++;
  }if (value == "Ratio") {
    this.valuechangeService.Ratio++;
  }
 }
 openDialogService() {
  if (this.valuechangeService.Code > 1 || this.valuechangeService.Modifier1 > 1 || this.valuechangeService.Modifier2 > 1
   || this.valuechangeService.Modifier3 > 1|| this.valuechangeService.Modifier4 > 1|| this.valuechangeService.Name > 1
   || this.valuechangeService.Description > 1|| this.valuechangeService.BillingUnit > 1|| this.valuechangeService.Status > 1|| this.valuechangeService.Ratio > 1
   ) {
    document.getElementById('cancelmodal').click();
  }
  else {
    // this.ServiceForm.markAsValid;
    // this.ServiceForm.markAsPristine;
    document.getElementById('openModal').click();
  }
  }
 
  openDialogActivity() {
    console.log("ActivityBool",this.ActivityBool);
  if (this.ActivityBool == true) {
    document.getElementById('cancelmodal').click();
  }
  else {
    // this.ServiceForm.markAsValid;
    // this.ServiceForm.markAsPristine;
    document.getElementById('openModal1').click();
  }
  }
  
  openDialogServiceActivity() {
    console.log("ServiceActivityBool",this.ServiceActivityBool);
  if (this.ServiceActivityBool == true) {
    document.getElementById('cancelmodal').click();
  }
  else {
    // this.ServiceForm.markAsValid;
    // this.ServiceForm.markAsPristine;
    document.getElementById('openModal2').click();
  }
  }

  closeAddUpdateModal(){
    // this.ServiceForm.markAsPristine;
    // this.ServiceForm.markAsValid;
    document.getElementById('cancelmodal').click();
    if(this.selectedtab=='Service')
    {
      document.getElementById('openModal').click();
    }
    if(this.selectedtab=='Activity')
    {
      document.getElementById('openModal1').click();
    }
    if(this.selectedtab=='Serviceactivity')
    {
      document.getElementById('openModal2').click();
    }
  }
  //============================== Tooltip =========================================================//
headerCellInfo(args) { 

  const toolcontent = args.cell.column.headerText; 
  const tooltip: Tooltip = new Tooltip({ 
    content: toolcontent 
}); 
 tooltip.appendTo(args.node); 
 
}
tooltip(args: QueryCellInfoEventArgs) {
 if(args.column.field!=null)
 {
  if(args.data[args.column.field]!=null)
  {
   const tooltip: Tooltip = new Tooltip({
     content: args.data[args.column.field].toString(),
     position:'RightCenter',
     

 }, args.cell as HTMLTableCellElement);
 }
}
}
selecttab(val)
{
  this.selectedtab=val;
}
onResize(args) {
  const column = this.grid.getColumnByField(args.column.field)
  column.width = args.column.width;
  this.ColumnArray_service.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  this.SaveColumnwidth();
}    

onResizeActivity(args) {
  const column = this.gridactivity.getColumnByField(args.column.field)
  column.width = args.column.width;
  this.ColumnArray_activity.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  this.SaveColumnwidth();
} 

onResizeServiceActivity(args) {
  const column = this.gridserviceactivity.getColumnByField(args.column.field)
  column.width = args.column.width;
  this.ColumnArray_serviceactivity.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  this.SaveColumnwidth();
} 
getColumnwidth() {
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);

    console.log("helo",JSON.parse(data.column));
    this.ColumnArray_service = JSON.parse(data.column)[0].ManageServices_ServiceTab.Columns;
    this.ColumnArray_activity = JSON.parse(data.column)[0].ManageServices_ActivityTab.Columns;
    this.ColumnArray_serviceactivity = JSON.parse(data.column)[0].ManageServices_ServiceActivityTab.Columns;
   

    let showcol = JSON.parse(data.column)[0].ManageServices_ServiceTab.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].ManageServices_ServiceTab.HideColumns
  
    this.grid.hideColumns(hidecol);

    let showcol_activity = JSON.parse(data.column)[0].ManageServices_ActivityTab.ShowColumns;
    let hidecol_activity = JSON.parse(data.column)[0].ManageServices_ActivityTab.HideColumns

    let showcol_serviceactivity = JSON.parse(data.column)[0].ManageServices_ServiceActivityTab.ShowColumns;
    let hidecol_serviceactivity= JSON.parse(data.column)[0].ManageServices_ServiceActivityTab.HideColumns
  
    this.gridactivity.hideColumns(hidecol_activity);
    this.gridserviceactivity.hideColumns(hidecol_serviceactivity);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].ManageServices_ServiceTab.Pagesize
    this.gridactivity.pageSettings.pageSize = JSON.parse(data.column)[0].ManageServices_ActivityTab.Pagesize
    this.gridserviceactivity.pageSettings.pageSize = JSON.parse(data.column)[0].ManageServices_ServiceActivityTab.Pagesize

    this.ColumnArray_service.forEach(element => {



      if (element.column == 'Code') {

        const column = this.grid.getColumnByField('masterServiceCode'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Name') {

        const column1 = this.grid.getColumnByField('masterServiceName'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Modifier 1') {

        const column2 = this.grid.getColumnByField('masterServiceModifier1'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Modifier 2') {

        const column3 = this.grid.getColumnByField('masterServiceModifier2'); // get the JSON object of the column corresponding to the field name
        // column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Modifier 3') {

        const column4 = this.grid.getColumnByField('masterServiceModifier3'); // get the JSON object of the column corresponding to the field name
        // column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Modifier 4') {

        const column5 = this.grid.getColumnByField('masterServiceModifier4'); // get the JSON object of the column corresponding to the field name
        // column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Description') {

        const column5 = this.grid.getColumnByField('serviceDescription'); // get the JSON object of the column corresponding to the field name
        // column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Ratio') {

        const column6 = this.grid.getColumnByField('ratio'); // get the JSON object of the column corresponding to the field name
        // column6.headerText = element.column;
        column6.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Status') {

        const column7 = this.grid.getColumnByUid('status'); // get the JSON object of the column corresponding to the field name
        // column7.headerText = element.column;
        column7.width = element.width;

        this.grid.refreshHeader();
      }
      
      else if (element.column == 'Actions') {

        const column8 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column8.headerText = element.column;
        column8.width = element.width;
        this.grid.refreshHeader();

      }
    }); 
    this.ColumnArray_activity.forEach(element => {



      if (element.column == 'Code') {

        const column = this.gridactivity.getColumnByField('masterActivityCode'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.gridactivity.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Name') {

        const column1 = this.gridactivity.getColumnByField('masterActivityName'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.gridactivity.refreshHeader();
      }
      if (element.column == 'Status') {

        const column2 = this.gridactivity.getColumnByUid('status'); // get the JSON object of the column corresponding to the field name
        // column2.headerText = element.column;
        column2.width = element.width;

        this.gridactivity.refreshHeader();
      }
   
      else if (element.column == 'Actions') {

        const column8 = this.gridactivity.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column8.headerText = element.column;
        column8.width = element.width;
        this.gridactivity.refreshHeader();

      }
    }); 

    this.ColumnArray_serviceactivity.forEach(element => {



      if (element.column == 'Service') {

        const column = this.gridactivity.getColumnByField('masterServiceName'); // get the JSON object of the column corresponding to the field name
        // column.headerText = element.column;
        column.width = element.width;

        this.gridactivity.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Actions') {

        const column1 = this.gridactivity.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        // column1.headerText = element.column;
        column1.width = element.width;

        this.gridactivity.refreshHeader();
      }
     
    }); 



  });
}
SaveColumnwidth() {
  this.arraycol[0].ManageServices_ServiceTab.Columns = this.ColumnArray_service;
  this.arraycol[0].ManageServices_ActivityTab.Columns = this.ColumnArray_activity;
  this.arraycol[0].ManageServices_ServiceActivityTab.Columns = this.ColumnArray_serviceactivity;

  this.arraycol[0].ManageServices_ServiceTab.Pagesize = this.grid.pageSettings.pageSize;
  this.arraycol[0].ManageServices_ActivityTab.Pagesize = this.gridactivity.pageSettings.pageSize;
  this.arraycol[0].ManageServices_ServiceActivityTab.Pagesize = this.gridserviceactivity.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID); 
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}
