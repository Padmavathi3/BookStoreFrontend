import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book-service/book.service';
import { BookObj } from 'src/assets/booksInterface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  // @Input() BookObjList !:BookObj[]
  booksList:BookObj[]=[];
  searchString:string='';
  subscription!:Subscription

  constructor(private router:Router,private bookservice:BookService) { }

  ngOnInit(): void {
    this.bookservice.allBooksList.subscribe(res=>{this.booksList=res
      console.log("Books List:", JSON.stringify(this.booksList, null, 2));
    });
    //search pipe
    this.subscription=this.bookservice.currSearchString.subscribe(res=>this.searchString=res)
  }
  
  handleBook(book:BookObj){
    console.log(book.BookId);
     this.router.navigate(["/dashboard/bookdetails",book.BookId])

  }
}
