
export class careCordinatorList {
    id: number;
    agencyId: number | null;
    careCoordinatorName: string;
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
    Filter_careCoordinatorName:string;
}

export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "CareCoordinatorName" ;
    shortType : string = 'asc';
}

export class functionpermission {
    carecoordinatorcreate: boolean = true;
    carecoordinatordelete: boolean = true;
    carecoordinatorupdate: boolean = true;
  
  }

export class WhereCondition {
    field: string="CareCoordinatorName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetCareListBo {
    SearchColumn: string = "CareCoordinatorName";
    SearchText: string = "";
    orderColumn: string = "CareCoordinatorName";
    orderType: string= "asc";
    pageitem: number = 10;
    currentpageno: number = 1;
    userId: number = 0;
    field: string = "CareCoordinatorName";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    agencyId: number = 0;
}