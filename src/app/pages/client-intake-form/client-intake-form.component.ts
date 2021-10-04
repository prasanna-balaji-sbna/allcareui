import { Component, OnInit, ViewChild, TemplateRef, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClientIntakeFormService } from './client-intake-form.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalComponent } from 'src/app/global/global.component';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { IntakeClientBO, GetIntakePendingBO, IntakeApprovalBO, getIntakeBO, WhereCondition, sortingObj, functionpermission, ColumnChangeBO, columnWidth } from './client-intake-form.model';
import { GridComponent, FilterSettingsModel, IFilter, SearchSettingsModel, ToolbarItems, PageSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DateService } from 'src/app/date.service';
import { PhoneNumberFormatService } from 'src/app/phoneNumberFormat.service ';
import { DatePipe } from '@angular/common';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';
import { Observable } from 'rxjs/Observable';
import { GetHTTPIntakeService } from './Client-intake-table.service';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { parse } from 'path';
import { stat } from 'fs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonHttpService } from 'src/app/common.service';
//import { ColumnChangeBO, columnWidth } from '../list/list.model';

declare var $:any;
@Component({
  selector: 'app-client-intake-form',
  templateUrl: './client-intake-form.component.html',
  styleUrls: ['./client-intake-form.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientIntakeFormComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  filterOptions: FilterSettingsModel;
  // grid: GridComponent;
  // filterOptions: FilterSettingsModel;
  filter: IFilter;
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  ////========================Variable Declarations=====================///////////
  public statusList=[];
  public ClientList=[];
  public CurrentassessmentList = [];
  public staffingList=[]
  public CurrentagencyList = [];

  // PendingArray:IntakeClientBO[]
  cliList:any={};
  roleid: any;
  Userid: any;
  reasonForRejection: any;
  statuscode: any;
  RejectedArray = [];
  ApprovedArray = [];
  PendingArray =[];
  isPending:boolean=false;
  isApproved:boolean=false;
  isRej:boolean=false;
  status: any;
  filters: any = [];
  intakeList: IntakeClientBO= new IntakeClientBO();
  warning1: any = false;
  err1: any = "";
  pageSize: any = 20;
  pendingtotal: any;
  apporvedtotal: any;
  rejectedtotal: any;
  pendingpage: any = 1;
  approvedpage: any = 1;
  rejectedpage: any = 1;
  pendingperpage: any = 20;
  approvedperpage: any = 20;
  rejectedperpage: any = 20;
  SortColum: any = "ClientName";
  OrderType: any = "asc";
  genderList: any;
  ClientIntakeDataForm: FormGroup;
  NewIntake: boolean=false;
  SelectedStatus: any;

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  // newintakeform: boolean = false;
  valuechange: boolean = false;
  clientvaluechange: any = [];
  EditIntake:boolean=false;
  IntakeApprovalBO:IntakeApprovalBO=new IntakeApprovalBO()
client:any;
fp: functionpermission;



 ////////////////////////date picker///////////////////
 today = new Date();
    public myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'mm/dd/yyyy',
      showClearDateBtn: false,
      editableDateField: true
    };
      public mytime: Date = new Date();
      currentYear: any = this.mytime.getUTCFullYear();
      currentDate: any = this.mytime.getUTCDate();
      currentMonth: any = this.mytime.getUTCMonth() + 1; //months from 1-12
      
    public myDatePickerOptionsDate: IMyDpOptions = {
      dateFormat: 'mm/dd/yyyy',
      showClearDateBtn: false,
      editableDateField: true,
      disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
  
    };
    public myDatePickerOptionsDOB: IMyDpOptions = {
      dateFormat: 'mm/dd/yyyy',
      disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
      showClearDateBtn: false,
      editableDateField: true,
      
    };
      // @ViewChild('grid') public grid: GridComponent;
  initialPage: PageSettingsModel; 
  public filterSettings: object;

  TotalCount: number;  
 
  // SearchColumn:string ='ListCode';
    // SearchText:string ='';
    public pageSizes: number[] = [10, 15, 20, 50, 100, 250]; 
    //============================Data manager===============================//
    public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public Pendingdata: Observable<DataStateChangeEventArgs>;
  public Approveddata: Observable<DataStateChangeEventArgs>;
  public rejectdata: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  ListIntakeBO:getIntakeBO = new getIntakeBO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  sorting = new sortingObj();
  public formatOptions: object;
  stateList:any=[]

  constructor(public dateservice: DateService ,@Inject(GetHTTPIntakeService) public gethttp:GetHTTPIntakeService,private ngxService:NgxUiLoaderService, public phone: PhoneNumberFormatService, private datepipe: DatePipe,private formBuilder: FormBuilder,public http: HttpClient,public httpService:ClientIntakeFormService,public toastrService: ToastrService,

  private ref: ChangeDetectorRef, public global: GlobalComponent,public commonhttp: CommonHttpService) {
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // },10);


      this.Pendingdata=gethttp;
      this.Approveddata=gethttp;
      this.rejectdata=gethttp;


      this.ClientIntakeDataForm = this.formBuilder.group({      
        clientName:  ['', Validators.required],
        lastName:  ['', Validators.required],
        genderLid:  ['', Validators.required],
        date: [' ', Validators.required],
        dOB: [' ',Validators.required],
        age:  ['', ],
        email:  ['',Validators.email],
        phone:  ['',  [Validators.minLength(14), Validators.minLength(14)]],
        street:  ['',],
        aptNumber:  ['',],
        state:  ['',],
        county:  ['',],
        city:  ['',],
        zipcode:  ['', [Validators.maxLength(5)]],
        responsibleParty:  ['',],
        responsiblePartyPhone:  ['', [Validators.minLength(14), Validators.minLength(14)]],
        refferalPhone:  [''],
        hoursaday:  ['',],
        currentAgency:  ['',],
        reasonForLeaving:  ['',],
        needDaysAndShift:  ['',],
        followup:  ['',],
        pendingAssessment:  ['',],
        currentAssessmentLid:  ['',],
        currentlywithanagencyLid:  ['',],
        staffingLid:  ['',],
       
  
  
      });
    }

  ngOnInit(): void {
    this.commonhttp.getJSON().subscribe(data => {
     
      this.stateList=data;
  });
    this.filterSettings = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};
    this.getstatus()
    this.getClient()
    this.getGender()
    this.getcurrentassessment()
    this.getstaffing()
    this.getcurrentagency()
    this.filterChanged("Pending");
    this.getpendinglistItem()
    this.filepermissionget()
    this.fp = new functionpermission()
    this.intakeList.date = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    this.intakeList.dOB = new Date(new Date().toLocaleDateString() + " " + "00:00:00").toLocaleDateString();
    
  }
  ///////////////////////////////////////////////////data state////////////////////////////////////////////////////

  type:string="";
  public dataStateChange(state): void {
 // console.log("Stats chage",state);    
  this.type = (state.action.requestType).toString();
  if(this.type!="filterchoicerequest"){
    if ((state.sorted || []).length) {
      this.ListIntakeBO.orderColumn = state.sorted[0].name;
      this.ListIntakeBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
    }   
   }
  if(this.type == "filtering" && state.action.action!="clearFilter"){
      this.ListIntakeBO.field=state.action.currentFilterObject.field;
      this.ListIntakeBO.matchCase=state.action.currentFilterObject.matchCase;
      this.ListIntakeBO.operator=state.action.currentFilterObject.operator;
      this.ListIntakeBO.value=state.action.currentFilterObject.value;
  }
  
  else{
    if(this.type == "filtering" && state.action.action=="clearFilter"){
      this.ListIntakeBO.field="clientName";
      this.ListIntakeBO.matchCase=false;
      this.ListIntakeBO.operator="startswith";
      this.ListIntakeBO.value="";
    }
  }
 
  if (this.type == "paging" && state.action.name == "actionBegin") {
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].Client_Intake_form_PendingList.Pagesize!=state.take)
      {
        this.arraycol[0].Client_Intake_form_PendingList.Pagesize = state.take
        this.SaveColumnwidth();
      // }

    }
  
  }
  }
  this.ListIntakeBO.agencyId=this.global.globalAgencyId;
  this.getpendinglistItem();

}
////////////////////////////////////////////Action Complete Event///////////////////////////////////////////
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
if(this.arraycol.length > 0)
{
this.arraycol[0].Client_Intake_form_PendingList.ShowColumns.forEach(old => {
  showarr.forEach(element => {
    if (old == element) {
      count1 = count1 + 1;
    }
  });

});

this.arraycol[0].Client_Intake_form_PendingList.HideColumns.forEach(old => {
  hidearr.forEach(element => {
    if (old == element) {
      count = count + 1;
    }
  });

});
console.log(count, count1, "count");


if (this.arraycol[0].Client_Intake_form_PendingList.ShowColumns.length != count1 || this.arraycol[0].Client_Intake_form_PendingList.HideColumns.length != count) {
  this.arraycol[0].Client_Intake_form_PendingList.ShowColumns = showarr;
  this.arraycol[0].Client_Intake_form_PendingList.HideColumns = hidearr;
  this.SaveColumnwidth();
}

}
   
    }
  }
  this.ListIntakeBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
  this.ListIntakeBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
  this.conditionlist=[];
  if(args.requestType==="filtering" && args.action==="filter"){
    args.columns.forEach(element => {
      this.conditionlist.push(element.properties);
     //console.log("args type",this.conditionlist);
    }); 
  } 
  
} 
  ////===================get status Dropdown=================////

  getstatus() {

    let params = new URLSearchParams();
    params.append("Code", "INTAKESTATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatus(params).subscribe((data: any) => {
      this.statusList = data;
     //console.log("statusList",this.statusList);           
      let val = data.filter(s => s.Value == "Pending");
      this.status = val[0].Value; 
    },
      err => {
        //  alert(err.error)
      });
  }
  ////===================get Client Dropdown=================////

  getClient() {
    let param = new URLSearchParams();
    param.append("agencyId", this.global.globalAgencyId)
    this.httpService.getClient(param).subscribe((data: any) => {
      this.ClientList = data;
     //console.log("ClientList",this.ClientList)
      this.ClientList.forEach(element => {
        element.label = element.Value;
        element.value = element.Key;
      });
    },
      err => {
        //alert(err.error)
      });
  }
  /////=================================================================/////
