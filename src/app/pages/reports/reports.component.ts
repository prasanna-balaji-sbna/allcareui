import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReportsService } from './reports.service';
import { groupList,PayorList,importBO, inactiveReport ,returnReportBO, spendownListBO, RenvenueInfoLisBO, TotalClaimChargesVsPaidBO, printspendownBO} from './reports.model';
import { GlobalComponent } from 'src/app/global/global.component';
import { IMyDpOptions } from 'mydatepicker';
import { DateService } from 'src/app/date.service';
import { SaveBatchFileNewReturnBO } from './reports.model';
import { Invoice837P } from '../batch/batch.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpErrorResponse } from '@angular/common/http';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { AnyPtrRecord } from 'dns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToastrService } from 'ngx-toastr';
import { reportdata } from './reportdata.service';
import { Observable } from 'rxjs';
import { exportPDF, Group } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-drawing/dist/npm/pdf';
import { ColumnChangeBO, columnWidth } from '../icd10/icd10.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  selecctedTab:string="Submission Reports";
  @ViewChild('grid') public grid: GridComponent;
  groupList: groupList[];
  payorList: PayorList[];
  initialPage: object;
  importBO:importBO=new importBO;
  groupId:string="";
  payorId:string="";
  startdate:string="";
  enddate:string="";
  company:string="";
  clearinghouse:string="";
  client:string="";
  employee:string="";
  type:string="";
  public data: Observable<DataStateChangeEventArgs>;
typeList: groupList[];
fileToUpload: any = "";
selectedFile: any ;
onDOCFileChangedErr: any = ""
filepath: string;
dropdown835:any=[];
SpenddownList:spendownListBO []
Spenddown:spendownListBO[];
selectedPayor:any;
selectedClaimPayor:any;
DateFilterList:any=[];
DateFilter:any;
ChargeFilterList:any=[]
ChargeFilter:any;
revenueStart:any="";
revenueEnd:any="";
ClaimStart:any="";
ClaimEnd:any="";
FinancialEnd:any="";
FinancialStart:any=""
revenuePayorList:any=[];
ClaimPayorList:any=[];
RevenueList:RenvenueInfoLisBO[]= [];
 ClaimvspaidList:TotalClaimChargesVsPaidBO=new TotalClaimChargesVsPaidBO
 filterDatevalue="";
 filterChargevalue="";
 FinancialList:any;
 selectAll:boolean=false;
 spendDownselectAll:any=[];
 spendwonselectData:any=[]
 spendownfilter:any="All"
 sendspendDown:printspendownBO=new printspendownBO

 

select835file:any;
 ///////////////////////////////////////////FormatOptions/////////////////////////////////////
 public formatOptions: object;


  // batchList: batchList = new batchList();
   ///////////////////////////////Date Piker intialization////////////////////////////////////////////////////////////////
   public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    // disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  public Keystatusoption: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  

  batchData:SaveBatchFileNewReturnBO = new SaveBatchFileNewReturnBO();
  @ViewChild('pdflist') pdflist;
  @ViewChild('pdflistexcep') pdflistexcep;
  @ViewChild('pdfinactive') pdflistinactive;
  @ViewChild('pdfspendown') pdfspendown;
  @ViewChild('pdfrevenue') pdfrevenue;
  @ViewChild('pdfClaimvsPaid')pdfClaimvsPaid;
  @ViewChild('Financepdf') Financepdf;
  @ViewChild('pdflistsample') pdflistsample;
  //////////======================Datepicker fun initialization=================//////////////////////
  date: Date = new Date();
  invoicelist: Invoice837P = new Invoice837P();
  saveErr:string="";
  EmployeeDropDown:any;
  ClinetDropDown:any;
  Report835: any;
  viewFiles:boolean=false;
  serviceLineDetail:any;
