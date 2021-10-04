import { Component, OnInit, Inject, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from 'src/app/date.service';
import { gettimesheetBO } from './client-report-modal'
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalComponent } from '../../global/global.component';
import { ClientReportService } from './client-report.service'
import { ToastrService } from 'ngx-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { GetclientReport } from './clinet-repotdata.service';
import { GridComponent, ToolbarItems, SearchSettingsModel, DataStateChangeEventArgs, FilterSettingsModel, QueryCellInfoEventArgs, IFilter } from '@syncfusion/ej2-angular-grids';
import { Observable } from 'rxjs';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../icd10/icd10.model';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientReportComponent implements OnInit {

  filters: gettimesheetBO = new gettimesheetBO()
  clientlist: [{ label: string, value: string }]
  clientReportFilterList:  [{ label: string, value: string }]
  datalength:number=0;
  aidfilter:gettimesheetBO = new gettimesheetBO()


  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  //===============================Date picker Intialization==================================================//
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  //===============================Ejs Grid Variable Intialization========================================================//
  @ViewChild('grid') public grid: GridComponent;
  public pageSizes: number[] = [10,15, 20, 50,100,250];
  public submissiondrop: string[];
  public height = '220px';
  public toolbar: ToolbarItems[];
  public searchSettings: SearchSettingsModel;
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  filterOptions: FilterSettingsModel
  initialPage: object
  filter: IFilter;

  public formatOptions: object;

  constructor(private router: Router, public dateservice: DateService, public global: GlobalComponent, public toastrService: ToastrService,
    public clientReport: ClientReportService, @Inject(GetclientReport) public getdata: GetclientReport,private ref: ChangeDetectorRef) {
    this.data = getdata;
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
  }

  ngOnInit(): void {
    this.toolbar = ['ColumnChooser'];
    if (this.global.globalAgencyId != 0) {
      this.getclient();
      this.getsatutus();
      this.getreportLst();
    }
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.filterOptions = { type: 'Menu' };

    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
  }
  //===================================back===============================================================//
  back() {
    this.router.navigateByUrl('/client-parent');
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

  //============================date function============================================================//
  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'start') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.aidfilter.start = val1;
        }
      }
      if (name == 'end') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.aidfilter.end = val1;
        }
      }

    }
    if (type == "datechagned") {
      if (name == 'start') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.aidfilter.start = val1;

        }
      }
      if (name == 'end') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.aidfilter.end = val1;
        }
      }

    }
  }
  //=============================get client list=======================================================//
  getclient() {
    let param = new URLSearchParams();
    param.append("AgencyId", this.global.globalAgencyId.toString());

    this.clientReport.getClientdata(param).subscribe((data: any) => {

      data.forEach(element => {
        element.value = element.id

        element.label = element.names
      });
      this.clientlist = data;
    },
      (err: HttpErrorResponse) => {
        if (err.error.errors) {
          this.toastrService.error(
            err.error.errors,
            "error",
          );

        }
        else {
          this.toastrService.error(
            err.error,
            "error",
          );


        }



      })
  }
  //==========================get status=============================================================//
  getsatutus() {

    let params = new URLSearchParams();
    params.append("Code", "CLIENTREPORT");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.clientReport.getstatusdata(params).subscribe((data: any) => {


      for (let i = 0; i < data.length; i++) {
        data[i].value= data[i].Key.toString();
    
        if (data[i].Value == "InActive") {

          continue;

        }
        data[i].label=data[i].Value;
        
      }
      this.clientReportFilterList=data
      if(this.clientReportFilterList.length>0)
      {
        this.aidfilter.status=this.clientReportFilterList.filter(f=>f.label== "Expired SA")[0].value;
      }
      //console.log(this.clientReportFilterList);
    }, (err: HttpErrorResponse) => {
      if (err.error.errors) {
        this.toastrService.error(
          err.error.errors,
          "error",
        );

      }
      else {
        this.toastrService.error(
          err.error,
          "error",
        );


      }

    })
  }
  //============================get Client Report==================================================//
  getreportLst() {
    //console.log(this.aidfilter)
    if (this.aidfilter.start == undefined) {
      this.aidfilter.start = "";
    }
    if (this.aidfilter.end == undefined) {
      this.aidfilter.end = "";
    }

    if (this.aidfilter.client == undefined) {
      this.filters.client = 0;
    }
    else
    {
      this.filters.client=parseInt(this.aidfilter.client.toString());
    }
    if (this.aidfilter.status == undefined ||this.aidfilter.status == null) {
      this.filters.clientstatus = "Expired SA";
    }
    else{
      //console.log(this.aidfilter.status)
      this.filters.clientstatus=this.clientReportFilterList.filter(c=>c.value==this.aidfilter.status.toString())[0].label;
      //console.log( this.filters.clientstatus)
    }
 
   
    if (this.aidfilter.start != undefined && this.aidfilter.start != null&&this.aidfilter.start != "") {
      this.filters.start = new Date(new Date(this.aidfilter.start).toLocaleDateString() + " " + "00:00:00" + " " + " GMT").toISOString()
    }
    else{
      this.filters.start =null;
    }
    if (this.aidfilter.end != undefined && this.aidfilter.end != null && this.aidfilter.end != "") {
      this.filters.end = new Date(new Date(this.aidfilter.end).toLocaleDateString() + " " + "00:00:00" + " " + " GMT").toISOString()
    }
    else
    {
      this.filters.end=null;
    }
    this.filters.agencyId=parseInt(this.global.globalAgencyId.toString())

    this.getdata.execute(this.filters);
    let count=0;
    this.data.subscribe((data: any) => {
      count =count+1;
      if (this.filters.clientstatus == "Exceeded SA Limit") {
        this.grid.showColumns(['Exceeded Unit']);
        this.grid.hideColumns(['Used Unit', 'Remaining Unit'])

      }
      if (this.filters.clientstatus == "Under SA Limit") {
        this.grid.hideColumns(['Exceeded Unit']);
        this.grid.showColumns(['Used Unit', 'Remaining Unit'])

      }
      if (this.filters.clientstatus == "Expired SA") {
        this.grid.hideColumns(['Exceeded Unit', 'Used Unit', 'Remaining Unit']);


      }
      this.datalength=data.Count;
      if( data !=null && data != undefined && count==1)
      {
        this.getColumnwidth();
      }
    })
  }
  //=============================Refresh===========================================================//
  Refresh() {
    this.filters = new gettimesheetBO()
    this.aidfilter = new gettimesheetBO()
    this.getreportLst();

  }
  //=========================print=====================================================================//
  print() {
    this.grid.print()
  }
  //===================================OnActionComplete==================================================//
  public onActionComplete(args) {

    // if (args.requestType == "columnstate") {
    //   let hidearr = [];
    //   let showarr = [];
    //   this.grid.columns.forEach(element => {
    //     if (element.visible == false && element.headerText != "Actions" && element.headerText != "") {
    //       hidearr.push(element.headerText);
    //     }
    //     if (element.visible == true && element.headerText != "Actions" && element.headerText != "") {
    //       showarr.push(element.headerText);
    //     }
    //   })
    //   var count = 0;
    //   var count1 = 0;
    //   if (args.columns.length > 0) {
    //     if (this.arraycol.length > 0) {
    //       this.arraycol[0].Clientreport.ShowColumns.forEach(old => {
    //         showarr.forEach(element => {
    //           if (old == element) {
    //             count1 = count1 + 1;
    //           }
    //         });

    //       });

    //       this.arraycol[0].Clientreport.HideColumns.forEach(old => {
    //         hidearr.forEach(element => {
    //           if (old == element) {
    //             count = count + 1;
    //           }
    //         });

    //       });
        

    //       if (this.arraycol[0].Clientreport.ShowColumns.length != count1 || this.arraycol[0].Clientreport.HideColumns.length != count) {
          
    //         // this.temphide = hidearr;
    //         this.arraycol[0].Clientreport.ShowColumns = showarr;
    //         this.arraycol[0].Clientreport.HideColumns = hidearr;
    //         this.arraycol[0].Clientreport.Pagesize = this.grid.pagerModule.pagerObj.pageSize
    //         console.log("save column chooser");
            
    //         this.SaveColumnwidth();
    //       }
    //     }

    //   }
    // }
    this.filters.currentpage = this.grid.pagerModule.pagerObj.currentPage;
    this.filters.pageitems = this.grid.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.filters.type = args.columnType

    }


  }
  //========================================Ejs Data change Event ===============================================//
