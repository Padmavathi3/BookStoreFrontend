import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistObj=new BehaviorSubject<any[]>([]);
  wishlistList=this.wishlistObj.asObservable();
  constructor(private httpService: HttpService) { }

  getAllWishlistBooks(wishlistbooks:any[])
    {
      this.wishlistObj.next(wishlistbooks)
    }
  

  addToWishlistApiCall(data: { bookId: any }, token?: string) {
    return this.httpService.addToWishlist("/Wishlist/AddToWishlist", data, token);
  }

  getAllWishlistApiCall(token?: string) {
    return this.httpService.getWishlist("/Wishlist/GetWishlist", token);
  }

  isBookInWishlist(bookId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAllWishlistApiCall().subscribe(res => {
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
