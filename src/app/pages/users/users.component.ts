import { Component, OnInit, ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { UsersHttpService } from './users.service';
import { UserList, sortingObj, functionpermission, DropList, DropList1, GetUserListBo, WhereCondition } from './users.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ErrorService } from 'src/app/services/error.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { GetHTTPService } from './user-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ColumnChangeBO, columnWidth } from '../list/list.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {

  // ========Main Initialization=================//

  UserArray: UserList[];
  User: UserList = new UserList();
  usergridArray = [];
  StatusDrop = [];
  EmpList = [];
  UsersendBO:GetUserListBo = new GetUserListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];

  // ============Form Initialization====================//

  // UserForm: FormGroup;
  resetPass: FormGroup;
  // UpdateForm: FormGroup;
  // RoleUpdateForm: FormGroup;

  userForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required]),
    MiddleName: new FormControl(''),
    LastName: new FormControl('', [Validators.required]),
    Status: new FormControl('', [Validators.required]),
    Role: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Phone1: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
    Phone2: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    // ,Validators.pattern('[A-Z][a-z]'),Validators.minLength(8)]
  });

  UpdateForm = new FormGroup({
    id: new FormControl(''),
    FirstNameUpdate: new FormControl('', [Validators.required]),
    MiddleNameUpdate: new FormControl(''),
    LastNameUpdate: new FormControl('', [Validators.required]),
    StatusUpdate: new FormControl('', [Validators.required]),
    RoleUpdate: new FormControl('', [Validators.required]),
    EmailUpdate: new FormControl('', [Validators.required, Validators.email]),
    Phone1Update: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
    Phone2Update: new FormControl('', [Validators.minLength(14), Validators.maxLength(14)]),
    Username: new FormControl('')
  });

  RoleUpdateForm = new FormGroup({
    id: new FormControl(''),
    UserUpdateEmployee: new FormControl('', [Validators.required]),
    UserUpdateStatus: new FormControl('', [Validators.required]),
    UserUpdateRole: new FormControl('', [Validators.required]),
  });

  // ==========Filters=================//

  SearchText: string = ''; 
  SearchColumn: string = "username";

  // =========Table Initialization=============//

  dropInstance: DropDownList;  
  public searchSettings: SearchSettingsModel;
  public toolbar: ToolbarItems[]; 
  initialPage: object;
  filterOptions: FilterSettingsModel;
  // grid: GridComponent;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;  
  TotalCount: number;  
  pagshort: sortingObj = new sortingObj(); 
  public pageSizes: number[] =[10, 15, 20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;

  // ===============Functionality Initializatin==============//

  valuechange :any= [];
  roleName = [];
  formvalue= [];
  dropdownSettings = {};
  ResetPassword: string;
  UserId: number;
  UserRole= [];
  passerror: boolean = false;
  ModelType: string = 'edit';
  fp: functionpermission;

  constructor( private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
    public global: GlobalComponent, public httpService: UsersHttpService, private ref: ChangeDetectorRef,
    public toastrService: ToastrService, public general: generalservice, public errorService: ErrorService ) { 
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.resetPass = this.formBuilder.group({
        Password: ['', Validators.required]
      });

      this.dropdownSettings = { 
        singleSelection: false, 
        idField: 'value',
        textField: 'label',
        text:"Select",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: true,
        classes:"myclass custom-class",
        "allowSearchFilter": true
      };
    }
    type:string="";
    public dataStateChange(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.UsersendBO.orderColumn = state.sorted[0].name;
        this.UsersendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.UsersendBO.field=state.action.currentFilterObject.field;
        this.UsersendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.UsersendBO.operator=state.action.currentFilterObject.operator;
        this.UsersendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.UsersendBO.field="Fname";
        this.UsersendBO.matchCase=false;
        this.UsersendBO.operator="startswith";
        this.UsersendBO.value="";
      }
    }
    this.UsersendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.GetUser();

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Import.Pagesize!=state.take)
        {
          this.arraycol[0].Import.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }


  }

  ngOnInit() {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.fp = new functionpermission();
    this.SearchText = "";
    this.GetUser();
    this.initData();
    // this.userForm.reset();
    // this.Cancel__Click();
    // =Grid Initialization//
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
if(this.arraycol.length > 0)
{
  this.arraycol[0].Users.ShowColumns.forEach(old => {
    showarr.forEach(element => {
      if (old == element) {
        count1 = count1 + 1;
      }
    });

  });

  this.arraycol[0].Users.HideColumns.forEach(old => {
    hidearr.forEach(element => {
      if (old == element) {
        count = count + 1;
      }
    });

  });
  console.log(count, count1, "count");


  if (this.arraycol[0].Users.ShowColumns.length != count1 || this.arraycol[0].Users.HideColumns.length != count) {
    this.arraycol[0].Users.ShowColumns = showarr;
    this.arraycol[0].Users.HideColumns = hidearr;
    this.SaveColumnwidth();
  }
}
  
  }
}
  
    this.UsersendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;    
    this.UsersendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 

  ngOnChanges(changes: SimpleChanges) {
    let f = changes;
    console.log(f);

   
  }
  // =======================Grid Column selector ================ //
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
  // ===========================================//

  passvalid(event) {

    let str = event.target.value;
    let res;

    if (str.match(/[a-z]/g) && str.match(
      /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
          /[^a-zA-Z\d]/g) && str.length >= 8) {
      this.passerror = false;
    }
    else {
      this.passerror = true;
    }

  }

  Cancel__Click() {
    this.resetPass.reset();
    this.userForm.reset();
    this.UpdateForm.reset();
    this.RoleUpdateForm.reset();
    // this.ngOnInit();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  Refresh() {
    this.SearchText = "";
    this.UsersendBO.field="Fname";
    this.UsersendBO.value="";
    // this.UsersendBO.value=this.SearchText;
    this.UsersendBO.pageitem=10;
    this.UsersendBO.currentpageno=1;
    this.GetUser();
    this.initData();
  }


  Search() {
    this.UsersendBO.value=this.SearchText;
    this.UsersendBO.pageitem=10;
    this.UsersendBO.currentpageno=1;
    this.GetUser();
    this.gettotalCount();
  }

  initData() {
    let myparams2 = new URLSearchParams();
    myparams2.append("Code", "STATUS");
    myparams2.append("agencyId", this.global.globalAgencyId);

    this.httpService.getDropList(myparams2).subscribe((data: DropList1[]) => {
      console.log(data);
      this.StatusDrop = data;
    })
    
    let myparams = new URLSearchParams();
    myparams.append("Code", "ALL");
    this.httpService.getUserDropList(myparams).subscribe((data: DropList[]) => {
      console.log(data);
      this.EmpList = data;
    })
    let params = new URLSearchParams();
    params.append("userId", this.global.userID);
    params.append("AgencyId", this.global.globalAgencyId);
    this.httpService.getUserRole(params).subscribe((data: DropList[]) => {
      console.log("Role===",data);
      this.UserRole = data;
      // let val = {};
      // data.forEach(element => {
      //   val = {"key":element.value, "value":element.label}
      // this.UserRole.push(val);
      // });
      // console.log(this.UserRole);
    })
    console.log("roleee===",this.UserRole);
  }


  onSelectAll(event) {
    console.log(event);
  }
  onItemSelect(event) {
    console.log(event);
  }

  // ==========================popup check=====================================//
  popBool: boolean = false;
  onvalChange(){
    this.popBool = true;
  }
  // ==========================Send Data==================================== //

  UserCreateUpdate(type: string) {
    if(type == 'new') {
      this.roleName = [];
      this.Cancel__Click();
      this.userForm.controls.Status.setValue(1);
      this.ModelType="new";
      console.log("valueChange",this.valuechange);
      // this.User = new UserList();
      // this.User.statusLid = 1;
      this.valueschanges();
      this.popBool =false;
    }
    else {
      this.ModelType="edit";
      console.log("valueChange",this.valuechange);
    }
  }

  selectUserdetails(UserDetails: UserList) {
    this.roleName=UserDetails.userRoleId.split(",");
    this.User = JSON.parse(JSON.stringify(UserDetails));
    this.UpdateForm.controls.StatusUpdate.setValue(UserDetails.statusLid);
    // this.User.statusLid = UserDetails.statusLid;
    this.popBool =false;
    this.valueschanges();
  }


  // ========================Fetch Data from API================================= //
  // GetUser() {
  //   this.httpService.getUserList().subscribe((data: UserList[]) => {
  //     console.log("data=======",data);
  //     this.UserArray = data;
  //     this.UserArray.forEach(element => {
  //       if(element.phone1 != null){
  //         element.phone1 = this.general.reconverPhoneGoogleLibhttpsave(element.phone1);
  //       }
  //       if(element.phone2 != null){
  //         element.phone2 = this.general.reconverPhoneGoogleLibhttpsave(element.phone2);
  //       }
  //       console.log("element.telephone",element.phone1);
  //       console.log("element.telephone",element.phone2);
  //     });
  //     console.log("User array=========", this.UserArray);
  //     // this.roleName = this.UserArray.roleName;
  //   })
  // }
  
  GetUser() {
    this.UsersendBO.agencyId=parseInt(this.global.globalAgencyId);
    this.gethttp.execute(this.UsersendBO);
    console.log(" this.gethttp.",this.data);
    let count=0
    this.data.subscribe((data:any)=>{
      count= count+1
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
    })

    // this.UsersendBO.SearchText=this.SearchText;
    // this.UsersendBO.pageitem=this.pagshort.itemperpage;
    // this.UsersendBO.currentpageno=this.pagshort.currentPgNo;
    // this.UsersendBO.orderColumn=this.pagshort.shortcolumn;
    // this.UsersendBO.orderType=this.pagshort.shortType;
    // this.UsersendBO.AgencyId=parseInt(this.global.globalAgencyId);
    
    // console.log("this.conditionlist.length",this.conditionlist.length);
    // if(this.conditionlist.length!=0){
    //   this.UsersendBO.conitionBO=this.conditionlist;
    // }
    // else{
    //   this.conditionlist.push(new WhereCondition());
    //   this.UsersendBO.conitionBO=this.conditionlist;
    // }
    // console.log("this.UsersendBO",this.UsersendBO);

    // // let params = new URLSearchParams();
    // // params.append("SearchColumn", "C");
    // // params.append("AgencyId", this.global.globalAgencyId);
    // // params.append("SearchText", this.SearchText);
    // // params.append("Pageitem", this.pagshort.itemperpage.toString());
    // // params.append("Currentpageno", this.pagshort.currentPgNo.toString());
    // // params.append("OrderColumn", this.pagshort.shortcolumn);
    // // params.append("OrderType", this.pagshort.shortType);

    // this.httpService.gettoltaliteam(this.UsersendBO).subscribe((data: UserList[]) => {
    //   this.UserArray = data;
    //   this.UserArray.forEach(element => {
    //     if(element.phone1 != null){
    //       element.phone1 = this.general.reconverPhoneGoogleLibhttpsave(element.phone1);
    //     }
    //     if(element.phone2 != null){
    //       element.phone2 = this.general.reconverPhoneGoogleLibhttpsave(element.phone2);
    //     }
    //     console.log("element.telephone",element.phone1);
    //     console.log("element.telephone",element.phone2);
    //   });
    // })
    // // this.roleName = this.UserArray.roleName;
    // console.log("User array2=========", this.UserArray);
  }
  
  gettotalCount() {

    let params = new URLSearchParams();
    params.append("AgencyId", this.global.globalAgencyId);
    params.append("SearchColumn", "C");
    params.append("SearchText", this.SearchText);

    this.httpService.gettotalCount(params).subscribe((data: number) => {
      console.log("Total Count==",data);
      this.TotalCount = data;
    })
  }

  // ==========================Save or update Data====================================== //

  deleteError: string = "";
  deleteAlert: boolean = false;
  statusValue: number;
  SaveOrUpdateUser() {
    if (this.ModelType == 'new') {
      this.User.id =0;
    }
    this.StatusDrop.forEach(element => {
      if (element.Value == "InActive") {
        this.statusValue = element.Key;
      }
    });
    if (this.User.statusLid == this.statusValue){
      this.User.isBlocked = true;
    } else {
      this.User.isBlocked = false;
    }
    // var saveList:UserList = JSON.parse(JSON.stringify(this.User));
    this.User.phone1 = this.general.reconverPhoneGoogleLib(this.User.phone1);
    this.User.phone2 = this.general.reconverPhoneGoogleLib(this.User.phone2);
    this.User.statusLid = Math.floor(Number(this.User.statusLid));
    this.User.agencyId = parseInt(this.global.globalAgencyId);
    this.User.roleName = this.roleName;
    console.log("Role Name", this.User.roleName);
    console.log("Save Data====",this.User);
    this.httpService.saveupdateUser(this.User).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        this.valueschanges();
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.toastrService.success(
            'User Saved successfully!',
            'User Saved',), 8000;
          this.User.id = data;
          // this.UserArray.push(this.User);
          this.userForm.reset();
          document.getElementById('OpenModal1').click();
         // console.log("User Data====",this.UserArray);
        } else if (this.ModelType == 'edit') {
          this.toastrService.success(
            'User Updated successfully!',
            'User Updated',), 8000;
            this.UpdateForm.reset();
            document.getElementById('OpenModal2').click(); 
        }
         this.GetUser();
         this.gettotalCount();
      }
      // console.log("error",this.errorService.Error)
      // console.log("error Bool",this.errorService.errorBool)
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
    }
    )    
    console.log("User Data====",this.UserArray);
    // console.log("error",this.errorService.Error)
    // console.log("error Bool",this.errorService.errorBool)
  }

  // ================================Reset Password========================== //

  resetpassword(userid) {
    this.UserId= userid;
  }

  ResetPasswrd(Status: string){
    var saveList:UserList;
    let myParams = new URLSearchParams();
    console.log("Password=======",this.ResetPassword);
    console.log("userID=======",this.UserId);
    myParams.append("Userid", this.UserId.toString());
    myParams.append("password", this.ResetPassword);
    console.log("Save Pwd data===",myParams);
    this.httpService.ResetPassword(myParams).subscribe((data: any) => {
      console.log("Data========",data);
      this.toastrService.success(
        'Password has been changed successfully!',
        'Password changed',), 8000;
        document.getElementById('resetmodal').click();
        this.resetPass.reset();
    })
  }


