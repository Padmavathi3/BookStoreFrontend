import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BookObj } from 'src/assets/booksInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpService: HttpService) { }

  addToCartApiCall(data: { bookId: any, quantity: any },token?:string) {
    return this.httpService.addToCartApi("/Cart/AddBookToCart", data,token);
  }

  getAllCartApi(token?:string) {
    return this.httpService.getAllCartApi("/Cart/GetAllcarts",token);
    }

  isBookInCart(bookId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAllCartApi().subscribe(res => {
        const bookInCart = res.data.some((item: { BookId: number }) => item.BookId === bookId);
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
}
