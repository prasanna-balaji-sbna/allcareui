export class ServiceList {
    id: number;
    masterServiceCode: string;
    masterServiceModifier1: string;
    masterServiceModifier2: string;
    masterServiceModifier3: string;
    masterServiceModifier4: string;
    masterServiceName: string;
    serviceDescription: string;
    statusLid: number;
    billingLid: number | null;
    billingLidNmae: string;
    ratio: number;
    agencyId: number | null;
  }

export class ActivityList {
    id: number;
    masterActivityCode: string;
    masterActivityName: string;
    statusLid: number;
    agencyId: number | null;
  }

  export class ServiceActivityList {
    id: number;
    masterActivityCode: string;
    masterServiceId: string;
    masterServiceName: string | null;
    agencyId: number | null;
  }

  export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "MasterServiceName" ;
    shortType : string = 'asc';
}

export class DropList {
  label: string;
  value: string;
}

export class functionpermission {
  servicecreate: boolean = true;
  serviceupdate: boolean = true;
  servicedelete: boolean = true;
  activitycreate: boolean = true;
  activityupdate: boolean = true;
  activitydelete: boolean = true;
  masterserviceactivitycreate: boolean = true;
  masterserviceactivityupdate: boolean = true;
  //masterserviceactivitydelete:boolean=true;
}

export class WhereCondition {
  field: string="MasterServiceName";
  value: string="";
  operator: string="startswith";
  orderNo: number=1;
  predicate: string="and";
  type: string="string";
  matchCase:boolean=false;
}
export class GetMSListBo {
  SearchColumn: string = "MasterServiceName";
  SearchText: string = "";
  orderColumn: string = "MasterServiceName";
  orderType: string= "asc";
  pageitem: number = 10;
  currentpageno: number = 1;
  userId: number = 0;
  field: string = "MasterServiceName";
  value: string = "";
  matchCase: boolean = false;
  operator: string = "startswith";
  agencyId: number = 0;
  LovCode: number = 0;
  type:string="string";
}
export class GetMAListBo {
  SearchColumn: string = "MasterActivityName";
  SearchText: string = "";
  orderColumn: string = "MasterActivityName";
  orderType: string= "asc";
  pageitem: number = 10;
  currentpageno: number = 1;
  userId: number = 0;
  field: string = "MasterActivityName";
  value: string = "";
  matchCase: boolean = false;
  operator: string = "startswith";
  agencyId: number = 0;
  LovCode: number = 0;
  type:string="string";
}
export class GetMSAListBo {
  SearchColumn: string = "MasterServiceName";
  SearchText: string = "";
  orderColumn: string = "MasterServiceName";
  orderType: string= "asc";
  pageitem: number = 10;
  currentpageno: number = 1;
  userId: number = 0;
  field: string = "MasterServiceName";
  value: string = "";
  matchCase: boolean = false;
  operator: string = "startswith";
  agencyId: number = 0;
  LovCode: number = 0;
  type:string="string";
}
export class columnWidth {
  column: string = "";
  width: number = 0;
}

export class ColumnChangeBO {
  id: number=0;
  userid: number=0;
  agencyId: number=0;
  column: string;
}