// ====================================================================
  filepermissionget() {
    let params = new URLSearchParams();
    params.append("pagecode", "USERS");
    params.append("roleId", this.global.roleId);
    this.httpService.getFilePermissions(params).subscribe((data: functionpermission) => {
      this.fp = data;
    });
  }

  // ================================================================================

  valueschanges()
  {
    this.valuechange={
      Status:0,
      FirstName:0,
      MiddleName:0,
      LastName:0,
      RoleId: 0,
      Email: 0,
      Phone1: 0,
      Phone2: 0,
      UserName: 0,
      Password: 0,
    }
  }
  count:any = 0;
  checkpopup(value)
  {
    
    
    if(value=="Status")
    {
      this.valuechange.Status= this.valuechange.Status + 1 ;
    }
    if(value=="FirstName")
    {
      this.valuechange.FirstName = this.valuechange.FirstName + 1 ;
    }
    if(value=="MiddleName")
    {
      this.valuechange.MiddleName = this.valuechange.MiddleName + 1 ;
    }
    if(value=="LastName")
    {
      this.valuechange.LastName = this.valuechange.LastName + 1 ;
    }
    if(value=="RoleId")
    {
      console.log(this.roleName);
      this.valuechange.RoleId = this.valuechange.RoleId + 1 ;
    }
    if(value=="Email")
    {
      this.valuechange.Email= this.valuechange.Email + 1 ;
    } if(value=="Phone1")
    {
      this.valuechange.Phone1= this.valuechange.Phone1 + 1 ;
    }
    if(value=="Phone2")
    {
      this.valuechange.Phone2= this.valuechange.Phone2 + 1 ;
    }
    if(value=="UserName")
    {
      this.valuechange.UserName= this.valuechange.UserName + 1 ;
    }
    if(value=="Password")
    {
      this.valuechange.Password= this.valuechange.Password + 1 ;
    }
  }

  // =================================================
  DemographicPhoneFormat1() {
    this.User.phone1 = this.general.converPhoneGoogleLib(this.User.phone1);
  }
  // /////////////////////////////////////////////////////////////
  DemographicPhoneFormat2() {
    this.User.phone2 = this.general.converPhoneGoogleLib(this.User.phone2);
  }

  // ==========================================================

  openDialog() {
    console.log(this.valuechange);
      if(this.popBool == true){
        document.getElementById('cancelmodal').click();
      }
      else{
        document.getElementById('OpenModal1').click();
      }
  }

  closeAddUpdateModal() {
    document.getElementById('cancelmodal').click();
    document.getElementById('OpenModal1').click();
  }
  
  openDialog1() {
    console.log(this.valuechange);
      if(this.popBool == true){
        document.getElementById('cancelmodal1').click();
      }
      else{
        document.getElementById('OpenModal2').click();
      }
  }

  closeAddUpdateModal1() {
    document.getElementById('cancelmodal1').click();
    document.getElementById('OpenModal2').click();
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

////////////////////////////////////////////////////////

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


    this.ColumnArray = JSON.parse(data.column)[0].Users.Columns;


    this.grid.columns.forEach(col => {
      this.arraycol[0].Users.HideColumns.forEach(element => {


        if (col.headerText == element) {
          col.visible = false;
        }

      });
    });

    //  this.grid.refreshColumns();

    let showcol = JSON.parse(data.column)[0].Users.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Users.HideColumns
    this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Users.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Name') {

        const column = this.grid.getColumnByField('name'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'User Role') {

        const column1 = this.grid.getColumnByField('userRole'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'User Status') {

        const column2 = this.grid.getColumnByField('statusLname'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Phone') {

        const column3 = this.grid.getColumnByField('phone1'); // get the JSON object of the column corresponding to the field name
        column3.headerText = element.column;
        column3.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Email') {

        const column4 = this.grid.getColumnByField('email'); // get the JSON object of the column corresponding to the field name
        column4.headerText = element.column;
        column4.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column5 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
        column5.headerText = element.column;
        column5.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });

}
SaveColumnwidth() {
 
  this.arraycol[0].Users.Columns = this.ColumnArray;
  this.arraycol[0].Users.Pagesize = this.grid.pageSettings.pageSize;
  this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
  this.columnchange.userid = parseInt(this.global.userID);
  this.columnchange.column = JSON.stringify(this.arraycol);
  this.columnchange.id = this.id;
  this.httpService.savecolumwidth(this.columnchange).subscribe((data: any) => {


    this.getColumnwidth();

    //this.getColumnwidth();


  });
}
}
