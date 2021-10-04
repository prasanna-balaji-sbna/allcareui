import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService, ResizeService  } from '@syncfusion/ej2-angular-grids';
import { carecordinatorService } from './care-cordinator.service';
import { CareCoordinatorComponent } from './care-coordinator.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { GetHTTPService } from './care-table.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';



@NgModule({
  declarations: [
    CareCoordinatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    GridModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule
  ],
  exports:[CareCoordinatorComponent],
  providers: [carecordinatorService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,ResizeService ],
})
export class CareCoordinatorModule { }
