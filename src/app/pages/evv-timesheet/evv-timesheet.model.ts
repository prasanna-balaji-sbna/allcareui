export class filters {
    filterStartDate: string=null;
    filterEndDate: string=null;
    filterEmployee: number =null;
    filterClient: number=null;
    filtermasterservice: number=null;
}

export class gettimesheetBO {
    start: string | null;
    end: string | null;
    employee: number | null;
    client: number | null;
    payor: number | null;
    service: number | null;
    currentpage: number=1;
    pageitems: number=10;
    agencyId: number;
    status: number;
    orderColumn: string="cname";
    orderType: string="asc";
    field: string="cname";
    value: string="";
    matchCase: boolean=false;
    operator: string="contains";
    type: string="string";
    clientstatus: string;
}
export class ReturnEvvtimesheetBO {
    clientId: number;
    employeeId: number;
    ename: string;
    cname: string;
    scheduleId: number;
    serviceId: number;
    service: string;
    totalHours: number | null;
    isCliSignature: boolean | null;
    isEmpSignature: boolean | null;
    starttime: string | null;
    endtime: string | null;
    scheduleDate: string | null;
    notes: string;
    modifiedBy: string;
}

export class deletepermission{
    timesheet_id:number=0;
    admin_Password:string="";
      
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