//============================== Tooltip For Header =========================================================//
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
////========================Filter Changes function===========================//

filterChanged(filteroption) {
 //console.log(this.filters.client);

  // this.clearvaluechange()
 //console.log(this.filters.start);
 //console.log(this.filters.end);
  if ((this.filters.start == undefined || this.filters.start == "") &&
    (this.filters.end != undefined && this.filters.end != "") ||
    ((this.filters.end == undefined || this.filters.end == "") && (this.filters.start != undefined && this.filters.start != ""))) {
    this.ListIntakeBO.startDate=this.filters.start;
    this.ListIntakeBO.endDate=this.filters.end;

    this.err1 = "select start and end date ";
    this.warning1 = true;
    setTimeout(() => {
      this.warning1 = false;
      this.err1 = " ";
    }, 3000);
    return;
  }
  if (this.filters.start > this.filters.end) {
    this.err1 = "End date should be grater than Start date ";
    this.warning1 = true;
    setTimeout(() => {
      this.warning1 = false;
      this.err1 = " ";
    }, 3000);
    return;
  }
  if (this.filters.client == undefined) {
    this.filters.client = "";
  }
  if (this.filters.start == undefined) {
    this.filters.start = "";
  }
  if (this.filters.end == undefined) {
    this.filters.end = "";
  }
  if (filteroption == "Pending") {
    // this.Userid = 12;
   
    // this.ListIntakeBO.client=this.filters.client
    ////console.log(this.ListIntakeBO.client);
    if(this.filters.client!=null)
    {
      this.ListIntakeBO.client=parseInt(this.client)
     //console.log(this.ListIntakeBO.client);
      
    }
    // this.ListIntakeBO.startDate=this.filters.start;
    // this.ListIntakeBO.endDate=this.filters.end;
    this.reasonForRejection = null;
    this.statuscode = null;
    this.isPending = true;
    this.isApproved = false;
    this.isRej = false;
    this.getpendinglist();
  }
  if (filteroption == "Rejected") {

    this.isApproved = false;
    this.isRej = true;
    this.isPending = false;
    this.reasonForRejection;
    this.getrejectedlist();
  }
  if (filteroption == "Approved") {
    this.Userid = 12;
    this.roleid = "ADMIN";
    // this.reasonforrejection=null;
    // this.statuscode="APPROVED";
    this.isApproved = true;
    this.isRej = false;
    this.isPending = false;
    this.getapprovedlist();
  }
}

