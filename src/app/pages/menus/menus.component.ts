import { Component, OnInit,ViewChild, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { GlobalComponent } from "../../global/global.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { DropDownList } from '@syncfusion/ej2-angular-dropdowns';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-grids';
import { MenuList,SideMenuItemsBO,sortingObj, GetSMListBo, WhereCondition, columnWidth, ColumnChangeBO } from './menus.model';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { KeyValue } from '@angular/common';
import { MenuHttpService } from './menus.service';
import { GetHTTPService } from './menu-table.service';
import { GetFuncHTTPService } from './function-table.service';
import { DataUtil } from '@syncfusion/ej2-data';
import { DataManager } from '@syncfusion/ej2-data';
//import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Tooltip } from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-menu',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {



  // =============Main Initialization=========================== //

  MenuArray: SideMenuItemsBO[];
  LfunctionMenuList: MenuList[];
  FunctionArray: MenuList = new MenuList();
  Menus: SideMenuItemsBO = new SideMenuItemsBO();
  MenuListDropDown = [];
  filter_data_ParentMenu = [];
  filter_data_SubMenu = [];
  LMenuList = [];
  SMsendBO:GetSMListBo = new GetSMListBo();
  conditionlist:WhereCondition[]=[];
  conditionData:WhereCondition=new WhereCondition();

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];

  // ==============Form Initialization===================== //
  MenuForm: FormGroup;
  FunctionForm: FormGroup;
  /////////////===================Filters ==========//
  filterSelect: string = '';
  Gridtype: string ='parent';
  ///////////////-===================Table initializations==========// 
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
  public pageSizes: number[] = [10,15,20,50,100,250];
  //============================Data manager===============================//
  public isinitialLoad: boolean = false; 
  // ===================================Other initialization===================//
  //======================================new try====================//
  public data: Observable<DataStateChangeEventArgs>;
  public data1: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs;
  ////////////////========Functionlity initializations==========//    
  MenuId: number;
  ModelType: string = 'edit';
  FunctionModelType: string = 'edit';
  menuTitle: string;
  functionMenu: string;
  valuechange :any=[];

  constructor(public http: HttpClient, private formBuilder: FormBuilder,@Inject(GetHTTPService) public gethttp:GetHTTPService,
    public global: GlobalComponent, public httpService: MenuHttpService,@Inject(GetFuncHTTPService) public getfhttp:GetFuncHTTPService,
    public toastrService: ToastrService, public general: generalservice,private ref: ChangeDetectorRef) { 

      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
      this.data=gethttp;
      this.data1=getfhttp;
      this.MenuForm = this.formBuilder.group({
        title: [' ', Validators.required],
        icon: [''],
        link: [''],
        menuCode: ['',Validators.required],
        ordernumber: ['',Validators.required],
        isFunctionRequired:['']
        
      });
      this.FunctionForm = this.formBuilder.group({
        functionName: [' ', Validators.required],   
        functionCode: ['',Validators.required],
        functionorderNumber: ['',Validators.required]
      
        
      });
     }
     type:string="";
    public dataStateChange(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.SMsendBO.orderColumn = state.sorted[0].name;
        this.SMsendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.SMsendBO.field=state.action.currentFilterObject.field;
        this.SMsendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.SMsendBO.operator=state.action.currentFilterObject.operator;
        this.SMsendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.SMsendBO.field="title";
        this.SMsendBO.matchCase=false;
        this.SMsendBO.operator="startswith";
        this.SMsendBO.value="";
      }
    }

    if (this.type == "paging" && state.action.name == "actionBegin") {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].Menus.Pagesize!=state.take)
        {
          this.arraycol[0].Menus.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }
  
      }
    
    }
    }
    if( this.filterSelect == '' ){
    this.getmenu();
    } else {
      this.getsubmenu();
    }


  }
    public dataStateChange1(state): void {
    console.log("Stats chage",state);    
    this.type = (state.action.requestType).toString();
    if(this.type!="filterchoicerequest"){
      if ((state.sorted || []).length) {
        this.SMsendBO.orderColumn = state.sorted[0].name;
        this.SMsendBO.orderType = state.sorted[0].direction=== 'descending' ? 'DESC':'ASC';
      }   
     }
    if(this.type == "filtering" && state.action.action!="clearFilter"){
        this.SMsendBO.field=state.action.currentFilterObject.field;
        this.SMsendBO.matchCase=state.action.currentFilterObject.matchCase;
        this.SMsendBO.operator=state.action.currentFilterObject.operator;
        this.SMsendBO.value=state.action.currentFilterObject.value;
    }
    else{
      if(this.type == "filtering" && state.action.action=="clearFilter"){
        this.SMsendBO.field="functionCode";
        this.SMsendBO.matchCase=false;
        this.SMsendBO.operator="startswith";
        this.SMsendBO.value="";
      }
    }
    this.getfunctionMenuList();


  }

  ngOnInit(): void {
    this.conditionlist.push(new WhereCondition());
    this.toolbar = ['ColumnChooser'];
    this.MenuForm.reset();
    this.getmenu();
    this.filterOptions = { type: 'Menu' };
    this.initialPage = {currentPage:1, totalRecordsCount:0,pageCount: 10, pageSize: this.pageSizes[0], pageSizes: this.pageSizes }; 
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

        this.arraycol[0].Menus.ShowColumns.forEach(old => {
          showarr.forEach(element => {
            if (old == element) {
              count1 = count1 + 1;
            }
          });

        });

        this.arraycol[0].Menus.HideColumns.forEach(old => {
          hidearr.forEach(element => {
            if (old == element) {
              count = count + 1;
            }
          });

        });
        console.log(count, count1, "count");


        if (this.arraycol[0].Menus.ShowColumns.length != count1 || this.arraycol[0].Menus.HideColumns.length != count) {
          this.arraycol[0].Menus.ShowColumns = showarr;
          this.arraycol[0].Menus.HideColumns = hidearr;
          this.SaveColumnwidth();
        }
      }
    }

    this.SMsendBO.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
    this.SMsendBO.pageitem= this.grid.pagerModule.pagerObj.pageSize;
    // if(this.filterSelect == ''){
    //   this.Gridtype = 'parent';
    // } else {
    //   this.Gridtype = 'child';
    // }
    this.conditionlist=[];
    if(args.requestType==="filtering" && args.action==="filter"){
      args.columns.forEach(element => {
        this.conditionlist.push(element.properties);
        console.log("args type",this.conditionlist);
      }); 
    } 
    
  } 
  // =======================Grid Column selector ================ //
  show() {
    this.grid.columnChooserModule.openColumnChooser();
  }
