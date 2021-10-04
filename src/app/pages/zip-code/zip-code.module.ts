import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ZipCodeComponent} from './zip-code.component';
import {zipcodeService} from './zip-code.service'
import { GridModule,ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { GetHTTPService } from './zip-table.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    ZipCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule

  ],
  providers: [zipcodeService,ColumnChooserService,PageService,SortService,ResizeService,FilterService,GetHTTPService],
})
export class ZipCodeModule { }
