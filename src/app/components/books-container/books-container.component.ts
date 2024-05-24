import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book-service/book.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-books-container',
  templateUrl: './books-container.component.html',
  styleUrls: ['./books-container.component.scss']
})
export class BooksContainerComponent implements OnInit {
  booksList: BookObj[] = []; 
  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.getAllBooksCall().subscribe(res => {
      console.log(res.data);
      this.booksList=[...res.data]
      //console.log(this.booksList+"fffffff");


      
    });
  }
}