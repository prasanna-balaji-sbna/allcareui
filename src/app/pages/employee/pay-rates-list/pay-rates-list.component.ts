import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { PayRateUnit, IsViewEditpayrate, functionpermission, GetpayrateBO } from '../emloyee.model';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { EmployeeService } from '../employee.service';
import { DatePipe } from '@angular/common';
import { outputs } from '@syncfusion/ej2-angular-grids/src/grid/grid.component';
import { GlobalComponent } from 'src/app/global/global.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../icd10/icd10.model';
import { GetEmployeeservice } from '../employeedata.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pay-rates-list',
  templateUrl: './pay-rates-list.component.html',
  styleUrls: ['./pay-rates-list.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayRatesListComponent implements OnInit {
  payrateLst: PayRateUnit[]
  @Input() payratevalueChange: number;
  @Output() IsViewEditpayrate = new EventEmitter<IsViewEditpayrate>();
  EmpId: number;

  fp: functionpermission=new functionpermission();
  /////////////////////////////Table Intialize variable//////////////////////////////////////////////////////////////////////
  filterOptions: FilterSettingsModel;
  initialPage: object;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;
  tempayrate:PayRateUnit[];
  public formatOptions: object;
 ////////////////////////////////////////////////// obserable variable /////////////////////////////////////////////////////////
 public data: Observable<DataStateChangeEventArgs>;
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO= new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ListBO:GetpayrateBO=new GetpayrateBO();
  /////////////////////////////Constructor////////////////////////////////////////////////////////////////////////////////////
  constructor(public EmployeeService: EmployeeService, public datepipe: DatePipe,public global:GlobalComponent,private ref: ChangeDetectorRef
    , @Inject(GetEmployeeservice) public EmployeeRequest: GetEmployeeservice) { 

    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    this.data= EmployeeRequest;
  }
  ////////////////////////////Page Intial Setup//////////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    this.EmpId = this.payratevalueChange
    this.getpermission()
    this.filterOptions = { type: 'Excel' };
    this.filter = {
      type: 'Excel'
    };
    
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.initialPage = { pageSizes: ['10','15', '20', '50','100','250'], pageSize: 10 }
    this.getpayrate()
    // this.getColumnwidth();
  }
  //////////////////////////////get PayRate///////////////////////////////////////////////////////////////////////////////
  getpayrate() {
    let payrateparams = new URLSearchParams();
    this.ListBO.clientId = this.global.clientId;
    this.ListBO.employeeID = this.EmpId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());

    this.EmployeeRequest.executepayrate( this.ListBO)
    let count=0;
    this.data.subscribe((datas:any) => {console.log(datas,"datapayrate");      
    if(datas.count>0){
      count++;
       if(datas!=null&& datas!=undefined&&count==1)
     {
      this.getColumnwidth();
     }
      this.payrateLst = datas.result;
      this.payrateLst.forEach(e => { e.startDate = this.datepipe.transform(e.startDate, "MM/dd/yyyy") })
      this.tempayrate=JSON.parse(JSON.stringify(this.payrateLst))
    }
    else
    {
      this.payrateLst =[]
      this.tempayrate=JSON.parse(JSON.stringify(this.payrateLst))
    }
     
     

    });
  }
  ////////////////////////////open create edit Modal/////////////////////////////////////////////////////////////////////////   
  editPayrate(type,edit) {
    let val=JSON.parse(JSON.stringify(this.tempayrate))
//console.log(edit);
    if (type == 'new') {
      this.IsViewEditpayrate.emit({ isView: false, isEdit: true, isEditPayorrate: false, employeeId: this.EmpId, payrateId: 0, payrate: val,payratetype:'payrate' })
    }
    else if(type=='manage'){
      //console.log(edit)
      this.IsViewEditpayrate.emit({ isView: false, isEdit: true, isEditPayorrate: true, employeeId: this.EmpId, payrateId: 0, payrate:val,payratetype:'manage' })
    }
    else if(type=='edit') {
      //console.log(edit)
      this.IsViewEditpayrate.emit({ isView: false, isEdit: true, isEditPayorrate: true, employeeId: this.EmpId, payrateId: edit.id, payrate: val,payratetype:'payrate' })
    }
    else  {
      //console.log(edit)
      this.IsViewEditpayrate.emit({ isView: false, isEdit: true, isEditPayorrate: true, employeeId: this.EmpId, payrateId: edit.id, payrate: val,payratetype:'delete' })
    }
  }
  getpermission() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermissionemployee?";
    params.append("pagecode", "Employee");
    params.append("roleId", this.global.roleId);
    params.append("agencyId", this.global.globalAgencyId)
    this.EmployeeService.getEmployeepermission(params).subscribe((data: any) => {
  
      if (data != null) {
        this.fp = data;
  
      }
      else {
        this.fp = new functionpermission();
      }
    },
      (err: HttpErrorResponse) => {
        this.fp = new functionpermission();
      })
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


  // ==============================================================================

  getColumnwidth() {
    this.EmployeeService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);
  
  
      this.ColumnArray = JSON.parse(data.column)[0].Pay_rates.Columns;
  
  
     
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      console.log(this.ColumnArray,"ColumnArray====");
      
  
      // this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Employee.Pagesize
  
      this.ColumnArray.forEach(element => {
  
  
  
        if (element.column == 'Service') {
  
          const column = this.grid.getColumnByField('masterServiceName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;
  
          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Start Date') {
  
          const column1 = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Pay Rate') {
  
          const column1 = this.grid.getColumnByField('payRate'); // get the JSON object of the column corresponding to the field name
        
          column1.width = element.width;
  
          this.grid.refreshHeader();
        }
        if (element.column == 'Rate Unit') {
  
          const column1 = this.grid.getColumnByField('payarateunit'); // get the JSON object of the column corresponding to the field name
        
          column1.width = element.width;
  
          this.grid.refreshHeader();
        }
        
        else if (element.column == 'Actions') {
  
          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();
  
        }
      });
  
  
    });
  
  }
  SaveColumnwidth() {
    this.arraycol[0].Pay_rates.Columns = this.ColumnArray;
    this.arraycol[0].Pay_rates.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.EmployeeService.savecolumwidth(this.columnchange).subscribe((data: any) => {
  
      this.getColumnwidth();
  
    });
  }
  
  
  
  onResize(args) {
    console.log(args,"resize====");
    console.log(this.grid,"this.grid");
    
    const column = this.grid.getColumnByField(args.column.field)
    column.width = args.column.width;
    this.ColumnArray.forEach(element => {
      if (element.column == column.headerText) {
        element.width = parseInt(column.width.toString());
      }
  
    });
    this.SaveColumnwidth();
  }

  //========================= evnt change =====================================================================//
 public dataStateChange(state): void {
  console.log("Stats chage",state);    
  let val = (state.action.requestType).toString();
  if (val != "filterchoicerequest") {
    if ((state.sorted || []).length) {
      this.ListBO.orderColumn = "PayRate";
      this.ListBO.orderType = 'asc';
      console.log(this.ListBO,"Evaluation=====");
      
    }
  }
  if (this.ListBO.type == "date") {
    //console.log(state.action.currentFilterObject.value)
    this.ListBO.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.ListBO.field = state.action.currentFilterObject.field;
  }
  if (val == "filtering" && state.action.action != "clearFilter") {
    this.ListBO.field = state.action.currentFilterObject.field;
    this.ListBO.matchCase = state.action.currentFilterObject.matchCase;
    this.ListBO.operator = state.action.currentFilterObject.operator;
    this.ListBO.value = state.action.currentFilterObject.value;
  }
  else {
    if (val == "filtering" && state.action.action == "clearFilter") {
      this.ListBO.field = "PayRate";
      this.ListBO.matchCase = false;
      this.ListBO.operator = "contains";
      this.ListBO.value = "";
      this.ListBO.type = "string"
      this.ListBO.clientId = this.global.clientId;
    }
  }
  if (val == "paging" && state.action.name == "actionBegin") {
    // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Startofcare.Pagesize!=state.take)
        {
          this.arraycol[0].Startofcare.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
  this.getpayrate();
}

  /////////////////////////////Action Begin ////////////////////////////////////////////////////////

  public onActionComplete(args) {

        
    
    //console.log(this.grid.pagerModule.pagerObj.currentPage)
    this.ListBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;

    if (args.name == "actionBegin" && args.requestType == "filterbeforeopen") {
      this.ListBO.type = args.columnType
      console.log(args.column, "args")
    }
    console.log(this.ListBO)

  }

}
