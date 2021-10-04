export class PayrollreturnBO {
    id: number;
    payrollId: number;
    employeeID: number;
    employeeName: string;
    totalWorkedHrs: number;
    totalAmount: number | null;
    payDate: string | null;
    islocked: boolean;
  }

  export class updatePayDateBO{
    PayrollId: string;
    PayDate: string;
  }

  export class getPayrollListBO {
    fromDate: string | null;
    toDate: string | null;
    employeeId: number | null;
    clientId: number | null;
    paydateLid: number | null;
    field: string = "EmployeeName";
    value: string = "";
    agency: number;
    pageitem: number;
    currentpageno: number;
    matchCase: boolean = false;
    operator: string;
    type: string = "string";
    orderColumn: string = "EmployeeName";
    orderType: string = "asc";
  }
  export class WhereCondition {
    field: string="EmployeeName";
    value: string="";
    operator: string="startswith";
    orderNo: number=1;
    predicate: string="and";
    type: string="string";
    matchCase:boolean=false;
}