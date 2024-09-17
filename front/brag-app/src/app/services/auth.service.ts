import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/user';

    constructor(private http: HttpClient) { }

    login(userData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login`, userData);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/forgotPassword`, { email });
    }

    resetPassword(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/resetPassword`, data);
    }


}
