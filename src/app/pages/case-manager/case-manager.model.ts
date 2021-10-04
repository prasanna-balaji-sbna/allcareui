
export class caseManagerList {
    id: number;
    agencyId: number | null;
    caseManagerName: string;
    county: string;
    telephone: string;
    fax: string;
    alternate_Fax: string;
    email: string = "";
}

export class searchfilterDetails {
    Filter_Telephone: string;
    Filter_Fax: string;
    Filter_Alternate_Fax: string;
    Filter_County: string;
    Filter_caseManagerName:string;
}

export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "caseManagerName" ;
    shortType : string = 'asc';
}

export class functionpermission 
{
  casemanagercreate:boolean=true;
  casemanagerdelete:boolean=true;
  casemanagerupdate:boolean=true;
}

export class WhereCondition {
    field: string="caseManagerName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetCaseListBo {
    SearchColumn: string = "caseManagerName";
    SearchText: string = "";
    orderColumn: string = "caseManagerName";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "caseManagerName";
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