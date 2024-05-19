import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @Output() loginSuccess = new EventEmitter<void>();
  cartItems:any[]=[]
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router,private cartService:CartService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get loginControl() {
    return this.loginForm.controls;
  }
  handleLogin() {
    if (this.loginForm.invalid) return;
  
    const { email, password } = this.loginForm.value;
  
    this.userService.loginCall(email, password).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('AuthToken', res.data);
        this.loginSuccess.emit();
  
        // After login success, navigate to the cart component
        //this.router.navigate(['/dashboard/cart']);
  
        // Subscribe to getAllCartApi to fetch the updated cart list
        this.cartService.getAllCartApi().subscribe(
          (res) => {
            this.cartItems = res.data;
            console.log('Updated cart items:', this.cartItems);
          },
          (err) => console.error('Error fetching cart items:', err)
        );
      },
      (err) => console.log('Login error:', err)
    );
  }
  
}
