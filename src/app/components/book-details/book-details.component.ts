import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { WishlistService } from 'src/app/services/wishlist-service/wishlist.service';
import { BookObj } from 'src/assets/booksInterface';
import {  YELLOW_STAR_ICON } from 'src/assets/svg-icons';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {

  selectedBook!: BookObj;
  addedToBag: boolean = false;
  count: number = 1;

  constructor(private bookService: BookService, private cartService: CartService,private wishlistService:WishlistService,private route:ActivatedRoute, private domSanitizer: DomSanitizer, 
    private matIconRegistry: MatIconRegistry) {
    matIconRegistry.addSvgIconLiteral("star-icon", domSanitizer.bypassSecurityTrustHtml(YELLOW_STAR_ICON));

   }

  ngOnInit(): void {
    this.bookService.allBooksList.subscribe(res1=>{    //Calls a service method to get a list of all books.
      this.route.params.subscribe(res2=>{                   //Subscribes to route parameters to get the current bookId.
        console.log(res2['bookId'])
       this.selectedBook= res1.filter((e:any)=>e.BookId==res2['bookId'])[0]   //filter the data
      })
    })

  }

  addToBag() {
    const isBookInLocalCart = this.bookService.isBookInLocalCart(this.selectedBook);

    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.isBookInCart(this.selectedBook.BookId || 0).subscribe(isBookInCart => {
        if (isBookInCart) {
          this.addedToBag = true;
          this.cartService.updateQuantityCall(this.selectedBook.BookId || 0, this.count).subscribe(res => {
            console.log(res);
          });
        } else {
          this.addedToBag = true;
          this.cartService.addToCartApiCall({ bookId: this.selectedBook.BookId, quantity: this.count }).subscribe(res => {
            console.log(res);
          });
        }
      });
    }
    else {
      if (isBookInLocalCart) {             //if book is true update quantity
        this.addedToBag = true;
        this.bookService.getCartItemQuantity(this.selectedBook.BookId || 0);
      } else {
        this.addedToBag = true;               //if book is false add new book
        this.selectedBook.Quantity = this.count;
        this.bookService.addToCart(this.selectedBook);
      }
    }
  }

  increaseCount() {
    if (this.selectedBook.BookId !== undefined) {
      this.count++;
      this.updateQuantity(this.selectedBook.BookId, this.count);
    }
  }

  decreaseCount() {
    if (this.count > 1) {
      if (this.selectedBook.BookId !== undefined) {
        this.count--;
        this.updateQuantity(this.selectedBook.BookId, this.count);
      }
    }
  }

  updateQuantity(bookId: number, quantity: number) {
    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.updateQuantityCall(bookId, quantity).subscribe(
        res => console.log('Quantity updated in cart', res),
        err => console.error('Error updating quantity in cart', err)
      );
    } else {
      this.bookService.updateLocalCartQuantity(bookId, quantity);
    }
  }

  addToWishlist() {
    if (this.bookService.isBookInWishlist(this.selectedBook)) {
      alert('This book is already present in the wishlist.');
    } 
    else {
      if (localStorage.getItem('AuthToken') !== null)
        {
          this.wishlistService.isBookInWishlist(this.selectedBook.BookId || 0).subscribe(isInWishlist => {
            if (isInWishlist) {
              alert('This book is already present in the wishlist.');
            } else {
              this.wishlistService.addToWishlistApiCall({ bookId: this.selectedBook.BookId }).subscribe(
                res => {
                  alert('Book added to wishlist successfully.');
                },
                err => {
                  console.error('Error adding book to wishlist', err);
                }
              );
            }
          });
        }
        else{
            this.bookService.addToWishlist(this.selectedBook);
             alert('Book added to wishlist successfully.');
        }
    }
  }
}
