import { Injectable, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Menu } from './menu.model';
// import { verticalMenuItems, agencyverticalMenuItems } from './menu';
import { horizontalMenuItems, agencyverticalMenuItems,verticalMenuItems } from './menu';
import { GlobalComponent } from 'src/app/global/global.component';
import { HttpClient } from '@angular/common/http';
// import { RolesService } from 'src/app/pages/roles/roles.service';

@Injectable()
export class MenuService {

  verticalMenuItems:Menu[]=this.global.globalmenu;
  constructor(private location:Location, 
              private renderer2:Renderer2,
              private router:Router,
              public global:GlobalComponent,
              private http: HttpClient, ){
// this.getData()
} 

// getData(){
//   this.rolesService.sendGetRequest().subscribe((data)=>{
//     this.global.email=localStorage.getItem("email");
    
//     if(this.global.email=="admin@dk.in"){
//     this.global.isDashBoard=data[0].AdminRole
//     this.global.isAgentOn=data[1].AdminRole
//     this.global.isAgentAdd=data[2].AdminRole
//     this.global.isAgentEdit=data[3].AdminRole
//     this.global.isAgentDel=data[4].AdminRole
//     this.global.isAgentUpdate=data[5].AdminRole
//     this.global.isCustomerOn=data[6].AdminRole
//     this.global.isCustomerAdd=data[7].AdminRole
//     this.global.isCustomerEdit=data[8].AdminRole
//     this.global.isCustomerDel=data[9].AdminRole
//     this.global.isCustomerUpdate=data[10].AdminRole
//     this.global.isCspOn=data[11].AdminRole
//     this.global.isCspAdd=data[12].AdminRole
//     this.global.isCspEdit=data[13].AdminRole
//     this.global.isCspDel=data[14].AdminRole
//     this.global.isCspUpdate=data[15].AdminRole
//     this.global.isMapCsp=data[16].AdminRole
//     this.global.isAssetOn=data[17].AdminRole
//     this.global.isAssetAdd=data[18].AdminRole
//     this.global.isAssetEdit=data[19].AdminRole
//     this.global.isAssetDel=data[20].AdminRole
//     this.global.isAssetUpdate=data[21].AdminRole
//     this.global.isBankService=data[22].AdminRole
//     this.global.isAccount=data[23].AdminRole
//     this.global.isCashIn=data[24].AdminRole
//     this.global.isCashOut=data[25].AdminRole
//     this.global.isFund=data[26].AdminRole
//     }
//     else if(this.global.email=="agent@dk.in")
//     {
    
//     this.global.isDashBoard=data[0].MasterFranchiseAgent
//     this.global.isAgentOn=data[1].MasterFranchiseAgent
//     this.global.isAgentAdd=data[2].MasterFranchiseAgent
//     this.global.isAgentEdit=data[3].MasterFranchiseAgent
//     this.global.isAgentDel=data[4].MasterFranchiseAgent
//     this.global.isAgentUpdate=data[5].MasterFranchiseAgent
//     this.global.isCustomerOn=data[6].MasterFranchiseAgent
//     this.global.isCustomerAdd=data[7].MasterFranchiseAgent
//     this.global.isCustomerEdit=data[8].MasterFranchiseAgent
//     this.global.isCustomerDel=data[9].MasterFranchiseAgent
//     this.global.isCustomerUpdate=data[10].MasterFranchiseAgent
//     this.global.isCspOn=data[11].MasterFranchiseAgent
//     this.global.isCspAdd=data[12].MasterFranchiseAgent
//     this.global.isCspEdit=data[13].MasterFranchiseAgent
//     this.global.isCspDel=data[14].MasterFranchiseAgent
//     this.global.isCspUpdate=data[15].MasterFranchiseAgent
//     this.global.isMapCsp=data[16].MasterFranchiseAgent
//     this.global.isAssetOn=data[17].MasterFranchiseAgent
//     this.global.isAssetAdd=data[18].MasterFranchiseAgent
//     this.global.isAssetEdit=data[19].MasterFranchiseAgent
//     this.global.isAssetDel=data[20].MasterFranchiseAgent
//     this.global.isAssetUpdate=data[21].MasterFranchiseAgent
//     this.global.isBankService=data[22].MasterFranchiseAgent
//     this.global.isAccount=data[23].MasterFranchiseAgent
//     this.global.isCashIn=data[24].MasterFranchiseAgent
//     this.global.isCashOut=data[25].MasterFranchiseAgent
//     this.global.isFund=data[26].MasterFranchiseAgent
//     }
//   })
 
// }

  public getVerticalMenuItems():Array<Menu> {
    // if(this.global.userID==0){
      return this.verticalMenuItems;
    // }
    // else{
    //   return agencyverticalMenuItems;
    // }
    
  }

