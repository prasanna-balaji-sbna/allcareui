export class ICD10List {
    id: number;
    code: string;
    icD10Level: string;
    icD10Description: string;
}


export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "Code" ;
    shortType : string = 'asc';
}


export class functionpermission {
    icd10create: boolean = true;
    icd10delete: boolean = true;
    icd10update: boolean = true;
   
   }
   
export class WhereCondition {
    field: string="code";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}

export class GetICD10BO {
    orderColumn: string = "code";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    // userId: number = 0;
    field: string = "code";
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
export class filterpair{ key: string; value: string }