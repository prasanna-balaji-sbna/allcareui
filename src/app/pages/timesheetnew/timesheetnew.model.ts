export class sortingObj
{
    itemperpage : number =10;
    currentPgNo : number = 1;
    shortcolumn : string = "EmployeeName" ;
    shortType : string = 'asc';
}

export class StatusList {
    Key:number;
    Value:string;
}

export class EmployeeList {
    Key:number;
    Value:string;
    label:string;
    value:string;
}
export class PayorList {
    Key:number;
    Value:string;
}
export class PayrollId {
    PayrollId:number;
}
export class PayrollexcelBO {
    id: PayorRequiredID[];
    employeeId: number;
    employeePayrollId: string;
    employeeName: string;
    payDate: string | null;
    totalWorkedHrs: number;
    totalAmount: number | null;
}

export class PayorRequiredID {
    id: number;
    employeeId: number;
    groupPayorId: number | null;
    billingPayorRequiredID: string;
    startDate: string | null;
    endDate: string | null;
    faxDate: string | null;
    received: boolean | null;
    createdBy: number;
    createDate: string;
    createdIp: string;
    recordVersion: number;
    modifiedBy: number | null;
    modifiedDate: string | null;
    modifiedIp: string;
    // employee: Employee;
    // groupPayor: GroupPayor;
    employee: string;
    groupPayor: string;
}
export class GetPayrollBO {
    fromDate: string | null;
    toDate: string | null;
    orderColumn: string="EmployeeName";
    orderType: string="asc";
    pageitem: number=10;
    currentpageno: number=1;
    clientId: number | null=0;
    employeeId: number | null=0;
    agency: number;
    paydateLid: number | null = 0;
    field: string="EmployeeName";
    value: string="";
    matchCase: boolean = false;;
    type: string;
    operator: string= "startswith";
}
export class timesheetClientAuthBO {
    id: number;
    clientId: number;
    startDate: string;
    endDate: string;
    insuranceNo: string;
    totalUnits: number;
    unitsUsed: number | null;
    unitsRemaining: number | null;
    groupPayorServiceId: number | null;
    masterServiceCode: string;
    masterServiceId: string;
    payorName: string;
    groupPayorId: number | null;
    billingunit: any;
    totalunitperday: any;
    unithr:string;
    unitmin:string;
}
   export class ClientBO1 {
    id: number;
    dOB: string;
    medicaid: string;
    names: string;
    agencyId: number;
    label:string;
    value:string;
}
export class ReportBO{
    public Employee_Name:any="";
    public Total_Amount:any="";  
    public Total_WorkedHrs:any="";
  }
export class PayrollLineBO {
    id: number;
    payrollId: number;
    timesheetId: number;
    clientId: number;
    clientName: string;
    timesheetDate: string;
    masterServiceId: number;
    serviceCode: string;
    totalhrs: number;
    payablehrs: number | null;
    payRateLid: number | null;
    notes: string;
    employeeServicePayrate: string;
}
export class UpdatepaydateBO {
    payrollId: string;
    payDate: string | null;
}

export class payrollReportBO {
    employeeeId: number;
    employeeName: string;
    employeeParollId: string;
    totalHours: number | null;
    weeklyHours: weekBO[];
    serviceHours: weekserivceBO[];
    recordslst: weeklyrecordBO[];
    grosstotal: number | null;
    exceed_hours: number | null;
}
export class payrollRecordsBO {
    clientId: number;
    clientName: string;
    timesheetDate: string | null;
    paydate: string | null;
    masterServiceId: number;
    serviceCode: string;
    totalhrs: number;
    totalAmount: number;
    grosspayrate: number;
}
export class weekserivceBO {
    name: string;
    hours: number | null;
    payAmount: number | null;
    grosspayrate: number | null;
}
export class weeklyrecordBO {
    name: string;
    hours: number | null;
    totalAmount: number | null;
    serviceHours: weekserivceBO[];
    records: payrollRecordsBO[];
}
export class weekBO {
    name: string;
    hours: number | null;
    exceeded_hour: number | null;
    grosstotal: number | null;
}