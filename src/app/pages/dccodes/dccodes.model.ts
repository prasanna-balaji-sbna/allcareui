export class DischargeCodeDetailBO {
    id: number;
    agencyId: number | null;
    dischargeCode: string;
    codeDescription: string;
}
export class functionpermission {
    dccodescreate: boolean = true;
    dccodesdelete: boolean = true;
    dccodesupdate: boolean = true;
  
  }

  export class searchfilterDetails {
    Filter_DischargeCode: string;
    Filter_CodeDescrption: string;
    
}
export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "DischargeCode" ;
    shortType : string = 'asc';
}
export class WhereCondition {
    field: string="DischargeCode";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
// export class GetDccBO {
//     SearchText: string ; 
//     SearchColumn:string;
//     orderColumn: string;
//     orderType: string;
//     pageitem: number;
//     currentpageno: number;
//     AgencyId: number;
//     conitionBO: WhereCondition[];
// }

export class GetListBO {
    orderColumn: string = "DischargeCode";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    agencyID: number;
    field: string = "DischargeCode";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
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

