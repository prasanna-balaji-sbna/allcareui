import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { GlobalComponent } from '../../global/global.component';
import { FilterSettingsModel, IFilter, GridComponent,QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { DataStateChangeEventArgs, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { Sorts, DataResult } from '@syncfusion/ej2-angular-grids'
import { TemplateRef } from '@angular/core';
import { ClearingHouseHTTPService } from './clearing-house.service';
import { ClearingHouseList, functionpermission, searchfilterDetails, sortingObj, GroupPayorList, DropList, ClearingHousePayorMapping, GetCHListBo, WhereCondition, columnWidth, ColumnChangeBO} from './clearing-house.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { GetHTTPService } from './clearh-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-clearing-house',
  templateUrl: './clearing-house.component.html',
  styleUrls: ['./clearing-house.component.scss'],
//  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClearingHouseComponent implements OnInit {

  // ====================Main Initialization========================//
  Clearing_House_Array: ClearingHouseList[];
  ClearH: ClearingHouseList = new ClearingHouseList();
  GroupPayorArray: GroupPayorList[];
  GroupPayer = [];
  senderidQualifier = [];
  RecieveridQualifier = [];
  format_type = [];
  clearing_form = {};
  ClearingHousePayorMapping_Array: ClearingHousePayorMapping[];
  ClearHMap_Array: ClearingHousePayorMapping = new ClearingHousePayorMapping();
  payordetail = [];
  CHSendBO:GetCHListBo = new GetCHListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
 
  ColumnArray: columnWidth[]
 columnchange: ColumnChangeBO = new ColumnChangeBO();
 id: number = 0;
 arraycol: any = [];

  // ============================Form Initialization===========================//
  // clearHouseForm: FormGroup;
  clearHouseForm = new FormGroup({
    ClearingHouseId: new FormControl('', Validators.required),
    Name: new FormControl('', Validators.required),
    Modifier: new FormControl(''),
    FormatTypeLid: new FormControl(''),
    TradingPartnerID2: new FormControl(''),
    ReceiverIDQualifierLid: new FormControl('', Validators.required),
    ReceiverID: new FormControl('', Validators.required),
    SenderID: new FormControl('', Validators.required),
    SenderIDQualifier: new FormControl('', Validators.required),
    FileNameFormatType: new FormControl(''),
    ClearingHousePayorMapping: new FormArray([
    ]),
  });

  /////////////===================Filters ==========//
  filterItems: { [key: string]: string } = {
    'clearingHouseId': 'ID',
    'name': 'Name',
    'modifier': 'Modifier',
    'senderId': 'Sender_Id',
    'senderIdQualifier_Name': 'SenderIdQualifier_Name',
    'receiverId': 'ReceiverId',
    'receiverIDQualifier_Name': 'ReceiverIDQualifier_Name',
  };
  SearchText: string = ''; 
  SearchColumn: { [key: string]: string } = { 'name': 'Name' };

  // ========================Table Initialization======================//
  @ViewChild('grid') public grid: GridComponent;
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  // grid: GridComponent;
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

  // ==================Functionality Initiliazation==============================//

  valuechange :any= [];
  deleteId: string = '';
  index: number;
  ModelType: string = 'edit';
  fp: functionpermission;
  isShowDivIf: boolean = false;

  constructor(
    private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
    public global: GlobalComponent, public httpService: ClearingHouseHTTPService,
    private ref: ChangeDetectorRef,   public toastrService: ToastrService, public general: generalservice,private modalService: NgbModal,private ngxService:NgxUiLoaderService,
    ){ 

      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
    }
    type:string="";
    public dataStateChange(state): void {
   
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.CHSendBO.orderColumn = state.sorted[0].name;
        this.CHSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.CHSendBO.field=state.action.currentFilterObject.field;
        this.CHSendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.CHSendBO.operator=state.action.currentFilterObject.operator;
        this.CHSendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.CHSendBO.field="name";
        this.CHSendBO.matchCase=false;
        this.CHSendBO.operator="startswith";
        this.CHSendBO.value="";
      }
    }
    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Clearinghouse.Pagesize!=state.take)
        {
          this.arraycol[0].Clearinghouse.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        

      }
    
    }
    }
    this.CHSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.getClearingHouse();
    if (this.type == "paging" && state.action.name == "actionBegin") {
      this.SaveColumnwidth();
    }

  }
