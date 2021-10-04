import { Component, OnInit, Output, Input, EventEmitter, TemplateRef, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { CompanyList, agencyStatusList, StatusList, Compaysort, StatusListCompany, IsViewEdit, GetCompanyBO, WhereConditionCompany, GetAgencyBO } from '../../agency.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { AgencyService } from '../../agency.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GlobalComponent } from 'src/app/global/global.component';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { SearchSettingsModel, ToolbarItems, FilterSettingsModel, IFilter, QueryCellInfoEventArgs, DataStateChangeEventArgs } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { element } from 'protractor';
import { WhereCondition } from 'src/app/pages/icd10/icd10.model';
import { Observable } from 'rxjs';
import { GetHTTPServiceCompany } from '../../companylistData.service';
import { async } from '@angular/core/testing';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from 'src/app/pages/list/list.model';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyListComponent implements OnInit {


  @Input() ViewEdit: IsViewEdit;
  @Output() isViewEdit = new EventEmitter<IsViewEdit>();
  /////===============Main functionality initialisation=====================///
  companylist: CompanyList[];
  Company: CompanyList = new CompanyList();
  // Agency: AgencyList = new AgencyList();
  agencyStatusList: agencyStatusList[];
  statusList: StatusList[];
  StatusListCompany: StatusListCompany[];
  ///////////////=============Form initialization==========//
  // AgencyGroup: FormGroup;
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  initialPage: object;
  filterOptions: FilterSettingsModel;
  filter: IFilter;
  TotalCount: number;
  pagesort: Compaysort = new Compaysort();
  Checkfilter: boolean = false;

  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ColumnArray: columnWidth[]
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
  //  pagshort: sortingObj = new sortingObj();
  ////////////////////////////////functionality initialization////////////////////
  isEditCompany: boolean = false;
  isView: boolean = false;
  Type: string = 'edit';
  isEdit: boolean = false;
  /////////////===================Filters ==========//
  //////////==================Filter===============================================////////////////////
  type: string = "";
  public filterSettings: object;
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  ListSendBO: GetAgencyBO = new GetAgencyBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  public dropdata: string[];


  public height = '220px';
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  SearchText: string = '';
  SearchColumn: string = 'CompanyName';
  CompanyFilter: any;
  constructor(public http: HttpClient, private formBuilder: FormBuilder, @Inject(GetHTTPServiceCompany) public gethttp: GetHTTPServiceCompany,
    public global: GlobalComponent, public httpService: AgencyService, public toastrService: ToastrService, public general: generalservice,
    private ref: ChangeDetectorRef) {

    this.data = gethttp;
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 100);
  }

  ngOnInit(): void {

    this.conditionlist.push(new WhereConditionCompany());
    this.getStatusCompany();
    this.SearchColumn = 'CompanyName';
    this.ListSendBO.field = "CompanyName";
    this.ListSendBO.orderColumn = "CompanyName";
    // this.fp = new functionpermission();
    // this.filepermissionget();

    this.filterSettings = { type: 'Menu' };
    this.filter = {
      type: 'Excel'
    };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
  }
  ////////////Filter Functions/////////////////////////////////
  onActionBegin(args) {
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
  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    let f = changes;
  }
  // =================================== data change event=====================///////
  public dataStateChange(state): void {
    this.type = (state.action.requestType).toString();
    if (this.type != "filterchoicerequest") {
      if ((state.sorted || []).length) {
        this.ListSendBO.orderColumn = state.sorted[0].name;
        this.ListSendBO.orderType = state.sorted[0].direction === 'descending' ? 'DESC' : 'ASC';
      }
    }

    if (this.type == "filtering" && state.action.action != "clearFilter") {
      this.ListSendBO.field = state.action.currentFilterObject.field;
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
      this.ListSendBO.value = state.action.currentFilterObject.value;
      if (this.ListSendBO.type == "number") {


        this.ListSendBO.value = state.action.currentFilterObject.value.toString();
        this.ListSendBO.field = state.action.currentFilterObject.field;


      }
      else {
        this.ListSendBO.value = state.action.currentFilterObject.value;
        this.ListSendBO.field = state.action.currentFilterObject.field;
      }
      if (state.action.currentFilterObject.field == "statusValue") {

        this.ListSendBO.value = this.StatusListCompany.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
        this.ListSendBO.field = "statusLid";
        this.ListSendBO.statusLid = parseInt(this.StatusListCompany.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key);
        this.ListSendBO.type = "number";
      }
      this.ListSendBO.matchCase = state.action.currentFilterObject.matchCase;
      this.ListSendBO.operator = state.action.currentFilterObject.operator;
    }
    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "CompanyName";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Company.Pagesize!=state.take)
        {
          this.arraycol[0].Company.Pagesize = state.take
          this.SaveColumnwidth();
        // }

      }
    
    }
    }
    this.ListSendBO.userId = this.global.userID;
    this.getCompany();
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


      var count = 0;
      var count1 = 0;
      if (args.columns.length > 0) {
        if (this.arraycol.length > 0) {
          this.arraycol[0].Company.ShowColumns.forEach(old => {
            showarr.forEach(element => {
              if (old == element) {
                count1 = count1 + 1;
              }
            });

          });

          this.arraycol[0].Company.HideColumns.forEach(old => {
            hidearr.forEach(element => {
              if (old == element) {
                count = count + 1;
              }
            });

          });


          if (this.arraycol[0].Company.ShowColumns.length != count1 || this.arraycol[0].Company.HideColumns.length != count) {
            this.arraycol[0].Company.ShowColumns = showarr;
            this.arraycol[0].Company.HideColumns = hidearr;
            this.SaveColumnwidth();
          }
        }

      }
    }


    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.ListSendBO.pageitem = this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist = [];
    if (args.requestType === "filtering" && args.action === "filter") {
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
      });
    }

  }

  //////////=====================Get Company Fun========================///////////////////////

  getCompany() {

    this.ListSendBO.SearchColumn = this.SearchColumn;
    this.ListSendBO.SearchText = this.SearchText;
    // this.ListSendBO.pageitem=this.pagshort.itemperpage;
    // this.ListSendBO.currentpageno=this.pagshort.currentPgNo;
    // this.ListSendBO.orderColumn=this.pagshort.shortcolumn;
    // this.ListSendBO.orderType=this.pagshort.shortType;
    this.ListSendBO.companyFilter = parseInt(this.CompanyFilter);
    this.ListSendBO.agencyId = this.ViewEdit.AgencyId;
    this.gethttp.execute(this.ListSendBO);
    let count=0;
    this.data.subscribe((data) => {
      count = count+1;
     
      if(data!=null&&data!=undefined && count ==1)
      {
        this.getColumnwidth();
      }
    })


  }
  // getCompany() {

  //   if (this.CompanyFilter == 0) {
  //     this.Checkfilter = true;
  //   }

  //   this.CompanyFilter = (this.CompanyFilter != undefined && this.CompanyFilter != null && this.CompanyFilter != "") && this.CompanyFilter != "" ? parseInt(this.CompanyFilter) : parseInt('0');

  //   this.ListSendBO.SearchColumn = this.SearchColumn;
  //   this.ListSendBO.SearchText = this.SearchText;
  //   this.ListSendBO.pageitem = this.pagesort.itemperpage;
  //   this.ListSendBO.currentpageno = this.pagesort.currentPgNo;
  //   this.ListSendBO.orderColumn = this.pagesort.shortcolumn;
  //   this.ListSendBO.orderType = this.pagesort.shortType;
  //   this.ListSendBO.companyFilter = this.CompanyFilter;
  //   this.ListSendBO.agencyId = this.ViewEdit.AgencyId;

  //   // if (this.conditionlist.length != 0) {
  //   //   this.ListSendBO.conitionBO = this.conditionlist;
  //   // }
  //   // else {
  //   //   this.conditionlist.push(new WhereConditionCompany());
  //   //   this.ListSendBO.conitionBO = this.conditionlist;
  //   // }

  //   if(this.conditionlist.length!=0){
  //     this.conditionlist.forEach((element)=>{
  //       if(element.type=="number")
  //       {

  //         element.value=element.value.toString();

  //       }
  //     })
  //     this.ListSendBO.conitionBO=this.conditionlist;


  //   }
  //   else{
  //     this.conditionlist.push(new WhereConditionCompany());
  //     this.conditionlist[0].value=this.SearchText;
  //     this.conditionlist[0].operator="contains"
  //     this.ListSendBO.conitionBO=this.conditionlist;
  //   }
  //   this.httpService.getCompanyList(this.ListSendBO).subscribe((data: CompanyList[]) => {

  //     // this.loading = true;
  //     // let params = new URLSearchParams();
  //     // params.append("agencyId", this.ViewEdit.AgencyId.toString());
  //     // params.append("companyFilter", this.CompanyFilter);
  //     // params.append("SearchColumn", this.SearchColumn);
  //     // params.append("SearchText", this.SearchText);
  //     // params.append("OrderColumn", this.pagesort.shortcolumn);
  //     // params.append("OrderType", this.pagesort.shortType);
  //     // params.append("Currentpageno", this.pagesort.currentPgNo.toString());
  //     // params.append("Pageitem", this.pagesort.itemperpage.toString());
  //     // this.httpService.getCompanyList(params).subscribe((data: CompanyList[]) => {

  //     this.getCompanyListFilterCount();
  //     this.companylist = data;
  //     this.companylist.forEach(element => {
  //       if (element.phone != null) {
  //         element.phone = this.general.reconverPhoneGoogleLibhttpsave(element.phone);
  //       }
  //       if (element.fax != null) {
  //         element.fax = this.general.reconverPhoneGoogleLibhttpsave(element.fax);
  //       }
  //     });
  //   },
  //     err => {
  //     })
  // }

  getStatusCompany() {

    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    this.httpService.getStatusForCompany(params).subscribe((data: StatusListCompany[]) => {

      this.StatusListCompany = JSON.parse(JSON.stringify(data));

      this.dropdata = data.map(e => e.Value);
      this.StatusListCompany.push({ Key: '0', Value: "All" });
      this.CompanyFilter = this.StatusListCompany.filter(st => st.Value == "Active")[0].Key;

      if (this.CompanyFilter != undefined) {
        this.getCompany();
      }
      else {
        this.CompanyFilter = '0'
        this.getCompany();
      }
    });
  }

  ////////////////////////get Company List Count/////////////////////////////
  getCompanyListFilterCount() {
    let myParams = new URLSearchParams();
    myParams.append("agencyId", this.global.globalAgencyId);
    myParams.append("companyFilter", this.CompanyFilter);
    myParams.append("SearchColumn", this.SearchColumn);
    myParams.append("SearchText", this.SearchText);
    this.httpService.getCompanyListCount(myParams).subscribe((data: number) => {
      this.TotalCount = data;
    },
      err => {

      })
  }
  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }


  // Edit/Add Agent VIEW
  AddandeditCompany(edit) {

    if (edit == 'new') {
      let list = new CompanyList();
      // list.agencyId = this.valuechange;
      this.isViewEdit.emit({ isView: false, isEdit: true, isEditCompany: false, editCompanyId: 0, AgencyId: this.ViewEdit.AgencyId, CompanyData: list })
      this.isEditCompany = false;
    }
    else {
      // let companyval = this.data.filter(E => E.id == edit.id)[0]
      // companyval.agencyId= this.valuechange;
      this.isViewEdit.emit({ isView: false, isEdit: true, isEditCompany: true, editCompanyId: edit.id, AgencyId: this.ViewEdit.AgencyId, CompanyData: edit })
      this.isEditCompany = true;
    }
    this.isEdit = true;

  }

  //////////============FIlter change==============================///////////////////
  filterchange() {

    this.ListSendBO.field = "CompanyName";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = this.SearchText;
    this.ListSendBO.type = "string"
    this.ListSendBO.statusLid = parseInt(this.CompanyFilter);
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.getCompany();
  }
  ////////////  close Company Add and Update validation////////////////////////////////


  valuechangeCompany: any = [];
  valueschangesCompany() {
    this.valuechangeCompany = {
      Provider_No: 0,
      Status: 0,
      Name: 0,
      Admin_LastName: 0,
      Admin_FirstName: 0,
      SubmissionType: 0,
      SubCom_MANo: 0,
      SubCom_MCNo: 0,
      TaxCode_MANo: 0,
      TaxCode_MCNo: 0,
      FEIN_MCNo: 0,
      BP_MANo: 0,
      BP_MCNo: 0,
      billto_Name: 0,
      billto_Street: 0,
      billto_City: 0,
      billto_State: 0,
      billto_zipcode: 0,
      payTo_Street: 0,
      PayTo_City: 0,
      PayTo_State: 0,
      PayTo_zipcode: 0,
      Phone: 0,
      Fax: 0,
    }
  }
  checkpopupCompany(value) {
    if (value == "Provider_No") {
      this.valuechangeCompany.Provider_No++;
    }
    if (value == "Status") {
      this.valuechangeCompany.Status++;
    }
    if (value == "Name") {
      this.valuechangeCompany.Name++;
    }
    if (value == "Admin_LastName") {
      this.valuechangeCompany.Admin_LastName++;
    }
    if (value == "Admin_FirstName") {
      this.valuechangeCompany.Admin_FirstName++;
    }
    if (value == "SubmissionType") {
      this.valuechangeCompany.SubmissionType++;
    }
    if (value == "Phone") {
      this.valuechangeCompany.Phone++;
    }
    if (value == "SubCom_MANo") {
      this.valuechangeCompany.SubCom_MANo++;
    }
    if (value == "SubCom_MCNo") {
      this.valuechangeCompany.SubCom_MCNo++;
    }
    if (value == "TaxCode_MANo") {
      this.valuechangeCompany.TaxCode_MANo++;
    }
    if (value == "TaxCode_MCNo") {
      this.valuechangeCompany.TaxCode_MCNo++;
    }
    if (value == "FEIN_MCNo") {
      this.valuechangeCompany.FEIN_MCNo++;
    }
    if (value == "BP_MANo") {
      this.valuechangeCompany.BP_MANo++;
    }
    if (value == "BP_MCNo") {
      this.valuechangeCompany.BP_MCNo++;
    }
    if (value == "billto_Name") {
      this.valuechangeCompany.billto_Name++;
    }
    if (value == "billto_Street") {
      this.valuechangeCompany.billto_Street++;
    } if (value == "billto_City") {
      this.valuechangeCompany.billto_City++;
    } if (value == "billto_State") {
      this.valuechangeCompany.billto_State++;
    } if (value == "billto_zipcode") {
      this.valuechangeCompany.billto_zipcode++;
    } if (value == "payTo_Street") {
      this.valuechangeCompany.payTo_Street++;
    }
    if (value == "payTo_City") {
      this.valuechangeCompany.payTo_City++;
    }
    if (value == "PayTo_State") {
      this.valuechangeCompany.PayTo_State++;
    }
    if (value == "payTo_zipcode") {
      this.valuechangeCompany.payTo_zipcode++;
    }
    if (value == "Fax") {
      this.valuechangeCompany.Fax++;
    }



  }
  closeFunCompany(ref) {
    ref.close();

    this.closeRefCompany.close();
    this.closeRefCompany = "";
    //  this.refreshCompany()
  }
  closeRefCompany: any;
  openDialogCompany(closecar: TemplateRef<any>, ref) {
    this.closeRefCompany = ref;


    if (this.valuechangeCompany.Provider_No > 1 || this.valuechangeCompany.Status > 1
      || this.valuechangeCompany.Name > 1 || this.valuechangeCompany.Admin_LastName > 1 || this.valuechangeCompany.Admin_FirstName > 1
      || this.valuechangeCompany.Phone > 1 || this.valuechangeCompany.SubmissionType > 1 || this.valuechangeCompany.SubCom_MANo > 1
      || this.valuechangeCompany.SubCom_MCNo > 1 || this.valuechangeCompany.TaxCode_MANo > 1 || this.valuechangeCompany.TaxCode_MCNo > 1
      || this.valuechangeCompany.FEIN_MCNo > 1 || this.valuechangeCompany.BP_MANo > 1 || this.valuechangeCompany.BP_MCNo > 1
      || this.valuechangeCompany.billto_Name > 1 || this.valuechangeCompany.billto_Street > 1 || this.valuechangeCompany.billto_City > 1
      || this.valuechangeCompany.billto_State > 1 || this.valuechangeCompany.billto_zipcode > 1 || this.valuechangeCompany.payTo_Street > 1
      || this.valuechangeCompany.payTo_City > 0 || this.valuechangeCompany.payTo_State > 1 || this.valuechangeCompany.payTo_zipcode > 0
      || this.valuechangeCompany.Fax > 1) {

      //  this.dialogService.open(closecar);
    }
    else {
      ref.close();
      //  this.closeCompany();

    }

  }

  AgencyCreateupdate(type: string) {
    if (type == 'new') {
      this.Type = 'new';
      // this..reset();
      this.Company = new CompanyList();
    }
    else {
      this.Type = 'edit';
    }

    this.valueschangesCompany();
  }
  ///////////////////////////////////////////Refresh function ////////////////////////////////////////////////////

  Refresh() {
    this.SearchText = "";
    this.ListSendBO.matchCase = false;
    this.ListSendBO.operator = "startswith";
    this.ListSendBO.value = this.SearchText;
    this.ListSendBO.type = "string"
    this.ListSendBO.field = "CompanyName"
    this.ListSendBO.companyFilter = +this.StatusListCompany.filter(st => st.Value == "Active")[0].Key;
    this.ListSendBO.statusLid = +this.StatusListCompany.filter(st => st.Value == "Active")[0].Key;
    this.CompanyFilter = +this.StatusListCompany.filter(st => st.Value == "Active")[0].Key;
    this.ListSendBO.pageitem = 10;
    this.ListSendBO.currentpageno = 1;
    this.pagesort = new Compaysort();

    this.getCompany();
  }
  /////////////////////Refresh fun////////////////////////////////////////////
  // Refresh() {
  //   this.conditionlist = [];
  //   this.conditionlist.push(new WhereConditionCompany());
  //   this.SearchText = "";
  //   this.pagesort = new Compaysort();
  //   this.SearchColumn = 'CompanyName';
  //   this.StatusListCompany.forEach(element => {
  //     if (element.Value == "Active") {
  //       this.CompanyFilter = element.Key;
  //     }
  //   });
  //   this.getCompany();
  // }
  paginationChange(event) {
    this.pagesort.currentPgNo = event;
    this.getCompany();

  }
  // /////////////////////////////////////////////////////////////
  pageItemsChage(pageitems) {
    this.pagesort.itemperpage = pageitems;
    this.getCompany();

  }

  // ==============================================================================

  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);

      this.ColumnArray = JSON.parse(data.column)[0].Company.Columns;
  
      //  this.grid.refreshColumns();

     
      let showcol = JSON.parse(data.column)[0].Company.ShowColumns;
      let hidecol = JSON.parse(data.column)[0].Company.HideColumns
    

   //   this.grid.showColumns(showcol);
      this.grid.hideColumns(hidecol);
   
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Company.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Company Name') {

          const column = this.grid.getColumnByField('companyName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Provider Number') {

          const column1 = this.grid.getColumnByField('providerNo'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'BillTo/PayTo Company Name') {

          const column = this.grid.getColumnByField('billto_Name'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Street') {

          const column = this.grid.getColumnByField('billto_Street'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'City') {

          const column = this.grid.getColumnByField('billto_City'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'State') {

          const column = this.grid.getColumnByField('billto_State'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }

        if (element.column == 'Zip Code') {

          const column = this.grid.getColumnByField('billto_zipcode'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        if (element.column == 'Status') {

          const column = this.grid.getColumnByField('statusValue'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();

        }
        else if (element.column == 'Action') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });
  }
  SaveColumnwidth() {
    this.arraycol[0].Company.Columns = this.ColumnArray;
    this.arraycol[0].Company.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

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


