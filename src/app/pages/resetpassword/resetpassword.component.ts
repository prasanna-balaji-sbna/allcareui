import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from '../../global/global.component';
import { resetpasswordHTTPService } from './resetpassword.service';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { resetBO, updatepassBO } from './resetpassword.model';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  resendBO: resetBO = new resetBO();
  updatepass: updatepassBO = new updatepassBO();
  savepassprm: any = '';
  otp: any = '';
  np: any = '';
  cp: any = '';
  ForgetPassLoginForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  passerror1: boolean = false;
  passerror: boolean = false;

  constructor(private formBuilder: FormBuilder,public router:Router,
    public global: GlobalComponent, public httpService: resetpasswordHTTPService,
    public toastrService: ToastrService, public general: generalservice) { 
      this.ForgetPassLoginForm = this.formBuilder.group({
        OTP: ['', Validators.required],
        NP: ['', Validators.required],
        CP: ['', Validators.required],
      });
    }

  ngOnInit(): void {
  }

  close()
  {
    this.router.navigateByUrl('/login')
  }


  passvalid(event) {

    let str = event.target.value;
    let res;

    if (str.match(/[a-z]/g) && str.match(
      /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
          /[^a-zA-Z\d]/g) && str.length >= 8) {
      this.passerror = false;
    }
    else {
      this.passerror = true;
    }

  }

  passvalid1(event) {

    let str = event.target.value;
    let res;

    if (str.match(/[a-z]/g) && str.match(
      /[A-Z]/g) && str.match(
        /[0-9]/g) && str.match(
          /[^a-zA-Z\d]/g) && str.length >= 8) {
      this.passerror1 = false;
    }
    else {
      this.passerror1= true;
    }

  }

  confirmResendpassword(){
    this.resendBO = new resetBO()
    this.resendBO.email = this.global.ResendEmail;
    this.resendBO.agencycode = this.global.ResendAgencycode;
    this.httpService.resendPassword(this.resendBO).subscribe((data: any) => {
      console.log("====save update=========", data);
      if (data) {
        this.toastrService.success('Temporary password has been sent to your respective mail id',
        'Temporary password sent successfully'),8000;
        this.global.otp = data.otp;
        this.global.otpuserId = data.userId;
      }
    },(err: any) => {
      if(err){
        console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }
  
  confirmResetpassword(){
    this.submitted = true;
    if(this.otp == this.global.otp) 
    {
      if(this.np == this.cp)
      {
        this.updatepass = new updatepassBO();
        this.updatepass.Userid = Math.floor(Number(this.global.otpuserId));
        this.updatepass.password = this.np;
        this.httpService.resetPassword(this.updatepass).subscribe((data: any) => {
          console.log("====save update=========", data);
          // if (data) {
            this.toastrService.success('Password has been changed successfully',
            'Password changed'),8000;
            this.submitted=true;
            this.router.navigateByUrl('/login');
          // }
        },(err: any) => {
          if(err){
            console.log("err.error",err.error);
            this.toastrService.error(err.error,'Error'),8000;
          }
          })
      } else {
        this.toastrService.error('New password and confirm password not match','Error'),8000;
      }
    } else {
      this.toastrService.error('OTP not match','Error'),8000;
    }
  }

}