  public getHorizontalMenuItems():Array<Menu> {
    return horizontalMenuItems;
  }

  public createMenu(menu:Array<Menu>, nativeElement, type){ 
    if(type=='vertical'){
      this.createVerticalMenu(menu, nativeElement);
    }
    if(type=='horizontal'){
      this.createHorizontalMenu(menu, nativeElement);
    }
  }

  public createVerticalMenu(menu:Array<Menu>, nativeElement){    
    let menu0 = this.renderer2.createElement('div');
    this.renderer2.setAttribute(menu0, 'id', 'menu0');
    
    menu.forEach((menuItem) => {
        if(menuItem.parentId == 0){
          let subMenu = this.createVerticalMenuItem(menu, menuItem);
          this.renderer2.appendChild(menu0, subMenu);
        }
    });
    this.renderer2.appendChild(nativeElement, menu0); 
  }



  public createHorizontalMenu(menu:Array<Menu>, nativeElement){
    let nav = this.renderer2.createElement('div');
    this.renderer2.setAttribute(nav, 'id', 'navigation');
    let ul = this.renderer2.createElement('ul');
    this.renderer2.addClass(ul, 'menu');
    this.renderer2.appendChild(nav, ul);
    menu.forEach((menuItem) => {
        if(menuItem.parentId == 0){
          let subMenu = this.createHorizontalMenuItem(menu, menuItem);
          this.renderer2.appendChild(ul, subMenu);
        }
       
    });
    this.renderer2.appendChild(nativeElement, nav); 
  }

  public createVerticalMenuItem(menu:Array<Menu>, menuItem){
    let div = this.renderer2.createElement('div');
    this.renderer2.addClass(div, 'card'); 
    this.renderer2.setAttribute(div, 'id', 'menu'+menuItem.id);
    let link = this.renderer2.createElement('a');
    this.renderer2.addClass(link, 'menu-item-link');
    this.renderer2.setAttribute(link, 'data-toggle', 'tooltip');
    this.renderer2.setAttribute(link, 'data-placement', 'right');
    this.renderer2.setAttribute(link, 'data-animation', 'false');
    this.renderer2.setAttribute(link, 'data-container', '.vertical-menu-tooltip-place');    
    this.renderer2.setAttribute(link, 'data-original-title', menuItem.title);
    let icon = this.renderer2.createElement('i');
    this.renderer2.addClass(icon, 'fa');
    this.renderer2.addClass(icon, 'fa-'+menuItem.icon);
    this.renderer2.appendChild(link, icon);
    let span = this.renderer2.createElement('span');
    this.renderer2.addClass(span, 'menu-title');
    this.renderer2.appendChild(link, span);
    let menuText = this.renderer2.createText(menuItem.title);
    this.renderer2.appendChild(span, menuText);
    this.renderer2.setAttribute(link, 'id', 'link'+menuItem.id);
    this.renderer2.addClass(link, 'transition');
    this.renderer2.appendChild(div, link);
    if(menuItem.routerLink){             
      this.renderer2.listen(link, "click", () => { 
          this.router.navigate([menuItem.routerLink]);
          this.setActiveLink(menu,link);
          this.closeOtherSubMenus(div);
      });
    }
    if(menuItem.href){
      this.renderer2.setAttribute(link, 'href', menuItem.href);
    }
    if(menuItem.target){
      this.renderer2.setAttribute(link, 'target', menuItem.target);
    }
    if(menuItem.hasSubMenu){
      this.renderer2.addClass(link, 'collapsed'); 
      let caret = this.renderer2.createElement('b');
      this.renderer2.addClass(caret, 'fa');
      this.renderer2.addClass(caret, 'fa-angle-up');
      this.renderer2.appendChild(link, caret);
      this.renderer2.setAttribute(link, 'data-toggle', 'collapse');      
      this.renderer2.setAttribute(link, 'href', '#collapse'+menuItem.id);
      let collapse = this.renderer2.createElement('div');
      this.renderer2.setAttribute(collapse, 'id', 'collapse'+menuItem.id);
      this.renderer2.setAttribute(collapse, 'data-parent', '#menu'+menuItem.parentId);
      this.renderer2.addClass(collapse, 'collapse');
      this.renderer2.appendChild(div, collapse);          
      this.createSubMenu(menu, menuItem.id, collapse, 'vertical');
    }
    return div;
  }

