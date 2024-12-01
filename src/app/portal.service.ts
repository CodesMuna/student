import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PortalService {
  private url = 'http://localhost:8000/api/';
  token = localStorage.getItem('token')

  constructor(private http: HttpClient) { }

  signup(data: any){
    console.log(data);
    return this.http.post(this.url + 'signup', data);
  }

  enrollmentLogin(eldata: any){
    return this.http.post(this.url + 'enrollmentLogin', eldata);
  }

  getStudentEnrollment(sid: any){
    return this.http.get(this.url + 'getStudentEnrollment', {params: {sid: sid}});
  }

  getStudentPayment(sid: any){
    return this.http.get(this.url + 'getStudentPayment', {params: {sid: sid}});
  }

  personalDetails(pdata: any){
    return this.http.post(this.url + 'personalDetails', pdata);
  }

  enrollmentDetails(edata: any){
    return this.http.post(this.url + 'enrollmentDetails', edata);
  }
  
  // uploadImage(formData: FormData) {
  //   return this.http.post(this.url + 'upload-image', formData);
  // }

  uploadPayment(formData: any) {
    return this.http.post(this.url + 'upload-payment', formData);
  }

}