// Initialization //
  ngOnInit(): void 
  {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.SearchColumn.key = 'name';
    this.SearchColumn.value = 'Name';
    this.getClearingHouse();
    this.getTotalCount();
    this.getFormat_type();
    this.getGroupPayor();
    this.getReceiver_id_qualifier();
    this.getSenderIdQualifier();
    this.fp = new functionpermission();
    this.filepermissionget();
    // Grid View Initialization //
    this.filterOptions = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
    // this.getColumnwidth();

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

        this.arraycol[0].Clearinghouse.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Clearinghouse.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Clearinghouse.ShowColumns.length != count1 || this.arraycol[0].Clearinghouse.HideColumns.length != count) {
          this.arraycol[0].Clearinghouse.ShowColumns = showarr;
          this.arraycol[0].Clearinghouse.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }
    this.CHSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.CHSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
       //console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 

  // =======================Grid Column selector ================ //
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
    // ===========================================Getting all data from DB=======================//
    getClearingHouse() {
      this.ngxService.start()
    this.CHSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.CHSendBO);
    let count=0;
    this.data.subscribe((data) => {
      count = count+1;
     
      if(data!=null&&data!=undefined && count ==1)
      {
        this.getColumnwidth();
      }
    })
   //console.log(" this.gethttp.",this.data);
    //   this.CHSendBO.SearchColumn=this.SearchColumn.key;
    // this.CHSendBO.SearchText=this.SearchText;
    //   this.CHSendBO.pageitem=this.pagshort.itemperpage;
    // this.CHSendBO.currentpageno=this.pagshort.currentPgNo;
    // this.CHSendBO.orderColumn=this.pagshort.shortcolumn;
    // this.CHSendBO.orderType=this.pagshort.shortType;
    // this.CHSendBO.AgencyId=parseInt(this.global.globalAgencyId);
    
    // console.log("this.conditionlist.length",this.conditionlist.length);
    // if(this.conditionlist.length!=0){
    //   this.CHSendBO.conitionBO=this.conditionlist;
    // }
    // else{
    //   this.conditionlist.push(new WhereCondition());
    //   this.CHSendBO.conitionBO=this.conditionlist;
    // }
    // console.log("this.CHSendBO",this.CHSendBO);
  
    //   this.httpService.ClearingHouseList(this.CHSendBO).subscribe((data: ClearingHouseList[]) => {
    //     this.Clearing_House_Array = data;
    //   })
    //   console.log("My CH list",this.Clearing_House_Array);
    }
    
    getGroupPayor() {
      let params = new URLSearchParams();
      params.append("AgencyId", this.global.globalAgencyId);
  
      this.httpService.GetGroupPayorList(params).subscribe((data: GroupPayorList[]) => {
        console.log("group Payor List1==",data);
        this.GroupPayorArray = data;
       //console.log("group Payor List2==",this.GroupPayer);
      })
    }
  
    getSenderIdQualifier() {
      let params = new URLSearchParams();
      params.append("Code", "SENDERIDQUALIFIER");
      params.append("agencyId", this.global.globalAgencyId);
      params.append("userId", this.global.userID);
  
      this.httpService.getSenderIdQualifier(params).subscribe((data: DropList[]) => {
       //console.log("Sender ID Qual1==",data)
        this.senderidQualifier = data;
       //console.log("Sender ID Qual2==",this.senderidQualifier)
      })
    }
    
    getReceiver_id_qualifier() {
      let params = new URLSearchParams();
      params.append("Code", "RECEIVERID_QUALIFIER");
      params.append("agencyId", this.global.globalAgencyId);
      params.append("userId", this.global.userID);
  
      this.httpService.getReceiver_id_qualifier(params).subscribe((data: DropList[]) => {
       //console.log("Reciever Id Qual1==", data);
        this.RecieveridQualifier = data;
       //console.log("Reciever Id Qual2==", this.RecieveridQualifier);
      })
    }
    
    getFormat_type() {
      let params = new URLSearchParams();
      params.append("Code", "FormatType");
      params.append("agencyId", this.global.globalAgencyId);
      params.append("userId", this.global.userID);
  
      this.httpService.getSenderIdQualifier(params).subscribe((data: DropList[]) => {
       //console.log("Format Type1 Sender Id==",data);
        this.format_type = data;
       //console.log("format_type",data);
        
        // this.format_type.forEach(element => {
        //   element.Key=parseInt(element.Key);
        // });
       //console.log("Format Type2==",this.format_type);
      })
    }
  
    getTotalCount() {
      let params = new URLSearchParams();
  
      params.append("SearchColumn", this.SearchColumn.key);
      params.append("SearchText", this.SearchText);
      params.append("AgencyId", this.global.globalAgencyId);
  
      this.httpService.gettotalCount(params).subscribe((data: number) => {
       //console.log("total count==", data);
        this.TotalCount = data;
      });
     //console.log("total count===",this.TotalCount)
    }

