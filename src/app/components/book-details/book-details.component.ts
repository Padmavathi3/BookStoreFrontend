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

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.currentstate.subscribe(res => {
      this.selectedBook = res;
    });
    this.bookService.currentstate.subscribe(res=>console.log(res));
    
  }
}