Reportfilter:[{Key:string,value:string}]
Report:inactiveReport=new inactiveReport()
InactiveClientReport:returnReportBO[]=[]
public pageSizes: number[] = [10, 15, 20,50,100,250];
public filterSettings: object;
today:string;
ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  constructor(public dateservice: DateService,@Inject(ReportsService) public getReport: ReportsService, public toastrService: ToastrService,
  public global:GlobalComponent,private ngxService: NgxUiLoaderService,private ref: ChangeDetectorRef,@Inject(reportdata) public reportdata: reportdata) 
  {
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data = reportdata;
   }

  ngOnInit(): void {
   this.today=new Date().toISOString();
    this.batchData.invoice837P = this.invoicelist;
    this.getGroupList();
    // this.getpayorList();
    this.getClearinghouseList();
    this.getCompanyList();
    this.dates();
    console.log(window,"window");
 
    this.filterSettings = { type: 'Menu' };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[2], pageSizes: this.pageSizes };
  }
  Refresh()
  {
    this.selectAll=false;
    this.importBO=new importBO;
    this.getspendowndata();
  }
  print = (event): void =>{
    console.log(event);
  };
  spendownselect(args)
  {
  console.log(args)
    if (args.checked && args.target.classList.contains('e-checkselectall')) {
      this.selectAll=true;
      this.spendwonselectData = [];
      this.spendwonselectData=this.spendDownselectAll;
    }
    else if (args.target.classList.contains('e-checkselect')){
      this.selectAll=false;
      let result = this.grid.getRowInfo(args.target)
      let data:any=[];
      data=result.rowData
      console.log(result)
      console.log(this.spendwonselectData.length)
      if (args.checked) {
        if(this.spendwonselectData.length>0)
        {
          let val=this.spendwonselectData.filter(s=>s==data.id);
          if(val.length==0)
          {
            this.spendwonselectData.push(data.id)
          }
        }
        else{
          this.spendwonselectData.push(data.id)
        }
      }
      else{
        const index: number = this.spendwonselectData.indexOf(data.claimMasterId);
        if (index !== -1) {
          this.spendwonselectData.splice(index, 1);
        }
      }
    }
    else{
      this.spendwonselectData = [];
    }
    console.log(this.spendwonselectData)
  }
  public dataStateChange(state): void {
    console.log("state.action.rows",state);    
    this.type = (state.action.requestType).toString();

   
  //  console.log(" this.grid.selectRow(0);", this.grid.selectRowsByRange(0,this.pagshort.itemperpage));

    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.importBO.orderColumn = state.sorted[0].name;
        this.importBO.orderType = state.sorted[0].direction === 'descending' ? 'desc' : 'asc';
       
      }
    }
    if (this.type == "filtering" && state.action.action != "clearFilter") {
      this.importBO.field = state.action.currentFilterObject.field;
      this.importBO.matchCase = state.action.currentFilterObject.matchCase;
      this.importBO.operator = state.action.currentFilterObject.operator;
      this.importBO.value = state.action.currentFilterObject.value;
      if (this.importBO.type == "number") {


        this.importBO.value = state.action.currentFilterObject.value.toString();
        this.importBO.field = state.action.currentFilterObject.field;


      }
      if (this.importBO.type == "date") {
       
        this.importBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
        this.importBO.field = state.action.currentFilterObject.field;
      }
      else {
        this.importBO.value = state.action.currentFilterObject.value;
        this.importBO.field = state.action.currentFilterObject.field;
      }
      
      this.importBO.matchCase = state.action.currentFilterObject.matchCase;
      this.importBO.operator = state.action.currentFilterObject.operator;
    
    }

    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.importBO.field = "ClientName";
        this.importBO.matchCase = false;
        this.importBO.operator = "startswith";
        this.importBO.value = "";
        
      }
    }
    this.getspendowndata()
    if (this.type == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
        if( this.arraycol.length!=0)
        {
          if(this.arraycol[0].SpenddownReport.Pagesize!=state.take)
          {
            this.arraycol[0].SpenddownReport.Pagesize = state.take
               console.log( "save page size")
            this.SaveColumnwidth();
          // }
  
        }
      
      }
  
    }
  }

  public onActionComplete(args) {
    this.importBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.importBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
   // this.getspendowndata()
   if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
    this.importBO.type = args.columnType
    console.log(args.column, "args")
  }

  }
  headerCellInfo(args) {

    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({
      content: toolcontent
    });
    tooltip.appendTo(args.node);

  }
  tooltip(args: QueryCellInfoEventArgs) {
    if (args.column.field != null) {
      const tooltip: Tooltip = new Tooltip({
        content: args.data[args.column.field].toString(),
        position: 'RightCenter',


      }, args.cell as HTMLTableCellElement);
    }
  }
  getspendowndata()
  {
    if(this.spendownfilter=="True")
    {
      this.importBO.spendownfilter=true
    }
   else if(this.spendownfilter=="False")
    {
      this.importBO.spendownfilter=false
    }
    else
    {
      this.importBO.spendownfilter=null
    }

    this.importBO.agencyID=parseInt(this.global.globalAgencyId);
      this.reportdata.execute(this.importBO);
      let count=0
      this.data.subscribe((datas:any)=>{
        count=count+1
        if(datas!=null&& datas!=undefined &&count==1 )
    {
      this.getColumnwidth();
    }
        console.log(datas)
        this.spendDownselectAll=datas.idList;
        let val:any=[];
        if( this.selectAll)
        {
          if( datas.result.length>0)
          {
            datas.result.forEach((element,index) => {
              val.push(index)
            });
            setTimeout(() => {
              this.grid.selectionModule.selectRows(val);
            }, 1000);
          }
          
         
        }
        else
        {
          if( datas.result.length>0)
          {
            datas.result.forEach((element,index) => {
              if( this.spendwonselectData.length>0)
              {

              
              this.spendwonselectData.forEach(element1 => {
                if(element.id==element1)
                {
                  val.push(index)
                }
              });
            }
            });
            if(val.length>0)
            {
              setTimeout(() => {
                this.grid.selectionModule.selectRows(val);
              }, 1000);
            }
          
          }
        }
       
        console.log(this.spendDownselectAll)
      
      })
  }
   /////////////////////////////////tab change///////////////////////////////////////////////////////////////
   tabchange(val) {

    this.selecctedTab = val;
    console.log(val);
    if(val== "Submission Reports")
    {
      this.company = '';
    }
   
    if(val=="Exception Reports")
    {
      this.company = '';
      this.getClient();
      this.getEmployeeDropDown();
      this.getType();
     this.get835dropdown()
    }
    if(val=="InactiveClientReport")
    {
      this.getClient();
      this.getEmployeeDropDown();
      this.getfilter()
    }
    if(val=="SpenddownReport")
    {
      this.SpenddownList=[];
      this.selectedFile=null;
      this.selectAll=false;
      this.spendwonselectData=[]
      this.getspendowndata()
    }
    if(val=="RevenueReport")
    {
      this.selectedPayor=null;
      this.revenueStart="";
      this.revenueEnd="";
      this.getPayer();
      this.getDateLid();
      this.getchargeLid()
    }
    if(val=="ClaimChargevsPaid")
    {
      this.selectedClaimPayor=null;
      this.ClaimStart="";
      this.ClaimEnd=""
      this.getPayer();
      
    }
    if(val=="Financial")
    {
      this.FinancialStart="";
      this.FinancialEnd="";
    }
  }

  selectTab(event) {
    console.log(event);
    if (event.target.innerText == "Submission Report") {
      this.selecctedTab = event.target.innerText
  
    }
    if (event.target.innerHTML == "Exception Report") {

      this.selecctedTab = event.target.innerHTML
      this.getClient();
      this.getEmployeeDropDown();
      this.getType();
      
    
    }
    if (event.target.innerHTML == "InactiveClientReport") {
     
      this.selecctedTab = event.target.innerHTML
      this.getfilter()
   
    }
    console.log(this.selecctedTab);



  }

    ///////////========================Get Group payor list==================================//////////////////
    getGroupList() {
      let param = new URLSearchParams();
      param.append("Code", "GROUP");
      param.append("agencyId", this.global.globalAgencyId);
      param.append("userId", this.global.userID);
      this.getReport.getgroupList(param).subscribe((data: groupList[]) => {
        this.groupList = data;
        this.groupList.forEach(element => {
          element.label = element.Value,
            element.value = element.Key.toString();
          // this.ngxService.stop()
        })
        console.log("groupId",this.groupList);
        
  
      })
    }


     ///////////========================Get Exception TYpe list==================================//////////////////
     getType() {
      let param = new URLSearchParams();
      param.append("Code", "EXCEPTIONTYPE");
      param.append("agencyId", this.global.globalAgencyId);
      param.append("userId", this.global.userID);
      this.getReport.getgroupList(param).subscribe((data: groupList[]) => {
        this.typeList = data;
        this.typeList.forEach(element => {
          element.label = element.Value,
            element.value = element.Key.toString();
          // this.ngxService.stop()
        })
        console.log("groupId",this.typeList);
        
  
      })
    }
  
    ///////////========================Get payor list==================================//////////////////
    getpayorList() {
      let param = new URLSearchParams();
      let GroupId: number = ((this.groupId != '' && this.groupId != null) && this.groupId != undefined) ? +this.groupId : 0
      console.log(GroupId,"groupId");
  
      param.append("AgencyId", this.global.globalAgencyId);
      param.append("GroupId", GroupId.toString());
      this.getReport.getPayorList(param).subscribe((data: groupList[]) => {
        this.payorList = data;
        console.log(data);
  
        this.payorList.forEach(element => {
          element.label = element.Value,
            element.value = element.Key.toString();
        })
  
      })
    }

    setDefaultgroupval(data) {
      if (data == undefined) {
        this.groupId = "";
        this.payorId = "";
        this.payorList = [];
      }
      else {
        this.getpayorList();
      }
    }
    setDefaultpayorval(data) {
      if (data == undefined) {
        this.payorId = "";
      }
    }
    checkOverallData() {
      // if (this.companyId == "" && this.statusLid == ""
      //   && this.groupId == "" && this.getBatchFilterList.payorId == ""
      //   && this.clientId == "" && this.getBatchFilterList.employeeId == "") {
      //   // this.claimWithoutBatch = [];
      // }
    }


    
  //////////////////////////Date Piker Date Change///////////////////////////////////////////////////////////////////////

  newdates(event, type, name) {
    if (type == "inputchage") {
     
      if (name == 'start') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.startdate = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.enddate = val1;
        }
      }
      if (name == 'inactivestart') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Report.start = val1;
        }
      }
      if (name == 'inactiveend') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.Report.end = val1;
        }
      }
      if (name == 'revenuestart') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.revenueStart = val1;
        }
      }
      if (name == 'revenueend') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.revenueEnd = val1;
        }
      }
      if (name == 'claimStart') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.ClaimStart = val1;
        }
      }
      if (name == 'claimEnd') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.ClaimEnd = val1;
        }
      }
      if (name == 'financialStart') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.FinancialStart = val1;
        }
      }
      if (name == 'financialEnd') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.FinancialEnd = val1;
        }
      }
    }
    if (type == "datechagned") {
      
      if (name == 'start') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.startdate = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.enddate = val1;
        }
      }
      if (name == 'inactivestart') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Report.start = val1;
        }
      }
      if (name == 'inactiveend') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.Report.end = val1;
        }
      }
      if (name == 'revenuestart') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.revenueStart= val1;
        }
      }
      if (name == 'revenueend') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.revenueEnd = val1;
        }
      }
      if (name == 'claimStart') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.ClaimStart= val1;
        }
      }
      if (name == 'claimEnd') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.ClaimEnd = val1;
        }
      }
      if (name == 'financialStart') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.FinancialStart= val1;
        }
      }
      if (name == 'financialEnd') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.FinancialEnd = val1;
        }
      }
    }
  }


 
  //////===========================Employee list===========================================///
  getEmployeeDropDown() {
    let params = new URLSearchParams();
    //console.log(empType);
    params.append("AgencyId", this.global.globalAgencyId);
   // params.append("employeeId",empType);
    this.getReport.getEmployee(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.EmployeeDropDown = data;
      this.EmployeeDropDown.forEach(element => {
        element.Key = element.Key.toString();

      })
    });

  }
  ///////////////////////////////////////get client///////////////////////////////////////////////////////////////////

  getClient() {
    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    this.getReport.getClient(params).subscribe((data: any) => {
      this.ClinetDropDown = data;
      console.log("client list======",this.ClinetDropDown);
      
      this.ClinetDropDown.forEach(element => {
        element.id = element.id.toString();
      })
    });
  }
  //=========================================getcompany list=============================//
