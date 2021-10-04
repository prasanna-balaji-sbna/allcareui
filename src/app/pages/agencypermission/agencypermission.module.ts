import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, FilterService, SortService, PageService,ResizeService } from '@syncfusion/ej2-angular-grids';
// import { AgencyService } from './agency.service';
import { AgencypermissionComponent } from './agencypermission.component';
// import { ModalModule } from 'ngx-bootstrap';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns'; 
import { AgencyppermissionService } from './agencypermission.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [
    AgencypermissionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownListAllModule,
    NgxUiLoaderModule
  ],
  providers: [ColumnChooserService,PageService,SortService,FilterService,AgencyppermissionService,ResizeService],
})
export class AgencypermissionModule { }