import { Component, OnInit,TemplateRef, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';

import { FilterSettingsModel, IFilter, GridComponent, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DataStateChangeEventArgs, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Sorts, DataResult } from '@syncfusion/ej2-angular-grids';
import { GlobalComponent } from "../../global/global.component";
import {zipcodeService} from "./zip-code.service"
import {zipcodeDetailList, searchfilterDetails, sortingObj, functionpermission, GetCareListBo, WhereCondition, columnWidth, ColumnChangeBO } from './zip-code.model'
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './zip-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
@Component({
  selector: 'app-zip-code',
  templateUrl: './zip-code.component.html',
  styleUrls: ['./zip-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZipCodeComponent implements OnInit {
  /////===============Main functionality initialisation=====================///
  ZipcodeDetailArray: zipcodeDetailList[];
  zipcode: zipcodeDetailList = new zipcodeDetailList();
  CareSendBO:GetCareListBo = new GetCareListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
 
  ///////////////=============Form initialization==========//
  ZipcodeForm: FormGroup;

  /////////////===================Filters ==========//
  filterItems: { [key: string]: string } = {
    'zipcode': 'ZipCode',
    'state': 'State',
    'city': 'City'
  }
  SearchText: string = ''; 
  SearchColumn: { [key: string]: string } = { 'zipcode': 'ZipCode' };

  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  // grid: GridComponent;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;  
  Filter_drop: searchfilterDetails;
  TotalCount: number;  
  pagshort: sortingObj = new sortingObj(); 
  public pageSizes: number[] = [10,15,20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  
   ////////////////========Functionlity initializations==========//    
   ModelType: string = 'edit';
   fp: functionpermission;
   pageitems: number = 20;
   valuechange:any = [];
  
 
  constructor(private formBuilder: FormBuilder,public http: HttpClient,@Inject(GetHTTPService) public gethttp:GetHTTPService,private ref: ChangeDetectorRef,
    public route: ActivatedRoute, public router: Router, public httpService: zipcodeService,public toastrService: ToastrService, public global: GlobalComponent, public general: generalservice) { 
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
    
      this.data=gethttp;
      this.ZipcodeForm = this.formBuilder.group({
        City: [' ', Validators.required],
        State: ['', Validators.required],
        Zipcode: ['', Validators.required],
        County: ['', Validators.required]
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
        this.CareSendBO.field="ZipCode";
        this.CareSendBO.matchCase=false;
        this.CareSendBO.operator="startswith";
        this.CareSendBO.value="";
      }
    }
    this.CareSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.getZip();
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Zipcode.Pagesize!=state.take)
        {
          this.arraycol[0].Zipcode.Pagesize = state.take
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
    this.SearchColumn.key = 'zipcode';
    this.SearchColumn.value = 'ZipCode';
    this.filterOptions =  { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 

    this.getZip();
    this.getTotalCount();
    this.filepermissionget();
    this.fp = new functionpermission();
    // this.getColumnwidth();

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
if(this.arraycol.length > 0)
{
  this.arraycol[0].Zipcode.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Zipcode.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });
  console.log(count, count1, "count");


  if (this.arraycol[0].Zipcode.ShowColumns.length != count1 || this.arraycol[0].Zipcode.HideColumns.length != count) {
    this.arraycol[0].Zipcode.ShowColumns = showarr;
    this.arraycol[0].Zipcode.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
  
  }
}
  
    this.CareSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.CareSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 


  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser();
   }
  //  ///////////////////////////////////////////////////////////////////////////

 
  paginationChange(event) {
    this.pagshort.currentPgNo = event;
    this.getZip();
  }
  pageItemsChage(pageitems) {
    this.pageitems = pageitems;
    this.getZip();
    this.getTotalCount();

  } 
  
  Search() {
    this.CareSendBO.field=this.SearchColumn.key;
    this.CareSendBO.value=this.SearchText;
    this.CareSendBO.pageitem=10;
    this.CareSendBO.currentpageno=1;
    this.pagshort.currentPgNo = 1;
    this.getZip();
    // this.getTotalCount();

  }

  setDefaultValue() {
    console.log("this.SearchColumn", this.SearchColumn);
    this.SearchText = "";
    if (this.SearchColumn == undefined)
      this.SearchColumn = {
        'zipcode': 'Zipcode'
      };
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Zip: any = {};
  
  ZipCreate(type: string) {
    if (type == 'new') {
      this.ModelType = 'new';
      this.ZipcodeForm.reset();
      this.zipcode = new zipcodeDetailList();
      this.valueschanges();
    }
    else {
      this.valueschanges();
      this.ModelType = 'edit';
    }

  }

  selectZipdetails(zipDetails: zipcodeDetailList) {
    this.zipcode = JSON.parse(JSON.stringify(zipDetails));
  }


  Refresh() {
    this.SearchText = "";
    this.CareSendBO.field='ZipCode';
    this.CareSendBO.value = "";
    this.CareSendBO.pageitem=10;
    this.CareSendBO.currentpageno=1;
    this.getZip();
    // this.getTotalCount();

  }


  onKeydown(event) {  
    if (event.key === "Enter") {
      this.pagshort.currentPgNo = 1;
      this.Search();
      this.getZip();
     this.getTotalCount();   
    }
  }

  getZip() {
    this.CareSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.CareSendBO);
    console.log(" this.gethttp.",this.data);
    let count=0
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
    })
    // let params = new URLSearchParams();
    // params.append("SearchColumn", this.SearchColumn.key);
    // params.append("SearchText", this.SearchText);
    // params.append("OrderColumn", this.pagshort.shortcolumn);
    // params.append("OrderType", this.pagshort.shortType);
    // params.append("Pageitem", this.pagshort.itemperpage.toString());
    // params.append("Currentpageno", this.pagshort.currentPgNo.toString());
    // this.httpService.getZipcodeList(params).subscribe((data: zipcodeDetailList[]) => {
    //   this.ZipcodeDetailArray = data;
    // })
  }

  getTotalCount() {
    let params = new URLSearchParams();
    params.append("SearchColumn", this.SearchColumn.key);
    params.append("SearchText", this.SearchText);
    this.httpService.gettotalCount(params).subscribe((data: number) => {
      console.log("total count==", data);
      this.TotalCount = data;
    })
  }

 
  SaveOrUpdateZip() {
    let saveList:zipcodeDetailList = JSON.parse(JSON.stringify(this.zipcode));
    this.httpService.saveupdate(saveList).subscribe((data: number) => {
      if (data) { 
        this.valueschanges();
        if (this.ModelType == 'new') {
          // saveList.id = data;
          // this.ZipcodeDetailArray.push(saveList);
          document.getElementById('OpenModal1').click();
          this.toastrService.success('Zipcode Saved successfully', 'Zipcode Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
        }else {
          document.getElementById('OpenModal1').click();
          this.toastrService.success('Zipcode Saved successfully', 'Zipcode Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
       }
       this.getZip();
       this.getTotalCount();
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })

  }

  deleteZip() {
    this.httpService.deleteZipCode(this.zipcode.id).subscribe((data: any) => {
      if (data) {
        // const index: number = this.ZipcodeDetailArray.indexOf(this.zipcode);
        // if (index !== -1) {
        //   this.ZipcodeDetailArray.splice(index,1);
        // }
        console.log("=========== delete function =========", data);
        document.getElementById('OpenModal2').click();
        this.toastrService.success('Zipcode deleted successfully', 'Zipcode deleted');
        setTimeout(() => {
          this.toastrService.clear();
        }, 8000);
      }
      this.getZip();
      this.getTotalCount();
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    );
  }

  filepermissionget(){
    let params = new URLSearchParams();
    params.append("pagecode","ZipCode" );
    params.append("roleId",this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
  }

  // ================================================
  valueschanges() {
    this.valuechange = {
      Zipcode: 0,
      City: 0,
      State: 0,
      County: 0,
    }
  }

  checkpopup(value) {
    console.log("value==",value);
    
    if (value == "Zipcode") {
      this.valuechange.Zipcode++;
    }
    if (value == "City") {
      this.valuechange.City++;
    }
    if (value == "State") {
      this.valuechange.State++;
    }
    if (value == "County") {
      this.valuechange.County++;
    }
  }

  openDialog() {
    console.log("this.valuechange",this.valuechange);
    if (this.valuechange.Zipcode > 1 || this.valuechange.City > 1  || this.valuechange.State > 1
      || this.valuechange.County > 1 ) {
      document.getElementById('cancelmodal').click();
    }
    else {
      document.getElementById('OpenModal1').click();
    }
  }

  closeAddUpdateModal() {
    document.getElementById('cancelmodal').click();
    document.getElementById('OpenModal1').click();
  }
//=================================== Tooltip ====================================//
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
getColumnwidth() {
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Zipcode.Columns;

   
    this.grid.columns.forEach(col => {
      this.arraycol[0].Zipcode.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
  //  this.grid.refreshColumns();
  let showcol = JSON.parse(data.column)[0].Zipcode.ShowColumns;
  let hidecol = JSON.parse(data.column)[0].Zipcode.HideColumns


//   this.grid.showColumns(showcol);
  this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Zipcode.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Zipcode') {

        const column = this.grid.getColumnByField('zipcode'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'City') {

        const column1 = this.grid.getColumnByField('city'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'State') {

        const column2 = this.grid.getColumnByField('state'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'County') {

        const column3 = this.grid.getColumnByField('county'); // get the JSON object of the column corresponding to the field name
        column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column4 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        //column4.headerText = element.column;
        //column4.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });
   
}
SaveColumnwidth() {
  this.arraycol[0].Zipcode.Columns = this.ColumnArray;
  this.arraycol[0].Zipcode.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {

    this.getColumnwidth();

  });
}
}
