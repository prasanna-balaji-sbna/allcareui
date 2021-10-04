import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {GroupPayorServiceComponent} from './group-payor-service.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule, ColumnChooserService ,ResizeService} from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
// import { GroupPayorService } from './group-payor-service.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { IntakeManagementComponent } from './intake-management.component';
import { IntakeManagementService } from './intake-management.service';


@NgModule({
  declarations: [IntakeManagementComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    MyDatePickerModule,
 
 

  ],
  providers: [DatePipe,IntakeManagementService,ColumnChooserService,ResizeService],
})


export class IntakeManagementModule { }
