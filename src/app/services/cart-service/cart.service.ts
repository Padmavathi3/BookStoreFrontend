import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BookObj } from 'src/assets/booksInterface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartObj=new BehaviorSubject<BookObj[]>([]);
  cartBooksList=this.cartObj.asObservable();

  constructor(private httpService: HttpService) { }
 
  getAllCartBooks(cartBooks:BookObj[])
  {
     this.cartObj.next(cartBooks)
  }

  addToCartApiCall(data: { bookId: any, quantity: any },token?:string) {
    return this.httpService.addToCartApi("/Cart/AddBookToCart", data,token);
  }

  getAllCartApiCall(token?:string) {
    return this.httpService.getAllCartApi("/Cart/GetAllcarts",token);
    }

    isBookInCart(bookId: number): Observable<boolean> {
      return new Observable(observer => {
        this.cartBooksList.subscribe(res => {
          const bookInCart = res.some((item: BookObj) => item.BookId !== undefined && item.BookId === bookId);
          observer.next(bookInCart);
          observer.complete();
        }, err => {
          observer.error(err);
        });
      });
    }
    

  removeBookFromCartCall(bookId: number) {
    return this.httpService.removebookFromCartApi(`/Cart/DeleteBook?bookId=${encodeURIComponent(bookId)}`);
  }

  updateQuantityCall(bookId: number, quantity: number,token?:string) {
    return this.httpService.updateQuantityApi(`/Cart/UpdateQuantity?bookId=${bookId}&quantity=${quantity}`,token);
  }

  clearCart() {
    this.cartObj.next([]);
  }
}
