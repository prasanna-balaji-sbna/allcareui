
// import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import { Component, OnInit, ViewChild,Input,EventEmitter, Output, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { DischargeCodeDetailBO ,functionpermission,sortingObj,searchfilterDetails,  WhereCondition, GetListBO,columnWidth,ColumnChangeBO} from './dccodes.model';
import { GlobalComponent } from "../../global/global.component";
import { dccodesService } from './dccodes.service';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { FilterSettingsModel, IFilter, GridComponent, PageSettingsModel, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { Observable } from 'rxjs/Observable';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPService } from './dischargetable.service';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
declare var $:any;


@Component({
  selector: 'app-dccodes',
  templateUrl: './dccodes.component.html',
  styleUrls: ['./dccodes.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})


export class DccodesComponent implements OnInit {
@ViewChild('grid') public grid: GridComponent;
@Input() changevalue:string;
viewClient:boolean=false;
@Output() dataFromDC=new EventEmitter<{code:number,description:string}>();

 /////===============Main functionality initialisation=====================///
 DischargeArray: DischargeCodeDetailBO[];
 dccodes: DischargeCodeDetailBO = new DischargeCodeDetailBO();

 ColumnArray: columnWidth[]
 columnchange: ColumnChangeBO = new ColumnChangeBO();
 id: number = 0;
 arraycol: any = [];
 ///////////////=============Form initialization==========//
 DischargeForm: FormGroup;
 /////////////===================Filters ==========//
 filterItems: { [key: string]: string } = {
  'DischargeCode': 'DischargeCode',
};

SearchText:string ='';
SearchColumn: { [key: string]: string } = { 'DischargeCode': 'DischargeCode' };
// SearchColumn:string="DischargeCode"

  updateCLi:boolean;
  isCreate:boolean=false;
  pagshort: sortingObj = new sortingObj(); 
  isUpdate:boolean=false;
  DCForm: FormGroup;
  close: boolean;
  filterOptions: FilterSettingsModel;

  // Filter_drop: searchfilterDetails;

  // columnsSettings: IMultiSelectSettings = {
  //   enableSearch: true,
  //   checkedStyle: 'checkboxes',
  //   buttonClasses: 'btn btn-primary float-right mr-0',
  //   dynamicTitleMaxItems: 0,
  //   displayAllSelectedText: false
  // };
  // columns: IMultiSelectOption[] = [
  //   { id: 'DisChargeCode', name: 'DisChargeCode' },
  //   { id: 'CodeDiscription', name: 'CodeDiscription' },
  // ]

  columnsSelected: string[] = ['DischargeCode'];
  columnsList: string[] = ['DischargeCode'];
  ////////////////========Functionlity initializations==========//    
  ModelType: string = 'edit';
  fp: functionpermission;
  // ========================Table Initialization============================//

  // @ViewChild('grid') public grid: GridComponent;
  initialPage: PageSettingsModel; 
  public filterSettings: object;
  filter: IFilter;
  dropInstance: DropDownList;
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[];
  TotalCount: number;  
 
  // SearchColumn:string ='ListCode';
    // SearchText:string ='';
    public pageSizes: number[] = [10,15,20,50,100,250]; 
    //============================Data manager===============================//
    public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  valuechange:any=[]
  ListSendBO:GetListBO = new GetListBO();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  error: any="";
  showErrorAlert: boolean=false;

  // valuechange:any = [];

  ////////////////========Constructor==========//    


  constructor(public http: HttpClient, private formBuilder: FormBuilder,
    public global: GlobalComponent, public httpService: dccodesService,public toastrService: ToastrService
    , public general: generalservice,@Inject(GetHTTPService) public gethttp:GetHTTPService,private ref: ChangeDetectorRef) {

      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);

      this.data=gethttp;

    this.DischargeForm = this.formBuilder.group({
      DischargeCode: ['',Validators.required],
      Codedescription:['',Validators.required]
  
    });
  }
  type:string="";
    public dataStateChange(state): void {
    ////console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.ListSendBO.orderColumn = state.sorted[0].name;
        this.ListSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.ListSendBO.field=state.action.currentFilterObject.field;
        this.ListSendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.ListSendBO.operator=state.action.currentFilterObject.operator;
        this.ListSendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.ListSendBO.field="DischargeCode";
        this.ListSendBO.matchCase=false;
        this.ListSendBO.operator="startswith";
        this.ListSendBO.value="";
      }
    }
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Dccodes.Pagesize!=state.take)
        {
          this.arraycol[0].Dccodes.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        

      }
    
    }
    }
    this.ListSendBO.agencyID=this.global.globalAgencyId;
    this.getDischarge();
  }

   ////////////////========ngonint==========//    



  ngOnInit() {
    ////console.log(this.changevalue)
    if(this.changevalue=='client')
    {
      this.viewClient=true;
      this.getColumnwidth();
    }

    this.conditionlist.push(new WhereCondition());
    this.SearchColumn.key = 'DisChargeCode';
    this.SearchColumn.value = 'DisChargeCode';
    this.toolbar = ['ColumnChooser'];
    this.fp=new functionpermission();
    this.filepermissionget();
    this.filterSettings = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    this.getDischarge();
    this.getTotalCount()
    // this.getColumnwidth();
  } 

  public onActionComplete(args) { 
    this.ListSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.ListSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        //console.log("args type",this.conditionlist);
      }); 
    } 
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

        this.arraycol[0].Dccodes.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Dccodes.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Dccodes.ShowColumns.length != count1 || this.arraycol[0].Dccodes.HideColumns.length != count) {
          this.arraycol[0].Dccodes.ShowColumns = showarr;
          this.arraycol[0].Dccodes.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }
  } 
  
  change(args: ChangeEventArgs) {
    //console.log("ChangeEventArgs",args);    
    this.initialPage = { currentPage: args.value};
}
  actionHandler(args) {
    if (args.requestType == "sorting") {
      //console.log(args.direction + ' ' + args.columnName);
    }
    else if (args.requestType == "filtering") {
      //console.log(args.currentFilterObject.operator + ' ' + args.currentFilterObject.value + ' ' + args.currentFilteringColumn);
    }
  }

