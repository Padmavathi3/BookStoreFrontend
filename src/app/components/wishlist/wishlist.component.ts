import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { log } from 'console';
import { BookService } from 'src/app/services/book-service/book.service';
import { WishlistService } from 'src/app/services/wishlist-service/wishlist.service';
import { BookObj } from 'src/assets/booksInterface';
import { DELETE_FOREVER_ICON } from 'src/assets/svg-icons';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: BookObj[] = [];

  constructor(private bookService: BookService, private wishlistService: WishlistService,private domSanitizer: DomSanitizer, 
    private matIconRegistry: MatIconRegistry) {
      matIconRegistry.addSvgIconLiteral("delete-icon", domSanitizer.bypassSecurityTrustHtml(DELETE_FOREVER_ICON));
    }

  ngOnInit(): void {
    if (localStorage.getItem('AuthToken') !== null) {
      // this.wishlistService.getAllWishlistApi().subscribe(res => {
      //   this.wishlistItems = res.data;
      // }, err => {
      //   console.error('Error fetching wishlist', err);
      // });

      this.wishlistService.wishlistList.subscribe(res=>
        {
          this.wishlistItems=res;
          console.log("wishlist books",JSON.stringify(res,null,2));
          
        }
      )
    } 
    else {
      this.wishlistItems = this.bookService.getWishlistItems();
    }
  }

  removeFromWishlist(book: BookObj) {
    if (localStorage.getItem('AuthToken') !== null) {
      this.wishlistService.removeBookFromWishlistCall(book.BookId || 0).subscribe(res => {
        console.log(res);
        this.wishlistItems = this.wishlistItems.filter(item => item.BookId !== book.BookId);
      }, err => {
        console.error('Error removing book from wishlist', err);
      });
    } else {
      this.bookService.removeFromWishlist(book);
      this.wishlistItems = this.bookService.getWishlistItems();
    }
  }
}