  public createHorizontalMenuItem(menu:Array<Menu>, menuItem){
      let li = this.renderer2.createElement('li');
      this.renderer2.addClass(li, 'menu-item');
      let link = this.renderer2.createElement('a');
      this.renderer2.addClass(link, 'menu-item-link');
      this.renderer2.setAttribute(link, 'data-toggle', 'tooltip');
      this.renderer2.setAttribute(link, 'data-placement', 'top');
      this.renderer2.setAttribute(link, 'data-animation', 'false');
      this.renderer2.setAttribute(link, 'data-container', '.horizontal-menu-tooltip-place');    
      this.renderer2.setAttribute(link, 'data-original-title', menuItem.title);
      let icon = this.renderer2.createElement('i');
      this.renderer2.addClass(icon, 'fa');
      this.renderer2.addClass(icon, 'fa-'+menuItem.icon);
      this.renderer2.appendChild(link, icon);
      let span = this.renderer2.createElement('span');
      this.renderer2.addClass(span, 'menu-title');
      this.renderer2.appendChild(link, span);
      let menuText = this.renderer2.createText(menuItem.title);
      this.renderer2.appendChild(span, menuText);
      this.renderer2.appendChild(li, link);
      this.renderer2.setAttribute(link, 'id', 'link'+menuItem.id);
      this.renderer2.addClass(link, 'transition');
      if(menuItem.routerLink){             
        this.renderer2.listen(link, "click", () => {  
            this.router.navigate([menuItem.routerLink]);
            this.setActiveLink(menu, link);
        });
      }
      if(menuItem.href){
        this.renderer2.setAttribute(link, 'href', menuItem.href);
      }
      if(menuItem.target){
        this.renderer2.setAttribute(link, 'target', menuItem.target);
      }
      if(menuItem.hasSubMenu){
        this.renderer2.addClass(li, 'menu-item-has-children');
        let subMenu = this.renderer2.createElement('ul');
        this.renderer2.addClass(subMenu, 'sub-menu');
        this.renderer2.appendChild(li, subMenu);
        this.createSubMenu(menu, menuItem.id, subMenu, 'horizontal');
      }
      return li;
  }

  private createSubMenu(menu:Array<Menu>, menuItemId, parentElement, type){
      let menus = menu.filter(item => item.parentId === menuItemId);
      menus.forEach((menuItem) => {
        let subMenu = null;
        if(type=='vertical'){
           subMenu = this.createVerticalMenuItem(menu, menuItem);
        }
        if(type=='horizontal'){
           subMenu = this.createHorizontalMenuItem(menu, menuItem);
        }      
        this.renderer2.appendChild(parentElement, subMenu);
      });
  } 

  private closeOtherSubMenus(elem){
      let children = (this.renderer2.parentNode(elem)).children;
      for (let i = 0; i < children.length; i++) {
          let child = this.renderer2.nextSibling(children[i].children[0]);
          if(child){
              this.renderer2.addClass(children[i].children[0], 'collapsed');   
              this.renderer2.removeClass(child, 'show');               
          }
      }
  }

  public getActiveLink(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = (url) ? url : '/';  // url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
        let activeLink = document.querySelector("#link"+activeMenuItem[0].id);
        return activeLink;
      }
      return false;
  }

  public setActiveLink(menu:Array<Menu>, link){
      if(link){
          menu.forEach((menuItem) => {
            let activeLink = document.querySelector("#link"+menuItem.id);
            if(activeLink){
              if(activeLink.classList.contains('active-link')){
                activeLink.classList.remove('active-link');
              }
            }       
          });
          this.renderer2.addClass(link, 'active-link'); 
      }    
  } 

  public showActiveSubMenu(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = url; //url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
          let activeLink = document.querySelector("#link"+activeMenuItem[0].id);      
          let parent = this.renderer2.parentNode(activeLink);
          while (this.renderer2.parentNode(parent)){         
              parent = this.renderer2.parentNode(parent);
              if(parent.className == 'collapse'){
                let parentMenu = menu.filter(item => item.id === activeMenuItem[0].parentId);           
                let activeParentLink = document.querySelector("#link"+parentMenu[0].id);
                this.renderer2.removeClass(activeParentLink, 'collapsed');
                this.renderer2.addClass(parent, 'show');                
              }
              if(parent.classList.contains('menu-wrapper')){
                break;
              }
          }
      }     
  }

  public addNewMenuItem(menu:Array<Menu>, newMenuItem, type){
      menu.push(newMenuItem);
      if(newMenuItem.parentId != 0){
        let parentMenu =  menu.filter(item => item.id === newMenuItem.parentId);
        if(parentMenu.length){
            if(!parentMenu[0].hasSubMenu){
              parentMenu[0].hasSubMenu = true;
            // parentMenu[0].routerLink = null;
          } 
        }                
      }
      let menu_wrapper = null;
      if(type=='vertical'){
        menu_wrapper = document.getElementById('vertical-menu');
      }
      if(type=='horizontal'){
        menu_wrapper = document.getElementById('horizontal-menu');
      }
      while (menu_wrapper.firstChild) {
          menu_wrapper.removeChild(menu_wrapper.firstChild);
      }      
      this.createMenu(menu, menu_wrapper[1], type);
     
      
  } 
}