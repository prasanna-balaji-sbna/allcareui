import { Component, OnInit, ViewEncapsulation, HostListener, ViewChild } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { GlobalComponent } from "../../../global/global.component";
import { HttpClient } from '@angular/common/http';


@Component({
  
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ],
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  userSelectedRole:string=""
  public showHorizontalMenu:boolean = true; 
  public showInfoContent:boolean = false;
  public settings: Settings;
  public menuItems:Array<any>;
  constructor(public appSettings:AppSettings, public menuService:MenuService,private router: Router,public global: GlobalComponent,
    public http:HttpClient) {
  
      this.settings = this.appSettings.settings;
    
  }
  
  ngOnInit() {
    ///this.global.globalmenu=JSON.parse(localStorage.getItem("globalMENU_ITEMS"))
  //  this.menuItems =  this.global.globalmenu;
      this.userSelectedRole=localStorage.getItem("SelectedRole")
      this.userSelectedRole=this.global.roleId
  
  
    if(window.innerWidth <= 768) 
      this.showHorizontalMenu = false;
  }


  public closeSubMenus(){
    let menu = document.querySelector("#menu0"); 
    if(menu){
      for (let i = 0; i < menu.children.length; i++) {
          let child = menu.children[i].children[1];
          if(child){          
              if(child.classList.contains('show')){            
                child.classList.remove('show');
                menu.children[i].children[0].classList.add('collapsed'); 
              }             
          }
      }
    }
  }

  @HostListener('window:resize')
  public onWindowResize():void {
     if(window.innerWidth <= 768){
        this.showHorizontalMenu = false;
     }      
      else{
        this.showHorizontalMenu = true;
      }
  }
  logout()
  {
    localStorage.clear();
    this.global.agencyLogo=null;
    this.global.agencyName=null;
    this.global.agencyPhone=null; 
    this.global.globalAgencyId='';
    this.global.userRoleDropDown=[]
    this.router.navigateByUrl("/login");
    this.global.userSelectedRole=""
  }

  refreshPage(){
    this.global.onRefreshGetData(this.global.globalAgencyId);
   }
   rolechange()
   {
    let url="api/SideMenuItems/getSideMenuBasedRole?"
    let params=new URLSearchParams()
    params.append("RoleId",this.global.userSelectedRole);
    params.append("agencyId",this.global.globalAgencyId);
    this.http.get(url+params).subscribe((data:any)=>{
    localStorage.setItem('SelectedRole', this.global.userSelectedRole);
  // let i:number=1;
  // let menu:any=[]
  // data.forEach(element => {
  //   let temp:any={}
    
  //   temp.id=i;
  //   temp.title=element.title;
  //   temp.routerLink=element.link;
  //   temp.href=null;
  //   temp.icon=element.icon;
  //   temp.target=null;
   
  //  temp.parentId=0;
  
   
  //  if(element.children!=null && element.children.length>0)
  //  {
    
  //   let j:number=i+1;
  //   element.children.forEach(element => {
  //     let submenu:any={}
  //     submenu.id=j;
  //     submenu.title=element.title;
  //     submenu.routerLink=element.link;
  //     submenu.href=null;
  //     submenu.icon=element.icon;
  //     submenu.target=null;
  //     submenu.hasSubMenu=false;
  //     submenu.parentId=i;
     
  //     menu.push(submenu);
  //     j++;
  //  });
  //  i=j-1;
  //  temp.hasSubMenu=true;
  // }
  // else
  // {
  //   temp.hasSubMenu=false;
  // }
  // menu.push(temp);
  // i++;
  //  });
  // this.global.globalmenu=menu
    //  localStorage.setItem('globalMENU_ITEMS',JSON.stringify( this.global.globalmenu));
  //  this.global.MENU_ITEMS=data;
 // this.global.onRefreshGetData(this.global.globalAgencyId);
      // location.reload();
      this.router.navigate(['/operational-dashboard']);
    })
   }
   cancelrole()
{
  this.userSelectedRole=localStorage.getItem("SelectedRole")
}
}

