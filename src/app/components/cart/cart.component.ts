import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book-service/book.service';
import { CartService } from 'src/app/services/cart-service/cart.service';
import { AddressService } from 'src/app/services/address-service/address.service';
import { BookObj } from 'src/assets/booksInterface';
import { LOCATION_ICON } from 'src/assets/svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { LoginSignupComponent } from '../login-signup/login-signup.component';
import { AddressObj } from 'src/assets/addressInterface';
import { OrderService } from 'src/app/services/order-service/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  AddNewAddress: boolean = false;
  showOrderSummary: boolean = false;
  selectedBook: BookObj | null = null;
  customerAddresses: AddressObj[] = [];
  showAddressDetails: boolean = false;
  orderAddress!: AddressObj;
  count:number=1;
  addressForm: FormGroup;
  isEditing: boolean = false;
  editingAddressId: number | null = null;

  constructor(
    private bookService: BookService,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private cartService: CartService,
    private router: Router,
    private dialog: MatDialog,
    private addressService: AddressService,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    matIconRegistry.addSvgIconLiteral("location-icon", domSanitizer.bypassSecurityTrustHtml(LOCATION_ICON));
    this.addressForm = this.fb.group({
      CustomerName: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      FullAddress: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.checkLoginStatus()) {
      // this.cartService.getAllCartApi().subscribe(
      //   res => this.cartItems = res.data,
      //   err => console.error(err)
      // );
      this.cartService.cartBooksList.subscribe(res=>
        {
          this.cartItems=res;
          console.log("cart list",JSON.stringify(this.cartItems, null, 2));     
        }
    )
    } 
    else {
      this.cartItems = this.bookService.getCartItems();
    }
  }
 
  increaseCount(bookId: number) {
    const selectedItem = this.cartItems.find(item => item.BookId === bookId);
    if (selectedItem) {
      selectedItem.Quantity++;
      this.updateQuantity(selectedItem);
      this.selectedBook = selectedItem; // Update selectedBook
    }
  }

  decreaseCount(bookId: number) {
    const selectedItem = this.cartItems.find(item => item.BookId === bookId);
    if (selectedItem && selectedItem.Quantity > 1) {
      selectedItem.Quantity--;
      this.updateQuantity(selectedItem);
      this.selectedBook = selectedItem; // Update selectedBook
    }
  }

  updateQuantity(item: any) {
    this.cartService.updateQuantityCall(item.BookId, item.Quantity).subscribe(
      res => console.log('Quantity updated in cart', res),
      err => console.error('Error updating quantity in cart', err)
    );
  }
 
  placeOrder1()
  {
    if (!this.checkLoginStatus()) {
      const dialogRef = this.dialog.open(LoginSignupComponent, { data: { val: 'placeOrder', cart: this.cartItems } });
      dialogRef.afterClosed().subscribe(result => {
        if (this.checkLoginStatus()) {
          dialogRef.close();
        }
      });
    } 
    else{
    this.addressService.addressList.subscribe(
      res => {
        this.customerAddresses = res;
        this.showAddressDetails = true;
      },
      err => {
        console.error(err);
        this.customerAddresses = [];
        this.showAddressDetails = true;
      }
    ); 
  } 
  }
  // placeOrder(book: BookObj): void {
  //   this.selectedBook = book;
  //   console.log('Selected book set:', this.selectedBook);
  //   if (!this.checkLoginStatus()) {
  //     const dialogRef = this.dialog.open(LoginSignupComponent, { data: { val: 'placeOrder', cart: this.cartItems } });
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (this.checkLoginStatus()) {
  //         dialogRef.close();
  //       }
  //     });
  //   } 
  //   else {
  //     this.addressService.addressList.subscribe(
  //       res => {
  //         this.customerAddresses = res;
  //         this.showAddressDetails = true;
  //       },
  //       err => {
  //         console.error(err);
  //         this.customerAddresses = [];
  //         this.showAddressDetails = true;
  //       }
  //     );
  //   }
  // }

  checkLoginStatus(): boolean {
    return localStorage.getItem('AuthToken') !== null;
  }

  continueOrder(): void {
    if (this.addressForm.valid) {
        const newAddress: AddressObj = this.addressForm.value;

        if (this.isEditing && this.editingAddressId !== null) {
            // Ensure editingAddressId is a number
            const updatedAddress: AddressObj = { ...newAddress, AddressId: this.editingAddressId };
            this.addressService.editAddressCall(this.editingAddressId, updatedAddress).subscribe(
                res => {
                    // Update the address in the local list
                    const index = this.customerAddresses.findIndex(addr => addr.AddressId === this.editingAddressId);
                    if (index !== -1) {
                        this.customerAddresses[index] = updatedAddress;
                    }
                    this.resetAddressForm();
                },
                err => console.error(err)
            );
        } 
        else {
            // Adding new address
            this.addressService.addAddressCall(newAddress).subscribe(
                res => {
                  this.customerAddresses.push(newAddress);
                  this.resetAddressForm();
                },
                err => console.error(err)
            );    
        }
    }
}


  resetAddressForm(): void {
    this.AddNewAddress = false;
    this.showOrderSummary = true;
    this.showAddressDetails = true;
    this.isEditing = false;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  editAddress(address: AddressObj): void {
    this.isEditing = true;
    this.editingAddressId = address.AddressId;
    this.AddNewAddress = true;
    this.addressForm.patchValue(address);
  }

  removeFromCart(book: BookObj): void {
    const bookId = book.BookId;
    if (this.checkLoginStatus()) {
      if (bookId !== undefined && bookId !== null) {
        this.cartService.removeBookFromCartCall(bookId).subscribe(
          res => {
            console.log(res);
            this.cartItems = this.cartItems.filter(item => item.BookId !== bookId);
          },
          err => console.error(err)
        );
      }
    } else {
      this.bookService.removeFromCart(book);
      this.cartItems = this.bookService.getCartItems();
    }
  }

  removeAddress(mobileNumber: number): void {
    this.addressService.removeAddressCall(mobileNumber).subscribe(
      res => {
        console.log(res);
        this.customerAddresses = this.customerAddresses.filter(address => address.MobileNumber == mobileNumber);
      },
      err => console.error(err)
    );
  }

  continueWithAddress(address: AddressObj): void {
    this.orderAddress = address;
    console.log('Order address set:', this.orderAddress);
    this.showOrderSummary = true;
  }

  handleCheckOut(): void {
    console.log('Selected book:', this.selectedBook);
    console.log('Order address:', this.orderAddress);
    if (this.cartItems.length && this.orderAddress && this.orderAddress.AddressId) {
      const orderDetails = this.cartItems.map(item => ({
        bookId: item.BookId,
        addressId: this.orderAddress.AddressId,
        orderDate: new Date().toISOString()
      }));

      orderDetails.forEach(order => {
        this.orderService.addOrderCall(order).subscribe(
          res => {
            console.log(res);
            this.router.navigate(["/dashboard/order", this.orderAddress.AddressId]);
          },
          err => {
            console.error(err);
          }
        );
      });
    } else {
      console.error('Cart is empty or address not selected.');
    }
  }

}