//   ///////////////////////delete ICD10////////////////

deleteDischarge() {
  let url = "api/DischargeCodeDetail/DeleteDischargeCodeDetail?";
  let params = new URLSearchParams();
  params.append("DischargeId",this.dccodes.id.toString());
  this.http.delete(url + params).subscribe((data: any) => {
  
  this.toastrService.success(
    "Discharge code deleted successfully",
    "Discharge Code Deleted "), 8000
   document.getElementById('openModal2').click()
    this.getDischarge();
      this.getTotalCount();
  },
  ) 
  }
    
 ////////////////////////////////////////////////////
 selectDischargedetails(ddetails: DischargeCodeDetailBO) {
  this.dccodes = ddetails;
  //console.log(ddetails);
  this.valueschanges()
  this.dccodes = JSON.parse(JSON.stringify(ddetails));

  
}


////////////////////////////////////////
paginationChange(event) {
  this.pagshort.currentPgNo = event;
  this.getDischarge();

}
valueschanges() {
  this.valuechange = {
 DischargeCode:0,
  CodeDescription:0
  }
  //console.log(this.valuechange);
  
}
checkpopup(value) {
  if (value == "DischargeCode") {
    this.valuechange.DischargeCode++;
  }
  if (value == "CodeDiscrption") {
    this.valuechange.CodeDescription++;
  } 
}
// ===================================
changeColumns() {

  this.columnsList.forEach(element => {
    if (this.columnsSelected.includes(element)) {
      this.grid.showColumns(element);
    }
    else {
      this.grid.hideColumns(element);
    }
  });
}


openDialog() {

  // this.closeRef = ref;

  if (this.valuechange.DischargeCode > 1 || this.valuechange.CodeDescription > 1 ) {
    document.getElementById('cancelmodal').click();
  }
  else {
    document.getElementById('openModal1').click();
  }
}

closeAddUpdateModal() {
  document.getElementById('openModal1').click();
  document.getElementById('cancelmodal').click();
}
 //===================================Show column settings===================//
 show() {
  this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
 }
// ////////////////Refresh//////////////////////////////////////////
Refresh() {   
  this.SearchText = "";
  this.ListSendBO.field="DischargeCode"
  this.ListSendBO.value=''

  // this.SearchColumn.key = 'DischargeCode';
  // this.SearchColumn.value = 'DischargeCode';
  this.pagshort = new sortingObj();  
  this.getDischarge();
  this.getTotalCount();
}

 // //////////////////////////Filter///////////////////////////////////////////

 getStatus() {
   let url = "api/DischargeCodeDetail/GetDischargeCodeListFilter";
   this.http.get(url).subscribe((data: any) => {
     this.DischargeArray = data;
   }, (err: HttpErrorResponse) => {      

   })
 }

//////////////////////////pagination and search function ////////////

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
  if (this.SearchColumn == undefined)
    this.SearchColumn = {
      'DischargeCode': 'Code'
    };
}

filteselect(value) {
  this.SearchColumn = value;
  this.getDischarge();
}


// /////////////////////////////////////////////////////////////
pageItemsChage(pageitems) {
  this.pagshort.itemperpage = pageitems;
  this.getDischarge();
  this.getTotalCount();

}

// ===================================

DischargeCreateUpdate(type: string) {
  if (type == 'new') {
    this.ModelType = 'new';
    this.DischargeForm.reset();
    this.dccodes = new DischargeCodeDetailBO();
  }
  else {
    this.ModelType = 'edit';
  
  }
this.valueschanges()
}


