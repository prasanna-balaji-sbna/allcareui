import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import{ClientReportComponent} from'./client-report.component'
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {GetclientReport} from './clinet-repotdata.service'
import { GridModule, ColumnChooserService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { PageService, FilterService } from '@syncfusion/ej2-angular-grids';
import { MyDatePickerModule}  from 'mydatepicker';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
  declarations: [ClientReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    MyDatePickerModule,
    GridModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  providers:[ColumnChooserService,PageService,FilterService,GetclientReport, ResizeService]
})
export class ClientReportModule { }
