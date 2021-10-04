import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { GetHTTPService } from './operational-dashboarddata.service';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs ,DataStateChangeEventArgs,Column,SearchSettingsModel, ToolbarItems} from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { exceededhourBO } from './operational-dashboard.model';
import{GlobalComponent} from '../../global/global.component';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { OperationalService } from './operational-dashboard.service';

@Component({
  selector: 'app-operational-dashboard',
  templateUrl: './operational-dashboard.component.html',
  styleUrls: ['./operational-dashboard.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class OperationalDashboardComponent implements OnInit {
  single: any = [];
  multi: any = [];
  auth: any = [];
  gradient: boolean = true;
  colorScheme = {
    domain: ['#689F38', '#0D47A1', '#F47B00', '#0096A6', '#378D3B', '#606060']
  };
  
  colorScheme1 = {
    domain: [ '#0096A6' ]
  };

  ////////////////////////////////////////////////// obserable variable /////////////////////////////////////////////////////////
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;

  //===============================Ejs Grid Variable Intialization========================================================//
  @ViewChild('grid') public grid: GridComponent;
  public pageSizes: number[] = [10, 15, 20];
  public submissiondrop: string[];
  public height = '220px';
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel
  initialPage: object
  filter: IFilter;
  datalngth: number;
  EXPBOOL1: boolean = false;
  EXPBOOL: boolean = false;
  EXPBOOL2: boolean = false;


  ReportstatusList:any=[]
  EmployeeDropdown:any=[]
  month:string=(new Date().getMonth()+1).toString();
  monthList:any=[];
  Oiglist:any=[];
  currentYear:number;
  year:number=new Date().getUTCFullYear();
  curmonth:string="";
  status:string;
  Employee:number;
  enableExhours:boolean=true;

  ///////////////////////////////////////////FormatOptions/////////////////////////////////////
  public formatOptions: object;
  public formatPhoneNumber: object;
  type:string;
  report=new exceededhourBO();
  empdata:any=[]
  constructor(public toastrService: ToastrService, private router: Router, public http: HttpClient,@Inject(GetHTTPService) public getReport: GetHTTPService, public global:GlobalComponent, private ngxService: NgxUiLoaderService,
  @Inject(OperationalService) public OperationalService: OperationalService,private ref: ChangeDetectorRef) { 
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data=getReport;
  }

  ngOnInit(): void {

    this.toolbar = ['ColumnChooser'];
    this.filterOptions = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    this.getUMPI();
    this.getAuthCount();
    this.getAuthExpired();
    this.getOIGAnalysis();
    this.getColumnwidth();
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
  }

  expand(){
    if(this.EXPBOOL == false){
    this.EXPBOOL = true;
    } else if(this.EXPBOOL == true){
    this.EXPBOOL = false;
    this.getAuthCount();
    }
  }
  
  expand1(){
    if(this.EXPBOOL1 == false){
    this.EXPBOOL1 = true;
    } else if(this.EXPBOOL1 == true){
    this.EXPBOOL1 = false;
    this.getUMPI();
    }
  }
  
  expand2(){
    if(this.EXPBOOL2 == false){
    this.EXPBOOL2 = true;
    } else if(this.EXPBOOL2 == true){
    this.EXPBOOL2 = false;
    this.getAuthExpired();
    }
  }

  public onSelect(event) {
    this.router.navigateByUrl("/client-parent");
  }
  
  public onSelect1(event) {
    this.router.navigateByUrl("/employee");
  }

  //===================================OnActionComplete==================================================//
  public onActionComplete(args) { 
   this.report.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
   this.report.pageitem= this.grid.pagerModule.pagerObj.pageSize;
   if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
   {
     this.report.type=args.columnType
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

  // =======================================Authorization count==================================================//

  public getAuthCount(){
    let url="api/Client/getCount/"+this.global.globalAgencyId;
    this.http.get(url).subscribe((data: any) => {
      if (data != null) {
        // this.fp = data;
        this.single = [
        {
          name: 'Expired',
          value: Math.floor(Number(data.expiredcount))
        },
        {
          name: 'Exceeded',
          value: Math.floor(Number(data.exceedcount))
        },
        {
          name: 'Under',
          value: Math.floor(Number(data.undercount))
        }
      ];
      }
    },
      (err: HttpErrorResponse) => {
        if(err){
        this.toastrService.error('Error in getting authorization data','Error'),8000;
      }
      })
  }
  
  public getAuthExpired(){
    let url="api/Client/getexpirecount/"+this.global.globalAgencyId;
    this.http.get(url).subscribe((data: any) => {

      if (data != null) {
        // this.fp = data;
        this.auth = [
          {
            name: 'Expired',
            value: Math.floor(Number(data.expired))
          },
          {
            name: 'Expiring in 30 days',
            value: Math.floor(Number(data.oneMonth))
          },
          {
            name: 'Expiring in 60 days',
            value: Math.floor(Number(data.twoMonths))
          },
          {
            name: 'Expiring in 90 days',
            value: Math.floor(Number(data.threeMonths))
          }
        ];
      }
    },
      (err: HttpErrorResponse) => {
        if(err){
        this.toastrService.error('Error in getting authorization data','Error'),8000;
      }
      })
  }

  //========================================Ejs Data change Event ===============================================//
  public dataStateChange(state): void {
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.report.orderColumn = state.sorted[0].name;
        this.report.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }
    }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
      if(this.report.type=="number")
      {
        this.report.value=state.action.currentFilterObject.value.toString();
        this.report.field=state.action.currentFilterObject.field;
      }
      if(this.report.type=="date")
      {
        this.report.value=new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString()+" " +"00:00:00"+" "+"GMT").toISOString();
        this.report.field=state.action.currentFilterObject.field;
      }
      else{
        this.report.value=state.action.currentFilterObject.value;
        this.report.field=state.action.currentFilterObject.field;
      }
        this.report.matchCase=state.action.currentFilterObject.matchCase;
        this.report.operator=state.action.currentFilterObject.operator;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.report.field="Name";
        this.report.matchCase=false;
        this.report.operator="contains";
        this.report.value="";
        this.report.type="string"
      }
    }
    this.getUMPI();
  }


  getUMPI(){
    this.status="20";
    this.report.agencyId=parseInt(this.global.globalAgencyId);
    if(this.Employee!=null||this.Employee!=undefined)
    {
    this.report.employeeId=parseInt(this.Employee.toString())
    }
  if((this.year==null||this.year==undefined)&&(this.month==null||this.month==undefined))
  {
    this.report.startDate=null;
  }
  else
  {
    if(this.year==null||this.year==undefined)
    {
      this.year=new Date().getFullYear();
    }
    if(this.month==null||this.month==undefined)
    {
      this.month=(new Date().getMonth()+1).toString();
    }
      this.report.startDate=new Date(new Date(this.year,parseInt(this.month)-1,1).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString()
  }
  this.getReport.execute(this.report);
  this.data.subscribe((data:any)=>{
    console.log(data)
    this.datalngth=data.count;
    this.empdata=data.result;
    console.log(this.empdata)
    this.multi = [
      {
        name: 'Pending UMPI',
        value: Math.floor(Number(data.count))
      },
    ];
    this.grid.showColumns(['Month','Exceeded Hrs','Total Hrs']);
  })
  }

  //========================================Refresh function===============================================//

  Refresh(){
    this.report.matchCase=false;
    this.report.operator="startswith";
    this.report.value="";
    this.report.type="string"
    this.report.field="Name"
    this.report.pageitem=10;
    this.report.currentpageno=1;
    this.month=(new Date().getMonth()+1).toString();
    this.year=new Date().getFullYear();
    this.Employee=0;
    this.status="20";
    this.enableExhours=false;
    this.getUMPI();
  }


   ////////////////////////////////get onboard////////////////////////////////////////////////////////////////////////

   getOIGAnalysis() {

   
    this.OperationalService.getOIGAnalysis().subscribe((data: any) => {
      this.Oiglist = data;
      
      // this.onboardLst.forEach(element => {
      //   element.completedOn = this.datepipe.transform(element.completedOn, "MM/dd/yyyy");
      //   element.expiredOn= this.datepipe.transform(element.expiredOn, "MM/dd/yyyy");
      // });
      
    });
  }
  getColumnwidth() {
    this.OperationalService.getcolumwidth().subscribe((data: any) => {
      console.log(data);
      this.global.globalColumn=data
    });
  }
  gotoempDetails(event)
  {
    console.log(event);
  setTimeout(() => {
    let val=this.grid.selectedRowIndex;
    let val1=this.empdata[val];
    this.global.globalemployee=val1.id
    this.global.globalemployeedata=val1;
    console.log(this.global.globalemployee);
    this.router.navigateByUrl("/employee");
   
  },200 );
   
    
  }
}
