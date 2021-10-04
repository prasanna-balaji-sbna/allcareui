import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { LockedpayrollComponent } from './lockedpayroll.component';
import { LPRHTTPService } from './lockedpayroll.service';
import { GetHTTPService } from './lockedpayroll-data.service';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
  declarations: [
    LockedpayrollComponent
  ],
  imports: [
    MyDatePickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

  ],
  providers: [LPRHTTPService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService],
})
export class LockedpayrollModule { }
