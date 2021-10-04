import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailValidators } from 'ngx-validators';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent  {
  public router: Router;
    public form:FormGroup;
    public email:AbstractControl;
    public password:AbstractControl;
    public confirmPassword:AbstractControl;
    reset:boolean;
    otp:boolean;
    constructor(router:Router, fb:FormBuilder,private ref: ChangeDetectorRef){
      // ref.detach();
      // setInterval(() => {
      //   this.ref.detectChanges();
      // }, 10);
        this.router = router;
        this.form = fb.group({
           
            email: ['', Validators.compose([Validators.required, emailValidator])],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        },{validator: matchingPasswords('password', 'confirmPassword')});

   
        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
        this.confirmPassword = this.form.controls['confirmPassword'];
    }

     public onSubmit(values:Object):void {
        if (this.password.valid && this.confirmPassword.valid) {
            console.log(values);
            this.router.navigate(['/login']);
        }
    }

    ngAfterViewInit(){
        document.getElementById('preloader').classList.add('hide');
    }
    Reset()
    {
      if(this.email.valid)
      {
        this.reset=true;
      }
    }
    Otp()
    {
this.otp=true;
    }
    moveFocus(nextElement) {
      nextElement.focus();
    }
}

export function emailValidator(control: FormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
       if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }

  }
 