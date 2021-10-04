import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
// import { AgencySettingsComponent } from './pages/agency-settings/agency-settings.component';

// @Injectable()
//     export class ConfirmDeactivateGuard implements CanDeactivate<AgencySettingsComponent> {
//       canDeactivate(target: AgencySettingsComponent) {
//         if (target.touched == true) {
//             return window.confirm('Do you really want to cancel?');
//         }
//         return true;
//       }
//     }

    export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
    }
  
    @Injectable()
    export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate, 
                route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot) {

        let url: string = state.url;
        

        return component.canDeactivate && component.canDeactivate();
    }
  } 