export class UserList {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    statusLid: number;
    phone1: string;
    phone2: string;
    agencyId: number;
    username: string;
    password: string;
    roleName: string[];
    statusLname: string;
    userRole: string;
    userRoleId: string;
    isBlocked: boolean;
  }

  export class DropList {
    label: string;
    value: string;
  }
  
  export class DropList1 {
    value: string;
    key: number;
  }

  export class sortingObj{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "Fname" ;
    shortType : string = 'asc';
  }

export class functionpermission {
    userscreate: boolean = true;
    usersupdate: boolean = true;
  }

  export class WhereCondition {
    field: string="Fname";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
  }
  export class GetUserListBo {
    orderColumn: string = "Fname";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "Fname";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyId: number = 0;
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