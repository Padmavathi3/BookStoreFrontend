import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { BookObj } from 'src/assets/booksInterface';
import { LOCATION_ICON, SEARCH_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems:any[]=[]
  showOrderAddress: boolean = false;
  showOrderSummary: boolean = false;
  selectedBook: any = null;

  constructor(private bookService:BookService,private domSanitizer:DomSanitizer,private matIconRegistry:MatIconRegistry,private cartService:CartService,private router: Router,private dialog:MatDialog) { 
    matIconRegistry.addSvgIconLiteral("location-icon", domSanitizer.bypassSecurityTrustHtml(LOCATION_ICON))

  }

  ngOnInit(): void {
    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.getAllCartApi().subscribe(res=>{this.cartItems=res.data
        console.log(res)},err=>console.log(err))
    }
    else{
      this.cartItems = this.bookService.getCartItems();
    }
    }

    placeOrder(book: BookObj): void {
      this.selectedBook = book;
      if (!this.checkLoginStatus()) {
        console.log('User not logged in, opening login/signup dialog');
        const dialogRef = this.dialog.open(LoginSignupComponent, { width: '720px', height: '480px' });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (this.checkLoginStatus()) {
            this.handlePostLoginActions();
            dialogRef.close();
          }
        });
      } else {
        this.handlePostLoginActions();
      }
    }
    
    handlePostLoginActions(): void {
      const bookId = this.selectedBook.BookId || 0;
      const localQuantity = this.selectedBook.Quantity || 1;
    
      this.cartService.isBookInCart(bookId).subscribe(isBookInCart => {
        if (isBookInCart) {
          // Update quantity in the database
          this.cartService.updateQuantityCall(bookId, localQuantity).subscribe(
            res => {
              console.log('Quantity updated in database', res);
              this.showOrderAddress = true;
            },
            err => console.error('Error updating quantity in database', err)
          );
        } else {
          // Add book to the cart in the database
          this.cartService.addToCartApiCall({ bookId: bookId, quantity: localQuantity }).subscribe(
            res => {
              console.log('Book added to database', res);
              this.showOrderAddress = true;
            },
            err => console.error('Error adding book to database', err)
          );
        }
      });
    }
    
    
  checkLoginStatus(): boolean {
      return localStorage.getItem('AuthToken') !== null;
  }
    
    continueOrder(): void {
      this.showOrderAddress = false;
      this.showOrderSummary = true;
    }

    removeFromCart(book: BookObj) {
      const bookId = book.BookId; // Assuming bookId is the property name for the book identifier
      if (localStorage.getItem('AuthToken') !== null) {
        if (bookId !== undefined && bookId !== null) {
          this.cartService.removeBookFromCartCall(bookId).subscribe(
            res => {
              console.log(res);
              // Remove the book from the local cartItems array
              this.cartItems = this.cartItems.filter(item => item.BookId !== bookId);
            },
            err => {
              console.log(err);
            }
          );
        }
      } 
      else {
        this.bookService.removeFromCart(book);
        // Update cartItems after removing book
        this.cartItems = this.bookService.getCartItems();
      }
    }

    handleCheckOut(){
      this.router.navigate(["/dashboard/order"])
    }
}



