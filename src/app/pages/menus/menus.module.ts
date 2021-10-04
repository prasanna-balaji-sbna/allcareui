import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ColumnChooserService, PageService, SortService, FilterService ,ResizeService} from '@syncfusion/ej2-angular-grids';
import { MenuComponent } from './menus.component';
import { MenuHttpService } from './menus.service';
import { GetHTTPService } from './menu-table.service';
import { GetFuncHTTPService } from './function-table.service';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from 'ngx-ui-loader';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    MenuComponent
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
  providers: [MenuHttpService,ColumnChooserService,PageService,SortService,FilterService,GetHTTPService,GetFuncHTTPService,ResizeService],
})
export class MenuModule { }
