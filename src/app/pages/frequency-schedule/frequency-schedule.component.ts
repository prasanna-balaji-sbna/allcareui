import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectComponent } from '@syncfusion/ej2-angular-dropdowns';
import { IMyDpOptions } from 'mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { CommonHttpService } from 'src/app/common.service';
import { DateService } from 'src/app/date.service';
import { GlobalComponent } from 'src/app/global/global.component';
import { generalservice } from 'src/app/services/general.service';
import { clienttserivce } from '../client-parent/clientservice';
import { EmployeeBO } from './frequency-schedule.model';
import { FrequencyScheduleService } from './frequency-schedule.service';

@Component({
  selector: 'app-frequency-schedule',
  templateUrl: './frequency-schedule.component.html',
  styleUrls: ['./frequency-schedule.component.scss']
})
export class FrequencyScheduleComponent implements OnInit {
  @ViewChild('checkbox')
  public mulObj: MultiSelectComponent;
  @ViewChild('selectall')
  public checkboxObj: CheckBoxComponent;
  @ViewChild('dropdown')
  public dropdownObj: CheckBoxComponent;
  @ViewChild('select')
  public reorderObj: CheckBoxComponent;
  public mode: string;
  public filterPlaceholder: string;

  startDate:string;
  endDate:string;
    ////////////////////////////////////////Date piker ////////////////////////////////////////////////////////////////////
    public myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'mm/dd/yyyy',
      disableSince: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() + 1 },
      showClearDateBtn: false,
      editableDateField: true
    };
      //set the data to dataSource property
      public sportsData: Object[] =  [
        { id: 'Game1', sports: 'Badminton' },
        { id: 'Game2', sports: 'Basketball' },
        { id: 'Game3', sports: 'Cricket' },
        { id: 'Game4', sports: 'Football' },
        { id: 'Game5', sports: 'Golf' }
    ];
    // maps the appropriate column to fields property
    public fields: Object = { text: 'sports', value: 'id' };
    // set placeholder to MultiSelect input element
    public placeholder: string = 'Select games';
     // map the groupBy field with category column
    

     EmployeeTypeList:EmployeeBO[];
  constructor(public dateservice: DateService,private ref: ChangeDetectorRef,public toastrService: ToastrService,public http: HttpClient, public datepipe: DatePipe, public commonhttp: CommonHttpService, public frequency: FrequencyScheduleService, public general: generalservice,
    private formBuilder: FormBuilder, public global: GlobalComponent,public router:Router, @Inject(clienttserivce) public clienttserivce: clienttserivce,) { }

  ngOnInit(): void {
    this.mode = 'CheckBox';
    this.filterPlaceholder = 'Search countries';
  }
  ///////////////////////////////////////////Date piker function///////////////////////////////////////////////////////

  newdates(event, type, name) {
    if (type == "inputchage") {
      if (name == 'startdate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.startDate = val1;

        }
      }
      if (name == 'endDate') {
        let val = this.dateservice.inputFeildchange(event);
        if (val != undefined) {
          let val1 = this.dateservice.inputFeildchange(event);
          this.endDate = val1;
        }
      }
    
    }
    if (type == "datechagned") {
      if (name == 'startDate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.startDate = val1;
         
        }
      }
      if (name == 'endDate') {
        let val = this.dateservice.Datechange(event);
        if (val != undefined) {
          let val1 = this.dateservice.Datechange(event);
          this.endDate = val1;
        }
      }
    
    }
  }

    ///////////////////////////////////////////////get employee //////////////////////////////////////////////////////

    getEmployeeType() {
      let params = new URLSearchParams();
      params.append("AgencyId", this.global.globalAgencyId);
      this.frequency.getActiveEmployee(params).subscribe((data: any) => {
        this.EmployeeTypeList = data;
      
      })
  
    }

}
