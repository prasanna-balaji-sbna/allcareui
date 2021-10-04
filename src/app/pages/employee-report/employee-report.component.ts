import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import{Employee,exceededhourBO} from './employee-report.model';
import{GlobalComponent} from '../../global/global.component';
import{EmployeeReportService} from './employee-report.service'
import { NumericContainer } from '@syncfusion/ej2-grids';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs ,DataStateChangeEventArgs,Column,SearchSettingsModel, ToolbarItems} from '@syncfusion/ej2-angular-grids';
import {GetEmployeeReprtservice}from './getReport.service';
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../icd10/icd10.model';
//import { GridComponent } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeReportComponent implements OnInit {
////////////////////////////////////////////////// obserable variable /////////////////////////////////////////////////////////
public data: Observable<DataStateChangeEventArgs>;
public state: DataStateChangeEventArgs;

///////////////////////////////////////////FormatOptions/////////////////////////////////////
public formatOptions: object;
public formatPhoneNumber: object;
type:string;

report=new exceededhourBO();
  constructor(public router:Router,public global:GlobalComponent,public reportService:EmployeeReportService,
    @Inject(GetEmployeeReprtservice) public getReport: GetEmployeeReprtservice, private ref: ChangeDetectorRef)   {

    //   ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
      this.data=getReport;
     }
  ReportstatusList:any=[]
  EmployeeDropdown:any=[]
  month:string=(new Date().getMonth()+1).toString();
  monthList:any=[];
  currentYear:number;
  year:number=new Date().getUTCFullYear();
  curmonth:string="";
  status:string;
  Employee:number;
  enableExhours:boolean=false;
  datalngth:number=0

  //===============================Ejs Grid Variable Intialization========================================================//
  @ViewChild('grid') public grid: GridComponent;
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  public submissiondrop: string[];
  public height = '220px';
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  filterOptions: FilterSettingsModel
  initialPage: object
  filter: IFilter;
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  ngOnInit(): void {
    this.filterOptions = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};
    this.getfilter();
   this.getEmployeedata()
  
    this.getMonthList()
    
  }
  ////////////////////////////////////back function///////////////////////////////////////////////////////////////////
  back()
  {
    this.router.navigateByUrl("/employee");
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
/////////////////////////////////////filter type/////////////////////////////////////////////////////////////////////
getfilter()
{
 
  let params = new URLSearchParams();
  params.append("Code", "EMPLOYEEREPORTDROPDOWN");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.reportService.getEmployeeStatus( params).subscribe((data: any) => {
  for (let i = 0; i < data.length; i++) {
      if (data[i].Value == "Pending UMPI") {
        this.status = data[i].Key;
      }

      if (data[i].Value == "InActive") {

        continue;

      }

      this.ReportstatusList.push(data[i]);
     
    }
  
    this.getUMPI()
});
}
///////////////////////////////get Employee data////////////////////////////////////////////////////////////////////
getEmployeedata()
{
  let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
  this.reportService.getEmployee(params).subscribe((data:any)=>{
   
    data.forEach(element => {
      element.value=element.id.toString();
     
      element.label=element.firstName
    });
    this.EmployeeDropdown=data;

  })
}
////////////////////////////////////get month/////////////////////////////////////////////////////////////////
getMonthList() {
  
  let params = new URLSearchParams();
  params.append("Code", "MONTH");
  params.append("agencyId", this.global.globalAgencyId);
  params.append("userId", this.global.userID);
  this.reportService.getMonthList(params).subscribe((data: any) => {
   
    this.currentYear = new Date().getFullYear();
    
    this.monthList = data;
    this.curmonth = (new Date().getMonth() + 1).toString();
    for(let i=0;i<this.monthList.length;i++)
    {
      
      this.monthList[i].label = this.monthList[i].Value;
      this.monthList[i].value = (i+1).toString();
      if (this.monthList[i].value == this.curmonth) {
        this.month = this.monthList[i].value.toString();
      }
    }


  })
}
///////////////////////////////////filter change/////////////////////////////////////////////////////////
filterchange()
{
  let val=this.ReportstatusList.filter(r=>r.Value == "Exceeded Hours")[0].Key;

  if(val==this.status)
  {
    this.enableExhours=true;
  }
  else{
    this.enableExhours=false;
    
  }
}
getUMPI()
{
  
//console.log(this.month)
//console.log(this.Employee)
  let val=this.ReportstatusList.filter(r=>r.Value == "Exceeded Hours")[0].Key

  if(this.status==val)
  {
    this.type="EX"
  }
  else
  {
    this.type="UMPI";
  }
  
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
//console.log(this.report.startDate)
 this.getReport.execute(this.report,this.type,this.monthList);
 let count=0;
 this.data.subscribe((data:any)=>{
   count =count+1;
   this.datalngth=data.count;
  console.log(data)
   if(this.status==val)
   {
    this.grid.showColumns(['Month','Exceeded Hrs','Total Hrs']);
   }
   else{
    this.grid.hideColumns(['Month','Exceeded Hrs','Total Hrs']);
   }
   if(data!=null&& data!=undefined && count==1)
   {
     this.getColumnwidth();
   }
 })
}
//========================================Ejs Data change Event ===============================================//
public dataStateChange(state): void {
  //console.log("Stats chage",state);    
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
      //console.log(state.action.currentFilterObject.value)
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
  if ( this.type == "paging" && state.action.name == "actionBegin") {
    console.log( "save page size")
    // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Employeereport.Pagesize!=state.take)
        {
          this.arraycol[0].Employeereport.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }}
    }
}
//========================================Refresh function===============================================//

Refresh()
{
 
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
this.status=this.ReportstatusList.filter(r=>r.Value == "Pending UMPI")[0].Key;
this.enableExhours=false;
  this.getUMPI();
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
 //=========================print=====================================================================//
 print()
 {
   this.grid.print()
 }

   // ==============================================================================

   getColumnwidth() {
    this.reportService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      this.ColumnArray = JSON.parse(data.column)[0].Employeereport.Columns;
     
  //     let showcol = JSON.parse(data.column)[0].Clientreport.ShowColumns;
  //     let hidecol = JSON.parse(data.column)[0].Clientreport.HideColumns
    

  //  //   this.grid.showColumns(showcol);
  //     this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Employeereport.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Employee') {

          const column = this.grid.getColumnByField('name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Month') {

          const column1 = this.grid.getColumnByField('month'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Exceeded Hrs') {

          const column = this.grid.getColumnByField('exceededHours'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Total Hrs') {

          const column = this.grid.getColumnByField('totalhours'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Email') {

          const column = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'phone') {

          const column = this.grid.getColumnByField('phone1'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
 
     
        
      });


    });
  }
  SaveColumnwidth() {
    this.arraycol[0].Employeereport.Columns = this.ColumnArray;
    this.arraycol[0].Employeereport.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.reportService.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
