import { Component, OnInit, ViewChild, Inject, Input,Output,EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from '../../global/global.component';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Sorts, DataResult } from '@syncfusion/ej2-angular-grids'
import { TemplateRef } from '@angular/core';
import { casemanagerHTTPService } from './case-manager.service';
import { caseManagerList, searchfilterDetails, sortingObj, functionpermission, GetCaseListBo, WhereCondition,columnWidth,ColumnChangeBO } from './case-manager.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './case-table.service';
import { Observable } from 'rxjs/Observable';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-case-manager',
  templateUrl: './case-manager.component.html',
  styleUrls: ['./case-manager.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseManagerComponent implements OnInit {

  //========================Main Functionality==========================//
@Input() fromClient:string;
@Output() emitcasemanger =new EventEmitter<number>()
  CaseArray: caseManagerList[];
  Case: caseManagerList = new caseManagerList();
  CaseSendBO:GetCaseListBo = new GetCaseListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  clientEnable:boolean=false;
  clientedit:boolean=false;
  
 ColumnArray: columnWidth[]
 columnchange: ColumnChangeBO = new ColumnChangeBO();
 id: number = 0;
 arraycol: any = [];
  // ========================Form Initialization========================//

  CaseForm: FormGroup;

  // ================================Filters===========================//
  filterItems: { [key: string]: string } = {
    'caseManagerName': 'Name',
    'County': 'County',
    'Telephone': 'Telephone',
    'Fax': 'Fax',
    'Alternate_Fax': 'Alternate_Fax',
    'Email': 'Email'
  };

  SearchText: string = '';
  SearchColumn: { [key: string]: string } = { 'caseManagerName': 'Name' };

  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  // grid: GridComponent
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
    ///////////////================Column chooser=================////////
  filter: IFilter;  
  Filter_drop: searchfilterDetails;
  public pageSizes: number[] = [10, 15, 20, 50, 100, 250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  // =============================other initialization======================= //
  TotalCount: number;  
  pagshort: sortingObj = new sortingObj();
  ModelType: string = 'edit';
  fp: functionpermission;
  valuechange :any= [];

 
  constructor( private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
    public global: GlobalComponent, public httpService: casemanagerHTTPService,private ngxService:NgxUiLoaderService,
    private ref: ChangeDetectorRef,  public toastrService: ToastrService, public general: generalservice) {
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.CaseForm = this.formBuilder.group({
        caseManagerName: [' ', Validators.required],
        Telephone: ['',[Validators.minLength(14),Validators.maxLength(14)]],
        Email: ['', [Validators.email]],
        Fax: ['',[Validators.minLength(14),Validators.maxLength(14)]],
        Alternate_Fax: ['',[Validators.minLength(14),Validators.maxLength(14)]],
        County: ['']
      });
  }
  type:string="";
    public dataStateChange(state): void {
   // console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.CaseSendBO.orderColumn = state.sorted[0].name;
        this.CaseSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.CaseSendBO.field=state.action.currentFilterObject.field;
        this.CaseSendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.CaseSendBO.operator=state.action.currentFilterObject.operator;
        this.CaseSendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.CaseSendBO.field="caseManagerName";
        this.CaseSendBO.matchCase=false;
        this.CaseSendBO.operator="startswith";
        this.CaseSendBO.value="";
      }
    }
    this.CaseSendBO.agencyId=this.global.globalAgencyId;
    this.getCase();
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Casemanager.Pagesize!=state.take)
        {
          this.arraycol[0].Casemanager.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }
    }
  }
 

  ngOnInit(): void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.SearchColumn.key = 'caseManagerName';
    this.SearchColumn.value = 'Name';
    this.getCase();
    this.getTotalCount();
    this.fp=new functionpermission();
    this.filepermissionget();
    this.filterOptions = { type: 'Menu' };
   //console.log(this.fromClient)
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes };
    if(this.fromClient=="edit")
    {
      this.clientEnable=true;
    }
    if(this.fromClient=="view"){
      this.clientedit=true;
    }
  }
  // =======================================================
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

        this.arraycol[0].Casemanager.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Casemanager.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Casemanager.ShowColumns.length != count1 || this.arraycol[0].Casemanager.HideColumns.length != count) {
          this.arraycol[0].Casemanager.ShowColumns = showarr;
          this.arraycol[0].Casemanager.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.CaseSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.CaseSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
       //console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 
/////////////////////////////////////////////////////////
  CaseCreateupdate(type: string) {
    if (type == 'new') {
      this.ModelType = 'new';
      this.CaseForm.reset();
      this.Case = new caseManagerList();
      this.valueschanges();
    }
    else {
      this.valueschanges();
      this.ModelType = 'edit';
    }

  }
/////////////////////////////////////////////////////////
selectCasedetails(caseDetails: caseManagerList) {
  this.Case = JSON.parse(JSON.stringify(caseDetails));
}
// =======================Grid Column selector ================ //
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
/////////////////////////////////////////////////////////
DemographicPhoneFormat(){
  this.Case.telephone=this.general.converPhoneGoogleLib(this.Case.telephone);
}
DemographicPhoneFormat1(){
  this.Case.fax=this.general.converPhoneGoogleLib(this.Case.fax);
}
DemographicPhoneFormat2(){
  this.Case.alternate_Fax=this.general.converPhoneGoogleLib(this.Case.alternate_Fax);
}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
/////////////////////////////////////////////////////////
  Refresh() {
    this.SearchText = "";
    this.CaseSendBO.field='caseManagerName';
    this.CaseSendBO.value = "";
    this.CaseSendBO.pageitem=10;
    this.CaseSendBO.currentpageno=1;
    this.pagshort = new sortingObj();
    this.getCase();
  }
/////////////////////////////////////////////////////////
  Search() {
    this.CaseSendBO.field=this.SearchColumn.key;
    this.CaseSendBO.value=this.SearchText;
    this.CaseSendBO.pageitem=10;
    this.CaseSendBO.currentpageno=1;
    this.pagshort.currentPgNo = 1;
    // this.pagshort.currentPgNo = 1;
    // this.getTotalCount();
    this.getCase();
  }
/////////////////////////////////////////////////////////
  SaveOrUpdateCase() {
    var saveList:caseManagerList = JSON.parse(JSON.stringify(this.Case));
    saveList.telephone = this.general.reconverPhoneGoogleLib(saveList.telephone);
    saveList.fax = this.general.reconverPhoneGoogleLib(saveList.fax);
    saveList.alternate_Fax = this.general.reconverPhoneGoogleLib(saveList.alternate_Fax);
    saveList.agencyId = parseInt(this.global.globalAgencyId);
    this.httpService.saveupdate(saveList).subscribe((data: number) => {
     //console.log("====save update=========", data);
      if (data) {
        this.valueschanges();
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.toastrService.success('Case Manager Saved Successfully', 'Case Manager Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getCase();
          this.getTotalCount();
          document.getElementById('opencasemanModal1').click();
        } else {
          this.getCase();
          this.getTotalCount();
          this.toastrService.success('Case Manager Updated Successfully', 'Case Manager Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          document.getElementById('opencasemanModal1').click();
        }
        
      }
    },(err: any) => {
      if(err){
       //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })    
  }
/////////////////////////////////////////////////////////
  deleteCase() {
    this.httpService.DeleteCaseManager(this.Case.id).subscribe((data: any) => {
      if (data) {

        // const index: number = this.CaseArray.indexOf(this.Case);
        // if (index !== -1) {
        //   this.CaseArray.splice(index,1);
        // }

        document.getElementById('deletemodal').click();
       //console.log("=========== delete function =========", data);
        this.getCase();
        this.getTotalCount();
        this.toastrService.success('Case Manager Deleted Successfully', 'Case Manager Deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
        this.getCase();
      }

    },(err: any) => {
      if(err){
       //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    );
  }


  ////////======================Close case manager================================///
  closecase(){
    document.getElementById('opencasemanModal1').click();
  }
/////////////////////////////////////////////////////////
getCase() {
  this.ngxService.start()
    this.CaseSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.CaseSendBO);
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
  // getCase() {
  //   this.CaseSendBO.SearchColumn=this.SearchColumn.key;
  //   this.CaseSendBO.SearchText=this.SearchText;
  //   this.CaseSendBO.pageitem=this.pagshort.itemperpage;
  //   this.CaseSendBO.currentpageno=this.pagshort.currentPgNo;
  //   this.CaseSendBO.orderColumn=this.pagshort.shortcolumn;
  //   this.CaseSendBO.orderType=this.pagshort.shortType;
  //   this.CaseSendBO.AgencyId=parseInt(this.global.globalAgencyId);
    
  //   console.log("this.conditionlist.length",this.conditionlist.length);
  //   if(this.conditionlist.length!=0){
  //     this.CaseSendBO.conitionBO=this.conditionlist;
  //   }
  //   else{
  //     this.conditionlist.push(new WhereCondition());
  //     this.CaseSendBO.conitionBO=this.conditionlist;
  //   }
  //   console.log("this.CaseSendBO",this.CaseSendBO);

  //   this.httpService.getCaseManagerList(this.CaseSendBO).subscribe((data: caseManagerList[]) => {
  //     this.CaseArray = data;
  //     this.CaseArray.forEach(element => {
  //       if(element.telephone != null){
  //         element.telephone = this.general.reconverPhoneGoogleLibhttpsave(element.telephone);
  //       }
  //       if(element.fax != null){
  //         element.fax = this.general.reconverPhoneGoogleLibhttpsave(element.fax);
  //       }
  //       if(element.alternate_Fax != null){
  //         element.alternate_Fax = this.general.reconverPhoneGoogleLibhttpsave(element.alternate_Fax);
  //       }
  //     });
  //   })
  // }
/////////////////////////////////////////////////////////
  getTotalCount() {
    let params = new URLSearchParams();

    params.append("SearchColumn", this.SearchColumn.key);
    params.append("SearchText", this.SearchText);
    params.append("AgencyId", this.global.globalAgencyId);

    this.httpService.gettotalCount(params).subscribe((data: number) => {
    // //console.log("total count==", data);
      this.TotalCount = data;

    });
  }
/////////////////////////////////////////////////////////
  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "CaseManager");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;

    });
  }
/////////////////////////////////////////////////////////
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
    if (this.valuechange.Email > 1 || this.valuechange.Name > 1 || this.valuechange.County > 1 ||
      this.valuechange.Telephone > 1 || this.valuechange.Fax > 1 || this.valuechange.AlternateFax > 1) {
        document.getElementById('cancelcasemanmodal').click();
    }
    else {
      document.getElementById('opencasemanModal1').click();
    }
    
  }

  closeAddUpdateModal() {
    document.getElementById('opencasemanModal1').click();
    document.getElementById('cancelcasemanmodal').click();
  }
  onKeydown(event) {
    if (event.key === "Enter") {
      this.Search();
    }
  }
  setDefaultValue() {
   //console.log("this.SearchColumn", this.SearchColumn);
    this.SearchText = "";
    if (this.SearchColumn == undefined)
      this.SearchColumn = {


      };
  }
  //==============================Event emitter=============================================//
  caseemit(data)
  {
   //console.log(data)
    this.emitcasemanger.emit(data.id)
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
canceldelete()
{
  document.getElementById('openModal2').click();
}


  // ==============================================================================

  getColumnwidth() {
    this.httpService.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Casemanager.Columns;


    

     // this.grid.showColumns(JSON.parse(data.column)[0].Casemanager.ShowColumns);
      this.grid.hideColumns(JSON.parse(data.column)[0].Casemanager.HideColumns);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Casemanager.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Name') {

          const column = this.grid.getColumnByField('caseManagerName'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          console.log("hearder", column);

        }
        if (element.column == 'County') {

          const column1 = this.grid.getColumnByField('county'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Telephone') {

          const column1 = this.grid.getColumnByField('telephone'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }

        if (element.column == 'Fax') {

          const column1 = this.grid.getColumnByField('fax'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Alternative Fax') {

          const column1 = this.grid.getColumnByField('alternate_Fax'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Email') {

          const column1 = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
          // column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
     
         if (element.column == 'Actions') {
          console.log(element.column, "column");

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });

  }
  SaveColumnwidth() {
    this.arraycol[0].Casemanager.Columns = this.ColumnArray;
    this.arraycol[0].Casemanager.Pagesize = this.grid.pageSettings.pageSize;
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

