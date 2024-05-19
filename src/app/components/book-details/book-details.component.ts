import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {

  selectedBook!: BookObj;
  addedToBag: boolean = false;
  count: number = 1;

  constructor(private bookService: BookService, private cartService: CartService) { }

  ngOnInit(): void {
    this.bookService.currentstate.subscribe(res => {
      this.selectedBook = res;
      // Set count to current quantity if book is in cart
      if (this.bookService.isBookInLocalCart(this.selectedBook)) {
        this.count = this.bookService.getCartItemQuantity(this.selectedBook.BookId||0);
        this.addedToBag=true;
      }
      else{
        this.addedToBag=false
      }
    });
  }

  addToBag() {
    const isBookInLocalCart = this.bookService.isBookInLocalCart(this.selectedBook);

    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.isBookInCart(this.selectedBook.BookId || 0).subscribe(isBookInCart => {
        if (isBookInCart) {
          this.addedToBag = true;
          this.bookService.getCartItemQuantity(this.selectedBook.BookId || 0);
        } 
        else {
          this.addedToBag = true;
          this.cartService.addToCartApiCall({ bookId: this.selectedBook.BookId, quantity: this.count }).subscribe(res => {
            console.log(res);
          });
        }
      });
    } 
    else {
      if (isBookInLocalCart) {
        this.addedToBag=true;
        this.bookService.getCartItemQuantity(this.selectedBook.BookId || 0);
      } 
      else {
        this.addedToBag = true;
        this.selectedBook.Quantity=this.count
        this.bookService.addToCart(this.selectedBook);
      }
    }
  }

  increaseCount() {
    if(this.selectedBook.BookId !== undefined) {
      this.count++;
      this.updateQuantity(this.selectedBook.BookId, 1);
    }
  }

  decreaseCount() {
    if (this.count > 1) {
      if (this.selectedBook.BookId !== undefined) {
        this.count--;
        this.updateQuantity(this.selectedBook.BookId, -1);
      }
    }
  }

  updateQuantity(bookId: number, quantity: number) {
    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.updateQuantityCall(bookId, quantity).subscribe(
        res => console.log('Quantity updated in cart', res),
        err => console.error('Error updating quantity in cart', err)
      );
    }
    else {
      this.bookService.updateLocalCartQuantity(bookId, quantity);
    }
  }
}
