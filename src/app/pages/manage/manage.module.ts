import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { ManageHttpService } from './manage.service';
import { ManageComponent } from './manage.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { GetHTTPService } from './manage-table.service';
import { GetHTTPService1 } from './activity-table.service';
import { GetHTTPService2 } from './serviceactivity-table.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MultiselectDropdownModule,
    NgSelectModule,
    GridModule,
    DragDropModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MaskedTextBoxModule,
    MaskedTextBoxModule
  ],
  providers: [ManageHttpService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,GetHTTPService1,GetHTTPService2,ResizeService],
})
export class ManageModule { }
