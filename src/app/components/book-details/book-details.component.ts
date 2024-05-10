import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {

  selectedBook!: BookObj;
  addedToBag:boolean=false;
  count:number=1;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.currentstate.subscribe(res => {
      this.selectedBook = res;
    });
    
  }

  addToBag() {
    this.addedToBag = true;
    this.bookService.addToCart(this.selectedBook);
  }

  increaseCount() {
    this.count++;
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
