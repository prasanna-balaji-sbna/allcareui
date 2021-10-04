import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService } from '@syncfusion/ej2-angular-grids';
import { ClearingHouseComponent } from './clearing-house.component';
import { ClearingHouseHTTPService } from './clearing-house.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GetHTTPService } from './clearh-table.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [
    ClearingHouseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgbModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  providers: [ClearingHouseHTTPService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService, ResizeService],
})
export class ClearingHouseModule { }
