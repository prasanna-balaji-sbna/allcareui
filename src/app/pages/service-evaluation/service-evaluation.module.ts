import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {ZipCodeComponent} from './zip-code.component';
// import {zipcodeService} from './zip-code.service'
import { GridModule, ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { ServiceEvaluationComponent } from './service-evaluation.component';
import { ServiceEvaluationService } from './service-evaluation.service';
import { DateService } from 'src/app/date.service';
import { MyDatePickerModule } from 'mydatepicker';
import {NgxPrintModule} from 'ngx-print';
import { GetHTTPService } from './service-eval-table.service';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import {
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION
} from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
  declarations: [
    ServiceEvaluationComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    MyDatePickerModule,
    NgxPrintModule ,
    DropDownListAllModule,
    NgHttpLoaderModule.forRoot(),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule
  ],
  providers: [ServiceEvaluationService,ColumnChooserService,DateService,DatePipe,ResizeService,GetHTTPService,PageService,SortService,FilterService,]
})
export class SerivceEvaluationModule { }
