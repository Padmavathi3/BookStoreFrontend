import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject } from 'rxjs';
import { BookObj } from 'src/assets/booksInterface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookobj  =new BehaviorSubject<BookObj>({});
  currentstate=this.bookobj.asObservable();
  private cartItems:BookObj[]=[]

  constructor(private httpService:HttpService) { }

  getAllBooksCall()
  {
    return this.httpService.getAllBooksApi("/Books/GetAllBooks")
  }

  changeState(value:BookObj)
  {
    this.bookobj.next(value)
  }

  addToCart(book: BookObj) {
    this.cartItems.push(book);
  }

  removeFromCart(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item !== book);
  }

  getCartItems(): BookObj[] {
    return this.cartItems;
  }
}

