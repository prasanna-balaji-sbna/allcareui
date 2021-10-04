export class LovBO {
    id: number;
    lovCode: string;
    lovName: string;
    lovValue: string;
    listId: number;
    orderby: number;
    agencyId: number | null;
}
export class lovReturnBO {
    lovId: number;
    error: string;
}
export class lovDropdown {
    label: string;
    value: string;
}
export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "lovCode" ;
    shortType : string = 'asc';
    column:string="lovCode";
    text:string=""
}
export class WhereCondition {
    field: string="lovCode";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetListBO {
    orderColumn: string = "lovCode";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    listId: number;
    field: string = "lovCode";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyID: number;
    type:string="string";

}
export class functionpermission {
    lovcreate: boolean = true;
    lovdelete: boolean = true;
    lovupdate: boolean = true;
  
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

