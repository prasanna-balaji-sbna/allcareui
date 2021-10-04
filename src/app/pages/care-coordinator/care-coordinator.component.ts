import { Component, OnInit, ViewChild, Inject, Input,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs,QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { carecordinatorService } from './care-cordinator.service';
import { careCordinatorList, searchfilterDetails, sortingObj, functionpermission, GetCareListBo, WhereCondition } from './care-coordinator.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './care-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { outputs } from '@syncfusion/ej2-angular-grids/src/grid/grid.component';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ColumnChangeBO, columnWidth } from '../list/list.model';
@Component({
  selector: 'app-care-coordinator',
  templateUrl: './care-coordinator.component.html',
  styleUrls: ['./care-coordinator.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CareCoordinatorComponent implements OnInit {
  /////===============Main functionality initialisation=====================///
  CareArray: careCordinatorList[];
  Care: careCordinatorList = new careCordinatorList();
  CareSendBO:GetCareListBo = new GetCareListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  @Input() fromClient:string;
  @Output() emitcarecode=new EventEmitter<number>()
  clientEnable:boolean=false;
  clientedit:boolean=false;
  ///////////////=============Form initialization==========//
  CareForm: FormGroup;
  /////////////===================Filters ==========//
  filterItems: { [key: string]: string } = {
    'careCoordinatorName': 'Name',
    'County': 'County',
    'Telephone': 'Telephone',
    'Fax': 'Fax',
    'Alternate_Fax': 'Alternate_Fax',
    'Email': 'Email'
  };
  SearchText: string = ''; 
  SearchColumn: { [key: string]: string } = { 'careCoordinatorName': 'Name' };
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
    ///////////////================Column chooser=================////////
  public filterSettings: object;
  filter: IFilter;
  Filter_drop: searchfilterDetails;
  TotalCount: number;  
  pagshort: sortingObj = new sortingObj(); 
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
   
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  
  ColumnArray: columnWidth[]
  ////////////////========Functionlity initializations==========//
  ModelType: string = 'edit';
  fp: functionpermission;
  valuechange:any = [];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  phoneNumber = "^(\+\d{1,3}[- ]?)?\d{10}$";


  constructor(public http: HttpClient, private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
  private ref: ChangeDetectorRef,  public global: GlobalComponent, public httpService: carecordinatorService, public toastrService: ToastrService, public general: generalservice,private ngxService: NgxUiLoaderService,) {
   
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.CareForm = this.formBuilder.group({
      careCoordinatorName: [' ', Validators.required],
      Telephone: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      Email: ['', Validators.email],
      Fax: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      Alternate_Fax: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      County: ['']
    });
  }
  type:string="";
    public dataStateChange(state): void {
   console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.CareSendBO.orderColumn = state.sorted[0].name;
        this.CareSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.CareSendBO.field=state.action.currentFilterObject.field;
        this.CareSendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.CareSendBO.operator=state.action.currentFilterObject.operator;
        this.CareSendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.CareSendBO.field="CareCoordinatorName";
        this.CareSendBO.matchCase=false;
        this.CareSendBO.operator="startswith";
        this.CareSendBO.value="";
      }
    }
    this.CareSendBO.agencyId=parseInt(this.global.globalAgencyId);
    
     if (this.type == "paging" && state.action.name == "actionBegin") {
   
    if( this.arraycol.length!=0)
    {
      if(this.arraycol[0].Carecoordinator.Pagesize!=state.take)
      {
        this.arraycol[0].Carecoordinator.Pagesize = state.take
           console.log( "save page size")
        this.SaveColumnwidth();
       }

    }
  
  }
    // }
    this.getCare();
  }
 
  // //////////////////////////////////////////////
  ngOnInit():void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.SearchColumn.key = 'CareCoordinatorName';
    this.SearchColumn.value = 'Name';
    this.getCare(); 
   console.log(this.fromClient)

    if(this.fromClient=="edit")
    {
      this.clientEnable=true;
    }
    if(this.fromClient=="view"){
      this.clientedit=true;
    }
    // this.getTotalCount();
    this.fp = new functionpermission();
    this.filepermissionget();
    this.filterSettings = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
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

        this.arraycol[0].Carecoordinator.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Carecoordinator.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Carecoordinator.ShowColumns.length != count1 || this.arraycol[0].Carecoordinator.HideColumns.length != count) {
          this.arraycol[0].Carecoordinator.ShowColumns = showarr;
          this.arraycol[0].Carecoordinator.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }
    this.CareSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.CareSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
       //console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // ============================================
  actionHandler(args) {
    if (args.requestType == "sorting") {
     //console.log(args.direction + ' ' + args.columnName);
    }
    else if (args.requestType == "filtering") {
     //console.log(args.currentFilterObject.operator + ' ' + args.currentFilterObject.value + ' ' + args.currentFilteringColumn);
    }
  }
