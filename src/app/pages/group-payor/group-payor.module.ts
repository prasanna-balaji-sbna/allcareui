import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {GroupPayorComponent} from './group-payor.component';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { GroupPayorsService } from './group-payor.service';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';
import { PhoneNumberFormatService } from 'src/app/phoneNumberFormat.service ';
import { GetHTTPService } from './grouptable.service';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [GroupPayorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    RadioButtonModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgSelectModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

    
  ],
  providers: [GroupPayorsService,ColumnChooserService,PhoneNumberFormatService,PageService,SortService,FilterService,GetHTTPService, ResizeService],
})
export class GroupPayorModule { }
