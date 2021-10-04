import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AidReportComponent } from './aid-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule, ColumnChooserService, FilterService, PageService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { Gethttp } from './getaid.service';


import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { MyDatePickerModule}  from 'mydatepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [AidReportComponent],
  imports: [
    FormsModule,
    CommonModule,
    NgSelectModule,
   
    NgbModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    GridModule,
    DropDownListAllModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  providers: [Gethttp,ColumnChooserService,FilterService,PageService,ResizeService],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AidReportModule { }
