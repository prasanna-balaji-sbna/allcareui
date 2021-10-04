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
    aka: string;
    umpi: string;
    maritalStatusLid: number | null;
    rnnpi: string;
    street: string;
    apt: string;
    email: string;
    phone1: string;
    phone2: string;
    steet: string;
    city: string;
    county: string;
    zipcode: string;
    ssn: string;
    locationStatusLid: number | null;
    requiredEVV: boolean | null=false;
    primaryJobId: number | null;
    veteranDisabledLid: number | null;
    disabilityLid: number | null;
    raceEthnicityLid: number | null;
    hiredate: string | null;
    inactivedate: string | null;
    terminationdate: string | null;
    workingHours: number | null;
    //loginUserId: string;
    exceededHours: number | null;
    PayrollList :PayRollInformation[] = [];
    PayrateList :PayRateUnit[]=[];
    PayorreqList:PayorRequiredID[]=[];
    username:string|null;
    password:string|null;
    loginUserId:string|null;
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
export class zip
{
    agencyId: number
city: string
county:string
id: number
state: string
zipcode: string
}
export class functionpermission {
    employeecreate: boolean = true;
    employeeupdate: boolean = true;
    payorrequiredcreate: boolean = true;
    payorrequireddelete: boolean = true;
    payorrequiredupdate: boolean = true;
    payratescreate: boolean = true;
    payratesdelete: boolean = true;
    payratesupdate: boolean = true;
    EOB_OnboardCheckList: boolean = true;
    EOB_AddNew: boolean = true;
    EOB_CSVImport: boolean = true;
    onboardtype1: boolean = true;
    onboardtype2: boolean = true;
  
  }
  export class sortingObj
{
    itemperpage : number =20;
    currentPgNo : number = 1;
    shortcolumn : string = "FirstName" ;
    shortType : string = 'asc';
}
export class employeeFilter
{
    employeeType:number;
    employeeStatus:number;
}
export class IsViewEdit
 {
    isView: boolean;
    isEdit: boolean;
    isEditEmployee:boolean;
    editEmployee:number;
    Employeedata:Employee
} 
export class IsViewEditpayorequired
 {
    isView: boolean;
    isEdit: boolean;
    isEditPayorRequired:boolean;
    employeeId:number;
    payorRequiredId:number;
    payorRequired:PayorRequiredID[]
    payorActiotype:string;
} 
export class IsViewEditpayrate
 {
    isView: boolean;
    isEdit: boolean;
    isEditPayorrate:boolean;
    employeeId:number;
    payrateId:number;
    payratetype:string;
    payrate:PayRateUnit[]
} 
export class OnboardList {
    id: number;
    employeeId: number;
    onboardLid: number;
    isCompleted: boolean | null;
    completedOn: string | null;
    expiredOn: string | null;
    containerName: string;
    filePath: string;
    fileName: string;
    uploadurl: string;
    onboardQuestion: string;
}
export class returnonboard {
    containerName: string;
    filePath: string;
    fileName: string;
    onboardLid: number;
    uploadurl: string;
}


export class ManagePayrate 
{
    id: number;
    employeeId: number;
    payarateunit: string;
    payarateLid: number;
    payratelidName: string;
}

export class getEmployee {
    searchColumn: string="Name";
    searchText: string="";
    orderColumn: string="Name";
    orderType: string="asc";
    pageitem: number=10;
    currentpageno: number=1;
    agencyId: number;
    statusLid: number;
    employeeTypeLi: number;
    field: string = "Name";
    value: string = "";
    matchCase: boolean = false;
    operator: string = "startswith";
    type:string="string";
}
export class RetrunEmployeeBO {
    employeelst: Employee[];
    employeeTotal: number;
}
export class relationship
{
    Id:number
    RelationType:string
    type:string
    
}
export class GetpayrateBO {
    orderColumn: string="PayRate";
    orderType: string="asc";
    pageitem: number=10;
    clientId: number;
    ages: number | null;
    client: string;
    currentpageno: number=1;
    field: string="PayRate";
    value: string="";
    matchCase: boolean=false;
    type: string='string';
    operator: string="contains";
    employeeID: number | null;
    relationshipFilter: number | null;
    agency: number | null;
}

export class GetpayeridBO {
    orderColumn: string="PayorName";
    orderType: string="asc";
    pageitem: number=10;
    clientId: number;
    ages: number | null;
    client: string;
    currentpageno: number=1;
    field: string="PayorName";
    value: string="";
    matchCase: boolean=false;
    type: string='string';
    operator: string="contains";
    employeeID: number | null;
    relationshipFilter: number | null;
    agency: number | null;
}
