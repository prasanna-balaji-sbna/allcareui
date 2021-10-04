export class IntakeClientBO {
    id: number;
    clientName: string;
    lastName: string;
    genderLid: number;
    date: any;
    dOB: any;
    age: number;
    email: string;
    phone: string;
    street: string;
    aptNumber: string;
    state: string;
    county: string;
    city: string;
    zipcode: string;
    responsibleParty: string;
    responsiblePartyPhone: string;
    refferalPhone: string;
    hoursaday: number | null;
    currentAgency: string;
    reasonForLeaving: string;
    needDaysAndShift: string;
    followup: string;
    pendingAssessment: string;
    currentAssessmentLid: number | null;
    currentlywithanagencyLid: number | null;
    staffingLid: number | null;
    createdBy: number;
    agencyid: number;

   
}
export class IntakeApprovalBO extends IntakeClientBO {
    id: number;
    intakeClientId: number;
    statusLid: number | null;
    lastName: string;
    userId: number;
    roleId: string;
    reasonForRejection: string;
    approvedOn: string | null;
    rejectedOn: string | null;
    intakenDate: string | null;
    orderno: number;
    genderLid: number;
}

export class ReturnBO {
    approvedOn: string;
    rejectedOn: string;
    reasonForRejection: string;
    intakeClientList: IntakeClientBO[];
    userId: number;
    roleId: string;
}

export class WhereCondition {
    field: string="clientName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}
export class GetIntakePendingBO {
    orderColumn: string;
    orderType: string;
    pageitem: number;
    currentpageno: number;
    client: number;
    agencyid: number;
    userid: number;
    role: string;
    startDate: string | null;
    endDate: string | null;
    conitionBO: WhereCondition[];
}
export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "clientName" ;
    shortType : string = 'asc';
}
export class functionpermission {
    intakecreate: boolean = true;
    //clientintakesettings:boolean=true;
  }
 export class getIntakeBO {
    startDate: string;
    endDate: string;
    userid: number =0;
    client: number;
    currentpageno: number=1;
    pageitem: number= 10;
    agencyId: number=0;
    orderColumn: string="clientName";
    orderType: string= "asc";
    field: string="clientName";
    value: string="";
    matchCase: boolean=false;
    operator: string = "startswith";
    type: string="string";
    role: string;
    status:string

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
