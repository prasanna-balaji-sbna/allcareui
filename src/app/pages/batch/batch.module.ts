import { NgModule } from '@angular/core';
import { BatchComponent } from './batch.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService,ResizeService, FilterService } from '@syncfusion/ej2-angular-grids';
import { BatchService } from './batch.service';
import { MyDatePickerModule } from 'mydatepicker';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { GetHTTPServiceBatch } from './batchListData.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPServiceBatchActive } from './batchactiveData.service';
import { GetHTTPServiceViewbatch } from './batchdataviewbatch.service';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
      BatchComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MyDatePickerModule,
      GridModule,
      NgSelectModule,
      PDFExportModule,
      NgxUiLoaderModule,
      MaskedTextBoxModule,
      DropDownListAllModule


    ],
    providers: [BatchService,ColumnChooserService,GetHTTPServiceBatch, ResizeService,GetHTTPServiceBatchActive,GetHTTPServiceViewbatch,FilterService],
  })
  export class BatchModule { }