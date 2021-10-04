import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationalDashboardComponent } from './operational-dashboard.component';
import { GetHTTPService } from './operational-dashboarddata.service';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { GridModule, ColumnChooserService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { PageService, FilterService } from '@syncfusion/ej2-angular-grids';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';


@NgModule({
  declarations: [
    OperationalDashboardComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    NgxUiLoaderModule,
    NgxChartsModule,
    MaskedTextBoxModule
  ],
  providers: [ GetHTTPService,ColumnChooserService,FilterService,PageService,ResizeService ]
})
export class OperationalDashboardModule { }