// //////////////////////////////////////////////////////////
SaveOrUpdateDischarge() {
  let url = "api/DischargeCodeDetail/SaveDischargeCodeDetail";

  var saveList:DischargeCodeDetailBO = JSON.parse(JSON.stringify(this.dccodes));
  saveList.dischargeCode = this.general.reconverPhoneGoogleLib(saveList.dischargeCode);
  saveList.codeDescription = this.general.reconverPhoneGoogleLib(saveList.codeDescription);
  saveList.agencyId = parseInt(this.global.globalAgencyId);
  
console.log(saveList,"savelist======");
  this.http.post(url,saveList).subscribe((data: number) => {
    //console.log("====save update=========", data);
    // this.toastrService.success('saved successfully')
  
    document.getElementById('openModal1').click();


    if (data) {
      
console.log(saveList,"savelist======");
      //====================== sucess message =============
      if (this.ModelType =='new') {

        this.toastrService.success(
          "Discharge code saved successfully",
          "Discharge Code Saved "), 8000
        saveList.id = data;
        // this.DischargeArray.push(saveList);
        document.getElementById('openModal1').click();
        // this.toastrService.success('saved successfully')
        this.getDischarge()

      }
      else if (this.ModelType =='edit') {
        this.toastrService.success(
          "Discharge code updated successfully",
          "Discharge Code Updated "), 8000
        saveList.id = data;
        // this.DischargeArray.push(saveList);
        document.getElementById('openModal1').click();
        // this.toastrService.success('saved successfully')
        this.getDischarge()


      }
       
    }
  },(err:HttpErrorResponse) => {
    
 

    if(err)
    {
  
      this.error=err.error;
      //console.log("err.error",this.error);
      this.showErrorAlert=true
    }
    else{
      this.error= JSON.stringify(err.error);
     //console.log("err.error",err.error);
     
    }
  
    if (this.error != "") {
      //console.log("this.error",this.error);
      
      setTimeout(() => {
        this.error = "";
        this.showErrorAlert=false
      }, 5000)
    }
  })    
}
onActionBegin(args) { 
    
}



getDischarge()
{
//  var agencyId=parseInt(this.global.globalAgencyId)

  //console.log(this.ListSendBO.agencyID);
  
  this.ListSendBO.agencyID=parseInt(this.global.globalAgencyId);
  this.gethttp.execute(this.ListSendBO);   
  let count=0;
  this.data.subscribe((data:any)=>{
    count=count+1;
    if( data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
  }) 
  //console.log(" this.gethttp.",this.data);
}


  // // //////////////////////////////////////////////////////////////
  Search() {
    this.ListSendBO.field=this.SearchColumn.key
    this.ListSendBO.value=this.SearchText;
    this.pagshort.currentPgNo = 1;
    this.getTotalCount();
    this.getDischarge();
  }





  ////////////////////////////getTotalCount()//////////////////////////

getTotalCount() {
  let url = "api/DischargeCodeDetail/GetDischargeCodeList_Count?";
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
  params.append("pagecode", "DischargeCode");
  params.append("roleId", this.global.roleId);
  this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
    this.fp = data;
    //console.log('this.fp',data);
    

  });
}
  ////////////////////////////////////select Discharge code Event EMitter///////////////////////////////////
  selectDC(data)
  {
    this.dataFromDC.emit({code:data.id,description:data.codeDescription})
  }
  //=================================== Tooltip ====================================//
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
     content: args.data[args.column.field].toString()
 }, args.cell as HTMLTableCellElement);
 }
}
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
getColumnwidth() {
  
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);
    
    this.ColumnArray = JSON.parse(data.column)[0].Dccodes.Columns;

    this.grid.columns.forEach(col => {
      this.arraycol[0].Dccodes.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
  //  this.grid.refreshColumns();

  //this.grid.showColumns(JSON.parse(data.column)[0].Dccodes.ShowColumns);
  this.grid.hideColumns(JSON.parse(data.column)[0].Dccodes.HideColumns);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }
    
      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Dccodes.Pagesize

      this.ColumnArray.forEach(element => {

        if (element.column == 'Discharge Code') {

          const column = this.grid.getColumnByField('dischargeCode'); // get the JSON object of the column corresponding to the field name
          column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Code Description') {

          const column1 = this.grid.getColumnByField('codeDescription'); // get the JSON object of the column corresponding to the field name
          column1.headerText = element.column;
          column1.width = element.width;

          this.grid.refreshHeader();
        }
      
        else if (element.column == 'Actions') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          column2.headerText = element.column;
         // column2.width = element.width;
          this.grid.refreshHeader();

        }

      });


  });
}

SaveColumnwidth() {
  
  this.arraycol[0].Dccodes.Columns = this.ColumnArray;
  this.arraycol[0].Dccodes.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}
