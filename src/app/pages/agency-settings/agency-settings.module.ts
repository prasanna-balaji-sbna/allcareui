import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ColumnChooserService,ResizeService } from '@syncfusion/ej2-angular-grids';
import { AgencySettingsComponent } from './agency-settings.component';
import { AgencySettingService } from './agency-settings.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';



@NgModule({
  declarations: [
    AgencySettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })

  ],
  providers: [AgencySettingService,ColumnChooserService,ResizeService],
})
export class AgencySettingsModule { }
