export class relationship
{
    Id:number
    RelationType:string
    type:string
}
export class EmployeeClientRelationship {
    id: number=0;
    clientId: number;
    employeeId: number;
    statusLid: number;
    statusName: string;
    employeeName: string;
    clientName: string;
}
export class GetClientEvaluation {
    orderColumn: string="ClientName";
    orderType: string="asc";
    pageitem: number=10;
    clientId: number;
    ages: number | null;
    client: string;
    currentpageno: number=1;
    field: string="ClientName";
    value: string="";
    matchCase: boolean=false;
    type: string="string";
    operator: string="contains";
    employeeID: number | null;
    relationshipFilter: number | null;
    agency: number | null;
}
