import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { dccodesService } from './dccodes.service';
import { DccodesComponent } from './dccodes.component';
import { NumericTextBoxModule, NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { GetHTTPService } from '../dccodes/dischargetable.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [
    DccodesComponent
  ],
  exports:[DccodesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NumericTextBoxModule,
    NumericTextBoxAllModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })

  ],
  providers: [dccodesService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService, ResizeService],
})
export class dccodesModule { }
