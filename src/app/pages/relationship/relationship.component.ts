import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { GlobalComponent } from '../../global/global.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterSettingsModel, IFilter, GridComponent, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { relationship, EmployeeClientRelationship, GetClientEvaluation } from './relationship.model'
import { element } from 'protractor';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnChangeBO, columnWidth } from '../icd10/icd10.model';
import { Observable } from 'rxjs';
import { RelationshipDataService } from './relationshipdata.service';
import { RelationshipService } from './relationship.service';
@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss'],
 // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelationshipComponent implements OnInit {
  @Input() ClientEmployeeRelation: relationship;
  //////////////////////////////////Table Intialize variable//////////////////////////////////////////////////////////////////////
  filterOptions: FilterSettingsModel;
  initialPage: object;
  @ViewChild('grid') public grid: GridComponent;
  filter: IFilter;
  newstatusLst: [{ Key: number, Value: string }]
  ////////////////////////////////////dropdown value/////////////////////////////////////////////////////////////////////////////
  clientDropdown: [{ Key: string, Value: string }]
  StatusLst: [{ Key: number, Value: string }]
  EmployeeDropdown: [{ Key: string, Value: string }]
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  relationFilter: number
  employeeRelationshipLst: any;
  relation: any = new EmployeeClientRelationship();

  ColumnArray: columnWidth[]
  columnchange: ColumnChangeBO = new ColumnChangeBO();
  id: number = 0;
  arraycol: any = [];
  getRelation:GetClientEvaluation= new GetClientEvaluation();
  public pageSizes: number[] = [10, 15, 20,50,100,250];
  public data: Observable<DataStateChangeEventArgs>;
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(public global: GlobalComponent, public relationshipService: RelationshipService, public toastrService: ToastrService, private ref: ChangeDetectorRef,
     @Inject(RelationshipDataService) public RelationshipService: RelationshipDataService) {

      this.data = RelationshipService;
    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
   }

  ngOnInit(): void {
    this.filterOptions = { type: 'Menu' };
    this.filter = {
      type: 'Menu'
    };

    this.initialPage = { pageSizes: ['10', '20', '50','100','200','250'], pageSize: 10 }
    console.log(this.ClientEmployeeRelation);
    if (this.ClientEmployeeRelation.RelationType == "Employee") {

      this.getClient();
    //  this.getEmployeeRelationship();
    }
    else {
      this.getEmployee();
      //this.getClientRelationship();
    }
    this.getEmployeeStatus();
    // this.getColumnwidth();
  }
  ngOnchange() {

    // this.getColumnwidth();
  }
  /////////////////////////get Client/////////////////////////////////////////////////////////////////////////////
  getClient() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.relationshipService.getclient(params).subscribe((data: any) => {

      data.forEach(element => { element.Key = element.Key.toString() })

      this.clientDropdown = data
      // this.getColumnwidth();

    })
  }
  /////////////////////////get Employee/////////////////////////////////////////////////////////////////////////////
  getEmployee() {
    let params = new URLSearchParams();
    params.append("agencyId", this.global.globalAgencyId);
    this.relationshipService.getEmployee(params).subscribe((data: any) => {
      console.log(data)
      data.forEach(element => { element.Key = element.Key.toString() })

      this.EmployeeDropdown = data
      console.log(this.EmployeeDropdown)
      // this.getColumnwidth();
    })
  }
  ////////////////////////////////////get employee status////////////////////////////////////////////////////////////
  getEmployeeStatus() {
    let params = new URLSearchParams();
    params.append("Code", "STATUS");
    params.append("agencyId", this.global.globalAgencyId);
    params.append("userId", this.global.userID);
    let url = "api/LOV/getLovDropDown?"
    this.relationshipService.getStatus(params).subscribe((data: [{ Key: number, Value: string }]) => {
      this.newstatusLst = JSON.parse(JSON.stringify(data))
      this.StatusLst = data;
      this.StatusLst.push({ Key: 0, Value: "All" });
      
        this.relation.statusLid = this.StatusLst.filter(st => st.Value == "Active")[0].Key;
      

      this.relationFilter = this.StatusLst.filter(st => st.Value == "Active")[0].Key;
      if (this.ClientEmployeeRelation.RelationType == "Employee") {
        this.getEmployeeRelationship();
      }
      else {
        this.getClientRelationship()
      }

    })

  }
  ////////////////////////////////get Employee Relationship///////////////////////////////////////////////////////////
  getEmployeeRelationship() {
    
    console.log("Employee");
    let myparams = new URLSearchParams();
    myparams.append("EmployeeID", this.ClientEmployeeRelation.Id.toString());
    myparams.append("relationshipFilter", this.relationFilter.toString()); 
     this.getRelation.clientId = this.global.clientId;
     this.getRelation.employeeID = this.ClientEmployeeRelation.Id;
     this.getRelation.relationshipFilter =  parseInt(this.relationFilter.toString());
    // params.append("Pageitem", perpage.toString());
    // params.append("Currentpageno", p.toString());
    // params.append("clientId", this.global.clientId.toString());

    this.RelationshipService.execute( this.getRelation)
    let count=0;
    this.data.subscribe((data:any) => {
      count=count+1
      if(data!=null&& data!=undefined && count==1)
      {
        this.getColumnwidth();
      }
      this.employeeRelationshipLst = data.result;
      this.employeeRelationshipLst.forEach((element, index) => {
        element.sNo = index + 1
      });

    })
  }
  ////////////////////////////////get Employee Relationship///////////////////////////////////////////////////////////
  getClientRelationship() {
    console.log("Client");
    
    // let myparams = new URLSearchParams();
    // myparams.append("clientId", this.ClientEmployeeRelation.Id.toString());
    // myparams.append("relationshipFilter", this.relationFilter.toString());
    // myparams.append("agency", this.global.globalAgencyId.toString());
    this.getRelation.clientId = this.global.clientId;
     this.getRelation.employeeID = this.ClientEmployeeRelation.Id;
     this.getRelation.relationshipFilter =  parseInt(this.relationFilter.toString());
     this.getRelation.agency =  parseInt(this.global.globalAgencyId);
   
    this.RelationshipService.executeClient( this.getRelation)
    let count=0
    this.data.subscribe((data:any) => {
      count=count+1
      if(data!=null&& data!=undefined && count==1)
      {
        this.getColumnwidth();
      }

    // this.relationshipService.getClientRelationshipData(myparams).subscribe((data: EmployeeClientRelationship[]) => {
      this.employeeRelationshipLst = data.result;
      this.employeeRelationshipLst.forEach((element, index) => {
        element.sNo = index + 1
      });

    })
  }
  ///////////////////////edit data///////////////////////////////////////////////////////////////////////////////////
  editRelationship(data) {
    console.log(data)
    this.relation = this.employeeRelationshipLst.filter(e => e.id == data.id)[0];
    this.relation.employeeId = this.relation.employeeId.toString()
    this.relation.clientId = this.relation.clientId.toString()
    document.getElementById("openmodal").click();
  }
  //////////////////// close add and edit Modal///////////////////////////////////////////////////////////////////
  closefunc() {
    document.getElementById("openmodal").click()
    this.relation = new EmployeeClientRelationship();
    if (this.ClientEmployeeRelation.RelationType == "Employee") {
      this.getEmployeeRelationship();
    }
    else {
      this.getClientRelationship()
    }

    this.relation.statusLid = this.relation.statusLid = this.StatusLst.filter(st => st.Value == "Active")[0].Key;
  }
  create() {
    document.getElementById("openmodal").click();
    this.relation = new EmployeeClientRelationship();
    this.relation.id = 0;
    if (this.relation.id == 0) {
      this.relation.statusLid = this.StatusLst.filter(st => st.Value == "Active")[0].Key;
    }
  }
  saveRelation(savedata) {

    let save = JSON.parse(JSON.stringify(savedata))

    save.statusLid = save.statusLid != null ? parseInt(save.statusLid.toString()) : null;
    if (this.ClientEmployeeRelation.RelationType == "Employee") {
      save.clientId = save.clientId != null ? parseInt(save.clientId.toString()) : null;
      save.employeeId = this.ClientEmployeeRelation.Id;
    }
    else {
      save.clientId = this.ClientEmployeeRelation.Id
      save.employeeId = save.employeeId != null ? parseInt(save.employeeId.toString()) : null;
    }

    if (this.relation.id == 0) {
      save.id = 0
    }
    else {
      save.id = save.id
    }




    this.relationshipService.saveRelationship(save).subscribe((data: any) => {

      save.id = data;
      save.sNo = this.employeeRelationshipLst.length + 1;
      this.employeeRelationshipLst.push(save);
      this.toastrService.success(
        'Relationship has been mapped successfully!',
        'Relationship  Mapping')
      document.getElementById("openmodal").click();
      if (this.ClientEmployeeRelation.RelationType == "Employee") {
        this.getEmployeeRelationship();
      } else {
        this.getClientRelationship();
      }
      this.relation = new EmployeeClientRelationship();
      this.relation.statusLid = this.relation.statusLid = this.StatusLst.filter(st => st.Value == "Active")[0].Key;
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error(
          err.error,
          'Error')
      }
    );



  }
  changevalue() {
    if (this.ClientEmployeeRelation.RelationType == "Employee") {
      this.getEmployeeRelationship();
    }
    else {
      this.getClientRelationship()
    }
  }
  closemodel()
  {
    document.getElementById("openmodal").click();
  }


   // ==============================================================================

   getColumnwidth() {
    this.relationshipService.getcolumwidth().subscribe((data: any) => {
   
      this.arraycol = JSON.parse(data.column);

      this.ColumnArray = JSON.parse(data.column)[0].ClientEmployeeRelationship.Columns;


     
console.log(this.ColumnArray ,"this.ColumnArray ===========");

      if (data.userid != null && data.agencyId != null) {
        this.id = data.id;
      }

      // this.grid.pageSettings.pageSize = JSON.parse(data.column)[0].ClientEmployeeRelationship.Pagesize

      this.ColumnArray.forEach(element => {



        if (element.column == 'S.No.') {

          const column = this.grid.getColumnByField('sNo'); // get the JSON object of the column corresponding to the field name
          // column.headerText = element.column;
          column.width = element.width;

          this.grid.refreshHeader();
          //this.grid.refreshColumns();
        }
        if (element.column == 'Client' && this.ClientEmployeeRelation.RelationType=='Employee') {

          const column1 = this.grid.getColumnByField('clientName'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;

          this.grid.refreshHeader();
        }
        if (element.column == 'Employee' && this.ClientEmployeeRelation.RelationType=='Client') {

          const column1 = this.grid.getColumnByField('employeeName'); // get the JSON object of the column corresponding to the field name

          column1.width = element.width;
console.log(column1,"column refresh");

          this.grid.refreshHeader();
        }
    
        else if (element.column == 'Actions') {

          const column2 = this.grid.getColumnByUid('action'); // get the JSON object of the column corresponding to the field name
          // column2.headerText = element.column;
          column2.width = element.width;
          this.grid.refreshHeader();

        }
        // this.grid.refreshHeader();
      });


    });

  }
  SaveColumnwidth() {
    this.arraycol[0].ClientEmployeeRelationship.Columns = this.ColumnArray;
    this.arraycol[0].ClientEmployeeRelationship.Pagesize = this.grid.pageSettings.pageSize;
    this.columnchange.agencyId = parseInt(this.global.globalAgencyId);
    this.columnchange.userid = parseInt(this.global.userID);
    this.columnchange.column = JSON.stringify(this.arraycol);
    this.columnchange.id = this.id;
    this.relationshipService.savecolumwidth(this.columnchange).subscribe((data: any) => {
      console.log("get column in save")
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
    console.log("change column  size save")
    this.SaveColumnwidth();
  }


  
public dataStateChange(state): void {
  console.log("Stats chage",state);    
  let val = (state.action.requestType).toString();
  if (val != "filterchoicerequest") {
    if ((state.sorted || []).length) {
      if(this.ClientEmployeeRelation.RelationType =="Employee")
      {
        this.getRelation.orderColumn = "EmployeeName";
      }
      else{
        this.getRelation.orderColumn = "ClientName";
      }
     
      // this.getRelation.orderColumn = "ClientName";
      this.getRelation.orderType = 'asc';
      console.log(this.getRelation,"Evaluation=====");
      
    }
  }
  if (this.getRelation.type == "date") {
    //console.log(state.action.currentFilterObject.value)
    this.getRelation.value = new Date(new Date(state.action.currentFilterObject.value).toLocaleDateString() + " " + "00:00:00" + " " + "GMT").toISOString();
    this.getRelation.field = state.action.currentFilterObject.field;
  }
  else {
    this.getRelation.value = state.action.currentFilterObject.value;
    this.getRelation.field = state.action.currentFilterObject.field;
  }
  // if (state.action.currentFilterObject.field == "listName") {

  //   this.getClientNotes.value = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key.toString()
  //   this.getClientNotes.field = "statusLid";
  //   this.getClientNotes.statusLid = this.EmployeestatusList.filter(e => e.Value == state.action.currentFilterObject.value)[0].Key
  //   this.getClientNotes.type = "number";
  // }
  if (val == "filtering" && state.action.action != "clearFilter") {
    this.getRelation.field = state.action.currentFilterObject.field;
    this.getRelation.matchCase = state.action.currentFilterObject.matchCase;
    this.getRelation.operator = state.action.currentFilterObject.operator;
    this.getRelation.value = state.action.currentFilterObject.value;
  }
  else {
    if (val == "filtering" && state.action.action == "clearFilter") {
      if(this.ClientEmployeeRelation.RelationType =="Employee")
      {
        this.getRelation.field = "EmployeeName";
      }
      else{
        this.getRelation.field = "ClientName";
      }
     
      this.getRelation.matchCase = false;
      this.getRelation.operator = "contains";
      this.getRelation.value = "";
      this.getRelation.type = "string"
      this.getRelation.clientId = this.global.clientId;
    }
  }
  if (val == "paging" && state.action.name == "actionBegin") {
    // if (this.grid.pagerModule.pagerObj.pageSize != this.arraycol[0].Client.Pagesize) {
      if( this.arraycol.length!=0)
      {
        if(this.arraycol[0].ClientEmployeeRelationship.Pagesize!=state.take)
        {
          this.arraycol[0].ClientEmployeeRelationship.Pagesize = state.take
             console.log( "save page size")
          this.SaveColumnwidth();
        // }

      }
    
    }

  }
  if (this.ClientEmployeeRelation.RelationType == "Employee") {
    this.getEmployeeRelationship();
  }
  else {
    this.getClientRelationship()
  }
}


public onActionComplete(args) {

  console.log(args, "args");

  


  this.getRelation.currentpageno = this.grid.pagerModule.pagerObj.currentPage;
  this.getRelation.pageitem = this.grid.pagerModule.pagerObj.pageSize;
  // this.conditionlist = [];
  if (args.requestType === "filtering" && args.action === "filter") {
    this.getRelation.type = args.columnType
    args.columns.forEach(element => {
      // this.conditionlist.push(element.properties);
    });
  }

}



}
