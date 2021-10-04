import { Injectable } from '@angular/core';
import { keyPressed } from '@syncfusion/ej2-angular-grids';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
export class PhoneNumberFormatService {

   getPhoneNumber(phonenumberFormat){
    let phone_Number=null;
    if(phonenumberFormat!=null && phonenumberFormat!=''){
      phone_Number=phonenumberFormat.replace('-', "");
          phone_Number=phone_Number.replace('(', "");
          phone_Number=phone_Number.replace(')', "");
          phone_Number=phone_Number.replace(' ', "");
          phone_Number=phone_Number.replace(/\s/g, "");
          return phone_Number;
    }
    else{
      return '';
    }
   }
   //==================================Updated format==========================//
    getPhoneNumberFormat(phonenumberFormat){     
      let Assign;
      Assign = "";
      if (phonenumberFormat != "" && phonenumberFormat != undefined && phonenumberFormat != null && phonenumberFormat != " ") {
      Assign =phonenumberFormat.charAt(phonenumberFormat.length-1);
      if (Assign >= 0) {
        phonenumberFormat = phoneUtil.parseAndKeepRawInput(phonenumberFormat, 'US');
        phonenumberFormat=phoneUtil.formatInOriginalFormat(phonenumberFormat, 'US')
      } else {
      setTimeout(() => {
        phonenumberFormat = phonenumberFormat.slice(0,phonenumberFormat.length-1);
      }, 250);
     }
       
     }
      return phonenumberFormat;
    }
    //===================================Refrence data=====================//
   //getPhoneNumberFormat(event,phonenumberFormat){
  //    ///---Check Backspace & Delete Key
  //   //  if(event.which>57)
  //   //  {
  //   //   if ( (event.which < 96 || event.which > 105)) {
  //   //     event.preventDefault();
  //   //   }
  //   //  }else
  //   //  {
  //    if ( ((event.which < 48 && (event.which!=8&&event.which!=46&&event.which!=39&&event.which!=37) )|| event.which > 57)&&((event.which < 96 && (event.which!=8 &&event.which!=46&&event.which!=39&&event.which!=37))|| event.which > 105)) {
  //     event.preventDefault();
  //   }
  // // }
  //   if(event.keyCode!=8 && event.keyCode!=46){

  //   if(phonenumberFormat.length==1 && phonenumberFormat.slice(0,1)!='('){
  //    phonenumberFormat='('+phonenumberFormat.slice(0,1)
  //   }
  //   if(phonenumberFormat.length==4 && phonenumberFormat.slice(0,5)!=')'){
  //    phonenumberFormat=phonenumberFormat.slice(0,4)+') '
  //   }
  //   if(phonenumberFormat.length==9){
  //    phonenumberFormat=phonenumberFormat.slice(0,9)+'-'
  //   }
  //  }
   // return phonenumberFormat;
  //}
   phoneNoToFormat(phonenumberFormat){
     if(phonenumberFormat.length==10){
      phonenumberFormat='('+phonenumberFormat.slice(0,3)+') '+phonenumberFormat.slice(3,6)+'-'+phonenumberFormat.slice(6,10)
     }
     return phonenumberFormat;
   }
}