// =========Refresh======================= //
  Refresh() {
    this.filterSelect = '';
    this.getmenu();
  }
// ================Filter options====================== //n

  filter_select(value) {
    console.log("value",value);
    if(value!=""){
      this.Gridtype = 'child';
      value=parseInt(value);
      this.SMsendBO.ParentMenuID = value;
      this.getsubmenu();
    console.log(" this.gethttp.",this.data);
      // this.httpService.GetSubMenuList(value).subscribe((data: SideMenuItemsBO[]) => {
      //   console.log("data==",data);
      //   this.MenuArray = data;
      //   this.LMenuList = [];
      //   this.LMenuList = data;
      //   this.filter_data_SubMenu = [];
      //   this.filter_data_SubMenu = JSON.parse(JSON.stringify(data));
      //   console.log("this.MenuArray==",this.MenuArray);
      // })
      console.log("filter_data_SubMenu==",this.filter_data_SubMenu);
    } else{
      this.Refresh();
    }
  }

  getsubmenu(){
    this.gethttp.execute(this.SMsendBO,'child');
  }
// ===========Menu operatoins============================ //
  getmenu() {
    this.SMsendBO.field="title";
    this.SMsendBO.orderColumn="title";
    this.SMsendBO.ParentMenuID = null;
    this.gethttp.execute(this.SMsendBO,'parent');
    console.log(" this.gethttp.",this.data);
    // this.httpService.GetMenuList().subscribe((data: SideMenuItemsBO[]) => {
    //   this.MenuArray = data;
    let count=0;
    this.data.subscribe((data:any)=>{
      count=count+1
      if(data!=null&& data!=undefined && count==1)
    {
      this.getColumnwidth();
    }
     this.MenuListDropDown = this.gethttp.getdropdata();
    //  this.MenuListDropDown = this.MenuListDropDown.filter(md=>md.parentMenuItemId==null && md.isFunctionRequired==false);
     this.filter_data_ParentMenu = this.gethttp.setfiltervalue();
    })
    //  this.filter_data_ParentMenu = JSON.parse(JSON.stringify(data));
    // })
    // console.log("MenuArray===",this.MenuArray);
    console.log("Menu List drop=",this.MenuListDropDown);
    console.log("filter_data_ParentMenu",this.filter_data_ParentMenu);
  }

  OpenCreateupdate(type: string) {
    if(this.filterSelect!=''){
      this.menuTitle=this.MenuListDropDown.filter(m=>m.id==parseInt(this.filterSelect))[0].title;
      console.log("menuTitle",this.MenuListDropDown.filter(m=>m.id==parseInt(this.filterSelect))[0])
    }
    if (type == 'new') {
      this.ModelType = 'new';
      this.MenuForm.reset();
      this.Menus = new SideMenuItemsBO();
      this.valueschanges();
    } else {
      this.valueschanges();
      this.ModelType = 'edit';
    }
  }

  selectMenuList(MenuDetails: SideMenuItemsBO) {
    this.Menus = JSON.parse(JSON.stringify(MenuDetails));
  }

  SaveOrUpdateMenu() {
    var saveList:SideMenuItemsBO = JSON.parse(JSON.stringify(this.Menus));
    saveList.parentMenuItemId=this.filterSelect!=''?parseInt(this.filterSelect):null;
    saveList.orderNumber=Math.floor(Number(this.Menus.orderNumber));
    saveList.isEvv=this.SMsendBO.isEvv;
    // saveList.agencyId = parseInt(this.global.globalAgencyId);
    console.log("Savelist===",saveList);
    this.httpService.saveupdate(saveList).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.toastrService.success('Menu Saved successfully', 'Menu Saved'),8000;
          // saveList.id = data;
          // this.MenuArray.push(saveList);
          document.getElementById('modal').click();
        } else {
          this.toastrService.success('Menu Updated successfully', 'Menu Updated'),8000;
          document.getElementById('modal').click();
        }
        this.getmenu();
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })    
  }



  // ========Functionality Operations=================//
  functionalityCreateUpdate(type: string) {
    if(this.filterSelect!=''){
      this.menuTitle=this.MenuListDropDown.filter(m=>m.id==parseInt(this.filterSelect))[0].title;
      console.log("menuTitle",this.MenuListDropDown.filter(m=>m.id==parseInt(this.filterSelect))[0])
    }
    if (type == 'new') {
    this.FunctionForm.reset();
    this.FunctionModelType = 'new';
    this.FunctionArray = new MenuList();
    this.valueschanges();
    } else {
      this.FunctionModelType = 'edit';
      this.valueschanges();
    }
  }

  selectMenuId(MyMenu: SideMenuItemsBO) {
    this.MenuId = MyMenu.id;
    this.getfunctionMenuList();
    if( this.MenuId!=0 && this.filterSelect ==''){
      console.log("Imin parent", this.MenuId=MyMenu.id);

      // console.log("o data",this.filter_data_ParentMenu.filter(m=>m.id==parseInt(this.MenuId))[0]);
        // this.menuTitle=this.filter_data_ParentMenu.filter(m=>m.id==parseInt(this.MenuId))[0].title;

      console.log("o data",this.filter_data_ParentMenu.filter(m=>m.id==this.MenuId)[0]);
        this.menuTitle=this.filter_data_ParentMenu.filter(m=>m.id==this.MenuId)[0].title;

        console.log("this.menutitle",this.menuTitle);
        
    }
    if( this.MenuId!=0 && this.filterSelect !=''){
      console.log("Imin sub", this.MenuId=MyMenu.id);

      // this.functionMenu=this.filter_data_SubMenu.filter(m=>m.id==parseInt(this.MenuId))[0].title;

      this.functionMenu=this.filter_data_SubMenu.filter(m=>m.id==this.MenuId)[0].title;

      console.log("this.functionMenu",this.functionMenu);
    }
  }
  selectFunctionList(Fdetails: MenuList) {
    console.log("Fdetails====",Fdetails)
    this.FunctionArray = Fdetails;
    console.log("this.FunctionArray",this.FunctionArray);
  }

  getfunctionMenuList(){
    this.SMsendBO.field="functionCode";
    this.SMsendBO.orderColumn="functionCode";
    // this.SMsendBO.field="functionCode";
    this.SMsendBO.MenuID = this.MenuId;
    this.getfhttp.execute(this.SMsendBO);
    console.log(" this.gethttp.",this.data1);
    // this.LfunctionMenuList = new MenuList();
  //   console.log("Menu ID==", this.MenuId);
  //   this.httpService.getfunctionMenuList(this.MenuId).subscribe((data: MenuList[]) => {
  //     console.log("data==",data);
  //     this.LfunctionMenuList = data;
  //  })
  //  console.log("this.LfunctionMenuList==",this.LfunctionMenuList);
  }

  SaveOrUpdateFunction() {
    console.log("order number==",this.FunctionArray.orderNumber);
    this.FunctionArray.sideMenuItemsId = this.MenuId;


    this.httpService.saveupdateFunction(this.FunctionArray).subscribe((data: number) => {
      console.log("====save update=========", data);
      if (data) {
        //====================== sucess message =============
        if (this.ModelType == 'new') {
          this.FunctionArray.id = data;
          this.LfunctionMenuList.push(this.FunctionArray);
          document.getElementById('Functionmodal').click();
          this.toastrService.success('Functionality Saved successfully', 'Functionality Saved'),8000;
        }else {
          document.getElementById('Functionmodal').click();
          this.toastrService.success('Functionality Updated successfully', 'Functionality Updated'),8000;
        }
        this.getfunctionMenuList();
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }

  // ==========Closing alert functionality========================= //

 valueschanges() {
   this.valuechange = {
    title: 0,
    icon: 0,
    link: 0,
    menuCode:0,
    ordernumber:0,
    isFunctionRequired:0,
   }
 }

 checkpopup(value) {
   if (value == "title") {
     this.valuechange.title++;
   }
   if (value == "icon") {
     this.valuechange.icon++;
   }
   if (value == "link") {
    this.valuechange.link++;
  }
  if (value == "menuCode") {
    this.valuechange.menuCode++;
  } if (value == "ordernumber") {
    this.valuechange.ordernumber++;
  }
  if (value == "isFunctionRequired") {
    this.valuechange.isFunctionRequired++;
  }
 }

 OnCancelClick() {
  if (this.valuechange.title > 1 || this.valuechange.icon > 1 || this.valuechange.link > 1
    || this.valuechange.menuCode > 1|| this.valuechange.ordernumber > 1|| this.valuechange.isFunctionRequired > 1) {
    //  this.dialogService.open(closecar);
    document.getElementById("cancelmodal").click();
   }
   else {
    document.getElementById("openModal").click();
   }
 }

 closeAddUpdateModal() {
  document.getElementById("openModal").click();
  document.getElementById("cancelmodal").click();
 }
 switchchange()
 {
  this.getmenu()
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
  console.log("menu log",args.data[args.column.field]);
  
 if(args.data[args.column.field]!=null)
 {
   const tooltip: Tooltip = new Tooltip({
     content: args.data[args.column.field].toString()
 }, args.cell as HTMLTableCellElement);
 }
}

getColumnwidth() {
  this.httpService.getcolumwidth().subscribe((data: any) => {
    this.arraycol = JSON.parse(data.column);


    this.ColumnArray = JSON.parse(data.column)[0].Menus.Columns;

   
    let showcol = JSON.parse(data.column)[0].Menus.ShowColumns;
    let hidecol = JSON.parse(data.column)[0].Menus.HideColumns
  
    this.grid.hideColumns(hidecol);
    if (data.userid != null && data.agencyId != null) {
      this.id = data.id;
    }

    this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].Menus.Pagesize

    this.ColumnArray.forEach(element => {



      if (element.column == 'Title') {

        const column = this.grid.getColumnByField('title'); // get the JSON object of the column corresponding to the field name
        column.headerText = element.column;
        column.width = element.width;

        this.grid.refreshHeader();
        //this.grid.refreshColumns();
      }
      if (element.column == 'Icon') {

        const column1 = this.grid.getColumnByField('icon'); // get the JSON object of the column corresponding to the field name
        column1.headerText = element.column;
        column1.width = element.width;

        this.grid.refreshHeader();
      }
      if (element.column == 'Link') {

        const column2 = this.grid.getColumnByField('link'); // get the JSON object of the column corresponding to the field name
        column2.headerText = element.column;
        column2.width = element.width;

        this.grid.refreshHeader();
      }
      else if (element.column == 'Actions') {

        const column3 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
       // column3.headerText = element.column;
       // column3.width = element.width;
        this.grid.refreshHeader();

      }
    });


  });
   
}
SaveColumnwidth() {
  this.arraycol[0].Menus.Columns = this.ColumnArray;
  this.arraycol[0].Menus.Pagesize = this.grid.pageSettings.pageSize;
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
