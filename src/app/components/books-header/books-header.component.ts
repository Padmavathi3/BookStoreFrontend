import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SEARCH_ICON, PROFILE_ICON, CART_ICON } from 'src/assets/svg-icons';
import { LoginSignupComponent } from '../login-signup/login-signup.component';

@Component({
  selector: 'app-books-header',
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.scss']
})
export class BooksHeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry, private dialog: MatDialog, private router: Router) {
    matIconRegistry.addSvgIconLiteral("search-icon", domSanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    matIconRegistry.addSvgIconLiteral("profile-icon", domSanitizer.bypassSecurityTrustHtml(PROFILE_ICON));
    matIconRegistry.addSvgIconLiteral("cart-icon", domSanitizer.bypassSecurityTrustHtml(CART_ICON));
  }

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('AuthToken');
  }

  login() {
    const dialogRef = this.dialog.open(LoginSignupComponent, { width: '720px', height: '480px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.isLoggedIn = !!localStorage.getItem('AuthToken'); // Check token again after login dialog closes
    });
  }

  logout() {
    // Clear the authentication token or any login state
    localStorage.removeItem('AuthToken');
    this.isLoggedIn = false;
  }

  handleCart() {
    this.router.navigate(["/dashboard/cart"]);
  }
}
