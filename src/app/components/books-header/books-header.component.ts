import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SEARCH_ICON, PROFILE_ICON, CART_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { HttpService } from 'src/app/services/http-service/http.service';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { OrderService } from 'src/app/services/order-service/order.service';
import { WishlistComponent } from '../wishlist/wishlist.component';
import { WishlistService } from 'src/app/services/wishlist-service/wishlist.service';
import { AddressService } from 'src/app/services/address-service/address.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-books-header',
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.scss']
})
export class BooksHeaderComponent implements OnInit {
  isLoggedIn: boolean = true;
  cartItems: any[] = [];
  subscription!:Subscription
  searchString:string=''

  constructor(
    private domSanitizer: DomSanitizer, 
    private matIconRegistry: MatIconRegistry, 
    private dialog: MatDialog, 
    private router: Router,
    private bookService:BookService,
    private cartService:CartService,
    private orderService:OrderService,
    private wishlistService:WishlistService,
    private addressService:AddressService) 
    {
    matIconRegistry.addSvgIconLiteral("search-icon", domSanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    matIconRegistry.addSvgIconLiteral("profile-icon", domSanitizer.bypassSecurityTrustHtml(PROFILE_ICON));
    matIconRegistry.addSvgIconLiteral("cart-icon", domSanitizer.bypassSecurityTrustHtml(CART_ICON));
  }

  ngOnInit(): void {
    this.bookService.getAllBooksCall().subscribe(res=>
      {
        console.log("get all bokks api result",JSON.stringify(res.data,null,2));  
        this.bookService.getAllBooks(res.data);
      }
    )
    //after login operations
    if(localStorage.getItem('AuthToken')!==null)
      {
        this.isLoggedIn=false   //to rerender loin and logout buttons
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
      }
    else{
      this.isLoggedIn=true
    }
  }
  
  login() {
    const dialogRef = this.dialog.open(LoginSignupComponent, { width: '720px', height: '480px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      window.location.reload();
      
    });
  }

  logOut() {
    // Clear the authentication token or any login state
    localStorage.removeItem('AuthToken');
    // if(localStorage.getItem('AuthToken')==null)
    //   {
    //     this.cartService.cartBooksList.subscribe(res=>
    //       {
    //         this.cartItems=[];
    //         console.log("cart list",JSON.stringify(this.cartItems, null, 2));     
    //       })
    //     this.cartItems=[];
    //     this.cartService.clearCart();
    //     this.isLoggedIn=false;
    //   }
    window.location.reload();
  }

  handleCart() {
    this.router.navigate(["/dashboard/cart"]);
  }
  handleWishlist(){
    this.router.navigate(["/dashboard/wishlist"]);
  }
  handleOrderDetails(){
    this.router.navigate(["/dashboard/orderdetails"]);
  }

  handleSearchString(){
    this.bookService.updateSearchString(this.searchString)
 }
 ngOnDestroy(): void {
   this.subscription.unsubscribe()
 }
}
