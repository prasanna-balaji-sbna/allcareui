import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from '../../global/global.component';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { SearchSettingsModel, ToolbarItems, PageSettingsModel, Filter } from '@syncfusion/ej2-grids';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { ListPageHTTPService } from './list.service';
import { Listlst, sortingObj, functionpermission, GetListBO, WhereCondition, columnWidth, ColumnChangeBO } from './list.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { } from '../employee/emloyee.model';
import { GetHTTPService } from './listdata.service';
import { filters } from '../timesheet/timesheet.model';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  //  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  // ==================Main Initialization==========================//
  
  ListArray: Listlst[];
  List: Listlst = new Listlst();
  ListSendBO: GetListBO = new GetListBO();
  conditionlist: WhereCondition[] = [];
  conditionData: WhereCondition = new WhereCondition();
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  // ========================Form Initialization=========================//

  ListForm: FormGroup;

  // ========================Table Initialization============================//

  @ViewChild('grid') public grid: GridComponent;
  initialPage: PageSettingsModel;
  public filterSettings: FilterSettingsModel;
  filter: IFilter;
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  TotalCount: number;
  pagshort: sortingObj = new sortingObj();
  SearchColumn: string = 'ListCode';
  SearchText: string = '';
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false;
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;

  saveError: any = "";
  deleteError: any = ""
  saveAlert: boolean = false
  deleteAlert: boolean = false



  valuechange: any = [];
  ModelType: string = 'edit';
  fp: functionpermission;

  constructor(private formBuilder: FormBuilder, @Inject(GetHTTPService) public gethttp: GetHTTPService,
    public global: GlobalComponent, public httpService: ListPageHTTPService, public http: HttpClient,
    public toastrService: ToastrService, public general: generalservice, private ref: ChangeDetectorRef) {


    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data = gethttp;

    this.ListForm = this.formBuilder.group({
      Code: [' ', Validators.required],
      Name: [' ', Validators.required],
      IsAvailableAgency: [' '],
    });
  }
  type: string = "";
  public dataStateChange(state): void {
    console.log(state, "datastate");

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
    }
    else {
      if (this.type == "filtering" && state.action.action == "clearFilter") {
        this.ListSendBO.field = "listCode";
        this.ListSendBO.matchCase = false;
        this.ListSendBO.operator = "startswith";
        this.ListSendBO.value = "";
      }
    }

    if (this.type == "paging" && state.action.name == "actionBegin") {
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
    this.ListSendBO.userId = this.global.userID;

    this.getlist();



  }
  ngOnInit(): void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.fp = new functionpermission();
    this.filepermissionget();
    this.filterSettings = {
      type: 'Menu',
      operators: {
        stringOperator: [
          { value: 'startsWith', text: 'starts with' },
          { value: 'endsWith', text: 'ends with' },
          { value: 'contains', text: 'contains' }
        ],
      },
      showFilterBarStatus: false
    };
    this.initialPage = { currentPage: 1, totalRecordsCount: 0, pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    this.getlist();
    this.getTotalCount()
    // this.ColumnArray = [{ column: 'List Code', width: 100 },
    // { column: 'List Name', width: 100 },
    // { column: 'Actions', width: 100 },]
    // this.getColumnwidth();

  }

  public onActionComplete(args) {

    console.log(args, "args");

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

        this.arraycol[0].List.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].List.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].List.ShowColumns.length != count1 || this.arraycol[0].List.HideColumns.length != count) {
          this.arraycol[0].List.ShowColumns = showarr;
          this.arraycol[0].List.HideColumns = hidearr;
          this.SaveColumnwidth();
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

  change(args: ChangeEventArgs) {
    this.initialPage = { currentPage: args.value };
  }
  // =======================Grid Column selector ================ //
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }

  // ================================================
  ListCreateupdate(type: string) {
    if (type == 'new') {
      this.ModelType = 'new';
      this.ListForm.reset();
      this.List = new Listlst();
      this.valueschanges();
    }
    else {
      this.valueschanges();
      this.ModelType = 'edit';
    }
  }
  // ===================================================
  selectListdetails(ListDetails: Listlst) {
    this.List = JSON.parse(JSON.stringify(ListDetails));
  }
  // ===================================================

  Refresh() {
    this.pagshort = new sortingObj();
    this.getlist();
    this.grid.pageSettings.currentPage = 1;

    // this.getTotalCount();
  }

  // ======================================================

  Search() {
    this.pagshort.currentPgNo = 1;
    // this.getTotalCount();
    this.getlist();
  }

  // =======================================================

  SaveOrUpdateList() {
    let url = "api/List/SaveList";

    var saveList: Listlst = JSON.parse(JSON.stringify(this.List));
    saveList.agencyId = parseInt(this.global.globalAgencyId);
    this.http.post(url, saveList).subscribe((data: number) => {
      document.getElementById('openModal1').click();
      //this.getlist()

      if (data) {
        this.valueschanges();
        //====================== sucess message =============
        if (this.ModelType == 'new') {

          // saveList.id = data;
          // this.ListArray.push(saveList);
          // this.ListForm.reset();
          // this.getlist()


          // saveList.id = data;
          // this.ListArray.push(saveList);
          document.getElementById('openModal1').click();
          this.toastrService.success('List Saved successfully', 'List Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          // this.toastrService.success('List Saved successfully', 'List Saved'),8000;
          // this.getTotalCount();
          this.ListForm.reset();
        }
        else {
          document.getElementById('openModal1').click();
          this.toastrService.success('List Updated successfully', 'List Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          // this.toastrService.success('List Updated successfully', 'List Updated'),8000;
          //this.getlist();
          // this.getTotalCount();
        }
        this.getlist();
      }
    }, (err: any) => {
      if (err) {
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    })
  }


  //===============================================================

  deleteList() {
    //   let url = "api/List/DeleteList?";
    //   let params = new URLSearchParams();
    //   params.append("ListId",this.List.id.toString());
    //   this.http.delete(url + params).subscribe((data: any) => {

    //   this.toastrService.show(
    //       "List has been Deleted Successfully",
    //       "List Deleted ",
    //       ), 8000

    //       //this.getlist();
    //       this.getTotalCount();
    //   },(err:HttpErrorResponse) => {


    //     if(err)
    //     {

    //       this.deleteError=err.error;
    //       this.deleteAlert=true
    //     }
    //     else{
    //       this.deleteError= JSON.stringify(err.error);

    //     }

    //     if (this.deleteError!= "") {

    //       setTimeout(() => {
    //         this.deleteError = "";
    //         this.deleteAlert=false
    //       }, 5000)
    //     }
    //   }
    //   )
    this.httpService.DeleteList(this.List.id).subscribe((data: any) => {
      if (data) {

        // const index: number = this.ListArray.indexOf(this.List);
        // if (index !== -1) {
        //   this.ListArray.splice(index,1);
        // }

        document.getElementById('openModal2').click();
        this.toastrService.success('List deleted successfully', 'List deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.getlist();
      }

    }, (err: any) => {
      if (err) {
        this.toastrService.error(err.error, 'Error'), 8000;
      }
    });
  }

  // ============================================================================

  getlist() {
    this.ListSendBO.userId = this.global.userID;
    this.gethttp.execute(this.ListSendBO);
    let count=0
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined &&count==1 )
    {
      this.getColumnwidth();
    }
    })

  }

  // ==============================================================================
  getTotalCount() {
    this.httpService.gettotalCount(this.conditionlist).subscribe((data: number) => {
      this.TotalCount = data;
      this.initialPage.totalRecordsCount = data;
      // = data;
    });
  }

  // =====================================================

  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "List");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;

    });
  }

  // ======================================================
  valueschanges() {
    this.valuechange = {
      Code: 0,
      Name: 0,
      IsAvailableToAgency: 0,
    }
  }
  checkpopup(value) {
    if (value == "Code") {
      this.valuechange.Code++;
    }
    if (value == "Name") {
      this.valuechange.Name++;
    }
    if (value == "IsAvailableToAgency") {
      this.valuechange.IsAvailableToAgency++;
    }
  }

  openDialog() {
    if (this.valuechange.Code > 1 || this.valuechange.Name > 1 || this.valuechange.IsAvailableToAgency > 1) {
      document.getElementById('cancelmodal').click();
    }
    else {
      document.getElementById('openModal1').click();
    }
  }
  closeAddUpdateModal() {
    document.getElementById('cancelmodal').click();
    document.getElementById('openModal1').click();
  }
  //============================== Tooltip =========================================================//
  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({
      content: toolcontent
    });
    tooltip.appendTo(args.node);

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
 
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].List.Columns;


    
      //  this.grid.refreshColumns();

      let showcol = JSON.parse(data.column)[0].List.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].List.HideColumns
  
    this.grid.hideColumns(hidecol);
    //  this.grid.refreshColumns();
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].List.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'List Code') {

          const column = this.grid.getColumnByField('listCode'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'List Name') {

          const column1 = this.grid.getColumnByField('listName'); // get the JSON object of the column corresponding to the field name
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
    
    this.arraycol[0].List.Columns = this.ColumnArray;
    this.arraycol[0].List.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

      this.getColumnwidth();

    });
  }

}
