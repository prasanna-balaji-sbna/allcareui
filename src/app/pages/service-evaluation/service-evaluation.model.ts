export class ServiceEvaluation {
    id: number;
    clientId: number;
    reviewDate: any;
    callDate: any;
    isAnsweredCall: boolean | null;
    notes: string;
    // client: Client;
    firstName: string;
    phone: string;
    lastName: string;
    reviewedBy: string;
    reviewedBy_id: number;
    ages: number;
    isPCAPresent:boolean|null;
    currentDate: string | null;
    name:string|null;

}
export class getServiceEvalBO {
    
    isAnswered:boolean=true
    callDate:string
    reviewDate:string
    startperiod: number= 30;
    endperiod: number;
    clientId: number;
    currentpageno: number=1;
    pageitem: number=10;
    agencyId: number;
    orderColumn: string="firstName";
    orderType: string="asc";
    field: string="firstName";
    value: string="";
    matchCase: boolean=false;
    operator: string= "startswith";
    type: string="string";
    ages:number
}
export class WhereCondition {
    field: string="firstName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class functionpermission {
    serviceevaluationcreate: boolean = true;
    serviceevaluationview: boolean = true;
    serviceevaluationnotes: boolean = true;
    //clientintakesettings:boolean=true;
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