import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookComponent } from './components/book/book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,children:[
     {path:'books',component:BooksContainerComponent},
     {path:'bookdetails',component:BookDetailsComponent},
     {path:'cart',component:CartComponent}]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