/////===========================data change========================================//
newdates(event, name, refname) {
  
  if (name == "inputchage") {
    let val = this.dateservice.inputFeildchange(event);
    if (val != undefined) {
      let val1 = this.dateservice.inputFeildchange(event);
      if (refname == "DOB") {
        this.intakeList.dOB = val1;
      }
      if (refname == "Create") {
        this.intakeList.date = val1;
      }
      if (refname == "Start") {
        this.filters.start = val1;
      }
      if (refname == "End") {
        this.filters.end = val1;
      }
    }
  }
  if (name == "datechagned") {
    let val = this.dateservice.Datechange(event);
    if (val != undefined) {
      let val1 = this.dateservice.Datechange(event);
      if (refname == "DOB") {
        //  this.DOBvaluechange++;
        this.intakeList.dOB = val1;
       //console.log("date", this.intakeList.dOB)
        this.calculateAge(this.intakeList.dOB);
      }
      if (refname == "Create") {
        //   this.intakevaluechange++;
        this.intakeList.date = val1;
      }

      if (refname == "Start") {
        this.filters.start = val1;
      }
      if (refname == "End") {
        this.filters.end = val1;
      }
    }
  }
}
newdates1(event, names) {
  if (names == "inputchage") {
  
    let val = this.dateservice.inputFeildchange(event);
    if (val != undefined) {
      let val1 = this.dateservice.inputFeildchange(event);
     
        this.intakeList.date = val1;
    } 
  }
  if (names == "datechagned") {
    let val = this.dateservice.Datechange(event);
    if (val != undefined) {
      let val1 = this.dateservice.Datechange(event);
      
        this.intakeList.date = val1;
      
    }
  }
  }
