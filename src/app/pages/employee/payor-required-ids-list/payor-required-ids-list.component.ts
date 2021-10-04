import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { PayorRequiredID, IsViewEditpayorequired, functionpermission, GetpayeridBO } from '../emloyee.model';
import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { EmployeeService } from '../employee.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../../icd10/icd10.model';
import { Observable } from 'rxjs';
import { GetEmployeeservice } from '../employeedata.service';

@Component({
  selector: 'app-payor-required-ids-list',
  templateUrl: './payor-required-ids-list.component.html',
  styleUrls: ['./payor-required-ids-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayorRequiredIDsListComponent implements OnInit {
  ////////////////////////////////////////////////////
  payorRequiredIdLst: PayorRequiredID[];
  EmployeeId: number;
  @Input() employeeId: number;
  @Output() IsViewEditpayorequired = new EventEmitter<IsViewEditpayorequired>()
  public formatOptions: object;
  /////////////////////////////Table Intialize variable/////////////////////////////////////////////////////////////////////
  filterOptions: FilterSettingsModel;
  initialPage: object;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;
  fp: functionpermission = new functionpermission();


  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ListBO: GetpayeridBO = new GetpayeridBO();
  public data: Observable<DataStateChangeEventArgs>;
  ////////////////////////////////////constructor///////////////////////////////////////////////////////////////////////////
  constructor(public EmployeeService: EmployeeService, public datepipe: DatePipe, public toastrService: ToastrService,
    public global: GlobalComponent, private ref: ChangeDetectorRef, @Inject(GetEmployeeservice) public EmployeeRequest: GetEmployeeservice) {
    ref.detach();
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
    this.data = EmployeeRequest;
  }
  //////////////////////////////Intial Page Setup///////////////////////////////////////////////////////////////////////////
  ngOnInit() {
    //console.log(this.employeeId);
    //console.log( this.IsViewEditpayorequired);
    this.getpermission();
    this.filterOptions = { type: 'Excel' };
    this.filter = {
      type: 'Excel'
    };
    this.formatOptions = { type: 'date', format: 'MM/dd/yyyy' };
    this.initialPage = { pageSizes: ['10', '15', '20', '50', '100', '250'], pageSize: 10 }
    this.getPayorRequiredId()
    // this.getColumnwidth();

  }
  ///////////////////////////////////////get payorRequiredData//////////////////////////////////////////////////////////////
  getPayorRequiredId() {
    let params = new URLSearchParams();
    params.append("EmployeeID", this.employeeId.toString());
    this.ListBO.clientId = this.global.clientId;
    this.ListBO.employeeID = this.employeeId;
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());

    this.EmployeeRequest.executepayerId(this.ListBO)
    let count=0;
    this.data.subscribe((datas: any) => {
      console.log(datas, "data");
      this.payorRequiredIdLst = datas.result;
      if (datas.count > 0) {
        count++;
        if(datas!=null&& datas!=undefined&&count==1)
        {
         this.getColumnwidth();
        }
        this.payorRequiredIdLst.forEach(element => {
          element.startDate = this.datepipe.transform(element.startDate, "MM/dd/yyyy")
          element.endDate = this.datepipe.transform(element.endDate, "MM/dd/yyyy")
          element.faxDate = this.datepipe.transform(element.faxDate, "MM/dd/yyyy")
        })
      }
    });

  }
  /////////////////////////////add and Edit Payor Required Id////////////////////////////////////////////////////////////////
  editPayorRequiredId(type, edit) {
    //console.log(type);

    if (type == 'new') {
      this.IsViewEditpayorequired.emit({ isView: false, isEdit: true, isEditPayorRequired: false, employeeId: this.employeeId, payorRequiredId: 0, payorRequired: this.payorRequiredIdLst, payorActiotype: 'create' })
    }
    else if (type == 'edit') {
      //console.log(edit)
      this.IsViewEditpayorequired.emit({ isView: false, isEdit: true, isEditPayorRequired: true, employeeId: this.employeeId, payorRequiredId: edit.id, payorRequired: this.payorRequiredIdLst, payorActiotype: 'edit' })
    }
    else {
      //console.log(edit)
      this.IsViewEditpayorequired.emit({ isView: false, isEdit: true, isEditPayorRequired: true, employeeId: this.employeeId, payorRequiredId: edit.id, payorRequired: this.payorRequiredIdLst, payorActiotype: 'delete' })
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
    if (args.column.field != null) {
      if (args.data[args.column.field] != null) {
        const tooltip: Tooltip = new Tooltip({
          content: args.data[args.column.field].toString(),
          position: 'RightCenter',


        }, args.cell as HTMLTableCellElement);
      }
    }
  }

  // ==============================================================================

  getColumnwidth() {
    this.EmployeeService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Payor_required_ids.Columns;



      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }



      // this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Employee.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Payors') {

          const column = this.grid.getColumnByField('payorName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'ID Number') {

          const column1 = this.grid.getColumnByField('billingPayorRequiredID'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Start Date') {

          const column1 = this.grid.getColumnByField('startDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'End Date') {

          const column1 = this.grid.getColumnByField('endDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'Fax Date') {

          const column1 = this.grid.getColumnByField('faxDate'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Received') {

          const column1 = this.grid.getColumnByField('received'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }

      });


    });

  }
  SaveColumnwidth() {
    this.arraycol[0].Payor_required_ids.Columns = this.ColumnArray;
    // this.arraycol[0].Payor_required_ids.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.EmployeeService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }



  onResize(args) {
    console.log(args, "resize====");
    console.log(this.grid, "this.grid");

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
    console.log("Stats chage", state);
    let val = (state.action.requestType).toString();
    if (val != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.ListBO.orderColumn = "PayorName";
        this.ListBO.orderType = 'asc';
        console.log(this.ListBO, "Evaluation=====");

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
        this.ListBO.field = "PayorName";
        this.ListBO.matchCase = false;
        this.ListBO.operator = "contains";
        this.ListBO.value = "";
        this.ListBO.type = "string"
        this.ListBO.clientId = this.global.clientId;
      }
    }
    if (val == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if (this.arraycol.length != 0) {
        if (this.arraycol[0].Payor_required_ids.Pagesize != state.take) {
          this.arraycol[0].Payor_required_ids.Pagesize = state.take
          console.log("save page size")
          this.SaveColumnwidth();
          // }

        }

      }

    }
    this.getPayorRequiredId();
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
