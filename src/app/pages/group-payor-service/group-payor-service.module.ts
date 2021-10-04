import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GroupPayorServiceComponent} from './group-payor-service.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService ,ResizeService} from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
import { GroupPayorService } from './group-payor-service.service';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPService } from '../group-payor-service/group-payor-servicetable.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
  declarations: [GroupPayorServiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    MyDatePickerModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule


 
 

  ],
  providers: [DatePipe,GroupPayorService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService],
})


export class GroupPayorServiceModule { }
