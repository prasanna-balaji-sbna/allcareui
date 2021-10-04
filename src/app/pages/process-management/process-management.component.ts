import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs,QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { PMHttpService } from './process-management.service';
import { processListBo, GetPMListBo, functionpermission, WhereCondition,LovBO, DropList } from './process-management.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { GetHTTPService } from './process-managementdata.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { DateService } from '../../date.service';
import { IMyDpOptions, IMyDateModel, IMyInputFieldChanged } from 'mydatepicker';
import { formatDate, DatePipe } from '@angular/common';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../icd10/icd10.model';

@Component({
  selector: 'app-process-management',
  templateUrl: './process-management.component.html',
  styleUrls: ['./process-management.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessManagementComponent implements OnInit {

  /////===============Main functionality initialisation=====================///
  PMArray: processListBo[];
  Process: processListBo = new processListBo();
  PMSendBO:GetPMListBo = new GetPMListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();
  LOVList: LovBO[];
  RoleData: DropList[];
  UserData: DropList[];
  ///////////////=============Form initialization==========//
  // PMForm: FormGroup;
  ///////////////-===================Table initializations==========// 
  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  Typename: string = null;
  Rolename: string = null;
  Username: string = null;
  listId: number;
  isUpdate: boolean =false;
  /////////////////////////////////////////////////FORMVALIDATION//////////////////////////////////////////////////
  PMForm = new FormGroup({
    TypeLId: new FormControl( {value:'',disabled: this.isUpdate},Validators.required,),
    RoleId: new FormControl({value:'',disabled: this.isUpdate}, Validators.required),
    UserId: new FormControl({value:'',disabled: this.isUpdate}),
    OrderNumber: new FormControl({value:'',disabled: this.isUpdate}, Validators.required),
    EffectiveDateValue1: new FormControl({value:'',disabled: this.isUpdate}, Validators.required),
    EffectiveThroughDateValue1: new FormControl('')
  });
  lovForm: FormGroup;
  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  ///////////////================Column chooser initializations=================////////
  @ViewChild('grid') public grid: GridComponent;
    ///////////////================Column chooser=================////////
  public filterSettings: object;
  filter: IFilter;
  // Filter_drop: searchfilterDetails;
  TotalCount: number;  
  // pagshort: sortingObj = new sortingObj(); 
  public pageSizes: number[] = [10,15,20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  public dropdatas:string[]= ['Yes','No'];
  public height = '220px';
  ///////////////////////////////Date Piker intialization////////////////////////////////////////////////////////////////
  public myDatePickerOptionsEFF: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
    showClearDateBtn: false,
    editableDateField: true
  };
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  // ==========================================
  ModelType: string = 'edit';
  fp: functionpermission;
  public formatOptions: object;
  public formbool: boolean = false;
  
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'mm/dd/yyyy',
    showClearDateBtn: false,
    editableDateField: true
  };

  constructor(public dateservice: DateService,public http: HttpClient, private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
  private ref: ChangeDetectorRef, public global: GlobalComponent, public toastrService: ToastrService, public general: generalservice, public Service: PMHttpService) {

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
    this.data=gethttp;
    this.lovForm = this.formBuilder.group({
      Name: ['', Validators.required],
    });
   }

   type:string="";
    public dataStateChange(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.PMSendBO.orderColumn = state.sorted[0].name;
        this.PMSendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
      if( this.PMSendBO.type=="date")
      {
       
        this.PMSendBO.value=new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString();
      } else {
        this.PMSendBO.value=state.action.currentFilterObject.value.toString();
      }
      // if (state.action.currentFilterObject.field = 'orderNumber') {
      //   state.action.currentFilterObject.field = "Order";
      // }
        this.PMSendBO.field=state.action.currentFilterObject.field;
        this.PMSendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.PMSendBO.operator=state.action.currentFilterObject.operator;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.PMSendBO.field="Typename";
        this.PMSendBO.matchCase=false;
        this.PMSendBO.operator="startswith";
        this.PMSendBO.value="";
        this.PMSendBO.type="string";
      }
    }
    this.PMSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.getProcess();
    if (this.type == "paging" && state.action.name == "actionBegin") {
      // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
        if( this.arraycol.length!=0)
        {
          if(this.arraycol[0].Intake_management.Pagesize!=state.take)
          {
            this.arraycol[0].Intake_management.Pagesize = state.take
               console.log( "save page size")
            this.SaveColumnwidth();
          // }
  
        }
      
      }
  
    }
  }

  ngOnInit(): void {
    console.log("data",this.data);
    this.fp = new functionpermission();
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.getProcess();
    this.GetUserType();
    this.GetUserRole();
    this.GetUser();
    this.filepermissionget();
    this.formatOptions = {type: 'date', format: 'MM/dd/yyyy'};
    this.filterSettings = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
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

        this.arraycol[0].Intake_management.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Intake_management.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Intake_management.ShowColumns.length != count1 || this.arraycol[0].Intake_management.HideColumns.length != count) {
          this.arraycol[0].Intake_management.ShowColumns = showarr;
          this.arraycol[0].Intake_management.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.PMSendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.PMSendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    if(args.name=="actionBegin"&&args.requestType=="filterbeforeopen")
    {
      this.PMSendBO.type=args.columnType
      console.log( this.PMSendBO)
    }
  }

  //===================================Show column settings===================//
  show() {
    this.grid.columnChooserModule.openColumnChooser(); // give X and Y axis
   }

  getProcess(){
    this.PMSendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.PMSendBO);
    let count =0
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
    })
    console.log(" this.gethttp.",this.data);
  }

  Createupdate(type: string){
    // this.PMForm.reset();
    if(type == 'new'){
      this.Process = new processListBo();
      // this.Process.effectiveThroughDate = "";
      this.ModelType = 'new';
      this.formbool = false;
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
      this.ModelType = 'edit';
      this.formbool = false;
    }
  }
  
  GetUserType() {
    let myparams = new URLSearchParams();
    myparams.append("Code", "PROCESSMANAGEMENT");
    myparams.append("agencyId", this.global.globalAgencyId);
    this.Service.GetLOVList(myparams).subscribe((data: LovBO[]) => {
      console.log("data-====",data);
      this.LOVList = data;
      if (data.length != 0) {
        this.LOVList.forEach(element => {
          this.listId = element.listId;

        });
      }
    })
  }
  
  GetUserRole() {
    this.Service.GetRole().subscribe((data: DropList[]) => {
      console.log("data-====",data);
      this.RoleData = data;
    })
  }
  
  GetUser() {
    let myparams = new URLSearchParams();
    myparams.append("Code", "Active");
    myparams.append("Agencyid", this.global.globalAgencyId);
    this.Service.GetUser(myparams).subscribe((data: DropList[]) => {
      console.log("data-====",data);
      this.UserData = data;
    })
  }

  selectPMdetails(PMDetails: processListBo) {
    // PMDetails.typeId = parseInt(PMDetails.typeId);
    // PMDetails.userid = parseInt(PMDetails.userid);
    this.Process = JSON.parse(JSON.stringify(PMDetails));
    this.Process.typeLid = Math.floor(Number(this.Process.typeLid));
    console.log("this.process",this.Process);
    this.Process.userId = Math.floor(Number(this.Process.userId));
    setTimeout(() => {
      this.Process.effectiveDate = new Date(PMDetails.effectiveDate).toLocaleDateString()
      if(PMDetails.effectiveThroughDate != null){
      this.Process.effectiveThroughDate = new Date(PMDetails.effectiveThroughDate).toLocaleDateString()
      } else {
        this.Process.effectiveThroughDate = "";
      }
    }, 400);
    // this.Process.effectivedate = new Date(new Date(this.Process.effectivedate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString();
    // this.Process.effectivethroughdate = new Date(new Date(this.Process.effectivethroughdate).toLocaleDateString()+" "+"00:00:00"+" "+"GMT").toISOString();
    // this.Process = PMDetails;
    console.log("this.process",this.Process);
  }
  Refresh() {
    this.Typename = null;
    this.Rolename = null;
    this.Username = null;
    this.PMSendBO.ptype = null;
    this.PMSendBO.role = null;
    this.PMSendBO.user = null;
    this.PMSendBO.field = "Typename";
    this.PMSendBO.operator = "startswith";
    this.PMSendBO.value = "";
    this.PMSendBO.type = "string";
    this.getProcess();
  }
  ApplyFilter(){
    this.PMSendBO.ptype = parseInt(this.Typename);
    this.PMSendBO.role = this.Rolename;
    this.PMSendBO.user = parseInt(this.Username);
    this.PMSendBO.value = "";
    this.PMSendBO.type = "string";
    this.getProcess();
  }

  CheckBool() {
    this.formbool = true;
  }

  SaveOrUpdate() {
    if(this.Process.effectiveThroughDate == "") {
      this.Process.effectiveThroughDate = null;
    }
    var listParam:processListBo = JSON.parse(JSON.stringify(this.Process));
    console.log("Agency Id",this.global.globalAgencyId);
    listParam.effectiveDate = new Date(new Date(this.Process.effectiveDate).toDateString() + " "+ "00:00:000" + " " + "GMT").toISOString();
    //  new Date(new Date(this.Process.effectivedate).toLocaleDateString()+" "+new Date().toLocaleTimeString());
    if (this.Process.effectiveThroughDate != null && this.Process.effectiveThroughDate != "") {
      listParam.effectiveThroughDate = new Date(new Date(this.Process.effectiveThroughDate).toDateString() + " "+ "00:00:000" + " " + "GMT").toISOString();
    }
    // new Date(new Date(this.Process.effectivethroughdate).toLocaleDateString()+" "+new Date().toLocaleTimeString());
    listParam.typeLid = Math.floor(Number(this.Process.typeLid));
    listParam.userId = Math.floor(Number(this.Process.userId));
    listParam.agencyId = parseInt(this.global.globalAgencyId);
    // listParam.OrderNumber = Math.floor(Number(this.Process.OrderNumber));
    console.log("listParam",listParam);
    this.Service.saveupdate(listParam).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.toastrService.success('User Saved successfully', 'User Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getProcess();
          document.getElementById('openModal').click();
        } else {
          this.toastrService.success('User Updated successfully', 'User Updated');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.getProcess();
          document.getElementById('openModal').click();
        }
         
      }
      this.formbool = false;
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }

  deleteProcess() {
    this.Service.DeleteProcessdata(this.Process.id).subscribe((data: any) => {
      if (data) {
        console.log("=========== delete function =========", data);
        document.getElementById('deleteintakemodal').click();
        // this.getTotalCount();
        this.toastrService.success('Data deleted successfully', 'Data deleted'),8000;
        this.getProcess();
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    );
  }
  checkpop(){
    if(this.formbool == true){
      document.getElementById('cancelmodal').click();
    } else {
      document.getElementById('openModal').click();
    }
  }

  Closemodal() {
    document.getElementById('cancelmodal').click();
    document.getElementById('openModal').click();
  }

  // DTPicker========
  newdates(event, name, refname) {

    if (name == "inputchage") {
      let val = this.dateservice.inputFeildchange(event);
      if (val != undefined) {
        let val1 = this.dateservice.inputFeildchange(event);
        if (refname == "effectivedate") {
          this.Process.effectiveDate = val1;
        }
        if (refname == "effectivethroughdate") {
          if(this.Process.effectiveThroughDate != null){
            this.Process.effectiveThroughDate = val1;
            } else {
              this.Process.effectiveThroughDate = null;
            }
        }
      }
    }
    if (name == "datechagned") {
      let val = this.dateservice.Datechange(event);
      if (val != undefined) {
        let val1 = this.dateservice.Datechange(event);
        if (refname == "effectivedate") {
          this.Process.effectiveDate = val1;
        }
        if (refname == "effectivethroughdate") {
          if(this.Process.effectiveThroughDate != null){
          this.Process.effectiveThroughDate = val1;
          } else {
            this.Process.effectiveThroughDate = null;
          }
        }
  }
    }
  }

  // =========================

  // onDateChanged(event) {
  //   this.Process.effectivedate = event.formatted;
  // }
  // onDateChanged1(event: IMyDateModel) {
  //   this.Process.effectivethroughdate = event.formatted;
  // }
  // datechangedob(event) {

  //   let value = event.value;
  //   if (value.length == 5 && value.substring(2, 3) != '/') {
  //     this.Process.effectivedate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  //   }
  // }
  // datechangedob1(event: IMyInputFieldChanged) {
  //   let value = event.value;
  //   if (value.length == 5 && value.substring(2, 3) != '/') {
  //     this.Process.effectivethroughdate = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 10);
  //   }
  // }

  Lov: any = {};
  ClearList() {
    this.Lov = {
      // ListId:parseInt(this.ListValue),
      LovCode: '',
      LovName: '',
      LovValue: '',
      Orderby: '',
    };
  }

  CreateLov() {
    this.ClearList();
  }

  SaveLOV(listParam) {
    let obj = {
      ListId: Math.floor(Number(this.listId)),
      Id: listParam.Id,
      lovCode: (listParam.LovName.replace(/\s/g, "").toUpperCase()),
      lovName: listParam.LovName,
      lovValue: null,
      orderby: listParam.Orderby != '' ? parseInt(listParam.Orderby) : 0,
      agencyId: this.global.userID == 0 ? 0 : parseInt(this.global.globalAgencyId)
    }

    this.Service.saveupdateLOV(obj).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        //====================== sucess message =============
          this.toastrService.success('LOV Saved successfully', 'LOV Saved');
          setTimeout(() => {
            this.toastrService.clear();
          }, 8000);
          this.GetUserType();
          document.getElementById('lov').click();
      }
      this.formbool = false;
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }

  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "ProcessManagement");
    params.append("roleId", this.global.roleId);
    this.Service.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
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

  // ==============================================================================

  getColumnwidth() {
 
    this.Service.getcolumwidth().subscribe((data: any) => {
      this.arraycol = JSON.parse(data.column);


      this.ColumnArray = JSON.parse(data.column)[0].Intake_management.Columns;


    
      let showcol = JSON.parse(data.column)[0].Intake_management.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Intake_management.HideColumns
  

 //   this.grid.showColumns(showcol);
    this.grid.hideColumns(hidecol);
      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Intake_management.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'Type') {

          const column = this.grid.getColumnByField('typeName'); // get the JSON object of the column corresponding to the field name
          
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Role') {

          const column1 = this.grid.getColumnByField('rolename'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'User') {

          const column1 = this.grid.getColumnByField('user'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        
        if (element.column == 'Order No') {

          const column1 = this.grid.getColumnByField('orderNumber'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Effective Date') {

          const column1 = this.grid.getColumnByField('effectiveDate'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Effective Through Date') {

          const column1 = this.grid.getColumnByField('effectiveThroughDate'); // get the JSON object of the column corresponding to the field name
          
          column1.width = element.width;

          this.grid.refreshHeader();
        }
       
        if (element.column == 'Actions') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        
          column2.width = element.width;
          this.grid.refreshHeader();

        }
      });


    });

  }
  SaveColumnwidth() {
    
    this.arraycol[0].Intake_management.Columns = this.ColumnArray;
    this.arraycol[0].Intake_management.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.Service.savecolumwidth(this.columnchange).subscribe((data: any) => {

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
