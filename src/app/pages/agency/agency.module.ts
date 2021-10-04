import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService, FilterService, SortService, PageService, ResizeService  } from '@syncfusion/ej2-angular-grids';
import { AgencyService } from './agency.service';
import { AgencyComponent } from './agency.component';
import { CompanyEditComponent } from './company-edit/company-edit/company-edit.component';
import { CompanyListComponent } from './company-list/company-list/company-list.component';
import { GetHTTPServiceAgency } from './agencylistData.service';
import { GetHTTPServiceCompany } from './companylistData.service';
// import { ModalModule } from 'ngx-bootstrap';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns'; 
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs'
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AgencyComponent,
    CompanyEditComponent,
    CompanyListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgSelectModule,
    DropDownListAllModule,
    NgxUiLoaderModule,
    MaskedTextBoxModule 
  ],
  providers: [AgencyService,ColumnChooserService,GetHTTPServiceAgency,GetHTTPServiceCompany,PageService,SortService,FilterService,ResizeService],
})
export class AgencyModule { }
