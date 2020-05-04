import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Admin } from 'src/app/models/admin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: string = environment.adminUri;
  loginUrl: string = environment.adminLoginUri;
  verifyCodeUrl: string = environment.verificationCodeUri;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) { }

  getAllAdmins() {
		return this.http.get<Admin[]>(this.url);
  }

  adminLogin(adminLoginObject): Observable<boolean> {
    return this.http.post<boolean>(
      this.loginUrl,
      adminLoginObject,
      this.httpOptions
    );
  }

  adminVerificationSubmission(adminLoginObject): Observable<Admin> {
    return this.http.post<Admin>(
      this.verifyCodeUrl,
      adminLoginObject,
      this.httpOptions
    );
  }

}
