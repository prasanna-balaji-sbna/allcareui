export class MenuList {
    id: number;
    sideMenuItemsId: number;
    functionCode: string;
    functionName: string;
    menuName: string;
    orderNumber: number;
    isEvv:boolean=false;
  }
  export class SideMenuItemsBO {
    id: number;
    title: string;
    icon: string;
    link: string;
    menuCode: string;
    parentMenuItemId: number | null;
    orderNumber: number;
    isFunctionRequired: boolean;
    isEvv:boolean=false;
  }

  export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "CareCoordinatorName" ;
    shortType : string = 'asc';
}
export class WhereCondition {
  field: string="Title";
  value: string="";
  operator: string="startswith";
  orderNo: number=1;
  predicate: string="and";
  type: string="string";
  matchCase:boolean=false;
}

export class GetSMListBo {
  ParentMenuID: number = null;
  MenuID: number = null;
  SearchColumn: string = "Title";
  SearchText: string = "";
  orderColumn: string = "Title";
  orderType: string= "asc";
  pageitem: number = 10;
  currentpageno: number = 1;
  userId: number = 0;
  field: string = "Title";
  value: string = "";
  matchCase: boolean = false;
  operator: string = "startswith";
  agencyId: number = 0;
  LovCode: number = 0;
  isEvv:boolean=false;
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