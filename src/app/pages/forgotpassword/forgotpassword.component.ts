import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalComponent } from '../../global/global.component';
import { forgotpasswordHTTPService } from './forgotpassword.service';
import { ToastrService } from 'ngx-toastr';
import { generalservice } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { resetBO } from './forgotpassword.model';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  reset: resetBO = new resetBO();
  uname:string="";
  agencycode:string="";
  forgotLoginForm: FormGroup;
  submitted:boolean=false;
  loading :boolean= false;

  constructor(private formBuilder: FormBuilder,public router:Router,
  public global: GlobalComponent, public httpService: forgotpasswordHTTPService,
  public toastrService: ToastrService, public general: generalservice) { }

  ngOnInit(): void {
    this.forgotLoginForm = this.formBuilder.group({
      uname: ['', Validators.required],
      agencycode: ['', Validators.required],
    });
  }

  confirmResetpassword(){
    this.reset = new resetBO();
    //console.log("this.uname",this.uname);
    //console.log("this.agencycode",this.agencycode);
    let saveList = new URLSearchParams();
    this.reset.email= this.uname;
    this.reset.agencycode= this.agencycode;
    //console.log("savelist",this.reset);
    this.httpService.resetPassword(this.reset).subscribe((data: any) => {
      //console.log("====save update=========", data);
      if (data) {
        this.toastrService.success('Temporary password has been sent to your respective mail id',
        'Temporary password sent successfully'),8000;
        this.global.otp = data.otp;
        this.global.otpuserId = data.userId;
        this.global.ResendEmail = this.uname;
        this.global.ResendAgencycode = this.agencycode;
        this.router.navigateByUrl('/reset-password');
      }
    },(err: any) => {
      if(err){
        //console.log("err.error",err.error);
        this.toastrService.error(err.error,'Error'),8000;
      }
      })
  }

  close()
  {
    this.router.navigateByUrl('/login')
  }

}
