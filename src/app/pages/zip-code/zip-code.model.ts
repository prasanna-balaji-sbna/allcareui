export class zipcodeDetailList {
    id: number;
    agencyId: number | null;
    county: string;
    state: string;
    city: string;
    zipcode: string;
}

 export class searchfilterDetails {
    Filter_City: string;
    Filter_State: string;
    Filter_Zipcode: string;
}

export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "ZipCode" ;
    shortType : string = 'asc';
}

export class functionpermission 
{
  zipcodescreate:boolean=true;
  zipcodesdelete:boolean=true;
  zipcodesupdate:boolean=true;

}

export class WhereCondition {
    field: string="ZipCode";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetCareListBo {
    SearchColumn: string = "ZipCode";
    SearchText: string = "";
    orderColumn: string = "ZipCode";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "ZipCode";
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