///=================Cose carecoordinator=================================////
closecare(){
  document.getElementById('modal').click();
}
// ===================================
  // changeColumns() {

  //   this.columnsList.forEach(element => {
  //     if (this.columnsSelected.includes(element)) {
  //       this.grid.showColumns(element);
  //     }
  //     else {
  //       this.grid.hideColumns(element);
  //     }
  //   });
  // }

  customiseCell(args: QueryCellInfoEventArgs) {

     //console.log(args);
      args.data['telephone'] == this.general.converPhoneGoogleLib(args.data['telephone']);
  }

  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
   }
// ===================================

  CareCreateupdate(type: string) {
    if (type == 'new') {
      this.ModelType = 'new';
      this.CareForm.reset();
      this.Care = new careCordinatorList();
      this.valueschanges();
    }
    else {
      this.ModelType = 'edit';
      this.valueschanges();
    }

  }
  ////////////////////////////////////////////////////
  selectCaredetails(careDetails: careCordinatorList) {
    // this.Care = new careCordinatorList();
   //console.log("careDetails",careDetails)
    this.Care = JSON.parse(JSON.stringify(careDetails));
  }
  ////////////////////////////////////////////////////////////
  DemographicPhoneFormat() {
    this.Care.telephone = this.general.converPhoneGoogleLib(this.Care.telephone);
  }
    // ////////////////////////////////////////////////////////////
  DemographicPhoneFormat1() {
    this.Care.fax = this.general.converPhoneGoogleLib(this.Care.fax);
  }
  // /////////////////////////////////////////////////////////////
  DemographicPhoneFormat2() {
    this.Care.alternate_Fax = this.general.converPhoneGoogleLib(this.Care.alternate_Fax);
  }
  // //////////////////////////////////////////////////////////
  Refresh() {
    this.SearchText = "";
    this.CareSendBO.field='CareCoordinatorName';
    this.CareSendBO.value = "";
    this.CareSendBO.pageitem=10;
    this.CareSendBO.currentpageno=1;
    // this.SearchColumn.key = 'CareCoordinatorName';
    // this.SearchColumn.value = 'Name';
    this.pagshort = new sortingObj();  
    this.getCare();
    // this.getTotalCount();
  }
  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getCare();

  }
  // /////////////////////////////////////////////////////////////
  pageItemsChage(pageitems) {
    this.pagshort.itemperpage = pageitems;
    this.getCare();
    // this.getTotalCount();

  }
  // // //////////////////////////////////////////////////////////////
  Search() {
    this.CareSendBO.field=this.SearchColumn.key;
    this.CareSendBO.value=this.SearchText;
    this.CareSendBO.pageitem=10;
    this.CareSendBO.currentpageno=1;
    this.pagshort.currentPgNo = 1;
    // this.getTotalCount();
    this.getCare();
  }
  // // ///////////////////////////////////////////////////////////
  onKeydown(event) {
    if (event.key === "Enter") {
      this.Search();
    }
  }
  //////////////////////////////Set default value for searchcolumn////////////////////
  setDefaultValue() {
   //console.log("this.SearchColumn", this.SearchColumn);
    this.SearchText = "";
    if(this.SearchColumn == undefined)
      this.SearchColumn = {
        'careCoordinatorName': 'Name'
      };
  }
  // //////////////////////////////////////////////////////////
  SaveOrUpdateCare() {
   //console.log("this.Care",this.Care);
    var saveList:careCordinatorList = JSON.parse(JSON.stringify(this.Care));
    saveList.telephone = this.general.reconverPhoneGoogleLib(saveList.telephone);
    saveList.fax = this.general.reconverPhoneGoogleLib(saveList.fax);
    saveList.alternate_Fax = this.general.reconverPhoneGoogleLib(saveList.alternate_Fax);
    saveList.agencyId = parseInt(this.global.globalAgencyId);
   //console.log("saveList",saveList);
    this.httpService.saveupdate(saveList).subscribe((data: number) => {
     //console.log("====save update=========", data);
      if (data) {
        this.valueschanges();
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          // saveList.id = data;
          // this.CareArray.push(saveList);
          document.getElementById('openModal1').click();
          this.toastrService.success('Care Coordinator Saved Successfully', 'Care Coordinator Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getCare();
          // this.getTotalCount();
        } else {
          document.getElementById('openModal1').click();
          this.toastrService.success('Care Coordinator Updated Successfully', 'Care Coordinator Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getCare();
          // this.getTotalCount();
        }
         
      }
    },(err: any) => {
      if(err){
       //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    })    
  }
  // /////////////////////////////////////////////////////////////////////
  CareId: any;
  getStatus() {
    let url = "api/CareCoordinator/GetCareCoordinatorList";
    this.http.get(url).subscribe((data: any) => {
      this.CareArray = data;
     //console.log(data);
      
    }, (err: HttpErrorResponse) => {      

    })
  }
  /////////////////////////////delete ICD10/////////////////////////////

  deleteCare() {
    this.httpService.deleteCareCoordinator(this.Care.id).subscribe((data: any) => {
      if (data) {

        // const index: number = this.CareArray.indexOf(this.Care);
        // if (index !== -1) {
        //   this.CareArray.splice(index,1);
        // }

       //console.log("=========== delete function =========", data);
        document.getElementById('openModal2').click();
        this.toastrService.success('Care Coordinator Deleted Successfully', 'Care Coordinator Deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.getCare();
        // this.getTotalCount();
      }

    },(err: any) => {
      if(err){
       //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    );
  }
  // ===========================================
  getCare() {
    this.ngxService.start()
    this.CareSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.CareSendBO);
    let count=0;
    this.data.subscribe((data) => {
      count = count+1;
     
      if(data!=null&&data!=undefined && count ==1)
      {
        this.getColumnwidth();
      }
    })
   //console.log(" this.gethttp.",this.data);
  }
  // getCare() {
  //   this.CareSendBO.SearchColumn=this.SearchColumn.key;
  //   this.CareSendBO.SearchText=this.SearchText;
  //   this.CareSendBO.pageitem=this.pagshort.itemperpage;
  //   this.CareSendBO.currentpageno=this.pagshort.currentPgNo;
  //   this.CareSendBO.orderColumn=this.pagshort.shortcolumn;
  //   this.CareSendBO.orderType=this.pagshort.shortType;
  //   this.CareSendBO.AgencyId=parseInt(this.global.globalAgencyId);
    
  //   console.log("this.conditionlist.length",this.conditionlist.length);
  //   if(this.conditionlist.length!=0){
  //     this.CareSendBO.conitionBO=this.conditionlist;
  //   }
  //   else{
  //     this.conditionlist.push(new WhereCondition());
  //     this.CareSendBO.conitionBO=this.conditionlist;
  //   }
  //   console.log("this.CareSendBO",this.CareSendBO);

  //   this.httpService.getCareCordinatorList(this.CareSendBO).subscribe((data: careCordinatorList[]) => {
  //     this.CareArray = data;
  //     console.log(data);
      
  //     this.CareArray.forEach(element => {
  //       if(element.telephone != null){
  //       element.telephone = this.general.reconverPhoneGoogleLibhttpsave(element.telephone);
  //       }
  //       if(element.fax != null){
  //       element.fax = this.general.reconverPhoneGoogleLibhttpsave(element.fax);
  //       }
  //       if(element.alternate_Fax != null){
  //       element.alternate_Fax = this.general.reconverPhoneGoogleLibhttpsave(element.alternate_Fax);
  //       }
  //       console.log("element.telephone",element.telephone);
  //       console.log("element.telephone",element.fax);
  //       console.log("element.telephone",element.alternate_Fax);
  //     });
  //   })
  // }

  closecarecoordinator()
  {
    document.getElementById('deletemodal').click();
  }
  getTotalCount() {
    let url = "api/CareCoordinator/GetCarcoordinator_Count?";
    let params = new URLSearchParams();

    params.append("SearchColumn", this.SearchColumn.key);
    params.append("SearchText", this.SearchText);
    params.append("AgencyId", this.global.globalAgencyId);

    this.httpService.gettotalCount(params).subscribe((data: number) => {
     //console.log("total count==", data);
      this.TotalCount = data;

    });
  }

  ////////////////////////////////////////////////////////////////////
  filepermissionget() {
    let params = new URLSearchParams();
    let url = "api/functionpermisssion/getfunctionpermission?";
    params.append("pagecode", "CareCoordinator");
    params.append("roleId", this.global.roleId);
    this.http.get(url + params).subscribe((data: any) => {
     //console.log("data len", data != null);

      if (data != null) {
        this.fp = data;
       //console.log("data", this.fp);
      }
      else {
        this.fp = new functionpermission();
      }
    },
      (err: HttpErrorResponse) => {
        this.fp = new functionpermission();
      })
  }


  // ================================================================

  valueschanges() {
    this.valuechange = {
      Name: 0,
      County: 0,
      Telephone: 0,
      Fax: 0,
      AlternateFax: 0,
      Email: 0,
    }
  }

  checkpopup(value) {
    if (value == "Name") {
      this.valuechange.Name++;
    }
    if (value == "County") {
      this.valuechange.County++;
    } if (value == "Telephone") {
      this.valuechange.Telephone++;
    } if (value == "Fax") {
      this.valuechange.Fax++;
    }
    if (value == "AlternateFax") {
      this.valuechange.AlternateFax++;
    }
    if (value == "Email") {
      this.valuechange.Email++;
    }
  }

  openDialog() {

    // this.closeRef = ref;

    if (this.valuechange.Email > 1 || this.valuechange.Name > 1 || this.valuechange.County > 1 ||
      this.valuechange.Telephone > 1 || this.valuechange.Fax > 1 || this.valuechange.AlternateFax > 1) {
      document.getElementById('cancelcarecomodal').click();
      console.log("opendialouge call")
    }
    else {
      document.getElementById('openModal1').click();
    }
  }

  closeAddUpdateModal() {
    // this.CareForm.reset();
    // this.Care = new careCordinatorList();
    document.getElementById('openModal1').click();
    document.getElementById('cancelcarecomodal').click();
  }

  //==============================Event emitter=============================================//
  carecodeemit(data)
  {
    this.emitcarecode.emit(data.id)
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
 if( args.data[args.column.field]!=null)
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
closealertmodal()
{
  document.getElementById("cancelcarecomodal").click();
}


onResize(args) {
  console.log("resize", args);
  const column = this.grid.getColumnByField(args.column.field)
  column.width = args.column.width;
  this.grid.refreshHeader();
  this.ColumnArray.forEach(element => {
    if (element.column == column.headerText) {
      element.width = parseInt(column.width.toString());
    }

  });
  console.log("hearder", column);
  console.log("hearder", this.ColumnArray);
  this.SaveColumnwidth();
}
  // ==============================================================================
 
  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      console.log("total count==", data);
      // data.forEach(element => {
      //   console.log(element.column.List, "column");
      //   console.log(element.column[0].List, "column");
      //   console.log(element.column[0], "column");
      //   console.log(JSON.parse(element.column), "column");
        this.arraycol = JSON.parse(data.column);
        this.ColumnArray = JSON.parse(data.column)[0].Carecoordinator.Columns;
      
        this.grid.columns.forEach(col => {
          this.arraycol[0].Carecoordinator.HideColumns.forEach(element => {
            if (col.headerText == element) {
              col.visible = false;
            }
  
          });
        });
        //  this.grid.refreshColumns();
  
     //   this.grid.showColumns(JSON.parse(data.column)[0].Carecoordinator.ShowColumns);
        this.grid.hideColumns(JSON.parse(data.column)[0].Carecoordinator.HideColumns);
        if (data.userid != null && data.agencyId != null) {
          this.id = data.id;
        }

        this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Carecoordinator.Pagesize
      // });
      console.log(this.ColumnArray, "this.ColumnArray");

      this.ColumnArray.forEach(element => {
        console.log(element.column, "column");

        console.log(this.grid, "column");


        if (element.column == 'Name') {

          const column = this.grid.getColumnByField('careCoordinatorName'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          console.log("hearder", column);

        }
        if (element.column == 'County') {

          const column1 = this.grid.getColumnByField('county'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Telephone') {

          const column1 = this.grid.getColumnByField('telephone'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'Fax') {

          const column1 = this.grid.getColumnByField('fax'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Alternative Fax') {

          const column1 = this.grid.getColumnByField('alternate_Fax'); // get the JSON object of the column corresponding to the field name
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
     
         if (element.column == 'Actions') {
          console.log(element.column, "column");

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });

      // this.ColumnArray = data;
      // this.initialPage.totalRecordsCount = data;
      // = data;
    });
  }
  SaveColumnwidth() {
    this.arraycol[0].Carecoordinator.Columns = this.ColumnArray;
    
    this.arraycol[0].Carecoordinator.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {
      console.log("total count==", data);
      this.getColumnwidth();
      // data.forEach(element => {
      //   console.log(element.column.List,"column");
      //   console.log(element.column[0].List,"column");
      //   console.log(element.column[0],"column");
      //   console.log(JSON.parse(element.column),"column");

      // });
      // this.ColumnArray = data;
      // this.initialPage.totalRecordsCount = data;
      // = data;
    });
  }

}
