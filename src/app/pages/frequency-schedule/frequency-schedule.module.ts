import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';

import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { PhoneNumberFormatService } from 'src/app/phoneNumberFormat.service ';

import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { FrequencyScheduleComponent } from './frequency-schedule.component';
import { CheckBoxSelectionService, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { FrequencyScheduleService } from './frequency-schedule.service';
import { MyDatePickerModule } from 'mydatepicker';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [FrequencyScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    RadioButtonModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule,
    MultiSelectModule,
    MyDatePickerModule,
    NgSelectModule,

    
  ],
  providers: [ColumnChooserService,PhoneNumberFormatService,PageService,SortService,FilterService, ResizeService,FrequencyScheduleService,CheckBoxSelectionService],
})
export class FrequencyScheduleModule { }
