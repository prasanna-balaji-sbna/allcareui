import { Injectable } from '@angular/core';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

@Injectable({
    providedIn: 'root'
})
export class generalservice {
    constructor() { }

    public converPhoneGoogleLib(phonenumberFormat: string): string {

        let Assign;
        Assign = "";
       
          if (phonenumberFormat != "" && phonenumberFormat != undefined && phonenumberFormat != null && phonenumberFormat != " ") {

            phonenumberFormat = phoneUtil.parseAndKeepRawInput(phonenumberFormat, 'US');
            phonenumberFormat=phoneUtil.formatInOriginalFormat(phonenumberFormat, 'US');
           
            Assign =phonenumberFormat.charAt(phonenumberFormat.length-1);
            if (Assign >= 0) {
              phonenumberFormat = phoneUtil.parseAndKeepRawInput(phonenumberFormat, 'US');
              phonenumberFormat=phoneUtil.formatInOriginalFormat(phonenumberFormat, 'US')
            } else {
            setTimeout(() => {
              phonenumberFormat = phonenumberFormat.slice(0,phonenumberFormat.length-1);
            }, 250);
           
           }
            return phonenumberFormat;
        }
           else{
               return phonenumberFormat;
           }
          }
        
        
       
     

        // if (phonenumberFormat != "" && phonenumberFormat != undefined && phonenumberFormat != null) {
        //     phonenumberFormat = phonenumberFormat.slice(0, phonenumberFormat.length - 1);
        //     return phonenumberFormat;
        // }
        // else {
        //     return "";
        // }

    

    public reconverPhoneGoogleLib(Telephone: string): string {
        if (Telephone != null && Telephone != "") {
            var replacedData = Telephone.replace('-', "");
            replacedData = replacedData.replace('(', "");
            replacedData = replacedData.replace(')', "");
            replacedData = replacedData.replace(/\s/g, "");
            return replacedData;
        }
        else {
            return Telephone;
        }
    }

    public reconverPhoneGoogleLibhttpsave(Telephone: string): string {
        if(Telephone.length==10){
            Telephone='('+Telephone.slice(0,3)+') '+Telephone.slice(3,6)+'-'+Telephone.slice(6,10);           
           return Telephone;
        }
        else {
            return Telephone;
        }
    }
}