public dataStateChange(state): void {
  //console.log("Stats chage",state);    
  let type = (state.action.requestType).toString();
  if(type!="filterchoicerequest"){
    if ((state.sorted || []).length) {
      this.filters.orderColumn = state.sorted[0].name;
      this.filters.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
    }   
   }
  if(type == "filtering" && state.action.action!="clearFilter"){
    if(this.filters.type=="number")
    {
     
     
       this.filters.value=state.action.currentFilterObject.value.toString();
       this.filters.field=state.action.currentFilterObject.field;
    
      
    }
    if(this.filters.type=="date")
    {
      //console.log(state.action.currentFilterObject.value)
      this.filters.value=new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString()+" " +"00:00:00"+" "+"GMT").toISOString();
      this.filters.field=state.action.currentFilterObject.field;
    }
    else{
      this.filters.value=state.action.currentFilterObject.value;
      this.filters.field=state.action.currentFilterObject.field;
    }
    
    
      
      this.filters.matchCase=state.action.currentFilterObject.matchCase;
      this.filters.operator=state.action.currentFilterObject.operator;
     
  }
  else{
    if(type == "filtering" && state.action.action=="clearFilter"){
      this.filters.field="Name";
      this.filters.matchCase=false;
      this.filters.operator="contains";
      this.filters.value="";
      this.filters.type="string"
    }
  }
  
  this.getreportLst();
  if (type == "paging" && state.action.name == "actionBegin") {
    // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Clientreport.Pagesize!=state.take)
        {
          this.arraycol[0].Clientreport.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
}


  // ==============================================================================

  getColumnwidth() {
    this.clientReport.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      this.ColumnArray = JSON.parse(data.column)[0].Clientreport.Columns;
     
  //     let showcol = JSON.parse(data.column)[0].Clientreport.ShowColumns;
  //     let hidecol = JSON.parse(data.column)[0].Clientreport.HideColumns
    

  //  //   this.grid.showColumns(showcol);
  //     this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Clientreport.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Client Name') {

          const column = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'DOB') {

          const column1 = this.grid.getColumnByField('dOB'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Start Date') {

          const column = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'End Date') {

          const column = this.grid.getColumnByField('endDate'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Insurance No') {

          const column = this.grid.getColumnByField('insuranceNumber'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Company') {

          const column = this.grid.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Payor') {

          const column = this.grid.getColumnByField('payorName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Service') {

          const column = this.grid.getColumnByField('serviceCode'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Total Unit') {

          const column = this.grid.getColumnByField('totalUnits'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Exceeded Unit') {

          const column = this.grid.getColumnByField('exceededUnits'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Used Unit') {

          const column = this.grid.getColumnByField('usedUnits'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Remaining Uni') {

          const column = this.grid.getColumnByField('remainingUnits'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        
      });


    });
  }
  SaveColumnwidth() {
    this.arraycol[0].Clientreport.Columns = this.ColumnArray;
    this.arraycol[0].Clientreport.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.clientReport.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
