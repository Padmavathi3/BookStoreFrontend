import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddressService } from 'src/app/services/address-service/address.service';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { OrderService } from 'src/app/services/order-service/order.service';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist-service/wishlist.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  tempList: any;
  loginForm!: FormGroup;
  @Output() loginSuccess = new EventEmitter<void>();
  cartItems: any[] = [];
  tempWishlist: any;
  wishlistItems: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cartService: CartService,
    @Inject(MAT_DIALOG_DATA) public data: { val: string; cart: any },
    private bookService: BookService,
    private wishlistService: WishlistService,
    private orderService: OrderService,
    private addressService:AddressService
  ) {}

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
    //login
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.userService.loginCall(email, password).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('AuthToken', res.data);
        this.loginSuccess.emit();
        //all api call

        this.cartService.getAllCartApiCall().subscribe(res=>
          {
            console.log("get all cart books with login",JSON.stringify(res.data,null,2));  //api call
            this.cartService.getAllCartBooks(res.data);                                    //dataservice call
          } 
        );

        this.orderService.getOrdersCall().subscribe(res=>
          {
             console.log("get all order books with login",JSON.stringify(res.data,null,2));
             this.orderService.getAllOrders(res.data)
           
          }
        )
         
        this.wishlistService.getAllWishlistApiCall().subscribe(res=>
          {
            console.log("get all wishlist books with login",JSON.stringify(res.data,null,2));
            this.wishlistService.getAllWishlistBooks(res.data);
          }
        )

        this.addressService.getAllCustomerAddressCall().subscribe(res=>
          {
             console.log("get all address with login",JSON.stringify(res.data,null,2));
             this.addressService.getAllAddress(res.data);
          }
        )
        //wishlist
        if (localStorage.getItem('AuthToken') !== null) {
          this.compareDataInWishlist();
        } 
        else {
          console.log("data is not comparing");
        }

        //cart
        if (this.data.val == 'placeOrder') {
          this.cartItems = this.data.cart;
          this.tempList = this.cartItems;
          var v = localStorage.getItem('AuthToken') + '';
          this.cartService.getAllCartApiCall(v).subscribe((res) => {
            this.cartItems = res.data;
            this.updateCart(this.tempList, this.cartItems, v);
             window.location.reload();
          });
        }
      },
      (err) => console.log('Login error:', err)
    );
  }

  updateCart(temp: any, permanent: any, token?: any) {
    console.log("update cart");

    for (const itemA of temp) {
      const itemB = permanent.find((item: any) => item.BookId === itemA.BookId);
      if (itemB) {
        itemB.Quantity += itemA.Quantity;
        this.cartService
          .updateQuantityCall(itemB.BookId, itemB.Quantity, token)
          .subscribe((res) => console.log(res));
      } else {
        permanent.push(itemA);
        this.cartService
          .addToCartApiCall(
            { bookId: itemA.BookId, quantity: itemA.Quantity },
            token
          )
          .subscribe((res) => console.log(res));
      }
    }
    return permanent;
  }

  updateWishlist(temp: any, permanent: any, token: string) {
    console.log("update wishlist method ");

    for (const itemA of temp) {
      const itemB = permanent.find((item: any) => item.BookId === itemA.BookId);
      if (!itemB) {
        permanent.push(itemA);
        this.wishlistService.addToWishlistApiCall({ bookId: itemA.BookId }, token)
          .subscribe((res) => console.log(res));
      }
    }
    this.wishlistService.getAllWishlistBooks(permanent); // Update the wishlist observable with the new list
}

  compareDataInWishlist() {
    // wishlist
    this.tempWishlist = this.bookService.getWishlistItems();
    console.log("tempdata:", this.tempWishlist);

    var token = localStorage.getItem('AuthToken') + '';
    this.wishlistService.getAllWishlistApiCall(token).subscribe((res) => {
      this.wishlistItems = res.data;
      this.updateWishlist(this.tempWishlist, this.wishlistItems, token);
      console.log("Wishlist synchronized successfully");
    });
  }
}
