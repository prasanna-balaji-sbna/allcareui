export class Employee {
    id: number;
    name:string;
    agencyId: number;
    firstName: string;
    lastName: string;
    middleName: string;
    type: boolean;
    dob: string;
    genderLid: number;
    statusLid: number;
    statusLidName: string;
    totalhours: number | null;
    employeeTypeLid: number | null;
    employeeTypeLidName: string;
    age: number | null;
    aKA: string;
    uMPI: string;
    maritalStatusLid: number | null;
    rNNPI: string;
    street: string;
    apt: string;
    email: string;
    phone1: string;
    phone2: string;
    steet: string;
    city: string;
    county: string;
    zipcode: string;
    sSN: string;
    locationStatusLid: number | null;
    requiredEVV: boolean | null;
    primaryJobId: number | null;
    veteranDisabledLid: number | null;
    disabilityLid: number | null;
    raceEthnicityLid: number | null;
    hiredate: string | null;
    inactivedate: string | null;
    terminationdate: string | null;
    workingHours: number | null;
    loginUserId: string;
    exceededHours: number | null;
    PayrollList :PayRollInformation[] = [];
    PayrateList :PayRateUnit[]=[];
    PayorreqList:PayorRequiredID[]=[];

}
export class PayRollInformation {
    id: number=0;
    employeeId: number;
    withHoldingLid: number | null;
    exemptions: string;
    paycheckTypeLid: number | null;
    otherPayrollInfo: string;
    bankRounting: string;
    accNumber: string;
    allCompanyPayrollID: string;
}
export class PayRateUnit {
    id: number;
    employeeId: number;
    masterServiceId: number;
    startDate: string;
    payRate: string;
    managePayrateId: number;
    payRateforRelative: string;
    masterServiceName: string;
    payarateunit: string;
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
    isReceived: string;
    payorName: string;
}

export class exceededhourBO {
    orderColumn: string="Name";
    orderType: string="asc";
    pageitem: number=10;
    currentpageno: number=1;
    employeeId: number=0;
    startDate: string| null;;
    agencyId: number;
    field: string="Name";
    value: string="";
    matchCase: boolean;
    operator: string="contains";
    type: string="string";
}