import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    login(credenciales: { email: string; password: string }) {
        return this.http.post<any>(`${this.apiUrl}/login`, credenciales).pipe(
            tap(res => {
                localStorage.setItem('token', res.access_token);
                localStorage.setItem('role', res.user.role);
                localStorage.setItem('user_name', res.user.name);
                localStorage.setItem('user_email', res.user.email);
            })
        );
    }
}