// ==============================================

  setDefaultValue() {
   //console.log("this.SearchColumn", this.SearchColumn);
    this.SearchText = "";
    if (this.SearchColumn == undefined)
      this.SearchColumn = {
        'name': 'Name'
      };
  }

  onKeydown(event) {
    if (event.key === "Enter") {
      this.Search();
    }
  }

  // Search Filter //
   Search() {
    this.CHSendBO.field=this.SearchColumn.key;
    this.CHSendBO.value=this.SearchText;
    this.CHSendBO.pageitem=10;
    this.CHSendBO.currentpageno=1;
    this.pagshort.currentPgNo = 1;
    // this.pagshort.currentPgNo = 1;
    // this.getTotalCount();
    this.getClearingHouse();
  }

  // Refresh Option //
  Refresh() {   
    this.SearchText = "";
    this.CHSendBO.field='name';
    this.CHSendBO.value = "";
    this.CHSendBO.pageitem=10;
    this.CHSendBO.currentpageno=1;
    this.pagshort = new sortingObj(); 
    this.getClearingHouse();
    this.getTotalCount();
  }

  // ==================== Create and update functionality ================== //
  OpenCreateupdate(type: string) {
    this.valueschanges();
    if (type == 'new') {
      this.ModelType = 'new';
      this.clearHouseForm.reset();
      // this.userForm.controls.FormatTypeLid.setValue(this.format_type[0].key);
      // this.userForm.controls.ReceiverIDQualifierLid.setValue(this.RecieveridQualifier[0].key);
      // this.userForm.controls.SenderIDQualifier.setValue(this.senderidQualifier[0].key);
      // this.userForm.controls.SenderIDQualifier.setValue(1);
     //console.log(this.clearHouseForm);
      this.ClearH = new ClearingHouseList();
      // this.ClearH.formatTypeLid = this.format_type[0].key; console.log("this.format_type[0].key",this.format_type[0].key);
      // this.ClearH.senderIDQualifierLid = this.senderidQualifier[0].key;console.log("this.senderidQualifier[0].key",this.senderidQualifier[0].key);
      // this.ClearH.receiverIDQualifierLid = this.RecieveridQualifier[0].key;console.log("this.RecieveridQualifier[0].key",this.RecieveridQualifier[0].key);
      this.clearHouseForm.setControl('ClearingHousePayorMapping', new FormArray([]));
      this.valueschanges();
    }
    else {
      this.valueschanges();
      this.ModelType = 'edit';
    }
  }

  // ======================Set data to update=========================//
  selectCHDetails(CHDetails: ClearingHouseList) {
    this.ClearH = JSON.parse(JSON.stringify(CHDetails));
  // //console.log(CHDetails);
    this.ModelType = 'edit';
      let params = new URLSearchParams();
     //console.log("Array====",this.ClearingHousePayorMapping_Array);
      params.append("ClearingHouseId", CHDetails.id.toString());
      this.clearHouseForm.setControl('ClearingHousePayorMapping', new FormArray([]));
      this.httpService.getClearingHousePayorMapping(params).subscribe((data: ClearingHousePayorMapping[]) => {
     //console.log("data==",data);
      this.ClearH.clearingHousePayorMapping = data;
      for (let i = 0; i < data.length; i++) {
        let creds = this.clearHouseForm.get('ClearingHousePayorMapping')['controls'];
        let creds_form = this.ClearH.clearingHousePayorMapping;

        // data[i].groupPayorId = data[i].groupPayorId.toString();

        data[i].groupPayorId = data[i].groupPayorId;

       //console.log(data[i].groupPayorId);
        creds.push(new FormGroup({
          GroupPayor: new FormControl(data[i].groupPayorId),
          GroupPayorId: new FormControl(data[i].payorID),
          Status: new FormControl(data[i].status),
        }));
        // creds_form.push(({
        //   id: (data[i].id),
        //   GroupPayorId: (parseInt(data[i].groupPayorId)),
        //   Status: (data[i].status),
        // }));
      }
    // //console.log("ad==",this.ClearH.clearingHousePayorMapping);
    },(err: any) => {
      if(err){
       //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
      // this.valueschanges();
  }

  // ======================Set Payor Id for Table ==================//
  setPayorId(i) {
    let credarray = this.clearHouseForm.get('ClearingHousePayorMapping')['controls'];
    let id = credarray[i].controls['GroupPayor'].value;
    credarray[i].controls['GroupPayor'].setValue(id);
    let status = credarray[i].controls['Status'];
    for (let index = 0; index < this.GroupPayorArray.length; index++) {
      if (this.GroupPayorArray[index].id == parseInt(id)) {
        credarray[i].controls['GroupPayorId'].setValue(this.GroupPayorArray[index].payorId);
      }
    }
   //console.log("clearH",this.ClearH);
   //console.log("Mapping data=====",this.ClearH.clearingHousePayorMapping);
    this.ClearH.clearingHousePayorMapping[i].groupPayorId = parseInt(id);
   //console.log("Group Payor ID============",this.ClearH.clearingHousePayorMapping[i].groupPayorId);
  }


  // ===============================Clearing house save and update=================== //

  SaveOrUpdateClearnhHouse() {

    // var saveList:ClearingHouseList = this.ClearH;

    this.ClearH.formatTypeLid = this.ClearH.formatTypeLid!=null ? Math.floor(Number(this.ClearH.formatTypeLid)): null;
    this.ClearH.senderIDQualifierLid = Math.floor(Number(this.ClearH.senderIDQualifierLid));
    this.ClearH.receiverIDQualifierLid = Math.floor(Number(this.ClearH.receiverIDQualifierLid));
    this.ClearH.agencyId = parseInt(this.global.globalAgencyId);

    if (this.ClearH.clearingHousePayorMapping.length > 0) {
      for (let i = 0; i < this.ClearH.clearingHousePayorMapping.length; i++) {
        // this.ClearH.clearingHousePayorMapping[i].groupPayorId = parseInt(this.ClearH.clearingHousePayorMapping[i].groupPayorId);
        if (this.ClearH.clearingHousePayorMapping[i].groupPayorId == null||this.ClearH.clearingHousePayorMapping[i].groupPayorId==0 ) {
          this.ClearH.clearingHousePayorMapping.splice(i,1);
        }
      }
    }
   //console.log("Mapping data============",this.ClearH.clearingHousePayorMapping);
   console.log("SaveList",this.ClearH);
    this.httpService.saveupdate(this.ClearH).subscribe((data: number) => {
      this.valueschanges();
     //console.log("====save update=========", data);
      if (data) {
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.ClearH.id = data;
          // this.Clearing_House_Array.push(this.ClearH);
          document.getElementById('openModal1').click();
          this.toastrService.success(
            "Clearing house has been saved successfully",
            "Clearing House Saved "), 8000
        } else {
          document.getElementById('openModal1').click();
          this.toastrService.success(
            "Clearing house has been updated successfully",
            "Clearing House Updated "), 8000
        }
        this.getClearingHouse();
      }
    })
  }

  // ===================================Adding a new row in Payor table========================//

  addFieldValue() {
    // this.ClearH.clearingHousePayorMapping = [];
    const creds = this.clearHouseForm.controls.ClearingHousePayorMapping as FormArray;
    creds.push(new FormGroup({
      GroupPayor: new FormControl(),
      GroupPayorId: new FormControl(),
      Status: new FormControl(),
    }));
    this.ClearH.clearingHousePayorMapping.push(
      this.ClearHMap_Array
    );
  }

  // ===============================Deleting Row in Payor Table==================================//

  deleteFieldValue(index) {
    const creds_form = this.ClearH.clearingHousePayorMapping;
    const creds = this.clearHouseForm.controls.ClearingHousePayorMapping as FormArray;

    console.log("index",index);
    creds.removeAt(index);
    this.ClearH.clearingHousePayorMapping.pop();

  }

  deleteFieldValue_update(index) {
    const creds_form = this.ClearH.clearingHousePayorMapping;
    const creds = this.clearHouseForm.controls.ClearingHousePayorMapping as FormArray;
    this.index = index;
    if (creds_form[index].id == null) {
      creds.removeAt(index);
      console.log("index",index);
      
      this.ClearH.clearingHousePayorMapping.pop();
    }
    else {
     //console.log("ClearH",this.ClearH)
     //console.log("index==",index)
     //console.log("delete ID==",creds_form[index].id);
      this.deleteId = creds_form[index].id.toString();
      document.getElementById("openModal3").click();
      
      console.log("index",index);
    }
  }

  deleteClearingHousePayorMapping() {
    let params = new URLSearchParams();
    params.append("CleasingHousepayorId", this.deleteId);
    this.httpService.deleteClearingHousePayorMapping(parseInt(this.deleteId)).subscribe((data:any) => {
      this.valueschanges();
    // this.ClearH.clearingHousePayorMapping.pop(this.index);
    document.getElementById("openModal3").click();
    this.toastrService.success(
    "Clearing house payor mapping has been deleted successfully",
    "Clearing House Payor Mapping Deleted "), 8000
    const creds = this.clearHouseForm.controls.ClearingHousePayorMapping as FormArray;
    creds.removeAt(this.index);
    // this.ClearH.clearingHousePayorMapping.pop(this.index);
    });
  }


  // =========================Checkbox events=================//

  onStatusChange(i) {
    let credarray = this.clearHouseForm.get('ClearingHousePayorMapping')['controls'];
    let status = credarray[i].controls['Status'];
    this.ClearH.clearingHousePayorMapping[i].status = status.value;
  }

  
  // ===================================Closing a model from ts============//


 valueschanges() {
   this.valuechange = {
    Id: 0,
    Name: 0,
    Modifier: 0,
    FormatTypeLid: 0,
    TradingPartnerID2: 0,
    SenderID: 0,
    SenderIDQualifierLid:0,
    ReceiverID: 0,
    ReceiverIDQualifierLid: 0,
    FileNameFormatType: 0,
    GroupPayor: 0,
   }
  }

  checkpopup(value) {
    if (value == "Id") {
      this.valuechange.Id++;
    }
    if (value == "Name") {
      this.valuechange.Name++;
    } if (value == "Modifier") {
      this.valuechange.Modifier++;
    } if (value == "FormatTypeLid") {
      this.valuechange.FormatTypeLid++;
    }
    if (value == "TradingPartnerID2") {
      this.valuechange.TradingPartnerID2++;
    }
    if (value == "SenderID") {
      this.valuechange.SenderID++;
    }
    if (value == "SenderIDQualifierLid") {
     this.valuechange.SenderIDQualifierLid++;
   }
   if (value == "ReceiverID") {
     this.valuechange.ReceiverID++;
   }
   if (value == "ReceiverIDQualifierLid") {
     this.valuechange.ReceiverIDQualifierLid++;
   }
   if (value == "FileNameFormatType") {
     this.valuechange.FileNameFormatType++;
   }
   if (value == "GroupPayor") {
     this.valuechange.GroupPayor++;
   }
   
  //console.log(this.valuechange);
 
  }

  CloseSaveMOdelConfirm() {
   //console.log("valueschange",this.valuechange);
    if (this.valuechange.Id > 1 || this.valuechange.Name > 1 || this.valuechange.Modifier > 1 ||
      this.valuechange.FormatTypeLid > 1 || this.valuechange.TradingPartnerID2 > 1 || this.valuechange.SenderID > 1
      || this.valuechange.SenderIDQualifierLid > 1|| this.valuechange.ReceiverID > 1|| this.valuechange.ReceiverIDQualifierLid > 1
      || this.valuechange.FileNameFormatType > 1|| this.valuechange.GroupPayor > 0) {
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

  // ====================================


  filepermissionget() {
    let params = new URLSearchParams();

    params.append("pagecode", "ClearingHouse");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
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
getColumnwidth() {
  
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Clearinghouse.Columns;


    this.grid.columns.forEach(col => {
      this.arraycol[0].Clearinghouse.HideColumns.forEach(element => {
        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });
    //  this.grid.refreshColumns();

  //  this.grid.showColumns(JSON.parse(data.column)[0].Clearinghouse.ShowColumns);
    this.grid.hideColumns(JSON.parse(data.column)[0].Clearinghouse.HideColumns);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Clearinghouse.Pagesize

    this.ColumnArray.forEach(element => {

      if (element.column == 'Name') {

        const column = this.grid.getColumnByField('name'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Modifier') {

        const column1 = this.grid.getColumnByField('modifier'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Fax') {

        const column2 = this.grid.getColumnByField('fax'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Receiver ID Qualifier') {

        const column3 = this.grid.getColumnByField('receiverIDQualifier_Name'); // get the JSON object of the column corresponding to the field name
        column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Receiver ID') {

        const column4 = this.grid.getColumnByField('receiverId'); // get the JSON object of the column corresponding to the field name
        column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Sender ID Qualifier') {

        const column5 = this.grid.getColumnByField('senderIdQualifier_Name'); // get the JSON object of the column corresponding to the field name
        column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Sender ID ') {

        const column5 = this.grid.getColumnByField('senderId'); // get the JSON object of the column corresponding to the field name
        column5.headerText = element.column;
        column5.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Format Type') {

        const column6 = this.grid.getColumnByField('formatTypeName'); // get the JSON object of the column corresponding to the field name
        column6.headerText = element.column;
        column6.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'File Name Format Type') {

        const column7 = this.grid.getColumnByField('fileNameFormatType'); // get the JSON object of the column corresponding to the field name
        column7.headerText = element.column;
        column7.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Trading Partner ID2') {

        const column8 = this.grid.getColumnByField('tradingPartnerID2'); // get the JSON object of the column corresponding to the field name
        column8.headerText = element.column;
        column8.width = element.width;

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
 
  this.arraycol[0].Clearinghouse.Columns = this.ColumnArray;
  this.arraycol[0].Clearinghouse.Pagesize = this.grid.pageSettings.pageSize;
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

