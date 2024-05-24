import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject } from 'rxjs';
import { BookObj } from 'src/assets/booksInterface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookobj = new BehaviorSubject<BookObj>({});
  currentstate = this.bookobj.asObservable();
  private cartItems: BookObj[] = [];
  private wishlistItems: BookObj[] = [];

  constructor(private httpService: HttpService) { }

  getAllBooksCall() {
    return this.httpService.getAllBooksApi("/Books/GetAllBooks");
  }

  changeState(value: BookObj) {
    this.bookobj.next(value);
  }

  // Cart methods
  addToCart(book: BookObj) {
    this.cartItems.push(book);
  }

  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item !== book);
  }

  getCartItems(): BookObj[] {
    return this.cartItems;
  }

  isBookInLocalCart(book: BookObj): boolean {
    return this.cartItems.some(item => item.BookId === book.BookId);
  }

  getCartItemQuantity(bookId: number): number {
    const book = this.cartItems.find(item => item.BookId === bookId);
    return book && book.Quantity !== undefined ? book.Quantity : 1;
  }

  updateLocalCartQuantity(bookId: number, quantity: number) {
    const book = this.cartItems.find(item => item.BookId === bookId);
    if (book) {
      book.Quantity = (book.Quantity || 0) + quantity;
    }
  }

  // Wishlist methods
  getWishlistItems(): BookObj[] {
    return this.wishlistItems;
  }

  isBookInWishlist(book: BookObj): boolean {
    return this.wishlistItems.some(item => item.BookId === book.BookId);
  }

  addToWishlist(book: BookObj) {
    this.wishlistItems.push(book);
  }

  removeFromWishlist(book: BookObj) {
    this.wishlistItems = this.wishlistItems.filter(item => item !== book);
  }
}
