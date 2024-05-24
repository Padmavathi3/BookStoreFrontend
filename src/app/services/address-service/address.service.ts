import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { AddressObj } from 'src/assets/addressInterface';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpService:HttpService) { }

  getAllCustomerAddressCall() {
    return this.httpService.getCustomerAddress("/Address/GetCustomerDetails");
  }

  addAddressCall(address:AddressObj)
  {
    return this.httpService.addAddressApi("/Address/AddAddress",address)
  }
  removeAddressCall(mobileNumber:number)
  {
    return this.httpService.removeAddressApi(`/Address/DeleteAddress/${mobileNumber}`)
  }
  editAddressCall(addressId:number,address:AddressObj)
  {
    return this.httpService.editAddressApi(`/Address/UpdateAddress/${addressId}`, address)
  }
}