////////////=======================refresh=======================================/////////////////
  /////////////////////////////refresh/////////////////////////////////
  Refresh() {
    //this.clearvaluechange();
    this.ListIntakeBO.orderColumn="clientName";
    this.ListIntakeBO.orderType="asc";
    this.ListIntakeBO.field="clientName";
   //console.log(this.filters);
   //console.log("refresh");
    this.valueschanges();
    this.getClient();
    this.filters = [];
    this.status = "Pending";
    this.filterChanged("Pending");
     this.client=''
     this.getpendinglist()
   

  }
  ///========================Column Selector=========================//////////////////////////////
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  //======================================Table data===========================//////////////////////
  getapprovedlist() {
    this.getapprovedlisttotal();
    this.getapprovedlistitem();
  }
  getapprovedlisttotal() {
    this.global.loading = true;
    let url = "api/IntakeApproval/getapprovedlisttotal?";
    let params = new URLSearchParams();
    params.append("StartDate", this.filters.start);
    params.append("EndDate", this.filters.end);
    params.append("Client", this.filters.client);
    params.append("agency", this.global.globalAgencyId)
    this.http.get(url + params).subscribe((data: any) => {
      this.apporvedtotal = data;
      this.global.loading = false;
     //console.log("apporvedtotal",this.apporvedtotal);
   // this.apporvedtotal.phone=this.phone.phoneNoToFormat(data.phone)
    },
      err => {
        this.global.loading = false;

        // alert(err.error)
      });
  }
  getapprovedlistitem() {
    // this.global.loading = true;
    // let url = "api/IntakeApproval/getapprovedlist?";
    // let params = new URLSearchParams();
    // params.append("StartDate", this.filters.start);
    // params.append("Pageitem", this.approvedperpage);
    // params.append("Currentpageno", this.approvedpage.toString());
    // params.append("OrderColumn", this.SortColum);
    // params.append("EndDate", this.filters.end);
    // params.append("Client", this.filters.client);
    // params.append("OrderType", this.OrderType);
    // params.append("agency", this.global.globalAgencyId)
    //     //  params.append("AgencyID", reasonforrejection);
    // this.http.get(url + params).subscribe((data: any) => {
    //   this.global.loading = false;
    //   this.ApprovedArray = data;
    //   console.log("ApprovedArray",data);
    //   this.ApprovedArray.forEach(s =>
    //      s.phone = (s.phone != undefined || s.phone != null ? this.phone.phoneNoToFormat(s.phone) : null),
         
     
    //      );
    //      this.ApprovedArray.forEach(s => s.date = this.datepipe.transform(s.date, 'MM/dd/yyyy'));
    //      this.ApprovedArray.forEach(s => s.dOB = this.datepipe.transform(s.dOB, 'MM/dd/yyyy'));
    // },
    //   err => {
    //     this.global.loading = false;

    //     // alert(err.error)
    //   });
   this.ngxService.start();
   // console.log(this.ListIntakeBO.agencyId);
    // this.ListIntakeBO.startDate=this.filters.start
    // this.ListIntakeBO.startDate=this.filters.end
    this.ListIntakeBO.role=localStorage.getItem('SelectedRole')
    this.ListIntakeBO.userid=parseInt(this.global.userID);
    this.ListIntakeBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.executeApprove(this.ListIntakeBO);    
    let count=0;
    this.Approveddata.subscribe((data:any)=>{
    
     
        count = count+1;
       
        if(data!=null&&data!=undefined && count ==1)
        {
          this.getColumnwidth();
        }
      
    })
   //console.log(" this.gethttp.Approveddata",this.Approveddata);
  }
  /////////////////////////rejected List////////////////////////////////////////////////////
  getrejectedlisttotal() {
    this.global.loading = true;
    let url = "api/IntakeApproval/getrejectedlisttotal?";
    let params = new URLSearchParams();
    params.append("StartDate", this.filters.start);
    params.append("EndDate", this.filters.end);
    params.append("Client", this.filters.client);
    params.append("agency", this.global.globalAgencyId)
    this.http.get(url + params).subscribe((data: any) => {
      this.rejectedtotal = data;
     //console.log("rejectedtotal",data);     
      this.global.loading = false;

    },
      err => {
        this.global.loading = false;

        //alert(err.error)
      });
  }
  getrejectedlistitem() {
    // this.global.loading = true;
    // let url = "api/IntakeApproval/getrejectedlist?";
    // let params = new URLSearchParams();
    // params.append("StartDate", this.filters.start);
    // params.append("Pageitem", this.rejectedperpage);
    // params.append("Currentpageno", this.rejectedpage.toString());
    // params.append("OrderColumn", this.SortColum);
    // params.append("EndDate", this.filters.end);
    // params.append("Client", this.filters.client);
    // params.append("OrderType", this.OrderType);
    // params.append("agency", this.global.globalAgencyId)
    // this.http.get(url + params).subscribe((data: any) => {
    //   this.global.loading = false;
    //   this.RejectedArray = data;
    //   console.log("RejectedArray",data);     
    //   this.RejectedArray.forEach(s => s.phone = (s.phone != undefined || s.phone != null ? this.phone.phoneNoToFormat(s.phone) : null));
    //   this.RejectedArray.forEach(s => s.responsiblePartyPhone = (s.responsiblePartyPhone != undefined || s.responsiblePartyPhone != null ? this.phone.phoneNoToFormat(s.responsiblePartyPhone) : null));
    //   this.RejectedArray.forEach(s => s.date = this.datepipe.transform(s.date, 'MM/dd/yyyy'));
    //   this.RejectedArray.forEach(s => s.dOB = this.datepipe.transform(s.dOB, 'MM/dd/yyyy'));

    // },
    //   err => {
    //     this.global.loading = false;

    //     //alert(err.error)
    //   });
   this.ngxService.start();
    console.log(this.ListIntakeBO.agencyId);
    // this.ListIntakeBO.startDate=this.filters.start
    // this.ListIntakeBO.startDate=this.filters.end
    this.ListIntakeBO.role=localStorage.getItem('SelectedRole')
    this.ListIntakeBO.userid=parseInt(this.global.userID);
    this.ListIntakeBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.executeReject(this.ListIntakeBO); 
     let count=0;
    this.rejectdata.subscribe((data:any)=>{
      count= count+1;
      if(data!=null&&data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
    }
      ) 
    
   //console.log(" this.gethttp.rejectdata",this.rejectdata);
  }
  getrejectedlist() {

    this.getrejectedlisttotal();
    this.getrejectedlistitem();
  }

  /////////////////////////pending List////////////////////////////////////////////////////
  getpendinglist() {
    this.getpendinglisttoltal();
    this.getpendinglistItem();

  }
  getpendinglisttoltal() {
    this.global.loading = true;
    let url = "api/IntakeApproval/getpendinglisttotal?";
    let params = new URLSearchParams();

    params.append("StartDate", this.filters.start);
    params.append("EndDate", this.filters.end);
    params.append("Client", this.filters.client);
    params.append("agency", this.global.globalAgencyId)
    params.append("role", localStorage.getItem('SelectedRole'))
    this.http.get(url + params).subscribe((data: any) => {
      this.pendingtotal = data;
     //console.log("pendingtotal",data);
      
      this.global.loading = false; 
    },
      err => {
        //alert(err.error)
      });

  }
  getpendinglistItem() {
    // this.global.loading = true;
    // let url = "api/IntakeApproval/getpendinglist?";
    // let params = new URLSearchParams();
    // params.append("userid", this.filters.start);
    // params.append("StartDate", this.filters.start);
    // params.append("Pageitem", this.pendingperpage);
    // params.append("Currentpageno", this.pendingpage.toString());
    // params.append("OrderColumn", this.SortColum);
    // params.append("EndDate", this.filters.end);
    // params.append("Client", this.filters.client);
    // params.append("OrderType", this.OrderType);
    // params.append("agency", this.global.globalAgencyId)
    // params.append("role", localStorage.getItem('SelectedRole'))


    // this.http.get(url + params).subscribe((data: any) => {

    //   this.global.loading = false;
    //   this.PendingArray = data;
    //   console.log("PendingArray",data);
      
    //   this.PendingArray.forEach(s => s.phone = (s.phone != undefined || s.phone != null ? this.phone.phoneNoToFormat(s.phone) : null));
    //   this.PendingArray.forEach(s => s.responsiblePartyPhone = (s.responsiblePartyPhone != undefined || s.responsiblePartyPhone != null ? this.phone.phoneNoToFormat(s.responsiblePartyPhone) : null));
    //   this.PendingArray.forEach(s => s.date = this.datepipe.transform(s.date, 'MM/dd/yyyy'));
    //   this.PendingArray.forEach(s => s.dOB = this.datepipe.transform(s.dOB, 'MM/dd/yyyy'));

     
    //   console.log(this.PendingArray);

    // },
    //   err => {
    //     this.global.loading = false;
    //     //alert(err.error)
    //   });
   // console.log(this.ListIntakeBO.agencyId);
   this.ngxService.start();
    this.ListIntakeBO.role=localStorage.getItem('SelectedRole')
    this.ListIntakeBO.userid=parseInt(this.global.userID);
    this.ListIntakeBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.ListIntakeBO);    
    
  let count=0
   //console.log(" this.gethttp=Pendingdata.",this.Pendingdata);
    this.Pendingdata.subscribe((data: any) => {
      count= count+1;
      if(data!=null&&data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
    });

  }
  //////////////////////////////////////////////////////genderList///////////////////////////////////////////////////////
  getGender() {
    let params = new URLSearchParams();
    params.append("Code", "GENDER");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.http.get(url + params).subscribe((data: any) => {

      this.genderList = data;
    }, err => {
      //alert("err");
    })
  }
//////////////////////////////////////////////////////Create New intake///////////////////////////////////////////////////
newIntake()
{
  var date= new Date()
   this.ClientIntakeDataForm.get('dOB').reset();
   this.ClientIntakeDataForm.get('dOB').enable();

   this.ClientIntakeDataForm.get('date').setValue(date)
  this.NewIntake = true;
  this.SelectedStatus = "NewIntake";
  this.valueschanges();
  this.intakeList = new IntakeClientBO();
  this.ClientIntakeDataForm.enable();
 //console.log(this.ClientIntakeDataForm)
  //   this.ClientIntakeDataForm.enable();
  this.intakeList.date = new Date().toLocaleDateString();
 // console.log(this.intakeList.date);
  setTimeout(() => {
    this.intakeList.date = new Date().toLocaleDateString();

  }, 300);
  this.intakeList.dOB = "";
  this.intakeList.age = 0;

}
//////////////////////////////////////////////////////Current assesment///////////////////////////////////////////////////
getcurrentassessment() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "CURRENTASSESSMENT");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {

    this.CurrentassessmentList = data;


  },
    err => {
      //   alert(err.error)
    });
}
////////////////////////////////////satffing List//////////////////////////////////////////////////////////////////////////
getstaffing() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "YESORNO");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {

    this.staffingList = data;


  },
    err => {
      //  alert(err.error)
    });
}
//////////////////////// Current Agency//////////////////////////////////////////////////
getcurrentagency() {

  let url = "api/LOV/getLovDropDown?";
  let params = new URLSearchParams();
  params.append("Code", "CURRENTLYWITHAGENCY");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.http.get(url + params).subscribe((data: any) => {
//console.log('CurrentagencyList',data);

    this.CurrentagencyList = data;


  },
    err => {
      //  alert(err.error)
    });
}
/////////////////////////////////////////// Save intake form////////////////////////////////////////
saveintake()
{

  let url = 'api/IntakeClient/SaveIntakeClientData';
    // var date=new Date(new Date(this.intakeList.date).toLocaleDateString() + " " + new Date().toLocaleTimeString())
    // var dob=new Date(new Date(this.intakeList.dOB).toLocaleDateString() + " " + new Date().toLocaleTimeString())
    var listParam:IntakeClientBO = JSON.parse(JSON.stringify(this.intakeList));
    listParam.agencyid=parseInt(this.global.globalAgencyId)
    listParam.genderLid=parseInt(this.ClientIntakeDataForm.get('genderLid').value)
    listParam.hoursaday=parseInt(this.ClientIntakeDataForm.get('hoursaday').value)
    listParam.date=new Date(new Date(this.intakeList.date).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
    listParam.dOB=new Date(new Date(this.intakeList.dOB).toLocaleDateString() + " " + new Date().toLocaleTimeString()),


   //console.log(listParam);
    this.http.post(url,listParam).subscribe((data: any) => {
      //console.log(data);
       if(this.NewIntake==true)
       {
        this.showTable()
        this.getpendinglist()
      this.toastrService.success('Intake data Saved SuccessFully')

       }
       else if (this.EditIntake==true)
       {
        this.toastrService.success('Intake data Updated SuccessFully')
        this.clientvaluechange=0;
        this.valueschanges()

       } 
    }
    )
  }
  //////////////////////////////////////Table view////////////////////////////

showTable()
{
  this.NewIntake=false;
  this.EditIntake=false;
  this.getpendinglist()
}
  //////////////////////////////////datechanged event/////////////////////////////
  dateFormateyyyyMMdd(date){
   //console.log("date format",date.formatted);
    if(date.formatted!=null)
    {
      let day = date.formatted.substring(0,2);
      let month = date.formatted.substring(3,5);
      let year = date.formatted.substring(6,10);
      let days=+day;
      let months=+month;
      let years=+year;
  
      let newDate = new Date();
      newDate.setDate(days);
      newDate.setMonth(months-1);
      newDate.setFullYear(years);
     //console.log(newDate);
      return this.datepipe.transform(newDate,"yyyy-MM-dd")
    }
  }
  onDateChanged(event: IMyDateModel) {
    this.intakeList.dOB = event.formatted;
    var bdate = new Date(event.formatted);
    if (event.formatted != "") {
      var timeDiff = Math.abs(Date.now() - bdate.getTime());
      this.intakeList.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  
    }
  }
  
  DOBdatechange(event: IMyInputFieldChanged) {
    let value = event.value;
    if (value.length == 5 && value.substring(2, 3) != '/') {
      this.intakeList.dOB = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
    }
  }
////////////////////////////////////////////////// Age Calculation ////////////////////////////////////
  // Agevaluechange: any = 0;
  calculateAge(intakeList) {
   //console.log(intakeList);
   // console.log("", this.intakeList.dOB)
    var bdate = new Date(intakeList.dOB);
  //  console.log(bdate);
    // this.Agevaluechange++;
    if (intakeList.dOB != null && intakeList.dOB != undefined && intakeList.dOB !='') {
console.log(intakeList.dOB ,"dob");

      var timeDiff = Math.abs(Date.now() - bdate.getTime());
      intakeList.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

    }
  }
   /////////////////////////////////////////get zip//////////////////////////////////////////////
   getzipcode() {

    let url1 = "api/Client/getZipcode?"
    let myParams1 = new URLSearchParams();
    myParams1.append("Street", this.intakeList.street)
    myParams1.append("City", this.intakeList.city)
    myParams1.append("State", this.intakeList.state)
    // console.log("Im in");
    this.http.get(url1 + myParams1).subscribe((data: any) => {
    //  console.log("data.zip_Code", data.zipcode);
      this.intakeList.zipcode = data.zipcode;
      this.intakeList.county = data.county;
   //   console.log("data.zip_Code", this.intakeList.zipcode);
      setTimeout(() => {
        this.intakeList.zipcode = data.zipcode;
      }, 500);
    },)
}
/////////////////////////////////////Value Change///////////////////////////////////////////////////////////////////

valueschanges() {
  this.clientvaluechange = {
    firstnamevaluechange: 0,
    lastvaluechange: 0,
    emailvaluechange: 0,
    aptvaluechange: 0,
    statevaluechange: 0,
    countryvaluechange: 0,
    cityvaluechange: 0,
    zipcodevaluechange: 0,
    responsilevaluechange: 0,
    refferalPhonevaluechange: 0,
    currentAssessmentvaluechange: 0,
    hoursadayvaluechange: 0,
    currentagencyvaluechange: 0,
    currentagency1valuechange: 0,
    reasonforleavingvaluechange: 0,
    staffingvaluechange: 0,
    dayandshiftvaluechange: 0,
    followupchange: 0,
    pendingassementvaluechange: 0,
    gendervaluechange: 0,
    phone1valuechange: 0,
    DOBvaluechange: 0,
    phonevaluechange: 0,
    Agevaluechange: 0,
    intakevaluechange: 0,
    streetvaluechange: 0,
  }
}
isTouched: boolean = false;
isSave: boolean = false;
valuechangefunction(value) {
//  console.log(value);

  if (value == "street") {
    this.clientvaluechange.streetvaluechange++;
  }
  if (value == "DOB") {
    this.clientvaluechange.DOBvaluechange++;
  }
  if (value == "Intake") {
    this.clientvaluechange.intakevaluechange++;
  }
  if (value == "Phone") {
    this.clientvaluechange.phonevaluechange++;
  }
  if (value == "Phone1") {
    this.clientvaluechange.phone1valuechange++;
  }
  if (value == "gender") {
    this.clientvaluechange.gendervaluechange++;
  }
  if (value == "pendingassement") {
    this.clientvaluechange.pendingassementvaluechange++;
  }
  if (value == "followup") {
    this.clientvaluechange.followupchange++;
  }
  if (value == "dayandshift") {
    this.clientvaluechange.dayandshiftvaluechange++;
  }
  if (value == "staffing") {
    this.clientvaluechange.staffingvaluechange++;
  }
  if (value == "reasonforleaving") {
    this.clientvaluechange.reasonforleavingvaluechange++;
  }
  if (value == "currentagency1") {
    this.clientvaluechange.currentagency1valuechange++;
  }
  if (value == "currentagency") {
    this.clientvaluechange.currentagencyvaluechange++;
  }
  if (value == "hoursaday") {
    this.clientvaluechange.hoursadayvaluechange++;
  }
  if (value == "currentAssessment") {
    this.clientvaluechange.currentAssessmentvaluechange++;
  }
  if (value == "firstname") {
    this.clientvaluechange.firstnamevaluechange++;
  }
  if (value == "lastname") {
    this.clientvaluechange.lastvaluechange++;
  }
  if (value == "email") {
    this.clientvaluechange.emailvaluechange++;
  }
  if (value == "apt") {
    this.clientvaluechange.aptvaluechange++;
  }
  if (value == "state") {
    this.clientvaluechange.statevaluechange++;
  }
  if (value == "country") {
    this.clientvaluechange.countryvaluechange++;
  }
  if (value == "city") {
    this.clientvaluechange.cityvaluechange++;
  }
  if (value == "zipcode") {
    this.clientvaluechange.zipcodevaluechange++;
  }
  if (value == "responsile") {
    this.clientvaluechange.responsilevaluechange++;
  }
  if (value == "refferalPhone") {
    this.clientvaluechange.refferalPhonevaluechange++;
  }
  if (value == "Age") {
    this.clientvaluechange.Agevaluechange++;
  }
  this.valuechange = true
  //   console.log(this.valuechange);
 // console.log(this.clientvaluechange)
  //  console.log(value);
}
//////////////////////////////////// close , reject and approve ////////////////////////////////////////////////////
checkvaluechnage(status) {
//  console.log(this.clientvaluechange)
//  console.log(status);

  // console.log(this.phonevaluechange);
  // console.log(this.Agevaluechange);
  //  console.log(this.DOBvaluechange);
  //  console.log(this.intakevaluechange);

  if (this.clientvaluechange.firstnamevaluechange > 1 || this.clientvaluechange.lastvaluechange > 1 ||
    this.clientvaluechange.emailvaluechange > 1 || this.clientvaluechange.aptvaluechange > 1 ||
    this.clientvaluechange.statevaluechange > 1 || this.clientvaluechange.countryvaluechange > 1 ||
    this.clientvaluechange.cityvaluechange > 1 || this.clientvaluechange.zipcodevaluechange > 1 ||
    this.clientvaluechange.responsilevaluechange > 1 || this.clientvaluechange.refferalPhonevaluechange > 1 ||
    this.clientvaluechange.currentAssessmentvaluechange > 6 || this.clientvaluechange.hoursadayvaluechange > 1 ||
    this.clientvaluechange.currentagencyvaluechange > 0 || this.clientvaluechange.reasonforleavingvaluechange > 1 ||
    this.clientvaluechange.staffingvaluechange > 3 || this.clientvaluechange.dayandshiftvaluechange > 1 ||
    this.clientvaluechange.followupchange > 1 ||
    this.clientvaluechange.pendingassementvaluechange > 1 || this.clientvaluechange.gendervaluechange > 0 ||
    this.clientvaluechange.streetvaluechange > 1 || this.clientvaluechange.phone1valuechange > 1 ||
    this.clientvaluechange.phonevaluechange > 1 || this.clientvaluechange.intakevaluechange > 0 ||
    this.clientvaluechange.DOBvaluechange > 0 || this.clientvaluechange.Agevaluechange > 1
    || this.clientvaluechange.currentagency1valuechange > 1) {
      $('#CloseModal').modal({
        show: true,
        zIndex:1000000
    })
  }
  else{
   // console.log(status);
 
if(status=="Pending" || status=="NewIntake"){
   //console.log(status);
    
   this.showTable()
   document.getElementById('CloseModal').click()

  } 
  
if(status == "Approved")
  {
   //console.log(status);
    
    this.showTableApproved()
    this.filterChanged('Approved')
    this.SelectedStatus="Approved";
    this.getapprovedlist()
  }
  if(this.SelectedStatus=="Rejected")
  {
    this.showTableRej()
    // this.showTableApproved()
    this.filterChanged('Rejected')
    this.SelectedStatus="Rejected";
  }
} 

}
///////////////////////////////yes- close///////////////////////////////////////////////////
cancelYes()
{
this.showTable()
document.getElementById('openModal1').click()
}
/////////////////////////////////////Reject CLI//////////////////////////////////////////////
rejCLi(Rejectcli: TemplateRef<any>) {
  // this.dialogService.open(Rejectcli);
 //console.log(Rejectcli);
  
}
//////////////////////////////////////////////////////////////////////////////////////////////
closeIntakedata() {

  this.showTable();
  // this.newintakeform = false;
  this.NewIntake = false;
 //console.log(this.status)
  this.filterChanged(this.status);
  if (this.status == "Rejected") {
   //console.log(this.status)
    this.isRej = true;
  }
  else {
    this.isRej = false;
  }
  if (this.status == "Pending") {
   //console.log(this.status)
    this.isPending = true;
  }
  else {
    this.isPending = false;
  }
  if (this.status == "Approved") {
   //console.log(this.status)
    this.isApproved = true;
  }
  else {
    this.isApproved = false;
  }


  // this.isPending=false;
  // this.isApproved=false;
  // this.isRej=false;
 //console.log("close");
}
////////////////////////////////////////////show pending IntakeData///////////////////////////////////////////////////
showpendingIntakeData(intakependingdata) {
  this.isTouched = false;
  // this.reset();
 //console.log(intakependingdata,"pending=====");
  // this. pendingAssessment
  this.intakeList = intakependingdata;
  // this.intakeList.genderLid = this.intakeList.genderLid.toString()
  setTimeout(() => {
    this.intakeList.currentAssessmentLid = this.intakeList.currentAssessmentLid
  }, 400);
  setTimeout(() => {
    this.intakeList.dOB = new Date(intakependingdata.dob).toLocaleDateString()
  }, 400);
  setTimeout(() => {
    this.intakeList.date = new Date(intakependingdata.date).toLocaleDateString()
    // this.intakeList.dOB = new Date(intakependingdata.dOB).toLocaleDateString()

  }, 400);
  this.ClientIntakeDataForm.enable();
 //console.log(this.intakeList);
this.calculateAge(intakependingdata)
  this.EditIntake=true
  // this.newintakeform = true;
  // this.isApproved=true;
  this.isPending = true;
  this.SelectedStatus = "Pending";
  this.valuechange = false;
  this.valueschanges();
}
//////////////////////////////////////////////show approved IntakeData///////////////////////
showapprovedIntakeData(intakeapproveddata) {

 //console.log(intakeapproveddata);
  this.intakeList = intakeapproveddata;
  // this.disableform();
  setTimeout(() => {
    this.intakeList.dOB = new Date(intakeapproveddata.dob).toLocaleDateString()
  }, 400);
  setTimeout(() => {
    this.intakeList.date = new Date(intakeapproveddata.date).toLocaleDateString()
  }, 400);
  // this.newintake=true;
  this.ClientIntakeDataForm.disable();
  //this.ClientIntakeDataForm.controls['dobdate'].enable();
  // this.ClientIntakeDataForm.controls['dateofcreate'].enable();
 //console.log(this.ClientIntakeDataForm)
  this.isApproved = true;
  // if(this.isRej || this.isApproved)
  // {
  // setTimeout(() => {
  //   this.ClientIntakeDataForm.disable();
  // }, 200);
  //  this.ClientIntakeDataForm.disable();
  // }

  this.NewIntake = true;
  this.SelectedStatus = "Approved";
  this.valueschanges();
}
////////////////////////////////////////// show rejected data////////////////////////////////////////////////////////
showrejIntakeData(intakerejdata) {
  // setTimeout(() => {
  //   this.intakeList.dOB = new Date(intakerejdata.dob).toLocaleDateString()
  //   this.intakeList.date = new Date(intakerejdata.date).toLocaleDateString()
  // }, 300);
  // this.ClientIntakeDataForm.disable();
 //console.log(this.ClientIntakeDataForm)
  setTimeout(() => {
    this.ClientIntakeDataForm.disable()
    this.intakeList.date=new Date(intakerejdata.date).toLocaleDateString()
    this.intakeList.dOB = new Date(intakerejdata.dob).toLocaleDateString()
 //console.log(this.ClientIntakeDataForm)

  }, 300);
 //console.log(this.intakeList);

  this.isRej = true;
  this.intakeList = intakerejdata;
  this.NewIntake = true;
  this.SelectedStatus = "Rejected";
  // this.NewIntake=true;
  this.valueschanges();
}
/////////////////////////////////// Change Function ////////////////////////////////////////////////////
Change() {
 //console.log("test");
  this.isTouched = true;
}
 ////////////////////////////////////phone pattern change function ///////////////////////////////
  //phonevaluechange: any = 0;
  formatPhoneNumber(event, phonenum) {
     //console.log(event);
            if(event.which < 48 || event.which >57){
          event.preventDefault(); }
        this.intakeList.phone = this.phone.getPhoneNumberFormat(phonenum);
   }
  formatPhoneNumberresponsiblePartyPhone(event, phonenum) {
     //console.log(event);
          if(event.which < 48 || event.which >57){
            event.preventDefault(); }
       this.intakeList.responsiblePartyPhone = this.phone.getPhoneNumberFormat(phonenum);
   }
  formatPhoneNumbergetPhoneNumberFormat(event, phonenum) {
       console.log(event,"event");
            if(event.which < 48 || event.which >57) {
              event.preventDefault(); }
            this.intakeList.refferalPhone = this.phone.getPhoneNumberFormat(phonenum);
   }
     //////////////////////// number only input for zipcode///////////////////// 
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  phonechange(event, values) {

    if (values != "" && values != null && values != undefined) {
      let s = values.split('');
     //console.log(s);
      if (s.length !== 14) {
        //   this.phonevaluechange++;
      }
    }
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }

    this.intakeList.phone = this.phone.getPhoneNumberFormat(this.intakeList.phone);
    this.isTouched = true;
  }
  ////////////////////////////referral phone///////////////////////////////////
  //phone1valuechange: any = 0;
  phonechange1(event, values) {
    if (values != "" && values != null && values != undefined) {
      let s = values.split('');
     //console.log(s);
      if (s.length != 14) {
        //  this.phone1valuechange++;
        //  console.log(this.phone1valuechange);
      }
    } if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    }


    //this.phone1valuechange++;
    this.isTouched = true;
    this.intakeList.responsiblePartyPhone = this.phone.getPhoneNumberFormat(this.intakeList.responsiblePartyPhone);
  }
  //////////////////////////////////////////////Reject List/////////////////////////////
  rejectList() {
    if (this.clientvaluechange.firstnamevaluechange > 1 || this.clientvaluechange.lastvaluechange > 1 ||
      this.clientvaluechange.emailvaluechange > 1 || this.clientvaluechange.aptvaluechange > 1 ||
      this.clientvaluechange.statevaluechange > 1 || this.clientvaluechange.countryvaluechange > 1 ||
      this.clientvaluechange.cityvaluechange > 1 || this.clientvaluechange.zipcodevaluechange > 1 ||
      this.clientvaluechange.responsilevaluechange > 1 || this.clientvaluechange.refferalPhonevaluechange > 1 ||
      this.clientvaluechange.currentAssessmentvaluechange > 6 || this.clientvaluechange.hoursadayvaluechange > 1 ||
      this.clientvaluechange.currentagencyvaluechange > 0 || this.clientvaluechange.reasonforleavingvaluechange > 1 ||
      this.clientvaluechange.staffingvaluechange > 3 || this.clientvaluechange.dayandshiftvaluechange > 1 ||
      this.clientvaluechange.followupchange > 1 ||
      this.clientvaluechange.pendingassementvaluechange > 1 || this.clientvaluechange.gendervaluechange > 0 ||
      this.clientvaluechange.streetvaluechange > 1 || this.clientvaluechange.phone1valuechange > 1 ||
      this.clientvaluechange.phonevaluechange > 1 || this.clientvaluechange.intakevaluechange > 0 ||
      this.clientvaluechange.DOBvaluechange > 0 || this.clientvaluechange.Agevaluechange > 1
      || this.clientvaluechange.currentagency1valuechange > 1) {
        $('#RejectModal').modal({
          show: true,
          zIndex:1000000
      })
    }
    else{
      // this.dialogService.open(close);
      $('#ClientRejection').modal({
        show: true,
        zIndex:1000000
    })
    }
    }
   
