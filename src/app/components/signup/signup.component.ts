import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private userService:UserService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[6789]{1}[0-9]{9}$')]]
    });
  }

  get signupControl() 
     {
      return this.signupForm.controls; 
    }
  
    handleSignup(){
      if (this.signupForm.invalid) return;
       // Extract form values
       const { fullName, email, password, mobileNumber } = this.signupForm.value;
        // Create user data object
    const userData = {
      name : fullName,
      email,
      password,
      mobileNumber
    };

    // Call signup service to create the account
    this.userService.signupCall(userData).subscribe(
      (res) => {
        console.log(res);
        // Assuming the token is returned in the response
        const token = res.token
      
              },
      (err)=>console.log(err))
  }
}
