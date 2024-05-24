import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpService: HttpService) { }

  addToWishlistApiCall(data: { bookId: any }, token?: string) {
    return this.httpService.addToWishlist("/Wishlist/AddToWishlist", data, token);
  }

  getAllWishlistApi(token?: string) {
    return this.httpService.getWishlist("/Wishlist/GetWishlist", token);
  }

  isBookInWishlist(bookId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAllWishlistApi().subscribe(res => {
        const bookInWishlist = res.data.some((item: { BookId: number }) => item.BookId === bookId);
        observer.next(bookInWishlist);
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

  removeBookFromWishlistCall(bookId: number) {
    return this.httpService.removeBookFromWishlistApi(`/Wishlist/RemoveFromWishlist/${encodeURIComponent(bookId)}`);
  }
}
