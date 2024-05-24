import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksContainerComponent } from './components/books-container/books-container.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookComponent } from './components/book/book.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { LoginSignupComponent } from './components/login-signup/login-signup.component';
import { OrderComponent } from './components/order/order.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

const routes: Routes = [
  { path: 'loginsignup', component: LoginSignupComponent },
  { path: 'dashboard', component: DashboardComponent, children: [
    { path: 'books', component: BooksContainerComponent },
    { path: 'bookdetails', component: BookDetailsComponent },
    { path: 'cart', component: CartComponent },
    {path: 'order/:addressId',component:OrderComponent},
    {path:'wishlist',component:WishlistComponent},
    {path:'orderdetails',component:OrderDetailsComponent}
  ]}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
