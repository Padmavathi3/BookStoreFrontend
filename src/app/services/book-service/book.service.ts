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
  changeState(value:BookObj)
  {
    this.bookobj.next(value)
  }

  constructor(private httpService:HttpService) { }

  getAllBooksCall()
  {
    return this.httpService.getAllBooksApi("/Books/GetAllBooks")
  }
}

