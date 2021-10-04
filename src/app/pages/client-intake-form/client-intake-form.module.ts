import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ClientIntakeFormComponent } from './client-intake-form.component';
import { ClientIntakeFormService } from './client-intake-form.service';
import { GetHTTPIntakeService } from './Client-intake-table.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [ClientIntakeFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    MyDatePickerModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  providers: [DatePipe,ClientIntakeFormService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPIntakeService, ResizeService],
})


export class ClientIntakeFormModule { }