//////////////////////////////////////////////// Save Rejected List ///////////////////////////////////////////////////////////
saverejectedlist() {
    let url = 'api/IntakeApproval/saverejectedlist';
        const httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          })
        };
        // let data1 = JSON.stringify(this.intakeList)
        // let l = this.IntakeApprovalBO;
        // l.dOB = this.intakeList.dOB,
        // l.agencyid = this.global.globalAgencyId;
        // this.Userid=this.global.userID
        // l.genderLid = this.intakeList.genderLid
        // l.intakeClientId = this.intakeList.id,
        // l.reasonForRejection = this.IntakeApprovalBO.reasonForRejection,
        // l.phone = this.phone.getPhoneNumber(this.intakeList.phone)
        // l.responsiblePartyPhone = this.phone.getPhoneNumber(this.intakeList.responsiblePartyPhone)
        // l.date=new Date(new Date(this.intakeList.date).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
        // // l.dOB=new Date(new Date(this.intakeList.dOB).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
        let data1 = JSON.stringify(this.intakeList)
        let l = this.intakeList;
     //   console.log("intake data====",this.intakeList);
        
        l.agencyid=parseInt(this.global.globalAgencyId);
        l.date=new Date(new Date(this.intakeList.date).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
        l.dOB=new Date(new Date(this.intakeList.dOB).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
          this.http.post(url, JSON.stringify(l), httpOptions).subscribe((data: any = []) => {
    this.filterChanged(this.status);
    this.RejectedArray.push(data);

      document.getElementById('openModal3').click()
        this.toastrService.success(
              'Client has been Rejected successfully!',
              '', ), 6000;
            this.closeIntakedata();
          },
            
    // this.loading=false;
    
              // setTimeout(() => {
              //   //this.clearvaluechange();
              //   console.log(JSON.parse(data1));
              //   this.intakeList.dOB = JSON.parse(data1).dOB;
              //   this.intakeList.date = JSON.parse(data1).date;
              //   // this.intakeList.age=JSON.parse(data1).age
    
              // }, 400);
              // // this.err = err.error;
              // // this.warning = true;
              // setTimeout(() => {
              //   // this.warning = false;
              //   // this.err = " ";
              // }, 3000);
            
           ) }
    ////////////////////////////////////////////////////// rejYes ////////////////////////////////////////////////////
    rejYes()
    {
      document.getElementById('openModal2').click()
      $('#ClientRejection').modal({
        show: true,
        zIndex:1000000
    })
    }
    showTableRej()
    {
     this.NewIntake=false
     this.EditIntake=false
     this.SelectedStatus="Rejected" 
     this.filterChanged("Rejected")
     this.getrejectedlist()
    }
 //////////////////////////////////////////////Approved List/////////////////////////////
 ApprovedList() {
  if (this.clientvaluechange.firstnamevaluechange > 1 || this.clientvaluechange.lastvaluechange > 1 ||
    this.clientvaluechange.emailvaluechange > 1 || this.clientvaluechange.aptvaluechange > 1 ||
    this.clientvaluechange.statevaluechange > 1 || this.clientvaluechange.countryvaluechange > 1 ||
    this.clientvaluechange.cityvaluechange > 1 || this.clientvaluechange.zipcodevaluechange > 1 ||
    this.clientvaluechange.responsilevaluechange > 1 || this.clientvaluechange.refferalPhonevaluechange > 1 ||
    this.clientvaluechange.currentAssessmentvaluechange > 6 || this.clientvaluechange.hoursadayvaluechange > 1 ||
    this.clientvaluechange.currentagencyvaluechange > 0 || this.clientvaluechange.reasonforleavingvaluechange > 1 ||
    this.clientvaluechange.staffingvaluechange > 3 || this.clientvaluechange.dayandshiftvaluechange > 1 ||
    this.clientvaluechange.followupchange > 1 ||
    this.clientvaluechange.pendingassementvaluechange > 1 || this.clientvaluechange.gendervaluechange > 0 ||
    this.clientvaluechange.streetvaluechange > 1 || this.clientvaluechange.phone1valuechange > 1 ||
    this.clientvaluechange.phonevaluechange > 1 || this.clientvaluechange.intakevaluechange > 0 ||
    this.clientvaluechange.DOBvaluechange > 0 || this.clientvaluechange.Agevaluechange > 1
    || this.clientvaluechange.currentagency1valuechange > 1) {
      $('#ApproveModal').modal({
        show: true,
        zIndex:1000000
    })
  }
  else{
    // this.dialogService.open(close);
    this.saveapprovelist() 
  
  }
  }
//////////////////////////////////////////////// Save Rejected List ///////////////////////////////////////////////////////////

saveapprovelist() {
  let url = 'api/IntakeApproval/saveapprovedlist';
  const httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    })
  };
  
  let data1 = JSON.stringify(this.intakeList)
  let l = this.intakeList;
  // l.dOB = this.intakeList.dOB,
  // l.agencyid = this.global.globalAgencyId;
  // l.userId = this.global.userID;
  // l.roleId=this.roleid
  l.dOB = new Date(new Date(this.intakeList.dOB).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
  l.date = new Date(new Date(this.intakeList.date).toLocaleDateString() + " " + new Date().toLocaleTimeString()),
  // l.responsiblePartyPhone = this.phone.getPhoneNumber(this.intakeList.responsiblePartyPhone)
  // l.phone = this.phone.getPhoneNumber(this.intakeList.phone)
  // l.intakeClientId = this.intakeList.id,
      // l.reasonForRejection = this.IntakeApprovalBO.reasonForRejection
    this.http.post(url,JSON.stringify(l), httpOptions).subscribe((data: any = []) => {
    // this.filterChanged(this.status);
 
    this.getpendinglistItem()
     this.ApprovedArray.push(data);
  this.toastrService.success(
        'Client has been Approved successfully!',
        '', ), 6000;
      this.closeIntakedata();
      this.SelectedStatus="Approved"
      this.showTable()


    })
    }
    showTableApproved()
    {
      this.NewIntake=false
      this.EditIntake=false;
      this.getapprovedlist()
     this.filterChanged("Approved");
      
    }
  ////////////////////////////////////////////////////// rejYes ////////////////////////////////////////////////////
  ApprovedYes()
  {
    this.saveapprovelist() 
    document.getElementById('openModal4').click()

  }
  /////////////////////////////////////////Function Permission//////////////////////////////////////////////////////
  filepermissionget() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermission?";
    params.append("pagecode", "IntakeForm");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.http.get(url + params).subscribe((data: any) => {
     //console.log("data len", data != null);

      if (data != null) {
        this.fp = data;
       //console.log("data", this.fp);
      }
      else {
        this.fp = new functionpermission();
      }
    })
    }
    onResize(args) {
 
      const column = this.grid.getColumnByField(args.column.field)
      column.width = args.column.width;
      this.ColumnArray.forEach(element => {
        if (element.column == column.headerText) {
          element.width = parseInt(column.width.toString());
        }

  
      });
      this.SaveColumnwidth();
    }
    // ==============================================================================

  getColumnwidth() {
 
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Client_Intake_form_PendingList.Columns;


     
      //  this.grid.refreshColumns();
      let showcol = JSON.parse(data.column)[0].Client_Intake_form_PendingList.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Client_Intake_form_PendingList.HideColumns
    

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
    
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Client_Intake_form_PendingList.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Client Name') {

          const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Intaken Date') {

          const column1 = this.grid.getColumnByField('date'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Email') {

          const column1 = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Phone') {

          const column1 = this.grid.getColumnByField('phone'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        else if (element.column == 'Actions') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });

  }
  SaveColumnwidth() {
    
    this.arraycol[0].Client_Intake_form_PendingList.Columns = this.ColumnArray;
    this.arraycol[0].Client_Intake_form_PendingList.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }

    
    

}

  


