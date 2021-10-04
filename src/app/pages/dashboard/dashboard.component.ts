import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalComponent } from 'src/app/global/global.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
urlstring:string;
iframeURL:any;
  constructor(private ref: ChangeDetectorRef, public global: GlobalComponent,protected sanitizer: DomSanitizer) { 

    // ref.detach();
    // setInterval(() => {
    //   this.ref.detectChanges();
    // }, 10);
  }

  ngOnInit(): void {
    let claimdet="Claims_Devlopment_Local";
   // this.urlstring="https://26fd93f2a8714bdba4af9a06b7573cc9.eastus2.azure.elastic-cloud.com:9243/s/allcare/app/dashboards#/view/392ea7f0-0f63-11eb-95bf-53d3ca7a6d8c?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:"+claimdet+",viewMode:view)"
   this.urlstring="https://26fd93f2a8714bdba4af9a06b7573cc9.eastus2.azure.elastic-cloud.com:9243/s/allcare/app/dashboards#/view/15de1a70-1354-11eb-95bf-53d3ca7a6d8c?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))&_a=(description:'Local%20devleopment%20DB',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:"+claimdet+",viewMode:view)"
    // this.urlstring="https://26fd93f2a8714bdba4af9a06b7573cc9.eastus2.azure.elastic-cloud.com:9243/s/allcare/app/dashboards#/view/dd45ed60-d6df-11ea-b67a-4da95200c10c?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now-5s))&_a=(description:'',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:'agencyId%20:%20"+this.global.globalAgencyId+"'),timeRestore:!t,title:"+claimdet+",viewMode:view)"
  console.log(this.urlstring);
  let trustedDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlstring);
  this.iframeURL = trustedDashboardUrl;
  }


}