companyList: any = [];
getCompanyList() {
  let myParams = new URLSearchParams();
  myParams.append("agencyId", this.global.globalAgencyId);
  this.getReport.getCompany(myParams).subscribe((data: any = []) => {
    this.companyList = data;
    this.companyList.forEach(element => {
      element.label = element.Value;
      element.value = element.Key.toString();
    })
  },
    err => {

    })
}

//=========================================getcompany list=============================//
clearinghouseList: any = [];
getClearinghouseList() {
  let myParams = new URLSearchParams();
  myParams.append("agencyId", this.global.globalAgencyId);
  this.getReport.getClearinghouse(myParams).subscribe((data: any = []) => {
    this.clearinghouseList = data;
    this.clearinghouseList.forEach(element => {
      element.label = element.Value;
      element.value = element.Key.toString();
    })
    console.log("cleRINGHOUSE",this.clearinghouseList);
    
  },
    err => {

    })
}
subErr:string="";
generatereportSubmission() {
  let myParams = new URLSearchParams();
  this.company =(this.company=='' || this.company== null )?'0' : this.company;
  this.clearinghouse =(this.clearinghouse=='' || this.clearinghouse== null )?'0' : this.clearinghouse;
  this.groupId =(this.groupId=='' || this.groupId== null )?'0': this.groupId;
  this.payorId =(this.payorId=='' || this.payorId== null )?'0' : this.payorId;
  this.startdate =(this.startdate=='' || this.startdate== null )?"" : this.startdate;
  this.enddate =(this.enddate=='' || this.enddate== null )?"" : this.enddate;
  myParams.append("AgencyId", this.global.globalAgencyId);
  myParams.append("CompanyId", this.company);
  myParams.append("ClearingHouseId", this.clearinghouse);
  myParams.append("GroupId", this.groupId);
  myParams.append("PayorId", this.payorId);
  myParams.append("Startdate", this.startdate);
  myParams.append("Enddate", this.enddate);
  this.batchData.invoice837P= new Invoice837P();
  this.ngxService.start()
  this.getReport.Submissionreports(myParams).subscribe((data: any = []) => {
    

    this.ngxService.stop()
    console.log(data);
    this.batchData= data;
    // console.log(this.batchData[0].invoice837P);
    if(data.length > 0)
    {

      // document.getElementById('openModal3').click();
     
        this.viewFiles= true;
        // document.getElementById('openModal1').click();
        console.log(this.pdflistexcep,"PDFList");
      
        this.pdflist.A4 = true,
          this.pdflist.portrait = true,
          this.pdflist.keepTogether = ".prevent-split",
          this.pdflist.scale = 0.8,
          setTimeout(() => {
              
            this.pdflist.saveAs("SubmissionReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        //    document.getElementById("openpdfdata").click();
           },400);
         
          // this.pdflist.forcePageBreak = ".page-break",
      
    }
    else
    {
      this.ngxService.stop();
      this.saveErr ="Data not found"
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    }
    // this.clearinghouseList = data;
    // this.clearinghouseList.forEach(element => {
    //   element.label = element.Value;
    //   element.value = element.Key.toString();
    // })
  },
    (err:HttpErrorResponse) => {

      this.ngxService.stop()
      this.saveErr=err.error;
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    })
}
batchDataExceptiondata:any;
batchDataexception:any;
generatereportException()
{
  let myParams = new URLSearchParams();
  this.company =(this.company=='' || this.company== null )?'0' : this.company;
  this.client =(this.client=='' || this.client== null )?'0' : this.client;
  this.groupId =(this.groupId=='' || this.groupId== null )?'0': this.groupId;
  this.payorId =(this.payorId=='' || this.payorId== null )?'0' : this.payorId;
  this.employee =(this.employee=='' || this.employee== null )?'0' : this.employee;
  // this.enddate =(this.enddate=='' || this.enddate== null )?"" : this.enddate;
 // myParams.append("typeId", this.type);
  myParams.append("AgencyId", this.global.globalAgencyId);
  myParams.append("CompanyId", this.company);
  myParams.append("ClientId", this.client);
  myParams.append("GroupId", this.groupId);
  myParams.append("PayorId", this.payorId);
  myParams.append("EmployeeId", this.employee);
  // this.batchDataExceptiondata.invoice837P= new Invoice837P();
  // this.batchDataExceptiondata=[];
  // this.batchDataExceptiondata.patient_Cla/imDetail=[];
  this.ngxService.start()
  this.getReport.Exceptionreports(myParams).subscribe((data: any = []) => {
    
let sampledata=[];
    this.ngxService.stop()
    console.log(data ,"Exception data");
    this.batchDataExceptiondata= data;
    console.log(this.batchDataExceptiondata ,"Exception data");
    console.log(this.batchDataExceptiondata.patient_ClaimDetail,"Exception data");
    // sampledata.forEach(element => {
    //   this.batchDataexception=element.patient_ClaimDetail;
    //   element.patient_ClaimDetail.forEach(element => {
    //   this.serviceLineDetail = element.serviceLineDetail;
    //     });
    //   console.log("serviceLineDetail",this.serviceLineDetail);
      
    // });
    
    // this.batchDataexception.forEach(element => {
      
    // });
    console.log( this.batchDataExceptiondata," this.batchDataexception");
    
    
    if(this.batchDataExceptiondata.length >0)
    {
      this.viewFiles= true;
      // document.getElementById('openModal1').click();
      console.log(this.pdflistexcep,"PDFList");
    
      this.pdflistexcep.A4 = true,
        this.pdflistexcep.portrait = true,
        this.pdflistexcep.keepTogether = ".prevent-split",
        this.pdflistexcep.scale = 0.8,
        this.pdflistexcep.margin= { left: "0.6cm", top: "0.4cm", right: "0.6cm", bottom: "3cm" }
        setTimeout(() => {
            
          this.pdflistexcep.saveAs("ExceptionReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        //  document.getElementById("openpdfdata").click();
         },400);
       
        // this.pdflist.forcePageBreak = ".page-break",
      
    }
    else
    {
      this.ngxService.stop()
      this.saveErr="Data not found";
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    }
    // this.clearinghouseList = data;
    // this.clearinghouseList.forEach(element => {
    //   element.label = element.Value;
    //   element.value = element.Key.toString();
    // })
  },
    (err:HttpErrorResponse) => {

      this.ngxService.stop()
      this.saveErr=err.error;
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    })
}
// sampleddata()
// {
//   this.pdflistsample.A4 = true,
//   this.pdflistsample.portrait = true,
//   this.pdflistsample.keepTogether = ".prevent-split",
//   this.pdflistsample.scale = 0.8,
//   setTimeout(() => {
      
//     this.pdflistsample.saveAs("ExceptionReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
//   //  document.getElementById("openpdfdata").click();
//    },400);
// }aa
exception835list:any=[];
service835:any=[];
viewFiles835:boolean=false;
count=0;
sampleddata()
{
  let myParams = new URLSearchParams();
  this.select835file =(this.select835file=='' || this.select835file== null )?'0' : this.select835file;
  // this.enddate =(this.enddate=='' || this.enddate== null )?"" : this.enddate;
 // myParams.append("typeId", this.type);
  myParams.append("Id", this.select835file);
  // this.batchDataExceptiondata.invoice837P= new Invoice837P();
  // this.batchDataExceptiondata=[];
  // this.batchDataExceptiondata.patient_Cla/imDetail=[];
  this.ngxService.start()
  this.getReport.Exceptionreports835(myParams).subscribe((data: any = []) => {
    
let sampledata=[];
    this.ngxService.stop()
    console.log(data ,"Exception data");
    this.exception835list= data;
    console.log(this.exception835list ,"Exception data");
    console.log(this.exception835list.patient_ClaimDetail,"Exception data");
    // sampledata.forEach(element => {
      this.batchDataexception=data.patient_ClaimDetail;
     
      this.batchDataexception.forEach(element1 => {
        element1.count= 0;
      this.serviceLineDetail = element1.serviceLineDetail;
      this.serviceLineDetail.forEach(amt => {
        element1.count = element1.count + amt.billedAmt;
        console.log("serviceLineDetail",amt.billedAmt);
      });
      // element.count =

     

        });
    
      console.log("count",this.batchDataexception);
      
    // });
    
    // this.batchDataexception.forEach(element => {
      
    // });
    console.log( this.exception835list," this.batchDataexception");
    console.log( this.exception835list.length," length");
    
    
    if(this.exception835list != '')
    {
      this.viewFiles835= true;
      // document.getElementById('openModal1').click();
      console.log(this.pdflistsample,"PDFList");
      this.pdflistsample.margin= { left: "0.6cm", top: "0.6cm", right: "0.6cm", bottom: "3cm" }
      // this.pdflistsample.A4 = true,
        this.pdflistsample.portrait = true,
        this.pdflistsample.keepTogether = ".prevent-split",
        this.pdflistsample.scale = 0.8,
        setTimeout(() => {
            
          this.pdflistsample.saveAs("ExceptionReport835" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        //  document.getElementById("openpdfdata").click();
         },400);
       
        // this.pdflist.forcePageBreak = ".page-break",
      
    }
    else
    {
      this.ngxService.stop()
      this.saveErr="Data not found";
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    }
    // this.clearinghouseList = data;
    // this.clearinghouseList.forEach(element => {
    //   element.label = element.Value;
    //   element.value = element.Key.toString();
    // })
  },
    (err:HttpErrorResponse) => {

      this.ngxService.stop()
      this.saveErr=err.error;
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
    })
}
  // ----------------------------------------- to get current date as default--------------------------
  dates() {
    // var d = this.date.getDate();
    // var m = this.date.getMonth() + 1; //Jan is 0
    // var yyyy = this.date.getFullYear();
    // this.startdate = m + '/' + d + '/' + yyyy;
    // this.enddate = m + '/' + d + '/' + yyyy;
    // console.log(this.startdate);
    // console.log(this.enddate);
    // this.gettimesheetdata();
  }


  
  kendopdfdownloadList() {
    console.log(this.pdflist,"PDFList");
    this.pdflist.A4 = true,
        this.pdflist.portrait = true,
      // this.pdflist.keepTogether = ".prevent-split",
      this.pdflist.scale = 0.8,
      // this.pdflist.forcePageBreak = ".page-break",
      this.pdflist.saveAs("837Report" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());

  }


  ////////////////////////////// Download Report/////////////////////////////////////

  kendopdfdownloadListException() {
    console.log(this.pdflistexcep,"PDFList");
    
    this.pdflistexcep.A4 = true,
      this.pdflistexcep.portrait = true,
      this.pdflist.keepTogether = ".prevent-split",
      this.pdflistexcep.scale = 0.8,
      // this.pdflist.forcePageBreak = ".page-break",
      this.pdflistexcep.saveAs("ExceptionReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
  }
  

   //========================Get Group payor list=====================================================================//
   getfilter() {
    console.log("get filter");
    let param = new URLSearchParams();
    param.append("Code", "INACTIVECLIENTREPORTFILTER");
    param.append("agencyId", this.global.globalAgencyId);
    param.append("userId", this.global.userID);
    this.ngxService.start()
    this.getReport.getfilterList(param).subscribe((data: any) => {
      this.Reportfilter = data;
      this.Reportfilter.forEach(element => {
       
          element.Key = element.Key.toString();
        
      })
      this.ngxService.stop()
     
      

    })
  }
  //==========================get Inactive Report================================================================//
  getinactive()
  {
    if(this.Report.start!=null||this.Report.end!=null)
    {

    
    if(new Date(this.Report.start).getTime()>new Date(this.Report.end).getTime())
    {

      this.saveErr="End Date Should greater than Start Date"
      setTimeout(() => {
        this.saveErr=""
      }, 8000);
      return
    }
  }
  this.Report.start= this.Report.start!=null?this.Report.start:'';
  this.Report.end=this.Report.end!=null?this.Report.end:'';
    let param = new URLSearchParams();
   
    param.append("agencyId", this.global.globalAgencyId);
    param.append("filter",  this.Report.filter.toString());
    param.append("start",  this.Report.start);
    param.append("end",  this.Report.end);
    this.ngxService.start()
    this.getReport.getReport(param).subscribe((data:any)=>{
        this.ngxService.stop()
      console.log(data)
      this.InactiveClientReport=data;
      if(data.length>0)
      {
        setTimeout(() => {
          this.pdflistinactive.A4 = true,
        this.pdflistinactive.portrait = true,
      // this.pdflist.keepTogether = ".prevent-split",
      this.pdflistinactive.scale = 0.8,
      // this.pdflist.forcePageBreak = ".page-break",
      this.pdflistinactive.saveAs("InactiveClientReport" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        }, 300);
        
      }
      else{
        this.saveErr="Data Not Found";
        setTimeout(() => {
          this.saveErr=""
        }, 8000);

      }
    },
    (err:HttpErrorResponse)=>{
      this.saveErr=err.error;
      setTimeout(() => {
        this.saveErr=""
      },8000);
      this.ngxService.stop()
    })
  }
  public get keepTogether(): string {
    return '';
  }


  ////////////////////////////// File uPload /////////////////////////////////////

  onFileChanged(file) {
    // this.fileToUpload.fileName=file.item(0).name;
    
    this.fileToUpload = file.item(0);
  //  this.selectedFileName = file.item(0).name;
  //  console.log(this.selectedFileName);
 // const file = event.target.files[0];
    // $('.custom-file-input').on('change', function () {
    //   let fileName = $(this).val().split('\\').pop();
    //   console.log(fileName);
    //   $(this).siblings('.custom-file-label').addClass("selected").html(fileName);
    // });
    
  }
   ////////////////////////////// Save importFile/////////////////////////////////////

   onDOCFileChanged() {
    // this.fileToUpload = files.item(0);
  //   this.Importreturn.fileName=this.fileToUpload.name
  //   this.selectedFileName = this.fileToUpload.name;
  //   console.log(this.fileToUpload);
  //   console.log(this.fileToUpload.name);
  //   console.log(this.Importarray);
  //   let body = new FormData();
  //   body.append('Filepath', this.fileToUpload);
  //  console.log("body",body);  
  //   let url = "api/Import/SaveImport";
  //   this.http.post(url, body).subscribe(
    //   (data: returnimport835) => {
    //     this.Report835 = data.invoice;
    //  if( this.Report835 !=null)
    //  {
    //    document.getElementById("openModal1");
    //  }
    //     // this.dialog.open(temp);
    //     console.log(data);
    //     if(data.error!=null||data.error!=undefined||data.error!="")
    //     {
    //       this.toastrService.error(
    //         data.error,
    //         "File imported error",
    //       ), 8000
    //     }
    //     this.toastrService.success(
    //       "File has been imported successfully",
    //       "File imported",
    //     ), 8000
       
      
    //   },
    //   (err: HttpErrorResponse) => {
    //     console.log(err);
    //     this.onDOCFileChangedErr = "";
    //     this.onDOCFileChangedErr = err.error;
    //     if (this.onDOCFileChangedErr != "") {
    //       setTimeout(function () {
    //         this.onDOCFileChangedErr = "";
    //       }.bind(this), 8000);

    //     }
    //   }
    // );
  }
  get835dropdown()
  {
    let urldata=new URLSearchParams();
    urldata.append("Agency",this.global.globalAgencyId)
    this.getReport.get835(urldata).subscribe((data:any)=>{
      this.dropdown835=data;
      console.log( this.dropdown835)
    })

  }
  createSpendown()
  {
    let urldata=new URLSearchParams();
    urldata.append("agency",this.global.globalAgencyId)
    urldata.append("id",this.selectedFile)
    this.getReport.createspendowndlist(urldata).subscribe((data:any)=>{
      if(data.length>0)
      {
        this.SpenddownList=data;
       
      }
      else{
        this.SpenddownList=data;
        this.toastrService.error(
                 "Data Not Found",
                "Error",
              ), 8000;
      }
     
    },
    (err:HttpErrorResponse)=>{
      this.toastrService.success(
        err.error,
       "Error",
     ), 8000;
    }
    )
  }
  kendopdfdownloadListSpendDown() {
    //let urldata=new URLSearchParams();
  //  urldata.append("agency",this.global.globalAgencyId)
  //  urldata.append("Detail",this.spendwonselectData.join(', '))
  this.sendspendDown.agency=parseInt(this.global.globalAgencyId)
  this.sendspendDown.idList=this.spendwonselectData
    this.getReport.downloadspendowndlist(this.sendspendDown).subscribe((data:any)=>{
    this.Spenddown=data
    console.log(this.pdflistexcep,"PDFList");
    setTimeout(() => {
      
      this.pdfspendown.A4 = true,
      this.pdfspendown.portrait = true,
      this.pdfspendown.keepTogether = ".prevent-split",
      this.pdfspendown.scale = 0.8,
       this.pdfspendown.forcePageBreak = ".page-break",
       console.log(  this.pdfspendown)
    // let val= this.pdfspendown.saveAs("SpendDown" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
     this.pdfspendown.export().then((group: Group) => exportPDF(group)).then((dataUri) => {        
      const base64  = dataUri.replace('data:application/pdf;base64,', '');
      const fileObject = this.dataURLtoFile(dataUri, 'test');
      console.log(base64, fileObject);
     var fileurl= URL.createObjectURL(fileObject);
     var d=document.getElementById("spendownreport")
  
     var a=   window.open(fileurl, '', 'height=500, width=500');
    
      a.print();
  
  });
  
    
    
    }, 500);
  })
  }
  public dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

  getPayer()
  {
    let urldata=new URLSearchParams();
    urldata.append("AgencyId",this.global.globalAgencyId)
   
    this.getReport.getRevenuePayorList(urldata).subscribe((data:any)=>{
      this.revenuePayorList=data;
      this.revenuePayorList.forEach(element => {
        element.Key= element.Key.toString();
      });
      this.ClaimPayorList=this.revenuePayorList;
    })
  }
   ///////////========================Get Revenue Date Filter list==================================//////////////////
   getDateLid() {
    let param = new URLSearchParams();
    param.append("Code", "REVENUEDATEFILTER");
    param.append("agencyId", this.global.globalAgencyId);
    param.append("userId", this.global.userID);
    this.getReport.getDateLidList(param).subscribe((data: groupList[]) => {
      this.DateFilterList = data;
      if(data.length>0)
      {
        this.DateFilterList.forEach(element => {
       
          element.Key = element.Key.toString();
         
        })
        this.DateFilter=this.DateFilterList[0].Key;
        console.log("groupId",this.typeList);
      }
    
      

    })
  }
  ///////////========================Get Revenue Date Filter list==================================//////////////////
  getchargeLid() {
    let param = new URLSearchParams();
    param.append("Code", "REVENUECHARGEFILTER");
    param.append("agencyId", this.global.globalAgencyId);
    param.append("userId", this.global.userID);
    this.getReport.getChargeLidList(param).subscribe((data:any) => {
      this.ChargeFilterList = data;
      console.log("groupId",this.ChargeFilterList);
      if(data.length>0)
      {
        this.ChargeFilterList.forEach(element => {
       
          element.Key = element.Key.toString();
       
      });
      console.log("groupId",this.ChargeFilterList);
    this.ChargeFilter=this.ChargeFilterList[0].Key;
     
      }
     
      
      
    })
  }
  revenuetotal:any;
  getRevenueData()
  {
    console.log(this.revenueStart)
    console.log(this.revenueEnd)
    if(this.revenueStart!=null&&this.revenueStart!=undefined&&this.revenueStart!=""&&this.revenueEnd!=null&&this.revenueEnd!=undefined&&
    this.revenueEnd!="")
    {
      if(new Date(this.revenueStart).getTime()>new Date(this.revenueEnd).getTime())
      {
        this.toastrService.error(
          "End Date should greater than Start Date",
         "Error",
       ), 8000;
       return ;
      }
    }
    else{
      this.toastrService.error(
        "Please Select Start Date and End Date ",
       "Error",
     ), 8000;
     return ;
    }
    if(this.selectedPayor==""||this.selectedPayor==undefined||this.selectedPayor=='')
    {
      this.selectedPayor="";
    }
    this.filterDatevalue=this.DateFilterList.filter(f=>f.Key==this.DateFilter)[0].Value;
    this.filterChargevalue=this.ChargeFilterList.filter(f=>f.Key==this.ChargeFilter)[0].Value;
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    param.append("payorId",this.selectedPayor);
    param.append("fromDate",this.revenueStart);
    param.append("toDate",this.revenueEnd);
    param.append("filterDateLId",this.DateFilter)
    param.append("filterChargesLid",this.ChargeFilter);
    this.getReport.getRevenueList(param).subscribe((data:any)=>{
      this.RevenueList=data
     
      
      if(data.length>0)
      {
        if(this.filterChargevalue=="Net")
        {
          this.revenuetotal=this.RevenueList.map(s=>s.netCharges).reduce((s)=>s);
        }
        else{
          this.revenuetotal=this.RevenueList.map(s=>s.grossCharges).reduce((s)=>s);
        }
        setTimeout(() => {
         // this.ChargeFilter=this.ChargeFilterList[0].Key;
        this.pdfrevenue.A4 = true,
        this.pdfrevenue.portrait = true,
        this.pdfrevenue.keepTogether = ".prevent-split",
        this.pdfrevenue.scale = 0.8,
        // this.pdflist.forcePageBreak = ".page-break",
        this.pdfrevenue.saveAs("Revenue" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        }, 400);
        
       // this.RevenueListtotal=data.
      }
      else{
        this.toastrService.error(
          "Data Not Found ",
         "Error",
       ), 8000;
      }
    })
  }
  getClaimvsPayorData()
  {

    if(this.ClaimStart!=null&&this.ClaimStart!=undefined&&this.ClaimStart!=""&&this.ClaimEnd!=null&&this.ClaimEnd!=undefined&&
    this.ClaimEnd!="")
    {
      if(new Date(this.ClaimStart).getTime()>new Date(this.ClaimEnd).getTime())
      {
        this.toastrService.error(
          "End Date should greater than Start Date",
         "Error",
       ), 8000;
       return ;
      }
    }
    else{
      this.toastrService.error(
        "Please Select Start Date and End Date ",
       "Error",
     ), 8000;
     return ;
    }
    if(this.selectedClaimPayor==""||this.selectedClaimPayor==undefined||this.selectedClaimPayor=='')
    {
      this.selectedClaimPayor="";
    }
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    param.append("payorId",this.selectedClaimPayor);
    param.append("fromDate",this.ClaimStart);
    param.append("toDate",this.ClaimEnd);
    this.getReport.getClaimvsPaidListDetails(param).subscribe((data:any)=>{
     
      if(data!=null)
      {
        this.ClaimvspaidList=data
        setTimeout(() => {
         // this.ChargeFilter=this.ChargeFilterList[0].Key;
        this.pdfClaimvsPaid.A4 = true,
        this.pdfClaimvsPaid.portrait = true,
        this.pdfClaimvsPaid.keepTogether = ".prevent-split",
        this.pdfClaimvsPaid.scale = 0.8,
        // this.pdflist.forcePageBreak = ".page-break",
        this.pdfClaimvsPaid.saveAs("ClaimversusPaid" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
        }, 400);
      }
      else{
        this.toastrService.error(
          "Data Not Found ",
         "Error",
       ), 8000;
      }
    })
  }
  getFinancialData()
  {

    if(this.FinancialStart!=null&&this.FinancialStart!=undefined&&this.FinancialStart!=""&&this.FinancialEnd!=null&&this.FinancialEnd!=undefined&&
    this.FinancialEnd!="")
    {
      if(new Date(this.FinancialStart).getTime()>new Date(this.FinancialEnd).getTime())
      {
        this.toastrService.error(
          "End Date should greater than Start Date",
         "Error",
       ), 8000;
       return ;
      }
    }
    else{
      this.toastrService.error(
        "Please Select Start Date and End Date ",
       "Error",
     ), 8000;
     return ;
    }
  
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId);
    param.append("fromDate",this.FinancialStart);
    param.append("toDate",this.FinancialEnd);
    this.getReport.getFinancialListDetails(param).subscribe((data:any)=>{
     
      if(data.length>0)
      {
        this.FinancialList=data
        setTimeout(() => {
          // this.ChargeFilter=this.ChargeFilterList[0].Key;
         this.Financepdf.A4 = true,
         this.Financepdf.portrait = true,
         this.Financepdf.keepTogether = ".prevent-split",
         this.Financepdf.scale = 0.8,
         // this.pdflist.forcePageBreak = ".page-break",
         this.Financepdf.saveAs("Final" + new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString());
         }, 400);
      }
      else{
        this.toastrService.error(
          "Data Not Found ",
         "Error",
       ), 8000;
      }
    })
  }
   // ==============================================================================

   getColumnwidth() {
 
    this.getReport.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].SpenddownReport.Columns;


    
//       let showcol = JSON.parse(data.column)[0].SpenddownReport.ShowColumns;
//     let hidecol = JSON.parse(data.column)[0].SpenddownReport.HideColumns
  

//  //   this.grid.showColumns(showcol);
//     this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].SpenddownReport.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Client Name') {

          const column = this.grid.getColumnByField('client'); // get the JSON object of the column corresponding to the field name
          
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == '') {

          const column = this.grid.getColumnByUid('checkbox'); // get the JSON object of the column corresponding to the field name
          
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Prepared Date') {

          const column1 = this.grid.getColumnByField('prepareDate'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Invoice Date') {

          const column1 = this.grid.getColumnByField('invoiceDate'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        
        if (element.column == 'Amount') {

          const column1 = this.grid.getColumnByField('amount'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Invoice Type') {

          const column1 = this.grid.getColumnByField('invoiceType'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Invoice Number') {

          const column1 = this.grid.getColumnByField('invoiceNumber'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
    
      });


    });

  }
  SaveColumnwidth() {
    
    this.arraycol[0].SpenddownReport.Columns = this.ColumnArray;
    this.arraycol[0].SpenddownReport.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.getReport.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
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
}
